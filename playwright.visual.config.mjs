import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  outputDir: "./test-results/visual",
  snapshotPathTemplate: "{testDir}/__screenshots__/{platform}/{arg}{ext}",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [["github"], ["html", { outputFolder: "playwright-report/visual", open: "never" }]]
    : "line",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      threshold: 0.15,
      maxDiffPixels: 100,
    },
  },
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://localhost:3100",
    colorScheme: "light",
    deviceScaleFactor: 1,
    locale: "en-US",
    reducedMotion: "no-preference",
    screenshot: "only-on-failure",
    timezoneId: "UTC",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command:
      "pnpm --filter @nerio-ui/docs build && pnpm --filter @nerio-ui/docs exec next start --port 3100",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    url: "http://localhost:3100/visual-test",
  },
  projects: [
    {
      name: "visual-chromium",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3100" },
    },
  ],
});
