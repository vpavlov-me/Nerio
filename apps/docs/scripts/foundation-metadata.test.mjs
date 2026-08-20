import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  assertGeneratedProjection,
  createFoundationMetadata,
  foundationDiscoveryFailures,
  renderFoundationMetadataModule,
} from "./foundation-metadata.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (path) => readFileSync(join(root, path), "utf8");
const cssSource = read("packages/tokens/src/styles.css");
const catalog = JSON.parse(read("data/component-catalog.json"));
const foundationPages = JSON.parse(read("apps/docs/content/foundations.json"));
const input = (source = cssSource) => ({ cssSource: source, catalog, foundationPages });

test("foundation metadata generation is deterministic", () => {
  const first = renderFoundationMetadataModule(createFoundationMetadata(input()));
  const second = renderFoundationMetadataModule(createFoundationMetadata(input()));
  assert.equal(first, second);
});

test("rejects malformed CSS", () => {
  assert.throws(
    () => createFoundationMetadata(input(":root { --n-font-size-xs: 0.75rem;")),
    /Could not parse canonical token CSS/,
  );
});

test("rejects duplicate declarations in one selector", () => {
  const mutated = cssSource.replace(
    "--n-font-size-xs: 0.75rem;",
    "--n-font-size-xs: 0.75rem;\n  --n-font-size-xs: 0.8rem;",
  );
  assert.throws(
    () => createFoundationMetadata(input(mutated)),
    /duplicate declaration --n-font-size-xs/,
  );
});

test("rejects missing aliases", () => {
  const mutated = cssSource.replace(
    "--n-font-sans: var(--n-font-sans-system);",
    "--n-font-sans: var(--n-font-sans-missing);",
  );
  assert.throws(
    () => createFoundationMetadata(input(mutated)),
    /references missing alias --n-font-sans-missing/,
  );
});

test("rejects unsupported alias cycles", () => {
  const mutated = `${cssSource}\n:root { --n-cycle-a: var(--n-cycle-b); --n-cycle-b: var(--n-cycle-a); }\n`;
  assert.throws(() => createFoundationMetadata(input(mutated)), /unsupported alias cycle/);
});

test("detects the historical dark-surface mapping drift", () => {
  const expected = renderFoundationMetadataModule(createFoundationMetadata(input()));
  const mutated = cssSource.replace(
    /(:root\[data-mode="dark"\][\s\S]*?--n-color-surface-canvas:) var\(--n-gray-1000\)/,
    "$1 var(--n-gray-950)",
  );
  const actual = renderFoundationMetadataModule(createFoundationMetadata(input(mutated)));
  assert.throws(
    () =>
      assertGeneratedProjection({
        actual,
        expected,
        target: "apps/docs/lib/generated/foundation-metadata.ts",
        sources: ["packages/tokens/src/styles.css"],
      }),
    /drifted from packages\/tokens\/src\/styles\.css/,
  );
});

test("detects a newly implemented typography step omitted from the checked-in projection", () => {
  const expected = renderFoundationMetadataModule(createFoundationMetadata(input()));
  const mutated = cssSource.replace(
    "--n-font-size-5xl: 1.78125rem;",
    "--n-font-size-5xl: 1.78125rem;\n  --n-font-size-6xl: 2rem;",
  );
  const actual = renderFoundationMetadataModule(createFoundationMetadata(input(mutated)));
  assert.throws(
    () =>
      assertGeneratedProjection({
        actual,
        expected,
        target: "apps/docs/lib/generated/foundation-metadata.ts",
        sources: ["packages/tokens/src/styles.css"],
      }),
    /Run pnpm prepare:foundation-metadata/,
  );
});

test("projects the canonical default font aliases", () => {
  const metadata = createFoundationMetadata(input());
  assert.equal(metadata.typography.fontDefaults.sans.reference, "--n-font-sans-system");
  assert.equal(metadata.typography.fontDefaults.mono.reference, "--n-font-mono-system");
});

test("projects every canonical primitive and semantic color family", () => {
  const metadata = createFoundationMetadata(input());
  assert.deepEqual(
    metadata.color.primitiveFamilies.map((family) => family.value),
    [
      "gray",
      "gray-alpha",
      "white-alpha",
      "purple",
      "blue",
      "green",
      "orange",
      "red",
      "amber",
      "cyan",
      "magenta",
    ],
  );
  assert.deepEqual(
    metadata.color.semanticFamilies.map((family) => family.value),
    ["surface", "text", "border", "action", "focus", "status", "trend", "chart"],
  );
  assert.ok(
    metadata.color.componentAliases.some(
      (alias) =>
        alias.token === "--n-button-background-primary" &&
        alias.reference === "--n-color-action-primary",
    ),
  );
  assert.ok(
    metadata.color.componentAliases.some(
      (alias) =>
        alias.token === "--n-button-background-destructive" &&
        alias.reference === "--n-color-danger",
    ),
  );
});

