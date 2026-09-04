import assert from "node:assert/strict";
import { resolve } from "node:path";
import test from "node:test";
import {
  defaultDocsRouteReportPath,
  isRepositoryArtifactReportPath,
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
  assert.deepEqual(resolveDocsRouteReportOutput(["--output=/tmp/nerio-routes.json"], root), {
    writeReport: true,
    outputPath: resolve("/tmp/nerio-routes.json"),
  });
  assert.deepEqual(
    resolveDocsRouteReportOutput(["--output=artifacts\\reports\\routes.json"], root),
    {
      writeReport: true,
      outputPath: resolve(root, "artifacts/reports/routes.json"),
    },
  );
});

test("accepts the repository artifact directory with platform path separators", () => {
  assert.equal(isRepositoryArtifactReportPath("artifacts/reports/routes.json"), true);
  assert.equal(isRepositoryArtifactReportPath("artifacts\\reports\\routes.json"), true);
  assert.equal(isRepositoryArtifactReportPath("quality\\reports\\routes.json"), false);
});

test("rejects report output over tracked repository paths", () => {
  for (const path of [
    "quality/docs-route-bundle-baseline.json",
    "package.json",
    "artifacts\\..\\package.json",
  ]) {
    assert.throws(
      () => resolveDocsRouteReportOutput([`--output=${path}`], root),
      /inside the repository must stay under artifacts/,
      path,
    );
  }
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
