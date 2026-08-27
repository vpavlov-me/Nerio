import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import {
  defaultDocsRouteReportPath,
  resolveDocsRouteReportOutput,
} from "./docs-route-bundle-report-options.mjs";

const root = resolve("/workspace/nerio");

test("keeps report output disabled for budget-only validation", () => {
  assert.deepEqual(resolveDocsRouteReportOutput([], root), {
    writeReport: false,
    outputPath: resolve(root, defaultDocsRouteReportPath),
  });
});

test("writes reports to the ignored artifact directory by default", () => {
  assert.deepEqual(resolveDocsRouteReportOutput(["--write"], root), {
    writeReport: true,
    outputPath: resolve(root, "artifacts/docs-route-bundle-report.json"),
  });
});

test("supports an explicit ephemeral output path", () => {
  assert.deepEqual(
    resolveDocsRouteReportOutput(["--report-only", "--output=artifacts/reports/routes.json"], root),
    {
      writeReport: true,
      outputPath: resolve(root, "artifacts/reports/routes.json"),
    },
  );
});

test("rejects missing or repeated output values", () => {
  assert.throws(
    () => resolveDocsRouteReportOutput(["--output"], root),
    /--output requires a path value/,
  );
  assert.throws(
    () => resolveDocsRouteReportOutput(["--output=one.json", "--output", "two.json"], root),
    /pass --output only once/,
  );
});
