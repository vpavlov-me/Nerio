import { expect, test } from "@playwright/test";

const routeBudgetBytes = 8 * 1024 * 1024;
const workspaceRoute = "/views/operations-workspace";

test("keeps the primary route locally owned, hydration-clean, shift-safe, and within budget", async ({
  page,
}, testInfo) => {
  const externalRequests = [];
  const errors = [];
  await page.addInitScript(() => {
    window.__nerioLayoutShiftScore = 0;
    new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        if (!entry.hadRecentInput) window.__nerioLayoutShiftScore += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) {
      if (url.hostname === "mc.yandex.ru") {
        await route.fulfill({ status: 204 });
        return;
      }
      externalRequests.push(url.href);
      await route.abort();
      return;
    }
    await route.continue();
  });
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(workspaceRoute);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);

  const metrics = await page.evaluate(() => {
    const resources = performance.getEntriesByType("resource");
    return {
      bytes: resources.reduce(
        (total, entry) => total + (entry.transferSize || entry.encodedBodySize || 0),
        0,
      ),
      layoutShift: window.__nerioLayoutShiftScore,
    };
  });
  expect(metrics.bytes, `${testInfo.project.name} route transfer size`).toBeLessThanOrEqual(
    routeBudgetBytes,
  );
  expect(
    metrics.layoutShift,
    `${testInfo.project.name} cumulative layout shift`,
  ).toBeLessThanOrEqual(0.1);
  expect(externalRequests).toEqual([]);
  expect(errors).toEqual([]);
});
