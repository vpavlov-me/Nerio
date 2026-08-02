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
  assert.deepEqual(
    dcoFailures([
      {
        sha: "d".repeat(40),
        authorName: "github-actions[bot]",
        authorEmail: "41898282+github-actions[bot]@users.noreply.github.com",
        message: "chore: automated update",
      },
      {
        sha: "e".repeat(40),
        authorName: "renovate[bot]",
        authorEmail: "29139614+renovate[bot]@users.noreply.github.com",
        message: "chore: update dependency",
      },
    ]),
    [],
  );
});

test("does not exempt human identities containing bot account words", () => {
  for (const [authorName, authorEmail] of [
    ["Renovate Labs", "developer@example.com"],
    ["Ada Lovelace", "ada+dependabot@example.com"],
    ["dependabot[bot]", "developer@example.com"],
  ]) {
    assert.match(
      dcoFailures([
        {
          sha: "f".repeat(40),
          authorName,
          authorEmail,
          message: "feat: unsigned human change",
        },
      ])[0],
      /missing matching Signed-off-by/,
    );
  }
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
