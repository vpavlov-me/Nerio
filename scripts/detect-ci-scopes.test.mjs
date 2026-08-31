import assert from "node:assert/strict";
import test from "node:test";
import { changedFilesBetween, detectCiScopes, parseNameStatusOutput } from "./detect-ci-scopes.mjs";

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

test("routes shared class helpers and visual fixture assets to visual regression", () => {
  for (const path of [
    "packages/ui/src/lib/cn.ts",
    "packages/ui/src/lib/tailwind-cn.ts",
    "apps/docs/lib/avatar-preview-assets.ts",
    "apps/docs/public/avatars/maya-chen.png",
  ]) {
    assert.equal(scopes(path).visual, true, path);
  }
});

test("keeps ordinary Markdown changes out of runtime scopes", () => {
  const result = scopes("docs/quality-gates.md", "RELEASE.md");
  assert.equal(result.docs_only, true);
  assert.equal(result.docs, true);
  assert.equal(result.ui, false);
  assert.equal(result.browser, false);
  assert.equal(result.visual, false);
  assert.equal(result.packages, false);
});

test("treats the rendered changelog as a docs build and browser surface", () => {
  const result = scopes("CHANGELOG.md");
  assert.equal(result.docs, true);
  assert.equal(result.ui, true);
  assert.equal(result.browser, true);
  assert.equal(result.visual, true);
  assert.equal(result.docs_only, false);
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

test("routes beta feedback and stable readiness to the manual contract", () => {
  for (const path of [
    "quality/stable-accessibility-smoke.json",
    "docs/audits/core-1-0-stable-accessibility-smoke.md",
    "scripts/validate-stable-accessibility-smoke.mjs",
    "scripts/validate-stable-accessibility-smoke.test.mjs",
    "quality/beta-feedback.json",
    "scripts/validate-beta-feedback.mjs",
    "scripts/validate-beta-feedback.test.mjs",
    "scripts/validate-stable-readiness.mjs",
    "scripts/validate-stable-readiness.test.mjs",
  ]) {
    const result = scopes(path);
    assert.equal(result.manual_audit, true, path);
    assert.equal(result.docs_only, false, path);
  }
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

test("routes narrow public entrypoints and broad root package policy safely", () => {
  for (const path of [
    "packages/ui/src/client.ts",
    "quality/package-budgets.json",
    "scripts/pack-check.mjs",
  ]) {
    assert.equal(scopes(path).packages, true, path);
  }
  const rootManifest = scopes("package.json");
  assert.equal(rootManifest.broad, true);
  assert.equal(rootManifest.browser, true);
  assert.equal(rootManifest.manual_audit, true);
});

test("fails safe for unknown paths", () => {
  const result = scopes("unclassified/new-contract.json");
  assert.equal(result.unknown, true);
  assert.equal(result.docs_only, false);
  assert.equal(result.ui, true);
  assert.equal(result.packages, true);
  assert.equal(result.workflow, true);
});

test("normalizes Windows separators and removes duplicate paths", () => {
  const result = detectCiScopes([
    "packages\\ui\\src\\components\\button.tsx",
    "packages/ui/src/components/button.tsx",
  ]);
  assert.deepEqual(result.changedFiles, ["packages/ui/src/components/button.tsx"]);
  assert.equal(result.scopes.browser, true);
});

test("preserves both paths from renamed and copied files", () => {
  assert.deepEqual(
    parseNameStatusOutput(
      [
        "R100",
        "packages/ui/src/components/legacy.tsx",
        "docs/legacy.md",
        "C075",
        "packages/registry/src/manifest.json",
        "fixtures/manifest.json",
        "M",
        "README.md",
        "",
      ].join("\0"),
    ),
    [
      "packages/ui/src/components/legacy.tsx",
      "docs/legacy.md",
      "packages/registry/src/manifest.json",
      "fixtures/manifest.json",
      "README.md",
    ],
  );
});

test("treats identical base and head trees as a zero-content change", () => {
  const calls = [];
  const runGit = (...args) => {
    calls.push(args);
    return "";
  };

  assert.deepEqual(changedFilesBetween("base", "head", runGit), []);
  assert.deepEqual(calls, [["git", ["diff", "--quiet", "base", "head"], { stdio: "ignore" }]]);
});

test("uses merge-base paths when base and head trees differ", () => {
  const calls = [];
  const runGit = (...args) => {
    calls.push(args);
    if (calls.length === 1) throw Object.assign(new Error("trees differ"), { status: 1 });
    return ["M", "scripts/detect-ci-scopes.mjs", ""].join("\0");
  };

  assert.deepEqual(changedFilesBetween("base", "head", runGit), ["scripts/detect-ci-scopes.mjs"]);
  assert.deepEqual(calls[1], [
    "git",
    ["diff", "--name-status", "-z", "--diff-filter=ACMRD", "base...head"],
    { encoding: "utf8" },
  ]);
});

test("does not hide git failures while comparing trees", () => {
  const failure = Object.assign(new Error("invalid revision"), { status: 128 });
  assert.throws(
    () =>
      changedFilesBetween("base", "head", () => {
        throw failure;
      }),
    (error) => error === failure,
  );
});
