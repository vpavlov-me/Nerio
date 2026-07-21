import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  failOnFlakyTests: Boolean(process.env.CI),
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: process.env.CI
    ? [["github"], ["json", { outputFile: "test-results/browser/results.json" }]]
    : "line",
  outputDir: "./test-results/browser/artifacts",
  timeout: 60_000,
  use: {
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
  },
  webServer: [
    {
      command:
        "pnpm --filter @nerio-ui/demo-app build && pnpm --filter @nerio-ui/demo-app exec next start --port 3002",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      url: "http://localhost:3002",
    },
    {
      command:
        "VERCEL_ENV=development pnpm --filter @nerio-ui/docs build && VERCEL_ENV=development pnpm --filter @nerio-ui/docs exec next start --port 3100",
      reuseExistingServer: !process.env.CI,
      timeout: 180_000,
      url: "http://localhost:3100",
    },
  ],
  projects: [
    {
      name: "demo-chromium",
      testMatch: [
        "release-smoke.spec.mjs",
        "cross-engine-demo.spec.mjs",
        "performance-smoke.spec.mjs",
      ],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3002" },
    },
    {
      name: "demo-firefox",
      testMatch: "cross-engine-demo.spec.mjs",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3002" },
    },
    {
      name: "demo-webkit",
      testMatch: "cross-engine-demo.spec.mjs",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3002" },
    },
    {
      name: "docs-chromium",
      testMatch: [
        "docs-smoke.spec.mjs",
        "cross-engine-docs.spec.mjs",
        "performance-smoke.spec.mjs",
        "docs-performance-smoke.spec.mjs",
      ],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3100" },
    },
    {
      name: "docs-firefox",
      testMatch: "cross-engine-docs.spec.mjs",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3100" },
    },
    {
      name: "docs-webkit",
      testMatch: "cross-engine-docs.spec.mjs",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3100" },
    },
  ],
});
