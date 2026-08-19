import { expect, test } from "@playwright/test";

const metrikaRequestPattern = /^https:\/\/(?:mc\.yandex\.(?:ru|com(?:\.ge)?)|mc\.webvisor\.org)\//;

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
  await page.goto("/visual-test/blocks/overlay-playground");

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

test("keeps Toggle keyboard, pointer, state, naming, focus, and reflow portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/toggle");

  const follow = page.locator('button[data-icon-only="true"][aria-label="Follow updates"]');
  await expect(follow).toHaveAttribute("aria-pressed", "true");
  await expect(follow).toHaveAttribute("data-icon-only", "true");
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "false");
  await expect(follow).toHaveAccessibleName("Follow updates");

  const saveArticle = page.getByRole("button", { name: "Save article for later" });
  await expect(saveArticle).toHaveAttribute("aria-pressed", "false");
  await expect(saveArticle).toHaveAttribute("data-icon-only", "true");
  await expect(saveArticle).toHaveAttribute("data-variant", "outline");
  await saveArticle.focus();
  await saveArticle.press("Enter");
  await expect(saveArticle).toHaveAttribute("aria-pressed", "true");
  await expect(saveArticle).toBeFocused();
  await expect(saveArticle).toHaveAccessibleName("Save article for later");
  await saveArticle.press("Space");
  await expect(saveArticle).toHaveAttribute("aria-pressed", "false");
  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("keeps Toggle touch activation portable", async ({ browser, browserName }, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    await context.route(metrikaRequestPattern, (route) => route.fulfill({ status: 204 }));
    const page = await context.newPage();
    const problems = monitorPage(page, browserName);
    await page.goto("/docs/components/toggle");
    const saveArticle = page.getByRole("button", { name: "Save article for later" });
    const box = await saveArticle.boundingBox();
    expect(box).not.toBeNull();
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    await expect(saveArticle).toHaveAttribute("aria-pressed", "true");
    expect(problems).toEqual([]);
  } finally {
    await context.close();
  }
});

test("keeps Collapsible and Accordion disclosure behavior portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto("/docs/components/collapsible");
  const collapsible = page.getByRole("button", { name: "Recovery keys" });
  await expect(collapsible).toHaveAttribute("aria-expanded", "false");
  await collapsible.focus();
  await collapsible.press("Enter");
  await expect(collapsible).toHaveAttribute("aria-expanded", "true");
  const collapsiblePanel = page.locator(`#${await collapsible.getAttribute("aria-controls")}`);
  await expect(collapsiblePanel).toBeVisible();
  expect(
    await collapsiblePanel.evaluate((element) =>
      getComputedStyle(element)
        .transitionDuration.split(",")
        .every((duration) => Number.parseFloat(duration) <= 0.001),
    ),
  ).toBe(true);

  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);

  await page.goto("/docs/components/accordion");
  const billing = page.getByRole("button", { name: "How does billing work?" });
  const members = page.getByRole("button", { name: "Can I invite collaborators?" });
  await expect(billing).toHaveAttribute("aria-expanded", "true");
  await expect(members).toHaveAttribute("aria-expanded", "false");
  expect(await billing.evaluate((element) => element.parentElement?.tagName)).toBe("H3");
  await members.press("Enter");
  await expect(billing).toHaveAttribute("aria-expanded", "false");
  await expect(members).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator(`#${await members.getAttribute("aria-controls")}`)).toContainText(
    "Workspace owners can invite and remove members.",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("animates disclosure panels through their full measured height", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.goto("/docs/components/accordion");
  const trigger = page.getByRole("button", { name: "Can I invite collaborators?" });
  await trigger.click();
  const panel = page.locator(`#${await trigger.getAttribute("aria-controls")}`);
  await page.waitForTimeout(320);
  const openGeometry = await panel.evaluate((element) => ({
    contentHeight: element.firstElementChild?.getBoundingClientRect().height,
    openHeight: element.getBoundingClientRect().height,
  }));
  expect(Math.abs(openGeometry.openHeight - openGeometry.contentHeight)).toBeLessThanOrEqual(1);

  await trigger.click();
  await page.waitForTimeout(200);
  expect(
    await panel.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeLessThanOrEqual(4);
  expect(problems).toEqual([]);
});

test("keeps the manual audit fixture contained at narrow reflow widths", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/visual-test");
  await expect(page.locator('[data-visual-test-ready="true"]')).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    )
    .toBeLessThanOrEqual(1);
  expect(await page.evaluate(() => matchMedia("(forced-colors: active)").matches)).toBe(true);
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  expect(problems).toEqual([]);
});

