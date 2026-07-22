import { expect, test } from "@playwright/test";

const categoryFixtures = {
  foundation: ["typography", "kbd", "icon"],
  actions: ["button", "button-group"],
  forms: [
    "input",
    "file-input",
    "input-group",
    "textarea",
    "label",
    "field",
    "form-message",
    "form-group",
    "checkbox",
    "radio-group",
    "switch",
    "select",
    "slider",
  ],
  data: ["card", "badge", "avatar", "table", "item", "list", "separator", "key-value", "stat"],
  feedback: ["alert", "toast", "progress", "skeleton", "empty-state", "spinner"],
  navigation: ["tabs", "breadcrumbs", "pagination", "sidebar-primitive", "command-primitive"],
  overlays: ["dialog", "sheet", "popover", "tooltip", "dropdown-menu"],
};

const matrixSections = [
  "typography",
  "button",
  "input",
  "file-input",
  "slider",
  "card",
  "alert",
  "tabs",
];

async function prepareFixture(page) {
  await page.route("https://mc.yandex.ru/**", (route) => route.abort());
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
  await page.goto("/visual-test");
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      .docs-header,
      .docs-footer,
      .nerio-orb,
      nextjs-portal,
      .component-lab-hero,
      .component-lab-index { display: none !important; }
      .docs-content,
      .docs-main { display: block !important; inline-size: 100% !important; margin: 0 !important; padding: 0 !important; }
      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }
    `,
  });
  await expect(page.locator('[data-visual-test-ready="true"]')).toBeVisible();
}

async function showSections(page, sectionIds) {
  await page.locator(".component-lab-section").evaluateAll((sections, visibleIds) => {
    for (const section of sections) {
      section.hidden = !visibleIds.includes(section.id);
    }
  }, sectionIds);
}

async function setAppearance(
  page,
  { theme = "purple", mode = "light", density = "comfortable", direction = "ltr" } = {},
) {
  await page.locator("html").evaluate(
    (root, appearance) => {
      root.dataset.theme = appearance.theme;
      root.dataset.mode = appearance.mode;
      root.dataset.density = appearance.density;
      root.dir = appearance.direction;
    },
    { theme, mode, density, direction },
  );
}

async function captureFixture(page, name) {
  await expect(page.locator("[data-visual-test-fixture]")).toHaveScreenshot(name);
}

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes("reduced-motion")) {
    await page.emulateMedia({ reducedMotion: "reduce" });
  }
  await prepareFixture(page);
  await setAppearance(page);
});

for (const [category, sections] of Object.entries(categoryFixtures)) {
  test(`protects the ${category} category`, async ({ page }) => {
    await showSections(page, sections);
    await captureFixture(page, `category-${category}.png`);
  });
}

const appearanceMatrix = [
  { name: "purple-light-comfortable-desktop" },
  { name: "purple-dark-comfortable-desktop", mode: "dark" },
  { name: "purple-light-compact-desktop", density: "compact" },
  { name: "blue-light-comfortable-desktop", theme: "blue" },
  { name: "purple-light-comfortable-rtl", direction: "rtl" },
];

for (const appearance of appearanceMatrix) {
  test(`protects ${appearance.name}`, async ({ page }) => {
    await setAppearance(page, appearance);
    await showSections(page, matrixSections);
    await captureFixture(page, `${appearance.name}.png`);
  });
}

test("protects purple light comfortable mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await showSections(page, matrixSections);
  await captureFixture(page, "purple-light-comfortable-mobile.png");
});

async function prepareOverlayFixture(page) {
  await showSections(page, categoryFixtures.overlays);
}

test("protects reduced-motion dialog end state", async ({ page }) => {
  await prepareOverlayFixture(page);
  await page.getByRole("button", { name: "Open dialog" }).click();
  const dialog = page.getByRole("dialog", { name: "Invite people" });
  await expect(dialog).toBeVisible();
  await expect(page).toHaveScreenshot("overlay-dialog-reduced-motion.png");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("protects reduced-motion sheet end state", async ({ page }) => {
  await prepareOverlayFixture(page);
  await page.getByRole("button", { name: "right · md" }).click();
  const sheet = page.getByRole("dialog", { name: "right sheet" });
  await expect(sheet).toBeVisible();
  await expect(page).toHaveScreenshot("overlay-sheet-reduced-motion.png");
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
});

test("protects reduced-motion popover end state", async ({ page }) => {
  await prepareOverlayFixture(page);
  await page.getByRole("button", { name: "With heading" }).click();
  const popover = page.getByRole("dialog", { name: "Quick filters" });
  await expect(popover).toBeVisible();
  await expect(page).toHaveScreenshot("overlay-popover-reduced-motion.png");
  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();
});

test("protects reduced-motion dropdown end state", async ({ page }) => {
  await prepareOverlayFixture(page);
  await page.getByRole("button", { name: "Actions", exact: true }).click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(page).toHaveScreenshot("overlay-dropdown-reduced-motion.png");
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test("protects reduced-motion tooltip end state", async ({ page }) => {
  await prepareOverlayFixture(page);
  await page.getByRole("button", { name: "Copy link" }).hover();
  const tooltip = page.getByRole("tooltip", { name: "Copies the current URL" });
  await expect(tooltip).toBeVisible();
  await expect(page).toHaveScreenshot("overlay-tooltip-reduced-motion.png");
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();
});
