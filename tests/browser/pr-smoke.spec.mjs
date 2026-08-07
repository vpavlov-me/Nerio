import { expect, test } from "@playwright/test";
import { openMobilePreviewSettings } from "./helpers/template-preview-settings.mjs";

const healthStabilityWindowMs = 250;
const workspaceRoute = "/views/operations-workspace";

test.beforeEach(async ({ page }) => {
  await page.route("https://mc.yandex.ru/**", (route) => route.fulfill({ status: 204 }));
});

function monitorPage(page) {
  const problems = [];
  page.on("console", (message) => {
    if (message.type() === "error") problems.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => problems.push(`page: ${error.message}`));
  page.on("requestfailed", (request) => {
    const errorText = request.failure()?.errorText ?? "failed";
    if (errorText !== "net::ERR_ABORTED") {
      problems.push(`request: ${request.url()} (${errorText})`);
    }
  });
  return problems;
}

async function expectHealthyPage(page, problems) {
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  await page.waitForTimeout(healthStabilityWindowMs);
  expect(problems).toEqual([]);
}

test("loads the homepage, docs, and a component page without runtime errors", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/docs/getting-started");
  await expect(page.getByRole("heading", { name: "Getting started" })).toBeVisible();
  await page.goto("/docs/components/button");
  await expect(page.getByRole("main")).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps documentation actions attached and inside DropdownMenu slots", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/kbd");
  const group = page.getByRole("group", { name: "Documentation actions" });
  const buttonRadii = await group.evaluate((element) =>
    Array.from(element.querySelectorAll(":scope > .n-button")).map((button) => {
      const styles = getComputedStyle(button);
      return {
        startStart: styles.borderStartStartRadius,
        startEnd: styles.borderStartEndRadius,
      };
    }),
  );
  expect(buttonRadii).toHaveLength(2);
  expect(buttonRadii[0]).toEqual({ startStart: "20px", startEnd: "0px" });
  expect(buttonRadii[1]).toEqual({ startStart: "0px", startEnd: "20px" });

  await group.getByRole("button", { name: "Open page actions" }).click();
  const menu = page.getByRole("menu", { name: "Open page actions" });
  await expect(menu).toBeVisible();
  await expect(menu.locator('[data-slot="leading-icon"]')).toHaveCount(5);
  await expect(menu.locator('[data-slot="description"]')).toHaveCount(5);
  await expect(menu.locator('[data-slot="trailing-icon"]')).toHaveCount(2);
  await expect(menu.locator(".docs-action-item")).toHaveCount(0);
  await expect(menu.getByRole("menuitem", { name: "View as Markdown" })).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps FileInput preview singular and pagination button-based", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/file-input");

  const preview = page.getByRole("region", { name: "file-input preview" });
  await expect(preview.locator('input[type="file"]')).toHaveCount(1);
  await expect(preview.getByLabel("Attachment", { exact: true })).toHaveAttribute(
    "accept",
    ".pdf,image/*",
  );

  const pagination = page.getByRole("navigation", { name: "Documentation pagination" });
  await expect(pagination.locator('[data-slot="button"]')).toHaveCount(2);
  await expect(pagination.getByRole("link", { name: "Input", exact: true })).toBeVisible();
  await expect(pagination.getByRole("link", { name: "InputGroup", exact: true })).toBeVisible();
  await expect(pagination.getByText("Previous", { exact: true })).toHaveCount(0);
  await expect(pagination.getByText("Next", { exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Input label and description separated by the Field gap", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/input");

  const field = page.getByRole("region", { name: "Input preview" }).locator(".n-field");
  const spacing = await field.evaluate((element) => {
    const label = element.querySelector('[data-slot="label"]')?.getBoundingClientRect();
    const input = element.querySelector("input")?.getBoundingClientRect();
    const description = element.querySelector('[data-slot="description"]')?.getBoundingClientRect();
    if (!label || !input || !description) return null;

    return {
      fieldGap: Number.parseFloat(getComputedStyle(element).rowGap),
      labelToInput: input.top - label.bottom,
      inputToDescription: description.top - input.bottom,
    };
  });

  expect(spacing).not.toBeNull();
  expect(spacing.fieldGap).toBeGreaterThan(0);
  expect(spacing.labelToInput).toBeCloseTo(spacing.fieldGap, 1);
  expect(spacing.inputToDescription).toBeCloseTo(spacing.fieldGap, 1);
  await expectHealthyPage(page, problems);
});

