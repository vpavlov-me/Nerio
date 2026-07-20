#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

const DEFAULT_REGISTRY =
  "https://raw.githubusercontent.com/vpavlov-me/Nerio/main/packages/registry/src/manifest.json";
const cwd = process.cwd();
const args = process.argv.slice(2);
const command = args[0];
const itemName = command === "add" || command === "info" ? args[1] : undefined;

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function hasFlag(name) {
  return args.includes(name);
}

function help(commandName) {
  const sections = {
    init: [
      "Usage: nerio init [--registry <path-or-url>] [--components <directory>]",
      "",
      "Create nerio.json for source-installed components.",
    ],
    add: [
      "Usage: nerio add <component> [--registry <path-or-url>] [--dry-run] [--overwrite]",
      "",
      "Install an editable source component and its registry dependencies.",
    ],
    list: [
      "Usage: nerio list [--registry <path-or-url>]",
      "",
      "List component names, titles, and categories from the configured registry.",
    ],
    info: [
      "Usage: nerio info <component> [--registry <path-or-url>]",
      "",
      "Show registry metadata, dependencies, tokens, files, and usage for one component.",
    ],
    doctor: [
      "Usage: nerio doctor [--registry <path-or-url>]",
      "",
      "Validate nerio.json and the configured registry manifest.",
    ],
    root: [
      "Usage: nerio <command> [options]",
      "",
      "Commands:",
      "  nerio init     Create nerio.json",
      "  nerio add      Install editable source components",
      "  nerio list     List registry components",
      "  nerio info     Show metadata for one component",
      "  nerio doctor   Validate configuration and registry metadata",
      "",
      "Run nerio <command> --help for command options.",
    ],
  };

  return (sections[commandName] || sections.root).join("\n");
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
      if (hasFlag("--dry-run")) {
        written.push(path.relative(cwd, target));
        continue;
      }

      const content = await readText(source);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      if (fs.existsSync(target) && !hasFlag("--overwrite")) {
        if (file.target === "styles/tokens.css" || fs.readFileSync(target, "utf8") === content) {
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
  if (hasFlag("--dry-run")) {
    console.log(`Would add ${item.title}: ${written.length} files.`);
    for (const file of written) console.log(`- ${file}`);
  } else {
    console.log(
      `Added ${item.title}: ${written.length} files written, ${skipped.length} unchanged.`,
    );
  }
  if (item.dependencies?.length) {
    console.log(`Package dependencies: ${item.dependencies.join(", ")}`);
  }
}

async function list() {
  const config = readConfig(false);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);

  for (const item of manifest.items) {
    console.log(`${item.name}\t${item.title}\t${item.category}`);
  }
}

function formatList(values) {
  return values?.length ? values.join(", ") : "none";
}

const SOURCE_STYLE_ALLOWLIST = new Set([
  "tokens.css",
  "tailwind.css",
  "motion.css",
  "spinner.css",
  "feedback.css",
  "progress.css",
  "select.css",
  "overlays.css",
]);

function listCssFiles(directory) {
  if (!fs.existsSync(directory)) return [];

  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if ([".git", ".next", "dist", "build", "node_modules"].includes(entry.name)) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listCssFiles(entryPath));
    else if (entry.isFile() && entry.name.endsWith(".css")) files.push(entryPath);
  }
  return files;
}

