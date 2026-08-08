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

test("centers every template within a 1200px content frame on wide screens", async ({ page }) => {
  const routes = ["/views/operations-workspace", "/views/finance-assets"];
  await page.setViewportSize({ width: 2560, height: 1200 });

  for (const route of routes) {
    await page.goto(route);
    const content = page.locator("[data-template-content]");
    await expect(content).toBeVisible();
    const contentBox = await content.boundingBox();
    expect(contentBox?.width, `${route} max width`).toBeCloseTo(1200, 0);

    const sidebar = page.locator('[data-slot="sidebar"]');
    const sidebarBox = (await sidebar.count()) > 0 ? await sidebar.boundingBox() : null;
    const availableStart = sidebarBox ? sidebarBox.x + sidebarBox.width : 0;
    const availableWidth = 2560 - availableStart;
    const expectedX = availableStart + (availableWidth - (contentBox?.width ?? 0)) / 2;
    expect(contentBox?.x, `${route} centered frame`).toBeCloseTo(expectedX, 0);
  }

  await page.goto("/views/finance-assets");
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  const collapsedContent = page.locator("[data-template-content]");
  const collapsedSidebar = page.locator('[data-slot="sidebar"]');
  await expect(collapsedSidebar).toHaveAttribute("data-state", "collapsed");
  await expect
    .poll(async () => Math.round((await collapsedSidebar.boundingBox())?.width ?? 0))
    .toBe(56);
  const collapsedContentBox = await collapsedContent.boundingBox();
  const collapsedExpectedX = 56 + (2560 - 56 - (collapsedContentBox?.width ?? 0)) / 2;
  expect(collapsedContentBox?.x, "collapsed sidebar content frame").toBeCloseTo(
    collapsedExpectedX,
    0,
  );
});

test("keeps template appearance settings out of documentation preferences", async ({ page }) => {
  await page.goto("/views/finance-assets");
  await page.getByRole("button", { name: "Open preview settings" }).click();
  const settings = page.getByRole("dialog", { name: "Preview settings" });
  await settings.getByRole("combobox", { name: "Mode" }).click();
  await page.getByRole("option", { name: "Dark" }).click();
  await settings.getByRole("combobox", { name: "Density" }).click();
  await page.getByRole("option", { name: "Compact" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  expect(
    await page.evaluate(() => ({
      density: window.localStorage.getItem("nerio-docs-density"),
      mode: window.localStorage.getItem("nerio-docs-mode"),
      theme: window.localStorage.getItem("nerio-docs-theme"),
    })),
  ).toEqual({ density: null, mode: null, theme: null });

  await page.goto("/templates");
  await expect(page.locator("html")).toHaveAttribute("data-mode", "system");
  await expect(page.locator("html")).toHaveAttribute("data-density", "comfortable");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "purple");
});

test("returns not found for unknown template and View slugs", async ({ page }) => {
  await page.goto("/templates/operations-workspace");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.goto("/templates/not-a-template");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  await page.goto("/views/not-a-template");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();

  for (const slug of [
    "content-library",
    "ai-research-workspace",
    "developer-portal",
    "support-desk",
  ]) {
    await page.goto(`/views/${slug}`);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  }
});
