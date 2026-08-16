import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const paths = parsePathOptions(process.argv.slice(2), {
  "--matrix": resolve(root, "quality/core-1-x-capability-parity.json"),
  "--catalog": resolve(root, "data/component-catalog.json"),
  "--manifest": resolve(root, "packages/registry/src/manifest.json"),
  "--ui-package": resolve(root, "packages/ui/package.json"),
  "--api-approval": resolve(root, "quality/public-api-snapshot-approval.json"),
  "--docs": resolve(root, "docs/core-1-x-capability-parity.md"),
  "--roadmap": resolve(root, "ROADMAP.md"),
});
const baselinePublicApiSnapshotSha256 =
  "248544c8b546a702c3f9415729ecc3eba298019000ae402c7e5a551275f7e9a3";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function serializeCanonicalJson(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(serializeCanonicalJson).join(",")}]`;
  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${serializeCanonicalJson(value[key])}`)
    .join(",")}}`;
}

function canonicalJsonSha256(value) {
  return createHash("sha256").update(serializeCanonicalJson(value)).digest("hex");
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated].sort();
}

function compareSets(label, actualValues, expectedValues) {
  const actual = new Set(actualValues);
  const expected = new Set(expectedValues);
  const missing = [...expected].filter((value) => !actual.has(value)).sort();
  const unknown = [...actual].filter((value) => !expected.has(value)).sort();
  assert(!missing.length, `${label} is missing: ${missing.join(", ")}`);
  assert(!unknown.length, `${label} contains unknown values: ${unknown.join(", ")}`);
}

function assertUniqueOwnership(label, values) {
  const repeated = duplicates(values);
  assert(!repeated.length, `${label} contains duplicate ownership: ${repeated.join(", ")}`);
}

for (const path of Object.values(paths)) {
  assert(existsSync(path), `Required parity projection is missing: ${path}`);
}

const matrix = readJson(paths["--matrix"]);
const catalog = readJson(paths["--catalog"]);
const manifest = readJson(paths["--manifest"]);
const uiPackage = readJson(paths["--ui-package"]);
const apiApproval = readJson(paths["--api-approval"]);
const docs = readFileSync(paths["--docs"], "utf8");
const roadmap = readFileSync(paths["--roadmap"], "utf8");

assert(matrix.schemaVersion === 1, "Parity matrix schemaVersion must be 1.");
assert(
  matrix.decision === "accepted-planning-baseline",
  "Parity matrix must record the accepted planning baseline.",
);
assert(
  /^\d{4}-\d{2}-\d{2}$/.test(matrix.retrievedAt),
  "Parity matrix retrievedAt must be an ISO date.",
);
assert(
  matrix.baseline?.componentCatalogSchemaVersion === catalog.schemaVersion,
  "Parity baseline component catalog schema is stale.",
);
assert(
  matrix.baseline?.componentCatalogSha256 === canonicalJsonSha256(catalog),
  "Parity baseline component catalog hash is stale.",
);
assert(
  matrix.baseline?.registrySchemaVersion === manifest.schemaVersion,
  "Parity baseline Registry schema is stale.",
);
assert(
  matrix.baseline?.registryItemCount === manifest.items?.length,
  "Parity baseline Registry item count is stale.",
);
assert(
  matrix.baseline?.registryManifestSha256 === canonicalJsonSha256(manifest),
  "Parity baseline Registry manifest hash is stale.",
);
assert(
  matrix.baseline?.coreVersion === manifest.version,
  "Parity baseline Core version must match the Registry version.",
);
assert(
  matrix.baseline?.baseUiVersion === "1.6.0",
  "Parity baseline Base UI version must retain the reviewed historical value.",
);
assert(
  matrix.currentBaseUiVersion === uiPackage.dependencies?.["@base-ui/react"],
  "Current parity Base UI version must match the exact UI dependency.",
);
assert(
  matrix.currentBaseUiReview &&
    typeof matrix.currentBaseUiReview === "object" &&
    !Array.isArray(matrix.currentBaseUiReview),
  "Current Base UI review must be an object.",
);
assert(
  matrix.currentBaseUiReview.version === matrix.currentBaseUiVersion,
  "Current Base UI review version must match the current parity dependency.",
);
assert(
  /^\d{4}-\d{2}-\d{2}$/.test(matrix.currentBaseUiReview.retrievedAt ?? ""),
  "Current Base UI review retrievedAt must be an ISO date.",
);
assert(
  matrix.currentBaseUiReview.releaseUrl ===
    `https://github.com/mui/base-ui/releases/tag/v${matrix.currentBaseUiVersion}`,
  "Current Base UI review must link the exact official release.",
);
assert(
  matrix.currentBaseUiReview.packageUrl ===
    `https://www.npmjs.com/package/@base-ui/react/v/${matrix.currentBaseUiVersion}`,
  "Current Base UI review must link the exact package metadata.",
);
assert(
  matrix.baseline?.publicApiSnapshotSha256 === baselinePublicApiSnapshotSha256,
  "Parity baseline API snapshot hash must retain the reviewed historical value.",
);
assert(
  matrix.currentPublicApiSnapshotSha256 === apiApproval.snapshotSha256,
  "Current parity API snapshot hash is stale.",
);

