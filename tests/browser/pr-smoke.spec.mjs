import { expect, test } from "@playwright/test";

const healthStabilityWindowMs = 250;
const workspaceRoute = "/views/operations-workspace";

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
});

function monitorPage(page) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`page: ${error.message}`));
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "failed";
    if (errorText !== "net::ERR_ABORTED") {
      problems.push(`request: ${request.url()} (${errorText})`);
    }
  });
  return problems;
}

async function expectHealthyPage(page, problems) {
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  await page.waitForTimeout(healthStabilityWindowMs);
  expect(problems).toEqual([]);
}

test("loads the homepage, docs, and a component page without runtime errors", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/docs/getting-started");
  await expect(page.getByRole("heading", { name: "Getting started" })).toBeVisible();
  await page.goto("/docs/components/button");
  await expect(page.getByRole("main")).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps documentation actions attached and inside DropdownMenu slots", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/kbd");
  const group = page.getByRole("group", { name: "Documentation actions" });
  const buttonRadii = await group.evaluate((element) =>
    Array.from(element.querySelectorAll(":scope > .n-button")).map((button) => {
      const styles = getComputedStyle(button);
      return {
        startStart: styles.borderStartStartRadius,
        startEnd: styles.borderStartEndRadius,
      };
    }),
  );
  expect(buttonRadii).toHaveLength(2);
  expect(buttonRadii[0]).toEqual({ startStart: "20px", startEnd: "0px" });
  expect(buttonRadii[1]).toEqual({ startStart: "0px", startEnd: "20px" });

  await group.getByRole("button", { name: "Open page actions" }).click();
  const menu = page.getByRole("menu", { name: "Open page actions" });
  await expect(menu).toBeVisible();
  await expect(menu.locator('[data-slot="leading-icon"]')).toHaveCount(5);
  await expect(menu.locator('[data-slot="description"]')).toHaveCount(5);
  await expect(menu.locator('[data-slot="trailing-icon"]')).toHaveCount(2);
  await expect(menu.locator(".docs-action-item")).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "View as Markdown" })).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps a keyboard-opened Dialog contained and restores focus", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/visual-test/blocks/overlay-playground");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Long review notes" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expectHealthyPage(page, problems);
});

test("validates and completes a representative Core form", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/finance-assets");
  await page.getByRole("button", { name: "Transfer" }).click();
  const dialog = page.getByRole("dialog", { name: "New transfer" });
  await dialog.getByRole("button", { name: "Review transfer" }).click();
  await expect(dialog.getByText("Enter an amount greater than zero.")).toBeVisible();
  await dialog.getByRole("textbox", { name: "Amount" }).fill("1200");
  await dialog.getByRole("button", { name: "Review transfer" }).click();
  await expect(page.getByRole("dialog", { name: "Review transfer" })).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps the Operations Workspace responsive and keyboard-safe", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(workspaceRoute);
  const trigger = page.getByRole("button", { name: "Open workspace navigation" });
  await trigger.click();
  const navigation = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await navigation.evaluate((element) => element.contains(document.activeElement))).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await expectHealthyPage(page, problems);
});

test("opens mobile documentation navigation and follows a route", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/getting-started");
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Documentation" });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Visual language" }).click();
  await expect(page).toHaveURL(/\/docs\/foundations\/visual-language$/);
  await expectHealthyPage(page, problems);
});

test("preserves RTL and reduced motion in a product composition", async ({ page }) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(workspaceRoute);
  await page.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  await expectHealthyPage(page, problems);
});

test("keeps DatePicker keyboard selection and form value aligned", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/date-picker");
  const trigger = page.getByRole("button", { name: "Release date" });
  await trigger.press("Enter");
  const calendar = page.getByRole("group", { name: "Choose date" });
  await expect(calendar.getByRole("button", { name: "June 15, 2026, Selected" })).toBeFocused();
  await calendar.getByRole("button", { name: "June 16, 2026" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator('input[name="releaseDate"]')).toHaveValue("2026-06-16");
  expect(await page.locator("form").evaluate((form) => new FormData(form).get("releaseDate"))).toBe(
    "2026-06-16",
  );
  await expectHealthyPage(page, problems);
});