test("keeps Field preview singular and feedback directional", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/field");

  const preview = page.getByRole("region", { name: "field preview" });
  await expect(preview.getByLabel("Project name", { exact: true })).toHaveCount(1);
  await expect(preview.getByPlaceholder("Launch workspace", { exact: true })).toHaveCount(1);
  await expect(preview.getByLabel("Short code", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);

  const feedback = page.getByRole("group", { name: "Page feedback" });
  expect(
    await feedback
      .getByRole("button")
      .evaluateAll((buttons) => buttons.map((button) => button.getAttribute("aria-label"))),
  ).toEqual(["Not helpful", "Neither helpful nor unhelpful", "Helpful"]);

  await feedback.getByRole("button", { name: "Helpful", exact: true }).click();
  await expect(page.getByRole("status")).toHaveText("Thanks for your feedback.");
  await expect(page.getByRole("link", { name: "Star Nerio on GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/vpavlov-me/Nerio",
  );
  await expectHealthyPage(page, problems);
});

test("keeps Select preview singular", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/select");

  const preview = page.getByRole("region", { name: "select preview" });
  await expect(preview.getByLabel("Status", { exact: true })).toHaveCount(1);
  await expect(preview.getByLabel("Disabled select", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Slider preview singular and product-focused", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/slider");

  const preview = page.getByRole("region", { name: "Slider preview" });
  const slider = preview.getByRole("slider", { name: "Tip amount", exact: true });
  await expect(preview.getByRole("slider")).toHaveCount(1);
  await expect(slider).toHaveValue("15");
  await expect(preview.getByText("$15", { exact: true })).toBeVisible();
  const header = preview.locator('[data-slot="header"]');
  const control = preview.locator('[data-slot="control"]');
  const [headerBox, controlBox] = await Promise.all([header.boundingBox(), control.boundingBox()]);
  expect(headerBox).not.toBeNull();
  expect(controlBox).not.toBeNull();
  expect(controlBox.y - (headerBox.y + headerBox.height)).toBeGreaterThanOrEqual(3.5);
  await preview.getByText("Tip amount", { exact: true }).click({ position: { x: 20, y: 15 } });
  await expect(slider).toHaveValue("15");
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Calendar preview singular and unlabeled visually", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/calendar");

  const preview = page.getByRole("region", { name: "Calendar preview" });
  await expect(preview.getByRole("group", { name: "Release date" })).toHaveCount(1);
  await expect(preview.locator('[data-slot="root"]')).toHaveCount(1);
  await expect(preview.getByRole("heading")).toHaveCount(0);
  await expect(preview.getByText(/Selected date:/)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Item preview on the visible outline variant", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/item");

  const preview = page.getByRole("region", { name: "Item preview" });
  const item = preview.locator(".n-item");
  await expect(item).toHaveAttribute("data-variant", "outline");
  expect(await item.evaluate((element) => getComputedStyle(element).borderTopWidth)).not.toBe(
    "0px",
  );
  await expectHealthyPage(page, problems);
});

test("keeps Card preview singular with complete anatomy", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/card");

  const preview = page.getByRole("region", { name: "card preview" });
  const card = preview.locator('[data-slot="card"]');
  await expect(card).toHaveCount(1);
  await expect(card.locator('[data-slot="card-visual"] img')).toHaveCount(1);
  await expect(card.locator('[data-slot="card-header"]')).toHaveCount(1);
  await expect(card.locator('[data-slot="card-content"]')).toHaveCount(1);
  await expect(card.locator('[data-slot="card-footer"]')).toHaveCount(1);
  await expect(card.getByRole("button", { name: "Open workspace" })).toBeVisible();
  await expect(card.getByRole("button")).toHaveCount(1);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expect(
    page.getByRole("complementary", { name: "On this page" }).getByRole("link", {
      name: "Launch workspace",
    }),
  ).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Avatar preview to image and text fallback", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/avatar");

  const preview = page.getByRole("region", { name: "avatar preview" });
  await expect(preview.locator('[data-slot="root"]')).toHaveCount(2);
  await expect(preview.locator('[data-slot="image"]')).toHaveCount(1);
  await expect(preview.locator('[data-slot="fallback"]')).toHaveCount(1);
  await expect(preview.getByRole("img", { name: "Maya Chen" })).toBeVisible();
  await expect(preview.getByRole("img", { name: "Nerio Team" })).toHaveText("NT");
  await expect(preview.getByRole("button", { name: "Load replacement avatar" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Progress preview to one determinate task", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/progress");

  const preview = page.getByRole("region", { name: "Progress preview" });
  await expect(preview.getByRole("progressbar")).toHaveCount(1);
  await expect(preview.getByRole("progressbar", { name: "Uploading files" })).toHaveAttribute(
    "aria-valuenow",
    "68",
  );
  await expect(preview.getByText("68%", { exact: true })).toBeVisible();
  await expect(preview.getByText("Importing records", { exact: true })).toHaveCount(0);
  await expect(preview.getByText("Exporting report", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps List preview to one titled ordered list", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/list");

  const preview = page.getByRole("region", { name: "list preview" });
  await expect(preview.getByRole("heading", { name: "Setup steps" })).toBeVisible();
  const list = preview.getByRole("list", { name: "Setup steps" });
  await expect(list).toHaveCount(1);
  await expect(list).toHaveJSProperty("tagName", "OL");
  await expect(list.getByRole("listitem")).toHaveCount(3);
  await expect(list.locator('[data-slot="marker"]')).toHaveText(["1.", "2.", "3."]);
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Pagination preview singular", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/pagination");

  const preview = page.getByRole("region", { name: "pagination preview" });
  await expect(preview.getByRole("navigation", { name: "Pagination" })).toHaveCount(1);
  await expect(preview.getByRole("navigation", { name: "RTL pagination" })).toHaveCount(0);
  await expect(preview.getByLabel("Go to previous page")).toBeVisible();
  await expect(preview.getByLabel("Go to next page")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Command to one preview and focuses only its search control", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/command-primitive");

  await expect(page.locator(".component-example")).toHaveCount(1);
  const preview = page.getByRole("region", { name: "Inline Command with local filtering" });
  const command = preview.locator('[data-slot="command"]');
  const inputGroup = command.locator('[data-slot="command-input-group"]');
  const input = command.getByRole("combobox", { name: "Workspace commands" });
  await expect(command).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Open commands" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open dialog" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Open sheet" })).toHaveCount(0);

  const beforeFocus = await command.evaluate((element) => ({
    root: getComputedStyle(element).boxShadow,
    input: getComputedStyle(element.querySelector('[data-slot="command-input-group"]')).boxShadow,
  }));
  await input.focus();
  const afterFocus = await command.evaluate((element) => ({
    root: getComputedStyle(element).boxShadow,
    input: getComputedStyle(element.querySelector('[data-slot="command-input-group"]')).boxShadow,
  }));
  expect(afterFocus.root).toBe(beforeFocus.root);
  expect(afterFocus.input).not.toBe(beforeFocus.input);
  await expect(inputGroup).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps Dialog preview free of a redundant heading", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/dialog");

  const preview = page.getByRole("region", { name: "dialog preview" });
  await expect(preview.getByRole("button", { name: "Open dialog" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expect(
    page
      .getByRole("complementary", { name: "On this page" })
      .getByRole("link", { name: "Preview", exact: true }),
  ).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Tooltip preview free of a redundant heading", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/tooltip");

  const preview = page.getByRole("region", { name: "tooltip preview" });
  await expect(preview.getByRole("button", { name: "Copy link" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expect(
    page
      .getByRole("complementary", { name: "On this page" })
      .getByRole("link", { name: "Preview", exact: true }),
  ).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps DropdownMenu preview icon-complete and free of a redundant heading", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/dropdown-menu", { waitUntil: "networkidle" });

  const preview = page.getByRole("region", { name: "dropdown-menu preview" });
  await preview.getByRole("button", { name: "Actions" }).click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("menuitem")).toHaveCount(3);
  await expect(menu.locator('[data-slot="leading-icon"]')).toHaveCount(3);
  for (const label of ["Share workspace", "Duplicate workspace", "Archive"]) {
    await expect(
      menu.getByRole("menuitem", { name: label }).locator('[data-slot="leading-icon"]'),
    ).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "Preview", exact: true })).toHaveCount(0);
  await expect(
    page
      .getByRole("complementary", { name: "On this page" })
      .getByRole("link", { name: "Preview", exact: true }),
  ).toHaveCount(0);
  await expectHealthyPage(page, problems);
});

test("keeps Alert actions below its description and a static close preview in the trailing slot", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/alert");

  const preview = page.getByRole("region", { name: "Alert preview" });
  const alert = preview.locator('[data-slot="root"]');
  const content = alert.locator(':scope > [data-slot="content"]');
  await expect(content.locator(':scope > [data-slot="action"]')).toContainText("Refresh");
  await expect(alert.locator(':scope > [data-slot="close"]')).toBeVisible();

  await alert.getByRole("button", { name: "Close alert" }).click();
  await expect(alert).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("centers the desktop primary navigation over the home hero", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  for (const direction of ["ltr", "rtl"]) {
    await page.locator("html").evaluate((element, value) => {
      element.dir = value;
    }, direction);

    const alignment = await page.evaluate(() => {
      const navigation = document.querySelector(".docs-primary-nav")?.getBoundingClientRect();
      const hero = document.querySelector(".home-hero")?.getBoundingClientRect();
      if (!navigation || !hero) return null;

      return {
        heroCenter: hero.left + hero.width / 2,
        navigationCenter: navigation.left + navigation.width / 2,
      };
    });

    expect(alignment).not.toBeNull();
    expect(Math.abs(alignment.navigationCenter - alignment.heroCenter)).toBeLessThanOrEqual(1);
  }
  await expectHealthyPage(page, problems);
});

test("composes documentation search from Dialog and Command primitives", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/kbd");
  await page.getByRole("button", { name: "Search documentation" }).click();

  const dialog = page.getByRole("dialog", { name: "Search documentation" });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-slot="command"]')).toHaveCount(1);
  await expect(dialog.locator('[data-slot="command-input"]')).toHaveCount(1);
  await expect(dialog.locator('[data-slot="command-list"]')).toHaveCount(1);
  await expect(dialog.locator('[data-slot="command-item"]')).toHaveCount(12);
  await expect(
    dialog.locator(
      ".docs-command__input-wrap, .docs-command__results, .docs-command__group, .docs-command__empty",
    ),
  ).toHaveCount(0);

  let search = dialog.getByRole("combobox", { name: "Search documentation" });
  await search.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: "Search documentation" })).toBeFocused();

  await page.getByRole("button", { name: "Search documentation" }).click();
  search = dialog.getByRole("combobox", { name: "Search documentation" });
  await search.fill("Playground");
  await expect(dialog.getByRole("option", { name: /Playground/ })).toBeVisible();
  await search.press("Enter");
  await expect(page).toHaveURL(/\/playground$/);
  await expectHealthyPage(page, problems);
});

