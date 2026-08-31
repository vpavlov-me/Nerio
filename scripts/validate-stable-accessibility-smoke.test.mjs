import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-stable-accessibility-smoke.mjs");

function run(args = []) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

function withRecord(record, callback) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-stable-smoke-"));
  const target = resolve(directory, "record.json");
  writeFileSync(target, JSON.stringify(record, null, 2));
  try {
    callback(target);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function completedRecord() {
  const commit = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  const evidence = ["https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-1"];
  return {
    schemaVersion: 1,
    status: "complete",
    trackingIssue: 143,
    candidate: {
      version: "1.0.0",
      commit,
      deployment: "https://nerio.example.com",
      recordedAt: "2026-08-30T10:00:00Z",
    },
    environments: [
      "macos-safari-voiceover",
      "macos-chromium-keyboard",
      "zoom-reflow-contrast",
      "mobile-touch",
    ].map((id) => ({
      id,
      result: "Pass",
      operatingSystem: "Test OS",
      browser: "Test browser",
      assistiveTechnology: "VoiceOver, keyboard, or not applicable",
      device: "Test device",
      viewport: "1280x800",
      zoom: "100% or required zoom",
      evidence,
      notes: "Representative stable smoke passed.",
    })),
    scenarios: [
      "docs-navigation",
      "forms-and-native-controls",
      "overlays-and-focus",
      "calendar-and-date-picker",
      "feedback-and-status",
      "responsive-touch-and-reflow",
    ].map((id) => ({ id, result: "Pass", evidence, notes: "Scenario passed." })),
    findings: [],
    decision: {
      recommendation: "release-ready",
      recordedAt: "2026-08-30T10:05:00Z",
      summary: "No release-blocking accessibility defect remains in the scoped smoke.",
    },
  };
}

test("pending repository smoke record is valid without claiming completion", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /evidence remains pending/);
});

test("strict validation rejects pending evidence", () => {
  const result = run(["--expect-pass"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /requires status "complete"/);
});

test("strict validation accepts a complete scoped smoke", () => {
  withRecord(completedRecord(), (target) => {
    const result = run(["--expect-pass", "--record", target]);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation rejects missing coverage and accepted blockers", () => {
  const record = completedRecord();
  record.environments.pop();
  record.findings.push({
    issue: "https://github.com/vpavlov-me/Nerio/issues/999",
    severity: "P1",
    disposition: "accepted",
    releaseImpact: "blocking",
    summary: "Representative blocker",
  });
  withRecord(record, (target) => {
    const result = run(["--expect-pass", "--record", target]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /mobile-touch/);
    assert.match(result.stderr, /unresolved accepted blocker/);
  });
});