test("preserves native temporal Input values, constraints, form data, and reflow", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/visual-test/input");

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

test("preserves native FileInput selection, FileList, form reset, and reflow", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/visual-test/file-input");

  const form = page.getByRole("form", { name: "Native file input examples" });
  const primaryInput = page.getByLabel("Primary attachment", { exact: true });
  const capturedInput = page.getByLabel("Captured attachments", { exact: true });
  await expect(primaryInput).toHaveAttribute("type", "file");
  await expect(primaryInput).toHaveAttribute("accept", ".pdf,image/*");
  await expect(primaryInput).not.toHaveAttribute("multiple", "");
  await expect(primaryInput).toHaveAttribute("required", "");
  await expect(capturedInput).toHaveAttribute("type", "file");
  await expect(capturedInput).toHaveAttribute("accept", "image/*");
  await expect(capturedInput).toHaveAttribute("capture", "environment");
  await expect(capturedInput).toHaveAttribute("multiple", "");
  await expect(capturedInput).not.toHaveAttribute("required", "");

  await primaryInput.setInputFiles({
    name: "launch-brief-with-a-very-long-localized-name.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("brief"),
  });
  await capturedInput.setInputFiles([
    {
      name: "launch-reference-with-a-very-long-localized-name.png",
      mimeType: "image/png",
      buffer: Buffer.from("reference"),
    },
    {
      name: "проекция.png",
      mimeType: "image/png",
      buffer: Buffer.from("image"),
    },
  ]);
  expect(
    await capturedInput.evaluate((element) =>
      Array.from(element.files ?? [], (file) => ({ name: file.name, type: file.type })),
    ),
  ).toEqual([
    {
      name: "launch-reference-with-a-very-long-localized-name.png",
      type: "image/png",
    },
    { name: "проекция.png", type: "image/png" },
  ]);
  expect(
    await form.evaluate((element) => {
      const value = new FormData(element).get("primaryAttachment");
      return value instanceof File ? value.name : value;
    }),
  ).toBe("launch-brief-with-a-very-long-localized-name.pdf");
  expect(
    await form.evaluate((element) => {
      const values = new FormData(element).getAll("attachments");
      return values.map((value) => (value instanceof File ? value.name : value));
    }),
  ).toEqual(["launch-reference-with-a-very-long-localized-name.png", "проекция.png"]);

  await page.getByRole("button", { name: "Reset file inputs" }).click();
  expect(await primaryInput.evaluate((element) => element.files?.length)).toBe(0);
  expect(await capturedInput.evaluate((element) => element.files?.length)).toBe(0);
  await capturedInput.focus();
  await expect(capturedInput).toBeFocused();
  await expect(page.getByLabel("Unavailable attachment")).toBeDisabled();
  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("exposes the semantic Table, Item, Pagination, form, and Tabs audit fixtures", async ({
  browserName,
  page,
}) => {
  await page.route("https://mc.yandex.ru/metrika/tag.js", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "",
    }),
  );
  const problems = monitorPage(page, browserName);
  const gotoFixture = async (url) => {
    await page.goto(url);
    await page.waitForLoadState("networkidle");
  };

  await gotoFixture("/visual-test#checkbox");
  const checkboxFixture = page.locator("#checkbox");
  const weeklySummary = checkboxFixture
    .getByRole("tabpanel", { name: "Unchecked", exact: true })
    .getByRole("checkbox", { name: "Weekly summary", exact: true });
  await expect(weeklySummary).toBeVisible();
  await weeklySummary.click();
  await expect(weeklySummary).toBeChecked();
  await checkboxFixture.getByRole("tab", { name: "Checked", exact: true }).click();
  await expect(
    checkboxFixture
      .getByRole("tabpanel", { name: "Checked", exact: true })
      .getByRole("checkbox", { name: "Weekly summary", exact: true }),
  ).toBeChecked();
  await checkboxFixture.getByRole("tab", { name: "Disabled", exact: true }).click();
  const disabledWeeklySummary = checkboxFixture
    .getByRole("tabpanel", { name: "Disabled", exact: true })
    .getByRole("checkbox", { name: "Weekly summary", exact: true });
  await expect(disabledWeeklySummary).toBeDisabled();

  const switchFixture = page.locator("#switch");
  const automaticUpdates = switchFixture
    .getByRole("tabpanel", { name: "Default", exact: true })
    .getByRole("switch", { name: "Automatic updates", exact: true });
  await expect(automaticUpdates).toBeVisible();
  await automaticUpdates.click();
  await expect(automaticUpdates).toBeChecked();
  await switchFixture.getByRole("tab", { name: "Disabled", exact: true }).click();
  const disabledAutomaticUpdates = switchFixture
    .getByRole("tabpanel", { name: "Disabled", exact: true })
    .getByRole("switch", { name: "Automatic updates", exact: true });
  await expect(disabledAutomaticUpdates).toBeChecked();
  await expect(disabledAutomaticUpdates).toBeDisabled();

  await gotoFixture("/docs/components/table");
  const primaryTableExample = page.getByRole("region", { name: "Primary Table composition" });
  const tableRegion = primaryTableExample.getByRole("region", {
    name: "Team members, roles, statuses, and emails",
  });
  await expect(tableRegion).toHaveAttribute("tabindex", "0");
  await expect(
    primaryTableExample.getByText("Team members, roles, statuses, and email addresses", {
      exact: true,
    }),
  ).toBeVisible();

  await gotoFixture("/visual-test/item");
  const itemList = page.getByRole("list", { name: "Workspace resources" });
  await expect(itemList.getByRole("listitem")).toHaveCount(2);

  await gotoFixture("/visual-test/pagination");
  await expect(
    page.getByRole("navigation", { name: "RTL pagination" }).getByLabel("Go to previous page"),
  ).toHaveAttribute("aria-disabled", "true");

  await gotoFixture("/visual-test#field");
  await expect(page.getByRole("textbox", { name: "Project name" })).toHaveAttribute("required", "");
  await expect(page.getByRole("textbox", { name: "md default input" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Email address with icon" })).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Default note" })).toBeVisible();

  await gotoFixture("/visual-test/tabs");
  await expect(page.getByRole("tab", { name: "Project members and permissions" })).toBeVisible();
  expect(problems).toEqual([]);
});

