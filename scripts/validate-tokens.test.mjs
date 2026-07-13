import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-tokens.mjs");
const source = resolve(root, "packages/tokens/src/styles.css");

test("token validator reports a missing required token", () => {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-tokens-"));
  const fixture = resolve(directory, "styles.css");
  try {
    writeFileSync(fixture, readFileSync(source, "utf8").replace("--n-contrast-focus-ring: 3;", ""));
    const result = spawnSync(process.execPath, [validator, "--token-file", fixture], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Required token is missing: --n-contrast-focus-ring/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});