function cssImports(source) {
  return [...source.matchAll(/@import\s+(?:url\()?\s*["']([^"']+)["']/g)].map((match) => match[1]);
}

function isTailwindImport(value) {
  return value === "tailwindcss" || importsTailwindTheme(value) || importsTailwindUtilities(value);
}

function importsTailwindTheme(value) {
  return /^tailwindcss\/theme(?:\.css)?$/.test(value);
}

function importsTailwindUtilities(value) {
  return /^tailwindcss\/utilities(?:\.css)?$/.test(value);
}

function importsPreflight(value) {
  return value === "tailwindcss" || /^tailwindcss\/preflight(?:\.css)?$/.test(value);
}

function isWithin(directory, candidate) {
  const resolvedDirectory = path.resolve(directory);
  const resolvedCandidate = path.resolve(candidate);
  return (
    resolvedCandidate === resolvedDirectory ||
    resolvedCandidate.startsWith(`${resolvedDirectory}${path.sep}`)
  );
}

function resolveCssImport(stylesheet, specifier) {
  if (!specifier.startsWith(".")) return null;
  return path.resolve(path.dirname(stylesheet), specifier.split(/[?#]/, 1)[0]);
}

function collectTailwindSetupProblems(config) {
  const stylesheets = listCssFiles(cwd).map((file) => {
    const source = fs.readFileSync(file, "utf8");
    return { file, source, imports: cssImports(source) };
  });
  const problems = [];

  if (!stylesheets.length) {
    return [
      "Tailwind setup was not found. Add a Tailwind-processed stylesheet that imports the Nerio bridge.",
    ];
  }

  const importsTailwind = stylesheets.some((stylesheet) =>
    stylesheet.imports.some(isTailwindImport),
  );
  if (!importsTailwind) {
    problems.push(
      'No Tailwind import was found. Import "tailwindcss" or the Tailwind theme and utilities layers in the consumer stylesheet.',
    );
  }

  const importsPackageBridge = stylesheets.some((stylesheet) =>
    stylesheet.imports.includes("@nerio-ui/tokens/tailwind.css"),
  );
  const importsPackageStyles = stylesheets.some((stylesheet) =>
    stylesheet.imports.includes("@nerio-ui/ui/styles.css"),
  );
  const componentsRoot = path.resolve(cwd, config.components);
  const sourceStylesRoot = path.join(componentsRoot, "styles");
  const sourceTailwindBridge = path.join(sourceStylesRoot, "tailwind.css");
  const sourceTokens = path.join(sourceStylesRoot, "tokens.css");
  const sourceStyles = stylesheets.flatMap((stylesheet) =>
    stylesheet.imports.map((specifier) => ({
      stylesheet: stylesheet.file,
      specifier,
      target: resolveCssImport(stylesheet.file, specifier),
    })),
  );
  const importedLocalStyles = sourceStyles
    .map((entry) => entry.target)
    .filter((target) => target && target.endsWith(".css") && fs.existsSync(target));
  const referencesSourceBridge = sourceStyles.some(
    (entry) => entry.target === sourceTailwindBridge,
  );
  const referencesSourceTokens = sourceStyles.some((entry) => entry.target === sourceTokens);
  const importsSourceBridge = referencesSourceBridge && fs.existsSync(sourceTailwindBridge);
  const importsSourceTokens = referencesSourceTokens && fs.existsSync(sourceTokens);
  const usesPackageMode =
    importsPackageBridge ||
    importsPackageStyles ||
    stylesheets.some((stylesheet) => /@source\s+[^;]*@nerio-ui\/ui\/src/.test(stylesheet.source));
  const usesSourceMode =
    fs.existsSync(sourceStylesRoot) ||
    sourceStyles.some((entry) => entry.target && isWithin(sourceStylesRoot, entry.target));

  if (!importsPackageBridge && !importsSourceBridge) {
    problems.push(
      "Nerio Tailwind bridge is missing. Import @nerio-ui/tokens/tailwind.css for package mode or the copied styles/tailwind.css for source-install mode.",
    );
  }

  if (usesPackageMode) {
    if (!importsPackageBridge) {
      problems.push("Package mode must import @nerio-ui/tokens/tailwind.css.");
    }
    if (!importsPackageStyles) {
      problems.push(
        "Package mode must import @nerio-ui/ui/styles.css so documented residual and no-Preflight compatibility styles remain active.",
      );
    }
    if (
      !stylesheets.some((stylesheet) => /@source\s+[^;]*@nerio-ui\/ui\/src/.test(stylesheet.source))
    ) {
      problems.push(
        "Package mode must register @nerio-ui/ui/src with @source so Tailwind detects Nerio component utilities.",
      );
    }
  }

  if (usesSourceMode && !importsPackageBridge) {
    if (!importsSourceBridge) {
      problems.push("Source-install mode must import the copied styles/tailwind.css bridge.");
    }
    if (!importsSourceTokens) {
      problems.push("Source-install mode must import the copied styles/tokens.css variables.");
    }
  }

  const staleSourceStyles = sourceStyles.filter(
    (entry) =>
      entry.target &&
      isWithin(sourceStylesRoot, entry.target) &&
      !SOURCE_STYLE_ALLOWLIST.has(path.basename(entry.target)),
  );
  if (staleSourceStyles.length) {
    problems.push(
      `Source-install mode imports unsupported legacy component stylesheet(s): ${staleSourceStyles
        .map((entry) => path.relative(cwd, entry.target))
        .join(
          ", ",
        )}. Keep only the documented Tailwind bridge, token stylesheet, and residual shared styles.`,
    );
  }

  const omitsPreflight =
    importsTailwind &&
    !stylesheets.some((stylesheet) => stylesheet.imports.some(importsPreflight)) &&
    stylesheets.some((stylesheet) => stylesheet.imports.some(importsTailwindTheme)) &&
    stylesheets.some((stylesheet) => stylesheet.imports.some(importsTailwindUtilities));
  const hasScopedCompatibility = [
    ...stylesheets
      .filter((stylesheet) => stylesheet.imports.some(isTailwindImport))
      .map((stylesheet) => stylesheet.source),
    ...importedLocalStyles.map((stylesheet) => fs.readFileSync(stylesheet, "utf8")),
  ].some(
    (stylesheet) =>
      stylesheet.includes("box-sizing: border-box") && stylesheet.includes("font-family: inherit"),
  );
  if (omitsPreflight && !importsPackageStyles && !hasScopedCompatibility) {
    problems.push(
      "This no-Preflight setup is missing scoped Nerio compatibility styles. Import @nerio-ui/ui/styles.css in package mode or retain the documented box-sizing and native-control typography rules in source-install mode.",
    );
  }

  return problems;
}

async function info(name) {
  if (!name || name.startsWith("--")) {
    throw new Error("Usage: nerio info <component> [--registry <path-or-url>]");
  }

  const config = readConfig(false);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const item = manifest.items.find((entry) => entry.name === name);
  if (!item) {
    throw new Error(`Unknown registry item: ${name}`);
  }

  console.log(`${item.title} (${item.name})`);
  console.log(`Description: ${item.description}`);
  console.log(`Category: ${item.category}`);
  console.log(`Dependencies: ${formatList(item.dependencies)}`);
  if (item.optionalPeerDependencies?.length) {
    console.log(`Optional peer dependencies: ${formatList(item.optionalPeerDependencies)}`);
  }
  if (item.docsPath) console.log(`Documentation: ${item.docsPath}`);
  console.log(`Registry dependencies: ${formatList(item.registryDependencies)}`);
  console.log(`Files: ${item.files.length} (${item.files.map((file) => file.target).join(", ")})`);
  console.log(`Variants: ${formatList(item.variants)}`);
  console.log(`Required tokens: ${formatList(item.requiredTokens)}`);
  console.log(`Accessibility: ${formatList(item.accessibility)}`);
  console.log("");
  console.log("Usage:");
  console.log(item.usage);
}

async function doctor() {
  const config = readConfig(true);
  if (!config.schemaVersion || !config.registry || !config.components) {
    throw new Error("nerio.json must define schemaVersion, registry, and components.");
  }

  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  for (const item of manifest.items) {
    if (
      !item.name ||
      !item.title ||
      !item.description ||
      !item.category ||
      !Array.isArray(item.files)
    ) {
      throw new Error(
        "Every registry item must define name, title, description, category, and files.",
      );
    }
    for (const field of [
      "dependencies",
      "registryDependencies",
      "baseUiPrimitives",
      "slots",
      "variants",
      "requiredTokens",
      "accessibility",
    ]) {
      if (!Array.isArray(item[field])) {
        throw new Error(`Registry item ${item.name} must define ${field} as an array.`);
      }
    }
    for (const file of item.files) {
      if (!file.source || !file.target || !file.role) {
        throw new Error(`Registry item ${item.name} contains an invalid file entry.`);
      }
      resolveTarget(config.components, file.target);
    }
  }

  const tailwindProblems = collectTailwindSetupProblems(config);
  if (tailwindProblems.length) {
    throw new Error(`Tailwind setup is invalid:\n- ${tailwindProblems.join("\n- ")}`);
  }

  console.log(
    `Nerio configuration is valid. Registry ${manifest.name || "local"} exposes ${manifest.items.length} component(s).`,
  );
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    console.log(help(command));
    return;
  }

  if (command === "init") await init();
  else if (command === "add") await add(itemName);
  else if (command === "list") await list();
  else if (command === "info") await info(itemName);
  else if (command === "doctor") await doctor();
  else {
    console.log(help("root"));
    process.exitCode = command ? 1 : 0;
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