test("keeps the public direction contract behavioral in RTL", async ({ browserName, page }) => {
  const problems = monitorPage(page, browserName);
  await page.goto("/docs/foundations/localization");

  const fixture = page.getByRole("region", { name: "RTL direction preview" });
  await expect(fixture.locator('[data-direction-fixture="rtl"]')).toHaveAttribute("dir", "rtl");
  for (const side of ["left", "right"]) {
    const provider = fixture.locator(`[data-physical-side="${side}"]`);
    const sidebar = provider.getByRole("complementary", {
      name: `${side} inherited direction sidebar`,
    });
    const content = provider.locator('[data-slot="sidebar-provider-content"]');
    await expect(provider).toHaveAttribute("data-direction", "rtl");
    await expect(provider).toHaveCSS("direction", "ltr");
    await expect(content).toHaveCSS("direction", "rtl");
    await expect(sidebar).toHaveCSS("direction", "rtl");
    const providerBox = await provider.boundingBox();
    const sidebarBox = await sidebar.boundingBox();
    expect(providerBox).not.toBeNull();
    expect(sidebarBox).not.toBeNull();
    const expectedX = side === "left" ? providerBox.x : providerBox.x + providerBox.width;
    const actualX = side === "left" ? sidebarBox.x : sidebarBox.x + sidebarBox.width;
    expect(Math.abs(actualX - expectedX)).toBeLessThanOrEqual(1);

    await provider.evaluate((element) => element.setAttribute("dir", "ltr"));
    await expect(provider).toHaveCSS("direction", "ltr");
    await expect(provider).toHaveAttribute("data-direction", "ltr");
    await expect(content).toHaveCSS("direction", "ltr");
    await expect(sidebar).toHaveCSS("direction", "ltr");
    const explicitProviderBox = await provider.boundingBox();
    const explicitSidebarBox = await sidebar.boundingBox();
    expect(explicitProviderBox).not.toBeNull();
    expect(explicitSidebarBox).not.toBeNull();
    const explicitExpectedX =
      side === "left" ? explicitProviderBox.x : explicitProviderBox.x + explicitProviderBox.width;
    const explicitActualX =
      side === "left" ? explicitSidebarBox.x : explicitSidebarBox.x + explicitSidebarBox.width;
    expect(Math.abs(explicitActualX - explicitExpectedX)).toBeLessThanOrEqual(1);
  }

  const overview = fixture.getByRole("tab", { name: "Overview" });
  const details = fixture.getByRole("tab", { name: "Details" });
  await overview.focus();
  await overview.press("ArrowLeft");
  await expect(details).toBeFocused();

  const slider = fixture.getByRole("slider", { name: "RTL priority" });
  await expect(slider).toHaveValue("35");
  await slider.focus();
  await slider.press("ArrowRight");
  await expect(slider).toHaveValue("34");

  await page.waitForLoadState("networkidle");
  await page.goto("/docs/components/dialog");
  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  await page
    .getByRole("region", { name: "dialog preview" })
    .getByRole("button", { name: "Open dialog" })
    .click();
  const dialogBox = await page.getByRole("dialog", { name: "Share collection" }).boundingBox();
  expect(dialogBox).not.toBeNull();
  const dialogViewportWidth = await page.evaluate(() => window.innerWidth);
  expect(Math.abs(dialogBox.x + dialogBox.width / 2 - dialogViewportWidth / 2)).toBeLessThanOrEqual(
    1,
  );
  expect(problems).toEqual([]);
});