test("keeps a keyboard-opened Dialog contained and restores focus", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/visual-test/blocks/overlay-playground");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Long review notes" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
  await expectHealthyPage(page, problems);
});

test("validates and completes a representative Core form", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/finance-assets");
  await page.getByRole("button", { name: "Transfer" }).click();
  const dialog = page.getByRole("dialog", { name: "New transfer" });
  await dialog.getByRole("button", { name: "Review transfer" }).click();
  await expect(dialog.getByText("Enter an amount greater than zero.")).toBeVisible();
  await dialog.getByRole("textbox", { name: "Amount" }).fill("1200");
  await dialog.getByRole("button", { name: "Review transfer" }).click();
  await expect(page.getByRole("dialog", { name: "Review transfer" })).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("keeps the Operations Workspace responsive and keyboard-safe", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(workspaceRoute);
  const trigger = page.getByRole("button", { name: "Open workspace navigation" });
  await trigger.click();
  const navigation = page.getByRole("dialog", { name: "Workspace navigation" });
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await navigation.evaluate((element) => element.contains(document.activeElement))).toBe(
    true,
  );
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  await expectHealthyPage(page, problems);
});

test("opens mobile documentation navigation and follows a route", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/getting-started");
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  const navigation = page.getByRole("dialog", { name: "Documentation" });
  await expect(navigation).toBeVisible();
  await navigation.getByRole("link", { name: "Tokens", exact: true }).click();
  await expect(page).toHaveURL(/\/docs\/foundations\/tokens$/);
  await expectHealthyPage(page, problems);
});

