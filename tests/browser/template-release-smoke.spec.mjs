import { expect, test } from "@playwright/test";
import { openMobilePreviewSettings } from "./helpers/template-preview-settings.mjs";

const themes = ["purple", "blue", "green", "orange", "red", "neutral"];
const modes = ["system", "light", "dark"];
const densities = ["comfortable", "compact"];
const workspaceRoute = "/views/operations-workspace";
const healthStabilityWindowMs = 250;
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 820, height: 1180 },
  { name: "mobile", width: 390, height: 844 },
];

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
    problems.push(`request: ${request.url()} (${request.failure()?.errorText ?? "failed"})`);
  });
  return problems;
}

async function expectHealthyPage(
  page,
  problems,
  { stabilityWindowMs = healthStabilityWindowMs } = {},
) {
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  await page.waitForTimeout(stabilityWindowMs);
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  expect(problems).toEqual([]);
}

test("health check observes failures during the stability window", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setContent(`
    <script>
      window.setTimeout(() => console.error("late release smoke failure"), 25);
    </script>
  `);

  await expect(expectHealthyPage(page, problems, { stabilityWindowMs: 50 })).rejects.toThrow();
  expect(problems).toContain("console: late release smoke failure");
});

test("covers the release appearance and responsive matrix without overflow", async ({ page }) => {
  const problems = monitorPage(page);
  const themeColors = new Map();

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto(workspaceRoute);
    await expect(page.getByRole("heading", { name: "Operations overview" })).toBeVisible();
    if (viewport.width <= 1080) {
      await expect(page.getByRole("button", { name: "Open workspace navigation" })).toBeVisible();
    } else {
      await expect(page.getByRole("complementary", { name: "Workspace sidebar" })).toBeVisible();
    }

    for (const theme of themes) {
      for (const mode of modes) {
        for (const density of densities) {
          const snapshot = await page.evaluate(
            ({ theme, mode, density }) => {
              const root = document.documentElement;
              root.dataset.theme = theme;
              root.dataset.mode = mode;
              root.dataset.density = density;
              const style = getComputedStyle(root);
              return {
                accent: style.getPropertyValue("--n-color-action-primary").trim(),
                controlHeight: style.getPropertyValue("--n-button-height-md").trim(),
                overflow:
                  document.documentElement.scrollWidth - document.documentElement.clientWidth,
              };
            },
            { theme, mode, density },
          );
          expect(snapshot.accent, `${viewport.name}/${theme}/${mode}/${density} accent`).not.toBe(
            "",
          );
          expect(
            snapshot.controlHeight,
            `${viewport.name}/${theme}/${mode}/${density} density`,
          ).not.toBe("");
          expect(
            snapshot.overflow,
            `${viewport.name}/${theme}/${mode}/${density} overflow`,
          ).toBeLessThanOrEqual(1);
          if (mode === "light" && density === "comfortable") {
            themeColors.set(`${viewport.name}:${theme}`, snapshot.accent);
          }
        }
      }
    }
  }

  for (const viewport of viewports) {
    const viewportThemeColors = themes.map((theme) => themeColors.get(`${viewport.name}:${theme}`));
    expect(new Set(viewportThemeColors).size, `${viewport.name} theme accents`).toBe(themes.length);
  }
  await expectHealthyPage(page, problems);
});

test("covers focus, Sheet restoration, Table scrolling, and Sidebar collapse", async ({ page }) => {
  const problems = monitorPage(page);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(workspaceRoute);
  const rail = page.locator('[data-slot="sidebar-rail"]');
  await expect(rail).toHaveAccessibleName("Collapse sidebar");
  await rail.click();
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-state",
    "collapsed",
  );
  await expect(rail).toHaveAttribute("aria-expanded", "false");
  await expect(rail).toHaveAccessibleName("Expand sidebar");
  await rail.click();
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-state",
    "expanded",
  );

  await page.locator("body").click({ position: { x: 1, y: 1 } });
  await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.matches(":focus-visible"))).toBe(true);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const sheetTrigger = page.getByRole("button", { name: "Open workspace navigation" });
  await sheetTrigger.click();
  const navigationSheet = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(navigationSheet.locator('[data-slot="sheet-title"]')).toHaveText(
    "Workspace navigation",
  );
  await page.keyboard.press("Escape");
  await expect(navigationSheet).toBeHidden();
  await expect(sheetTrigger).toBeFocused();

  const table = page.getByRole("region", { name: "Workspace initiatives" });
  await table.focus();
  await expect(table).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await expectHealthyPage(page, problems);
});

