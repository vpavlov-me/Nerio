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

test("keeps finance navigation static while supporting overview exploration", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(financeRoute);

  await expect(page.getByText("Portfolio performance", { exact: true })).toBeVisible();
  const balanceCard = page
    .locator('[data-slot="card"]')
    .filter({ hasText: "Consolidated portfolio" })
    .first();
  await expect(balanceCard).toBeVisible();
  await expect(balanceCard.locator('[data-slot="card-content"]')).toBeVisible();
  await expect(page.getByRole("group", { name: "Performance period" })).toBeVisible();
  await expect(page.getByRole("button", { name: "1M" })).toHaveAttribute("data-slot", "toggle");
  await expect(page.getByRole("link", { name: "Open in GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/vpavlov-me/Nerio/tree/main/apps/docs/features/templates/finance-assets",
  );
  await page.getByRole("button", { name: "3M" }).click();
  await expect(page.getByRole("button", { name: "3M" })).toHaveAttribute("aria-pressed", "true");

  const navigation = page.getByRole("navigation", { name: "Finance workspace" });
  await expect(navigation.getByText("Overview", { exact: true })).toBeVisible();
  await expect(navigation.getByText("Portfolio", { exact: true })).toBeVisible();
  await expect(navigation.getByText("Reports", { exact: true })).toBeVisible();
  await expect(navigation.getByRole("button")).toHaveCount(0);

  await page.getByRole("button", { name: /Short treasury fund/ }).click();
  await expect(page.getByText("T+1", { exact: true })).toBeVisible();
  const riskChart = page.getByRole("img", { name: /Risk distribution/ });
  await expect(riskChart.getByText("100%", { exact: true })).toBeVisible();
  await expect(riskChart.getByText("Total exposure", { exact: true })).toBeVisible();
  await expect(riskChart.locator("circle[stroke-dasharray]").first()).toHaveAttribute(
    "stroke-dasharray",
    "40.4 59.6",
  );
  await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
  expect(problems).toEqual([]);
});

test("collapses the desktop sidebar to an accessible icon rail", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(financeRoute);

  const sidebar = page.locator('[data-slot="sidebar"]');
  const sidebarInner = page.locator('[data-slot="sidebar-inner"]');
  const rail = page.locator('[data-slot="sidebar-rail"]');
  const navigation = page.getByRole("navigation", { name: "Finance workspace" });
  const settings = page.getByRole("button", { name: /preview settings|Settings/ });
  const firstNavigationIcon = navigation.locator(".n-icon").first();

  await expect(rail).toBeVisible();
  await expect(rail).toHaveAccessibleName("Collapse sidebar");
  await expect(firstNavigationIcon).toHaveCSS("width", "18px");
  expect((await rail.boundingBox())?.y).toBeGreaterThan((await settings.boundingBox())?.y ?? 0);
  await rail.click();

  await expect(sidebar).toHaveAttribute("data-state", "collapsed");
  await expect(sidebarInner).not.toHaveAttribute("inert", "");
  await expect.poll(async () => Math.round((await sidebar.boundingBox())?.width ?? 0)).toBe(56);
  await expect(navigation.locator("svg")).toHaveCount(7);
  await expect(navigation.locator('[data-state="active"]')).toBeVisible();
  await expect(navigation.locator('[data-slot="button-label"]').first()).toHaveCSS("width", "0px");
  await expect(navigation.locator('[data-slot="button-label"]').first()).toHaveCSS("opacity", "0");
  await expect(firstNavigationIcon).toHaveCSS("width", "18px");
  await expect(settings).toBeVisible();
  await expect(rail).toHaveAccessibleName("Expand sidebar");
  await expect(page.locator('[data-slot="sidebar-header"] strong')).toBeHidden();
  await expect(page.locator('[data-slot="sidebar-header"] svg')).toBeVisible();

  const settingsBox = await settings.boundingBox();
  const railBox = await rail.boundingBox();
  expect(railBox?.y, "collapsed rail below Settings").toBeGreaterThan(
    (settingsBox?.y ?? 0) + (settingsBox?.height ?? 0),
  );

  await navigation.locator('[data-slot="sidebar-menu-button"]').first().hover();
  const overviewTooltip = page.getByRole("tooltip").filter({ hasText: "Overview" });
  await expect(overviewTooltip).toHaveText("Overview");
  await expect(overviewTooltip).toHaveAttribute("data-side", "right");
  const leftSidebarBox = await sidebar.boundingBox();
  const rightTooltipBox = await overviewTooltip.boundingBox();
  await expect(overviewTooltip.locator('[data-slot="arrow"]')).toHaveCount(0);
  expect(rightTooltipBox?.x, "tooltip clears the left sidebar").toBeGreaterThanOrEqual(
    (leftSidebarBox?.x ?? 0) + (leftSidebarBox?.width ?? 0),
  );
  expect(
    (rightTooltipBox?.x ?? 0) + (rightTooltipBox?.width ?? 0) / 2,
    "tooltip outside the left sidebar",
  ).toBeGreaterThan((leftSidebarBox?.x ?? 0) + (leftSidebarBox?.width ?? 0));
  await rail.hover();
  await expect(page.getByRole("tooltip", { name: "Expand sidebar" })).toHaveText("Expand sidebar");

  await rail.click();
  await page.getByRole("button", { name: "Open preview settings" }).click();
  const previewSettings = page.getByRole("dialog", { name: "Preview settings" });
  await previewSettings.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();
  await page.keyboard.press("Escape");
  await expect(previewSettings).toBeHidden();
  await expect(sidebar).toHaveAttribute("data-side", "right");
  await rail.click();
  await expect.poll(async () => Math.round((await sidebar.boundingBox())?.width ?? 0)).toBe(56);
  await navigation.locator('[data-slot="sidebar-menu-button"]').first().hover();
  const rtlOverviewTooltip = page.getByRole("tooltip").filter({ hasText: "Overview" });
  await expect(rtlOverviewTooltip).toHaveText("Overview");
  await expect(rtlOverviewTooltip).toHaveAttribute("data-side", "left");
  const rightSidebarBox = await sidebar.boundingBox();
  const leftTooltipBox = await rtlOverviewTooltip.boundingBox();
  await expect(rtlOverviewTooltip.locator('[data-slot="arrow"]')).toHaveCount(0);
  expect(
    (leftTooltipBox?.x ?? 0) + (leftTooltipBox?.width ?? 0),
    "tooltip clears the right sidebar",
  ).toBeLessThanOrEqual(rightSidebarBox?.x ?? 0);
  expect(
    (leftTooltipBox?.x ?? 0) + (leftTooltipBox?.width ?? 0) / 2,
    "tooltip outside the right sidebar",
  ).toBeLessThan(rightSidebarBox?.x ?? 0);

  expect(problems).toEqual([]);
});

