import { expect, test } from "@playwright/test";

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

  const search = page.getByRole("textbox", { name: "Search projects" });
  await search.fill("launch");
  await expect(page.getByRole("row", { name: /Launch workspace/ })).toBeVisible();
  await search.fill("");

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

  const table = page.getByRole("region", { name: "Workspace projects" });
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

  await page.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

  const trigger = page.getByRole("button", { name: "Open workspace navigation" });
  await trigger.click();
  const sheet = page.getByRole("dialog", { name: "Workspace navigation" });
  const bounds = await sheet.boundingBox();
  expect(bounds).not.toBeNull();
  expect(bounds.y).toBeGreaterThanOrEqual(-1);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(721);
  await page.keyboard.press("Escape");

  const create = page.getByRole("button", { name: "Create project" });
  await create.click();
  const toast = page.locator(".n-toast--managed");
  await expect(toast).toHaveCount(1);
  await toast.hover();
  await expect(page.locator('[data-slot="viewport"]')).toHaveAttribute("data-direction", "rtl");
  await toast.getByRole("button", { name: "Dismiss notification" }).click();
  await expect(toast).toHaveCount(0);

  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  expect(problems).toEqual([]);
});
