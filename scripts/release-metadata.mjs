import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const metadataPath = resolve(root, "quality/release-metadata.json");
const packagePaths = {
  "@nerio-ui/tokens": "packages/tokens/package.json",
  "@nerio-ui/adapters": "packages/adapters/package.json",
  "@nerio-ui/ui": "packages/ui/package.json",
  "@nerio-ui/registry": "packages/registry/package.json",
  "@nerio-ui/cli": "packages/cli/package.json",
  "@nerio-ui/mcp": "packages/mcp/package.json",
};
const packageReadmePaths = Object.values(packagePaths).map((path) =>
  path.replace(/package\.json$/, "README.md"),
);
const activeVersionSurfaces = [
  "README.md",
  "apps/docs/app/docs/getting-started/page.tsx",
  "apps/docs/app/docs/foundations/motion/page.tsx",
  "apps/docs/content/llms.txt",
  ...packageReadmePaths,
  "packages/registry/src/public-commands.json",
  "packages/cli/src/index.js",
  "packages/cli/fixtures/basic/README.md",
];

function read(path) {
  return readFileSync(resolve(root, path), "utf8");
}

function readJson(path) {
  return JSON.parse(read(path));
}

function formattedJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateVersion(value, label) {
  assert(
    /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value),
    `${label} must be an exact SemVer version.`,
  );
}

export function releaseSemanticsForVersion(version) {
  validateVersion(version, "prepared version");
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(alpha|beta)\.(0|[1-9]\d*))?$/.exec(
    version,
  );
  assert(
    match,
    "Prepared version must be stable SemVer or use an alpha.<number> or beta.<number> prerelease.",
  );

  const [, major, minor, patch, prereleaseChannel, prereleaseNumber] = match;
  const channel = prereleaseChannel ?? "stable";
  const stableLabel = patch === "0" ? `${major}.${minor}` : `${major}.${minor}.${patch}`;

  return {
    channel,
    migrationTarget: version,
    protectedDistTags: ["alpha", "beta"].filter((tag) => tag !== channel),
    docsStatusLabel:
      channel === "stable"
        ? `Prepared stable ${stableLabel} candidate`
        : `Prepared ${channel}.${prereleaseNumber} candidate`,
  };
}

export function replaceExactVersion(source, currentVersion, nextVersion) {
  const exactVersion = exactVersionPattern(currentVersion, "g");
  return source.replace(exactVersion, (_match, prefix) => `${prefix}${nextVersion}`);
}