test("shows a static transfer preview while restoring focus", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(financeRoute);

  const trigger = page.getByRole("button", { name: "Transfer" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Transfer preview" });
  await expect(dialog.getByText("Demonstration only")).toBeVisible();
  await expect(dialog.getByText("Operating cash · USD")).toBeVisible();
  await expect(dialog.getByText("Short treasury fund · USTX")).toBeVisible();
  await expect(dialog.getByText("$5,000.00")).toBeVisible();
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(trigger).toBeFocused();
  expect(problems).toEqual([]);
});

test("supports balance privacy, mobile navigation, runtime axes, RTL, and reflow", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(financeRoute);

  const hideBalances = page.getByRole("button", { name: "Hide balances" });
  await expect(hideBalances).toHaveAttribute("aria-pressed", "true");
  await hideBalances.click();
  const showBalances = page.getByRole("button", { name: "Show balances" });
  await expect(showBalances).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator('[data-private-value][aria-label="Balance hidden"]')).toBeVisible();
  await expect(page.locator('[data-private-value][data-private-state="masked"]')).not.toHaveCount(
    0,
  );
  await expect(page.locator('[data-private-state="masked"] [data-slot="value"]').first()).toHaveCSS(
    "filter",
    /blur/,
  );
  await expect(page.getByRole("img", { name: /Values hidden/ })).toBeVisible();

  const navigationTrigger = page.getByRole("button", { name: "Open finance navigation" });
  await navigationTrigger.click();
  await page
    .getByRole("dialog", { name: "Finance navigation" })
    .getByRole("button", { name: "Settings" })
    .click();

  const previewSettings = page.getByRole("dialog", { name: "Preview settings" });
  await previewSettings.getByRole("combobox", { name: "Mode" }).click();
  await page.getByRole("option", { name: "Dark" }).click();
  await previewSettings.getByRole("combobox", { name: "Density" }).click();
  await page.getByRole("option", { name: "Compact" }).click();
  await previewSettings.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(
    await page.evaluate(() => ({
      density: window.localStorage.getItem("nerio-docs-density"),
      mode: window.localStorage.getItem("nerio-docs-mode"),
      theme: window.localStorage.getItem("nerio-docs-theme"),
    })),
  ).toEqual({ density: null, mode: null, theme: null });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});
