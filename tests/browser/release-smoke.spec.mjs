import { expect, test } from "@playwright/test";

const themes = ["purple", "blue", "green", "orange", "red", "neutral"];
const modes = ["system", "light", "dark"];
const densities = ["comfortable", "compact"];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
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

async function expectHealthyPage(page, problems) {
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  expect(problems).toEqual([]);
}

test("covers the release appearance and responsive matrix without overflow", async ({ page }) => {
  const problems = monitorPage(page);
  const themeColors = new Map();

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Product operations without a vertical bias" }),
    ).toBeVisible();
    if (viewport.name === "mobile") {
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
            themeColors.set(theme, snapshot.accent);
          }
        }
      }
    }
  }

  expect(new Set(themeColors.values()).size).toBe(themes.length);
  await expectHealthyPage(page, problems);
});

test("covers focus, Sheet restoration, Table scrolling, and Sidebar collapse", async ({ page }) => {
  const problems = monitorPage(page);

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const rail = page.getByRole("button", { name: "Collapse workspace sidebar" });
  await rail.click();
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-state",
    "collapsed",
  );
  await expect(rail).toHaveAttribute("aria-expanded", "false");
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
  await expect(page.getByRole("heading", { name: "Workspace navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("heading", { name: "Workspace navigation" })).toBeHidden();
  await expect(sheetTrigger).toBeFocused();

  const table = page.getByRole("region", { name: "Workspace projects" });
  await table.focus();
  await expect(table).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);

  await expectHealthyPage(page, problems);
});

test("covers Command groups, IME safety, leading layout, and selection", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");
  await page.getByRole("button", { name: "Search workspace" }).click();
  const input = page.getByRole("combobox", { name: "Workspace commands" });

  await expect(page.getByText("Project filters", { exact: true })).toBeVisible();
  await expect(
    page.locator('[data-slot="command-group-label"]').filter({ hasText: "Display" }),
  ).toBeVisible();
  await expect(page.getByRole("option", { name: /Show all projects/ })).not.toHaveAttribute(
    "data-leading",
    "true",
  );
  await expect(page.getByRole("option", { name: /Show active projects/ })).toHaveAttribute(
    "data-leading",
    "true",
  );

  await input.dispatchEvent("compositionstart", { data: "活" });
  await input.press("Enter");
  await expect(input).toBeVisible();
  await input.dispatchEvent("compositionend", { data: "活" });
  await input.fill("active");
  await expect(page.getByRole("option", { name: /Show active projects/ })).toBeVisible();
  await page.getByRole("option", { name: /Show active projects/ }).click();
  await expect(page.getByRole("row", { name: /Content library/ })).toHaveCount(0);
  await expect(page.getByRole("row", { name: /Launch workspace/ })).toBeVisible();

  await expectHealthyPage(page, problems);
});

test("covers Toast stacking and logical swipe in LTR and RTL", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");
  const create = page.getByRole("button", { name: "Create project" });
  await create.click();
  await create.click();
  await create.click();

  const toasts = page.locator(".n-toast--managed");
  await expect(toasts).toHaveCount(3);
  const viewport = page.locator('[data-slot="viewport"]');
  await expect(viewport).toHaveAttribute("data-direction", "ltr");
  await expect(viewport).toHaveAttribute("data-swipe-direction", "right down");

  await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
  await expect(viewport).toHaveAttribute("data-direction", "rtl");
  await expect(viewport).toHaveAttribute("data-swipe-direction", "left down");

  const box = await toasts.first().boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x - box.width, box.y + box.height / 2, { steps: 6 });
  await page.mouse.up();
  await expect(toasts).toHaveCount(2);

  await expectHealthyPage(page, problems);
});

test("covers loading, empty, error, success, reduced motion, and forced colors", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ colorScheme: "dark", forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );

  await page.getByRole("button", { name: "Loading" }).click();
  await expect(page.getByLabel("Loading recent items")).toBeVisible();
  await page.getByRole("button", { name: "Error" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Activity source unavailable" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ready" }).click();
  await expect(page.getByRole("region", { name: "Workspace projects" })).toBeVisible();

  await page.getByRole("textbox", { name: "Search projects" }).fill("no-such-project");
  await expect(page.getByRole("status")).toContainText("No matching projects");
  await page.getByRole("button", { name: "Create project" }).click();
  await expect(
    page.locator(".n-toast--managed").filter({ hasText: "Project draft created" }),
  ).toBeVisible();

  await expectHealthyPage(page, problems);
});
