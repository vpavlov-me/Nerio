import { expect, test } from "@playwright/test";

const developerRoute = "/views/developer-portal";

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
  await page.addInitScript(() => {
    window.localStorage.clear();
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => undefined },
    });
  });
});

test("moves through quickstart examples and copies the active code", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(developerRoute);

  await expect(
    page.getByRole("heading", { name: "Build a connected workspace in minutes" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "TypeScript" }).click();
  await expect(page.getByText('import { Northstar } from "@northstar/sdk";')).toBeVisible();
  await page.getByRole("button", { name: "Copy" }).click();
  await expect(page.locator(".n-toast--managed")).toContainText("Code copied");

  await page.getByRole("button", { name: "Explore the API" }).click();
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  expect(problems).toEqual([]);
});

test("searches documentation from the keyboard and recovers from no results", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(developerRoute);

  await page.keyboard.press("/");
  const search = page.getByRole("combobox", { name: "Search documentation" });
  await expect(search).toBeFocused();
  await search.fill("no matching page");
  await expect(page.getByText("No documentation found.")).toBeVisible();
  await search.fill("events");
  await page.getByRole("option", { name: "Events" }).click();
  await expect(page.getByRole("heading", { name: "Projects", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Related events" })).toBeVisible();
  expect(problems).toEqual([]);
});

test("covers request loading, error, response, and changelog states", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(developerRoute);
  await page.getByRole("button", { name: "API reference" }).click();

  await page.getByRole("button", { name: "Simulate loading" }).click();
  await expect(page.getByRole("status")).toContainText("Sending request");
  await page.getByRole("button", { name: "Complete" }).click();
  await expect(page.getByText("Sending request")).toHaveCount(0);
  await page.getByRole("button", { name: "Simulate error" }).click();
  await expect(page.getByText("Request failed")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("Request failed")).toHaveCount(0);
  await page.getByRole("button", { name: "Copy response" }).click();
  await expect(page.locator(".n-toast--managed")).toContainText("Code copied");

  await page.getByRole("button", { name: "Changelog" }).click();
  await expect(page.getByRole("heading", { name: "Changelog" })).toBeVisible();
  await page.getByRole("combobox", { name: "Version", exact: true }).click();
  await page.getByRole("option", { name: "1.7.2" }).click();
  await expect(page.getByRole("heading", { name: "Version 1.7.2" })).toBeVisible();
  expect(problems).toEqual([]);
});

test("supports mobile navigation, runtime axes, and code overflow containment", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(developerRoute);

  await page.getByRole("button", { name: "Open developer navigation" }).click();
  await page
    .getByRole("dialog", { name: "Developer navigation" })
    .getByRole("button", { name: "Portal settings" })
    .click();
  await page.getByRole("combobox", { name: "Mode", exact: true }).click();
  await page.getByRole("option", { name: "Dark" }).click();
  await page.getByRole("combobox", { name: "Density" }).click();
  await page.getByRole("option", { name: "Compact" }).click();
  await page.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();

  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});
