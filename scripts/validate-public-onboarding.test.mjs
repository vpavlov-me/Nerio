import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-public-onboarding.mjs");

function invalidFixture(option, source, mutate) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-public-onboarding-"));
  const target = resolve(directory, "fixture.txt");
  writeFileSync(target, mutate(readFileSync(resolve(root, source), "utf8")));
  try {
    const result = spawnSync(process.execPath, [validator, option, target], {
      cwd: root,
      encoding: "utf8",
    });
    assert.notEqual(result.status, 0);
    return result.stderr;
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("public onboarding validator accepts the canonical command model", () => {
  const result = spawnSync(process.execPath, [validator], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("public onboarding validator reports a missing option path", () => {
  const result = spawnSync(process.execPath, [validator, "--readme"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Missing path after --readme/);
});

test("public onboarding validator rejects README command drift", () => {
  const stderr = invalidFixture("--readme", "README.md", (source) =>
    source.replace("pnpm exec nerio doctor", "nerio doctor"),
  );
  assert.match(stderr, /README\.md/);
  assert.match(stderr, /pnpm exec nerio doctor/);
});

test("public onboarding validator rejects monorepo-only MCP configuration", () => {
  const stderr = invalidFixture("--ai", "apps/docs/app/docs/ai/page.tsx", (source) =>
    source.replace(
      'import { Badge } from "@nerio-ui/ui";',
      'const stale = "packages/mcp/src/server.js";\nimport { Badge } from "@nerio-ui/ui";',
    ),
  );
  assert.match(stderr, /monorepo-only MCP path/);
});

test("public onboarding validator rejects the obsolete package scope", () => {
  const stderr = invalidFixture("--readme", "README.md", (source) =>
    source.replace("@nerio-ui/ui", "@nerio/ui"),
  );
  assert.match(stderr, /obsolete package scope/);
});

test("public onboarding validator rejects internal CLI release smoke", () => {
  const stderr = invalidFixture("--release-smoke", "scripts/release-smoke.mjs", (source) =>
    source.replace('run(pnpm, ["exec", "nerio"', "run(process.execPath, [cli"),
  );
  assert.match(stderr, /release smoke/);
  assert.match(stderr, /exec.*nerio/);
});
