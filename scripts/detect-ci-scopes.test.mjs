import assert from "node:assert/strict";
import test from "node:test";
import { detectCiScopes } from "./detect-ci-scopes.mjs";

function scopes(...paths) {
  return detectCiScopes(paths).scopes;
}

test("maps Core implementation changes to browser and visual scopes", () => {
  const result = scopes("packages/ui/src/components/dialog.tsx");
  assert.equal(result.browser, true);
  assert.equal(result.visual, true);
  assert.equal(result.packages, false);
  assert.equal(result.docs_only, false);
});

test("treats shared documentation CSS as browser and visual work", () => {
  const result = scopes("apps/docs/app/globals.css");
  assert.equal(result.browser, true);
  assert.equal(result.visual, true);
});

test("keeps ordinary Markdown changes out of runtime scopes", () => {
  const result = scopes("docs/quality-gates.md", "RELEASE.md");
  assert.equal(result.docs_only, true);
  assert.equal(result.browser, false);
  assert.equal(result.visual, false);
  assert.equal(result.packages, false);
});

test("isolates the manual audit contract", () => {
  const result = scopes(
    "quality/manual-audit-plan.json",
    "scripts/validate-manual-audit-plan.test.mjs",
  );
  assert.equal(result.manual_audit, true);
  assert.equal(result.browser, false);
  assert.equal(result.visual, false);
  assert.equal(result.docs_only, false);
});

test("routes Registry runtime changes to browser, CLI, and MCP checks", () => {
  const result = scopes("packages/registry/src/manifest.json");
  assert.equal(result.browser, true);
  assert.equal(result.cli, true);
  assert.equal(result.mcp, true);
});

test("routes adapter source without treating its manifest as visual", () => {
  const source = scopes("packages/adapters/src/icons.ts");
  assert.equal(source.adapters, true);
  assert.equal(source.browser, true);
  assert.equal(source.visual, true);

  const manifest = scopes("packages/adapters/package.json");
  assert.equal(manifest.adapters, true);
  assert.equal(manifest.packages, true);
  assert.equal(manifest.browser, false);
  assert.equal(manifest.visual, false);
});

test("isolates workflow metadata and the focused branch-policy contract", () => {
  const workflow = scopes(".github/workflows/pr-gate.yml");
  assert.equal(workflow.workflow, true);
  assert.equal(workflow.branch_policy, false);
  assert.equal(workflow.browser, false);

  const branchPolicy = scopes("scripts/check-branch-policy.test.mjs");
  assert.equal(branchPolicy.branch_policy, true);
});

test("routes public entrypoints and package policy to package checks", () => {
  for (const path of [
    "package.json",
    "packages/ui/src/client.ts",
    "quality/package-budgets.json",
    "scripts/pack-check.mjs",
  ]) {
    assert.equal(scopes(path).packages, true, path);
  }
});

test("normalizes Windows separators and removes duplicate paths", () => {
  const result = detectCiScopes([
    "packages\\ui\\src\\components\\button.tsx",
    "packages/ui/src/components/button.tsx",
  ]);
  assert.deepEqual(result.changedFiles, ["packages/ui/src/components/button.tsx"]);
  assert.equal(result.scopes.browser, true);
});
