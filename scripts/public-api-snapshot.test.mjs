import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const validator = join(root, "scripts/public-api-snapshot.mjs");
const snapshot = join(root, "quality/public-api-snapshot.json");
const approval = join(root, "quality/public-api-snapshot-approval.json");

function run(...args) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("accepts the reviewed Core 1.0 public API snapshot", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Public API snapshot verified/);
});

test("rejects unclassified public API drift", () => {
  const temporary = mkdtempSync(join(tmpdir(), "nerio-api-test-"));
  const changedSnapshot = join(temporary, "snapshot.json");
  const changed = JSON.parse(readFileSync(snapshot, "utf8"));
  changed.tokens = changed.tokens.slice(1);
  writeFileSync(changedSnapshot, `${JSON.stringify(changed, null, 2)}\n`);

  const result = run("--snapshot", changedSnapshot, "--approval", approval);
  rmSync(temporary, { recursive: true, force: true });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Public API snapshot changed in: tokens/);
});

test("requires SemVer classification and approval metadata for updates", () => {
  const temporary = mkdtempSync(join(tmpdir(), "nerio-api-write-test-"));
  const result = run(
    "--write",
    "--snapshot",
    join(temporary, "snapshot.json"),
    "--approval",
    join(temporary, "approval.json"),
  );
  rmSync(temporary, { recursive: true, force: true });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /require --classification/);
});

test("rejects restored alpha compatibility debt", () => {
  const buttonPath = join(root, "packages/ui/src/components/button.tsx");
  const original = readFileSync(buttonPath, "utf8");
  try {
    writeFileSync(buttonPath, `${original}\n/** @deprecated */\ntype AlphaAlias = string;\n`);
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /alpha compatibility debt/);
  } finally {
    writeFileSync(buttonPath, original);
  }
});
