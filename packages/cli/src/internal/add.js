const fs = require("node:fs");
const path = require("node:path");

const ADD_OUTPUT_SCHEMA_VERSION = "1.0.0";

function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function createAddCommand(services) {
  const {
    cwd,
    cliPackage,
    addItemNames,
    hasFlag,
    readConfig,
    registryLocation,
    readManifest,
    STATE_FILENAME,
    LOCK_CONTENT_HASH,
    applyTransaction,
    collectItems,
    readState,
    emptyState,
    registryMetadata,
    registryFiles,
    itemMetadata,
    hashContent,
    isTokenStylesTarget,
  } = services;

  function usageError() {
    return new Error(
      "Usage: nerio add <component...> [--all] [--registry <path-or-url>] [--dry-run] [--json] [--overwrite] [--allow-insecure-http]",
    );
  }

  function selectRequestedItems(manifest) {
    const explicit = sortedUnique(addItemNames);
    if (hasFlag("--all") && explicit.length) {
      throw new Error("nerio add --all cannot be combined with explicit Registry items.");
    }
    if (hasFlag("--all")) {
      const allItems = manifest.items
        .map((item) => item.name)
        .sort((left, right) => left.localeCompare(right));
      if (!allItems.length) throw new Error("The configured Registry exposes no items.");
      return allItems;
    }
    if (!explicit.length) throw usageError();
    return explicit;
  }

  function selectionLabel(requestedNames, items) {
    if (hasFlag("--all")) return `all ${requestedNames.length} Registry items`;
    if (requestedNames.length === 1) return items.get(requestedNames[0]).title;
    return `${requestedNames.length} requested Registry items (${requestedNames.join(", ")})`;
  }

  function fileAction({ relative, existed, content, existingHash, tracked, upstreamContent }) {
    if (!existed) return "write";
    if (hasFlag("--overwrite")) return "overwrite";
    if (content === upstreamContent) return "unchanged";
    if (isTokenStylesTarget(relative)) return "preserved";
    if (tracked && existingHash !== tracked.hash) return "conflict-local-modification";
    return "conflict-existing-content";
  }

  function printHumanPlan(result, label) {
    const { summary } = result;
    const prefix = result.status === "blocked" ? "Cannot add" : "Would add";
    console.log(
      `${prefix} ${label}: ${summary.writes} files to write, ${summary.unchanged} unchanged, ${summary.conflicts} conflicts.`,
    );
    for (const file of result.files) console.log(`- ${file.action}\t${file.path}`);
  }

  function printResult(result, label) {
    if (hasFlag("--json")) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    if (result.status !== "applied") {
      printHumanPlan(result, label);
      if (result.packageDependencies.length) {
        console.log(`Package dependencies: ${result.packageDependencies.join(", ")}`);
      }
      return;
    }
    console.log(
      `Added ${label}: ${result.summary.writes} files written, ${result.summary.unchanged} unchanged.`,
    );
    console.log(`Recorded exact source metadata in ${STATE_FILENAME}.`);
    if (result.packageDependencies.length) {
      console.log(`Package dependencies: ${result.packageDependencies.join(", ")}`);
    }
  }

  async function add() {
    const config = readConfig(true);
    if (!config.components || typeof config.components !== "string") {
      throw new Error("nerio.json must define a components directory.");
    }

    const registry = registryLocation(config);
    const manifest = await readManifest(registry);
    const requestedNames = selectRequestedItems(manifest);
    const collected = new Map();
    for (const name of requestedNames) collectItems(manifest, name, collected);
    const items = new Map([...collected].sort(([left], [right]) => left.localeCompare(right)));
    const upstreamFiles = await registryFiles(
      manifest.__registryLocation || registry,
      items,
      config.components,
    );
    const state = readState(false) || emptyState(manifest);
    const componentsRoot = path.resolve(cwd, config.components);
    const files = [];
    const operations = [];
    const validations = [];

    for (const [relative, file] of [...upstreamFiles].sort(([left], [right]) =>
      left.localeCompare(right),
    )) {
      const target = path.resolve(cwd, relative);
      const existed = fs.existsSync(target);
      const content = existed ? fs.readFileSync(target, "utf8") : undefined;
      const existingHash = existed ? hashContent(content) : undefined;
      const action = fileAction({
        relative,
        existed,
        content,
        existingHash,
        tracked: state.files[relative],
        upstreamContent: file.content,
      });
      validations.push({
        target,
        root: componentsRoot,
        expectedExists: existed,
        expectedHash: existingHash,
      });
      files.push({
        path: relative,
        action,
        owners: sortedUnique(file.owners),
      });
      if (["write", "overwrite"].includes(action)) {
        operations.push({
          type: "write",
          target,
          content: file.content,
          root: componentsRoot,
          expectedExists: existed,
          expectedHash: existingHash,
        });
      }
    }

    const conflicts = files.filter((file) => file.action.startsWith("conflict-"));
    const packageDependencies = sortedUnique(
      [...items.values()].flatMap((item) => item.dependencies || []),
    );
    const dryRun = hasFlag("--dry-run");
    const result = {
      schemaVersion: ADD_OUTPUT_SCHEMA_VERSION,
      command: "add",
      status: conflicts.length ? "blocked" : dryRun ? "planned" : "applied",
      dryRun,
      all: hasFlag("--all"),
      registry: registryMetadata(manifest),
      requestedItems: requestedNames,
      resolvedItems: [...items.keys()],
      packageDependencies,
      files,
      summary: {
        requestedItems: requestedNames.length,
        resolvedItems: items.size,
        files: files.length,
        writes: operations.length,
        unchanged: files.filter((file) => ["unchanged", "preserved"].includes(file.action)).length,
        conflicts: conflicts.length,
      },
    };
    const label = selectionLabel(requestedNames, items);

    if (conflicts.length) {
      printResult(result, label);
      throw new Error(
        `Add stopped before writing because ${conflicts.length} target file(s) conflict. Keep local modifications and use nerio diff/update, or re-run add with --overwrite intentionally.`,
      );
    }
    if (dryRun) {
      printResult(result, label);
      return;
    }

    const nextState = globalThis.structuredClone(state);
    const actionsByPath = new Map(files.map((file) => [file.path, file.action]));
    nextState.registry = registryMetadata(manifest);
    nextState.nerioVersion = cliPackage.version;
    nextState.requestedItems = sortedUnique([...nextState.requestedItems, ...requestedNames]);
    for (const item of items.values()) {
      nextState.items[item.name] = itemMetadata(item, manifest);
    }
    for (const [relative, file] of upstreamFiles) {
      const previous = nextState.files[relative];
      const action = actionsByPath.get(relative);
      nextState.files[relative] = {
        hash: ["write", "overwrite"].includes(action) ? file.hash : previous?.hash || file.hash,
        integrity: file.integrity,
        role: file.role,
        source: file.source,
        owners: sortedUnique([...(previous?.owners || []), ...file.owners]),
      };
    }
    applyTransaction(operations, nextState, state[LOCK_CONTENT_HASH] ?? null, validations);
    printResult(result, label);
  }

  return { add };
}

module.exports = { ADD_OUTPUT_SCHEMA_VERSION, createAddCommand };
