import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const packageDirectories = ["tokens", "adapters", "registry", "ui", "cli", "mcp"];

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--candidate", "--output"].includes(name) || !value) {
      throw new Error("Usage: generate-sbom.mjs --candidate <sha> [--output <path>]");
    }
    options[name.slice(2)] = value;
  }
  if (!/^[0-9a-f]{40}$/.test(options.candidate ?? "")) {
    throw new Error("--candidate must be an exact lowercase 40-character SHA.");
  }
  return options;
}

function normalizedVersion(name, range, manifests) {
  if (!range.startsWith("workspace:")) return range;
  return manifests.find((manifest) => manifest.name === name)?.version ?? range;
}

function resolvedVersion(name, range, manifests, packageDirectory, base) {
  const workspaceVersion = normalizedVersion(name, range, manifests);
  if (workspaceVersion !== range) return workspaceVersion;
  const installedManifest = resolve(
    base,
    "packages",
    packageDirectory,
    "node_modules",
    ...name.split("/"),
    "package.json",
  );
  return JSON.parse(readFileSync(installedManifest, "utf8")).version;
}

export function createSbom(candidateSha, base = root) {
  const manifests = packageDirectories.map((directory) =>
    JSON.parse(readFileSync(resolve(base, "packages", directory, "package.json"), "utf8")),
  );
  const componentByName = new Map();
  for (const manifest of manifests) {
    componentByName.set(manifest.name, {
      type: "library",
      "bom-ref": `pkg:npm/${encodeURIComponent(manifest.name)}@${manifest.version}`,
      name: manifest.name,
      version: manifest.version,
      purl: `pkg:npm/${encodeURIComponent(manifest.name)}@${manifest.version}`,
      properties: [{ name: "nerio:candidate_sha", value: candidateSha }],
    });
  }

  for (const [manifestIndex, manifest] of manifests.entries()) {
    const packageDirectory = packageDirectories[manifestIndex];
    for (const [dependencyKind, entries] of [
      ["runtime", manifest.dependencies ?? {}],
      ["peer", manifest.peerDependencies ?? {}],
      ["optional", manifest.optionalDependencies ?? {}],
    ]) {
      for (const [name, range] of Object.entries(entries)) {
        if (componentByName.has(name)) continue;
        const version = resolvedVersion(name, range, manifests, packageDirectory, base);
        componentByName.set(name, {
          type: "library",
          "bom-ref": `pkg:npm/${encodeURIComponent(name)}@${encodeURIComponent(version)}`,
          name,
          version,
          purl: `pkg:npm/${encodeURIComponent(name)}@${encodeURIComponent(version)}`,
          scope: dependencyKind === "runtime" ? "required" : "optional",
          properties: [
            { name: "nerio:declared_range", value: range },
            { name: "nerio:dependency_kind", value: dependencyKind },
          ],
        });
      }
    }
  }

  const dependencies = manifests.map((manifest) => {
    const names = [
      ...Object.keys(manifest.dependencies ?? {}),
      ...Object.keys(manifest.peerDependencies ?? {}),
      ...Object.keys(manifest.optionalDependencies ?? {}),
    ];
    return {
      ref: componentByName.get(manifest.name)["bom-ref"],
      dependsOn: [...new Set(names)].sort().map((name) => componentByName.get(name)["bom-ref"]),
    };
  });
  const serialSeed = createHash("sha256").update(`nerio-sbom:${candidateSha}`).digest("hex");
  const serial = [
    serialSeed.slice(0, 8),
    serialSeed.slice(8, 12),
    `4${serialSeed.slice(13, 16)}`,
    `8${serialSeed.slice(17, 20)}`,
    serialSeed.slice(20, 32),
  ].join("-");

  return {
    bomFormat: "CycloneDX",
    specVersion: "1.5",
    serialNumber: `urn:uuid:${serial}`,
    version: 1,
    metadata: {
      tools: {
        components: [
          { type: "application", name: "Nerio deterministic SBOM generator", version: "1" },
        ],
      },
      properties: [{ name: "nerio:candidate_sha", value: candidateSha }],
    },
    components: [...componentByName.values()].sort((left, right) =>
      left["bom-ref"].localeCompare(right["bom-ref"]),
    ),
    dependencies: dependencies.sort((left, right) => left.ref.localeCompare(right.ref)),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = parseArgs(process.argv.slice(2));
  const output = resolve(
    options.output ?? resolve(root, "artifacts", "sbom", `nerio-${options.candidate}.cdx.json`),
  );
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(createSbom(options.candidate), null, 2)}\n`);
  console.log(output);
}