test("projects representative light, dark, and system-dark color mappings", () => {
  const metadata = createFoundationMetadata(input());
  const dark = metadata.runtimeAxes.mode.mappings.find((mapping) => mapping.value === "dark");
  const system = metadata.runtimeAxes.mode.mappings.find((mapping) => mapping.value === "system");
  const purple = metadata.runtimeAxes.theme.presets.find((preset) => preset.value === "purple");
  assert.equal(
    dark.colorMappings.find((mapping) => mapping.token === "--n-color-text-primary").reference,
    "--n-gray-50",
  );
  assert.equal(
    system.colorMappings.find((mapping) => mapping.token === "--n-color-text-primary").reference,
    "--n-gray-50",
  );
  assert.equal(
    purple.colorMappings.dark.find((mapping) => mapping.token === "--n-color-action-primary")
      .reference,
    "--n-purple-500",
  );
  assert.equal(
    purple.colorMappings.systemDark.find((mapping) => mapping.token === "--n-color-action-primary")
      .reference,
    "--n-purple-500",
  );
});

test("projects the canonical primitive spacing scale and component aliases", () => {
  const metadata = createFoundationMetadata(input());
  assert.deepEqual(
    metadata.spacing.primitiveScale.map((step) => step.name),
    ["0", "0-5", "1", "1-5", "2", "2-5", "3", "4", "5", "6", "8", "10", "12"],
  );
  assert.equal(metadata.spacing.primitiveScale[0].pixels, "0px");
  assert.equal(
    metadata.spacing.componentAliases.find((alias) => alias.token === "--n-table-cell-padding-y")
      .reference,
    "--n-density-space-md",
  );
});

test("detects primitive spacing drift from canonical token CSS", () => {
  const expected = renderFoundationMetadataModule(createFoundationMetadata(input()));
  const mutated = cssSource.replace(
    "--n-space-12: 3rem;",
    "--n-space-12: 3rem;\n  --n-space-14: 3.5rem;",
  );
  const actual = renderFoundationMetadataModule(createFoundationMetadata(input(mutated)));
  assert.throws(
    () =>
      assertGeneratedProjection({
        actual,
        expected,
        target: "apps/docs/lib/generated/foundation-metadata.ts",
        sources: ["packages/tokens/src/styles.css"],
      }),
    /Run pnpm prepare:foundation-metadata/,
  );
});

test("detects color metadata drift from canonical token CSS", () => {
  const expected = renderFoundationMetadataModule(createFoundationMetadata(input()));
  const mutated = cssSource.replace(
    "--n-color-text-primary: var(--n-gray-950);",
    "--n-color-text-primary: var(--n-gray-900);",
  );
  const actual = renderFoundationMetadataModule(createFoundationMetadata(input(mutated)));
  assert.throws(
    () =>
      assertGeneratedProjection({
        actual,
        expected,
        target: "apps/docs/lib/generated/foundation-metadata.ts",
        sources: ["packages/tokens/src/styles.css"],
      }),
    /drifted from packages\/tokens\/src\/styles\.css/,
  );
});

test("reports missing foundation discovery coverage", () => {
  const failures = foundationDiscoveryFailures({
    pages: [{ path: "/docs/foundations/example", label: "Example" }],
    llmsSource: "# Foundations",
    routeExists: () => false,
  });
  assert.deepEqual(failures, [
    "/docs/foundations/example: canonical foundation route has no page.tsx implementation.",
    "apps/docs/content/llms.txt is missing canonical foundation route /docs/foundations/example; update the Foundations index.",
  ]);
});

test("does not accept a foundation route mentioned outside the Foundations index", () => {
  const path = "/docs/foundations/example";
  const failures = foundationDiscoveryFailures({
    pages: [{ path, label: "Example" }],
    llmsSource: `Another section mentions \`${path}\`.\n\nThe public Foundations index is \`/docs/foundations/tokens\`.`,
    routeExists: () => true,
  });
  assert.deepEqual(failures, [
    `apps/docs/content/llms.txt is missing canonical foundation route ${path}; update the Foundations index.`,
  ]);
});