test("keeps Sidebar direction and physical sides correct in server HTML", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("/docs/foundations/localization");
    const fixture = page.getByRole("region", { name: "RTL direction preview" });
    for (const side of ["left", "right"]) {
      const provider = fixture.locator(`[data-physical-side="${side}"]`);
      const content = provider.locator('[data-slot="sidebar-provider-content"]');
      const sidebar = provider.getByRole("complementary", {
        name: `${side} inherited direction sidebar`,
      });
      await expect(provider).toHaveAttribute("data-direction", "ltr");
      await expect(provider).toHaveCSS("direction", "ltr");
      await expect(content).toHaveCSS("direction", "rtl");
      await expect(sidebar).toHaveCSS("direction", "rtl");
      const providerBox = await provider.boundingBox();
      const sidebarBox = await sidebar.boundingBox();
      expect(providerBox).not.toBeNull();
      expect(sidebarBox).not.toBeNull();
      const expectedX = side === "left" ? providerBox.x : providerBox.x + providerBox.width;
      const actualX = side === "left" ? sidebarBox.x : sidebarBox.x + sidebarBox.width;
      expect(Math.abs(actualX - expectedX)).toBeLessThanOrEqual(1);
    }
  } finally {
    await context.close();
  }
});

test("keeps single-value Slider keyboard, pointer, form, RTL, and read-only behavior portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/visual-test/slider");

  const volume = page.getByRole("slider", { name: "Volume", exact: true });
  await expect(volume).toHaveValue("40");
  await volume.focus();
  await volume.press("ArrowRight");
  await expect(volume).toHaveValue("41");
  await volume.press("PageUp");
  await expect(volume).toHaveValue("51");
  await volume.press("End");
  await expect(volume).toHaveValue("100");
  await volume.press("Home");
  await expect(volume).toHaveValue("0");
  await expect(volume).toHaveAttribute("aria-valuetext", "0 percent");
  await expect(page.locator('[data-slot="value"]').first()).toHaveText("0%");
  expect(
    await page
      .getByRole("form", { name: "Slider form example" })
      .evaluate((form) => Object.fromEntries(new FormData(form).entries())),
  ).toEqual({ volume: "0" });

  const control = page.locator('[data-slot="control"]').first();
  const controlBox = await control.boundingBox();
  expect(controlBox).not.toBeNull();
  const trackBox = await control.locator('[data-slot="track"]').boundingBox();
  expect(trackBox).not.toBeNull();
  expect(controlBox.height).toBeGreaterThanOrEqual(32);
  expect(trackBox.height).toBeLessThan(controlBox.height);
  await page.mouse.click(
    controlBox.x + controlBox.width * 0.25,
    controlBox.y + (controlBox.height - trackBox.height) / 4,
  );
  expect(Number(await volume.inputValue())).toBeGreaterThanOrEqual(20);
  expect(Number(await volume.inputValue())).toBeLessThanOrEqual(30);
  const thumbBox = await page.locator('[data-slot="thumb"]').first().boundingBox();
  expect(thumbBox).not.toBeNull();
  await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    controlBox.x + controlBox.width * 0.75,
    controlBox.y + controlBox.height / 2,
    { steps: 4 },
  );
  await page.mouse.up();
  expect(Number(await volume.inputValue())).toBeGreaterThanOrEqual(70);

  const readOnly = page.getByRole("slider", { name: "Read-only volume" });
  await readOnly.focus();
  await readOnly.press("End");
  await expect(readOnly).toHaveValue("72");
  await expect(readOnly).toHaveAttribute("aria-readonly", "true");

  const vertical = page.getByRole("slider", { name: "Vertical volume" });
  await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
  const rtl = page.getByRole("slider", { name: "RTL volume" });
  await rtl.focus();
  await rtl.press("ArrowRight");
  await expect(rtl).toHaveValue("36");
  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  await volume.focus();
  await volume.press("ArrowRight");
  expect(Number(await volume.inputValue())).toBeGreaterThanOrEqual(71);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("keeps Slider touch input portable", async ({ browser, browserName }, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    await context.route(metrikaRequestPattern, (route) => route.fulfill({ status: 204 }));
    const page = await context.newPage();
    const problems = monitorPage(page, browserName);
    await page.goto("/visual-test/slider");

    const volume = page.getByRole("slider", { name: "Volume", exact: true });
    const control = page.locator('[data-slot="control"]').first();
    const controlBox = await control.boundingBox();
    const thumbBox = await page.locator('[data-slot="thumb"]').first().boundingBox();
    expect(controlBox).not.toBeNull();
    expect(thumbBox).not.toBeNull();
    if (browserName === "chromium") {
      const session = await page.context().newCDPSession(page);
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [{ x: thumbBox.x + thumbBox.width / 2, y: thumbBox.y + thumbBox.height / 2 }],
      });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: controlBox.x + controlBox.width * 0.75, y: controlBox.y + controlBox.height / 2 },
        ],
      });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await session.detach();
    } else {
      await page.touchscreen.tap(
        controlBox.x + controlBox.width * 0.75,
        controlBox.y + controlBox.height / 2,
      );
    }
    expect(Number(await volume.inputValue())).toBeGreaterThanOrEqual(70);
    expect(problems).toEqual([]);
  } finally {
    await context.close();
  }
});

