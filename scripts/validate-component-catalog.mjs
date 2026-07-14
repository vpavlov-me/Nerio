import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf8"));
  } catch (error) {
    throw new Error(`Could not parse ${file}: ${error.message}`);
  }
}

function slugify(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function duplicates(values) {
  const seen = new Set();
  const duplicateValues = new Set();
  for (const value of values.filter(Boolean)) {
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
    if (["Component", "Component / Area", "Template"].includes(cells[0])) {
      isComponentTable = cells[1] === "Status" && cells[2] === "Package";
      continue;
    }
    if (isComponentTable && tier) {
      rows.push({ name: cells[0], status: cells[1], package: cells[2], tier });
    }
  }

  return rows;
}

function tokenize(source) {
  const tokens = [];
  let index = 0;
  while (index < source.length) {
    const character = source[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (source.startsWith("//", index)) {
      index = source.indexOf("\n", index + 2);
      if (index === -1) break;
      continue;
    }
    if (source.startsWith("/*", index)) {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
      continue;
    }
    if ("\"'`".includes(character)) {
      const quote = character;
      let value = "";
      index += 1;
      while (index < source.length && source[index] !== quote) {
        if (source[index] === "\\") {
          value += source[index + 1] ?? "";
          index += 2;
        } else {
          value += source[index];
          index += 1;
        }
      }
      index += 1;
      tokens.push({ type: "string", value });
      continue;
    }
    const identifier = source.slice(index).match(/^[A-Za-z_$][A-Za-z0-9_$-]*/)?.[0];
    if (identifier) {
      tokens.push({ type: "identifier", value: identifier });
      index += identifier.length;
      continue;
    }
    tokens.push({ type: "punctuation", value: character });
    index += 1;
  }
  return tokens;
}

function propertyStringValues(source, property) {
  const tokens = tokenize(source);
  const values = [];
  for (let index = 0; index < tokens.length - 2; index += 1) {
    if (
      tokens[index].value === property &&
      tokens[index + 1].value === ":" &&
      tokens[index + 2].type === "string"
    ) {
      values.push(tokens[index + 2].value);
    }
  }
  return values;
}

function objectKeys(source, declaration) {
  const tokens = tokenize(source);
  const declarationIndex = tokens.findIndex(
    (token, index) =>
      token.value === declaration && tokens[index + 1]?.value === ":" && tokens[index + 2],
  );
  const start = tokens.findIndex(
    (token, index) =>
      index > declarationIndex && token.value === "=" && tokens[index + 1]?.value === "{",
  );
  if (declarationIndex === -1 || start === -1) return [];

  const keys = [];
  let depth = 0;
  for (let index = start + 1; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.value === "{") depth += 1;
    if (token.value === "}") {
      if (depth === 1) break;
      depth -= 1;
    }
    if (
      depth === 1 &&
      ["identifier", "string"].includes(token.type) &&
      tokens[index + 1]?.value === ":"
    ) {
      keys.push(token.value);
    }
  }
  return keys;
}

function reportSetDrift(label, actualValues, expectedValues, failures) {
  const actual = new Set(actualValues);
  const expected = new Set(expectedValues);
  for (const value of [...actual].filter((item) => !expected.has(item)).sort()) {
    failures.push(`${label} references unknown catalog component: ${value}`);
  }
  for (const value of [...expected].filter((item) => !actual.has(item)).sort()) {
    failures.push(`${label} is missing catalog component: ${value}`);
  }
}

function validate() {
  const paths = parsePathOptions(process.argv.slice(2), {
    "--catalog": resolve(root, "data/component-catalog.json"),
    "--manifest": resolve(root, "packages/registry/src/manifest.json"),
    "--components": resolve(root, "COMPONENTS.md"),
    "--docs-chrome": resolve(root, "apps/docs/components/docs-chrome.tsx"),
    "--component-docs": resolve(root, "apps/docs/lib/component-docs.ts"),
    "--cli-runtime": resolve(root, "packages/cli/src/index.js"),
    "--mcp-runtime": resolve(root, "packages/mcp/src/tool-runtime.js"),
  });

  for (const file of Object.values(paths)) {
    if (!existsSync(file)) throw new Error(`Required catalog projection is missing: ${file}`);
  }

  const catalog = readJson(paths["--catalog"]);
  const manifest = readJson(paths["--manifest"]);
  const matrixRows = parseMatrix(readFileSync(paths["--components"], "utf8"));
  const docsChrome = readFileSync(paths["--docs-chrome"], "utf8");
  const componentDocs = readFileSync(paths["--component-docs"], "utf8");
  const cliRuntime = readFileSync(paths["--cli-runtime"], "utf8");
  const mcpRuntime = readFileSync(paths["--mcp-runtime"], "utf8");
  const failures = [];
  const components = Array.isArray(catalog.components) ? catalog.components : [];
  const allowedTiers = new Set(Object.keys(catalog.tiers ?? {}));
  const allowedStatuses = new Set(Object.keys(catalog.statusValues ?? {}));
  const allowedCategories = new Set(catalog.categoryValues ?? []);
  const allowedPackages = new Set(catalog.packageValues ?? []);
  const allowedEntrypoints = new Set(catalog.entrypointValues ?? []);
  const allowedRuntimes = new Set(catalog.runtimeValues ?? []);
  const identities = Array.isArray(catalog.registryIdentities) ? catalog.registryIdentities : [];

  if (!components.length) failures.push("Catalog must define a non-empty components array.");
  for (const [label, values] of [
    ["categoryValues", allowedCategories],
    ["packageValues", allowedPackages],
    ["entrypointValues", allowedEntrypoints],
    ["runtimeValues", allowedRuntimes],
  ]) {
    if (!values.size) failures.push(`Catalog must define ${label}.`);
  }

  const validComponents = components
    .map((component) => ({ component, slug: slugify(component.name) }))
    .filter(({ slug }) => slug);
  const catalogNames = components
    .map((component) => (typeof component.name === "string" ? component.name : ""))
    .filter(Boolean);
  const catalogSlugs = validComponents.map(({ slug }) => slug);
  const catalogBySlug = new Map(validComponents.map(({ component, slug }) => [slug, component]));

  for (const name of duplicates(catalogNames))
    failures.push(`Duplicate catalog component name: ${name}`);
  for (const slug of duplicates(catalogSlugs))
    failures.push(`Duplicate catalog component slug: ${slug}`);

  for (const component of components) {
    const name =
      typeof component.name === "string" && component.name ? component.name : "<missing name>";
    const label = `Catalog component ${name}`;
    if (!slugify(component.name)) failures.push(`${label} has an invalid name.`);
    if (!allowedTiers.has(component.tier))
      failures.push(`${label} has invalid tier: ${component.tier}`);
    if (!allowedCategories.has(component.category))
      failures.push(`${label} has invalid category: ${component.category}`);
    if (!allowedPackages.has(component.package))
      failures.push(`${label} has invalid package: ${component.package}`);
    if (!allowedStatuses.has(component.status))
      failures.push(`${label} has invalid status: ${component.status}`);
    if (component.deprecated) {
      const replacement = slugify(component.replacement);
      if (!replacement || !catalogBySlug.has(replacement)) {
        failures.push(
          `${label} is deprecated but has no valid replacement: ${component.replacement ?? "<missing>"}`,
        );
      }
    }
  }

  const identityNames = identities.map((identity) => identity.name);
  for (const name of duplicates(identityNames))
    failures.push(`Duplicate catalog registry identity: ${name}`);
  const identityByName = new Map();
  for (const identity of identities) {
    const label = `Catalog registry identity ${identity.name ?? "<missing>"}`;
    if (!identity.name || !catalogBySlug.has(identity.name))
      failures.push(`${label} has no component entry.`);
    if (!allowedEntrypoints.has(identity.entrypoint))
      failures.push(`${label} has invalid entrypoint: ${identity.entrypoint}`);
    if (!allowedRuntimes.has(identity.runtime))
      failures.push(`${label} has invalid runtime: ${identity.runtime}`);
    const component = catalogBySlug.get(identity.name);
    if (component && identity.entrypoint !== component.package) {
      failures.push(
        `Catalog component ${component.name} entrypoint differs from package: ${identity.entrypoint} !== ${component.package}`,
      );
    }
    const expectedRuntime = identity.entrypoint === "@nerio/ui/client" ? "client" : "server";
    if (identity.runtime !== expectedRuntime) {
      failures.push(
        `Catalog component ${component?.name ?? identity.name} runtime differs from entrypoint: ${identity.runtime} !== ${expectedRuntime}`,
      );
    }
    if (identity.name) identityByName.set(identity.name, identity);
  }

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
    if (!identityByName.has(item.name))
      failures.push(`Registry component has no canonical registry identity: ${item.name}`);
    if (slugify(item.title) !== item.name)
      failures.push(`Registry component ${item.name} title does not match its catalog identity.`);
    if (item.category !== component.category)
      failures.push(
        `Registry component ${item.name} category differs from catalog: ${item.category} !== ${component.category}`,
      );
    if (Boolean(item.deprecated) !== Boolean(component.deprecated))
      failures.push(`Registry component ${item.name} deprecated flag differs from catalog.`);
    if (item.deprecated && item.replacement !== slugify(component.replacement))
      failures.push(`Registry component ${item.name} replacement differs from catalog.`);
  }
  const registrySet = new Set(registryNames);
  for (const identity of identities) {
    if (!registrySet.has(identity.name)) {
      const component = catalogBySlug.get(identity.name);
      failures.push(
        `Installable catalog component has no registry item: ${component?.name ?? identity.name} (${identity.name})`,
      );
    }
  }

  const matrixBySlug = new Map(
    matrixRows.map((row) => [slugify(row.name), row]).filter(([slug]) => slug),
  );
  for (const { component, slug } of validComponents) {
    const row = matrixBySlug.get(slug);
    if (!row) {
      failures.push(`COMPONENTS.md is missing catalog component: ${component.name}`);
      continue;
    }
    for (const field of ["tier", "status", "package"]) {
      if (row[field] !== component[field])
        failures.push(
          `COMPONENTS.md ${field} differs for ${component.name}: ${row[field]} !== ${component[field]}`,
        );
    }
  }
  for (const row of matrixRows) {
    if (!catalogBySlug.has(slugify(row.name)))
      failures.push(`COMPONENTS.md references unknown catalog component: ${row.name}`);
  }

  const expectedDocs = identities
    .map((identity) => identity.name)
    .filter((slug) => !catalogBySlug.get(slug)?.deprecated);
  const navSlugs = propertyStringValues(docsChrome, "href")
    .filter((href) => href.startsWith("/docs/components/"))
    .map((href) => href.slice("/docs/components/".length));
  const docsIndexSlugs = objectKeys(componentDocs, "componentLedes");
  reportSetDrift("Docs navigation", navSlugs, expectedDocs, failures);
  reportSetDrift("Docs component index", docsIndexSlugs, expectedDocs, failures);

  if (!cliRuntime.includes("manifest.items"))
    failures.push("CLI discovery must enumerate registry manifest identities.");
  if (!mcpRuntime.includes("manifest.items.map"))
    failures.push("MCP discovery must enumerate registry manifest identities.");

  if (failures.length) {
    console.error("Component catalog validation failed:");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Component catalog verified across ${components.length} catalog entries, ${identities.length} installable identities, ${matrixRows.length} matrix rows, and ${registryItems.length} registry items.`,
  );
}

try {
  validate();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
