import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-manual-audit-plan.mjs");

function run(args = []) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function withFixture(source, update, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-manual-audit-"));
  const target = resolve(directory, source.endsWith(".json") ? "plan.json" : "report.md");
  writeFileSync(target, update(readFileSync(resolve(root, source), "utf8")));
  try {
    callback(target);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function withPlanAndReportFixtures(planUpdate, reportUpdate, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-manual-audit-"));
  const planTarget = resolve(directory, "plan.json");
  const reportTarget = resolve(directory, "report.md");
  writeFileSync(
    planTarget,
    planUpdate(readFileSync(resolve(root, "quality/manual-audit-plan.json"), "utf8")),
  );
  writeFileSync(
    reportTarget,
    reportUpdate(
      readFileSync(resolve(root, "docs/audits/core-1-0-accessibility-device-audit.md"), "utf8"),
    ),
  );
  try {
    callback(planTarget, reportTarget);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("manual audit validator accepts the prepared pending plan", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /21 scenarios, 8 required environments/);
  assert.match(result.stdout, /manual evidence still pending/);
});

test("manual audit validator accepts a completed evidence record", () => {
  withPlanAndReportFixtures(
    (source) => JSON.stringify({ ...JSON.parse(source), status: "complete" }, null, 2),
    (source) =>
      source
        .replace("Status: **Prepared — manual evidence pending**", "Status: **Complete**")
        .replace("Candidate commit: **Pending**", `Candidate commit: **${"a".repeat(40)}**`)
        .replace("Final decision: **Pending**", "Final decision: **Pass for real consumer pilots**")
        .replaceAll("Not run", "Pass")
        .replaceAll("Pending", "Recorded"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /manual evidence complete/);
    },
  );
});

test("manual audit validator rejects incomplete completed-state evidence", () => {
  withPlanAndReportFixtures(
    (source) => JSON.stringify({ ...JSON.parse(source), status: "complete" }, null, 2),
    (source) =>
      source.replace("Status: **Prepared — manual evidence pending**", "Status: **Complete**"),
    (planTarget, reportTarget) => {
      const result = run(["--plan", planTarget, "--report", reportTarget]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /40-character candidate commit/);
      assert.match(result.stderr, /must record one allowed final decision/);
      assert.match(result.stderr, /must not leave pending or not-run table evidence/);
    },
  );
});

test("manual audit validator rejects missing required environments", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) =>
      JSON.stringify(
        {
          ...JSON.parse(source),
          requiredEnvironments: JSON.parse(source).requiredEnvironments.filter(
            ({ id }) => id !== "windows-nvda",
          ),
        },
        null,
        2,
      ),
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Required environments is missing: windows-nvda/);
    },
  );
});

test("manual audit validator rejects coverage and report drift", () => {
  withFixture(
    "quality/manual-audit-plan.json",
    (source) =>
      JSON.stringify(
        {
          ...JSON.parse(source),
          scenarios: JSON.parse(source).scenarios.filter(
            ({ id }) => id !== "motion-adapter-reduced-motion",
          ),
        },
        null,
        2,
      ),
    (target) => {
      const result = run(["--plan", target]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Scenario component coverage is missing: motion-adapter/);
    },
  );

  withFixture(
    "docs/audits/core-1-0-accessibility-device-audit.md",
    (source) => source.replace("`calendar-grid`", "`removed-calendar-grid`"),
    (target) => {
      const result = run(["--report", target]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Audit report is missing scenario calendar-grid/);
    },
  );
});
