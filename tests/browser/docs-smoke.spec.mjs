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

test("covers public docs routes, standardized component docs, and the restrained header", async ({
  page,
}) => {
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

  await page.goto("/docs/components/button");
  const buttonInstallation = page.getByLabel("Button installation and import", { exact: true });
  await expect(buttonInstallation).toContainText("@nerio-ui/adapters/icons");
  await expect(buttonInstallation).toContainText("@nerio-ui/ui/client");

  await page.goto("/docs/components/sidebar-primitive");
  await expect(page.getByLabel("Sidebar preview")).toBeVisible();
  await expect(
    page.getByText('label="Toggle workspace sidebar"', { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText('import * as React from "react";', { exact: false })).toBeVisible();

  await page.goto("/docs/components/stat");

  for (const heading of [
    "Overview and decision boundary",
    "Preview",
    "Installation and imports",
    "Usage",
    "Accessibility",
    "API",
    "Styling contract",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeAttached();
  }

  await expect(page.getByText("v0.1.0-alpha.1", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Purple", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Comfortable", exact: true })).toHaveCount(0);
  const search = page.getByRole("button", { name: "Search documentation" });
  await search.hover();
  await expect(page.getByRole("tooltip", { name: "Search documentation (/ or ⌘K)" })).toBeVisible();
  const github = page.getByRole("link", { name: "GitHub", exact: true }).first();
  await expect(github.locator('img[src="/brand/github-invertocat-black.svg"]')).toBeAttached();

  await page.getByRole("button", { name: "Color mode: System" }).click();
  await page.getByRole("menuitem", { name: /Dark/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

  await expectHealthyPage(page, problems);
});

test("keeps the homepage concise while local tooling remains accessible", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Open-source React design system for adaptable product teams.",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Own the component code without losing the system." }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "Core builds the language. Pro will build product solutions.",
    }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", {
      name: "One visual contract, tested through real product composition.",
    }),
  ).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Playground", exact: true })).toHaveAttribute(
    "href",
    "/playground",
  );
  await expect(page.locator('img[src="/brand/google-g.svg"]')).toBeAttached();
  await expect(page.locator('img[src="/brand/apple-logo.svg"]')).toBeAttached();

  await expectHealthyPage(page, problems);
});

test("applies every Playground control to the component canvas", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/playground");
  const playground = page.locator(".visual-playground");
  await expect(page.getByRole("heading", { name: "Nerio Playground" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Component index" })).toContainText("Button");
  await expect(page.getByRole("navigation", { name: "Component index" })).not.toContainText(
    "IconButton",
  );
  await expect(page.getByRole("navigation", { name: "Component index" })).not.toContainText(
    "Chart",
  );

  await page.getByRole("radio", { name: "blue", exact: true }).click();
  await page
    .getByRole("radiogroup", { name: "Appearance" })
    .getByRole("radio", { name: "Dark" })
    .click();
  await page
    .getByRole("radiogroup", { name: "Density" })
    .getByRole("radio", { name: "Compact" })
    .click();
  await page
    .getByRole("radiogroup", { name: "Radius" })
    .getByRole("radio")
    .filter({ hasText: "none" })
    .click();
  await page
    .getByRole("radiogroup", { name: "Scaling" })
    .getByRole("radio", { name: "90%" })
    .click();
  await page
    .getByRole("radiogroup", { name: "Motion" })
    .getByRole("radio", { name: "Reduced" })
    .click();

  await expect(playground).toHaveAttribute("data-theme", "blue");
  await expect(playground).toHaveAttribute("data-mode", "dark");
  await expect(playground).toHaveAttribute("data-density", "compact");
  const applied = await playground.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      controlHeight: style.getPropertyValue("--n-button-height-md").trim(),
      duration: style.getPropertyValue("--n-duration-normal").trim(),
      radius: style.getPropertyValue("--n-radius-md").trim(),
      space: style.getPropertyValue("--n-space-4").trim(),
    };
  });
  expect(applied).toEqual({
    controlHeight: "25.2px",
    duration: "1ms",
    radius: "0px",
    space: "14.4px",
  });

  await page
    .getByRole("radiogroup", { name: "Settings view" })
    .getByRole("radio", { name: "Colors" })
    .click();
  await expect(page.getByRole("textbox", { name: "Canvas CSS color value" })).toHaveValue(
    "#000000",
  );

  await page
    .getByRole("radiogroup", { name: "Settings view" })
    .getByRole("radio", { name: "Theme" })
    .click();
  const darkTextBefore = await playground.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--n-color-text-secondary").trim(),
  );
  await page.getByRole("radio", { name: "mauve", exact: true }).click();
  const darkTextAfter = await playground.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--n-color-text-secondary").trim(),
  );
  expect(darkTextAfter).not.toBe(darkTextBefore);

  await page
    .getByRole("radiogroup", { name: "Settings view" })
    .getByRole("radio", { name: "Colors" })
    .click();
  const canvasValue = page.getByRole("textbox", { name: "Canvas CSS color value" });
  await canvasValue.fill("rgb(255, 0, 0)");
  await expect(canvasValue).toHaveValue("rgb(255, 0, 0)");
  await expect(page.locator(".playground-color-control__picker").first()).toHaveValue("#ff0000");
  await expectHealthyPage(page, problems);
});

