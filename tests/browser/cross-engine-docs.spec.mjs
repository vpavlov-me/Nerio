import { expect, test } from "@playwright/test";

function monitorPage(page, browserName) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    if (browserName === "webkit" && error.message.endsWith("due to access control checks.")) return;
    problems.push(`page: ${error.message}`);
  });
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "failed";
    if (errorText === "net::ERR_ABORTED") return;
    const isRscPrefetch = new URL(request.url()).searchParams.has("_rsc");
    if (browserName === "firefox" && isRscPrefetch && errorText === "NS_BINDING_ABORTED") return;
    if (
      browserName === "webkit" &&
      isRscPrefetch &&
      ["cancelled", "Load request cancelled"].includes(errorText)
    ) {
      return;
    }
    problems.push(`request: ${request.url()} (${errorText})`);
  });
  return problems;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
});

async function expectInsideViewport(locator, viewport) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

test("keeps Dialog, Popover, Tooltip, and Dropdown Menu positioned and keyboard-safe", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  const viewport = { width: 1024, height: 820 };
  await page.setViewportSize(viewport);
  await page.goto("/docs/blocks/overlay-playground");

  const dialogTrigger = page.getByRole("button", { name: "Open dialog" });
  await dialogTrigger.click();
  const dialog = page.getByRole("dialog", { name: "Long review notes" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await expectInsideViewport(dialog, viewport);
  await page.keyboard.press("Escape");
  await expect(dialogTrigger).toBeFocused();

  await page.getByRole("button", { name: "Open popover" }).click();
  const popover = page.getByRole("dialog", { name: "Share settings" });
  await expect(popover).toBeVisible();
  await expectInsideViewport(popover, viewport);
  await page.keyboard.press("Escape");

  const menuTrigger = page.getByRole("button", { name: "More actions" });
  await menuTrigger.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Duplicate" })).toHaveAttribute(
    "data-highlighted",
    "",
  );
  const archive = page.getByRole("menuitem", { name: "Archive" });
  await expect(archive).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await expect(archive).toHaveAttribute("data-highlighted", "");
  await page.keyboard.press("Escape");
  await expect(menuTrigger).toBeFocused();

  const tooltipTrigger = page.getByRole("button", { name: "What is this?" });
  await tooltipTrigger.hover();
  const tooltip = page.getByRole("tooltip", { name: "Short, non-essential guidance" });
  await expect(tooltip).toBeVisible();
  await expectInsideViewport(tooltip, viewport);
  expect(problems).toEqual([]);
});

test("keeps Select, command search, and focus-visible behavior portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.goto("/docs/components/select");
  const select = page.getByRole("combobox", { name: "Status" });
  await select.focus();
  expect(await select.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await select.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Draft" })).toBeVisible();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(select).toContainText("In review");

  await page.getByRole("button", { name: "Search documentation" }).click();
  const command = page.getByRole("combobox", { name: "Search documentation" });
  await command.fill("Button");
  await expect(page.getByRole("option", { name: /^Button / }).first()).toBeVisible();
  await page.keyboard.press("Escape");

  expect(problems).toEqual([]);
});

test("keeps mobile navigation inside the dynamic viewport", async ({ browserName, page }) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto("/docs/getting-started");
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Documentation" });
  await expect(navigation).toBeVisible();
  const box = await navigation.boundingBox();
  expect(box).not.toBeNull();
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.y + box.height).toBeLessThanOrEqual(721);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});