function exactVersionPattern(version, flags = "") {
  const escapedVersion = version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![0-9A-Za-z.-])(v?)${escapedVersion}(?![0-9A-Za-z.-])`, flags);
}

export function containsExactVersion(source, version) {
  return exactVersionPattern(version).test(source);
}

export function replaceCliPackageVersions(source, currentVersion, nextVersion) {
  return source
    .replaceAll(`@nerio-ui/registry@${currentVersion}`, `@nerio-ui/registry@${nextVersion}`)
    .replaceAll(`@nerio-ui/cli@${currentVersion}`, `@nerio-ui/cli@${nextVersion}`);
}

export function assertCoordinatedReleaseSemantics(metadata) {
  const expected = releaseSemanticsForVersion(metadata.coreVersion);
  const publishedStatusLabel = expected.docsStatusLabel
    .replace(/^Prepared /, "Published ")
    .replace(/ candidate$/, "");
  assert(
    metadata.channel === expected.channel,
    `channel must match the ${expected.channel} channel derived from coreVersion.`,
  );
  assert(
    metadata.registryVersion === metadata.coreVersion,
    "registryVersion must match the coordinated coreVersion.",
  );
  assert(
    metadata.migrationTarget === expected.migrationTarget,
    "migrationTarget must match the coordinated coreVersion.",
  );
  assert(
    JSON.stringify(metadata.protectedDistTags) === JSON.stringify(expected.protectedDistTags),
    "Protected dist-tags must match the release channel semantics.",
  );
  assert(
    [expected.docsStatusLabel, publishedStatusLabel].includes(metadata.docsStatusLabel),
    "docsStatusLabel must identify the prepared candidate or published release for coreVersion.",
  );
}

export function assertDependencyAwarePackageOrder(packages, manifests) {
  const packageOrder = new Map(packages.map((name, index) => [name, index]));
  for (const manifest of manifests) {
    for (const dependency of Object.keys(manifest.dependencies ?? {})) {
      if (!packageOrder.has(dependency)) continue;
      assert(
        packageOrder.get(dependency) < packageOrder.get(manifest.name),
        `${dependency} must precede dependent package ${manifest.name} in publication order.`,
      );
    }
  }
}

export function validateReleaseMetadata() {
  const metadata = readJson("quality/release-metadata.json");
  validateVersion(metadata.coreVersion, "coreVersion");
  validateVersion(metadata.registryVersion, "registryVersion");
  validateVersion(metadata.publicInstallationVersion, "publicInstallationVersion");
  validateVersion(metadata.migrationTarget, "migrationTarget");
  assert(
    ["alpha", "beta", "stable"].includes(metadata.channel),
    "channel must be alpha, beta, or stable.",
  );
  assert(metadata.defaultDistTag === "latest", "defaultDistTag must be latest.");
  assertCoordinatedReleaseSemantics(metadata);
  assert(
    metadata.registrySourceRevision === `v${metadata.registryVersion}`,
    "Registry source revision must be the immutable v-prefixed Registry version.",
  );
  assert(
    JSON.stringify(metadata.packages) === JSON.stringify(Object.keys(packagePaths)),
    "Release metadata must list the six public packages in dependency-aware order.",
  );
  assert(
    new Set(metadata.protectedDistTags).size === metadata.protectedDistTags.length &&
      metadata.protectedDistTags.every((tag) => tag !== metadata.channel),
    "Protected dist-tags must be unique and exclude the active channel.",
  );
  assert(
    !metadata.protectedDistTags.includes(metadata.defaultDistTag),
    "The default dist-tag must move with the newest coordinated publication.",
  );

  const manifests = [];
  for (const [name, path] of Object.entries(packagePaths)) {
    const manifest = readJson(path);
    manifests.push(manifest);
    assert(manifest.name === name, `${path} has an unexpected package name.`);
    assert(
      manifest.version === metadata.coreVersion,
      `${name} must use coordinated version ${metadata.coreVersion}.`,
    );
  }
  assertDependencyAwarePackageOrder(metadata.packages, manifests);

  const registry = readJson("packages/registry/src/manifest.json");
  assert(
    registry.version === metadata.registryVersion,
    "Registry version must match release metadata.",
  );
  assert(
    registry.sourceRevision === metadata.registrySourceRevision,
    "Registry source revision must match release metadata.",
  );
  assert(
    metadata.publicInstallationVersion === metadata.coreVersion,
    "Public installation version must match the coordinated Core version.",
  );

  for (const path of activeVersionSurfaces) {
    assert(
      containsExactVersion(read(path), metadata.publicInstallationVersion),
      `${path} must include the current public installation version.`,
    );
  }

  return metadata;
}

function replacementPlan(nextVersion) {
  const releaseSemantics = releaseSemanticsForVersion(nextVersion);
  const metadata = validateReleaseMetadata();
  assert(
    nextVersion !== metadata.coreVersion,
    "Prepared version must differ from the current version.",
  );
  const next = structuredClone(metadata);
  next.coreVersion = nextVersion;
  next.registryVersion = nextVersion;
  next.registrySourceRevision = `v${nextVersion}`;
  next.publicInstallationVersion = nextVersion;
  Object.assign(next, releaseSemantics);

  const replacements = new Map([[metadataPath, formattedJson(next)]]);
  for (const path of Object.values(packagePaths)) {
    const absolute = resolve(root, path);
    const manifest = JSON.parse(readFileSync(absolute, "utf8"));
    manifest.version = nextVersion;
    replacements.set(absolute, formattedJson(manifest));
  }

  const registryPath = resolve(root, "packages/registry/src/manifest.json");
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  registry.version = nextVersion;
  registry.sourceRevision = `v${nextVersion}`;
  replacements.set(registryPath, formattedJson(registry));

  for (const path of activeVersionSurfaces) {
    const absolute = resolve(root, path);
    const source = readFileSync(absolute, "utf8");
    replacements.set(
      absolute,
      path === "packages/cli/src/index.js"
        ? replaceCliPackageVersions(source, metadata.coreVersion, nextVersion)
        : replaceExactVersion(source, metadata.coreVersion, nextVersion),
    );
  }
  return replacements;
}

function printPlan(replacements) {
  const changes = [...replacements]
    .filter(([path, content]) => readFileSync(path, "utf8") !== content)
    .map(([path, content]) => {
      const before = readFileSync(path, "utf8");
      return {
        path: path.slice(root.length + 1),
        beforeSha256: createHash("sha256").update(before).digest("hex"),
        afterSha256: createHash("sha256").update(content).digest("hex"),
      };
    });
  console.log(JSON.stringify({ dryRun: true, changes }, null, 2));
  return changes;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command, version, writeFlag] = process.argv.slice(2);
  if (!command || command === "validate") {
    const metadata = validateReleaseMetadata();
    console.log(`Release metadata is aligned for ${metadata.coreVersion} (${metadata.channel}).`);
  } else if (command === "prepare" && version) {
    const replacements = replacementPlan(version);
    const changes = printPlan(replacements);
    if (writeFlag === "--write") {
      for (const [path, content] of replacements) writeFileSync(path, content);
      console.log(
        `Applied ${changes.length} coordinated version update(s) after the dry-run diff.`,
      );
    } else if (writeFlag) {
      throw new Error("Usage: release-metadata.mjs prepare <version> [--write]");
    }
  } else {
    throw new Error("Usage: release-metadata.mjs [validate | prepare <version> [--write]]");
  }
}
