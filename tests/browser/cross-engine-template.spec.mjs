import { expect, test } from "@playwright/test";
import { openMobilePreviewSettings } from "./helpers/template-preview-settings.mjs";

const workspaceRoute = "/views/operations-workspace";

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
});

test("preserves keyboard focus, modal restoration, table overflow, and native form behavior", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(workspaceRoute);

  const rail = page.locator('[data-slot="sidebar-rail"]');
  await rail.focus();
  await expect(rail).toBeFocused();
  await rail.press("Enter");
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-state",
    "collapsed",
  );
  await rail.press("Enter");

  await page.keyboard.press("Control+K");
  const command = page.getByRole("dialog", { name: "Workspace commands" });
  await expect(command).toBeVisible();
  const commandInput = command.getByRole("combobox", { name: "Workspace commands" });
  await commandInput.fill("portal");
  await expect(command.getByRole("option", { name: /Client portal launch/ })).toBeVisible();
  await commandInput.press("Enter");
  await expect(command).toBeHidden();
  await expect(page.getByRole("row", { name: /Client portal launch/ })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const sheetTrigger = page.getByRole("button", { name: "Open workspace navigation" });
  await sheetTrigger.click();
  const sheet = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(sheet).toBeVisible();
  await expect
    .poll(() => sheet.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press("Tab");
  await expect
    .poll(() => sheet.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await expect(sheetTrigger).toBeFocused();

  const taskTrigger = page.getByRole("button", { name: "View activity details" });
  await taskTrigger.click();
  const taskDialog = page.getByRole("dialog", { name: "Review launch checklist" });
  await expect(taskDialog).toBeVisible();
  const taskTitle = taskDialog.locator('[data-slot="title"]');
  await expect(taskTitle).toHaveJSProperty("tagName", "DIV");
  await expect(taskTitle).toHaveCSS("font-size", "16px");
  await expect(taskDialog.locator('[data-slot="description"]')).toHaveCSS("font-size", "14px");
  await expect
    .poll(() => taskDialog.evaluate((element) => element.contains(document.activeElement)))
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(taskDialog).toBeHidden();
  await expect(taskTrigger).toBeFocused();

  const table = page.getByRole("region", { name: "Workspace initiatives" });
  await table.focus();
  if (browserName === "webkit") {
    await table.evaluate((element) => {
      element.scrollLeft = 80;
    });
  } else {
    await table.press("ArrowRight");
  }
  await expect
    .poll(() => table.evaluate((element) => Math.abs(element.scrollLeft)))
    .toBeGreaterThan(0);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("keeps RTL, reduced-motion, dynamic viewport, Sidebar, and Toast behavior engine-safe", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(workspaceRoute);

  const previewSettings = await openMobilePreviewSettings(page);
  const sheetTitle = previewSettings.locator('[data-slot="sheet-title"]');
  await expect(sheetTitle).toHaveJSProperty("tagName", "DIV");
  await expect(sheetTitle).toHaveCSS("font-size", "16px");
  await expect(previewSettings.locator('[data-slot="sheet-description"]')).toHaveCSS(
    "font-size",
    "14px",
  );
  await previewSettings.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();
  await page.keyboard.press("Escape");
  await expect(previewSettings).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-direction",
    "rtl",
  );
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-side",
    "right",
  );

  const trigger = page.getByRole("button", { name: "Open workspace navigation" });
  await trigger.click();
  const sheet = page.getByRole("dialog", { name: "Workspace navigation" });
  const bounds = await sheet.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.y).toBeGreaterThanOrEqual(-1);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(721);
  await page.keyboard.press("Escape");

  const create = page.getByRole("button", { name: "New initiative" });
  await create.click();
  const toast = page.locator(".n-toast--managed");
  await expect(toast).toHaveCount(1);
  await toast.hover();
  const toastViewport = page.locator('[data-slot="viewport"]');
  await expect(toastViewport).toHaveAttribute("data-direction", "rtl");
  const toastViewportBox = await toastViewport.boundingBox();
  expect(toastViewportBox).not.toBeNull();
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(toastViewportBox.x).toBeLessThan(viewportWidth / 2);
  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toast).toHaveCount(0);

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  expect(problems).toEqual([]);
});
