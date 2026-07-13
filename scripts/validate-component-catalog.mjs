import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function option(name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : resolve(args[index + 1]);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Could not parse ${file}: ${error.message}`);
  }
}

function slugify(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function duplicates(values) {
  const seen = new Set();
  const duplicateValues = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicateValues.add(value);
    seen.add(value);
  }
  return [...duplicateValues].sort();
}

function parseMatrix(source) {
  const rows = [];
  let tier;
  let isComponentTable = false;

  for (const line of source.split("\n")) {
    if (line.startsWith("## ")) {
      isComponentTable = false;
      if (line === "## Core components") tier = "core";
      if (line === "## Pro components") tier = "pro";
      if (line !== "## Core components" && line !== "## Pro components") tier = undefined;
      continue;
    }
    if (line.startsWith("### ")) {
      isComponentTable = false;
      continue;
    }
    if (!line.startsWith("|")) continue;

    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim().replace(/`/g, ""));
    if (cells.length < 3 || /^-+$/.test(cells[0])) continue;

    if (cells[0] === "Component" || cells[0] === "Component / Area" || cells[0] === "Template") {
      isComponentTable = cells[1] === "Status" && cells[2] === "Package";
      continue;
    }
    if (isComponentTable && tier) {
      rows.push({ name: cells[0], status: cells[1], package: cells[2], tier });
    }
  }

  return rows;
}

