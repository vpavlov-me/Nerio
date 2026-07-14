import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-release-docs.mjs");

function invalidFixture(option, source, command) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-release-docs-"));
  const target = resolve(directory, "fixture.txt");
  writeFileSync(target, readFileSync(resolve(root, source), "utf8").replace(command, ""));
  try {
    const result = spawnSync(process.execPath, [validator, option, target], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, new RegExp(command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("release documentation validator accepts the complete gate", () => {
  const result = spawnSync(process.execPath, [validator], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("release documentation validator fails when focused tests disappear from RELEASE.md", () => {
  invalidFixture("--release", "RELEASE.md", "pnpm test:catalog");
});

test("release documentation validator fails when focused tests disappear from CI", () => {
  invalidFixture("--ci", ".github/workflows/ci.yml", "pnpm test:tokens");
});