const requiredClassifications = [
  "existing-core",
  "native-guidance",
  "core-1.1-primitive",
  "later-core-candidate",
  "core-recipe",
  "adapter",
  "pro",
  "consumer-owned",
  "rejected",
];
compareSets(
  "Parity classificationValues",
  Object.keys(matrix.classificationValues ?? {}),
  requiredClassifications,
);
const requiredPriorities = ["P1", "P2", "P3", "none"];
const requiredTargets = ["current", "Core 1.1", "Core 1.2", "Ecosystem", "Pro", "consumer", "none"];
for (const value of duplicates(matrix.priorityValues ?? [])) {
  throw new Error(`Duplicate parity priority value: ${value}`);
}
for (const value of duplicates(matrix.targetValues ?? [])) {
  throw new Error(`Duplicate parity target value: ${value}`);
}
compareSets("Parity priorityValues", matrix.priorityValues ?? [], requiredPriorities);
compareSets("Parity targetValues", matrix.targetValues ?? [], requiredTargets);

assert(
  Array.isArray(matrix.sources) && matrix.sources.length >= 7,
  "Parity sources are incomplete.",
);
for (const source of matrix.sources) {
  assert(
    source.id && source.kind && source.scope,
    "Every parity source needs id, kind, and scope.",
  );
  assert(source.retrievedAt === matrix.retrievedAt, `Parity source ${source.id} has a stale date.`);
  assert(
    typeof source.url === "string" && source.url.startsWith("https://"),
    `Parity source ${source.id} must use an HTTPS URL.`,
  );
}
assert(
  matrix.sources.some((source) => source.id === "base-ui-package"),
  "Parity sources must include the exact Base UI package metadata.",
);
assert(
  matrix.sources.some((source) => source.id === "shadcn-components"),
  "Parity sources must include the official shadcn/ui component index.",
);
assert(
  matrix.sources.some((source) => source.id === "heroui-components"),
  "Parity sources must include the official HeroUI component index.",
);

