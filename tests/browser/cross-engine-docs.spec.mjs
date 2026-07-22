import { expect, test } from "@playwright/test";

function monitorPage(page, browserName) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    if (browserName === "webkit" && error.message.endsWith("due to access control checks.")) return;
    problems.push(`page: ${error.message}`);
  });
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "failed";
    if (errorText === "net::ERR_ABORTED") return;
    const isRscPrefetch = new URL(request.url()).searchParams.has("_rsc");
    if (browserName === "firefox" && isRscPrefetch && errorText === "NS_BINDING_ABORTED") return;
    if (
      browserName === "webkit" &&
      isRscPrefetch &&
      ["cancelled", "Load request cancelled"].includes(errorText)
    ) {
      return;
    }
    problems.push(`request: ${request.url()} (${errorText})`);
  });
  return problems;
}

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
});

async function expectInsideViewport(locator, viewport) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box.x).toBeGreaterThanOrEqual(-1);
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
}

test("keeps Dialog, Popover, Tooltip, and Dropdown Menu positioned and keyboard-safe", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  const viewport = { width: 1024, height: 820 };
  await page.setViewportSize(viewport);
  await page.goto("/docs/blocks/overlay-playground");

  const dialogTrigger = page.getByRole("button", { name: "Open dialog" });
  await dialogTrigger.click();
  const dialog = page.getByRole("dialog", { name: "Long review notes" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await expectInsideViewport(dialog, viewport);
  await page.keyboard.press("Escape");
  await expect(dialogTrigger).toBeFocused();

  await page.getByRole("button", { name: "Open popover" }).click();
  const popover = page.getByRole("dialog", { name: "Share settings" });
  await expect(popover).toBeVisible();
  await expectInsideViewport(popover, viewport);
  await page.keyboard.press("Escape");

  const menuTrigger = page.getByRole("button", { name: "More actions" });
  await menuTrigger.press("Enter");
  const duplicate = page.getByRole("menuitem", { name: "Duplicate" });
  await expect(duplicate).toBeFocused();
  const archive = page.getByRole("menuitem", { name: "Archive" });
  await expect(archive).toBeVisible();
  await duplicate.press("ArrowDown");
  await expect(archive).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menuTrigger).toBeFocused();

  const tooltipTrigger = page.getByRole("button", { name: "What is this?" });
  await tooltipTrigger.hover();
  const tooltip = page.getByRole("tooltip", { name: "Short, non-essential guidance" });
  await expect(tooltip).toBeVisible();
  await expectInsideViewport(tooltip, viewport);
  expect(problems).toEqual([]);
});

test("keeps Select, command search, and focus-visible behavior portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.goto("/docs/components/select");
  const select = page.getByRole("combobox", { name: "Status" });
  await select.focus();
  expect(await select.evaluate((element) => element.matches(":focus-visible"))).toBe(true);
  await select.press("ArrowDown");
  const draft = page.getByRole("option", { name: "Draft" });
  await expect(draft).toBeFocused();
  await draft.press("ArrowDown");
  const inReview = page.getByRole("option", { name: "In review" });
  await expect(inReview).toBeFocused();
  await inReview.press("Enter");
  await expect(select).toContainText("In review");

  await page.getByRole("button", { name: "Search documentation" }).click();
  const command = page.getByRole("combobox", { name: "Search documentation" });
  await command.fill("Button");
  await expect(page.getByRole("option", { name: /^Button / }).first()).toBeVisible();
  await page.keyboard.press("Escape");

  expect(problems).toEqual([]);
});

test("preserves native temporal Input values, constraints, form data, and reflow", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/input");

  const form = page.getByRole("form", { name: "Native temporal input examples" });
  const date = page.getByLabel("Start date", { exact: true });
  await expect(date).toHaveAttribute("type", "date");
  await expect(date).toHaveAttribute("min", "2026-01-01");
  await expect(date).toHaveAttribute("max", "2026-12-31");
  await expect(date).toHaveAttribute("step", "1");
  await expect(date).toHaveValue("2026-07-22");
  await expect(page.getByLabel("Billing month", { exact: true })).toHaveValue("2026-07");
  await expect(page.getByLabel("Reporting week", { exact: true })).toHaveValue("2026-W30");
  await expect(page.getByLabel("Start time", { exact: true })).toHaveValue("09:30");
  await expect(page.getByLabel("Local deadline", { exact: true })).toHaveValue("2026-07-22T17:30");
  await expect(page.getByLabel("Local deadline", { exact: true })).toHaveAttribute("readonly", "");

  const nativeValues = await form.evaluate((element) => {
    const data = new FormData(element);
    const dateInput = element.elements.namedItem("startDate");
    return {
      entries: Object.fromEntries(data.entries()),
      valueAsDate: dateInput.valueAsDate?.toISOString(),
      valueAsNumber: dateInput.valueAsNumber,
    };
  });
  expect(nativeValues).toEqual({
    entries: {
      startDate: "2026-07-22",
      billingMonth: "2026-07",
      reportingWeek: "2026-W30",
      startTime: "09:30",
      localDeadline: "2026-07-22T17:30",
    },
    valueAsDate: "2026-07-22T00:00:00.000Z",
    valueAsNumber: Date.UTC(2026, 6, 22),
  });

  await date.fill("2027-01-01");
  expect(await date.evaluate((element) => element.checkValidity())).toBe(false);
  await date.fill("2026-08-03");
  expect(await date.evaluate((element) => element.checkValidity())).toBe(true);
  const time = page.getByLabel("Start time", { exact: true });
  await time.fill("09:37");
  expect(await time.evaluate((element) => element.checkValidity())).toBe(false);
  await form.evaluate((element) => element.reset());
  await expect(date).toHaveValue("2026-07-22");
  await expect(time).toHaveValue("09:30");
  await date.focus();
  await expect(date).toBeFocused();
  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("keeps mobile navigation inside the dynamic viewport", async ({ browserName, page }) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto("/docs/getting-started");
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Documentation" });
  await expect(navigation).toBeVisible();
  const box = await navigation.boundingBox();
  expect(box).not.toBeNull();
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.y + box.height).toBeLessThanOrEqual(721);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});
