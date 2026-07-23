import { expect, test } from "@playwright/test";

const publicBlocks = [
  ["sign-in", "Sign in"],
  ["create-account", "Create account"],
  ["reset-password", "Reset password"],
  ["profile-settings", "Profile settings"],
  ["security-settings", "Security settings"],
  ["notification-preferences", "Notification preferences"],
  ["table-toolbar", "Table toolbar"],
  ["account-summary", "Account summary"],
  ["empty-project", "Empty project"],
  ["file-upload-state", "File upload state"],
];

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

test("derives the public gallery, detail pages, and same-origin Views from one catalog", async ({
  page,
}) => {
  const problems = monitorPage(page);
  const requestedHosts = new Set();
  page.on("request", (request) => requestedHosts.add(new URL(request.url()).host));

  await page.goto("/blocks");
  await expect(
    page.getByRole("heading", { level: 1, name: "Start from one clear product task." }),
  ).toBeVisible();

  for (const [, title] of publicBlocks) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  }

  await page.getByRole("link", { name: "View details" }).first().click();
  await expect(page).toHaveURL(/\/blocks\/sign-in$/);
  const frame = page.locator('iframe[title="Sign in preview"]');
  await expect(frame).toHaveAttribute("src", "/views/blocks/sign-in");
  await expect(frame.contentFrame().getByRole("heading", { name: "Welcome back" })).toBeVisible();

  expect([...requestedHosts]).not.toContain("nerio-demo.vercel.app");
  expect(problems).toEqual([]);
});

test("renders every public Block View without documentation chrome", async ({ page }) => {
  const problems = monitorPage(page);

  for (const [slug] of publicBlocks) {
    await page.goto(`/views/blocks/${slug}`);
    await expect(page.locator(".composition-preview")).toBeVisible();
    await expect(page.locator(".docs-header")).toHaveCount(0);
  }

  expect(problems).toEqual([]);
});

test("keeps internal fixtures unindexed and outside the public catalog", async ({ page }) => {
  const problems = monitorPage(page);

  await page.goto("/blocks");
  await expect(page.getByText("Overlay playground")).toHaveCount(0);
  await expect(page.getByText("Dense form")).toHaveCount(0);

  for (const slug of ["overlay-playground", "navigation-patterns", "dense-form", "feedback"]) {
    await page.goto(`/visual-test/blocks/${slug}`);
    await expect(page.getByText("Internal deterministic fixture")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator(".docs-header")).toHaveCount(0);
  }

  expect(problems).toEqual([]);
});

test("redirects legacy public and internal composition routes", async ({ request }) => {
  const cases = [
    ["/docs/blocks/login", "/blocks/sign-in"],
    ["/docs/blocks/settings-form", "/blocks/profile-settings"],
    ["/docs/compositions/user-profile", "/blocks/account-summary"],
    ["/docs/blocks/overlay-playground", "/visual-test/blocks/overlay-playground"],
    ["/docs/compositions/dense-form", "/visual-test/blocks/dense-form"],
  ];

  for (const [route, destination] of cases) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(destination);
  }
});

test("supports responsive, dark, compact, RTL, and keyboard Block behavior", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/views/blocks/table-toolbar");
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "dark";
    document.documentElement.dataset.density = "compact";
    document.documentElement.dir = "rtl";
  });

  const search = page.getByRole("textbox", { name: "Search projects" });
  await search.focus();
  await expect(search).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Status filter" })).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow-x", "scroll");

  const firstSelection = page.getByRole("checkbox", { name: "Select Aster" });
  await firstSelection.check();
  await expect(page.getByText("1 selected")).toBeVisible();
  expect(problems).toEqual([]);
});
