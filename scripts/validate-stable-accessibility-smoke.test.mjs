import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-stable-accessibility-smoke.mjs");

function run(args = []) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

const coordinatedPackages = ["tokens", "adapters", "registry", "ui", "cli", "mcp"];

function withRecord(record, callback, release = {}) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-stable-smoke-"));
  const target = resolve(directory, "record.json");
  const releaseMetadata = resolve(directory, "release-metadata.json");
  const packagesRoot = resolve(directory, "packages");
  const coreVersion = release.coreVersion ?? "1.0.0";
  writeFileSync(target, JSON.stringify(record, null, 2));
  writeFileSync(
    releaseMetadata,
    JSON.stringify(
      {
        channel: release.channel ?? "stable",
        coreVersion,
        registryVersion: release.registryVersion ?? coreVersion,
        publicInstallationVersion: release.publicInstallationVersion ?? coreVersion,
      },
      null,
      2,
    ),
  );
  for (const packageName of coordinatedPackages) {
    const packageDirectory = resolve(packagesRoot, packageName);
    mkdirSync(packageDirectory, { recursive: true });
    writeFileSync(
      resolve(packageDirectory, "package.json"),
      JSON.stringify({ version: release.packageVersion ?? coreVersion }, null, 2),
    );
  }
  try {
    callback(target, releaseMetadata, packagesRoot);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function strictArgs(record, releaseMetadata, packagesRoot) {
  return [
    "--expect-pass",
    "--record",
    record,
    "--release-metadata",
    releaseMetadata,
    "--packages-root",
    packagesRoot,
  ];
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
  withRecord(completedRecord(), (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /internally approved/);
  });
});

test("strict validation rejects a stale ancestor after non-evidence changes", () => {
  const record = completedRecord();
  record.candidate.commit = execFileSync("git", ["rev-parse", "HEAD^"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /stale after non-evidence changes/);
  });
});

test("strict validation rejects release metadata and package versions outside the candidate", () => {
  withRecord(
    completedRecord(),
    (target, releaseMetadata, packagesRoot) => {
      const result = run(strictArgs(target, releaseMetadata, packagesRoot));
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /requires release metadata channel "stable"/);
      assert.match(result.stderr, /must match release metadata coreVersion 1\.0\.0-beta\.1/);
      assert.match(result.stderr, /package\.json version must match/);
    },
    { channel: "beta", coreVersion: "1.0.0-beta.1" },
  );
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
  withRecord(record, (target, releaseMetadata, packagesRoot) => {
    const result = run(strictArgs(target, releaseMetadata, packagesRoot));
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /mobile-touch/);
    assert.match(result.stderr, /unresolved accepted blocker/);
  });
});
