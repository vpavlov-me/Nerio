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

test("preserves copied changelog hierarchy and rendered inline code", async ({ context, page }) => {
  const problems = monitorPage(page);
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/changelog");

  const migrationLink = page.getByRole("link", {
    name: "docs/migrations/beta-0-to-beta-1.md",
  });
  await expect(migrationLink.locator("code")).toHaveText("docs/migrations/beta-0-to-beta-1.md");
  await expect(page.locator('time[datetime="2026-08-09"]')).toHaveText("August 9, 2026");

  await page.getByRole("button", { name: "Copy Markdown" }).click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  const markdown = await page.evaluate(() => navigator.clipboard.readText());
  expect(markdown).toContain("#### Foundations");
  expect(markdown).toContain("#### Components");
  await expectHealthyPage(page, problems);
});

test("links the homepage badge to the latest changelog post", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");

  const latestPost = page.locator(".home-hero__changelog");
  const latestPostTitle = (await latestPost.innerText()).trim();
  const latestPostHref = await latestPost.getAttribute("href");
  expect(latestPostTitle).not.toBe("");
  expect(latestPostHref).toMatch(/^\/docs\/changelog#[a-z0-9-]+$/);
  await expect(latestPost.locator('[data-slot="leading-icon"]')).toHaveCount(0);
  await latestPost.click();
  await expect(page).toHaveURL(new RegExp(`${latestPostHref}$`));
  await expect(page.getByRole("heading", { name: latestPostTitle })).toBeVisible();
  await expectHealthyPage(page, problems);
});

