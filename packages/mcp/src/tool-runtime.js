const fs = require("node:fs");
const path = require("node:path");

const manifest = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../registry/src/manifest.json"), "utf8"),
);

function findComponent(name) {
  const item = manifest.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Component not found: ${name}`);
  }
  return item;
}

function list_components() {
  return manifest.items.map(({ name, title, description, category }) => ({
    name,
    title,
    description,
    category,
  }));
}

function get_component(name) {
  return findComponent(name);
}

function get_component_usage(name) {
  const item = findComponent(name);
  return {
    name: item.name,
    title: item.title,
    description: item.description,
    category: item.category,
    usage: item.usage,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files,
    baseUiPrimitives: item.baseUiPrimitives,
    slots: item.slots,
    variants: item.variants,
    requiredTokens: item.requiredTokens,
    accessibility: item.accessibility,
  };
}

module.exports = { get_component, get_component_usage, list_components };