const expectedBaseUiPrimitives = [
  "accordion",
  "alert-dialog",
  "autocomplete",
  "avatar",
  "button",
  "checkbox",
  "checkbox-group",
  "collapsible",
  "combobox",
  "context-menu",
  "csp-provider",
  "dialog",
  "direction-provider",
  "drawer",
  "field",
  "fieldset",
  "form",
  "input",
  "menu",
  "menubar",
  "meter",
  "navigation-menu",
  "number-field",
  "otp-field",
  "popover",
  "preview-card",
  "progress",
  "radio",
  "radio-group",
  "scroll-area",
  "select",
  "separator",
  "slider",
  "switch",
  "tabs",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "unstable-use-media-query",
];
assert(
  Array.isArray(matrix.reviewedBaseUiPrimitives),
  "Reviewed historical Base UI primitives must be an array.",
);
assert(
  Array.isArray(matrix.currentBaseUiReview.reviewedPrimitives),
  "Reviewed current Base UI primitives must be an array.",
);
compareSets(
  `Reviewed Base UI ${matrix.baseline.baseUiVersion} primitive set`,
  matrix.reviewedBaseUiPrimitives ?? [],
  expectedBaseUiPrimitives,
);
compareSets(
  `Reviewed Base UI ${matrix.currentBaseUiVersion} primitive set`,
  matrix.currentBaseUiReview.reviewedPrimitives,
  expectedBaseUiPrimitives,
);

const capabilities = Array.isArray(matrix.capabilities) ? matrix.capabilities : [];
const requiredCapabilityIds = [
  "foundation-runtime-and-tokens",
  "integration-foundations",
  "actions",
  "form-foundations",
  "selection-and-range",
  "single-date",
  "overlay-foundations",
  "menu-foundation",
  "data-display",
  "feedback",
  "navigation-and-command",
  "native-html-guidance",
  "direction-localization",
  "disclosure-family",
  "compound-dialog-alert-dialog",
  "single-select-combobox",
  "search-field",
  "number-field",
  "otp-field",
  "grouped-selection",
  "multi-select",
  "compound-menu-family",
  "context-menu",
  "menubar-toolbar-navigation-menu",
  "preview-card",
  "autocomplete-suggestions",
  "advanced-platform-workflows",
  "pro-data-and-dashboard",
  "pro-product-surfaces",
  "package-output",
  "cli-lifecycle",
  "registry-namespaces",
  "mcp-discovery",
  "agent-skill",
  "component-lab",
  "core-recipes",
  "figma-interchange",
  "library-plumbing",
];
assert(capabilities.length >= 30, "Parity matrix must define a broad capability set.");
for (const id of duplicates(capabilities.map((capability) => capability.id))) {
  throw new Error(`Duplicate parity capability id: ${id}`);
}
compareSets(
  "Parity capability ids",
  capabilities.map((capability) => capability.id),
  requiredCapabilityIds,
);
const classifications = new Set(requiredClassifications);
const priorities = new Set(matrix.priorityValues ?? []);
const targets = new Set(matrix.targetValues ?? []);
const requiredCapabilityDependencies = new Map([
  ["direction-localization", [151, 341]],
  ["disclosure-family", [151, 341, 342]],
  ["compound-dialog-alert-dialog", [151, 341, 342]],
  ["single-select-combobox", [151, 341, 342]],
  ["search-field", [151, 341, 342]],
  ["number-field", [151, 341, 342]],
  ["otp-field", [151, 341, 342]],
  ["grouped-selection", [151, 341, 342]],
  ["multi-select", [151, 341, 342, 345, 348]],
  ["compound-menu-family", [151, 341, 342]],
  ["context-menu", [350]],
  ["autocomplete-suggestions", [151, 341, 346]],
  ["package-output", [151, 341]],
  ["cli-lifecycle", [151, 341]],
  ["registry-namespaces", [151, 341, 352]],
  ["mcp-discovery", [151, 341]],
  ["agent-skill", [151, 341]],
  ["component-lab", [151, 341]],
  ["core-recipes", [151, 341]],
  ["figma-interchange", [151, 341, 342]],
]);
for (const capability of capabilities) {
  const label = `Parity capability ${capability.id ?? "<missing>"}`;
  assert(capability.id && capability.kind && capability.userProblem, `${label} is incomplete.`);
  assert(
    classifications.has(capability.classification),
    `${label} has invalid classification: ${capability.classification}`,
  );
  assert(priorities.has(capability.priority), `${label} has invalid priority.`);
  assert(targets.has(capability.target), `${label} has invalid target.`);
  for (const field of [
    "nerioComponents",
    "baseUiPrimitives",
    "platformCoverageIds",
    "competitorEvidence",
    "dependencies",
    "nonGoals",
  ]) {
    assert(Array.isArray(capability[field]), `${label} must define ${field}.`);
  }
  assertUniqueOwnership(`${label} dependencies`, capability.dependencies);
  compareSets(
    `${label} dependencies`,
    capability.dependencies,
    requiredCapabilityDependencies.get(capability.id) ?? [],
  );
  assert(capability.semverImpact, `${label} must define SemVer impact.`);
  assert(capability.acceptanceBoundary, `${label} must define an acceptance boundary.`);
  if (
    ["core-1.1-primitive", "later-core-candidate", "core-recipe", "adapter"].includes(
      capability.classification,
    )
  ) {
    assert(
      Number.isInteger(capability.issue) || capability.reasonNoIssue,
      `${label} needs a linked issue or an explicit reason no issue exists.`,
    );
  }
}

