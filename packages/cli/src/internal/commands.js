const fs = require("node:fs");
const path = require("node:path");
const { createAddCommand } = require("./add");
const { createCreateCommand } = require("./create");
const { createDiscoveryCommand } = require("./discovery");
const { createMigrationCommand } = require("./migrate");
const { createRemoveCommand } = require("./remove");

const SUPPORTED_CONFIG_SCHEMAS = new Set(["0.1.0", "1.0.0", "2.0.0"]);

function createCommands(services) {
  const { create } = createCreateCommand(services);
  const { add } = createAddCommand(services);
  const { docs, info, list, search, view } = createDiscoveryCommand(services);
  const { migrate } = createMigrationCommand(services);
  const { remove } = createRemoveCommand(services);
  const {
    cwd,
    cliPackage,
    command,
    itemName,
    option,
    hasFlag,
    defaultComponentsDirectory,
    help,
    DEFAULT_REGISTRY,
    isUrl,
    assertRemoteProtocol,
    readConfig,
    registryLocation,
    readManifest,
    STATE_FILENAME,
    LOCK_CONTENT_HASH,
    acquireCommandLock,
    releaseCommandLock,
    recoverInterruptedTransactions,
    applyTransaction,
    collectItems,
    readState,
    registryMetadata,
    registryFiles,
    itemMetadata,
    classifyFile,
    formatDrift,
    hashContent,
    resolveInstalledTarget,
    resolveTarget,
    collectTailwindSetupProblems,
    stateDiagnostics,
  } = services;

  async function init() {
    const target = path.join(cwd, "nerio.json");
    if (fs.existsSync(target)) {
      throw new Error("nerio.json already exists.");
    }

    const configuredRegistry = option("--registry") || DEFAULT_REGISTRY;
    if (isUrl(configuredRegistry)) assertRemoteProtocol(configuredRegistry);
    const config = {
      schemaVersion: "1.0.0",
      registry: configuredRegistry,
      components: option("--components") || defaultComponentsDirectory(),
    };
    fs.writeFileSync(target, `${JSON.stringify(config, null, 2)}\n`);
    console.log("Created nerio.json");
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
    const upstreamFiles = await registryFiles(
      manifest.__registryLocation || registry,
      newItems,
      config.components,
    );

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
      throw new Error(
        "Usage: nerio diff [component] [--registry <path-or-url>] [--allow-insecure-http]",
      );
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
        "Usage: nerio update [component] [--registry <path-or-url>] [--dry-run] [--force] [--allow-insecure-http]",
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

    const nextState = globalThis.structuredClone(state);
    const operations = [];
    const validations = [];
    const componentsRoot = path.resolve(cwd, config.components);
    for (const entry of plan.entries) {
      const absolute = resolveInstalledTarget(config.components, entry.target);
      validations.push({
        target: absolute,
        root: componentsRoot,
        expectedExists: entry.existsLocally,
        expectedHash: entry.localHash,
      });
      if (!entry.upstream && !entry.owners.length) {
        if (
          entry.existsLocally &&
          (!entry.status.includes("locally modified") || hasFlag("--force"))
        ) {
          operations.push({
            type: "delete",
            target: absolute,
            root: componentsRoot,
            expectedExists: entry.existsLocally,
            expectedHash: entry.localHash,
          });
        }
        delete nextState.files[entry.target];
        continue;
      }

      const shouldWrite =
        entry.upstream &&
        (["added", "upstream changed"].includes(entry.status) ||
          (conflictStatus(entry.status) && hasFlag("--force")));
      if (shouldWrite) {
        operations.push({
          type: "write",
          target: absolute,
          content: entry.upstream.content,
          root: componentsRoot,
          expectedExists: entry.existsLocally,
          expectedHash: entry.localHash,
        });
      }

      const preserveBaseline = ["locally modified", "locally removed"].includes(entry.status);
      const metadata = {
        hash: preserveBaseline
          ? entry.previous?.hash
          : entry.upstream?.hash || entry.previous?.hash,
        integrity: preserveBaseline
          ? entry.previous?.integrity
          : entry.upstream?.integrity || entry.previous?.integrity,
        role: entry.upstream?.role || entry.previous?.role,
        source: entry.upstream?.source || entry.previous?.source,
      };
      if (!metadata.hash || !metadata.role || !metadata.source) {
        throw new Error(`Cannot record complete update metadata for ${entry.target}.`);
      }
      nextState.files[entry.target] = {
        ...metadata,
        integrity: metadata.integrity || `sha256-${metadata.hash}`,
        owners: entry.owners,
      };
    }

    nextState.items = plan.nextItems;
    nextState.registry = registryMetadata(manifest);
    nextState.nerioVersion = cliPackage.version;
    applyTransaction(operations, nextState, state[LOCK_CONTENT_HASH] ?? null, validations);
    console.log(`Updated source metadata in ${STATE_FILENAME}.`);
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
    if (config.schemaVersion !== "2.0.0" && manifest.version !== cliPackage.version) {
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

  async function run() {
    if (hasFlag("--help") || hasFlag("-h")) {
      console.log(help(command));
      return;
    }
    if (["add", "remove", "diff", "update"].includes(command)) {
      const config = readConfig(false);
      if (config?.schemaVersion === "2.0.0") {
        throw new Error(
          "nerio.json schema 2 source mutations require namespaced lock and graph support. Use list, search, or doctor until the schema 2 migration is applied.",
        );
      }
    }
    const guardedCommand = [
      "init",
      "add",
      "remove",
      "migrate",
      "diff",
      "update",
      "doctor",
    ].includes(command);
    const recoveryCommand = ["add", "remove", "migrate", "diff", "update", "doctor"].includes(
      command,
    );
    const lock = guardedCommand ? await acquireCommandLock() : null;
    let commandError;
    try {
      if (recoveryCommand) {
        recoverInterruptedTransactions(hasFlag("--json") ? console.error : console.log);
      }

      if (command === "create") await create();
      else if (command === "init") await init();
      else if (command === "add") await add();
      else if (command === "remove") await remove();
      else if (command === "migrate") await migrate();
      else if (command === "diff") await diff(itemName);
      else if (command === "update") await update(itemName);
      else if (command === "list") await list();
      else if (command === "info") await info();
      else if (command === "search") await search();
      else if (command === "view") await view();
      else if (command === "docs") await docs();
      else if (command === "doctor") await doctor();
      else {
        console.log(help("root"));
        process.exitCode = command ? 1 : 0;
      }
    } catch (error) {
      commandError = error;
    }
    let releaseError;
    if (lock) {
      try {
        releaseCommandLock(lock);
      } catch (error) {
        releaseError = error;
      }
    }
    if (commandError && releaseError) {
      console.error(
        `Registry lock release also failed: ${
          releaseError instanceof Error ? releaseError.message : String(releaseError)
        }`,
      );
    }
    if (commandError) throw commandError;
    if (releaseError) throw releaseError;
  }

  return { run };
}

module.exports = { createCommands };
