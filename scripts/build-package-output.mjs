import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageName = process.argv[2];
const supportedPackages = new Set(["tokens", "ui", "adapters", "registry"]);

if (!supportedPackages.has(packageName)) {
  throw new Error(
    `Usage: node scripts/build-package-output.mjs <${[...supportedPackages].join("|")}>`,
  );
}

const packageDirectory = resolve(root, "packages", packageName);
const outputDirectory = resolve(packageDirectory, "dist");
const tsc = resolve(root, "node_modules", "typescript", "bin", "tsc");

rmSync(outputDirectory, { recursive: true, force: true });
execFileSync(
  process.execPath,
  [tsc, "--project", resolve(packageDirectory, "tsconfig.build.json")],
  {
    cwd: root,
    stdio: "inherit",
  },
);

function copy(relativeSource, relativeDestination = relativeSource) {
  const source = resolve(packageDirectory, "src", relativeSource);
  const destination = resolve(outputDirectory, relativeDestination);
  mkdirSync(dirname(destination), { recursive: true });
  cpSync(source, destination, { recursive: true });
}

function sha256(content) {
  return `sha256-${createHash("sha256").update(content).digest("hex")}`;
}

function makeEsmSpecifiersNodeResolvable() {
  const relativeSpecifier = /(\b(?:from|import)\s*(?:\(\s*)?)(["'])(\.\.?\/[^"']+)\2/g;
  const outputFiles = readdirSync(outputDirectory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && /(?:\.js|\.d\.ts)$/.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name));

  for (const outputFile of outputFiles) {
    const content = readFileSync(outputFile, "utf8");
    const rewritten = content.replace(relativeSpecifier, (match, prefix, quote, specifier) =>
      extname(specifier) ? match : `${prefix}${quote}${specifier}.js${quote}`,
    );
    if (rewritten !== content) writeFileSync(outputFile, rewritten);
  }
}

function prepareRegistry() {
  const sourceDirectory = resolve(packageDirectory, "src");
  const manifestPath = resolve(sourceDirectory, "manifest.json");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const copiedSources = new Map();

  for (const item of manifest.items) {
    for (const file of item.files) {
      const source = resolve(sourceDirectory, file.source);
      if (source !== root && !source.startsWith(`${root}${sep}`)) {
        throw new Error(`Registry source escapes the repository: ${file.source}`);
      }
      const content = readFileSync(source);
      if (sha256(content) !== file.integrity) {
        throw new Error(`Registry integrity mismatch for ${item.name}:${file.target}.`);
      }

      const repositoryRelative = relative(root, source).split(sep).join("/");
      const destinationRelative = `source/${repositoryRelative}`;
      const previousSource = copiedSources.get(destinationRelative);
      if (previousSource && previousSource !== source) {
        throw new Error(`Registry sources collide at ${destinationRelative}.`);
      }
      copiedSources.set(destinationRelative, source);
      file.source = `./${destinationRelative}`;
    }
  }

  for (const [destinationRelative, source] of [...copiedSources].sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const destination = resolve(outputDirectory, destinationRelative);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination);
  }

  writeFileSync(
    resolve(outputDirectory, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  copy("public-commands.json");
}

if (packageName === "tokens") {
  copy("styles.css");
  copy("tailwind.css");
} else if (packageName === "ui") {
  copy("styles.css");
  copy("styles");
} else if (packageName === "registry") {
  prepareRegistry();
}

if (packageName !== "registry") makeEsmSpecifiersNodeResolvable();

console.log(`Built deterministic @nerio-ui/${packageName} output in packages/${packageName}/dist.`);