const classifiedBaseUiPrimitives = capabilities.flatMap(
  (capability) => capability.baseUiPrimitives,
);
assertUniqueOwnership(
  "Capability coverage of reviewed Base UI primitives",
  classifiedBaseUiPrimitives,
);
compareSets(
  `Capability coverage of reviewed Base UI ${matrix.currentBaseUiVersion} primitives`,
  classifiedBaseUiPrimitives,
  matrix.currentBaseUiReview.reviewedPrimitives,
);

const classifiedComponents = capabilities.flatMap((capability) => capability.nerioComponents);
assertUniqueOwnership("Capability coverage of catalog components", classifiedComponents);
compareSets(
  "Capability coverage of catalog components",
  classifiedComponents,
  (catalog.components ?? []).map((component) => component.name),
);

const classifiedPlatformCoverage = capabilities.flatMap(
  (capability) => capability.platformCoverageIds,
);
assertUniqueOwnership("Capability coverage of platform decisions", classifiedPlatformCoverage);
compareSets(
  "Capability coverage of platform decisions",
  classifiedPlatformCoverage,
  (catalog.platformCoverage ?? []).map((entry) => entry.id),
);

const dispositions = Array.isArray(matrix.issueDispositions) ? matrix.issueDispositions : [];
for (const issue of duplicates(dispositions.map((disposition) => disposition.issue))) {
  throw new Error(`Duplicate parity issue disposition: #${issue}`);
}
const dispositionByIssue = new Map(
  dispositions.map((disposition) => [disposition.issue, disposition]),
);
const requiredIssueDependencies = new Map([
  [342, [341, 151]],
  [343, [341, 342, 151]],
  [344, [341, 342, 151]],
  [345, [341, 342, 151]],
  [346, [341, 342, 151]],
  [347, [341, 342, 151]],
  [348, [341, 342, 151]],
  [349, [341, 342, 345, 348, 151]],
  [350, [341, 342, 151]],
  [351, [341, 151]],
  [352, [341, 151]],
  [353, [341, 352, 151]],
  [354, [341, 151]],
  [355, [341, 151]],
  [356, [341, 151]],
  [357, [341, 342, 151]],
  [369, [341, 151]],
  [370, [341, 342, 151]],
]);
for (let issue = 342; issue <= 357; issue += 1) {
  assert(dispositionByIssue.has(issue), `Parity matrix is missing issue #${issue}.`);
}
for (const issue of [369, 370]) {
  assert(dispositionByIssue.has(issue), `Parity matrix is missing related issue #${issue}.`);
}
for (const disposition of dispositions) {
  const label = `Issue #${disposition.issue}`;
  assert(
    disposition.title &&
      disposition.disposition &&
      classifications.has(disposition.classification) &&
      priorities.has(disposition.priority) &&
      targets.has(disposition.target) &&
      Array.isArray(disposition.dependsOn) &&
      disposition.decision,
    `${label} has an incomplete disposition.`,
  );
  assertUniqueOwnership(`${label} dependencies`, disposition.dependsOn);
  compareSets(
    `${label} dependencies`,
    disposition.dependsOn,
    requiredIssueDependencies.get(disposition.issue) ?? [],
  );
  assert(docs.includes(`[#${disposition.issue}]`), `Human parity decision is missing ${label}.`);
}
for (const capability of capabilities.filter((entry) => Number.isInteger(entry.issue))) {
  const disposition = dispositionByIssue.get(capability.issue);
  const label = `Parity capability ${capability.id}`;
  assert(disposition, `${label} links missing issue disposition #${capability.issue}.`);
  for (const field of ["classification", "priority", "target"]) {
    assert(
      capability[field] === disposition[field],
      `${label} ${field} must match issue #${capability.issue}.`,
    );
  }
  const missingDependencies = disposition.dependsOn
    .filter((issue) => !capability.dependencies.includes(issue))
    .sort((left, right) => left - right);
  assert(
    !missingDependencies.length,
    `${label} dependencies must include issue #${capability.issue} dependencies: ${missingDependencies.join(", ")}`,
  );
}
assert(
  dispositionByIssue.get(346)?.decision.includes("#370"),
  "SearchField disposition must link the NumberField split.",
);
assert(
  dispositionByIssue.get(354)?.decision.includes("#369"),
  "MCP disposition must link the separate Agent Skill issue.",
);

