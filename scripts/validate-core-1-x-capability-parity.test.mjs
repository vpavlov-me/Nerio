import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const validator = resolve(root, "scripts/validate-core-1-x-capability-parity.mjs");
const matrixPath = resolve(root, "quality/core-1-x-capability-parity.json");
const catalogPath = resolve(root, "data/component-catalog.json");
const manifestPath = resolve(root, "packages/registry/src/manifest.json");

function run(...args) {
  return spawnSync(process.execPath, [validator, ...args], {
    cwd: root,
    encoding: "utf8",
  });
}

function invalidMatrix(update, expected) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-capability-parity-"));
  const target = resolve(directory, "matrix.json");
  const matrix = JSON.parse(readFileSync(matrixPath, "utf8"));
  update(matrix);
  writeFileSync(target, `${JSON.stringify(matrix, null, 2)}\n`);
  try {
    const result = run("--matrix", target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expected);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function invalidDocs(update, expected) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-capability-parity-docs-"));
  const target = resolve(directory, "parity.md");
  const docs = readFileSync(resolve(root, "docs/core-1-x-capability-parity.md"), "utf8");
  writeFileSync(target, update(docs));
  try {
    const result = run("--docs", target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expected);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function invalidManifest(update, expected) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-capability-parity-manifest-"));
  const target = resolve(directory, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  update(manifest);
  writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`);
  try {
    const result = run("--manifest", target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expected);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function invalidCatalog(update, expected) {
  const directory = mkdtempSync(resolve(tmpdir(), "nerio-capability-parity-catalog-"));
  const target = resolve(directory, "component-catalog.json");
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  update(catalog);
  writeFileSync(target, `${JSON.stringify(catalog, null, 2)}\n`);
  try {
    const result = run("--catalog", target);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, expected);
    assert.doesNotMatch(result.stderr, /TypeError|ERR_INVALID_ARG_TYPE/);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("capability parity validator accepts the repository decision", () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
});

test("capability parity validator reports a missing option value", () => {
  const result = run("--matrix");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Usage error: --matrix requires a path value/);
});

test("capability parity validator protects the complete Core inventory", () => {
  invalidMatrix((matrix) => {
    matrix.capabilities.find((capability) => capability.id === "actions").nerioComponents = [
      "Button",
      "Toggle",
    ];
  }, /Capability coverage of catalog components is missing: ButtonGroup/);
});

test("capability parity validator rejects duplicate capability ownership", () => {
  invalidMatrix((matrix) => {
    matrix.capabilities
      .find((capability) => capability.id === "form-foundations")
      .nerioComponents.push("Button");
  }, /Capability coverage of catalog components contains duplicate ownership: Button/);
});

test("capability parity validator protects the reviewed Base UI set", () => {
  invalidMatrix((matrix) => {
    matrix.reviewedBaseUiPrimitives = matrix.reviewedBaseUiPrimitives.filter(
      (primitive) => primitive !== "accordion",
    );
  }, /Reviewed Base UI 1\.6\.0 primitive set is missing: accordion/);
});

test("capability parity validator cross-checks linked issue dispositions", () => {
  invalidMatrix((matrix) => {
    matrix.capabilities.find((capability) => capability.id === "direction-localization").target =
      "Core 1.2";
  }, /Parity capability direction-localization target must match issue #342/);
});

test("capability parity validator pins issue-specific dependencies", () => {
  invalidMatrix((matrix) => {
    matrix.capabilities.find((capability) => capability.id === "registry-namespaces").dependencies =
      matrix.capabilities
        .find((capability) => capability.id === "registry-namespaces")
        .dependencies.filter((issue) => issue !== 352);
  }, /Parity capability registry-namespaces dependencies is missing: 352/);
});

test("capability parity validator pins capability-specific dependencies", () => {
  invalidMatrix((matrix) => {
    matrix.capabilities.find(
      (capability) => capability.id === "autocomplete-suggestions",
    ).dependencies = matrix.capabilities
      .find((capability) => capability.id === "autocomplete-suggestions")
      .dependencies.filter((issue) => issue !== 346);
  }, /Parity capability autocomplete-suggestions dependencies is missing: 346/);
});

test("capability parity validator pins the complete capability inventory", () => {
  invalidMatrix((matrix) => {
    matrix.capabilities = matrix.capabilities.filter(
      (capability) => capability.id !== "autocomplete-suggestions",
    );
  }, /Parity capability ids is missing: autocomplete-suggestions/);
});

test("capability parity validator pins priority and target values", () => {
  invalidMatrix((matrix) => {
    matrix.priorityValues.push("TYPO");
  }, /Parity priorityValues contains unknown values: TYPO/);
});

test("capability parity validator requires every child issue disposition", () => {
  invalidMatrix((matrix) => {
    matrix.issueDispositions = matrix.issueDispositions.filter(
      (disposition) => disposition.issue !== 349,
    );
  }, /Parity matrix is missing issue #349/);
});

test("capability parity validator cross-checks roadmap track contents", () => {
  invalidMatrix((matrix) => {
    matrix.sequence.find((sequence) => sequence.id === "primitive-parity-a").issues = [];
  }, /ROADMAP\.md is stale for parity track primitive-parity-a/);
});

test("capability parity validator requires every named sequence", () => {
  invalidMatrix((matrix) => {
    matrix.sequence = matrix.sequence.filter((sequence) => sequence.id !== "ecosystem");
  }, /Parity sequence ids is missing: ecosystem/);
});

test("capability parity validator cross-checks human capability fields", () => {
  invalidDocs(
    (docs) =>
      docs.replace(
        "capability:direction-localization classification:core-1.1-primitive priority:P1 target:Core 1.1",
        "capability:direction-localization classification:core-1.1-primitive priority:P1 target:Core 1.2",
      ),
    /Human parity decision is stale for capability direction-localization/,
  );
});

test("capability parity validator detects stale baseline metadata", () => {
  invalidMatrix((matrix) => {
    matrix.baseline.baseUiVersion = "1.5.0";
  }, /Parity baseline Base UI version must match/);
});

test("capability parity validator protects the complete catalog baseline", () => {
  invalidCatalog((catalog) => {
    catalog.components[0].description = `${catalog.components[0].description} changed`;
  }, /Parity baseline component catalog hash is stale/);
});

test("capability parity validator protects the complete Registry baseline", () => {
  invalidManifest((manifest) => {
    manifest.items[0].description = `${manifest.items[0].description} changed`;
  }, /Parity baseline Registry manifest hash is stale/);
});
