import assert from "node:assert/strict";
import test from "node:test";
import { dcoFailures, parseCommitLog } from "./check-dco.mjs";

test("accepts a matching human sign-off", () => {
  assert.deepEqual(
    dcoFailures([
      {
        sha: "a".repeat(40),
        authorName: "Ada Lovelace",
        authorEmail: "ada@example.com",
        message: "feat: example\n\nSigned-off-by: Ada Lovelace <ada@example.com>",
      },
    ]),
    [],
  );
});

test("rejects a missing or mismatched human sign-off", () => {
  const commits = [
    {
      sha: "b".repeat(40),
      authorName: "Grace Hopper",
      authorEmail: "grace@example.com",
      message: "fix: example\n\nSigned-off-by: Another Person <other@example.com>",
    },
  ];
  assert.match(dcoFailures(commits)[0], /missing matching Signed-off-by/);
});

test("preserves bot and Dependabot behavior", () => {
  assert.deepEqual(
    dcoFailures([
      {
        sha: "c".repeat(40),
        authorName: "dependabot[bot]",
        authorEmail: "49699333+dependabot[bot]@users.noreply.github.com",
        message: "chore: update dependency",
      },
    ]),
    [],
  );
});

test("parses NUL-separated git log records", () => {
  assert.deepEqual(parseCommitLog(`abc\x1fAda\x1fada@example.com\x1fsubject\n\nbody\0`), [
    {
      sha: "abc",
      authorName: "Ada",
      authorEmail: "ada@example.com",
      message: "subject\n\nbody",
    },
  ]);
});