const sequences = Array.isArray(matrix.sequence) ? matrix.sequence : [];
const requiredSequenceIds = [
  "manual-stable-gates",
  "shared-direction-contract",
  "primitive-parity-a",
  "primitive-parity-b",
  "multi-select-decision",
  "adoption",
  "developer-platform",
  "ecosystem",
];
for (const id of duplicates(sequences.map((sequence) => sequence.id))) {
  throw new Error(`Duplicate parity sequence id: ${id}`);
}
compareSets(
  "Parity sequence ids",
  sequences.map((sequence) => sequence.id),
  requiredSequenceIds,
);
for (const sequence of sequences) {
  assert(
    sequence.id &&
      sequence.target &&
      sequence.mayStart &&
      Array.isArray(sequence.issues) &&
      Array.isArray(sequence.dependsOn) &&
      sequence.rule,
    `Parity sequence ${sequence.id ?? "<missing>"} is incomplete.`,
  );
  const issueList = sequence.issues.map((issue) => `#${issue}`).join(",");
  const dependencyList = sequence.dependsOn.map((issue) => `#${issue}`).join(",");
  const marker = `parity-track:${sequence.id} issues:${issueList} depends-on:${dependencyList}`;
  assert(roadmap.includes(marker), `ROADMAP.md is stale for parity track ${sequence.id}.`);
}

for (const capability of capabilities) {
  const marker = `capability:${capability.id} classification:${capability.classification} priority:${capability.priority} target:${capability.target}`;
  assert(docs.includes(marker), `Human parity decision is stale for capability ${capability.id}.`);
}
for (const source of matrix.sources) {
  assert(docs.includes(source.url), `Human parity decision is missing source ${source.id}.`);
}
assert(
  docs.includes("No Core 1.0 runtime, package, Registry, token, export, or API snapshot changed"),
  "Human parity decision must state the frozen Core 1.0 boundary.",
);
assert(
  docs.includes(matrix.baseline.publicApiSnapshotSha256),
  "Human parity decision must retain the pinned baseline API snapshot hash.",
);
assert(
  roadmap.includes("docs/core-1-x-capability-parity.md"),
  "ROADMAP.md must link the parity decision.",
);

console.log(
  `Core 1.x capability parity is valid: ${capabilities.length} capabilities, ${dispositions.length} issue dispositions, ${matrix.currentBaseUiReview.reviewedPrimitives.length} reviewed Base UI ${matrix.currentBaseUiVersion} primitives.`,
);