function extractSlugs(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

const catalogPath = option("--catalog", resolve(root, "data/component-catalog.json"));
const manifestPath = option("--manifest", resolve(root, "packages/registry/src/manifest.json"));
const componentsPath = option("--components", resolve(root, "COMPONENTS.md"));
const docsChromePath = option(
  "--docs-chrome",
  resolve(root, "apps/docs/components/docs-chrome.tsx"),
);
const componentDocsPath = option(
  "--component-docs",
  resolve(root, "apps/docs/lib/component-docs.ts"),
);

for (const file of [catalogPath, manifestPath, componentsPath, docsChromePath, componentDocsPath]) {
  if (!existsSync(file)) throw new Error(`Required catalog projection is missing: ${file}`);
}

const catalog = readJson(catalogPath);
const manifest = readJson(manifestPath);
const matrixRows = parseMatrix(readFileSync(componentsPath, "utf8"));
const docsChrome = readFileSync(docsChromePath, "utf8");
const componentDocs = readFileSync(componentDocsPath, "utf8");
const failures = [];
const components = Array.isArray(catalog.components) ? catalog.components : [];
const catalogNames = components.map((component) => component.name);
const catalogSlugs = components.map((component) => slugify(component.name));
const allowedTiers = new Set(Object.keys(catalog.tiers ?? {}));
const allowedStatuses = new Set(Object.keys(catalog.statusValues ?? {}));
const allowedCategories = new Set(catalog.categoryValues ?? []);
const allowedPackages = new Set(catalog.packageValues ?? []);
const clientOnlyCatalogSlugs = new Set([
  "button",
  "button-group",
  "icon-button",
  "checkbox",
  "radio-group",
  "switch",
  "select",
  "tabs",
  "tooltip",
  "dialog",
  "popover",
  "dropdown-menu",
  "toast",
]);

if (!components.length) failures.push("Catalog must define a non-empty components array.");
if (!allowedCategories.size) failures.push("Catalog must define categoryValues.");
if (!allowedPackages.size) failures.push("Catalog must define packageValues.");

for (const name of duplicates(catalogNames))
  failures.push(`Duplicate catalog component name: ${name}`);
for (const slug of duplicates(catalogSlugs))
  failures.push(`Duplicate catalog component slug: ${slug}`);

for (const component of components) {
  const label = `Catalog component ${component.name || "<missing name>"}`;
  if (!component.name || !slugify(component.name)) failures.push(`${label} has an invalid name.`);
  if (!allowedTiers.has(component.tier))
    failures.push(`${label} has invalid tier: ${component.tier}`);
  if (!allowedCategories.has(component.category)) {
    failures.push(`${label} has invalid category: ${component.category}`);
  }
  if (!allowedPackages.has(component.package)) {
    failures.push(`${label} has invalid package: ${component.package}`);
  }
  if (!allowedStatuses.has(component.status)) {
    failures.push(`${label} has invalid status: ${component.status}`);
  }
  if (
    clientOnlyCatalogSlugs.has(slugify(component.name)) &&
    component.package !== "@nerio/ui/client"
  ) {
    failures.push(`${label} must use the @nerio/ui/client entrypoint.`);
  }
  if (component.deprecated) {
    const replacement = slugify(component.replacement ?? "");
    if (!replacement || !catalogSlugs.includes(replacement)) {
      failures.push(
        `${label} is deprecated but has no valid replacement: ${component.replacement ?? "<missing>"}`,
      );
    }
  }
}

const catalogBySlug = new Map(components.map((component) => [slugify(component.name), component]));
const registryItems = Array.isArray(manifest.items) ? manifest.items : [];
const registryNames = registryItems.map((item) => item.name);
for (const name of duplicates(registryNames))
  failures.push(`Duplicate registry component name: ${name}`);

for (const item of registryItems) {
  const component = catalogBySlug.get(item.name);
  if (!component) {
    failures.push(`Registry component has no catalog entry: ${item.name}`);
    continue;
  }
  if (slugify(item.title ?? "") !== item.name) {
    failures.push(`Registry component ${item.name} title does not match its catalog identity.`);
  }
  if (item.category !== component.category) {
    failures.push(
      `Registry component ${item.name} category differs from catalog: ${item.category} !== ${component.category}`,
    );
  }
  if (Boolean(item.deprecated) !== Boolean(component.deprecated)) {
    failures.push(`Registry component ${item.name} deprecated flag differs from catalog.`);
  }
  if (item.deprecated && item.replacement !== slugify(component.replacement ?? "")) {
    failures.push(`Registry component ${item.name} replacement differs from catalog.`);
  }
}

const registrySlugs = new Set(registryNames);
for (const component of components) {
  const slug = slugify(component.name);
  const isInstallableCore =
    component.tier === "core" &&
    component.category !== "foundation" &&
    !["planned", "future"].includes(component.status);
  if (isInstallableCore && !registrySlugs.has(slug)) {
    failures.push(
      `Implemented installable Core component has no registry item: ${component.name} (${slug})`,
    );
  }
}

const matrixBySlug = new Map(matrixRows.map((row) => [slugify(row.name), row]));
for (const component of components) {
  const row = matrixBySlug.get(slugify(component.name));
  if (!row) {
    failures.push(`COMPONENTS.md is missing catalog component: ${component.name}`);
    continue;
  }
  if (row.tier !== component.tier) {
    failures.push(
      `COMPONENTS.md tier differs for ${component.name}: ${row.tier} !== ${component.tier}`,
    );
  }
  if (row.status !== component.status) {
    failures.push(
      `COMPONENTS.md status differs for ${component.name}: ${row.status} !== ${component.status}`,
    );
  }
  if (row.package !== component.package) {
    failures.push(
      `COMPONENTS.md package differs for ${component.name}: ${row.package} !== ${component.package}`,
    );
  }
}
for (const row of matrixRows) {
  if (!catalogBySlug.has(slugify(row.name))) {
    failures.push(`COMPONENTS.md references unknown catalog component: ${row.name}`);
  }
}

const navSlugs = extractSlugs(docsChrome, /href: "\/docs\/components\/([^"]+)"/g);
const docsIndexSlugs = extractSlugs(componentDocs, /^  "?([a-z][a-z0-9-]*)"?:\s*"/gm);
for (const slug of [...new Set([...navSlugs, ...docsIndexSlugs])].sort()) {
  if (!catalogBySlug.has(slug)) {
    failures.push(`Docs component index references unknown catalog component: ${slug}`);
  }
}

if (failures.length) {
  console.error("Component catalog validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Component catalog verified across ${components.length} catalog entries, ${matrixRows.length} matrix rows, and ${registryItems.length} registry items.`,
);
