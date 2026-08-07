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

test("derives screenshot cards and same-origin previews from one route model", async ({ page }) => {
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
  const templates = [
    ["operations-workspace", "Operations Workspace"],
    ["finance-assets", "Finance & Assets"],
    ["content-library", "Content Library"],
    ["ai-research-workspace", "AI Research Workspace"],
    ["developer-portal", "Developer Portal"],
    ["support-desk", "Support Desk"],
  ];
  for (const [slug, title] of templates) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    const link = page.getByRole("link", { name: `Open ${title} preview in a new tab` });
    const card = page.locator(".catalog-card").filter({ has: link });
    await expect(link).toHaveAttribute("href", `/views/${slug}`);
    await expect(link).toHaveAttribute("target", "_blank");
    await card.scrollIntoViewIfNeeded();
    const thumbnail = card.locator("iframe");
    await expect(thumbnail).toHaveAttribute("src", `/views/${slug}`);
    await expect(thumbnail).toHaveAttribute("tabindex", "-1");
    await expect(thumbnail).toHaveAttribute("aria-hidden", "true");
  }
  await expect(page.locator(".catalog-card img")).toHaveCount(0);
  await expect(page.getByText("View details")).toHaveCount(0);
  expect(problems).toEqual([]);
  expect([...requestedHosts]).not.toContain("nerio-demo.vercel.app");
});

test("keeps live preview thumbnails synchronized with appearance tokens", async ({ page }) => {
  await page.goto("/templates");
  const thumbnail = page.locator(".catalog-card iframe").first();
  await expect(thumbnail).toBeAttached();

  await page.locator("html").evaluate((root) => root.setAttribute("data-mode", "dark"));
  await expect(thumbnail.contentFrame().locator("html")).toHaveAttribute("data-mode", "dark");

  await page.locator("html").evaluate((root) => root.setAttribute("data-mode", "light"));
  await expect(thumbnail.contentFrame().locator("html")).toHaveAttribute("data-mode", "light");
});

test("supports direct navigation and refresh without documentation chrome", async ({ page }) => {
  const problems = monitorPage(page);

  await page.goto(workspaceRoute);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Operations overview",
    }),
  ).toBeVisible();
  await expect(page.locator(".docs-header")).toHaveCount(0);

  await page.reload();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Operations overview",
    }),
  ).toBeVisible();
  await expect(page.locator(".docs-header")).toHaveCount(0);
  expect(problems).toEqual([]);
});

test("returns not found for unknown template and View slugs", async ({ page }) => {
  await page.goto("/templates/operations-workspace");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.goto("/templates/not-a-template");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.goto("/views/not-a-template");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