test("keeps the template shell inside emulated safe areas without overflow", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Safe-area emulation uses Chromium CDP.");
  const problems = monitorPage(page);
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 47, right: 4, bottom: 34, left: 12 },
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(workspaceRoute);

  const shell = await page.locator('[data-slot="sidebar-provider"]').evaluate((element) => {
    const rootStyle = getComputedStyle(element);
    return {
      bottom: rootStyle.getPropertyValue("--n-template-safe-area-block-end").trim(),
      inlineEnd: rootStyle.getPropertyValue("--n-template-safe-area-inline-end").trim(),
      inlineStart: rootStyle.getPropertyValue("--n-template-safe-area-inline-start").trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      top: rootStyle.getPropertyValue("--n-template-safe-area-block-start").trim(),
    };
  });

  expect(shell.top).toBe("47px");
  expect(shell.bottom).toBe("34px");
  expect(shell.inlineStart).toBe("12px");
  expect(shell.inlineEnd).toBe("4px");
  expect(shell.overflow).toBeLessThanOrEqual(1);

  const previewSettings = await openMobilePreviewSettings(page);
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
  const rtlInsets = await page.locator('[data-slot="sidebar-provider"]').evaluate((element) => {
    const rootStyle = getComputedStyle(element);
    return {
      inlineEnd: rootStyle.getPropertyValue("--n-template-safe-area-inline-end").trim(),
      inlineStart: rootStyle.getPropertyValue("--n-template-safe-area-inline-start").trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(rtlInsets.inlineStart).toBe("4px");
  expect(rtlInsets.inlineEnd).toBe("12px");
  expect(rtlInsets.overflow).toBeLessThanOrEqual(1);
  await expectHealthyPage(page, problems);
});

test("covers Command groups, IME safety, leading layout, and selection", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(workspaceRoute);
  await page.keyboard.press("Control+K");
  await expect(page.getByRole("dialog", { name: "Workspace commands" })).toBeVisible();
  const input = page.getByRole("combobox", { name: "Workspace commands" });

  await expect(page.getByText("Navigation", { exact: true })).toBeVisible();
  await expect(
    page.locator('[data-slot="command-group-label"]').filter({ hasText: "Initiatives" }),
  ).toBeVisible();
  await expect(page.getByRole("option", { name: /Overview/ })).toHaveAttribute(
    "data-leading",
    "true",
  );
  await expect(page.getByRole("option", { name: /Client portal launch/ })).toHaveAttribute(
    "data-leading",
    "true",
  );

  await input.dispatchEvent("compositionstart", { data: "活" });
  await input.press("Enter");
  await expect(input).toBeVisible();
  await input.dispatchEvent("compositionend", { data: "活" });
  await input.fill("reporting");
  await expect(page.getByRole("option", { name: /Reporting migration/ })).toBeVisible();
  await input.press("Enter");
  await expect(page.getByRole("row", { name: /Client portal launch/ })).toHaveCount(0);
  await expect(page.getByRole("row", { name: /Reporting migration/ })).toBeVisible();

  await expectHealthyPage(page, problems);
});

