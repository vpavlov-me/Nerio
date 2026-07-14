import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "line",
  timeout: 60_000,
  use: { trace: "retain-on-failure" },
  webServer: [
    {
      command: "pnpm --filter @nerio/demo-app dev",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: "http://localhost:3002",
    },
    {
      command: "pnpm --filter @nerio/docs dev",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: "http://localhost:3000",
    },
  ],
  projects: [
    {
      name: "demo-chromium",
      testMatch: "release-smoke.spec.mjs",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3002" },
    },
    {
      name: "docs-chromium",
      testMatch: "docs-smoke.spec.mjs",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:3000" },
    },
  ],
});
