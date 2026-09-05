import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertCoordinatedReleaseSemantics,
  assertDependencyAwarePackageOrder,
  containsExactVersion,
  releaseSemanticsForVersion,
  replaceCliPackageVersions,
  replaceExactVersion,
} from "./release-metadata.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const script = resolve(root, "scripts/release-metadata.mjs");

test("validates the coordinated release metadata source", () => {
  const result = spawnSync(process.execPath, [script, "validate"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1\.0\.0 \(stable\)/);
});

test("prints a deterministic dry-run without modifying files", () => {
  const result = spawnSync(process.execPath, [script, "prepare", "1.0.1"], {
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
  for (const packageName of ["tokens", "adapters", "ui", "registry", "cli", "mcp"]) {
    assert.ok(
      output.changes.some(({ path }) => path === `packages/${packageName}/README.md`),
      `${packageName} README must participate in coordinated version preparation`,
    );
  }
});

test("derives release metadata semantics from supported release versions", () => {
  assert.deepEqual(releaseSemanticsForVersion("1.0.0"), {
    channel: "stable",
    migrationTarget: "1.0.0",
    protectedDistTags: ["alpha", "beta"],
    docsStatusLabel: "Prepared stable 1.0 candidate",
  });
  assert.deepEqual(releaseSemanticsForVersion("1.1.0-beta.2"), {
    channel: "beta",
    migrationTarget: "1.1.0-beta.2",
    protectedDistTags: ["alpha"],
    docsStatusLabel: "Prepared beta.2 candidate",
  });
  assert.deepEqual(releaseSemanticsForVersion("1.2.0-alpha.3"), {
    channel: "alpha",
    migrationTarget: "1.2.0-alpha.3",
    protectedDistTags: ["beta"],
    docsStatusLabel: "Prepared alpha.3 candidate",
  });
});

test("rejects unknown prerelease channels", () => {
  assert.throws(
    () => releaseSemanticsForVersion("1.0.0-rc.1"),
    /alpha\.<number> or beta\.<number>/,
  );
  const result = spawnSync(process.execPath, [script, "prepare", "1.0.0-rc.1"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /alpha\.<number> or beta\.<number>/);
});

test("replaces only the exact active version and preserves historical prereleases", () => {
  const source = [
    "Core 1.0.0",
    "tag v1.0.0",
    "@nerio-ui/ui@1.0.0",
    "historical 1.0.0-beta.1 and v1.0.0-alpha.2",
  ].join("\n");
  assert.equal(
    replaceExactVersion(source, "1.0.0", "1.0.1"),
    [
      "Core 1.0.1",
      "tag v1.0.1",
      "@nerio-ui/ui@1.0.1",
      "historical 1.0.0-beta.1 and v1.0.0-alpha.2",
    ].join("\n"),
  );
});

test("does not accept a prerelease as evidence for the stable version", () => {
  assert.equal(containsExactVersion("Current release: 1.0.0", "1.0.0"), true);
  assert.equal(containsExactVersion("Current release: v1.0.0", "1.0.0"), true);
  assert.equal(containsExactVersion("Current release: 1.0.0-beta.1", "1.0.0"), false);
  assert.equal(containsExactVersion("Current release: v1.0.0-alpha.2", "1.0.0"), false);
});

test("updates CLI package help without rewriting stable schema contracts", () => {
  const source = [
    'const STATE_SCHEMA_VERSION = "1.0.0";',
    'const SUPPORTED_CONFIG_SCHEMAS = new Set(["0.1.0", "1.0.0"]);',
    'const TRANSACTION_SCHEMA_VERSION = "1.0.0";',
    'const REGISTRY_LOCK_SCHEMA_VERSION = "1.0.0";',
    '"pnpm add -D @nerio-ui/registry@1.0.0 @nerio-ui/cli@1.0.0"',
    '"pnpm dlx @nerio-ui/cli@1.0.0 init"',
    'schemaVersion: "1.0.0",',
  ].join("\n");
  assert.equal(
    replaceCliPackageVersions(source, "1.0.0", "1.0.1"),
    source
      .replace("@nerio-ui/registry@1.0.0", "@nerio-ui/registry@1.0.1")
      .replaceAll("@nerio-ui/cli@1.0.0", "@nerio-ui/cli@1.0.1"),
  );
});

test("rejects release metadata that contradicts coordinated version semantics", () => {
  const valid = {
    channel: "stable",
    coreVersion: "1.0.0",
    docsStatusLabel: "Prepared stable 1.0 candidate",
    migrationTarget: "1.0.0",
    protectedDistTags: ["alpha", "beta"],
    registryVersion: "1.0.0",
  };
  assert.doesNotThrow(() => assertCoordinatedReleaseSemantics(valid));
  assert.doesNotThrow(() =>
    assertCoordinatedReleaseSemantics({
      ...valid,
      docsStatusLabel: "Published stable 1.0",
    }),
  );
  for (const [field, value, pattern] of [
    ["channel", "beta", /channel must match/],
    ["registryVersion", "1.0.1", /registryVersion must match/],
    ["migrationTarget", "1.0.0-beta.1", /migrationTarget must match/],
    ["protectedDistTags", ["alpha"], /Protected dist-tags must match/],
    ["docsStatusLabel", "Ready", /docsStatusLabel must identify/],
  ]) {
    assert.throws(() => assertCoordinatedReleaseSemantics({ ...valid, [field]: value }), pattern);
  }
});

test("requires dependencies to be published before their consumers", () => {
  const manifests = [
    { name: "@nerio-ui/tokens" },
    { name: "@nerio-ui/adapters" },
    {
      name: "@nerio-ui/ui",
      dependencies: {
        "@nerio-ui/adapters": "workspace:*",
        "@nerio-ui/tokens": "workspace:*",
      },
    },
    { name: "@nerio-ui/registry", dependencies: { "@nerio-ui/ui": "workspace:*" } },
    { name: "@nerio-ui/cli", dependencies: { "@nerio-ui/registry": "workspace:*" } },
    { name: "@nerio-ui/mcp", dependencies: { "@nerio-ui/registry": "workspace:*" } },
  ];
  const correctOrder = [
    "@nerio-ui/tokens",
    "@nerio-ui/adapters",
    "@nerio-ui/ui",
    "@nerio-ui/registry",
    "@nerio-ui/cli",
    "@nerio-ui/mcp",
  ];
  assert.doesNotThrow(() => assertDependencyAwarePackageOrder(correctOrder, manifests));
  assert.throws(
    () =>
      assertDependencyAwarePackageOrder(
        correctOrder.with(2, "@nerio-ui/registry").with(3, "@nerio-ui/ui"),
        manifests,
      ),
    /@nerio-ui\/ui must precede dependent package @nerio-ui\/registry/,
  );
});
