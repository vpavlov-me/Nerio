import { expect, test } from "@playwright/test";

const workspaceRoute = "/views/operations-workspace";

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
});

test("derives the gallery, detail, and same-origin preview from one route model", async ({
  page,
}) => {
  const problems = monitorPage(page);
  const requestedHosts = new Set();
  page.on("request", (request) => requestedHosts.add(new URL(request.url()).host));

  await page.goto("/templates");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "See Nerio working in complete product interfaces.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Operations Workspace" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Finance & Assets" })).toBeVisible();

  await page
    .locator(".template-card")
    .filter({ hasText: "Operations Workspace" })
    .getByRole("link", { name: "View details" })
    .click();
  await expect(page).toHaveURL(/\/templates\/operations-workspace$/);
  const frame = page.locator('iframe[title="Operations Workspace preview"]');
  await expect(frame).toHaveAttribute("src", workspaceRoute);
  await expect(
    frame.contentFrame().getByRole("heading", {
      level: 1,
      name: "Product operations without a vertical bias",
    }),
  ).toBeVisible();

  expect([...requestedHosts]).not.toContain("nerio-demo.vercel.app");
  expect(problems).toEqual([]);
});

test("renders the Finance & Assets detail and same-origin preview from catalog metadata", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/templates/finance-assets");
  await expect(page.getByRole("heading", { level: 1, name: "Finance & Assets" })).toBeVisible();
  const frame = page.locator('iframe[title="Finance & Assets preview"]');
  await expect(frame).toHaveAttribute("src", "/views/finance-assets");
  await expect(
    frame.contentFrame().getByRole("heading", { level: 2, name: "Portfolio movement" }),
  ).toBeVisible();
  expect(problems).toEqual([]);
});

test("renders the Content Library detail and same-origin preview from catalog metadata", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/templates/content-library");
  await expect(page.getByRole("heading", { level: 1, name: "Content Library" })).toBeVisible();
  const frame = page.locator('iframe[title="Content Library preview"]');
  await expect(frame).toHaveAttribute("src", "/views/content-library");
  await expect(
    frame.contentFrame().getByRole("heading", { name: "Everything your team can publish" }),
  ).toBeVisible();
  expect(problems).toEqual([]);
});

test("renders the AI Research Workspace detail and same-origin preview from catalog metadata", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/templates/ai-research-workspace");
  await expect(
    page.getByRole("heading", { level: 1, name: "AI Research Workspace" }),
  ).toBeVisible();
  const frame = page.locator('iframe[title="AI Research Workspace preview"]');
  await expect(frame).toHaveAttribute("src", "/views/ai-research-workspace");
  await expect(
    frame.contentFrame().getByRole("heading", { name: "Activation opportunity brief" }),
  ).toBeVisible();
  expect(problems).toEqual([]);
});

test("renders the Developer Portal detail and same-origin preview from catalog metadata", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/templates/developer-portal");
  await expect(page.getByRole("heading", { level: 1, name: "Developer Portal" })).toBeVisible();
  const frame = page.locator('iframe[title="Developer Portal preview"]');
  await expect(frame).toHaveAttribute("src", "/views/developer-portal");
  await expect(
    frame.contentFrame().getByRole("heading", { name: "Build a connected workspace in minutes" }),
  ).toBeVisible();
  expect(problems).toEqual([]);
});

test("renders the Support Desk detail and same-origin preview from catalog metadata", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/templates/support-desk");
  await expect(page.getByRole("heading", { level: 1, name: "Support Desk" })).toBeVisible();
  const frame = page.locator('iframe[title="Support Desk preview"]');
  await expect(frame).toHaveAttribute("src", "/views/support-desk");
  await expect(
    frame.contentFrame().getByRole("heading", { name: "My open tickets" }),
  ).toBeVisible();
  expect(problems).toEqual([]);
});

test("supports direct navigation and refresh without documentation chrome", async ({ page }) => {
  const problems = monitorPage(page);

  await page.goto(workspaceRoute);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Product operations without a vertical bias",
    }),
  ).toBeVisible();
  await expect(page.locator(".docs-header")).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Product operations without a vertical bias",
    }),
  ).toBeVisible();
  await expect(page.locator(".docs-header")).toHaveCount(0);
  expect(problems).toEqual([]);
});

test("returns not found for unknown template and View slugs", async ({ page }) => {
  await page.goto("/templates/not-a-template");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.goto("/views/not-a-template");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
