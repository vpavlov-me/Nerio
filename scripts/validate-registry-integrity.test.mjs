import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const validator = join(root, "scripts/validate-registry-integrity.mjs");

function fixture() {
  const directory = mkdtempSync(join(tmpdir(), "nerio-registry-integrity-"));
  const sourceDirectory = join(directory, "source");
  mkdirSync(sourceDirectory);
  const sourcePath = join(sourceDirectory, "button.ts");
  const source = "export const button = true;\n";
  writeFileSync(sourcePath, source);
  const manifestPath = join(directory, "manifest.json");
  const manifest = {
    schemaVersion: "1.1.0",
    name: "fixture",
    version: "1.0.0-beta.0",
    sourceRevision: "fixture",
    styleContractVersion: "tailwind-v1",
    items: [
      {
        name: "button",
        files: [
          {
            source: "./source/button.ts",
            target: "components/button.ts",
            role: "component",
            integrity: `sha256-${createHash("sha256").update(source).digest("hex")}`,
          },
        ],
      },
    ],
  };
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return { directory, manifest, manifestPath, sourcePath };
}

function validate(manifestPath, sourceRoot) {
  return spawnSync(
    process.execPath,
    [validator, "--manifest", manifestPath, "--source-root", sourceRoot],
    { encoding: "utf8" },
  );
}

test("accepts exact Registry source integrity", () => {
  const data = fixture();
  try {
    assert.equal(validate(data.manifestPath, data.directory).status, 0);
  } finally {
    rmSync(data.directory, { recursive: true, force: true });
  }
});

test("rejects source drift and missing integrity", () => {
  const data = fixture();
  try {
    writeFileSync(data.sourcePath, "export const button = false;\n");
    const drift = validate(data.manifestPath, data.directory);
    assert.notEqual(drift.status, 0);
    assert.match(drift.stderr, /integrity validation failed/);

    delete data.manifest.items[0].files[0].integrity;
    writeFileSync(data.manifestPath, `${JSON.stringify(data.manifest, null, 2)}\n`);
    const missing = validate(data.manifestPath, data.directory);
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /integrity is missing/);
  } finally {
    rmSync(data.directory, { recursive: true, force: true });
  }
});

test("rejects Registry sources outside the declared source root", () => {
  const data = fixture();
  const outside = join(dirname(data.directory), `${basename(data.directory)}-outside.ts`);
  try {
    writeFileSync(outside, readFileSync(data.sourcePath));
    data.manifest.items[0].files[0].source = `../${basename(outside)}`;
    writeFileSync(data.manifestPath, `${JSON.stringify(data.manifest, null, 2)}\n`);
    const result = validate(data.manifestPath, data.directory);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /regular file inside the source root/);
  } finally {
    rmSync(data.directory, { recursive: true, force: true });
    rmSync(outside, { force: true });
  }
});
