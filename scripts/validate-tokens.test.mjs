import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-tokens.mjs");
const tokenSource = resolve(root, "packages/tokens/src/styles.css");
const manifestSource = resolve(root, "packages/registry/src/manifest.json");

function run(...args) {
  return spawnSync(process.execPath, [validator, ...args], { cwd: root, encoding: "utf8" });
}

function temporaryFile(name, contents) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-tokens-"));
  const target = resolve(directory, name);
  writeFileSync(target, contents);
  return { directory, target };
}

function withoutDeclaration(source, token, selector) {
  if (!selector) {
    return source.replace(new RegExp(`^\\s*${token.replaceAll("-", "\\-")}:.*\\n`, "m"), "");
  }
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return source.replace(
    new RegExp(`(${escaped}\\s*\\{[\\s\\S]*?)^\\s*${token.replaceAll("-", "\\-")}:.*\\n`, "m"),
    "$1",
  );
}

function withTokenFixture(update, assertion) {
  const fixture = temporaryFile("styles.css", update(readFileSync(tokenSource, "utf8")));
  try {
    const result = run("--token-file", fixture.target);
    assert.notEqual(result.status, 0);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
    assertion(result.stderr);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
}

test("token validator accepts the repository contract", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
});

test("token validator reports a missing CLI option value", () => {
  for (const args of [["--token-file"], ["--token-file", "--manifest", manifestSource]]) {
    const result = run(...args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Usage error: --token-file requires a path value/);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
  }
});

test("token validator reports missing base semantic and contrast tokens", () => {
  withTokenFixture(
    (source) =>
      withoutDeclaration(
        withoutDeclaration(source, "--n-color-surface-canvas"),
        "--n-contrast-text-secondary",
      ),
    (stderr) => {
      assert.match(
        stderr,
        /Required token is missing from :root base semantic contract: --n-color-surface-canvas/,
      );
      assert.match(
        stderr,
        /Required token is missing from :root contrast contract: --n-contrast-text-secondary/,
      );
    },
  );
});

test("token validator requires the complete neutral alpha foundation", () => {
  withTokenFixture(
    (source) => withoutDeclaration(source, "--n-gray-a-8"),
    (stderr) =>
      assert.match(
        stderr,
        /Required token is missing from :root base semantic contract: --n-gray-a-8/,
      ),
  );
});

test("token validator requires the approved visual foundation aliases", () => {
  withTokenFixture(
    (source) => withoutDeclaration(source, "--n-overlay-surface-filter"),
    (stderr) =>
      assert.match(
        stderr,
        /Required token is missing from :root base semantic contract: --n-overlay-surface-filter/,
      ),
  );
});

test("token validator protects staged overlay and Checkbox compatibility aliases", () => {
  withTokenFixture(
    (source) =>
      source
        .replace("--n-checkbox-radius: var(--n-radius-xs);", "--n-checkbox-radius: 0.25rem;")
        .replace(
          "--n-overlay-background: var(--n-color-surface-raised);",
          "--n-overlay-background: var(--n-color-surface-overlay);",
        )
        .replace(
          "--n-overlay-foreground: var(--n-color-text-secondary);",
          "--n-overlay-foreground: var(--n-color-text-primary);",
        ),
    (stderr) => {
      assert.match(
        stderr,
        /Compatibility alias --n-checkbox-radius must resolve to var\(--n-radius-xs\) before #139/,
      );
      assert.match(
        stderr,
        /Compatibility alias --n-overlay-background must resolve to var\(--n-color-surface-raised\) before #139/,
      );
      assert.match(
        stderr,
        /Compatibility alias --n-overlay-foreground must resolve to var\(--n-color-text-secondary\) before #139/,
      );
    },
  );
});

test("token validator calculates load-bearing semantic contrast", () => {
  withTokenFixture(
    (source) =>
      source.replaceAll(
        "--n-color-text-primary: var(--n-gray-950);",
        "--n-color-text-primary: #ffffff;",
      ),
    (stderr) =>
      assert.match(
        stderr,
        /purple\/light contrast is 1\.00:1 for --n-color-text-primary on --n-color-surface-default/,
      ),
  );
});

test("token validator reports unresolved aliases", () => {
  withTokenFixture(
    (source) => `${source}\n:root { --n-test-unresolved: var(--n-does-not-exist); }\n`,
    (stderr) => assert.match(stderr, /Unresolved token reference: --n-does-not-exist/),
  );
});

test("token validator reports alias cycles", () => {
  withTokenFixture(
    (source) =>
      `${source}\n:root { --n-test-cycle-a: var(--n-test-cycle-b); --n-test-cycle-b: var(--n-test-cycle-a); }\n`,
    (stderr) =>
      assert.match(
        stderr,
        /Token alias cycle: --n-test-cycle-a -> --n-test-cycle-b -> --n-test-cycle-a/,
      ),
  );
});

test("token validator rejects registry tokens defined only in a scoped theme", () => {
  withTokenFixture(
    (source) =>
      `${withoutDeclaration(source, "--n-kbd-radius")}\n:root[data-theme="custom-product"] { --n-kbd-radius: var(--n-radius-sm); }\n`,
    (stderr) => {
      assert.match(stderr, /Registry item kbd has invalid requiredTokens/);
      assert.match(
        stderr,
        /:root: --n-kbd-radius is defined only in :root\[data-theme="custom-product"\]/,
      );
    },
  );
});

test("token validator requires the complete accent contract for every preset theme", () => {
  withTokenFixture(
    (source) => withoutDeclaration(source, "--n-chart-primary", ':root[data-theme="blue"]'),
    (stderr) =>
      assert.match(stderr, /Required token is missing from preset theme blue: --n-chart-primary/),
  );
});

test("token validator groups invalid registry token references by item and scope", () => {
  const manifest = JSON.parse(readFileSync(manifestSource, "utf8"));
  manifest.items.find((item) => item.name === "kbd").requiredTokens.push("--n-missing-kbd-token");
  const fixture = temporaryFile("manifest.json", `${JSON.stringify(manifest, null, 2)}\n`);
  try {
    const result = run("--manifest", fixture.target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Registry item kbd has invalid requiredTokens/);
    assert.match(result.stderr, /global: --n-missing-kbd-token is not defined/);
  } finally {
    rmSync(fixture.directory, { recursive: true, force: true });
  }
});
