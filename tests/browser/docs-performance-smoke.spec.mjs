import { expect, test } from "@playwright/test";

const searchResponseBudgetMs = 1_000;

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
});

test("keeps documentation search responsive", async ({ page }) => {
  const externalRequests = [];
  const errors = [];
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
      if (url.hostname === "mc.yandex.ru") {
        await route.fulfill({ status: 204 });
        return;
      }
      externalRequests.push(url.href);
      await route.abort();
      return;
    }
    await route.continue();
  });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/docs/getting-started");
  await page.getByRole("button", { name: "Search documentation" }).click();
  const input = page.getByRole("combobox", { name: "Search documentation" });
  const started = Date.now();
  await input.fill("Button");
  await expect(page.getByRole("option", { name: /^Button / }).first()).toBeVisible();
  expect(Date.now() - started).toBeLessThanOrEqual(searchResponseBudgetMs);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
