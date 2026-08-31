import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { commandsForChannel, readDeferredStatus } from "./validate-stable-readiness.mjs";

test("stable channel selects the scoped smoke and keeps deferred records truthful", () => {
  assert.deepEqual(
    commandsForChannel("stable").map(([command]) => command),
    ["validate:stable-accessibility-smoke", "validate:manual-audit-plan", "validate:beta-feedback"],
  );
  assert.deepEqual(
    commandsForChannel("stable").map(([, , args]) => args),
    [["--expect-pass"], undefined, undefined],
  );
});

test("stable channel rejects blocking outcomes from deferred programs that already completed", () => {
  assert.deepEqual(
    commandsForChannel("stable", {
      manualAudit: "complete",
      betaFeedback: "complete",
    }).map(([, , args]) => args),
    [["--expect-pass"], ["--expect-pass"], ["--expect-proceed"]],
  );
});

test("invalid deferred records fall through to their canonical validators", () => {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-stable-readiness-"));
  const completeRecord = resolve(directory, "complete.json");
  const invalidRecord = resolve(directory, "invalid.json");
  writeFileSync(completeRecord, JSON.stringify({ status: "complete" }));
  writeFileSync(invalidRecord, "not json");
  try {
    assert.equal(readDeferredStatus(completeRecord), "complete");
    assert.equal(readDeferredStatus(invalidRecord), undefined);
    assert.equal(readDeferredStatus(resolve(directory, "missing.json")), undefined);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("prerelease channels preserve truthful pending validation", () => {
  assert.deepEqual(
    commandsForChannel("beta").map(([command]) => command),
    ["validate:stable-accessibility-smoke", "validate:manual-audit-plan", "validate:beta-feedback"],
  );
});
