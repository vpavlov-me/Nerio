import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { npmPurl, packageDirectories } from "./generate-sbom.mjs";

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--candidate", "--input"].includes(name) || !value) {
      throw new Error("Usage: validate-sbom.mjs --candidate <sha> --input <path>");
    }
    options[name.slice(2)] = value;
  }
  if (!/^[0-9a-f]{40}$/.test(options.candidate ?? "") || !options.input) {
    throw new Error("Usage: validate-sbom.mjs --candidate <sha> --input <path>");
  }
  return options;
}

export function sbomFailures(sbom, candidateSha) {
  const failures = [];
  if (sbom.bomFormat !== "CycloneDX" || sbom.specVersion !== "1.5") {
    failures.push("SBOM must use CycloneDX 1.5.");
  }
  const metadataCandidate = sbom.metadata?.properties?.find(
    ({ name }) => name === "nerio:candidate_sha",
  )?.value;
  if (metadataCandidate !== candidateSha) {
    failures.push("SBOM metadata must match the exact candidate SHA.");
  }
  const components = Array.isArray(sbom.components) ? sbom.components : [];
  for (const component of components) {
    if (
      typeof component.version !== "string" ||
      !component.version ||
      /^(?:workspace:|[~^<>=*])/.test(component.version)
    ) {
      failures.push(`SBOM component ${component.name ?? "unknown"} must use a resolved version.`);
    }
    if (
      typeof component.name === "string" &&
      typeof component.version === "string" &&
      (component.purl !== npmPurl(component.name, component.version) ||
        component["bom-ref"] !== component.purl)
    ) {
      failures.push(`SBOM component ${component.name} must use its canonical npm purl as bom-ref.`);
    }
  }
  for (const directory of packageDirectories) {
    const manifest = JSON.parse(
      readFileSync(resolve("packages", directory, "package.json"), "utf8"),
    );
    const component = components.find(({ name }) => name === manifest.name);
    if (!component) {
      failures.push(`SBOM is missing ${manifest.name}.`);
      continue;
    }
    if (component.version !== manifest.version) {
      failures.push(`SBOM version for ${manifest.name} must match its manifest.`);
    }
    const componentCandidate = component.properties?.find(
      ({ name }) => name === "nerio:candidate_sha",
    )?.value;
    if (componentCandidate !== candidateSha) {
      failures.push(`SBOM component ${manifest.name} must be tied to the candidate SHA.`);
    }
  }
  const refs = new Set(components.map((component) => component["bom-ref"]));
  for (const dependency of sbom.dependencies ?? []) {
    if (!refs.has(dependency.ref)) failures.push(`Unknown dependency ref ${dependency.ref}.`);
    for (const ref of dependency.dependsOn ?? []) {
      if (!refs.has(ref)) failures.push(`Unknown dependsOn ref ${ref}.`);
    }
  }
  return failures;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = parseArgs(process.argv.slice(2));
  const sbom = JSON.parse(readFileSync(resolve(options.input), "utf8"));
  const failures = sbomFailures(sbom, options.candidate);
  if (failures.length) {
    for (const failure of failures) console.error(failure);
    process.exitCode = 1;
  } else {
    console.log(`CycloneDX SBOM covers all six public packages at ${options.candidate}.`);
  }
}
