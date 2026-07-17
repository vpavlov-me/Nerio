import { expect, test } from "@playwright/test";

const healthStabilityWindowMs = 250;

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
    if (errorText !== "net::ERR_ABORTED") problems.push(`request: ${request.url()} (${errorText})`);
  });
  return problems;
}

async function expectHealthyPage(page, problems) {
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  await page.waitForTimeout(healthStabilityWindowMs);
  expect(problems).toEqual([]);
}

test("covers public docs routes, Sidebar examples, and appearance controls", async ({ page }) => {
  const problems = monitorPage(page);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const primaryHeroAction = page.getByRole("link", { name: "Get started", exact: true });
  await expect(primaryHeroAction).toHaveCount(1);
  const primaryHeroColors = await primaryHeroAction.evaluate((element) => {
    const probe = document.createElement("span");
    probe.style.color = "var(--n-button-foreground-primary)";
    document.body.append(probe);
    const expected = getComputedStyle(probe).color;
    probe.remove();
    return { actual: getComputedStyle(element).color, expected };
  });
  expect(primaryHeroColors.actual).toBe(primaryHeroColors.expected);

  await page.goto("/docs/getting-started");
  await expect(page.getByRole("heading", { name: "Getting started" })).toBeVisible();

  for (const route of ["button", "sidebar-primitive", "command-primitive"]) {
    await page.goto(`/docs/components/${route}`);
    await expect(page.getByRole("main")).toBeVisible();
  }

  await page.goto("/docs/components/sidebar-primitive");
  await expect(page.getByLabel("Sidebar preview")).toBeVisible();
  await expect(
    page.getByText('label="Toggle workspace sidebar"', { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText('import * as React from "react";', { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Purple", exact: true }).click();
  await page.getByRole("menuitem", { name: /Blue/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "blue");

  await page.getByRole("button", { name: "Comfortable", exact: true }).click();
  const densityMenu = page.getByRole("menu", { name: "Comfortable" });
  const densityMenuSpacing = await densityMenu.evaluate((element) => {
    const style = getComputedStyle(element);
    const probe = document.createElement("span");
    probe.style.inlineSize = "var(--n-space-1)";
    element.append(probe);
    const expected = getComputedStyle(probe).inlineSize;
    probe.remove();
    return {
      actual: style.gap,
      expected,
    };
  });
  expect(densityMenuSpacing.actual).toBe(densityMenuSpacing.expected);
  await page.getByRole("menuitem", { name: /Compact/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");

  await page.getByRole("button", { name: "Color mode: System" }).click();
  await page.getByRole("menuitem", { name: /Dark/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

  await expectHealthyPage(page, problems);
});

test("allows wheel scrolling on the homepage", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await expectHealthyPage(page, problems);
});

test("keeps Actions and Forms Tailwind recipes active across public docs", async ({ page }) => {
  const problems = monitorPage(page);
  const routes = [
    ["button-group", ".n-button-group", ["flex", "inline-flex"]],
    ["input-group", ".n-input-group", ["flex"]],
    ["checkbox", ".n-checkbox", ["flex", "inline-flex"]],
    ["radio-group", ".n-radio", ["flex", "inline-flex"]],
    ["switch", ".n-switch", ["flex", "inline-flex"]],
    ["select", ".n-select-trigger", ["flex", "inline-flex"]],
    ["label", ".n-label", ["block", "inline"]],
  ];

  for (const [route, selector, expectedDisplays] of routes) {
    await page.goto(`/docs/components/${route}`);
    const component = page.locator(selector).first();
    await expect(component, route).toBeVisible();
    const snapshot = await component.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        borderStyle: style.borderStyle,
        display: style.display,
        fontFamily: style.fontFamily,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(expectedDisplays, `${route} display`).toContain(snapshot.display);
    expect(snapshot.fontFamily, `${route} font`).not.toBe("");
    expect(snapshot.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
    if (["checkbox", "radio-group", "switch", "select"].includes(route)) {
      expect(snapshot.borderStyle, `${route} border`).toBe("solid");
    }
  }

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/docs/components/checkbox");
  await expect(page.locator(".n-checkbox").first()).toHaveCSS("transition-duration", "0s");
  await page.goto("/docs/components/switch");
  await expect(page.locator(".n-switch").first()).toHaveCSS("transition-duration", "0s");

  await expectHealthyPage(page, problems);
});

test("keeps the final Tailwind component families active across public docs", async ({ page }) => {
  const problems = monitorPage(page);
  const routes = [
    ["breadcrumbs", ".n-breadcrumbs"],
    ["pagination", ".n-pagination"],
    ["tabs", ".n-tabs"],
    ["toast", ".n-toast"],
    ["sidebar-primitive", ".n-sidebar"],
    ["command-primitive", ".n-command"],
  ];

  for (const [route, selector] of routes) {
    await page.goto(`/docs/components/${route}`);
    const component = page.locator(selector).first();
    await expect(component, route).toBeVisible();
    const snapshot = await component.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        display: style.display,
        fontFamily: style.fontFamily,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(snapshot.display, `${route} display`).not.toBe("none");
    expect(snapshot.fontFamily, `${route} font`).not.toBe("");
    expect(snapshot.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
  }

  await page.goto("/docs/components/tooltip");
  await page.getByRole("button", { name: "Copy link" }).hover();
  await expect(page.getByRole("tooltip")).toBeVisible();

  await page.goto("/docs/components/popover");
  await page.getByRole("button", { name: "Filters" }).click();
  await expect(page.getByRole("heading", { name: "View filters" })).toBeVisible();

  await page.goto("/docs/components/dropdown-menu");
  await page.getByRole("button", { name: "Actions", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "Archive" })).toBeVisible();

  await page.goto("/docs/components/sheet");
  await page.getByRole("button", { name: "Open settings" }).click();
  await expect(page.getByRole("heading", { name: "Workspace settings" })).toBeVisible();

  await expectHealthyPage(page, problems);
});

test("preserves segmented surfaces, control indicators, and the mobile showcase layout", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const showcase = await page.locator(".home-gallery").evaluate((element) => {
    const resolveToken = (property, token) => {
      const probe = document.createElement("div");
      probe.style.setProperty(property, `var(${token})`);
      document.body.append(probe);
      const value = getComputedStyle(probe).getPropertyValue(property);
      probe.remove();
      return value;
    };
    const tabsList = element.querySelector('.home-gallery__range-tabs [data-slot="list"]');
    const tabsIndicator = element.querySelector(
      '.home-gallery__range-tabs [data-slot="indicator"]',
    );
    const checkboxIndicator = element.querySelector(
      '.n-checkbox[data-checked] [data-slot="indicator"]',
    );
    const radioIndicator = element.querySelector('.n-radio[data-checked] [data-slot="indicator"]');
    const switchThumb = element.querySelector('.n-switch[data-checked] [data-slot="thumb"]');

    if (!tabsList || !tabsIndicator || !checkboxIndicator || !radioIndicator || !switchThumb) {
      throw new Error("The showcase is missing a styled compound component slot.");
    }

    const tabsListStyle = getComputedStyle(tabsList);
    const tabsIndicatorStyle = getComputedStyle(tabsIndicator);
    const checkboxIndicatorStyle = getComputedStyle(checkboxIndicator);
    const radioIndicatorStyle = getComputedStyle(radioIndicator);
    const switchThumbStyle = getComputedStyle(switchThumb);

    return {
      checkboxOpacity: checkboxIndicatorStyle.opacity,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      radioOpacity: radioIndicatorStyle.opacity,
      switchOffset: switchThumbStyle.marginInlineStart,
      switchOffsetToken: resolveToken("margin-inline-start", "--n-switch-thumb-offset"),
      tabsBackground: tabsListStyle.backgroundColor,
      tabsBackgroundToken: resolveToken("background-color", "--n-tabs-list-background"),
      tabsGap: tabsListStyle.gap,
      tabsIndicatorBackground: tabsIndicatorStyle.backgroundColor,
      tabsIndicatorBackgroundToken: resolveToken(
        "background-color",
        "--n-tabs-indicator-background",
      ),
      tabsPadding: tabsListStyle.padding,
    };
  });

  expect(showcase.overflow).toBeLessThanOrEqual(1);
  expect(showcase.tabsBackground).toBe(showcase.tabsBackgroundToken);
  expect(showcase.tabsIndicatorBackground).toBe(showcase.tabsIndicatorBackgroundToken);
  expect(showcase.tabsGap).toBe("0px");
  expect(showcase.tabsPadding).not.toBe("0px");
  expect(showcase.checkboxOpacity).toBe("1");
  expect(showcase.radioOpacity).toBe("1");
  expect(showcase.switchOffset).toBe(showcase.switchOffsetToken);

  await expectHealthyPage(page, problems);
});

test("keeps an explicit light mode while navigating between showcase and docs", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Color mode: System" }).click();
  await page.getByRole("menuitem", { name: /Light/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "light");

  await page.goto("/docs/getting-started");
  await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
  await expect(page.getByRole("heading", { name: "Getting started" })).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(255, 255, 255)");

  await expectHealthyPage(page, problems);
});

test("keeps the docs shell inside emulated safe areas without overflow", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Safe-area emulation uses Chromium CDP.");
  const problems = monitorPage(page);
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 47, right: 8, bottom: 34, left: 8 },
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/getting-started");

  const shell = await page.locator(".docs-shell").evaluate((element) => {
    const rootStyle = getComputedStyle(document.documentElement);
    const header = element.querySelector(".docs-header").getBoundingClientRect();
    return {
      bottom: rootStyle.getPropertyValue("--n-docs-safe-area-block-end").trim(),
      inlineEnd: rootStyle.getPropertyValue("--n-docs-safe-area-inline-end").trim(),
      inlineStart: rootStyle.getPropertyValue("--n-docs-safe-area-inline-start").trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      top: rootStyle.getPropertyValue("--n-docs-safe-area-block-start").trim(),
      headerTop: header.top,
    };
  });

  expect(shell.top).toBe("47px");
  expect(shell.bottom).toBe("34px");
  expect(shell.inlineStart).toBe("8px");
  expect(shell.inlineEnd).toBe("8px");
  expect(shell.headerTop).toBe(0);
  expect(shell.overflow).toBeLessThanOrEqual(1);
  await expectHealthyPage(page, problems);
});
