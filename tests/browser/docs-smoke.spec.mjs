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
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--n-font-size-md", "17px");
  });
  await expect(page.locator(".docs-footer")).toHaveCSS("font-size", "17px");
  const primaryHeroAction = page.getByRole("link", { name: "Get started", exact: true });
  await expect(primaryHeroAction).toHaveCount(1);
  const secondaryHeroAction = page
    .locator(".home-hero__actions")
    .getByRole("link", { name: "Playground", exact: true });
  await expect(secondaryHeroAction).toHaveAttribute("href", "/playground");
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
  const documentationTypeScale = await page.evaluate(() => {
    const readSize = (selector) =>
      Number.parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
    return {
      body: readSize("body"),
      h1: readSize(".doc-page h1"),
      h2: readSize(".doc-section > h2"),
      h3: readSize(".doc-section > h3"),
    };
  });
  expect(documentationTypeScale.body).toBe(14);
  expect(documentationTypeScale.h3).toBeCloseTo(22.5, 1);
  expect(documentationTypeScale.h2).toBeCloseTo(25.25, 1);
  expect(documentationTypeScale.h1).toBeGreaterThan(documentationTypeScale.h2);

  const inlineCode = page
    .locator(".doc-section > p code")
    .filter({ hasText: /^@nerio-ui\/ui\/styles\.css$/ });
  const proseLink = page
    .locator(".doc-section > p")
    .getByRole("link", { name: "platform support policy", exact: true });
  await expect(inlineCode).toBeAttached();
  await expect(proseLink).toBeAttached();
  const [inlineCodeHandle, proseLinkHandle] = await Promise.all([
    inlineCode.elementHandle(),
    proseLink.elementHandle(),
  ]);
  if (!inlineCodeHandle || !proseLinkHandle) {
    throw new Error("Documentation prose fixtures detached before style inspection.");
  }
  const proseStyles = await page.evaluate(
    ({ code, link }) => {
      const tokenProbe = document.createElement("span");
      tokenProbe.style.backgroundColor = "var(--n-color-surface-control)";
      tokenProbe.style.color = "var(--n-color-text-secondary)";
      tokenProbe.style.fontSize = "var(--n-docs-prose-font-size)";
      tokenProbe.style.lineHeight = "var(--n-docs-prose-line-height)";
      document.body.append(tokenProbe);
      const tokenStyle = getComputedStyle(tokenProbe);
      const expected = {
        codeBackground: tokenStyle.backgroundColor,
        codeColor: tokenStyle.color,
        proseFontSize: tokenStyle.fontSize,
        proseLineHeight: tokenStyle.lineHeight,
      };
      tokenProbe.style.color = "var(--n-link-color)";
      const linkColor = getComputedStyle(tokenProbe).color;
      tokenProbe.remove();

      const prose = code.closest("p");
      const codeStyle = getComputedStyle(code);
      const linkStyle = getComputedStyle(link);
      return {
        ...expected,
        linkColor,
        actualCodeBackground: codeStyle.backgroundColor,
        actualCodeColor: codeStyle.color,
        codeBorderStyle: codeStyle.borderStyle,
        codeRadius: codeStyle.borderRadius,
        codePaddingInline: codeStyle.paddingInline,
        actualProseFontSize: getComputedStyle(prose).fontSize,
        actualProseLineHeight: getComputedStyle(prose).lineHeight,
        actualLinkColor: linkStyle.color,
        linkDecoration: linkStyle.textDecorationLine,
      };
    },
    { code: inlineCodeHandle, link: proseLinkHandle },
  );
  expect(proseStyles).toMatchObject({
    actualCodeBackground: proseStyles.codeBackground,
    actualCodeColor: proseStyles.codeColor,
    codeBorderStyle: "none",
    codeRadius: "4px",
    codePaddingInline: "4px",
    actualProseFontSize: proseStyles.proseFontSize,
    actualProseLineHeight: proseStyles.proseLineHeight,
    actualLinkColor: proseStyles.linkColor,
    linkDecoration: "underline",
  });

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
  await expect(page.getByText('label="Toggle sidebar"', { exact: false }).first()).toBeVisible();
  await expect(page.locator("#usage").locator("..").locator(".sidebar-doc-examples")).toHaveCount(
    0,
  );

  await page.goto("/docs/components/stat");

  for (const heading of [
    "Overview and decision boundary",
    "Installation and imports",
    "Usage",
    "Accessibility",
    "API",
    "Styling contract",
  ]) {
    await expect(page.getByRole("heading", { name: heading })).toBeAttached();
  }

  await expect(page.getByText("v1.0.0", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Purple", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Comfortable", exact: true })).toHaveCount(0);
  const search = page.getByRole("button", { name: "Search documentation" });
  await search.hover();
  await expect(page.getByRole("tooltip", { name: "Search documentation (/ or ⌘K)" })).toBeVisible();
  await expect(page.getByRole("tooltip")).toHaveCount(1);
  const colorMode = page.getByRole("button", { name: "Color mode: System" });
  await colorMode.hover();
  await expect(page.getByRole("tooltip", { name: "Color mode: System" })).toBeVisible();
  await expect(page.getByRole("tooltip")).toHaveCount(1);
  const github = page.getByRole("link", { name: "View Nerio on GitHub", exact: true });
  await expect(github.locator('img[src="/brand/github-invertocat-black.svg"]')).toBeAttached();
  await github.hover();
  await expect(page.getByRole("tooltip")).toHaveCount(0);

  await colorMode.click();
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
  await expect(
    page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Playground", exact: true }),
  ).toHaveAttribute("href", "/playground");
  await expect(page.getByRole("link", { name: "Blocks", exact: true })).toHaveAttribute(
    "href",
    "/blocks",
  );
  await expect(page.getByRole("link", { name: "Templates", exact: true })).toHaveAttribute(
    "href",
    "/templates",
  );
  const homepageToggle = page.getByRole("button", { name: "Follow updates" });
  await expect(homepageToggle).toHaveClass(/n-toggle/);
  await expect(homepageToggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("46 Components", { exact: true })).toBeVisible();

  const actionMenu = page.locator(".home-gallery__action-dropdown");
  await expect(page.getByRole("heading", { name: "Team members" })).toBeVisible();
  const memberActions = page.getByRole("button", { name: "Actions for Maya Chen" });
  await expect(memberActions).toBeVisible();
  await expect(actionMenu).toHaveCount(0);
  await memberActions.click();
  await expect(actionMenu).toBeVisible();
  const teamHeaderSpacing = await page.locator(".home-gallery__team-header").evaluate((element) => {
    const title = element.querySelector("h3");
    const description = element.querySelector("p");
    return {
      gap: description.getBoundingClientRect().top - title.getBoundingClientRect().bottom,
      marginTop: getComputedStyle(description).marginTop,
    };
  });
  expect(teamHeaderSpacing).toEqual({ gap: 4, marginTop: "0px" });
  await expect(page.getByRole("menuitem", { name: "View profile" })).toBeVisible();
  await expect(page.getByText("Member", { exact: true })).toBeVisible();
  await expect(page.getByText("Access", { exact: true })).toBeVisible();
  await expect(page.locator('[data-slot="separator"]')).toHaveCount(1);
  const actionMenuVisual = await actionMenu.evaluate((element) => {
    const style = getComputedStyle(element);
    const firstGroup = element.querySelector('[data-slot="group"]');
    const [firstItem, secondItem] = firstGroup.querySelectorAll('[data-slot="item"]');
    const probe = document.createElement("div");
    probe.style.background = "var(--n-overlay-background)";
    document.body.append(probe);
    const tokenBackground = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return {
      groupGap: getComputedStyle(firstGroup).rowGap,
      itemGap: secondItem.getBoundingClientRect().top - firstItem.getBoundingClientRect().bottom,
      menuBackground: style.backgroundColor,
      menuGap: style.rowGap,
      tokenBackground,
    };
  });
  expect(actionMenuVisual).toMatchObject({
    groupGap: "0px",
    itemGap: 0,
    menuGap: "0px",
  });
  expect(actionMenuVisual.menuBackground).toBe(actionMenuVisual.tokenBackground);
  await expect(page.getByRole("heading", { name: "Start a group chat" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Start chat" })).toHaveAttribute(
    "data-variant",
    "outline",
  );
  await expect(page.getByLabel("Chat participants")).toBeVisible();
  await expect(page.locator('img[src="/brand/google-g.svg"]')).toBeAttached();
  await expect(page.locator('img[src="/brand/apple-logo.svg"]')).toBeAttached();

  await expectHealthyPage(page, problems);
});

