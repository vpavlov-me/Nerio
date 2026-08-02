import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { candidateSyntaxFailure, validateReleaseCandidate } from "./validate-release-candidate.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("requires an exact lowercase candidate SHA", () => {
  assert.match(candidateSyntaxFailure("abc"), /40-character/);
  assert.match(candidateSyntaxFailure("A".repeat(40)), /40-character/);
  assert.equal(candidateSyntaxFailure("a".repeat(40)), undefined);
});

test("accepts an exact commit owned by the repository release branch", () => {
  const candidate = execFileSync("git", ["rev-parse", "origin/dev"], {
    cwd: root,
    encoding: "utf8",
  }).trim();
  assert.deepEqual(validateReleaseCandidate(candidate, "origin/dev", root), []);
});

test("rejects a syntactically valid commit absent from the repository", () => {
  assert.match(validateReleaseCandidate("f".repeat(40), "HEAD", root)[0], /not a commit/);
});
