#!/usr/bin/env node
const fs = require("node:fs");
const crypto = require("node:crypto");
const path = require("node:path");

const cliPackage = require("../package.json");
const DEFAULT_REGISTRY = "@nerio-ui/registry/manifest.json";
const STATE_SCHEMA_VERSION = "1.0.0";
const SUPPORTED_CONFIG_SCHEMAS = new Set(["0.1.0", "1.0.0"]);
const SUPPORTED_REGISTRY_SCHEMA_MAJOR = 1;
const STATE_FILENAME = "nerio.lock.json";
const cwd = process.cwd();
const args = process.argv.slice(2);
const command = args[0];
const itemName =
  ["add", "diff", "info", "update"].includes(command) && !args[1]?.startsWith("--")
    ? args[1]
    : undefined;

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
      "Install an editable source component, its registry dependencies, and exact source metadata.",
    ],
    diff: [
      "Usage: nerio diff [component] [--registry <path-or-url>]",
      "",
      "Compare installed source with its recorded baseline and the configured Registry.",
    ],
    update: [
      "Usage: nerio update [component] [--registry <path-or-url>] [--dry-run] [--force]",
      "",
      "Apply safe upstream source changes without overwriting local modifications.",
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
      "  nerio diff     Inspect local and upstream source drift",
      "  nerio update   Preview or apply non-destructive source updates",
      "  nerio list     List registry components",
      "  nerio info     Show metadata for one component",
      "  nerio doctor   Validate configuration and registry metadata",
      "",
      "Recommended local install: pnpm add -D @nerio-ui/registry @nerio-ui/cli",
      "Run local commands with: pnpm exec nerio <command> [options]",
      "One-off example: pnpm dlx @nerio-ui/cli init",
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

function resolvedLocation(location) {
  if (location === DEFAULT_REGISTRY) {
    return require.resolve(DEFAULT_REGISTRY);
  }
  return location;
}

async function readText(location) {
  const resolved = resolvedLocation(location);
  if (isUrl(resolved)) {
    const response = await fetch(resolved);
    if (!response.ok) {
      throw new Error(`Registry request failed (${response.status}): ${resolved}`);
    }
    return response.text();
  }

  return fs.readFileSync(path.resolve(cwd, resolved), "utf8");
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

  if (
    !manifest.schemaVersion ||
    !manifest.name ||
    !manifest.version ||
    !manifest.sourceRevision ||
    !manifest.styleContractVersion ||
    !Array.isArray(manifest.items)
  ) {
    throw new Error(
      "Registry manifest must define schemaVersion, name, version, sourceRevision, styleContractVersion, and items.",
    );
  }
  const schemaMajor = Number.parseInt(manifest.schemaVersion.split(".")[0], 10);
  if (!Number.isInteger(schemaMajor) || schemaMajor > SUPPORTED_REGISTRY_SCHEMA_MAJOR) {
    throw new Error(
      `Registry schema ${manifest.schemaVersion} is newer than this CLI supports. Upgrade @nerio-ui/cli before continuing.`,
    );
  }
  if (schemaMajor < SUPPORTED_REGISTRY_SCHEMA_MAJOR) {
    throw new Error(
      `Registry schema ${manifest.schemaVersion} is no longer supported. Use a Registry compatible with CLI ${cliPackage.version}.`,
    );
  }
  return manifest;
}

function resolveSource(registry, source) {
  const resolved = resolvedLocation(registry);
  if (isUrl(resolved)) {
    return new URL(source, resolved).toString();
  }
  return path.resolve(path.dirname(path.resolve(cwd, resolved)), source);
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

function statePath() {
  return path.join(cwd, STATE_FILENAME);
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function readState(required = false) {
  const target = statePath();
  if (!fs.existsSync(target)) {
    if (required) {
      throw new Error(
        `${STATE_FILENAME} not found. Re-run nerio add for matching source or reinstall before diffing or updating.`,
      );
    }
    return null;
  }

  let state;
  try {
    state = JSON.parse(fs.readFileSync(target, "utf8"));
  } catch {
    throw new Error(`${STATE_FILENAME} is not valid JSON.`);
  }
  if (state.schemaVersion !== STATE_SCHEMA_VERSION) {
    throw new Error(
      `${STATE_FILENAME} uses unsupported schema ${state.schemaVersion || "unknown"}; expected ${STATE_SCHEMA_VERSION}. Reinstall source with a compatible CLI.`,
    );
  }
  if (
    !Array.isArray(state.requestedItems) ||
    !state.registry?.schemaVersion ||
    !state.registry?.version ||
    !state.registry?.sourceRevision ||
    !state.registry?.styleContractVersion ||
    !state.items ||
    !state.files ||
    Object.values(state.files).some(
      (file) => !file.hash || !file.role || !file.source || !Array.isArray(file.owners),
    )
  ) {
    throw new Error(
      `${STATE_FILENAME} is missing Registry, requestedItems, items, or file metadata.`,
    );
  }
  return state;
}

function emptyState(manifest) {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    nerioVersion: cliPackage.version,
    registry: registryMetadata(manifest),
    requestedItems: [],
    items: {},
    files: {},
  };
}

function registryMetadata(manifest) {
  return {
    schemaVersion: manifest.schemaVersion,
    name: manifest.name,
    version: manifest.version,
    sourceRevision: manifest.sourceRevision,
    styleContractVersion: manifest.styleContractVersion,
  };
}

function writeState(state) {
  const target = statePath();
  const temporary = `${target}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`);
  fs.renameSync(temporary, target);
}

function relativeTarget(componentsRoot, target) {
  return path.relative(cwd, resolveTarget(componentsRoot, target));
}

function isTokenStylesTarget(target) {
  const segments = target.split(path.sep);
  return segments.at(-2) === "styles" && segments.at(-1) === "tokens.css";
}

function resolveInstalledTarget(componentsRoot, storedTarget) {
  const root = path.resolve(cwd, componentsRoot);
  const resolved = path.resolve(cwd, storedTarget);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
    throw new Error(
      `${STATE_FILENAME} path escapes the configured components directory: ${storedTarget}`,
    );
  }
  return resolved;
}

