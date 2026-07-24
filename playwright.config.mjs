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
  webServer: {
    command:
      "VERCEL_ENV=development pnpm --filter @nerio-ui/docs build && VERCEL_ENV=development pnpm --filter @nerio-ui/docs exec next start --port 3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    url: "http://localhost:3100",
  },
  projects: [
    {
      name: "template-chromium",
      testMatch: [
        "template-release-smoke.spec.mjs",
        "cross-engine-template.spec.mjs",
        "finance-template.spec.mjs",
        "template-routes.spec.mjs",
        "performance-smoke.spec.mjs",
      ],
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3100" },
    },
    {
      name: "template-firefox",
      testMatch: "cross-engine-template.spec.mjs",
      use: { ...devices["Desktop Firefox"], baseURL: "http://localhost:3100" },
    },
    {
      name: "template-webkit",
      testMatch: "cross-engine-template.spec.mjs",
      use: { ...devices["Desktop Safari"], baseURL: "http://localhost:3100" },
    },
    {
      name: "docs-chromium",
      testMatch: [
        "block-routes.spec.mjs",
        "docs-smoke.spec.mjs",
        "cross-engine-docs.spec.mjs",
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