test("keeps mobile navigation singular, searchable, and safe", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/getting-started");

  await expect(page.locator(".docs-sidebar")).toBeHidden();
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Documentation" });
  await expect(navigation).toBeVisible();
  await expect(navigation.getByRole("navigation", { name: "Mobile documentation" })).toContainText(
    "Visual language",
  );
  await expect(navigation.getByRole("navigation", { name: "Mobile documentation" })).toContainText(
    "Composition previews",
  );
  await expect(navigation.getByRole("link", { name: "Login" })).toBeVisible();
  await navigation.getByRole("link", { name: "Visual language" }).click();
  await expect(page).toHaveURL(/\/docs\/foundations\/visual-language$/);

  await page.getByRole("button", { name: "Search documentation" }).click();
  await page.getByRole("combobox", { name: "Search documentation" }).fill("Login");
  await expect(page.getByRole("option", { name: /^Login Login documentation and/ })).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Search documentation" }).click();
  await page.getByRole("combobox", { name: "Search documentation" }).fill("Playground");
  await expect(page.getByRole("option").first()).toHaveAttribute("href", "/playground");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/playground$/);
  await expectHealthyPage(page, problems);
});

test("publishes canonical discovery routes and redirects legacy compositions", async ({
  page,
  request,
}) => {
  const problems = monitorPage(page);
  const [sitemap, robots, llms, legacy] = await Promise.all([
    request.get("/sitemap.xml"),
    request.get("/robots.txt"),
    request.get("/llms.txt"),
    request.get("/docs/compositions/login", { maxRedirects: 0 }),
  ]);

  expect(await sitemap.text()).not.toContain("/playground");
  expect(await sitemap.text()).not.toContain("/docs/blocks/");
  expect(await robots.text()).toContain("Sitemap: https://nerio.vpavlov.com/sitemap.xml");
  expect(await llms.text()).toContain("0.1.0-alpha.1");
  expect(await llms.text()).not.toContain("/playground");
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("/docs/blocks/login");

  await page.goto("/docs/blocks/login");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
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

test("keeps the optional Motion adapter deterministic and preference-aware", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/foundations/motion");
  await expect(page.getByRole("heading", { name: "Motion", exact: true })).toBeVisible();

  const presenceItem = page.getByTestId("motion-presence-item");
  await expect(presenceItem).toBeVisible();
  await page.getByRole("button", { name: "Hide update" }).click();
  await expect(presenceItem).toHaveCount(0);
  await page.getByRole("button", { name: "Show update" }).press("Enter");
  await expect(presenceItem).toBeVisible();

  const reverse = page.getByRole("button", { name: "Reverse state" });
  await reverse.click();
  await reverse.click();
  await reverse.click();
  const interruption = page.getByTestId("motion-interruption-indicator");
  await expect(interruption).toHaveAttribute("data-active", "end");
  await expect(interruption).toHaveAttribute("data-settled", "true");

  const layoutItems = page.getByTestId("motion-layout-list").locator("span");
  await expect(layoutItems.first()).toHaveText("Plan");
  await page.getByRole("button", { name: "Reorder steps" }).click();
  await expect(layoutItems.first()).toHaveText("Review");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(page.getByTestId("motion-layout-list")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth))
    .toBeLessThanOrEqual(1);

  const reducedProbe = page.getByTestId("motion-reduced-probe");
  await expect(reducedProbe).toHaveAttribute("data-reduced-motion", "false");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(reducedProbe).toHaveAttribute("data-reduced-motion", "true");
  await page.getByRole("button", { name: "Toggle state" }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(reducedProbe).toHaveAttribute("data-reduced-motion", "false");

  await page.getByRole("button", { name: "Hide update" }).click();
  await page.goto("/docs/foundations/tokens");
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
        transitionDuration: style.transitionDuration,
      };
    });
    expect(expectedDisplays, `${route} display`).toContain(snapshot.display);
    expect(snapshot.fontFamily, `${route} font`).not.toBe("");
    expect(snapshot.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
    if (["checkbox", "radio-group", "switch", "select"].includes(route)) {
      expect(snapshot.borderStyle, `${route} border`).toBe("solid");
    }
    if (["input-group", "checkbox", "radio-group", "switch", "select"].includes(route)) {
      expect(snapshot.transitionDuration, `${route} transition`).toBe("0.22s");
    }
    if (route === "checkbox") {
      await expect(component).toHaveCSS("border-radius", "4px");
    }
  }

  await page.goto("/docs/components/button");
  const linkButton = page.getByRole("link", { name: "Link", exact: true });
  const linkDecoration = await linkButton.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      color: style.textDecorationColor,
      line: style.textDecorationLine,
      thickness: style.textDecorationThickness,
    };
  });
  expect(linkDecoration.line).toContain("underline");
  expect(linkDecoration.color).toBe("rgba(0, 0, 0, 0)");
  expect(linkDecoration.thickness).not.toBe("auto");

  await page.goto("/docs/components/select");
  await page.getByRole("combobox", { name: "Status" }).click();
  const selectPopup = page.locator(".n-select-popup");
  await expect(selectPopup).toHaveCSS("border-radius", "16px");
  const selectOverlayTokens = await selectPopup.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      divider: style.getPropertyValue("--n-color-border-subtle").trim(),
      foreground: style.getPropertyValue("--n-color-text-primary").trim(),
      foregroundMuted: style.getPropertyValue("--n-color-text-secondary").trim(),
      itemBackground: style.getPropertyValue("--n-color-surface-muted").trim(),
      itemSelectedBackground: style.getPropertyValue("--n-color-surface-selected").trim(),
      overlayDivider: style.getPropertyValue("--n-overlay-divider").trim(),
      overlayForeground: style.getPropertyValue("--n-overlay-foreground").trim(),
      overlayForegroundMuted: style.getPropertyValue("--n-overlay-foreground-muted").trim(),
      overlayItemBackground: style.getPropertyValue("--n-overlay-control-background").trim(),
      overlaySelectedBackground: style.getPropertyValue("--n-overlay-selected-background").trim(),
    };
  });
  expect(selectOverlayTokens.divider).toBe(selectOverlayTokens.overlayDivider);
  expect(selectOverlayTokens.foreground).toBe(selectOverlayTokens.overlayForeground);
  expect(selectOverlayTokens.foregroundMuted).toBe(selectOverlayTokens.overlayForegroundMuted);
  expect(selectOverlayTokens.itemBackground).toBe(selectOverlayTokens.overlayItemBackground);
  expect(selectOverlayTokens.itemSelectedBackground).toBe(
    selectOverlayTokens.overlaySelectedBackground,
  );

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/docs/components/checkbox");
  await expect(page.locator(".n-checkbox").first()).toHaveCSS("transition-duration", "0.001s");
  await page.goto("/docs/components/switch");
  await expect(page.locator(".n-switch").first()).toHaveCSS("transition-duration", "0.001s");

  await expectHealthyPage(page, problems);
});