test("applies every Playground control to the product scenario canvas", async ({ page }) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/playground");
  const canvas = page.getByRole("region", { name: "Nerio scenario canvas" });
  const playground = canvas;
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link"),
  ).toHaveText(["Playground", "Docs", "Components", "Blocks", "Templates"]);
  await expect(page.getByRole("heading", { name: "Playground", exact: true })).toBeAttached();
  expect(
    await page.evaluate(() => {
      const pageHeading = document.querySelector("h1");
      const settingsHeading = document.querySelector("#playground-theme-settings h2");
      return Boolean(
        pageHeading &&
        settingsHeading &&
        pageHeading.compareDocumentPosition(settingsHeading) & Node.DOCUMENT_POSITION_FOLLOWING,
      );
    }),
  ).toBe(true);
  await expect(page.locator(".playground-scene")).toHaveCount(35);
  await expect(page.locator('.playground-scene[data-variant="default"]')).toHaveCount(35);
  await expect(page.locator('.playground-scene[data-variant="secondary"]')).toHaveCount(0);
  await expect(page.locator('.playground-scene[data-span="2"]')).toHaveCount(3);
  await expect(page.locator(".playground-scene .n-card")).toHaveCount(0);
  await expect(page.locator(".playground-scene .n-calendar")).toHaveCount(0);
  const catalogGrid = await page.locator(".playground-masonry").evaluate((element) => ({
    columnGap: getComputedStyle(element).columnGap,
    columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
    display: getComputedStyle(element).display,
  }));
  expect(catalogGrid).toEqual({ columnGap: "32px", columns: 7, display: "grid" });
  await expect(page.locator(".playground-canvas__surface")).toHaveCSS("padding", "48px");
  const masonryOverlaps = await page.locator(".playground-masonry").evaluate((element) => {
    const cards = Array.from(element.querySelectorAll("[data-playground-card]"));
    const rectangles = cards.map((card) => card.getBoundingClientRect());
    let overlaps = 0;

    for (let first = 0; first < rectangles.length; first += 1) {
      for (let second = first + 1; second < rectangles.length; second += 1) {
        const inlineOverlap =
          Math.min(rectangles[first].right, rectangles[second].right) -
          Math.max(rectangles[first].left, rectangles[second].left);
        const blockOverlap =
          Math.min(rectangles[first].bottom, rectangles[second].bottom) -
          Math.max(rectangles[first].top, rectangles[second].top);
        if (inlineOverlap > 1 && blockOverlap > 1) overlaps += 1;
      }
    }

    return overlaps;
  });
  expect(masonryOverlaps).toBe(0);
  const masonryRows = await page
    .locator("[data-playground-card]")
    .evaluateAll((cards) => cards.map((card) => getComputedStyle(card).gridRow));
  expect(
    masonryRows.every(
      (row) => !row.includes("Infinity") && !row.includes("NaN") && !row.includes("auto"),
    ),
  ).toBe(true);
  const wideCardBalance = await page.locator(".playground-masonry").evaluate((element) => {
    const cards = Array.from(element.querySelectorAll("[data-playground-card]"));
    const gap = Number.parseFloat(getComputedStyle(element).columnGap);

    return {
      gap,
      imbalances: cards
        .filter((card) => card.getAttribute("data-span") === "2")
        .map((wideCard) => {
          const wideRect = wideCard.getBoundingClientRect();
          const samplePoints = [
            wideRect.left + wideRect.width * 0.25,
            wideRect.left + wideRect.width * 0.75,
          ];
          const cardsAbove = cards.filter((card) => {
            if (card === wideCard) return false;
            const rect = card.getBoundingClientRect();
            return rect.bottom <= wideRect.top + 1;
          });
          const skyline = samplePoints.map((samplePoint) =>
            Math.max(
              0,
              ...cardsAbove
                .map((card) => card.getBoundingClientRect())
                .filter((rect) => rect.left <= samplePoint && rect.right >= samplePoint)
                .map((rect) => rect.bottom),
            ),
          );

          return Math.abs(skyline[0] - skyline[1]);
        }),
    };
  });
  expect(
    wideCardBalance.imbalances.every((imbalance) => imbalance <= wideCardBalance.gap + 8),
  ).toBe(true);
  await expect(page.getByRole("radiogroup", { name: "Appearance" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Copy theme" })).toHaveCount(0);
  await expect(playground).toHaveAttribute("data-mode", "dark");
  const settings = page.locator("#playground-theme-settings");
  await expect(settings).toHaveAttribute("role", "complementary");
  await expect(settings).toHaveAttribute("aria-label", "Playground settings");
  await expect(settings.getByRole("combobox")).toHaveCount(9);
  await expect(page.getByRole("heading", { name: "Playground style", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Collapse settings" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Show settings" })).toHaveCount(0);
  await expect(settings.getByRole("combobox", { name: "UI scale" })).toBeVisible();
  await expect(settings.getByRole("combobox", { name: "Motion" })).toBeAttached();
  await expect(settings.getByRole("combobox", { name: "Font" })).toBeAttached();
  await expect(settings.getByRole("button", { name: "Shuffle" })).toBeVisible();
  await expect(settings.getByRole("button", { name: /Copy|Get code/i })).toHaveCount(0);
  await expect(settings.getByRole("heading", { name: "Color", exact: true })).toHaveCount(0);
  await expect(settings.getByRole("heading", { name: "Layout", exact: true })).toHaveCount(0);
  await expect(settings.getByRole("heading", { name: "Typography", exact: true })).toHaveCount(0);
  await expect(settings.getByRole("heading", { name: "Effects", exact: true })).toHaveCount(0);
  await expect(settings).not.toHaveAttribute("data-theme");
  await expect(settings).not.toHaveAttribute("data-mode");
  await expect(settings).not.toHaveAttribute("data-density");
  await expect(page.locator(".visual-playground")).not.toHaveAttribute("style");
  await expect(page.locator(".visual-playground")).not.toHaveAttribute("data-theme");
  await expect(page.locator(".visual-playground")).not.toHaveAttribute("data-mode");
  await expect(page.locator(".visual-playground")).not.toHaveAttribute("data-density");
  const workspace = page.locator(".visual-playground__workspace--radix");
  const settingsLayout = await workspace.evaluate((element) => {
    const canvasRect = element.querySelector(".playground-canvas").getBoundingClientRect();
    const settingsElement = element.querySelector("#playground-theme-settings");
    const settingsRect = settingsElement.getBoundingClientRect();
    return {
      canvasHeight: canvasRect.height,
      canvasLeft: canvasRect.left,
      canvasTop: canvasRect.top,
      settingsRight: settingsRect.right,
      settingsWidth: settingsRect.width,
      settingsTop: settingsRect.top,
      settingsHeight: settingsRect.height,
      settingsShadow: getComputedStyle(settingsElement).boxShadow,
    };
  });
  expect(Math.abs(settingsLayout.settingsTop - settingsLayout.canvasTop)).toBeLessThan(1);
  expect(settingsLayout.settingsRight).toBeLessThan(settingsLayout.canvasLeft);
  expect(Math.abs(settingsLayout.settingsHeight - settingsLayout.canvasHeight)).toBeLessThan(12);
  expect(settingsLayout.settingsWidth).toBeGreaterThanOrEqual(256);
  expect(settingsLayout.settingsWidth).toBeLessThanOrEqual(288);
  expect(settingsLayout.settingsShadow).toBe("none");
  await expect(settings.locator(".n-select-field").first()).toHaveCSS("gap", "6px");
  await expect(canvas).toHaveCSS("scrollbar-width", "none");
  const canvasHeaderGap = await page.evaluate(() => {
    const header = document.querySelector(".docs-header")?.getBoundingClientRect();
    const canvasElement = document.querySelector(".playground-canvas")?.getBoundingClientRect();
    if (!header || !canvasElement) return null;
    return canvasElement.top - header.bottom;
  });
  expect(canvasHeaderGap).not.toBeNull();
  expect(Math.abs(canvasHeaderGap)).toBeLessThan(1);
  await expect
    .poll(() =>
      canvas.evaluate((element) => ({ left: element.scrollLeft, top: element.scrollTop })),
    )
    .toEqual({ left: 0, top: 0 });
  await expect(
    page
      .getByRole("heading", { name: "Sign in", exact: true })
      .locator("xpath=ancestor::section[@data-playground-card]")
      .locator(".n-field")
      .filter({ has: page.getByText("Password", { exact: true }) }),
  ).toHaveCSS("gap", "6px");
  await expect(page.getByText("No projects yet", { exact: true })).toHaveCount(0);
  await expect(page.getByText("You're all caught up", { exact: true })).toHaveCount(0);
  await expect(
    page.locator('[data-slot="item-title"]').getByText("Design system release", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Maya mentioned you", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Command search" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Project navigation" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preview deployment" })).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Context menu" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Move task" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Project filters" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nerio launch", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Save filters" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset", exact: true })).toBeVisible();
  const projectFiltersCard = page
    .getByRole("heading", { name: "Project filters", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(projectFiltersCard.locator(".n-button-group")).toHaveCount(0);
  await expect(
    projectFiltersCard.getByRole("button", { name: "Reset", exact: true }),
  ).toHaveAttribute("data-variant", "secondary");
  await expect(
    projectFiltersCard.getByRole("button", { name: "Save filters", exact: true }),
  ).toHaveAttribute("data-variant", "primary");
  const deleteAccountCard = page
    .getByRole("heading", { name: "Delete account", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(deleteAccountCard.getByRole("button", { name: "Delete account" })).toHaveAttribute(
    "data-variant",
    "danger",
  );
  const activityFeedCard = page
    .getByRole("heading", { name: "Activity feed", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(activityFeedCard.locator(".n-item[data-size='sm']")).toHaveCount(3);
  const featureFlagsCard = page
    .getByRole("heading", { name: "Feature flags", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(featureFlagsCard.locator(".n-item[data-size='sm']")).toHaveCount(3);
  await expect(featureFlagsCard.getByRole("switch", { name: "Compact tables" })).toBeChecked();
  await expect(featureFlagsCard.getByRole("button", { name: "Compact tables" })).toHaveCount(0);
  const notificationsCard = page
    .getByRole("heading", { name: "Notifications", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(notificationsCard.getByRole("button", { name: "Save preferences" })).toHaveAttribute(
    "data-variant",
    "primary",
  );
  await expect(notificationsCard.locator(".n-item[data-size='sm']")).toHaveCount(1);
  await expect(notificationsCard.getByRole("switch", { name: "Quiet hours" })).toBeChecked();
  const socialLinksCard = page
    .getByRole("heading", { name: "Social links", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(socialLinksCard.getByText("Links open in a new tab.", { exact: true })).toHaveCount(
    0,
  );
  await expect(socialLinksCard.getByRole("button", { name: "Save links" })).toHaveAttribute(
    "data-variant",
    "primary",
  );
  const signInCard = page
    .getByRole("heading", { name: "Sign in", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(signInCard.locator(".n-kbd")).toHaveCount(0);
  const billingSummaryCard = page
    .getByRole("heading", { name: "Billing summary", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(billingSummaryCard.locator(".playground-key-value-row")).toHaveCount(3);
  const billingMetadataTypography = await billingSummaryCard
    .locator(".playground-key-value-row")
    .first()
    .evaluate((element) => ({
      label: getComputedStyle(element.querySelector("dt")).fontSize,
      value: getComputedStyle(element.querySelector("dd")).fontSize,
    }));
  expect(billingMetadataTypography.label).toBe(billingMetadataTypography.value);
  const accountAccessCard = page
    .getByRole("heading", { name: "Account access", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(accountAccessCard.locator(".n-item-group")).toHaveCSS("gap", "0px");
  await expect(accountAccessCard.locator(".n-item[data-size='sm']")).toHaveCount(3);
  const payoutCard = page
    .getByRole("heading", { name: "Payout threshold", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  const sliderMetrics = await payoutCard.locator(".n-slider").evaluate((element) => {
    const tokenProbe = document.createElement("span");
    tokenProbe.style.position = "fixed";
    tokenProbe.style.inset = "0";
    tokenProbe.style.pointerEvents = "none";
    tokenProbe.style.visibility = "hidden";
    tokenProbe.style.color = "var(--n-color-text-primary)";
    element.append(tokenProbe);
    const primaryTextColor = getComputedStyle(tokenProbe).color;
    tokenProbe.remove();

    return {
      controlHeight: Math.round(
        element.querySelector(".n-slider__control").getBoundingClientRect().height,
      ),
      description: getComputedStyle(element.querySelector(".n-slider__description")).fontSize,
      headerToTrack: Math.round(
        element.querySelector(".n-slider__track").getBoundingClientRect().top -
          element.querySelector(".n-slider__header").getBoundingClientRect().bottom,
      ),
      label: getComputedStyle(element.querySelector(".n-slider__label")).fontSize,
      labelColor: getComputedStyle(element.querySelector(".n-slider__label")).color,
      labelWeight: getComputedStyle(element.querySelector(".n-slider__label")).fontWeight,
      primaryTextColor,
      trackToDescription: Math.round(
        element.querySelector(".n-slider__description").getBoundingClientRect().top -
          element.querySelector(".n-slider__track").getBoundingClientRect().bottom,
      ),
      value: getComputedStyle(element.querySelector(".n-slider__value")).fontSize,
    };
  });
  expect(sliderMetrics).toMatchObject({
    controlHeight: 32,
    headerToTrack: 8,
    label: "14px",
    labelWeight: "400",
    trackToDescription: 8,
    value: "14px",
  });
  expect(sliderMetrics.labelColor).toBe(sliderMetrics.primaryTextColor);
  expect(Number.parseFloat(sliderMetrics.description)).toBeLessThan(
    Number.parseFloat(sliderMetrics.label),
  );
  const fieldLabelMetrics = await payoutCard
    .getByText("Notes", { exact: true })
    .evaluate((element) => {
      const tokenProbe = document.createElement("span");
      tokenProbe.style.position = "fixed";
      tokenProbe.style.inset = "0";
      tokenProbe.style.pointerEvents = "none";
      tokenProbe.style.visibility = "hidden";
      tokenProbe.style.color = "var(--n-color-text-primary)";
      element.append(tokenProbe);
      const primaryTextColor = getComputedStyle(tokenProbe).color;
      tokenProbe.remove();
      const style = getComputedStyle(element);
      return {
        color: style.color,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        primaryTextColor,
      };
    });
  expect(fieldLabelMetrics).toMatchObject({
    color: fieldLabelMetrics.primaryTextColor,
    fontSize: "14px",
    fontWeight: "400",
  });
  const milestoneCard = page
    .getByRole("heading", { name: "Set new milestone", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(milestoneCard.locator(".n-button-group")).toHaveCount(0);
  await expect(milestoneCard.getByRole("button", { name: "Cancel", exact: true })).toBeVisible();
  await expect(
    milestoneCard.getByRole("button", { name: "Set milestone", exact: true }),
  ).toBeVisible();
  const releaseCard = page
    .getByRole("heading", { name: "Release readiness", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  const segmentedTabsRadius = await releaseCard.locator(".n-tabs").evaluate((element) => ({
    indicatorHeight: element.querySelector(".n-tabs__indicator").getBoundingClientRect().height,
    indicator: Number.parseFloat(
      getComputedStyle(element.querySelector(".n-tabs__indicator")).borderRadius,
    ),
    list: Number.parseFloat(getComputedStyle(element.querySelector(".n-tabs__list")).borderRadius),
    trigger: Number.parseFloat(
      getComputedStyle(element.querySelector(".n-tabs__trigger")).borderRadius,
    ),
    triggerHeight: element.querySelector(".n-tabs__trigger").getBoundingClientRect().height,
  }));
  expect(segmentedTabsRadius.list).toBeGreaterThan(100);
  expect(segmentedTabsRadius.trigger).toBeGreaterThanOrEqual(segmentedTabsRadius.triggerHeight / 2);
  expect(segmentedTabsRadius.indicator).toBeGreaterThanOrEqual(
    segmentedTabsRadius.indicatorHeight / 2,
  );
  await expect(releaseCard.locator(".n-button-group")).toHaveCount(0);
  await expect(releaseCard.getByRole("button", { name: "Review", exact: true })).toBeVisible();
  await expect(releaseCard.getByRole("button", { name: "Approve", exact: true })).toBeVisible();
  expect(
    await releaseCard
      .locator(".n-card__footer")
      .evaluate((element) => getComputedStyle(element).gap),
  ).toBe("8px");
  const moveTaskCard = page
    .getByRole("heading", { name: "Move task", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(moveTaskCard.locator(".n-button-group")).toHaveCount(0);
  await expect(moveTaskCard.getByRole("button", { name: "Cancel", exact: true })).toHaveAttribute(
    "data-variant",
    "secondary",
  );
  await expect(
    moveTaskCard.getByRole("button", { name: "Move task", exact: true }),
  ).toHaveAttribute("data-variant", "primary");
  const loadingCard = page
    .getByRole("heading", { name: "Loading state", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(loadingCard.locator(".n-skeleton")).toHaveCount(3);
  await expect(loadingCard.getByText("Syncing", { exact: true })).toBeVisible();
  await expect(loadingCard.getByText("Fetching recent changes…", { exact: true })).toHaveCount(0);
  const planCard = page
    .getByRole("heading", { name: "Choose a plan", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  expect(
    await planCard
      .locator("[data-slot='option-label']")
      .evaluateAll((elements) => elements.map((element) => element.textContent?.trim())),
  ).toEqual(["Starter", "Studio", "Enterprise"]);
  expect(
    await planCard
      .locator("[data-slot='option-description']")
      .evaluateAll((elements) => elements.map((element) => element.textContent?.trim())),
  ).toEqual(["Free", "$48 per member", "Contact sales"]);
  await expect(
    planCard.getByText("Studio includes unlimited projects", { exact: true }),
  ).toHaveCount(0);
  const workspaceCard = page
    .getByRole("heading", { name: "Create workspace", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(
    workspaceCard
      .getByText("Nerio", { exact: true })
      .locator("xpath=ancestor::*[@data-slot='item']"),
  ).toHaveAttribute("data-variant", "outline");
  await expect(workspaceCard.getByLabel("Workspace name")).toHaveValue("Nerio");
  await expect(signInCard.getByLabel("Email")).toHaveValue("maya@nerio.dev");
  await expect(socialLinksCard.getByLabel("GitHub")).toHaveValue("github.com/vpavlov-me/Nerio");
  await expect(socialLinksCard.getByLabel("Website")).toHaveValue("nerio.vpavlov.com");
  await expect(page.getByText(/Northstar|Atlas/)).toHaveCount(0);
  const projectsCard = page
    .getByRole("heading", { name: "Projects", exact: true })
    .locator("xpath=ancestor::section[@data-playground-card]");
  await expect(projectsCard.locator(".n-item-group")).toHaveCSS("gap", "8px");
  await expect(projectsCard.locator('.n-item[data-variant="outline"]')).toHaveCount(3);
  await expect(settings.getByRole("button", { name: "Reset" })).toHaveCount(0);

  await page.getByRole("button", { name: "Color mode: System" }).click();
  await page.getByRole("menuitem", { name: "Light" }).click();
  await expect(playground).toHaveAttribute("data-mode", "light");
  await page.getByRole("button", { name: "Color mode: Light" }).click();
  await page.getByRole("menuitem", { name: "Dark" }).click();
  await expect(playground).toHaveAttribute("data-mode", "dark");
  await page.getByRole("button", { name: "Color mode: Dark" }).click();
  await page.getByRole("menuitem", { name: "System" }).click();
  await expect(playground).toHaveAttribute("data-mode", "dark");
  await expect(page.locator(".playground-masonry > .n-card").first()).toHaveCSS(
    "border-color",
    "rgba(255, 255, 255, 0.14)",
  );

  const canvasBackground = await canvas.evaluate((element) => {
    const probe = document.createElement("div");
    probe.style.background = "var(--n-color-surface-canvas)";
    element.append(probe);
    const expected = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return { actual: getComputedStyle(element).backgroundColor, expected };
  });
  expect(canvasBackground.actual).toBe(canvasBackground.expected);

  const workspaceBackground = await page
    .locator(".visual-playground__workspace--radix")
    .evaluate((element) => {
      const probe = document.createElement("div");
      probe.style.background = "var(--n-color-surface-canvas)";
      element.append(probe);
      const expected = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return { actual: getComputedStyle(element).backgroundColor, expected };
    });
  expect(workspaceBackground.actual).toBe(workspaceBackground.expected);

  const overflow = await canvas.evaluate((element) => ({
    bodyHeight: document.body.scrollHeight,
    viewportHeight: document.body.clientHeight,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.body.clientWidth,
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(overflow.bodyHeight).toBe(overflow.viewportHeight);
  expect(overflow.bodyWidth).toBe(overflow.viewportWidth);
  expect(overflow.scrollHeight).toBeGreaterThan(overflow.clientHeight);
  expect(overflow.scrollWidth).toBeGreaterThan(overflow.clientWidth);

  const setting = (label) => settings.getByRole("combobox", { name: label });
  const chooseSetting = async (label, option) => {
    await setting(label).click();
    await page.getByRole("option", { name: option, exact: true }).click();
  };
  const expectSegmentedTabsRadius = async (expected) => {
    await expect
      .poll(() =>
        releaseCard.locator(".n-tabs").evaluate((element) => {
          const list = element.querySelector(".n-tabs__list");
          const trigger = element.querySelector(".n-tabs__trigger");
          const indicator = element.querySelector(".n-tabs__indicator");
          return [list, trigger, indicator].map((part) =>
            part ? Number.parseFloat(getComputedStyle(part).borderRadius) : Number.NaN,
          );
        }),
      )
      .toEqual([expected, expected, expected]);
  };

  const settingsTokensBefore = await settings.evaluate((element) => {
    const style = getComputedStyle(element);
    const trigger = element.querySelector(".n-select-trigger");
    return {
      font: style.fontFamily,
      radius: getComputedStyle(trigger).borderRadius,
      space: style.getPropertyValue("--n-space-4").trim(),
    };
  });

  await setting("Accent color").click();
  const accentOptions = page.getByRole("option").filter({
    has: page.locator(".playground-color-option"),
  });
  await expect(accentOptions).toHaveCount(6);
  await expect(accentOptions.locator(".playground-color-option__swatch")).toHaveCount(6);
  await page.getByRole("option", { name: "Blue", exact: true }).click();
  await expect(settings.getByRole("button", { name: "Reset" })).toBeVisible();
  await chooseSetting("Density", "Compact");
  await chooseSetting("Radii", "Full");

  const firstScenarioCard = page.locator(".playground-masonry > .n-card").first();
  const firstScenarioButton = page.locator(".playground-masonry .n-button").first();
  const firstScenarioItem = page.locator(".playground-masonry .n-item").first();
  const firstScenarioTextarea = page.locator(".playground-masonry .n-textarea").first();
  const firstScenarioTable = page.locator(".playground-masonry .n-table-container").first();
  await expect(firstScenarioCard).toHaveCSS("padding", "20px");
  await expect(firstScenarioButton).toHaveCSS("height", "28px");
  await expect(firstScenarioItem).toHaveCSS("padding", "8px");
  await expectSegmentedTabsRadius(999);
  await expect(firstScenarioCard).toHaveCSS("border-radius", "28px");
  await expect(firstScenarioButton).toHaveCSS("border-radius", "999px");
  await expect(firstScenarioTextarea).toHaveCSS("border-radius", "16px");
  await expect(firstScenarioTable).toHaveCSS("border-radius", "16px");

  await chooseSetting("Radii", "Large");
  await expectSegmentedTabsRadius(12);
  await expect(firstScenarioCard).toHaveCSS("border-radius", "20px");
  await expect(firstScenarioButton).toHaveCSS("border-radius", "12px");
  await expect(firstScenarioTextarea).toHaveCSS("border-radius", "12px");
  await expect(firstScenarioTable).toHaveCSS("border-radius", "12px");
  await chooseSetting("Radii", "Medium");
  await expectSegmentedTabsRadius(8);
  await expect(firstScenarioCard).toHaveCSS("border-radius", "14px");
  await expect(firstScenarioButton).toHaveCSS("border-radius", "8px");
  await expect(firstScenarioTextarea).toHaveCSS("border-radius", "8px");
  await expect(firstScenarioTable).toHaveCSS("border-radius", "10px");
  await chooseSetting("Radii", "Small");
  await expectSegmentedTabsRadius(4);
  await expect(firstScenarioCard).toHaveCSS("border-radius", "8px");
  await expect(firstScenarioButton).toHaveCSS("border-radius", "4px");
  await expect(firstScenarioTextarea).toHaveCSS("border-radius", "4px");
  await expect(firstScenarioTable).toHaveCSS("border-radius", "8px");
  await chooseSetting("Radii", "None");
  await expectSegmentedTabsRadius(0);
  await expect(firstScenarioTextarea).toHaveCSS("border-radius", "0px");
  await expect(firstScenarioTable).toHaveCSS("border-radius", "0px");
  await chooseSetting("UI scale", "90%");
  const scaledTextSizes = await playground.evaluate((element) => {
    const style = getComputedStyle(element);
    return ["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl"].map((size) =>
      Number.parseFloat(style.getPropertyValue(`--n-font-size-${size}`)),
    );
  });
  expect(Math.min(...scaledTextSizes)).toBeGreaterThanOrEqual(12);
  await chooseSetting("UI scale", "110%");
  await chooseSetting("Motion", "Reduced");
  expect(
    await playground.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        instant: style.getPropertyValue("--n-duration-instant").trim(),
        fast: style.getPropertyValue("--n-duration-fast").trim(),
        normal: style.getPropertyValue("--n-duration-normal").trim(),
        slow: style.getPropertyValue("--n-duration-slow").trim(),
        translateSmall: style.getPropertyValue("--n-motion-translate-sm").trim(),
        translateMedium: style.getPropertyValue("--n-motion-translate-md").trim(),
        scale: style.getPropertyValue("--n-motion-scale-subtle").trim(),
        spinner: style.getPropertyValue("--n-spinner-duration").trim(),
        skeleton: style.getPropertyValue("--n-skeleton-duration").trim(),
      };
    }),
  ).toEqual({
    instant: "1ms",
    fast: "1ms",
    normal: "1ms",
    slow: "1ms",
    translateSmall: "0",
    translateMedium: "0",
    scale: "1",
    spinner: "1ms",
    skeleton: "2.4s",
  });
  await expect(playground.locator(".n-spinner").first()).toHaveCSS("animation-name", "none");
  const reducedSkeleton = playground.locator(".n-skeleton").first();
  await expect(reducedSkeleton).toHaveCSS("animation-name", "none");
  expect(
    await reducedSkeleton.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        actual: Number.parseFloat(style.opacity),
        expected: Number.parseFloat(style.getPropertyValue("--n-opacity-skeleton")),
      };
    }),
  ).toEqual({ actual: 0.82, expected: 0.82 });
  await chooseSetting("Motion", "Standard");
  await chooseSetting("Font", "Space Grotesk");
  await chooseSetting("Color mode", "Light");
  await expect(playground).toHaveAttribute("data-mode", "light");
  await page.getByRole("button", { name: "Color mode: System" }).click();
  await page.getByRole("menuitem", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
  await chooseSetting("Color mode", "Dark");
  await expect(playground).toHaveAttribute("data-nerio-theme-scope", "");
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "dark";
  });
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(playground).toHaveAttribute("data-mode", "dark");
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "light";
  });
  await expect(page.locator("html")).toHaveAttribute("data-mode", "light");
  await expect(playground).toHaveAttribute("data-mode", "dark");
  const isolatedModes = await page.evaluate(() => {
    const root = document.documentElement;
    const playground = document.querySelector("[data-playground-preview]");
    const indicator = playground?.querySelector(".n-tabs__indicator");
    return {
      canvasIndicator: getComputedStyle(playground)
        .getPropertyValue("--n-tabs-indicator-background")
        .trim(),
      globalIndicator: getComputedStyle(root)
        .getPropertyValue("--n-tabs-indicator-background")
        .trim(),
      indicatorBackground: getComputedStyle(indicator).backgroundColor,
    };
  });
  expect(isolatedModes.globalIndicator).toBe("#fff");
  expect(isolatedModes.canvasIndicator).not.toBe(isolatedModes.globalIndicator);
  expect(isolatedModes.indicatorBackground).toBe("rgba(255, 255, 255, 0.16)");

  await page.emulateMedia({ colorScheme: "light" });
  const nestedAxisResets = await page.evaluate(() => {
    const ancestor = document.createElement("div");
    ancestor.dataset.nerioThemeScope = "";
    ancestor.dataset.mode = "dark";
    ancestor.dataset.density = "compact";

    const probe = document.createElement("div");
    probe.dataset.nerioThemeScope = "";
    probe.dataset.mode = "system";
    probe.dataset.density = "comfortable";
    ancestor.append(probe);
    document.body.append(ancestor);
    const style = getComputedStyle(probe);
    const result = {
      colorScheme: style.colorScheme,
      controlHeight: style.getPropertyValue("--n-button-height-md").trim(),
      surface: style.getPropertyValue("--n-color-surface-canvas").trim(),
    };
    ancestor.remove();
    return result;
  });
  expect(nestedAxisResets).toEqual({
    colorScheme: "light",
    controlHeight: "2rem",
    surface: "#fff",
  });
  await chooseSetting("Panel style", "Flat");

  const settingsTokensAfter = await settings.evaluate((element) => {
    const style = getComputedStyle(element);
    const trigger = element.querySelector(".n-select-trigger");
    return {
      font: style.fontFamily,
      radius: getComputedStyle(trigger).borderRadius,
      space: style.getPropertyValue("--n-space-4").trim(),
    };
  });
  expect(settingsTokensAfter).toEqual(settingsTokensBefore);

  await expect(playground).toHaveAttribute("data-theme", "blue");
  await expect(playground).toHaveAttribute("data-mode", "dark");
  await expect(playground).toHaveAttribute("data-density", "compact");
  const applied = await playground.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      controlHeight: style.getPropertyValue("--n-button-height-md").trim(),
      duration: style.getPropertyValue("--n-duration-normal").trim(),
      font: style.getPropertyValue("--n-font-sans").trim(),
      fontFamily: style.fontFamily,
      radius: style.getPropertyValue("--n-radius-md").trim(),
      space: style.getPropertyValue("--n-space-4").trim(),
    };
  });
  expect(applied).toMatchObject({
    controlHeight: "30.8px",
    duration: "220ms",
    radius: "0px",
    space: "17.6px",
  });
  expect(applied.font).toContain("Space Grotesk");
  expect(applied.fontFamily).toContain("Space Grotesk");
  await expect
    .poll(() =>
      page.evaluate(async () => {
        await document.fonts.load('16px "Space Grotesk"');
        return Array.from(document.fonts).some(
          (face) => face.family.includes("Space Grotesk") && face.status === "loaded",
        );
      }),
    )
    .toBe(true);

  const darkTextBefore = await playground.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--n-color-text-secondary").trim(),
  );
  await setting("Neutral color").click();
  const neutralOptions = page.getByRole("option").filter({
    has: page.locator(".playground-color-option"),
  });
  await expect(neutralOptions).toHaveCount(6);
  await expect(neutralOptions.locator(".playground-color-option__swatch")).toHaveCount(6);
  await page.getByRole("option", { name: "Mauve", exact: true }).click();
  const darkTextAfter = await playground.evaluate((element) =>
    getComputedStyle(element).getPropertyValue("--n-color-text-secondary").trim(),
  );
  expect(darkTextAfter).not.toBe(darkTextBefore);

  const scrolled = await canvas.evaluate((element) => {
    element.scrollTo({ left: 600, top: 700 });
    return { left: element.scrollLeft, top: element.scrollTop };
  });
  expect(scrolled.left).toBeGreaterThan(0);
  expect(scrolled.top).toBeGreaterThan(0);

  await settings.getByRole("button", { name: "Reset" }).click();
  await expect(setting("Accent color")).toContainText("Purple");
  await expect(setting("Density")).toContainText("Comfortable");
  await expect(setting("UI scale")).toContainText("100%");
  await expect(setting("Motion")).toContainText("Calm");
  await expect(setting("Font")).toContainText("Geist");
  await expect(setting("Panel style")).toContainText("Raised");
  await expect(settings.getByRole("button", { name: "Reset" })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Playground scenarios and themed overlays interactive", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/playground");

  const settings = page.getByRole("complementary", { name: "Playground settings" });
  await settings.getByRole("combobox", { name: "Neutral color" }).click();
  await page.getByRole("option", { name: "Mauve", exact: true }).click();
  await settings.getByRole("combobox", { name: "UI scale" }).click();
  await page.getByRole("option", { name: "110%", exact: true }).click();
  await settings.getByRole("combobox", { name: "Font" }).click();
  await page.getByRole("option", { name: "Space Grotesk", exact: true }).click();

  await page.getByRole("button", { name: "Add social link" }).hover();
  const tooltip = page.getByRole("tooltip", { name: "Add another social link" });
  await expect(tooltip).toBeVisible();
  const tooltipPortal = tooltip.locator("xpath=ancestor::*[@data-playground-portal]");
  await expect(tooltipPortal).toHaveAttribute("data-nerio-theme-scope", "");
  await expect
    .poll(() =>
      tooltipPortal.evaluate((element) =>
        getComputedStyle(element).getPropertyValue("--n-space-4").trim(),
      ),
    )
    .toBe("17.6px");

  const checkbox = page.getByRole("checkbox", { name: "Send invitations now" });
  await expect(checkbox).toBeVisible();
  expect(
    await checkbox.evaluate((element) => Number.parseFloat(getComputedStyle(element).borderRadius)),
  ).toBeLessThanOrEqual(4);

  const groupedInput = page.getByRole("textbox", { name: "Email" });
  const inputGroup = groupedInput.locator("xpath=ancestor::*[contains(@class, 'n-input-group')]");
  const restingGroupBackground = await inputGroup.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  );
  await groupedInput.hover();
  await expect
    .poll(() => inputGroup.evaluate((element) => getComputedStyle(element).backgroundColor))
    .not.toBe(restingGroupBackground);
  const hoveredInputGroup = await inputGroup.evaluate((element) => {
    const input = element.querySelector(".n-input");
    return {
      groupBackground: getComputedStyle(element).backgroundColor,
      inputBackground: getComputedStyle(input).backgroundColor,
    };
  });
  expect(hoveredInputGroup.groupBackground).not.toBe(restingGroupBackground);
  expect(hoveredInputGroup.inputBackground).toBe("rgba(0, 0, 0, 0)");

  const calendar = page.getByRole("group", { name: "Choose date" });
  await expect(calendar).toHaveCount(0);
  await page.getByRole("button", { name: "Appointment date" }).click();
  await expect(calendar).toBeVisible();
  await expect(calendar.getByRole("button", { name: "August 18, 2026, Selected" })).toHaveAttribute(
    "data-selected",
    "",
  );
  await page.keyboard.press("Escape");
  await expect(calendar).toHaveCount(0);

  await page.getByRole("button", { name: "Open invite dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Invite teammates" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator("xpath=ancestor::*[@data-playground-portal]")).toHaveAttribute(
    "data-density",
    "comfortable",
  );
  await expect(dialog.locator("xpath=ancestor::*[@data-playground-portal]")).toHaveAttribute(
    "data-nerio-theme-scope",
    "",
  );
  await page.waitForTimeout(1_100);
  await dialog.getByRole("combobox", { name: "Role" }).click();
  const roleListbox = page.getByRole("listbox");
  await expect(roleListbox).toBeVisible();
  await expect(roleListbox.locator("xpath=ancestor::*[@data-playground-portal]")).toHaveAttribute(
    "data-nerio-theme-scope",
    "",
  );
  await expect(roleListbox.locator("xpath=ancestor::*[@data-playground-portal]")).toHaveAttribute(
    "data-mode",
    await dialog.locator("xpath=ancestor::*[@data-playground-portal]").getAttribute("data-mode"),
  );
  await page.keyboard.press("Escape");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(dialog.locator("xpath=ancestor::*[@data-playground-portal]")).toHaveAttribute(
    "data-mode",
    "dark",
  );
  await expect(dialog.locator("xpath=ancestor::*[@data-playground-portal]")).toHaveAttribute(
    "data-nerio-theme-scope",
    "",
  );
  await dialog.getByRole("button", { name: "Cancel" }).click();
  await expect(dialog).toBeHidden();

  await page.getByRole("button", { name: "Show success toast" }).click();
  const toast = page.locator(".n-toast").filter({ hasText: "Changes saved" });
  await expect(toast).toBeVisible();
  const toastTheme = await toast.evaluate((element) => {
    const viewport = element.closest(".n-toast-viewport");
    const probe = document.createElement("div");
    probe.style.background = "var(--n-overlay-background)";
    viewport.append(probe);
    const expectedBackground = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return {
      actualBackground: getComputedStyle(element).backgroundColor,
      expectedBackground,
      canvasMode: document.querySelector("[data-playground-preview]")?.dataset.mode,
      mode: viewport.dataset.mode,
      scoped: viewport.hasAttribute("data-nerio-theme-scope"),
      fontFamily: getComputedStyle(viewport).fontFamily,
    };
  });
  expect(toastTheme.actualBackground).toBe(toastTheme.expectedBackground);
  expect(toastTheme.mode).toBe(toastTheme.canvasMode);
  expect(toastTheme.scoped).toBe(true);
  expect(toastTheme.fontFamily).toContain("Space Grotesk");

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
  await expect(navigation.getByRole("link", { name: "Visual language", exact: true })).toHaveCount(
    0,
  );
  await expect(navigation.getByRole("navigation", { name: "Mobile documentation" })).toContainText(
    "Blocks",
  );
  await expect(navigation.getByRole("link", { name: "Blocks", exact: true })).toBeVisible();
  await navigation.getByRole("link", { name: "Tokens", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/foundations\/tokens$/);

  await page.getByRole("button", { name: "Search documentation" }).click();
  await page.getByRole("combobox", { name: "Search documentation" }).fill("Sign in");
  await expect(
    page.getByRole("option", { name: /^Sign in Sign in documentation and/ }),
  ).toBeVisible();
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "Search documentation" }).click();
  await page.getByRole("combobox", { name: "Search documentation" }).fill("Playground");
  await expect(page.getByRole("option", { name: /Playground/ })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/playground$/);
  await expectHealthyPage(page, problems);
});

test("publishes canonical discovery routes and redirects legacy compositions", async ({
  page,
  request,
}) => {
  const problems = monitorPage(page);
  const [homepage, sitemap, robots, llms, legacy] = await Promise.all([
    request.get("/"),
    request.get("/sitemap.xml"),
    request.get("/robots.txt"),
    request.get("/llms.txt"),
    request.get("/docs/compositions/login", { maxRedirects: 0 }),
  ]);

  expect(homepage.headers()["x-powered-by"]).toBeUndefined();
  expect(homepage.headers()["x-content-type-options"]).toBe("nosniff");
  expect(homepage.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(homepage.headers()["permissions-policy"]).toContain("camera=()");
  expect(homepage.headers()["strict-transport-security"]).toContain("max-age=31536000");
  expect(homepage.headers()["content-security-policy"]).toContain("object-src 'none'");
  expect(await sitemap.text()).not.toContain("/playground");
  expect(await sitemap.text()).toContain("/blocks");
  expect(await sitemap.text()).not.toContain("/blocks/sign-in");
  expect(await sitemap.text()).not.toContain("/views/blocks/");
  expect(await robots.text()).toContain("Sitemap: https://nerio.vpavlov.com/sitemap.xml");
  expect(await robots.text()).toContain("Disallow: /views/");
  expect(await robots.text()).toContain("Disallow: /visual-test/");
  const llmsText = await llms.text();
  expect(llmsText).toContain("Core `1.0.0` is the prepared stable candidate; it is not published.");
  expect(llmsText).toContain(
    "npm `latest` and `beta` still resolve to `1.0.0-beta.1`, while protected `alpha` remains on `0.1.0-alpha.2`.",
  );
  expect(llmsText).toContain("The public Blocks catalog is available at `/blocks`");
  expect(llmsText).not.toContain("/playground");
  expect(llmsText).not.toContain("nerio-preview-surfaces");
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("/views/blocks/sign-in");

  await page.goto("/views/blocks/sign-in");
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
  await expect
    .poll(() => reducedProbe.evaluate((element) => getComputedStyle(element).opacity))
    .toBe("0");
  await expect
    .poll(() =>
      reducedProbe.evaluate((element) => {
        const style = getComputedStyle(element);
        const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        const translateX = new DOMMatrixReadOnly(style.transform).m41;
        return Math.abs(translateX - -0.375 * rootFontSize);
      }),
    )
    .toBeLessThan(0.1);
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

  await page.goto("/");
  const linkButton = page.getByRole("button", { name: "Link", exact: true });
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
  await expect(card).toHaveCSS("border-top-width", "1px");
  await expect(card.locator("[data-slot=card-title]").first()).toHaveCSS("font-weight", "500");
  await expect(card.locator("[data-slot=card-title]").first()).toHaveCSS("font-size", "16px");
  await expect(card.locator("[data-slot=card-description]").first()).toHaveCSS("font-size", "14px");
  expect(await card.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  const lightCardBorder = await card.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(lightCardBorder).not.toBe("rgba(0, 0, 0, 0)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(card).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(card).toHaveCSS("border-top-width", "1px");
  const darkCardBorder = await card.evaluate((element) => getComputedStyle(element).borderTopColor);
  expect(darkCardBorder).not.toBe("rgba(0, 0, 0, 0)");
  expect(darkCardBorder).not.toBe(lightCardBorder);
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "light"));

  await page.goto("/docs/components/alert");
  const alert = page.locator(".n-alert").first();
  await expect(alert).toBeVisible();
  await expect(alert).toHaveCSS("border-top-width", "0px");
  await expect(alert).toHaveCSS("box-shadow", "none");
  await expect(alert.locator("[data-slot=title]")).toHaveCSS("font-weight", "500");

  await page.goto("/docs/components/toast");
  await page.getByRole("button", { name: "Stack notifications" }).click();
  const toastStack = page.locator(".n-toast--managed");
  await expect(toastStack).toHaveCount(3);
  const collapsedToastGeometry = await toastStack.evaluateAll((elements) =>
    elements.map((element) => {
      const bounds = element.getBoundingClientRect();
      const titleBounds = element.querySelector('[data-slot="title"]').getBoundingClientRect();
      return {
        titleTop: titleBounds.top,
        top: bounds.top,
      };
    }),
  );
  for (let index = 1; index < collapsedToastGeometry.length; index += 1) {
    expect(collapsedToastGeometry[index].top).toBeCloseTo(
      collapsedToastGeometry[index - 1].top - 8,
      1,
    );
    expect(collapsedToastGeometry[index].titleTop).toBeGreaterThanOrEqual(
      collapsedToastGeometry[index - 1].top,
    );
  }
  expect(
    await toastStack.evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).opacity),
    ),
  ).toEqual(["1", "1", "1"]);
  const toast = page.locator(".n-toast").first();
  await expect(toast).toBeVisible();
  await expect(toast).toHaveCSS("border-radius", "20px");
  await expect(toast).toHaveCSS("background-color", "rgb(255, 255, 255)");
  await expect(toast).toHaveCSS("color", "rgb(2, 6, 23)");
  expect(await toast.evaluate((element) => getComputedStyle(element).backdropFilter)).toContain(
    "blur(24px)",
  );
  const toastClose = page.locator(".n-toast__close").first();
  await expect(toastClose).toBeVisible();
  await toastClose.hover();
  await expect(toastClose).toHaveCSS("color", "rgb(2, 6, 23)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(toast).toHaveCSS("background-color", "rgb(0, 0, 0)");
  await expect(toast).toHaveCSS("color", "rgb(248, 250, 252)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "light"));

  await page.goto("/docs/components/table");
  const tableContainer = page.locator(".n-table-container").first();
  const tableShell = page.locator(".table-doc-product-shell").first();
  const selectedRow = tableContainer.locator("tbody tr").first();
  const selectedCell = selectedRow.locator(":scope > :first-child");
  await expect(tableContainer).toBeVisible();
  await expect(tableShell).toBeVisible();
  expect(
    await tableShell.evaluate((element) => getComputedStyle(element).backgroundColor),
  ).not.toBe("rgba(0, 0, 0, 0)");
  await expect(tableContainer).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await selectedRow.evaluate((element) => element.setAttribute("data-selected", ""));
  await expect(selectedCell).toHaveCSS("border-inline-start-width", "1px");
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

test("keeps Navigation, Layout, and Overlays neutral, adaptive, and causally animated", async ({
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
  expect(dialogVisual.background).toBe("rgb(255, 255, 255)");
  expect(dialogVisual.color).toBe("rgb(2, 6, 23)");
  expect(dialogVisual.borderWidth).toBe("1px");
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
  expect(commandVisual.background).toBe("rgb(255, 255, 255)");
  expect(commandVisual.inputRadius).toBeGreaterThan(0);
  expect(commandVisual.inputRadius).toBeLessThanOrEqual(24);
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
  expect(popoverVisual.background).toBe("rgb(255, 255, 255)");
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
  const tooltipVisual = await tooltip.evaluate((element) => {
    const arrow = element.querySelector('[data-slot="arrow"]');
    const popupBounds = element.getBoundingClientRect();
    const arrowBounds = arrow.getBoundingClientRect();
    return {
      arrowAttached: Math.abs(arrowBounds.top - popupBounds.bottom),
      arrowParent: arrow.parentElement === element,
      arrowSide: arrow.dataset.side,
      surfaceFilter: getComputedStyle(element).backdropFilter,
    };
  });
  expect(tooltipVisual.arrowParent).toBe(true);
  expect(tooltipVisual.arrowSide).toBe("top");
  expect(tooltipVisual.arrowAttached).toBeLessThanOrEqual(1);
  expect(tooltipVisual.surfaceFilter).toContain("blur(24px)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "dark"));
  await expect(tooltip).toHaveCSS("background-color", "rgba(0, 0, 0, 0.88)");
  await expect(tooltip).toHaveCSS("color", "rgb(255, 255, 255)");
  await page.locator("html").evaluate((element) => element.setAttribute("data-mode", "light"));

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
  expect(dropdownVisual.background).toBe("rgb(255, 255, 255)");
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
    if (route === "toast") {
      await page.getByRole("button", { name: "Stack notifications" }).click();
    }
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
  const settingsSheet = page.getByRole("dialog", { name: "Workspace settings" });
  await expect(settingsSheet.locator('[data-slot="sheet-title"]')).toHaveText("Workspace settings");

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
      switchOffset: Number.parseFloat(switchThumbStyle.translate),
      switchOffsetToken: Number.parseFloat(resolveToken("width", "--n-switch-thumb-offset")),
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
