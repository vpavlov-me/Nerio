import { expect, test } from "@playwright/test";

const workspaceRoute = "/views/operations-workspace";
const financeRoute = "/views/finance-assets";
const contentLibraryRoute = "/views/content-library";
const aiResearchRoute = "/views/ai-research-workspace";
const developerPortalRoute = "/views/developer-portal";
const supportDeskRoute = "/views/support-desk";

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

async function prepareContentLibraryTemplate(page, viewport) {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize(viewport);
  await page.goto(contentLibraryRoute);
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
    page.getByRole("heading", { level: 2, name: "Everything your team can publish" }),
  ).toBeVisible();
}

test("protects the Content Library desktop preview", async ({ page }) => {
  await prepareContentLibraryTemplate(page, { width: 1440, height: 1000 });
  await expect(page).toHaveScreenshot("content-library-desktop.png", { fullPage: true });
});

test("protects the Content Library mobile preview", async ({ page }) => {
  await prepareContentLibraryTemplate(page, { width: 390, height: 844 });
  await expect(page).toHaveScreenshot("content-library-mobile.png", { fullPage: true });
});

async function prepareAiResearchTemplate(page, viewport) {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize(viewport);
  await page.goto(aiResearchRoute);
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
    page.getByRole("heading", { level: 2, name: "Activation opportunity brief" }),
  ).toBeVisible();
}

test("protects the AI Research Workspace desktop preview", async ({ page }) => {
  await prepareAiResearchTemplate(page, { width: 1440, height: 1000 });
  await expect(page).toHaveScreenshot("ai-research-workspace-desktop.png", { fullPage: true });
});

test("protects the AI Research Workspace mobile preview", async ({ page }) => {
  await prepareAiResearchTemplate(page, { width: 390, height: 844 });
  await expect(page).toHaveScreenshot("ai-research-workspace-mobile.png", { fullPage: true });
});

async function prepareDeveloperPortal(page, viewport) {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize(viewport);
  await page.goto(developerPortalRoute);
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
    page.getByRole("heading", { name: "Build a connected workspace in minutes" }),
  ).toBeVisible();
}

test("protects the Developer Portal desktop preview", async ({ page }) => {
  await prepareDeveloperPortal(page, { width: 1440, height: 1000 });
  await expect(page).toHaveScreenshot("developer-portal-desktop.png", { fullPage: true });
});

test("protects the Developer Portal mobile preview", async ({ page }) => {
  await prepareDeveloperPortal(page, { width: 390, height: 844 });
  await expect(page).toHaveScreenshot("developer-portal-mobile.png", { fullPage: true });
});

async function prepareSupportDesk(page, viewport) {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
  await page.addInitScript(() => window.localStorage.clear());
  await page.setViewportSize(viewport);
  await page.goto(supportDeskRoute);
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
  await expect(page.getByRole("heading", { name: "My open tickets" })).toBeVisible();
}

test("protects the Support Desk desktop preview", async ({ page }) => {
  await prepareSupportDesk(page, { width: 1440, height: 1000 });
  await expect(page).toHaveScreenshot("support-desk-desktop.png", { fullPage: true });
});

test("protects the Support Desk mobile preview", async ({ page }) => {
  await prepareSupportDesk(page, { width: 390, height: 844 });
  await expect(page).toHaveScreenshot("support-desk-mobile.png", { fullPage: true });
});
