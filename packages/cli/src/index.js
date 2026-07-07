#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_REGISTRY =
  "https://raw.githubusercontent.com/vpavlov-me/Nerio/main/packages/registry/src/manifest.json";
const cwd = process.cwd();
const args = process.argv.slice(2);
const command = args[0];
const itemName = command === "add" ? args[1] : undefined;

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function hasFlag(name) {
  return args.includes(name);
}

function isUrl(value) {
  return /^https?:\/\//i.test(value);
}

function readConfig(required = false) {
  const configPath = path.join(cwd, "nerio.json");
  if (!fs.existsSync(configPath)) {
    if (required) {
      throw new Error("nerio.json not found. Run nerio init first.");
    }
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    throw new Error("nerio.json is not valid JSON.");
  }
}

function registryLocation(config) {
  return option("--registry") || process.env.NERIO_REGISTRY || config?.registry || DEFAULT_REGISTRY;
}

async function readText(location) {
  if (isUrl(location)) {
    const response = await fetch(location);
    if (!response.ok) {
      throw new Error(`Registry request failed (${response.status}): ${location}`);
    }
    return response.text();
  }

  return fs.readFileSync(path.resolve(cwd, location), "utf8");
}

async function readManifest(location) {
  let manifest;
  try {
    manifest = JSON.parse(await readText(location));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Registry manifest is not valid JSON: ${location}`);
    }
    throw error;
  }

  if (!manifest.schemaVersion || !Array.isArray(manifest.items)) {
    throw new Error("Registry manifest must define schemaVersion and items.");
  }
  return manifest;
}

function resolveSource(registry, source) {
  if (isUrl(registry)) {
    return new URL(source, registry).toString();
  }
  return path.resolve(path.dirname(path.resolve(cwd, registry)), source);
}

function resolveTarget(componentsRoot, target) {
  const root = path.resolve(cwd, componentsRoot);
  const resolved = path.resolve(root, target);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Registry target escapes the components directory: ${target}`);
  }
  return resolved;
}

function collectItems(manifest, name, collected = new Map()) {
  const item = manifest.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Unknown registry item: ${name}`);
  }
  if (collected.has(name)) return collected;

  collected.set(name, item);
  for (const dependency of item.registryDependencies || []) {
    collectItems(manifest, dependency, collected);
  }
  return collected;
}

async function init() {
  const target = path.join(cwd, "nerio.json");
  if (fs.existsSync(target)) {
    throw new Error("nerio.json already exists.");
  }

  const config = {
    schemaVersion: "0.1.0",
    registry: option("--registry") || DEFAULT_REGISTRY,
    components: option("--components") || "components/nerio",
  };
  fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
  console.log("Created nerio.json");
}

async function add(name) {
  if (!name || name.startsWith("--")) {
    throw new Error("Usage: nerio add <component> [--registry <path-or-url>] [--overwrite]");
  }

  const config = readConfig(true);
  if (!config.components || typeof config.components !== "string") {
    throw new Error("nerio.json must define a components directory.");
  }

  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const items = collectItems(manifest, name);
  const written = [];
  const skipped = [];

  for (const item of items.values()) {
    for (const file of item.files) {
      const source = resolveSource(registry, file.source);
      const target = resolveTarget(config.components, file.target);
      const content = await readText(source);
      fs.mkdirSync(path.dirname(target), { recursive: true });

      if (fs.existsSync(target) && !hasFlag("--overwrite")) {
        if (fs.readFileSync(target, "utf8") === content) {
          skipped.push(path.relative(cwd, target));
          continue;
        }
        throw new Error(
          `${path.relative(cwd, target)} already exists. Re-run with --overwrite to replace it.`,
        );
      }

      fs.writeFileSync(target, content);
      written.push(path.relative(cwd, target));
    }
  }

  const item = items.get(name);
  console.log(`Added ${item.title}: ${written.length} files written, ${skipped.length} unchanged.`);
  if (item.dependencies?.length) {
    console.log(`Package dependencies: ${item.dependencies.join(", ")}`);
  }
}

async function doctor() {
  const config = readConfig(true);
  if (!config.schemaVersion || !config.registry || !config.components) {
    throw new Error("nerio.json must define schemaVersion, registry, and components.");
  }

  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  for (const item of manifest.items) {
    if (!item.name || !item.title || !Array.isArray(item.files)) {
      throw new Error("Every registry item must define name, title, and files.");
    }
    for (const file of item.files) {
      if (!file.source || !file.target || !file.role) {
        throw new Error(`Registry item ${item.name} contains an invalid file entry.`);
      }
      resolveTarget(config.components, file.target);
    }
  }

  console.log(
    `Nerio configuration is valid. Registry ${manifest.name || "local"} exposes ${manifest.items.length} component(s).`,
  );
}

async function main() {
  if (command === "init") await init();
  else if (command === "add") await add(itemName);
  else if (command === "doctor") await doctor();
  else {
    console.log("Usage: nerio <init|add|doctor>");
    process.exitCode = command ? 1 : 0;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
