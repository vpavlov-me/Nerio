import { expect, test } from "@playwright/test";

const libraryRoute = "/views/content-library";

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
  await page.addInitScript(() => window.localStorage.clear());
});

test("filters, switches views, selects assets, and recovers from no results", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(libraryRoute);

  await expect(
    page.getByRole("heading", { name: "Everything your team can publish" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "List view" }).click();
  await expect(page.getByLabel("list asset view")).toBeVisible();

  await page.getByRole("checkbox", { name: "Select Launch notes cover" }).click();
  await page.getByRole("checkbox", { name: "Select Product loop" }).click();
  await expect(page.getByText("2 selected")).toBeVisible();
  await page.getByRole("button", { name: "Archive selection" }).click();
  await expect(page.locator(".n-toast--managed")).toContainText("2 assets archived");

  await page.getByRole("textbox", { name: "Search library" }).fill("research");
  await expect(page.getByText("Research brief", { exact: true })).toBeVisible();
  await page.getByRole("textbox", { name: "Search library" }).fill("no such asset");
  await expect(page.getByRole("heading", { name: "No assets found" })).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await expect(page.getByText("Launch notes cover", { exact: true })).toBeVisible();
  expect(problems).toEqual([]);
});

test("previews an asset, validates metadata, saves, and restores focus", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(libraryRoute);

  const preview = page
    .locator('[data-view="grid"]')
    .filter({ hasText: "Research brief" })
    .getByRole("button", { name: "Preview" });
  await preview.click();
  const dialog = page.getByRole("dialog", { name: "Research brief" });
  await expect(
    dialog.getByRole("img", { name: "Document fallback for Research brief" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Edit metadata" }).click();
  const editor = page.getByRole("dialog", { name: "Edit metadata" });
  await editor.getByRole("textbox", { name: "Title" }).fill("");
  await editor.getByRole("button", { name: "Save metadata" }).click();
  await expect(editor.getByText("Add a title before saving.")).toBeVisible();
  await editor.getByRole("textbox", { name: "Title" }).fill("Research brief 2026");
  await editor.getByRole("button", { name: "Save metadata" }).click();
  await expect(page.locator(".n-toast--managed")).toContainText("Metadata saved");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(preview).toBeFocused();
  expect(problems).toEqual([]);
});

test("covers import states, mobile navigation, runtime axes, and reflow", async ({ page }) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(libraryRoute);

  await expect(page.getByLabel("list asset view")).toBeVisible();
  await page.getByRole("button", { name: "Open library navigation" }).click();
  await page
    .getByRole("dialog", { name: "Library navigation" })
    .getByRole("button", { name: "Imports" })
    .click();
  await expect(page.getByText("legacy-export.zip")).toBeVisible();
  await page.getByRole("button", { name: "Retry" }).click();
  await expect(page.getByText("48% · Processing local files")).toBeVisible();
  await page.getByRole("button", { name: "Finish" }).last().click();

  await page.getByRole("button", { name: "Open library navigation" }).click();
  await page
    .getByRole("dialog", { name: "Library navigation" })
    .getByRole("button", { name: "Settings" })
    .click();
  await page.getByRole("combobox", { name: "Mode" }).click();
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
