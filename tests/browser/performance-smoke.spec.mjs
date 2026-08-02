import { test } from "@playwright/test";
import { measureRoute } from "./performance-helpers.mjs";

const workspaceRoute = "/views/operations-workspace";

test("keeps the full-screen view within measured performance and resilience budgets", async ({
  page,
}, testInfo) => {
  await measureRoute(page, workspaceRoute, testInfo);
});