test("links the Nerio profile card to X and omits the density preference", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/");

  const profile = page.getByRole("link", { name: /Nerio — Design System/ });
  await expect(profile).toHaveAccessibleName("Nerio — Design System");
  await expect(profile).toHaveAccessibleDescription(
    "Accessible building blocks for adaptable product teams.",
  );
  await expect(profile).toHaveAttribute("href", "https://x.com/nerio_ui");
  await expect(profile).toHaveAttribute("target", "_blank");
  await expect(profile).toHaveAttribute("rel", "noopener noreferrer");
  await expect(profile).toContainText("@nerio_ui");
  await expect(profile.getByText("Open source", { exact: true })).toHaveCount(0);
  await expect(
    profile.getByText("Accessible building blocks for adaptable product teams.", { exact: true }),
  ).toHaveJSProperty("tagName", "P");
  await expect(profile.getByText("46 Components", { exact: true })).toBeVisible();
  await expect(profile.getByText("950 Tokens", { exact: true })).toBeVisible();
  await expect(profile.getByRole("img", { name: "Nerio — Design System" })).toHaveAttribute(
    "src",
    "/brand/x-avatar.svg",
  );
  await expect(page.getByText("Compact density", { exact: true })).toHaveCount(0);

  const accountCard = page.getByRole("region", { name: "Create an account" });
  const primaryAccountAction = accountCard.getByRole("button", { name: "Get started" });
  const providerActions = accountCard.getByRole("button", { name: /^Continue with/ });
  await expect(providerActions).toHaveCount(2);
  await expect(providerActions.nth(0)).toHaveAttribute("data-size", "md");
  await expect(providerActions.nth(1)).toHaveAttribute("data-size", "md");
  const accountActionHeights = await Promise.all([
    primaryAccountAction.evaluate((element) => element.getBoundingClientRect().height),
    providerActions.nth(0).evaluate((element) => element.getBoundingClientRect().height),
    providerActions.nth(1).evaluate((element) => element.getBoundingClientRect().height),
  ]);
  expect(Math.max(...accountActionHeights) - Math.min(...accountActionHeights)).toBeLessThanOrEqual(
    0.5,
  );
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
  const track = preview.locator('[data-slot="track"]');
  const [headerBox, trackBox] = await Promise.all([header.boundingBox(), track.boundingBox()]);
  expect(headerBox).not.toBeNull();
  expect(trackBox).not.toBeNull();
  expect(Math.round(trackBox.y - (headerBox.y + headerBox.height))).toBe(8);
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

test("keeps Combobox query, keyboard, pointer, clear, and RTL behavior bounded", async ({
  page,
}) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/combobox");

  const preview = page.getByRole("region", { name: "combobox preview" });
  const input = preview.getByRole("combobox", { name: "City" });
  await input.fill("tbi");
  const option = page.getByRole("option", { name: "Tbilisi" });
  await expect(option).toBeVisible();
  await expect(page.getByRole("option", { name: "Paris" })).toHaveCount(0);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(input).toHaveValue("Tbilisi");

  await preview.getByRole("button", { name: "Clear selection" }).click();
  await expect(input).toHaveValue("");
  await page.locator("html").evaluate((root) => {
    root.dir = "rtl";
  });
  await preview.getByRole("button", { name: "Toggle options" }).click();
  await expect(page.getByRole("listbox")).toBeVisible();
  await expect(page.locator('[data-slot="content"]')).toHaveAttribute("data-align", "start");
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

test("keeps AlertDialog conservative and focuses the safe action", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/components/alert-dialog");

  const trigger = page.getByRole("button", { name: "Delete project" }).first();
  await trigger.click();
  const dialog = page.getByRole("alertdialog", { name: "Delete project?" });
  const cancel = dialog.getByRole("button", { name: "Cancel" });
  await expect(dialog).toBeVisible();
  await expect(cancel).toBeFocused();

  await page.mouse.click(8, 8);
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
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

  await page.getByRole("button", { name: "Search documentation" }).click();
  search = page
    .getByRole("dialog", { name: "Search documentation" })
    .getByRole("combobox", { name: "Search documentation" });
  await search.fill("Finance & Assets");
  const financeOption = page
    .getByRole("dialog", { name: "Search documentation" })
    .getByRole("option", { name: /Finance & Assets/ });
  const [templatePreview] = await Promise.all([page.waitForEvent("popup"), financeOption.click()]);
  await expect(templatePreview).toHaveURL(/\/views\/finance-assets$/);
  await templatePreview.close();
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

test("opens and closes the static Finance Assets transfer preview", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/views/finance-assets");
  await page.getByRole("button", { name: "Transfer" }).click();
  const dialog = page.getByRole("dialog", { name: "Transfer preview" });
  await expect(dialog.getByText("Demonstration only")).toBeVisible();
  await expect(dialog.getByText("$5,000.00")).toBeVisible();
  await dialog.getByRole("button", { name: "Done" }).click();
  await expect(dialog).toBeHidden();
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

test("keeps canonical foundation discovery ordered and aliases non-competing", async ({
  page,
  request,
}) => {
  const problems = monitorPage(page);
  const foundationLabels = [
    "Tokens",
    "Color",
    "Typography",
    "Spacing & layout",
    "Themes",
    "Accessibility",
    "Localization",
    "Radius",
    "Effects",
    "Motion",
    "Icons",
  ];
  const foundationPaths = [
    "/docs/foundations/tokens",
    "/docs/foundations/color",
    "/docs/foundations/typography",
    "/docs/foundations/spacing-layout",
    "/docs/foundations/themes",
    "/docs/foundations/accessibility",
    "/docs/foundations/localization",
    "/docs/foundations/radius",
    "/docs/foundations/effects",
    "/docs/foundations/motion",
    "/docs/foundations/icons",
  ];

  await page.goto("/docs/foundations/tokens");
  const desktopFoundations = page
    .getByRole("navigation", { name: "Documentation" })
    .locator(".nav-group")
    .filter({ has: page.getByRole("heading", { name: "Foundations", exact: true }) });
  await expect(desktopFoundations.getByRole("link")).toHaveText(foundationLabels);
  await expect(
    page
      .getByRole("navigation", { name: "Documentation pagination" })
      .getByRole("link", { name: "Color", exact: true }),
  ).toHaveAttribute("href", "/docs/foundations/color");

  await page.getByRole("button", { name: "Search documentation" }).click();
  const searchDialog = page.getByRole("dialog", { name: "Search documentation" });
  await searchDialog
    .getByRole("combobox", { name: "Search documentation" })
    .fill("semantic color roles");
  await expect(searchDialog.getByRole("option", { name: /Color/ }).first()).toBeVisible();
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open documentation navigation" }).click();
  const mobileFoundations = page
    .getByRole("dialog", { name: "Documentation" })
    .locator(".docs-mobile-navigation__group")
    .filter({ has: page.getByRole("heading", { name: "Foundations", exact: true }) });
  await expect(mobileFoundations.getByRole("link")).toHaveText(foundationLabels);

  const sitemap = await request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();
  foundationPaths.forEach((path) => expect(sitemapText).toContain(path));
  expect(sitemapText).not.toContain("/docs/foundations/animations");

  const legacy = await request.get("/docs/foundations/animations", { maxRedirects: 0 });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe("/docs/foundations/motion");
  await expectHealthyPage(page, problems);
});

test("discovers the Accessibility foundation through navigation and search", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/foundations/accessibility");

  await expect(page.getByRole("heading", { level: 1, name: "Accessibility" })).toBeVisible();
  const example = page.getByRole("region", { name: "Accessibility example preview" });
  const input = example.getByRole("textbox", { name: "Project name" });
  await expect(input).toHaveAccessibleDescription(
    "Use a short name that collaborators will recognize.",
  );
  await input.focus();
  await expect(input).toBeFocused();
  await expect(
    page.getByRole("complementary", { name: "On this page" }).getByRole("link", {
      name: "Automated and manual evidence",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Localization foundation" })).toHaveAttribute(
    "href",
    "/docs/foundations/localization",
  );

  await page.getByRole("button", { name: "Search documentation" }).click();
  const search = page
    .getByRole("dialog", { name: "Search documentation" })
    .getByRole("combobox", { name: "Search documentation" });
  await search.fill("Accessibility");
  await expect(
    page
      .getByRole("dialog", { name: "Search documentation" })
      .getByRole("option", { name: /Accessibility/ })
      .first(),
  ).toBeVisible();

  await expectHealthyPage(page, problems);
});

test("discovers and remaps the source-backed Color foundation", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/foundations/color");

  await expect(page.getByRole("heading", { level: 1, name: "Color" })).toBeVisible();
  const example = page.getByRole("region", { name: "Color foundation example preview" });
  const examplePreview = example.locator(".component-example__preview");
  await expect(examplePreview.getByText("Selected", { exact: true })).toBeVisible();
  await expect(examplePreview.getByText("Published", { exact: true })).toBeVisible();
  await expect(
    page
      .getByRole("complementary", { name: "On this page" })
      .getByRole("link", { name: "Pairing and interaction states", exact: true }),
  ).toBeVisible();
  await expect(page.getByLabel("Source-backed semantic color families")).toBeVisible();
  await expect(page.getByLabel("Custom theme validation matrix")).toBeVisible();

  await page.evaluate(() => {
    document.documentElement.dataset.mode = "light";
    document.documentElement.dataset.theme = "purple";
  });
  const purpleLight = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--n-color-action-primary"),
  );
  await page.evaluate(() => {
    document.documentElement.dataset.theme = "blue";
  });
  const blueLight = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--n-color-action-primary"),
  );
  expect(blueLight).not.toBe(purpleLight);

  await page.evaluate(() => {
    document.documentElement.dataset.theme = "orange";
    document.documentElement.dataset.mode = "dark";
  });
  const orangeDark = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--n-color-action-primary"),
  );
  expect(orangeDark).not.toBe(blueLight);

  await page.emulateMedia({ colorScheme: "dark" });
  await page.evaluate(() => {
    document.documentElement.dataset.mode = "system";
  });
  await expect(example).toBeVisible();

  await page.emulateMedia({ forcedColors: "active" });
  const accessibilityLink = page
    .getByRole("link", { name: "Accessibility foundation", exact: true })
    .first();
  await accessibilityLink.focus();
  await expect(accessibilityLink).toBeFocused();

  await page.emulateMedia({ colorScheme: "light", forcedColors: "none" });
  await page.getByRole("button", { name: "Search documentation" }).click();
  const search = page
    .getByRole("dialog", { name: "Search documentation" })
    .getByRole("combobox", { name: "Search documentation" });
  await search.fill("Color");
  await expect(
    page
      .getByRole("dialog", { name: "Search documentation" })
      .getByRole("option", { name: /Color/ })
      .first(),
  ).toBeVisible();

  await expectHealthyPage(page, problems);
});

test("discovers the source-backed Spacing and layout foundation", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/docs/foundations/spacing-layout");

  await expect(page.getByRole("heading", { level: 1, name: "Spacing & layout" })).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Source-backed primitive spacing scale" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Source-backed density spacing aliases" }),
  ).toBeVisible();
  const preview = page.getByRole("region", { name: "Spacing and layout examples" });
  await expect(preview.getByLabel("Workspace settings example")).toBeVisible();
  const overflow = preview.getByRole("region", {
    name: "Team access with horizontal overflow",
  });
  await overflow.focus();
  await expect(overflow).toBeFocused();
  await expect(
    page.getByRole("complementary", { name: "On this page" }).getByRole("link", {
      name: "Resilient layout",
      exact: true,
    }),
  ).toBeVisible();

  const comfortable = await page.evaluate(() => {
    document.documentElement.dataset.density = "comfortable";
    return getComputedStyle(document.documentElement).getPropertyValue("--n-density-space-md");
  });
  const compact = await page.evaluate(() => {
    document.documentElement.dataset.density = "compact";
    return getComputedStyle(document.documentElement).getPropertyValue("--n-density-space-md");
  });
  expect(compact).not.toBe(comfortable);

  await page.setViewportSize({ width: 320, height: 844 });
  const layout = await page.evaluate(() => {
    document.documentElement.dir = "rtl";
    return {
      codeDirection: getComputedStyle(document.querySelector(".code-block")).direction,
      direction: getComputedStyle(document.querySelector(".spacing-layout-preview")).direction,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  expect(layout.codeDirection).toBe("ltr");
  expect(layout.direction).toBe("rtl");
  expect(layout.overflow).toBeLessThanOrEqual(1);
  await expect(preview.getByText("Workspace name for regional operations")).toBeVisible();

  await page.getByRole("button", { name: "Search documentation" }).click();
  const search = page
    .getByRole("dialog", { name: "Search documentation" })
    .getByRole("combobox", { name: "Search documentation" });
  await search.fill("Spacing");
  await expect(
    page
      .getByRole("dialog", { name: "Search documentation" })
      .getByRole("option", { name: /Spacing & layout/ })
      .first(),
  ).toBeVisible();

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
  const sliderRhythm = await slider.evaluate((element) => ({
    controlHeight: Math.round(
      element.querySelector("[data-slot=control]").getBoundingClientRect().height,
    ),
    headerToTrack: Math.round(
      element.querySelector("[data-slot=track]").getBoundingClientRect().top -
        element.querySelector("[data-slot=header]").getBoundingClientRect().bottom,
    ),
    trackToDescription: Math.round(
      element.querySelector("[data-slot=description]").getBoundingClientRect().top -
        element.querySelector("[data-slot=track]").getBoundingClientRect().bottom,
    ),
  }));
  expect(sliderRhythm).toEqual({ controlHeight: 32, headerToTrack: 8, trackToDescription: 8 });

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

test("keeps an aria-labelled Slider hit area inside its layout box", async ({ page }) => {
  const problems = monitorPage(page);
  await page.goto("/visual-test/slider");

  const slider = page.locator(".n-slider").filter({
    has: page.getByRole("slider", { name: "Read-only volume" }),
  });
  const control = slider.locator('[data-slot="control"]');
  const [sliderBox, controlBox, controlMargins] = await Promise.all([
    slider.boundingBox(),
    control.boundingBox(),
    control.evaluate((element) => {
      const style = getComputedStyle(element);
      return { bottom: style.marginBottom, top: style.marginTop };
    }),
  ]);
  expect(sliderBox).not.toBeNull();
  expect(controlBox).not.toBeNull();
  expect(Math.round(controlBox.height)).toBe(32);
  expect(controlMargins).toEqual({ bottom: "0px", top: "0px" });
  expect(controlBox.y).toBeGreaterThanOrEqual(sliderBox.y);
  expect(controlBox.y + controlBox.height).toBeLessThanOrEqual(sliderBox.y + sliderBox.height);

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
  await expect(card.locator('[data-slot="card-header"]')).toHaveCSS("row-gap", "3.2px");
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