test("keeps Calendar keyboard, pointer, locale, constraints, RTL, and reflow portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/visual-test/calendar");

  const calendar = page.getByRole("group", { name: "Release date" });
  await expect(calendar).toBeVisible();
  await expect(calendar.getByRole("grid", { name: "June 2026" })).toBeVisible();
  await expect(calendar.getByRole("button", { name: "June 15, 2026, Selected" })).toHaveAttribute(
    "aria-current",
    "date",
  );
  await expect(calendar.getByRole("gridcell", { selected: true })).toContainText("15");
  await expect(calendar.getByRole("button", { name: "June 18, 2026" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );

  await calendar.getByRole("button", { name: "June 16, 2026" }).click();
  await expect(calendar.getByRole("gridcell", { selected: true })).toContainText("16");
  await expect(page.getByText("Selected date: 2026-06-16")).toBeVisible();
  await calendar.getByRole("button", { name: "June 18, 2026" }).dispatchEvent("click");
  await expect(page.getByText("Selected date: 2026-06-16")).toBeVisible();

  const selected = calendar.getByRole("button", { name: "June 16, 2026, Selected" });
  await selected.focus();
  await selected.press("ArrowRight");
  await expect(calendar.getByRole("button", { name: "June 17, 2026" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(calendar.getByRole("button", { name: "June 19, 2026" })).toBeFocused();
  await page.keyboard.press("Home");
  await expect(calendar.getByRole("button", { name: "June 15, 2026" })).toBeFocused();
  await page.keyboard.press("End");
  await expect(calendar.getByRole("button", { name: "June 21, 2026" })).toBeFocused();
  await page.keyboard.press("PageDown");
  await expect(calendar.getByRole("button", { name: "July 21, 2026" })).toBeFocused();
  await expect(calendar.getByRole("grid", { name: "July 2026" })).toBeVisible();
  await page.keyboard.press("Shift+PageUp");
  await expect(calendar.getByRole("button", { name: "June 8, 2026" })).toBeFocused();

  await calendar.getByRole("button", { name: "June 16, 2026, Selected" }).focus();
  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  await page.keyboard.press("ArrowRight");
  await expect(calendar.getByRole("button", { name: "June 15, 2026" })).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("keeps Calendar touch selection portable", async ({ browser, browserName }, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    await context.route(metrikaRequestPattern, (route) => route.fulfill({ status: 204 }));
    const page = await context.newPage();
    const problems = monitorPage(page, browserName);
    await page.goto("/visual-test/calendar");
    await page
      .getByRole("group", { name: "Release date" })
      .getByRole("button", { name: "June 17, 2026" })
      .tap();
    await expect(page.getByText("Selected date: 2026-06-17")).toBeVisible();
    expect(problems).toEqual([]);
  } finally {
    await context.close();
  }
});

test("keeps DatePicker focus, form value, constraints, dismissal, RTL, and reflow portable", async ({
  browserName,
  page,
}) => {
  const problems = monitorPage(page, browserName);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/visual-test/date-picker");

  const trigger = page.getByRole("button", { name: "Release date" });
  await expect(trigger).toContainText("Jun 15, 2026");
  await trigger.press("Enter");
  const calendar = page.getByRole("group", { name: "Choose date" });
  await expect(calendar).toBeVisible();
  await expect(calendar.getByRole("button", { name: "June 15, 2026, Selected" })).toBeFocused();
  await expect(calendar.getByRole("button", { name: "June 18, 2026" })).toHaveAttribute(
    "aria-disabled",
    "true",
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await trigger.click();
  await calendar.getByRole("button", { name: "June 16, 2026" }).click();
  await expect(calendar).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toContainText("Jun 16, 2026");
  await expect(page.getByText("Form value: 2026-06-16")).toBeVisible();
  await expect(page.locator('input[name="releaseDate"]')).toHaveValue("2026-06-16");
  expect(await page.locator("form").evaluate((form) => new FormData(form).get("releaseDate"))).toBe(
    "2026-06-16",
  );
  const invalidTrigger = page.getByRole("button", { name: "Invalid required date" });
  await expect(invalidTrigger).toHaveAttribute("aria-invalid", "true");
  await invalidTrigger.click();
  await page
    .getByRole("group", { name: "Choose date" })
    .getByRole("button", { name: "June 17, 2026" })
    .click();
  await expect(invalidTrigger).not.toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Choose a date before submitting.")).toBeHidden();
  await page.getByRole("button", { name: "Submit dates" }).click();
  await expect(page.getByText(/Submitted form data:/)).toContainText(
    '{"releaseDate":"2026-06-16","invalidDate":"2026-06-17","readOnlyDate":"2026-06-22"}',
  );

  await page.locator("html").evaluate((element) => element.setAttribute("dir", "rtl"));
  await trigger.click();
  await expectInsideViewport(calendar, { width: 320, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(problems).toEqual([]);
});

test("keeps DatePicker touch selection portable", async ({ browser, browserName }, testInfo) => {
  const context = await browser.newContext({
    baseURL: testInfo.project.use.baseURL,
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });
  try {
    await context.route(metrikaRequestPattern, (route) => route.fulfill({ status: 204 }));
    const page = await context.newPage();
    const problems = monitorPage(page, browserName);
    await page.goto("/visual-test/date-picker");
    const trigger = page.getByRole("button", { name: "Release date" });
    await trigger.tap();
    await page.getByRole("button", { name: "June 17, 2026" }).tap();
    await expect(trigger).toContainText("Jun 17, 2026");
    await expect(page.getByText("Form value: 2026-06-17")).toBeVisible();
    expect(problems).toEqual([]);
  } finally {
    await context.close();
  }
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
