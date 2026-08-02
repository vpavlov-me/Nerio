import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect } from "@playwright/test";

export const routeBudgets = JSON.parse(
  readFileSync(resolve("quality/docs-route-budgets.json"), "utf8"),
).routes;

export async function measureRoute(page, route, testInfo) {
  const externalRequests = [];
  const errors = [];
  await page.addInitScript(() => {
    window.__nerioLayoutShiftScore = 0;
    window.__nerioLargestContentfulPaint = 0;
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (!entry.hadRecentInput) window.__nerioLayoutShiftScore += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((entries) => {
      const latest = entries.getEntries().at(-1);
      if (latest) window.__nerioLargestContentfulPaint = latest.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
  });
  await page.route("**/*", async (requestRoute) => {
    const url = new URL(requestRoute.request().url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
      if (url.hostname === "mc.yandex.ru") {
        await requestRoute.fulfill({ status: 204 });
        return;
      }
      externalRequests.push(url.href);
      await requestRoute.abort();
      return;
    }
    await requestRoute.continue();
  });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(route, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);

  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    return {
      transferBytes: resources.reduce(
        (total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0),
        0,
      ),
      layoutShift: window.__nerioLayoutShiftScore,
      largestContentfulPaint: window.__nerioLargestContentfulPaint,
      horizontalOverflow:
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  const budget = routeBudgets[route];
  testInfo.annotations.push({
    type: "performance-metrics",
    description: JSON.stringify(metrics),
  });
  expect(budget, `${route} has a measured route budget`).toBeTruthy();
  expect(
    metrics.transferBytes,
    `${testInfo.project.name} ${route} runtime transfer`,
  ).toBeLessThanOrEqual(budget.runtimeTransferBytes);
  expect(metrics.layoutShift, `${testInfo.project.name} ${route} CLS`).toBeLessThanOrEqual(0.1);
  expect(
    metrics.largestContentfulPaint,
    `${testInfo.project.name} ${route} records LCP`,
  ).toBeGreaterThan(0);
  expect(
    metrics.largestContentfulPaint,
    `${testInfo.project.name} ${route} stable local LCP tripwire`,
  ).toBeLessThanOrEqual(2_500);
  expect(
    metrics.horizontalOverflow,
    `${testInfo.project.name} ${route} document overflow`,
  ).toBeLessThanOrEqual(0);
  expect(externalRequests, `${route} unexpected network`).toEqual([]);
  expect(errors, `${route} console, hydration, and runtime errors`).toEqual([]);
  return metrics;
}
