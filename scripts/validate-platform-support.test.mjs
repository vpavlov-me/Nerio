import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-platform-support.mjs");

function invalidFixture(option, source, fragment, expected) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-platform-support-"));
  const target = resolve(directory, "fixture.txt");
  writeFileSync(target, readFileSync(resolve(root, source), "utf8").replaceAll(fragment, ""));
  try {
    const result = spawnSync(process.execPath, [validator, option, target], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expected);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("platform support validator accepts the tiered browser contract", () => {
  const result = spawnSync(process.execPath, [validator], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("platform support validator requires Chromium PR smoke", () => {
  invalidFixture(
    "--pr-gate",
    ".github/workflows/pr-gate.yml",
    "pnpm test:browser:pr",
    /focused Chromium PR smoke/,
  );
});

test("platform support validator requires every release engine", () => {
  invalidFixture(
    "--release-gate",
    ".github/workflows/release-gate.yml",
    "engine: webkit",
    /release gate must run the webkit browser contract/,
  );
});

test("platform support validator protects every Playwright project", () => {
  invalidFixture(
    "--playwright",
    "playwright.config.mjs",
    "-firefox",
    /Playwright config must include firefox/,
  );
});
