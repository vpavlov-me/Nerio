import { expect, test } from "@playwright/test";

const healthStabilityWindowMs = 250;

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
    if (errorText !== "net::ERR_ABORTED") problems.push(`request: ${request.url()} (${errorText})`);
  });
  return problems;
}

async function expectHealthyPage(page, problems) {
  await expect(page.locator("nextjs-portal [data-nextjs-dialog-overlay]")).toHaveCount(0);
  await page.waitForTimeout(healthStabilityWindowMs);
  expect(problems).toEqual([]);
}

test("covers public docs routes, Sidebar examples, and appearance controls", async ({ page }) => {
  const problems = monitorPage(page);

  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goto("/docs/getting-started");
  await expect(page.getByRole("heading", { name: "Getting started" })).toBeVisible();

  for (const route of ["button", "sidebar-primitive", "command-primitive"]) {
    await page.goto(`/docs/components/${route}`);
    await expect(page.getByRole("main")).toBeVisible();
  }

  await page.goto("/docs/components/sidebar-primitive");
  await expect(page.getByLabel("Sidebar preview")).toBeVisible();
  await expect(
    page.getByText('label="Toggle workspace sidebar"', { exact: false }).first(),
  ).toBeVisible();
  await expect(page.getByText('import * as React from "react";', { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Purple", exact: true }).click();
  await page.getByRole("menuitem", { name: /Blue/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "blue");

  await page.getByRole("button", { name: "Comfortable", exact: true }).click();
  await page.getByRole("menuitem", { name: /Compact/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-density", "compact");

  await page.getByRole("button", { name: "Color mode: System" }).click();
  await page.getByRole("menuitem", { name: /Dark/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-mode", "dark");

  await expectHealthyPage(page, problems);
});

test("keeps Actions and Forms Tailwind recipes active across public docs", async ({ page }) => {
  const problems = monitorPage(page);
  const routes = [
    ["button-group", ".n-button-group", ["flex", "inline-flex"]],
    ["input-group", ".n-input-group", ["flex"]],
    ["checkbox", ".n-checkbox", ["flex", "inline-flex"]],
    ["radio-group", ".n-radio", ["flex", "inline-flex"]],
    ["switch", ".n-switch", ["flex", "inline-flex"]],
    ["select", ".n-select-trigger", ["flex", "inline-flex"]],
    ["label", ".n-label", ["block", "inline"]],
  ];

  for (const [route, selector, expectedDisplays] of routes) {
    await page.goto(`/docs/components/${route}`);
    const component = page.locator(selector).first();
    await expect(component, route).toBeVisible();
    const snapshot = await component.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        borderStyle: style.borderStyle,
        display: style.display,
        fontFamily: style.fontFamily,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(expectedDisplays, `${route} display`).toContain(snapshot.display);
    expect(snapshot.fontFamily, `${route} font`).not.toBe("");
    expect(snapshot.overflow, `${route} overflow`).toBeLessThanOrEqual(1);
    if (["checkbox", "radio-group", "switch", "select"].includes(route)) {
      expect(snapshot.borderStyle, `${route} border`).toBe("solid");
    }
  }

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await page.goto("/docs/components/checkbox");
  await expect(page.locator(".n-checkbox").first()).toHaveCSS("transition-duration", "0s");
  await page.goto("/docs/components/switch");
  await expect(page.locator(".n-switch").first()).toHaveCSS("transition-duration", "0s");

  await expectHealthyPage(page, problems);
});

test("keeps the docs shell inside emulated safe areas without overflow", async ({
  page,
  browserName,
}) => {
  test.skip(browserName !== "chromium", "Safe-area emulation uses Chromium CDP.");
  const problems = monitorPage(page);
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { top: 47, right: 8, bottom: 34, left: 8 },
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/docs/getting-started");

  const shell = await page.locator(".docs-shell").evaluate((element) => {
    const rootStyle = getComputedStyle(document.documentElement);
    const header = element.querySelector(".docs-header").getBoundingClientRect();
    return {
      bottom: rootStyle.getPropertyValue("--n-docs-safe-area-block-end").trim(),
      inlineEnd: rootStyle.getPropertyValue("--n-docs-safe-area-inline-end").trim(),
      inlineStart: rootStyle.getPropertyValue("--n-docs-safe-area-inline-start").trim(),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      top: rootStyle.getPropertyValue("--n-docs-safe-area-block-start").trim(),
      headerTop: header.top,
    };
  });

  expect(shell.top).toBe("47px");
  expect(shell.bottom).toBe("34px");
  expect(shell.inlineStart).toBe("8px");
  expect(shell.inlineEnd).toBe("8px");
  expect(shell.headerTop).toBe(0);
  expect(shell.overflow).toBeLessThanOrEqual(1);
  await expectHealthyPage(page, problems);
});