test("keeps the maintainer-only visual language reference out of public docs", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/getting-started");
  await expect(page.getByRole("link", { name: "Visual language", exact: true })).toHaveCount(0);
  await expectHealthyPage(page, problems);

  const response = await page.goto("/docs/foundations/visual-language");
  expect(response?.status()).toBe(404);
});

test("keeps the EmptyState example focused on one primary team action", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/empty-state");

  const preview = page.getByRole("region", { name: "EmptyState preview" });
  const emptyState = preview.locator('[data-slot="empty-state"]');
  await expect(emptyState.getByRole("heading", { name: "No team members yet" })).toBeVisible();
  await expect(emptyState.getByText(/Invite people to collaborate/)).toBeVisible();
  const invite = emptyState.getByRole("button", { name: "Invite team members" });
  await expect(invite).toHaveAttribute("data-size", "md");
  await expect(invite).toHaveAttribute("data-variant", "primary");
  await expect(emptyState.getByRole("button")).toHaveCount(1);
  await expectHealthyPage(page, problems);
});

test("keeps FormGroup titles separated from Checkbox options", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/checkbox");

  const preview = page.getByRole("region", { name: "Checkbox preview" });
  const title = preview.getByText("Visible collections", { exact: true });
  const firstCheckbox = preview.getByRole("checkbox", {
    name: "Include archived collections",
  });
  const [titleBox, checkboxBox] = await Promise.all([
    title.boundingBox(),
    firstCheckbox.boundingBox(),
  ]);
  expect(titleBox).not.toBeNull();
  expect(checkboxBox).not.toBeNull();
  expect(checkboxBox.y - (titleBox.y + titleBox.height)).toBeGreaterThanOrEqual(8);
  await expectHealthyPage(page, problems);
});

