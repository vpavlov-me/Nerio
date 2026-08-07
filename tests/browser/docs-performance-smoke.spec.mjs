import { expect, test } from "@playwright/test";
import { measureRoute } from "./performance-helpers.mjs";

const searchResponseBudgetMs = 1_000;
const documentationRoutes = [
  "/",
  "/docs/getting-started",
  "/docs/components/button",
  "/docs/components/select",
  "/docs/components/calendar",
  "/docs/components/date-picker",
  "/docs/components/command-primitive",
  "/templates",
];

for (const route of documentationRoutes) {
  test(`${route} stays within measured performance and resilience budgets`, async ({
    page,
  }, testInfo) => {
    await measureRoute(page, route, testInfo);
  });
}

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

  await page.goto("/docs/getting-started", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Search documentation" }).click();
  const input = page.getByRole("combobox", { name: "Search documentation" });
  const started = Date.now();
  await input.fill("Button");
  await expect(page.getByRole("option", { name: /^Button / }).first()).toBeVisible();
  expect(Date.now() - started).toBeLessThanOrEqual(searchResponseBudgetMs);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
