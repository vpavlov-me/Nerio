import assert from "node:assert/strict";
import test from "node:test";
import { commandsForChannel } from "./validate-stable-readiness.mjs";

test("stable channel automatically selects both strict evidence validators", () => {
  assert.deepEqual(
    commandsForChannel("stable").map(([command]) => command),
    ["validate:manual-audit-complete", "validate:beta-feedback-complete"],
  );
  assert.deepEqual(
    commandsForChannel("stable").map(([, , args]) => args),
    [["--expect-pass"], ["--expect-proceed"]],
  );
});

test("prerelease channels preserve truthful pending validation", () => {
  assert.deepEqual(
    commandsForChannel("beta").map(([command]) => command),
    ["validate:manual-audit-plan", "validate:beta-feedback"],
  );
});