test("keeps Data Display and Feedback neutral, compact, and motion-aware", async ({ page }) => {
  const problems = monitorPage(page);

  await page.goto("/docs/components/card");
  const card = page.locator(".n-card").first();
  await expect(card).toBeVisible();
  await expect(card).toHaveCSS("border-top-width", "0px");
  await expect(card.locator("[data-slot=card-title]").first()).toHaveCSS("font-weight", "500");
  expect(await card.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(card).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "light"));

  await page.goto("/docs/components/alert");
  const alert = page.locator(".n-alert").first();
  await expect(alert).toBeVisible();
  await expect(alert).toHaveCSS("border-top-width", "0px");
  await expect(alert).toHaveCSS("box-shadow", "none");
  await expect(alert.locator("[data-slot=title]")).toHaveCSS("font-weight", "500");

  await page.goto("/docs/components/toast");
  const toast = page.locator(".n-toast").first();
  await expect(toast).toBeVisible();
  await expect(toast).toHaveCSS("background-color", "rgba(0, 0, 0, 0.88)");
  await expect(toast).toHaveCSS("color", "rgb(255, 255, 255)");
  expect(await toast.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain(
    "blur(24px)",
  );
  await page.getByRole("button", { name: "Stack notifications" }).click();
  const toastClose = page.locator(".n-toast__close").first();
  await expect(toastClose).toBeVisible();
  await toastClose.hover();
  await expect(toastClose).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(toast).toHaveCSS("background-color", "rgba(0, 0, 0, 0.88)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "light"));

  await page.goto("/docs/components/table");
  const tableContainer = page.locator(".n-table-container").first();
  const selectedCell = page
    .locator('.n-table tbody tr:is([data-selected],[aria-current]:not([aria-current="false"]))')
    .first()
    .locator(":scope > :first-child");
  await expect(tableContainer).toBeVisible();
  expect(
    await tableContainer.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe("rgba(0, 0, 0, 0)");
  await expect(selectedCell).toHaveCSS("border-inline-start-width", "2px");
  await expect(selectedCell).toHaveCSS("transition-duration", "0.22s");
  const comfortableCellHeight = await selectedCell.evaluate(
    (element) => getComputedStyle(element).height,
  );
  await page.locator("html").evaluate((element) => element.setAttribute("data-density", "compact"));
  const compactCellHeight = await selectedCell.evaluate(
    (element) => getComputedStyle(element).height,
  );
  expect(Number.parseFloat(compactCellHeight)).toBeLessThan(
    Number.parseFloat(comfortableCellHeight),
  );

  await page.goto("/");
  const avatar = page.locator(".n-avatar").first();
  await expect(avatar).toBeVisible();
  await expect(avatar).toHaveCSS("border-color", "rgb(255, 255, 255)");
  await expect(avatar).toHaveCSS("font-weight", "500");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(avatar).toHaveCSS("border-color", "rgb(0, 0, 0)");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/docs/components/table");
  await expect(page.locator(".n-table tbody td").first()).toHaveCSS(
    "transition-duration",
    "0.001s",
  );

  await expectHealthyPage(page, problems);
});

test("keeps Navigation, Layout, and Overlays neutral, glassy, and causally animated", async ({
  page,
}) => {
  const problems = monitorPage(page);

  await page.goto("/docs/components/tabs");
  const tabs = page.locator(".n-tabs").first();
  await expect(tabs).toHaveAttribute("data-variant", "segmented");
  const tabsVisual = await tabs.evaluate((element) => {
    const indicator = element.querySelector(".n-tabs__indicator");
    const trigger = element.querySelector('[role="tab"]');
    return {
      indicatorShadow: getComputedStyle(indicator).boxShadow,
      triggerDuration: getComputedStyle(trigger).transitionDuration,
    };
  });
  expect(tabsVisual.indicatorShadow).not.toBe("none");
  expect(tabsVisual.triggerDuration).not.toBe("0s");

  await page.goto("/docs/components/dialog");
  const dialogTrigger = page.getByRole("button", { name: "Open dialog" });
  await dialogTrigger.click();
  const dialog = page.getByRole("dialog", { name: "Share collection" });
  await expect(dialog).toBeVisible();
  const dialogVisual = await dialog.evaluate((element) => {
    const style = getComputedStyle(element);
    const backdrop = document.querySelector('[data-slot="backdrop"]');
    const footer = element.querySelector('[data-slot="footer"]');
    const close = element.querySelector('[data-slot="close"]');
    return {
      animationName: style.animationName,
      backdropFilter: getComputedStyle(backdrop).backdropFilter,
      background: style.backgroundColor,
      borderWidth: style.borderWidth,
      closeVariant: close?.getAttribute("data-variant"),
      color: style.color,
      footerJustify: getComputedStyle(footer).justifyContent,
      surfaceFilter: style.backdropFilter,
    };
  });
  expect(dialogVisual.background).toBe("rgba(0, 0, 0, 0.88)");
  expect(dialogVisual.color).toBe("rgb(255, 255, 255)");
  expect(dialogVisual.borderWidth).toBe("0px");
  expect(dialogVisual.surfaceFilter).toContain("blur(24px)");
  expect(dialogVisual.backdropFilter).toContain("blur(10px)");
  expect(dialogVisual.animationName).toContain("n-dialog-enter");
  expect(dialogVisual.closeVariant).toBe("secondary");
  expect(dialogVisual.footerJustify).toBe("flex-end");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(dialog).toHaveCount(0);
  await expect(dialogTrigger).toBeFocused();

  const safeAreaSession = await page.context().newCDPSession(page);
  await safeAreaSession.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 47, right: 80, bottom: 34, left: 40 },
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/sheet");
  await page.getByRole("button", { name: "Open settings" }).click();
  const sheet = page.getByRole("dialog", { name: "Workspace settings" });
  await expect(sheet).toBeVisible();
  await sheet.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  const sheetVisual = await sheet.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const footer = element.querySelector('[data-slot="sheet-footer"]');
    return {
      animationName: style.animationName,
      borderRadius: Number.parseFloat(style.borderRadius),
      footerJustify: getComputedStyle(footer).justifyContent,
      leftInset: rect.left,
      rightInset: window.innerWidth - rect.right,
      surfaceFilter: style.backdropFilter,
      topInset: rect.top,
    };
  });
  expect(sheetVisual.animationName).toContain("n-sheet-enter-right");
  expect(sheetVisual.borderRadius).toBeGreaterThan(0);
  expect(sheetVisual.footerJustify).toBe("flex-end");
  expect(sheetVisual.leftInset).toBeGreaterThanOrEqual(40);
  expect(sheetVisual.rightInset).toBeGreaterThanOrEqual(80);
  expect(sheetVisual.topInset).toBeGreaterThanOrEqual(47);
  expect(sheetVisual.surfaceFilter).toContain("blur(24px)");
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(sheet).toHaveCount(0);

  await page.getByRole("button", { name: "Open mobile navigation" }).click();
  const navigationSheet = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(navigationSheet).toHaveAttribute("data-side", "left");
  await expect(navigationSheet.getByRole("button", { name: "Close sheet" })).toHaveAttribute(
    "data-variant",
    "secondary",
  );
  await navigationSheet.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
  const navigationBounds = await navigationSheet.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, right: window.innerWidth - rect.right };
  });
  expect(navigationBounds.left).toBeGreaterThanOrEqual(40);
  expect(navigationBounds.right).toBeGreaterThanOrEqual(80);
  await navigationSheet.getByRole("button", { name: "Close sheet" }).click();

  await safeAreaSession.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.goto("/docs/components/command-primitive");
  const commandVisual = await page
    .locator(".n-command")
    .first()
    .evaluate((element) => {
      const style = getComputedStyle(element);
      const inputGroup = element.querySelector('[data-slot="command-input-group"]');
      return {
        background: style.backgroundColor,
        inputRadius: Number.parseFloat(getComputedStyle(inputGroup).borderRadius),
        surfaceFilter: style.backdropFilter,
      };
    });
  expect(commandVisual.background).toBe("rgba(0, 0, 0, 0.88)");
  expect(commandVisual.inputRadius).toBeGreaterThan(100);
  expect(commandVisual.surfaceFilter).toContain("blur(24px)");

  await page.goto("/docs/components/popover");
  await page.getByRole("button", { name: "Filters" }).click();
  const popover = page.locator(".n-popover__content");
  await expect(popover).toBeVisible();
  const popoverVisual = await popover.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      background: style.backgroundColor,
      padding: Number.parseFloat(style.paddingTop),
      radius: Number.parseFloat(style.borderRadius),
      surfaceFilter: style.backdropFilter,
    };
  });
  expect(popoverVisual.background).toBe("rgba(0, 0, 0, 0.88)");
  expect(popoverVisual.padding).toBeGreaterThan(0);
  expect(popoverVisual.radius).toBeGreaterThan(0);
  expect(popoverVisual.surfaceFilter).toContain("blur(24px)");

  await page.goto("/docs/components/tooltip");
  const tooltipTrigger = page.getByRole("button", { name: "Copy link" });
  await tooltipTrigger.scrollIntoViewIfNeeded();
  await tooltipTrigger.focus();
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toBeVisible({ timeout: 10_000 });
  await expect(tooltip).toHaveCSS("background-color", "rgba(0, 0, 0, 0.88)");
  expect(await tooltip.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain(
    "blur(24px)",
  );

  await page.goto("/docs/components/dropdown-menu");
  await page.getByRole("button", { name: "Actions", exact: true }).click();
  const dropdown = page.locator(".n-dropdown");
  await expect(dropdown).toBeVisible();
  const dropdownVisual = await dropdown.evaluate((element) => {
    const style = getComputedStyle(element);
    const item = element.querySelector('[data-slot="item"]');
    return {
      background: style.backgroundColor,
      itemDuration: getComputedStyle(item).transitionDuration,
      radius: Number.parseFloat(style.borderRadius),
      surfaceFilter: style.backdropFilter,
    };
  });
  expect(dropdownVisual.background).toBe("rgba(0, 0, 0, 0.88)");
  expect(dropdownVisual.itemDuration).not.toBe("0s");
  expect(dropdownVisual.radius).toBe(popoverVisual.radius);
  expect(dropdownVisual.surfaceFilter).toContain("blur(24px)");

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
  const tooltipTrigger = page.getByRole("button", { name: "Copy link" });
  await expect(tooltipTrigger).toBeVisible();
  await tooltipTrigger.scrollIntoViewIfNeeded();
  await tooltipTrigger.hover();
  await expect(page.getByRole("tooltip")).toBeVisible({ timeout: 10_000 });

  await page.goto("/docs/components/popover");
  const popoverTrigger = page.getByRole("button", { name: "Filters" });
  await expect(popoverTrigger).toBeVisible();
  await popoverTrigger.click();
  await expect(page.getByRole("heading", { name: "View filters" })).toBeVisible({
    timeout: 10_000,
  });

  await page.goto("/docs/components/dropdown-menu");
  const menuTrigger = page.getByRole("button", { name: "Actions", exact: true });
  await expect(menuTrigger).toBeVisible();
  await menuTrigger.click();
  await expect(page.getByRole("menuitem", { name: "Archive" })).toBeVisible({ timeout: 10_000 });

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
