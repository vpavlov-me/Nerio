import assert from "node:assert/strict";
import test from "node:test";
import { repositoryArtifactFailures } from "./validate-repository-artifacts.mjs";

function failures(fixtures) {
  return repositoryArtifactFailures(Object.keys(fixtures), (path) => fixtures[path]);
}

test("accepts canonical assets, platform baselines, audit evidence, and localhost docs", () => {
  assert.deepEqual(
    failures({
      "docs/assets/visual-language-1-0/comparison.png": "binary fixture",
      "docs/audits/screenshots/review.jpg": "binary fixture",
      "tests/visual/__screenshots__/linux/core-light.png": "binary fixture",
      "apps/docs/public/avatars/person.png": "binary fixture",
      "docs/development.md": "Open http://localhost:3000 or http://127.0.0.1:3001.",
      "quality/docs-route-bundle-baseline.json": "{}",
    }),
    [],
  );
});

test("rejects tracked files in designated ephemeral directories", () => {
  const result = failures({
    "artifacts/qa/final.png": "binary fixture",
    "design-qa-artifacts/comparison.html": "generated fixture",
    "design-qa.md": "local run log",
  });
  assert.equal(result.length, 3);
  assert.match(result[0], /artifacts\/qa\/final\.png/);
  assert.match(result[1], /design-qa-artifacts\/comparison\.html/);
  assert.match(result[2], /design-qa\.md/);
});

test("rejects machine-specific paths with path and line diagnostics", () => {
  const result = failures({
    "docs/audits/local-run.md": [
      "portable line",
      "Evidence: /Users/alice/project/capture.png",
      "Temp: /var/folders/ab/session/capture.png",
      "Windows: C:\\Users\\alice\\capture.png",
      "Cache: /workspace/.codex/visualizations/capture.png",
      "URL: file:///tmp/capture.png",
    ].join("\n"),
  });
  assert.ok(result.some((failure) => failure.startsWith("docs/audits/local-run.md:2:")));
  assert.ok(result.some((failure) => failure.includes("macOS temporary path")));
  assert.ok(result.some((failure) => failure.includes("Windows user path")));
  assert.ok(result.some((failure) => failure.includes("tool-private cache path")));
  assert.ok(result.some((failure) => failure.includes("local file URL")));
});

test("rejects generated comparison and report output outside approved locations", () => {
  const result = failures({
    "review/current-comparison.png": "binary fixture",
    "docs/audits/docs-route-bundle-report.json": "{}",
    "review/comparison.html": "generated fixture",
  });
  assert.equal(result.length, 3);
  assert.ok(result.every((failure) => failure.includes("ignored artifact directory")));
});

test("supports an explicit inline allow marker for a legitimate portable example", () => {
  assert.deepEqual(
    failures({
      "docs/example.md":
        "A documented parser fixture may use file:///portable/example. <!-- repo-artifacts-allow -->",
    }),
    [],
  );
});
