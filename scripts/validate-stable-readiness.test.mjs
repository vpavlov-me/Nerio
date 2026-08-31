import assert from "node:assert/strict";
import test from "node:test";
import { commandsForChannel } from "./validate-stable-readiness.mjs";

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

test("prerelease channels preserve truthful pending validation", () => {
  assert.deepEqual(
    commandsForChannel("beta").map(([command]) => command),
    ["validate:stable-accessibility-smoke", "validate:manual-audit-plan", "validate:beta-feedback"],
  );
});
