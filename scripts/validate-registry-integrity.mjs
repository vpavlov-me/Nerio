import { createHash } from "node:crypto";
import { readFileSync, realpathSync, statSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function option(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

const manifestPath = resolve(root, option("--manifest") || "packages/registry/src/manifest.json");
const sourceBoundary = realpathSync(resolve(root, option("--source-root") || "."));
const manifestDirectory = dirname(manifestPath);
const write = process.argv.includes("--write");
const pattern = /^sha256-[a-f0-9]{64}$/;
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const failures = [];

function within(directory, candidate) {
  const path = relative(directory, candidate);
  return path === "" || (!path.startsWith(`..${sep}`) && path !== ".." && !isAbsolute(path));
}

for (const item of manifest.items) {
  const targets = new Set();
  for (const file of item.files) {
    if (targets.has(file.target)) {
      failures.push(`${item.name}:${file.target} is duplicated within one Registry item`);
      continue;
    }
    targets.add(file.target);
    const sourcePath = resolve(manifestDirectory, file.source);
    let canonicalSource;
    try {
      canonicalSource = realpathSync(sourcePath);
    } catch {
      failures.push(`${item.name}:${file.target} source is missing: ${file.source}`);
      continue;
    }
    if (!within(sourceBoundary, canonicalSource) || !statSync(canonicalSource).isFile()) {
      failures.push(
        `${item.name}:${file.target} source must be a regular file inside the source root`,
      );
      continue;
    }
    const expected = `sha256-${createHash("sha256")
      .update(readFileSync(canonicalSource))
      .digest("hex")}`;
    if (write) {
      file.integrity = expected;
    } else if (!pattern.test(file.integrity || "") || file.integrity !== expected) {
      failures.push(
        `${item.name}:${file.target} integrity is ${file.integrity || "missing"}; expected ${expected}`,
      );
    }
  }
}

if (failures.length) {
  throw new Error(`Registry integrity validation failed:\n- ${failures.join("\n- ")}`);
} else if (write) {
  manifest.schemaVersion = "1.1.0";
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Updated Registry SHA-256 integrity for ${manifest.items.length} items.`);
} else {
  console.log(`Registry integrity is valid for ${manifest.items.length} items.`);
}
