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
      "docs/assets.md": "See ./assets/visual-language-1-0/comparison.png.",
      "docs/audits/screenshots/review.jpg": "binary fixture",
      "docs/audits/review.md": "Evidence: ./screenshots/review.jpg",
      "tests/visual/__screenshots__/linux/core-light.png": "binary fixture",
      "apps/docs/public/avatars/person.png": "binary fixture",
      "apps/docs/app/fixture.tsx": 'src="/avatars/person.png"',
      "docs/development.md": "Open http://localhost:3000 or http://127.0.0.1:3001.",
      "docs/routes.md": [
        "Read https://docs.example.com/home/getting-started.",
        "Open /home/settings or [Home](/home/getting-started).",
        "Open [Profile](/home/settings/profile).",
        'GET `/home/settings/profile` or use <a href="/home/settings/profile">Profile</a>.',
      ].join("\n"),
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

test("rejects audit screenshots without a live audit reference", () => {
  assert.deepEqual(failures({ "docs/audits/screenshots/unowned.png": "binary fixture" }), [
    "docs/audits/screenshots/unowned.png: durable audit evidence must be referenced by an audit document",
  ]);
});

test("rejects durable public assets without a live owner reference", () => {
  assert.deepEqual(
    failures({
      "docs/assets/orphan.png": "binary fixture",
      "apps/docs/public/orphan.png": "binary fixture",
    }),
    [
      "docs/assets/orphan.png: durable public assets must have a live repository reference",
      "apps/docs/public/orphan.png: durable public assets must have a live repository reference",
    ],
  );
});

test("rejects machine-specific paths with path and line diagnostics", () => {
  const result = failures({
    "docs/audits/local-run.md": [
      "portable line",
      "Evidence: /Users/alice/project/capture.png",
      "Linux: /home/alice/project/capture.png",
      "Temp: /var/folders/ab/session/capture.png",
      "Windows: C:\\Users\\alice\\capture.png",
      "Windows slash: C:/Users/alice/capture.png",
      "Cache: /workspace/.codex/visualizations/capture.png",
      "URL: file:///tmp/capture.png",
      "Link: [capture](/Users/alice/project/capture.png)",
      "Linux link: [capture](/home/alice/project/capture.png)",
    ].join("\n"),
  });
  assert.ok(result.some((failure) => failure.startsWith("docs/audits/local-run.md:2:")));
  assert.ok(result.some((failure) => failure.includes("personal Linux home path")));
  assert.ok(result.some((failure) => failure.includes("macOS temporary path")));
  assert.ok(result.some((failure) => failure.includes("Windows user path")));
  assert.ok(result.some((failure) => failure.includes("tool-private cache path")));
  assert.ok(result.some((failure) => failure.includes("local file URL")));
  assert.ok(result.some((failure) => failure.startsWith("docs/audits/local-run.md:9:")));
  assert.ok(result.some((failure) => failure.startsWith("docs/audits/local-run.md:10:")));
});

test("scans all tracked Markdown documentation for machine-specific paths", () => {
  const result = failures({
    "packages/ui/README.md": "Evidence: /home/alice/project/ui.png",
    "packages/cli/README.md": "Evidence: C:/Users/alice/project/cli.png",
    ".github/PULL_REQUEST_TEMPLATE.md": "Evidence: /Users/alice/project/review.png",
  });
  assert.equal(result.length, 3);
  assert.ok(result.some((failure) => failure.startsWith("packages/ui/README.md:1:")));
  assert.ok(result.some((failure) => failure.startsWith("packages/cli/README.md:1:")));
  assert.ok(result.some((failure) => failure.startsWith(".github/PULL_REQUEST_TEMPLATE.md:1:")));
});

test("rejects generated comparison and report output outside approved locations", () => {
  const result = failures({
    "review/01-final.png": "binary fixture",
    "review/screenshot.png": "binary fixture",
    "review/video.webm": "binary fixture",
    "review/trace.zip": "binary fixture",
    "docs/audits/docs-route-bundle-report.json": "{}",
    "quality/lighthouse-report.json": "{}",
    "docs/assets/lighthouse-report.json": "{}",
    "apps/docs/public/lighthouse-report.json": "{}",
    "review/comparison.html": "generated fixture",
  });
  assert.equal(result.length, 9);
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
