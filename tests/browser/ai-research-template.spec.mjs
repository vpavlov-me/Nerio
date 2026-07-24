import { expect, test } from "@playwright/test";

const researchRoute = "/views/ai-research-workspace";

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

test("validates, interrupts, retries, fails, and completes a research run", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(researchRoute);

  await page.getByRole("button", { name: "Run research" }).click();
  await expect(page.getByText("Describe what you want to research.")).toBeVisible();

  await page.getByRole("textbox", { name: "Research prompt" }).fill("Check activation evidence");
  await page.getByRole("button", { name: "Run research" }).click();
  await expect(page.getByRole("status")).toContainText("Checking interview notes");
  await page.getByRole("button", { name: "Stop response" }).click();
  await expect(page.getByText("Response interrupted")).toBeVisible();

  await page.getByRole("button", { name: "Continue research" }).click();
  await page.getByRole("button", { name: "Simulate failure" }).click();
  await expect(page.getByText("Source comparison failed")).toBeVisible();
  await page.getByRole("button", { name: "Retry research" }).click();
  await expect(page.getByText("Evidence pass complete")).toBeVisible();
  expect(problems).toEqual([]);
});

test("inspects a citation, adds it to notes, and restores trigger focus", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(researchRoute);

  const citation = page.getByRole("button", { name: "[1]" });
  await citation.click();
  const dialog = page.getByRole("dialog", { name: "Eight onboarding interviews" });
  await expect(dialog).toContainText("Direct qualitative evidence");
  await dialog.getByRole("button", { name: "Add to notes" }).click();
  await expect(page.locator(".n-toast--managed")).toContainText("Source added to notes");
  await expect(citation).toBeFocused();
  expect(problems).toEqual([]);
});

test("recovers attachments and saved-thread search states", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto(researchRoute);

  const failedAttachment = page.getByText("interview-notes.txt", { exact: true }).locator("../..");
  await failedAttachment.getByRole("button", { name: "Retry" }).click();
  await expect(failedAttachment).toContainText("Ready");

  await page.getByRole("button", { name: "Add sample" }).click();
  const processingAttachment = page
    .getByText("activation-events.csv", { exact: true })
    .locator("../..");
  await processingAttachment.getByRole("button", { name: "Finish" }).click();
  await expect(processingAttachment).toContainText("Ready");
  await processingAttachment.getByRole("button", { name: "Remove activation-events.csv" }).click();
  await expect(page.getByText("activation-events.csv")).toHaveCount(0);

  await page.getByRole("button", { name: "Saved threads" }).click();
  await page.getByRole("textbox", { name: "Search saved threads" }).fill("not here");
  await expect(page.getByRole("heading", { name: "No saved threads found" })).toBeVisible();
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.getByText("Activation opportunity brief", { exact: true })).toBeVisible();
  expect(problems).toEqual([]);
});

test("supports mobile navigation, runtime axes, and narrow reflow", async ({ page }) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(researchRoute);

  await page.getByRole("button", { name: "Open research navigation" }).click();
  await page
    .getByRole("dialog", { name: "Research navigation" })
    .getByRole("button", { name: "Settings" })
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
