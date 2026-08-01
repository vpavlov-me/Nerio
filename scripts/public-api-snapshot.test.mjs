import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { assertNoAlphaCompatibilityDebt, normalizeCliOutput } from "./public-api-snapshot.mjs";

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
  const reviewed = readFileSync(snapshot, "utf8");
  assert.doesNotMatch(reviewed, /node_modules\/\.pnpm/);
  const parsed = JSON.parse(reviewed);
  const buttonProps = parsed.entrypoints["@nerio-ui/ui/client"].find(
    (entry) => entry.name === "ButtonProps",
  );
  assert.match(buttonProps.definition.join("\n"), /type ButtonBaseProps/);
  assert.match(buttonProps.definition.join("\n"), /type TextButtonProps/);
  assert.match(buttonProps.definition.join("\n"), /type IconOnlyButtonProps/);
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
  const temporary = mkdtempSync(join(tmpdir(), "nerio-alpha-debt-test-"));
  const componentDirectory = join(temporary, "packages/ui/src/components");
  try {
    mkdirSync(componentDirectory, { recursive: true });
    writeFileSync(
      join(componentDirectory, "button.tsx"),
      "export type ButtonProps = { loadingLabel?: string };",
    );
    assert.throws(() => assertNoAlphaCompatibilityDebt(temporary), /alpha compatibility debt/);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("allows future deprecations while rejecting only removed alpha aliases", () => {
  const temporary = mkdtempSync(join(tmpdir(), "nerio-deprecation-test-"));
  const componentDirectory = join(temporary, "packages/ui/src/components");
  try {
    mkdirSync(componentDirectory, { recursive: true });
    writeFileSync(
      join(componentDirectory, "button.tsx"),
      "/** @deprecated Use FutureButton instead. */ export type LegacyButton = string;",
    );
    assert.doesNotThrow(() => assertNoAlphaCompatibilityDebt(temporary));
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("normalizes stable and prerelease CLI package versions", () => {
  assert.equal(
    normalizeCliOutput("pnpm add @nerio-ui/registry@1.0.0 @nerio-ui/cli@1.1.0-beta.2+build.4"),
    "pnpm add @nerio-ui/registry@<version> @nerio-ui/cli@<version>",
  );
});
