import { expect, test } from "@playwright/test";

const searchResponseBudgetMs = 1_000;

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
});

test("keeps documentation search responsive", async ({ page }) => {
  await page.goto("/docs/getting-started");
  await page.getByRole("button", { name: "Search documentation" }).click();
  const input = page.getByRole("combobox", { name: "Search documentation" });
  const started = Date.now();
  await input.fill("Button");
  await expect(page.getByRole("option", { name: /^Button / }).first()).toBeVisible();
  expect(Date.now() - started).toBeLessThanOrEqual(searchResponseBudgetMs);
});
