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

test("derives the public screenshot gallery and same-origin Views from one catalog", async ({
  page,
}) => {
  const problems = monitorPage(page);
  const requestedHosts = new Set();
  page.on("request", (request) => requestedHosts.add(new URL(request.url()).host));

  await page.goto("/blocks");
  await expect(
    page.getByRole("heading", { level: 1, name: "Start from one clear product task." }),
  ).toBeVisible();

  for (const [slug, title] of publicBlocks) {
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
    const link = page.getByRole("link", { name: `Open ${title} preview` });
    const card = page.locator(".catalog-card").filter({ has: link });
    await expect(link).toHaveAttribute("href", `/views/blocks/${slug}`);
    await expect(link).not.toHaveAttribute("target", "_blank");
    await card.scrollIntoViewIfNeeded();
    const thumbnail = card.locator("iframe");
    await expect(thumbnail).toHaveAttribute("src", `/views/blocks/${slug}`);
    await expect(thumbnail).toHaveAttribute("tabindex", "-1");
    await expect(thumbnail).toHaveAttribute("aria-hidden", "true");
  }
  await expect(page.locator(".catalog-card img")).toHaveCount(0);
  await expect(page.getByText("View details")).toHaveCount(0);

  expect([...requestedHosts]).not.toContain("nerio-demo.vercel.app");
  expect(problems).toEqual([]);
});

test("renders every public Block View without documentation chrome", async ({ page }) => {
  const problems = monitorPage(page);

  for (const [slug] of publicBlocks) {
    await page.goto(`/views/blocks/${slug}`);
    await expect(page.locator(".block-view__content")).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Blocks" })).toHaveAttribute(
      "href",
      "/blocks",
    );
    await expect(page.locator(".docs-header")).toHaveCount(0);
  }

  expect(problems).toEqual([]);
});

test("renders the complete Sign in structure and interactions", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/blocks/sign-in");

  await expect(page.getByRole("heading", { name: "Login to your account" })).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveAttribute("placeholder", "m@example.com");
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByText("Forgot your password?")).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
  await expect(page.getByText("Don't have an account?")).toBeVisible();
  await expect(page.getByText("Sign up")).toBeVisible();
  await expect(page.getByText("Login with Google")).toHaveCount(0);
  await expect(page.locator(".composition-preview")).toHaveCount(0);
  await expect(page.locator(".block-view__content a")).toHaveCount(0);

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Enter a valid email address.")).toHaveCount(0);
  await expect(page.getByText("Ready to continue")).toHaveCount(0);
  expect(problems).toEqual([]);
});

test("renders the complete Create account structure as a static preview", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/blocks/create-account");

  await expect(page.getByText("Acme Inc.")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Create your account" })).toBeVisible();
  await expect(page.getByText("Enter your email below to create your account.")).toBeVisible();
  await expect(page.getByLabel("Full name")).toHaveAttribute("placeholder", "Vladimir Pavlov");
  await expect(page.getByLabel("Email")).toHaveAttribute("placeholder", "nerio@vpavlov.com");
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByLabel("Confirm password")).toBeVisible();
  await expect(page.getByText("Must be at least 8 characters long.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  await expect(page.getByText("Already have an account?")).toBeVisible();
  await expect(page.getByText("Sign in")).toBeVisible();
  await expect(page.getByText("Terms of Service")).toBeVisible();
  await expect(page.getByText("Privacy Policy")).toBeVisible();
  await expect(page.getByText("Email verification")).toHaveCount(0);
  await expect(page.locator(".block-view__content a")).toHaveCount(0);

  const url = page.url();
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(url);
  expect(problems).toEqual([]);
});

test("renders the complete Reset password structure as a static preview", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/blocks/reset-password");

  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
  await expect(
    page.getByText("Enter the email associated with your account and we’ll send you a reset link."),
  ).toBeVisible();
  await expect(page.getByLabel("Email")).toHaveAttribute("placeholder", "nerio@vpavlov.com");
  await expect(page.getByRole("button", { name: "Send reset link" })).toBeVisible();
  await expect(page.getByText("Remembered your password?")).toBeVisible();
  await expect(page.getByText("Sign in")).toBeVisible();
  await expect(page.locator(".block-view__content a")).toHaveCount(0);

  const url = page.url();
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page).toHaveURL(url);
  await expect(page.getByText("Enter a valid email address.")).toHaveCount(0);
  await expect(page.getByText("Check your inbox")).toHaveCount(0);
  expect(problems).toEqual([]);
});

test("renders the complete Profile settings structure as a static preview", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/blocks/profile-settings");

  await expect(page.getByRole("heading", { name: "Profile settings", exact: true })).toBeVisible();
  await expect(page.getByText("Manage how you appear across Nerio.")).toBeVisible();
  await expect(page.getByText("Vladimir Pavlov")).toBeVisible();
  await expect(page.getByText("nerio@vpavlov.com")).toBeVisible();
  await expect(page.getByRole("img", { name: "Vladimir Pavlov profile photo" })).toHaveAttribute(
    "src",
    "/avatars/lucas-moreau.png",
  );
  await expect(page.getByLabel("Profile photo")).toHaveAttribute("accept", "image/jpeg,image/png");
  await expect(page.getByLabel("Display name")).toHaveValue("Vladimir Pavlov");
  await expect(page.getByText("Shown across Nerio.")).toHaveCount(0);
  await expect(page.getByLabel("Bio")).toHaveValue(
    "Designing and maintaining Nerio for product teams.",
  );
  await expect(page.getByRole("switch", { name: "Show profile in workspace" })).toBeChecked();
  await expect(page.getByText("All changes saved")).toBeVisible();
  await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled();
  await expect(page.getByText("Profile saved")).toHaveCount(0);
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
    ["/docs/blocks/login", "/views/blocks/sign-in"],
    ["/docs/blocks/settings-form", "/views/blocks/profile-settings"],
    ["/docs/compositions/user-profile", "/views/blocks/account-summary"],
    ["/docs/blocks/overlay-playground", "/visual-test/blocks/overlay-playground"],
    ["/docs/compositions/dense-form", "/visual-test/blocks/dense-form"],
  ];

  for (const [route, destination] of cases) {
    const response = await request.get(route, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(destination);
  }

  for (const route of [
    "/blocks/sign-in",
    "/blocks/toString",
    "/views/blocks/toString",
    "/visual-test/blocks/toString",
    "/docs/blocks/toString",
    "/docs/compositions/toString",
  ]) {
    const response = await request.get(route);
    expect(response.status()).toBe(404);
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
