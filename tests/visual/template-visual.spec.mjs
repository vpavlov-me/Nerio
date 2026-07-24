import { expect, test } from "@playwright/test";

const workspaceRoute = "/views/operations-workspace";
const financeRoute = "/views/finance-assets";

async function prepareTemplate(page, viewport) {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize(viewport);
  await page.goto(workspaceRoute);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }
    `,
  });
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Product operations without a vertical bias",
    }),
  ).toBeVisible();
}

test("protects the Operations Workspace desktop preview", async ({ page }) => {
  await prepareTemplate(page, { width: 1440, height: 1000 });
  await expect(page).toHaveScreenshot("operations-workspace-desktop.png", { fullPage: true });
});

test("protects the Operations Workspace mobile preview", async ({ page }) => {
  await prepareTemplate(page, { width: 390, height: 844 });
  await expect(page).toHaveScreenshot("operations-workspace-mobile.png", { fullPage: true });
});

async function prepareFinanceTemplate(page, viewport) {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize(viewport);
  await page.goto(financeRoute);
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        caret-color: transparent !important;
        transition: none !important;
      }
    `,
  });
  await expect(page.getByRole("heading", { level: 2, name: "Portfolio movement" })).toBeVisible();
}

test("protects the Finance & Assets desktop preview", async ({ page }) => {
  await prepareFinanceTemplate(page, { width: 1440, height: 1000 });
  await expect(page).toHaveScreenshot("finance-assets-desktop.png", { fullPage: true });
});

test("protects the Finance & Assets mobile preview", async ({ page }) => {
  await prepareFinanceTemplate(page, { width: 390, height: 844 });
  await expect(page).toHaveScreenshot("finance-assets-mobile.png", { fullPage: true });
});
