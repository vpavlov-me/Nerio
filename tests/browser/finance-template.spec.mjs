import { expect, test } from "@playwright/test";

const financeRoute = "/views/finance-assets";

function monitorPage(page) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`page: ${error.message}`));
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "failed";
    if (errorText !== "net::ERR_ABORTED") problems.push(`request: ${request.url()} (${errorText})`);
  });
  return problems;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
});

test("connects portfolio navigation, holdings filters, detail, and semantic transaction states", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(financeRoute);

  await expect(page.getByRole("heading", { level: 2, name: "Portfolio movement" })).toBeVisible();
  await page.getByRole("button", { name: "3M" }).click();
  await expect(page.getByRole("button", { name: "3M" })).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: "Holdings" }).click();
  await page.getByRole("textbox", { name: "Search holdings" }).fill("treasury");
  await expect(page.getByRole("row", { name: /Short treasury fund/ })).toBeVisible();
  await page.getByRole("row", { name: /Short treasury fund/ }).click();
  await expect(page.getByRole("heading", { name: "Short treasury fund" })).toBeVisible();

  await page.getByRole("textbox", { name: "Search holdings" }).fill("not an asset");
  await expect(page.getByRole("heading", { name: "No holdings found" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();

  await page.getByRole("button", { name: "Transactions" }).click();
  await page.getByRole("combobox", { name: "Transaction status" }).click();
  await page.getByRole("option", { name: "Failed" }).click();
  await expect(page.getByText("Vendor transfer")).toBeVisible();
  expect(problems).toEqual([]);
});

test("validates and completes the deterministic transfer while restoring focus", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto(financeRoute);

  const trigger = page.getByRole("button", { name: "Transfer" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "New transfer" });
  await dialog.getByRole("button", { name: "Review transfer" }).click();
  await expect(dialog.getByText("Enter an amount greater than zero.")).toBeVisible();
  await dialog.getByRole("textbox", { name: "Amount" }).fill("1200");
  await dialog.getByRole("button", { name: "Review transfer" }).click();
  await expect(page.getByRole("dialog", { name: "Review transfer" })).toBeVisible();
  await page.getByRole("button", { name: "Confirm transfer" }).click();
  await expect(page.getByRole("dialog", { name: "Transfer scheduled" })).toBeVisible();
  await page.getByRole("button", { name: "Done" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator(".n-toast--managed")).toContainText("Transfer scheduled");
  expect(problems).toEqual([]);
});

test("supports balance privacy, mobile navigation, runtime axes, RTL, and reflow", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(financeRoute);

  await page.getByRole("button", { name: "Hide balances" }).click();
  await expect(page.getByRole("heading", { name: "Balance hidden" })).toBeVisible();

  const navigationTrigger = page.getByRole("button", { name: "Open finance navigation" });
  await navigationTrigger.click();
  await page
    .getByRole("dialog", { name: "Finance navigation" })
    .getByRole("button", { name: "Settings" })
    .click();
  await page.keyboard.press("Escape");

  await page.getByRole("combobox", { name: "Mode" }).click();
  await page.getByRole("option", { name: "Dark" }).click();
  await page.getByRole("combobox", { name: "Density" }).click();
  await page.getByRole("option", { name: "Compact" }).click();
  await page.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});
