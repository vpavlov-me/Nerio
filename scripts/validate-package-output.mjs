import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageNames = ["tokens", "adapters", "ui", "registry"];

function filesUnder(directory) {
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .sort((left, right) => left.localeCompare(right));
}

function sha256(content) {
  return createHash("sha256").update(content).digest("hex");
}

function buildAll() {
  for (const packageName of packageNames) {
    execFileSync(process.execPath, [join(root, "scripts/build-package-output.mjs"), packageName], {
      cwd: root,
      stdio: "pipe",
    });
  }
}

function outputFingerprint() {
  return Object.fromEntries(
    packageNames.map((packageName) => {
      const directory = join(root, "packages", packageName, "dist");
      return [
        packageName,
        filesUnder(directory).map((path) => [
          relative(directory, path).split(sep).join("/"),
          sha256(readFileSync(path)),
        ]),
      ];
    }),
  );
}

function exportTargets(exports) {
  return Object.values(exports).flatMap((entry) =>
    typeof entry === "string" ? [entry] : Object.values(entry),
  );
}

function validateContents() {
  for (const packageName of packageNames) {
    const packageDirectory = join(root, "packages", packageName);
    const packageJson = JSON.parse(readFileSync(join(packageDirectory, "package.json"), "utf8"));
    const outputDirectory = join(packageDirectory, "dist");
    const files = filesUnder(outputDirectory);

    for (const target of exportTargets(packageJson.exports)) {
      if (!files.includes(resolve(packageDirectory, target))) {
        throw new Error(`@nerio-ui/${packageName} export target is missing: ${target}`);
      }
    }
    if (files.some((path) => path.endsWith(".map"))) {
      throw new Error(
        `@nerio-ui/${packageName} output must not include source or declaration maps.`,
      );
    }
    if (
      packageName !== "registry" &&
      files.some((path) => /\.(?:ts|tsx)$/.test(path) && !path.endsWith(".d.ts"))
    ) {
      throw new Error(
        `@nerio-ui/${packageName} runtime output must not include TypeScript source.`,
      );
    }
    if (packageName !== "registry") {
      const relativeSpecifier = /(\b(?:from|import)\s*(?:\(\s*)?)(["'])(\.\.?\/[^"']+)\2/g;
      for (const path of files.filter((file) => /(?:\.js|\.d\.ts)$/.test(file))) {
        const content = readFileSync(path, "utf8");
        for (const match of content.matchAll(relativeSpecifier)) {
          if (!extname(match[3])) {
            throw new Error(
              `@nerio-ui/${packageName} output has a non-Node-resolvable ESM specifier: ${relative(outputDirectory, path)}:${match[3]}`,
            );
          }
        }
      }
    }
  }

  const registryDirectory = join(root, "packages/registry/dist");
  const manifest = JSON.parse(readFileSync(join(registryDirectory, "manifest.json"), "utf8"));
  for (const item of manifest.items) {
    for (const file of item.files) {
      if (!file.source.startsWith("./source/packages/")) {
        throw new Error(`Registry source is not self-contained: ${item.name}:${file.target}`);
      }
      const content = readFileSync(resolve(registryDirectory, file.source));
      if (`sha256-${sha256(content)}` !== file.integrity) {
        throw new Error(`Registry output integrity mismatch: ${item.name}:${file.target}`);
      }
    }
  }
}

function validateNodeImports() {
  const entrypoints = [
    "packages/tokens/dist/index.js",
    "packages/adapters/dist/icons.js",
    "packages/ui/dist/index.js",
    "packages/ui/dist/client.js",
  ].map((entrypoint) => pathToFileURL(join(root, entrypoint)).href);
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `await Promise.all(${JSON.stringify(entrypoints)}.map((entrypoint) => import(entrypoint)));`,
    ],
    { cwd: root, stdio: "pipe" },
  );
}

buildAll();
validateContents();
validateNodeImports();
const first = outputFingerprint();
buildAll();
validateContents();
validateNodeImports();
const second = outputFingerprint();

if (JSON.stringify(first) !== JSON.stringify(second)) {
  throw new Error("Public package output changed between identical consecutive builds.");
}

console.log(
  "Public package output is deterministic, Node-resolvable, export-complete, map-free, and self-contained.",
);
