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

test("accepts the checked-out repository release candidate", () => {
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  assert.deepEqual(validateReleaseCandidate(head, "origin/dev", root), []);
});

test("rejects a syntactically valid commit absent from the repository", () => {
  assert.match(validateReleaseCandidate("f".repeat(40), "HEAD", root)[0], /not a commit/);
});
