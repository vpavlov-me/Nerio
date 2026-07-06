#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const repoRoot = path.resolve(__dirname, "../../..");
const command = process.argv[2];
const itemName = process.argv[3];

function readManifest() {
  const manifestPath = process.env.NERIO_REGISTRY_PATH
    ? path.resolve(process.env.NERIO_REGISTRY_PATH)
    : path.join(repoRoot, "packages/registry/src/manifest.json");
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function init() {
  const target = path.join(root, "nerio.json");
  if (!fs.existsSync(target)) {
    fs.writeFileSync(
      target,
      `${JSON.stringify({ schemaVersion: "0.1.0", registry: "./registry/manifest.json", components: "components/nerio" }, null, 2)}\n`,
    );
  }
  console.log("Created nerio.json");
}

function add(name) {
  if (!name) {
    throw new Error("Usage: nerio add <component>");
  }
  const manifest = readManifest();
  const item = manifest.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Unknown registry item: ${name}`);
  }
  for (const file of item.files) {
    const source = path.join(repoRoot, file.source);
    const target = path.join(root, file.target);
    ensureDir(target);
    fs.copyFileSync(source, target);
  }
  console.log(`Added ${item.name}`);
}

function doctor() {
  const configPath = path.join(root, "nerio.json");
  if (!fs.existsSync(configPath)) {
    throw new Error("nerio.json not found. Run nerio init first.");
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  if (!config.components) {
    throw new Error("nerio.json must define a components directory.");
  }
  console.log("Nerio configuration looks valid");
}

try {
  if (command === "init") init();
  else if (command === "add") add(itemName);
  else if (command === "doctor") doctor();
  else {
    console.log("Usage: nerio <init|add|doctor>");
    process.exit(command ? 1 : 0);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