test("keeps Slider spacing compact and Slider and Switch thumbs white across modes", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/slider");

  const slider = page.getByRole("region", { name: "Slider preview" }).getByRole("group");
  const sliderThumb = slider.locator('[data-slot="thumb"]');
  await expect(slider).toHaveCSS("row-gap", "4px");

  const sliderColors = [];
  for (const mode of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => {
      element.setAttribute("data-mode", value);
    }, mode);
    sliderColors.push(
      await sliderThumb.evaluate((element) => getComputedStyle(element).backgroundColor),
    );
  }

  await page.goto("/docs/components/switch");
  const switchThumb = page
    .getByRole("region", { name: "Switch preview" })
    .getByRole("switch", { name: "Notify collaborators" })
    .locator('[data-slot="thumb"]');
  const switchColors = [];
  for (const mode of ["light", "dark"]) {
    await page.locator("html").evaluate((element, value) => {
      element.setAttribute("data-mode", value);
    }, mode);
    switchColors.push(
      await switchThumb.evaluate((element) => getComputedStyle(element).backgroundColor),
    );
  }

  expect(sliderColors).toEqual(["rgb(255, 255, 255)", "rgb(255, 255, 255)"]);
  expect(switchColors).toEqual(["rgb(255, 255, 255)", "rgb(255, 255, 255)"]);
  await expectHealthyPage(page, problems);
});

