import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const script = resolve(root, "scripts/print-manual-audit-checklist.mjs");

function run(args = []) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

test("lists the canonical manual audit environments", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /macos-safari-voiceover/);
  assert.match(result.stdout, /android-chrome-talkback/);
});

test("prints an environment-specific evidence checklist", () => {
  const result = run(["--environment", "reduced-motion"]);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Operating-system reduced-motion preference/);
  assert.match(result.stdout, /motion-adapter-reduced-motion/);
  assert.doesNotMatch(result.stdout, /native-temporal-inputs/);
  assert.equal((result.stdout.match(/^- Scenario ID:/gm) ?? []).length, 6);
});

test("rejects an unknown environment", () => {
  const result = run(["--environment", "unknown-environment"]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Unknown manual audit environment/);
});
