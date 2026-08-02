import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-beta-feedback.mjs");

function run(args = []) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function withRecord(record, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-beta-feedback-"));
  const target = resolve(directory, "record.json");
  writeFileSync(target, JSON.stringify(record, null, 2));
  try {
    callback(target);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function completedRecord() {
  const base = {
    schemaVersion: 1,
    status: "complete",
    trackingIssue: 146,
    candidate: {
      version: "1.0.0-beta.0",
      commit: "5ffbd44e208039c9007ae3397a74d279d4a22eff",
      windowOpenedAt: "2026-08-01T16:42:44Z",
      earliestCloseAt: "2026-08-15T16:42:44Z",
      closedAt: "2026-08-16T10:00:00Z",
    },
    consumers: [
      {
        id: "External-01",
        role: "designer",
        context: "Independent design-system evaluation",
        mode: "package",
        completedAt: "2026-08-15T18:00:00Z",
        workflows: ["Theme, density, RTL, and accessibility review"],
        calendarAndDatePicker: true,
        registryDiffAndUpdate: false,
        evidence: ["https://github.com/vpavlov-me/Nerio/issues/401"],
      },
      {
        id: "External-02",
        role: "engineer",
        context: "Representative independent application",
        mode: "package",
        completedAt: "2026-08-15T19:00:00Z",
        workflows: ["Installed and composed package components"],
        calendarAndDatePicker: false,
        registryDiffAndUpdate: false,
        evidence: ["https://github.com/vpavlov-me/Nerio/issues/402"],
      },
      {
        id: "External-03",
        role: "source-consumer",
        context: "Independent Registry source lifecycle",
        mode: "source",
        completedAt: "2026-08-15T20:00:00Z",
        workflows: ["Installed, modified, diffed, and updated Registry source"],
        calendarAndDatePicker: false,
        registryDiffAndUpdate: true,
        evidence: ["https://github.com/vpavlov-me/Nerio/issues/403"],
      },
    ],
    findings: [],
    decision: {
      recommendation: "proceed-to-stable-docs",
      recordedAt: "2026-08-16T10:30:00Z",
      summary: "All exit criteria passed in the test fixture.",
    },
  };
  return base;
}

test("pending repository record is valid without claiming completion", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /evidence remains pending/);
});

test("strict validation rejects the pending repository record", () => {
  const result = run(["--expect-complete"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /requires status "complete"/);
});

test("strict validation accepts a complete evidence fixture", () => {
  withRecord(completedRecord(), (target) => {
    const result = run(["--expect-complete", "--record", target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /3 external consumers validated/);
  });
});

test("strict validation rejects a premature or incomplete cohort", () => {
  const record = completedRecord();
  record.candidate.closedAt = "2026-08-10T10:00:00Z";
  record.consumers.pop();
  withRecord(record, (target) => {
    const result = run(["--expect-complete", "--record", target]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /cannot close before/);
    assert.match(result.stderr, /at least 3 consumers/);
    assert.match(result.stderr, /source-consumer role/);
  });
});

test("stable proceed decision rejects an unresolved accepted blocker", () => {
  const record = completedRecord();
  record.findings.push({
    issue: "https://github.com/vpavlov-me/Nerio/issues/404",
    severity: "P2",
    disposition: "accepted",
    releaseImpact: "stable",
    summary: "Stable-blocking source upgrade defect",
  });
  withRecord(record, (target) => {
    const result = run(["--expect-complete", "--record", target]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /accepted stable blocker/);
  });
});