test("keeps simple List items compact", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/list");

  const list = page
    .getByRole("region", { name: "list preview" })
    .getByRole("list", { name: "Setup steps" });
  await expect(list).toHaveCSS("row-gap", "4px");
  const items = list.getByRole("listitem");
  await expect(items).toHaveCount(3);
  await expect(items.first().locator('[data-slot="body"]')).toHaveCSS("padding-top", "8px");

  const firstTitle = items.nth(0).locator('[data-slot="title"]');
  const secondTitle = items.nth(1).locator('[data-slot="title"]');
  const [firstBox, secondBox] = await Promise.all([
    firstTitle.boundingBox(),
    secondTitle.boundingBox(),
  ]);
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  expect(secondBox.y - firstBox.y).toBeLessThanOrEqual(40);
  await expectHealthyPage(page, problems);
});

test("shows a rich Card example with stronger external than internal spacing", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/card");

  const card = page.getByRole("region", { name: "card preview" }).locator('[data-slot="card"]');
  await expect(card.locator('[data-slot="card-visual"] img')).toBeVisible();
  const title = card.locator('[data-slot="card-title"]');
  await expect(title).toHaveText("Design system rollout");
  await expect(title).toHaveJSProperty("tagName", "DIV");
  await expect(title).toHaveCSS("font-size", "16px");
  await expect(card.locator('[data-slot="card-description"]')).toHaveCSS("font-size", "14px");
  await expect(card.locator('[data-slot="card-content"]')).toBeVisible();
  await expect(card.getByRole("button", { name: "Open workspace" })).toHaveAttribute(
    "data-variant",
    "primary",
  );
  await expect(card.getByRole("button")).toHaveCount(1);
  await expect(card).toHaveCSS("row-gap", "16px");
  await expect(card.locator('[data-slot="card-header"]')).toHaveCSS("row-gap", "8px");
  await expectHealthyPage(page, problems);
});

test("preserves RTL and reduced motion in a product composition", async ({ page }) => {
  const problems = monitorPage(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 720 });
  await page.goto(workspaceRoute);
  const previewSettings = await openMobilePreviewSettings(page);
  await previewSettings.getByRole("combobox", { name: "Direction" }).click();
  await page.getByRole("option", { name: "Right to left" }).click();
  await page.keyboard.press("Escape");
  await expect(previewSettings).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator('[data-slot="sidebar-provider"]')).toHaveAttribute(
    "data-direction",
    "rtl",
  );
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(
    true,
  );
  await expectHealthyPage(page, problems);
});

test("keeps DatePicker keyboard selection and form value aligned", async ({ page }) => {
  const problems = monitorPage(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/components/date-picker");
  const preview = page.getByRole("region", { name: "DatePicker preview" });
  await expect(preview.getByRole("button", { name: "Release date" })).toHaveCount(1);
  await expect(preview.getByRole("button", { name: "Submit dates" })).toHaveCount(0);
  await expect(preview.getByRole("button", { name: "Invalid required date" })).toHaveCount(0);
  await expect(preview.getByRole("button", { name: "Read-only date" })).toHaveCount(0);
  await expect(preview.getByText(/Form value:|Submitted form data:/)).toHaveCount(0);
  const trigger = page.getByRole("button", { name: "Release date" });
  await trigger.press("Enter");
  const calendar = page.getByRole("group", { name: "Choose date" });
  await expect(calendar.getByRole("button", { name: "June 15, 2026, Selected" })).toBeFocused();
  await calendar.getByRole("button", { name: "June 16, 2026" }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator('input[name="releaseDate"]')).toHaveValue("2026-06-16");
  expect(await page.locator("form").evaluate((form) => new FormData(form).get("releaseDate"))).toBe(
    "2026-06-16",
  );
  await expectHealthyPage(page, problems);
});