async function registryFiles(registry, items, componentsRoot) {
  const files = new Map();
  for (const item of items.values()) {
    for (const file of item.files) {
      const target = relativeTarget(componentsRoot, file.target);
      const content = await readText(resolveSource(registry, file.source));
      const existing = files.get(target);
      if (existing && existing.content !== content) {
        throw new Error(
          `Registry items ${existing.owners.join(", ")} and ${item.name} provide conflicting content for ${target}.`,
        );
      }
      if (existing) {
        existing.owners.push(item.name);
      } else {
        files.set(target, {
          content,
          hash: hashContent(content),
          role: file.role,
          source: file.source,
          owners: [item.name],
        });
      }
    }
  }
  return files;
}

function itemMetadata(item, manifest) {
  return {
    registryVersion: manifest.version,
    sourceRevision: manifest.sourceRevision,
    dependencies: item.dependencies,
    registryDependencies: item.registryDependencies,
    files: item.files.map((file) => file.target),
  };
}

function classifyFile(localHash, baselineHash, upstreamHash, existsLocally, existsUpstream) {
  if (!existsUpstream) {
    return existsLocally && localHash !== baselineHash ? "removed, locally modified" : "removed";
  }
  if (!baselineHash) {
    if (!existsLocally) return "added";
    return localHash === upstreamHash ? "matches upstream" : "added, local file exists";
  }
  if (!existsLocally)
    return upstreamHash === baselineHash ? "locally removed" : "locally removed, upstream changed";
  if (localHash === baselineHash && upstreamHash === baselineHash) return "unchanged";
  if (localHash !== baselineHash && upstreamHash === baselineHash) return "locally modified";
  if (localHash === baselineHash && upstreamHash !== baselineHash) return "upstream changed";
  if (localHash === upstreamHash) return "matches upstream";
  return "locally modified, upstream changed";
}