test("covers Toast stacking and logical swipe in LTR and RTL", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(workspaceRoute);
  const create = page.getByRole("button", { name: "New initiative" });
  await create.click();
  await create.click();
  await create.click();

  const toasts = page.locator(".n-toast--managed");
  await expect(toasts).toHaveCount(3);
  const viewport = page.locator('[data-slot="viewport"]');
  await expect(viewport).toHaveAttribute("data-direction", "ltr");
  await expect(viewport).toHaveAttribute("data-swipe-direction", "right down");
  const ltrViewportBox = await viewport.boundingBox();
  expect(ltrViewportBox).not.toBeNull();

  const ltrBox = await toasts.first().boundingBox();
  expect(ltrBox).not.toBeNull();
  await page.mouse.move(ltrBox.x + ltrBox.width / 2, ltrBox.y + ltrBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(ltrBox.x + ltrBox.width * 1.5, ltrBox.y + ltrBox.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(toasts).toHaveCount(2);

  await create.click();
  await expect(toasts).toHaveCount(3);

  await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
  await expect(viewport).toHaveAttribute("data-direction", "rtl");
  await expect(viewport).toHaveAttribute("data-swipe-direction", "left down");
  const rtlViewportBox = await viewport.boundingBox();
  expect(rtlViewportBox).not.toBeNull();
  expect(rtlViewportBox.x).toBeLessThan(ltrViewportBox.x);

  const rtlBox = await toasts.first().boundingBox();
  expect(rtlBox).not.toBeNull();
  await page.mouse.move(rtlBox.x + rtlBox.width / 2, rtlBox.y + rtlBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(rtlBox.x - rtlBox.width, rtlBox.y + rtlBox.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(toasts).toHaveCount(2);

  await expectHealthyPage(page, problems);
});

test("covers status filters, reduced motion, and forced colors", async ({ page }) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ colorScheme: "dark", forcedColors: "active", reducedMotion: "reduce" });
  await page.goto(workspaceRoute);
  expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );

  await page.getByRole("button", { name: "Open preview settings" }).click();
  const previewSettings = page.getByRole("dialog", { name: "Preview settings" });
  await expect(previewSettings.getByRole("combobox")).toHaveCount(4);
  await expect(previewSettings.getByRole("group", { name: "Initiative state" })).toHaveCount(0);
  await page.keyboard.press("Escape");

  await expect(page.getByRole("link", { name: "Open in GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/vpavlov-me/Nerio/tree/main/apps/docs/features/templates/operations-workspace",
  );

  const statusFilters = page.getByRole("group", { name: "Initiative status filters" });
  await statusFilters.getByRole("button", { name: /At risk/ }).click();
  await expect(page.getByRole("row", { name: /Reporting migration/ })).toBeVisible();
  await expect(page.getByRole("row", { name: /Client portal launch/ })).toHaveCount(0);
  await statusFilters.getByRole("button", { name: /All/ }).click();
  await expect(page.getByRole("region", { name: "Workspace initiatives" })).toBeVisible();

  await page.getByRole("button", { name: "New initiative" }).click();
  await expect(
    page.locator(".n-toast--managed").filter({ hasText: "New initiative action" }),
  ).toBeVisible();

  await expectHealthyPage(page, problems);
});

test("uses current Core primitives with the chart adapter and no deprecated IconButton", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto(workspaceRoute);
  await expect(
    page.locator('[data-slot="card-title"]', { hasText: "Delivery health" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /Chart/ })).toHaveCount(0);
  await expect(page.locator(".n-icon-button")).toHaveCount(0);
  await expect(
    page.getByRole("img", { name: /Weekly completion rate rose from 62 percent/ }),
  ).toBeVisible();
  await expect(page.getByRole("group", { name: "Six of nine contributors" })).toBeVisible();
  await expect(page.getByRole("group", { name: "Team capacity details" })).toBeVisible();
  await expect(page.getByText("Product and design", { exact: true })).toBeVisible();
  await expect(
    page.locator('[data-slot="card-title"]', { hasText: "Operational risks" }),
  ).toBeVisible();
  await expect(
    page.locator('[data-slot="card-title"]', { hasText: "Upcoming milestones" }),
  ).toBeVisible();
  await expect(page.locator('[data-slot="card-title"]', { hasText: "Cycle time" })).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Median cycle time decreased from 6.4 days/ }),
  ).toBeVisible();

  const sidebar = page.getByRole("complementary", { name: "Workspace sidebar" });
  await expect(sidebar.getByText("Active initiatives", { exact: true })).toHaveCount(0);

  const statusFilters = page.getByRole("group", { name: "Initiative status filters" });
  expect((await statusFilters.boundingBox())?.width).toBeLessThan(600);
  const expectedStatusCounts = new Map([
    ["All", "4"],
    ["On track", "1"],
    ["At risk", "1"],
    ["In review", "1"],
    ["Planned", "1"],
  ]);
  for (const [label, count] of expectedStatusCounts) {
    await expect(
      statusFilters.getByRole("button", { name: new RegExp(`^${label} ${count}$`, "i") }),
    ).toBeVisible();
  }
  await expect(statusFilters.getByRole("button", { name: /^All 4$/i })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const firstActivity = page.locator('[class*="activity-item"]').first();
  await expect(firstActivity.locator("strong")).toHaveCSS("font-size", "14px");
  await expect(firstActivity.locator("span")).toHaveCSS("font-size", "14px");
  await expect(page.getByRole("searchbox", { name: "Search initiatives" })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});
