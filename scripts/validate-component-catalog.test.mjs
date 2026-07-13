import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-component-catalog.mjs");
const catalog = resolve(root, "data/component-catalog.json");
const manifest = resolve(root, "packages/registry/src/manifest.json");

function run(...args) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

function tempJson(source) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-catalog-"));
  const target = resolve(directory, "fixture.json");
  cpSync(source, target);
  return { directory, target };
}

test("catalog validator accepts the repository inventory", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
});

test("catalog validator reports duplicate slugs", () => {
  const fixture = tempJson(catalog);
  try {
    const value = JSON.parse(readFileSync(fixture.target, "utf8"));
    value.components.push({ ...value.components[0], name: "tokens" });
    writeFileSync(fixture.target, `${JSON.stringify(value, null, 2)}\n`);
    const result = run("--catalog", fixture.target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Duplicate catalog component slug: tokens/);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});

test("catalog validator reports registry components without catalog entries", () => {
  const fixture = tempJson(manifest);
  try {
    const value = JSON.parse(readFileSync(fixture.target, "utf8"));
    value.items.push({ ...value.items[0], name: "unknown-component", title: "Unknown Component" });
    writeFileSync(fixture.target, `${JSON.stringify(value, null, 2)}\n`);
    const result = run("--manifest", fixture.target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Registry component has no catalog entry: unknown-component/);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});