function formatDrift(entries) {
  const order = [
    "locally modified, upstream changed",
    "locally removed, upstream changed",
    "added, local file exists",
    "upstream changed",
    "added",
    "removed, locally modified",
    "removed",
    "locally modified",
    "locally removed",
    "matches upstream",
    "unchanged",
  ];
  return [...entries].sort(
    (left, right) =>
      order.indexOf(left.status) - order.indexOf(right.status) ||
      left.target.localeCompare(right.target),
  );
}

async function init() {
  const target = path.join(cwd, "nerio.json");
  if (fs.existsSync(target)) {
    throw new Error("nerio.json already exists.");
  }

  const config = {
    schemaVersion: "1.0.0",
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
  const upstreamFiles = await registryFiles(registry, items, config.components);
  const state = readState(false) || emptyState(manifest);
  const written = [];
  const skipped = [];
  const writes = [];

  for (const [relative, file] of upstreamFiles) {
    const target = path.resolve(cwd, relative);
    if (hasFlag("--dry-run")) {
      written.push(relative);
      continue;
    }

    if (fs.existsSync(target) && !hasFlag("--overwrite")) {
      const content = fs.readFileSync(target, "utf8");
      const tracked = state.files[relative];
      if (content === file.content || isTokenStylesTarget(relative)) {
        skipped.push(relative);
      } else if (tracked && hashContent(content) !== tracked.hash) {
        throw new Error(
          `${relative} has local modifications. Keep them and use nerio diff/update, or re-run add with --overwrite to replace them intentionally.`,
        );
      } else {
        throw new Error(
          `${relative} already exists with different Registry content. Run nerio diff and nerio update instead of silently upgrading during add.`,
        );
      }
    } else {
      writes.push({ target, content: file.content });
      written.push(relative);
    }
  }
  for (const write of writes) {
    fs.mkdirSync(path.dirname(write.target), { recursive: true });
    fs.writeFileSync(write.target, write.content);
  }

  const item = items.get(name);
  if (hasFlag("--dry-run")) {
    console.log(`Would add ${item.title}: ${written.length} files.`);
    for (const file of written) console.log(`- ${file}`);
  } else {
    state.registry = registryMetadata(manifest);
    state.nerioVersion = cliPackage.version;
    state.requestedItems = [...new Set([...state.requestedItems, name])].sort();
    for (const dependency of items.values()) {
      state.items[dependency.name] = itemMetadata(dependency, manifest);
    }
    for (const [relative, file] of upstreamFiles) {
      const previous = state.files[relative];
      state.files[relative] = {
        hash: written.includes(relative) ? file.hash : previous?.hash || file.hash,
        role: file.role,
        source: file.source,
        owners: [...new Set([...(previous?.owners || []), ...file.owners])].sort(),
      };
    }
    writeState(state);
    console.log(
      `Added ${item.title}: ${written.length} files written, ${skipped.length} unchanged.`,
    );
    console.log(`Recorded exact source metadata in ${STATE_FILENAME}.`);
  }
  if (item.dependencies?.length) {
    console.log(`Package dependencies: ${item.dependencies.join(", ")}`);
  }
}

function collectStateItems(state, name, collected = new Set()) {
  const item = state.items[name];
  if (!item) return collected;
  if (collected.has(name)) return collected;
  collected.add(name);
  for (const dependency of item.registryDependencies || []) {
    collectStateItems(state, dependency, collected);
  }
  return collected;
}

async function createUpgradePlan(config, registry, manifest, state, name) {
  const selectedRoots = name ? [name] : state.requestedItems;
  if (!selectedRoots.length) {
    throw new Error(`No source items are recorded in ${STATE_FILENAME}.`);
  }
  for (const selected of selectedRoots) {
    if (!state.requestedItems.includes(selected)) {
      throw new Error(`${selected} is not recorded as a directly installed Registry item.`);
    }
  }

  const oldSelected = new Set();
  for (const selected of selectedRoots) collectStateItems(state, selected, oldSelected);

  const newItems = new Map();
  for (const selected of selectedRoots) collectItems(manifest, selected, newItems);
  const upstreamFiles = await registryFiles(registry, newItems, config.components);

  const desiredNames = new Set(newItems.keys());
  for (const requested of state.requestedItems) {
    if (!selectedRoots.includes(requested)) collectStateItems(state, requested, desiredNames);
  }

  const nextItems = {};
  for (const desired of desiredNames) {
    const upstreamItem = newItems.get(desired);
    if (upstreamItem) nextItems[desired] = itemMetadata(upstreamItem, manifest);
    else if (state.items[desired]) nextItems[desired] = state.items[desired];
  }

  const allTargets = new Set(upstreamFiles.keys());
  for (const [target, file] of Object.entries(state.files)) {
    if (file.owners.some((owner) => oldSelected.has(owner))) allTargets.add(target);
  }

  const entries = [];
  for (const target of allTargets) {
    const previous = state.files[target];
    const upstream = upstreamFiles.get(target);
    const retainedOwners = (previous?.owners || []).filter(
      (owner) => desiredNames.has(owner) && !newItems.has(owner),
    );
    const owners = [...new Set([...(upstream?.owners || []), ...retainedOwners])].sort();
    const existsUpstream = Boolean(upstream || owners.length);
    const baselineHash = previous?.hash;
    const upstreamHash = upstream?.hash || baselineHash;
    const absolute = resolveInstalledTarget(config.components, target);
    const existsLocally = fs.existsSync(absolute);
    const localHash = existsLocally ? hashContent(fs.readFileSync(absolute)) : undefined;
    entries.push({
      target,
      status: classifyFile(localHash, baselineHash, upstreamHash, existsLocally, existsUpstream),
      previous,
      upstream,
      owners,
      existsLocally,
      localHash,
    });
  }

  return { entries: formatDrift(entries), nextItems };
}

function printUpgradePlan(title, plan) {
  console.log(title);
  for (const entry of plan.entries) {
    console.log(`${entry.status}\t${entry.target}`);
  }
}

async function diff(name) {
  if (name?.startsWith("--")) {
    throw new Error("Usage: nerio diff [component] [--registry <path-or-url>]");
  }
  const config = readConfig(true);
  const state = readState(true);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const plan = await createUpgradePlan(config, registry, manifest, state, name);
  printUpgradePlan(
    `Source drift against Registry ${manifest.version} (${manifest.sourceRevision}):`,
    plan,
  );
}

function conflictStatus(status) {
  return [
    "locally modified, upstream changed",
    "locally removed, upstream changed",
    "removed, locally modified",
    "added, local file exists",
  ].includes(status);
}

async function update(name) {
  if (name?.startsWith("--")) {
    throw new Error(
      "Usage: nerio update [component] [--registry <path-or-url>] [--dry-run] [--force]",
    );
  }
  const config = readConfig(true);
  const state = readState(true);
  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const plan = await createUpgradePlan(config, registry, manifest, state, name);
  const conflicts = plan.entries.filter((entry) => conflictStatus(entry.status));
  printUpgradePlan(
    `${hasFlag("--dry-run") ? "Would update" : "Updating"} source from Registry ${manifest.version} (${manifest.sourceRevision}):`,
    plan,
  );

  if (hasFlag("--dry-run")) {
    if (conflicts.length) {
      console.log(
        `${conflicts.length} conflict(s) require local resolution or an intentional --force update.`,
      );
    }
    return;
  }
  if (conflicts.length && !hasFlag("--force")) {
    throw new Error(
      `Update stopped before writing because ${conflicts.length} locally modified file(s) also changed upstream. Review nerio diff and resolve them, or use --force intentionally.`,
    );
  }

  for (const entry of plan.entries) {
    const absolute = resolveInstalledTarget(config.components, entry.target);
    if (!entry.upstream && !entry.owners.length) {
      if (
        entry.existsLocally &&
        (!entry.status.includes("locally modified") || hasFlag("--force"))
      ) {
        fs.rmSync(absolute);
      }
      delete state.files[entry.target];
      continue;
    }

    const shouldWrite =
      entry.upstream &&
      (["added", "upstream changed"].includes(entry.status) ||
        (conflictStatus(entry.status) && hasFlag("--force")));
    if (shouldWrite) {
      fs.mkdirSync(path.dirname(absolute), { recursive: true });
      fs.writeFileSync(absolute, entry.upstream.content);
    }

    const preserveBaseline = ["locally modified", "locally removed"].includes(entry.status);
    const metadata = {
      hash: preserveBaseline ? entry.previous?.hash : entry.upstream?.hash || entry.previous?.hash,
      role: entry.upstream?.role || entry.previous?.role,
      source: entry.upstream?.source || entry.previous?.source,
    };
    if (!metadata.hash || !metadata.role || !metadata.source) {
      throw new Error(`Cannot record complete update metadata for ${entry.target}.`);
    }
    state.files[entry.target] = {
      ...metadata,
      owners: entry.owners,
    };
  }

  state.items = plan.nextItems;
  state.registry = registryMetadata(manifest);
  state.nerioVersion = cliPackage.version;
  writeState(state);
  console.log(`Updated source metadata in ${STATE_FILENAME}.`);
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
  if (
    (importsPackageBridge || importsPackageStyles) &&
    (referencesSourceBridge || referencesSourceTokens)
  ) {
    problems.push(
      "Package and source-install styles are imported together. Choose one Nerio distribution mode so tokens and residual styles are not duplicated.",
    );
  }

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

function installedDependencyProblems(state) {
  const packagePath = path.join(cwd, "package.json");
  if (!fs.existsSync(packagePath)) {
    return {
      errors: [],
      warnings: ["package.json was not found, so required npm dependencies could not be verified."],
    };
  }

  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  } catch {
    return { errors: ["package.json is not valid JSON."], warnings: [] };
  }
  const declared = new Set([
    ...Object.keys(packageJson.dependencies || {}),
    ...Object.keys(packageJson.devDependencies || {}),
    ...Object.keys(packageJson.peerDependencies || {}),
  ]);
  const required = new Set(Object.values(state.items).flatMap((item) => item.dependencies || []));
  const missing = [...required].filter((dependency) => !declared.has(dependency)).sort();
  return {
    errors: missing.length
      ? [
          `Required source dependencies are not declared: ${missing.join(", ")}. Add them to the consumer package before building.`,
        ]
      : [],
    warnings: [],
  };
}

function stateDiagnostics(config, manifest) {
  const target = statePath();
  const componentsRoot = path.resolve(cwd, config.components);
  if (!fs.existsSync(target)) {
    const hasInstalledSource =
      fs.existsSync(componentsRoot) &&
      fs.statSync(componentsRoot).isDirectory() &&
      fs.readdirSync(componentsRoot, { recursive: true }).some((entry) => {
        const candidate = path.join(componentsRoot, entry);
        return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
      });
    return {
      state: null,
      errors: hasInstalledSource
        ? [
            `${STATE_FILENAME} is missing for installed source. Re-run nerio add for matching items to adopt unchanged files before updating.`,
          ]
        : [],
      warnings: [],
    };
  }

  const state = readState(true);
  const errors = [];
  const warnings = [];
  if (manifest.version !== cliPackage.version) {
    errors.push(
      `CLI ${cliPackage.version} and Registry ${manifest.version} do not match. Install coordinated @nerio-ui/cli and @nerio-ui/registry versions.`,
    );
  }
  if (state.registry.schemaVersion !== manifest.schemaVersion) {
    errors.push(
      `Installed Registry schema ${state.registry.schemaVersion} differs from configured schema ${manifest.schemaVersion}.`,
    );
  }
  if (state.registry.styleContractVersion !== manifest.styleContractVersion) {
    errors.push(
      `Installed style contract ${state.registry.styleContractVersion} is outdated; Registry requires ${manifest.styleContractVersion}. Run nerio update --dry-run.`,
    );
  }
  if (
    state.registry.version !== manifest.version ||
    state.registry.sourceRevision !== manifest.sourceRevision
  ) {
    warnings.push(
      `Installed source records Registry ${state.registry.version} (${state.registry.sourceRevision}); configured Registry is ${manifest.version} (${manifest.sourceRevision}). Run nerio diff.`,
    );
  }

  for (const [name, item] of Object.entries(state.items)) {
    for (const dependency of item.registryDependencies || []) {
      if (!state.items[dependency]) {
        errors.push(
          `Installed item ${name} is missing Registry dependency ${dependency}. Run nerio update ${name}.`,
        );
      }
    }
  }

  let modified = 0;
  let missing = 0;
  for (const [relative, file] of Object.entries(state.files)) {
    const absolute = resolveInstalledTarget(config.components, relative);
    if (!fs.existsSync(absolute)) {
      missing += 1;
      continue;
    }
    if (hashContent(fs.readFileSync(absolute)) !== file.hash) modified += 1;
  }
  if (modified) {
    warnings.push(
      `${modified} installed file(s) differ from their original hashes. Run nerio diff before updating.`,
    );
  }
  if (missing) {
    warnings.push(
      `${missing} recorded installed file(s) are missing locally. Run nerio diff before updating.`,
    );
  }

  const dependencies = installedDependencyProblems(state);
  errors.push(...dependencies.errors);
  warnings.push(...dependencies.warnings);
  return { state, errors, warnings };
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
  if (!SUPPORTED_CONFIG_SCHEMAS.has(config.schemaVersion)) {
    throw new Error(
      `nerio.json schema ${config.schemaVersion} is incompatible with CLI ${cliPackage.version}; supported schemas are ${[...SUPPORTED_CONFIG_SCHEMAS].join(", ")}.`,
    );
  }

  const registry = registryLocation(config);
  const manifest = await readManifest(registry);
  const errors = [];
  const warnings = [];
  const componentsRoot = path.resolve(cwd, config.components);
  if (fs.existsSync(componentsRoot) && !fs.statSync(componentsRoot).isDirectory()) {
    errors.push(
      `Configured components path is not a directory: ${path.relative(cwd, componentsRoot)}`,
    );
  }
  if (config.schemaVersion === "0.1.0") {
    warnings.push(
      "nerio.json uses the supported legacy 0.1.0 schema. Change schemaVersion to 1.0.0 after adopting installed source metadata.",
    );
  }
  if (manifest.version !== cliPackage.version) {
    errors.push(
      `CLI ${cliPackage.version} and Registry ${manifest.version} do not match. Install coordinated @nerio-ui/cli and @nerio-ui/registry versions.`,
    );
  }
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
  errors.push(...tailwindProblems);
  const installed = stateDiagnostics(config, manifest);
  errors.push(...installed.errors);
  warnings.push(...installed.warnings);
  if (errors.length) {
    throw new Error(`Nerio configuration requires attention:\n- ${errors.join("\n- ")}`);
  }
  if (warnings.length) {
    console.log(`Nerio diagnostics:\n- ${warnings.join("\n- ")}`);
  }

  console.log(
    `Nerio configuration is valid. Registry ${manifest.name} ${manifest.version} (${manifest.sourceRevision}) exposes ${manifest.items.length} component(s).`,
  );
}

async function main() {
  if (hasFlag("--help") || hasFlag("-h")) {
    console.log(help(command));
    return;
  }

  if (command === "init") await init();
  else if (command === "add") await add(itemName);
  else if (command === "diff") await diff(itemName);
  else if (command === "update") await update(itemName);
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
