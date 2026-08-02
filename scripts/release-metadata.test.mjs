import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const script = resolve(root, "scripts/release-metadata.mjs");

test("validates the coordinated release metadata source", () => {
  const result = spawnSync(process.execPath, [script, "validate"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1\.0\.0-beta\.0 \(beta\)/);
});

test("prints a deterministic dry-run without modifying files", () => {
  const result = spawnSync(process.execPath, [script, "prepare", "1.0.0-beta.1"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.dryRun, true);
  assert.ok(output.changes.some(({ path }) => path === "quality/release-metadata.json"));
  assert.ok(output.changes.some(({ path }) => path === "packages/ui/package.json"));
  assert.ok(
    output.changes.some(({ path }) => path === "packages/registry/src/public-commands.json"),
  );
  assert.ok(
    output.changes.some(({ path }) => path === "apps/docs/app/docs/foundations/motion/page.tsx"),
  );
});
