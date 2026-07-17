import assert from "node:assert/strict";
import test from "node:test";
import { checkBranchPolicy } from "./check-branch-policy.mjs";

test("allows only dev release pull requests into main", () => {
  assert.equal(checkBranchPolicy("main", "dev").allowed, true);
  assert.deepEqual(checkBranchPolicy("main", "fix/security"), {
    allowed: false,
    message: "Pull requests to main are allowed only from the dev integration branch.",
  });
});

test("allows conventional development branches into dev", () => {
  for (const prefix of ["feat", "feature", "fix", "refactor", "docs", "test", "chore"]) {
    assert.equal(checkBranchPolicy("dev", `${prefix}/example`).allowed, true, prefix);
  }
});

test("rejects main and unclassified branches into dev", () => {
  assert.equal(checkBranchPolicy("dev", "main").allowed, false);
  assert.equal(checkBranchPolicy("dev", "dev").allowed, false);
  assert.equal(checkBranchPolicy("dev", "experiment").allowed, false);
});

test("rejects unsupported base branches", () => {
  assert.equal(checkBranchPolicy("release", "dev").allowed, false);
});
