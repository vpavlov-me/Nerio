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

function withRecordSource(source, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-beta-feedback-"));
  const target = resolve(directory, "record.json");
  writeFileSync(target, source);
  try {
    callback(target);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function withRecord(record, callback) {
  withRecordSource(JSON.stringify(record, null, 2), callback);
}

function completedRecord() {
  const base = {
    schemaVersion: 1,
    status: "complete",
    trackingIssue: 146,
    candidate: {
      version: "1.0.0-beta.0",
      commit: "5ffbd44e208039c9007ae3397a74d279d4a22eff",
      windowOpenedAt: "2026-07-01T16:42:44Z",
      earliestCloseAt: "2026-07-15T16:42:44Z",
      closedAt: "2026-07-16T10:00:00Z",
    },
    consumers: [
      {
        id: "External-01",
        role: "designer",
        context: "Independent design-system evaluation",
        mode: "package",
        completedAt: "2026-07-15T18:00:00Z",
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
        completedAt: "2026-07-15T19:00:00Z",
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
        completedAt: "2026-07-15T20:00:00Z",
        workflows: ["Installed, modified, diffed, and updated Registry source"],
        calendarAndDatePicker: false,
        registryDiffAndUpdate: true,
        evidence: ["https://github.com/vpavlov-me/Nerio/issues/403"],
      },
    ],
    findings: [],
    decision: {
      recommendation: "proceed-to-stable-docs",
      recordedAt: "2026-07-16T10:30:00Z",
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

test("invalid beta records fail with scoped diagnostics instead of stack traces", () => {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-beta-feedback-missing-"));
  const missing = resolve(directory, "missing.json");
  try {
    const missingResult = run(["--record", missing]);
    assert.notEqual(missingResult.status, 0);
    assert.match(missingResult.stderr, /Beta feedback record must be readable JSON: ENOENT/);
    assert.doesNotMatch(missingResult.stderr, /TypeError|\n\s+at |Node\.js v/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }

  for (const source of ["null", "not json"]) {
    withRecordSource(source, (target) => {
      const result = run(["--record", target]);
      assert.notEqual(result.status, 0);
      assert.match(
        result.stderr,
        source === "null"
          ? /Beta feedback record must be a JSON object/
          : /Beta feedback record must be readable JSON/,
      );
      assert.doesNotMatch(result.stderr, /TypeError|\n\s+at |Node\.js v/);
    });
  }
});

test("nested non-object beta rows fail with scoped diagnostics instead of stack traces", () => {
  for (const { mutate, diagnostic } of [
    {
      mutate: (record) => {
        record.consumers[0] = null;
      },
      diagnostic: /consumers\[0\] must be a JSON object/,
    },
    {
      mutate: (record) => {
        record.findings.push([]);
      },
      diagnostic: /findings\[0\] must be a JSON object/,
    },
  ]) {
    const record = completedRecord();
    mutate(record);
    withRecord(record, (target) => {
      const result = run(["--expect-complete", "--record", target]);
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, diagnostic);
      assert.doesNotMatch(result.stderr, /TypeError|\n\s+at |Node\.js v/);
    });
  }
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
  record.candidate.closedAt = "2026-07-10T10:00:00Z";
  record.consumers.pop();
  withRecord(record, (target) => {
    const result = run(["--expect-complete", "--record", target]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /cannot close before/);
    assert.match(result.stderr, /at least 3 consumers/);
    assert.match(result.stderr, /source-consumer role/);
  });
});

test("completed evidence rejects timestamps that have not occurred", () => {
  const record = completedRecord();
  record.candidate.closedAt = "2099-07-16T10:00:00Z";
  record.consumers[0].completedAt = "2099-07-15T18:00:00Z";
  record.decision.recordedAt = "2099-07-16T10:30:00Z";
  withRecord(record, (target) => {
    const result = run(["--expect-complete", "--record", target]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /candidate\.closedAt cannot be in the future/);
    assert.match(result.stderr, /consumers\[0\]\.completedAt cannot be in the future/);
    assert.match(result.stderr, /decision\.recordedAt cannot be in the future/);
  });
});

test("stable readiness rejects a completed blocking recommendation", () => {
  const record = completedRecord();
  record.decision.recommendation = "blocked-before-stable";
  withRecord(record, (target) => {
    const result = run(["--expect-complete", "--expect-proceed", "--record", target]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /requires decision\.recommendation "proceed-to-stable-docs"/);
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
