const fs = require("node:fs");
const path = require("node:path");

const REMOVE_OUTPUT_SCHEMA_VERSION = "1.0.0";

function sortedUnique(values) {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function createRemoveCommand(services) {
  const {
    cwd,
    cliPackage,
    removeItemNames,
    hasFlag,
    readConfig,
    STATE_FILENAME,
    LOCK_CONTENT_HASH,
    applyTransaction,
    readState,
    hashContent,
    resolveInstalledTarget,
    resolveTarget,
  } = services;

  function usageError() {
    return new Error("Usage: nerio remove <component...> [--dry-run] [--json] [--force]");
  }

  function collectStateItems(state, name, collected = new Set()) {
    const item = state.items[name];
    if (!item) {
      throw new Error(
        `Cannot determine a safe removal because ${name} is missing from ${STATE_FILENAME} item metadata.`,
      );
    }
    if (collected.has(name)) return collected;
    collected.add(name);
    for (const dependency of item.registryDependencies || []) {
      collectStateItems(state, dependency, collected);
    }
    return collected;
  }

  function printHumanPlan(result) {
    const { summary } = result;
    const prefix = result.status === "blocked" ? "Cannot remove" : "Would remove";
    console.log(
      `${prefix} direct request(s) ${result.requestedItems.join(", ")}: ${summary.removedItems} source items no longer referenced, ${summary.deletes} files to delete, ${summary.preserved} shared files preserved, ${summary.missing} already missing, ${summary.conflicts} conflicts.`,
    );
    for (const file of result.files) console.log(`- ${file.action}\t${file.path}`);
  }

  function printResult(result) {
    if (hasFlag("--json")) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }
    if (result.status !== "applied") {
      printHumanPlan(result);
      return;
    }
    console.log(
      `Removed direct request(s) ${result.requestedItems.join(", ")}: ${result.summary.removedItems} source items became unreferenced, ${result.summary.deletes} files deleted, ${result.summary.preserved} shared files preserved, ${result.summary.missing} already missing.`,
    );
    console.log(`Updated exact source metadata in ${STATE_FILENAME}.`);
  }

  function ambiguousFile(pathname, removedOwners = [], remainingOwners = []) {
    return {
      path: pathname,
      action: "conflict-ambiguous-ownership",
      removedOwners: sortedUnique(removedOwners),
      remainingOwners: sortedUnique(remainingOwners),
    };
  }

  function itemOwnsTarget(config, item, absolute) {
    if (!item || !Array.isArray(item.files)) return false;
    return item.files.some(
      (target) =>
        typeof target === "string" &&
        target &&
        resolveTarget(config.components, target) === absolute,
    );
  }

  async function remove() {
    const requestedNames = sortedUnique(removeItemNames);
    if (!requestedNames.length) throw usageError();

    const config = readConfig(true);
    if (!config.components || typeof config.components !== "string") {
      throw new Error("nerio.json must define a components directory.");
    }
    const state = readState(true);
    for (const name of requestedNames) {
      if (!state.requestedItems.includes(name)) {
        throw new Error(`${name} is not recorded as a directly installed Registry item.`);
      }
    }

    const remainingRequested = state.requestedItems.filter(
      (name) => !requestedNames.includes(name),
    );
    const selectedClosure = new Set();
    for (const name of requestedNames) collectStateItems(state, name, selectedClosure);
    const remainingClosure = new Set();
    for (const name of remainingRequested) collectStateItems(state, name, remainingClosure);
    const removedNames = new Set(
      [...selectedClosure].filter((name) => !remainingClosure.has(name)),
    );

    const componentsRoot = path.resolve(cwd, config.components);
    const trackedByAbsolute = new Map();
    const files = [];
    const operations = [];
    const validations = [];
    const ambiguousPaths = new Set();

    const trackedEntries = Object.entries(state.files).map(([storedTarget, metadata]) => ({
      storedTarget,
      metadata,
      absolute: resolveInstalledTarget(config.components, storedTarget),
    }));
    const duplicateTargets = new Set();
    for (const entry of trackedEntries) {
      if (trackedByAbsolute.has(entry.absolute)) duplicateTargets.add(entry.absolute);
      else trackedByAbsolute.set(entry.absolute, entry);
    }

    for (const { storedTarget, metadata, absolute } of trackedEntries) {
      const removedOwners = metadata.owners.filter((owner) => removedNames.has(owner));
      if (!removedOwners.length) continue;
      const remainingOwners = metadata.owners.filter((owner) => !removedNames.has(owner));
      const declaredOwners = Object.keys(state.items)
        .filter((owner) => itemOwnsTarget(config, state.items[owner], absolute))
        .sort((left, right) => left.localeCompare(right));
      const recordedOwners = sortedUnique(metadata.owners);
      const ownershipMismatch =
        declaredOwners.length !== recordedOwners.length ||
        declaredOwners.some((owner, index) => owner !== recordedOwners[index]);
      if (ownershipMismatch || duplicateTargets.has(absolute)) {
        files.push(ambiguousFile(storedTarget, removedOwners, remainingOwners));
        ambiguousPaths.add(storedTarget);
        continue;
      }

      const exists = fs.existsSync(absolute);
      const localHash = exists ? hashContent(fs.readFileSync(absolute)) : undefined;
      let action;
      if (!exists) action = "already-missing";
      else if (remainingOwners.length) action = "preserved-shared";
      else if (localHash === metadata.hash) action = "delete";
      else if (hasFlag("--force")) action = "delete-modified";
      else action = "conflict-local-modification";

      files.push({
        path: storedTarget,
        action,
        removedOwners: sortedUnique(removedOwners),
        remainingOwners: sortedUnique(remainingOwners),
      });
      if (["delete", "delete-modified"].includes(action)) {
        operations.push({
          type: "delete",
          target: absolute,
          root: componentsRoot,
          expectedExists: exists,
          expectedHash: localHash,
        });
      }
      if (!remainingOwners.length) {
        validations.push({
          target: absolute,
          root: componentsRoot,
          expectedExists: exists,
          expectedHash: localHash,
        });
      }
    }

    for (const name of removedNames) {
      const item = state.items[name];
      if (!Array.isArray(item.files)) {
        const marker = `[${name} item metadata]`;
        if (!ambiguousPaths.has(marker)) files.push(ambiguousFile(marker, [name]));
        ambiguousPaths.add(marker);
        continue;
      }
      for (const target of item.files) {
        if (typeof target !== "string" || !target) {
          const marker = `[${name} item metadata]`;
          if (!ambiguousPaths.has(marker)) files.push(ambiguousFile(marker, [name]));
          ambiguousPaths.add(marker);
          continue;
        }
        const absolute = resolveTarget(config.components, target);
        const tracked = trackedByAbsolute.get(absolute);
        if (tracked?.metadata.owners.includes(name)) continue;
        const storedTarget = path.relative(cwd, absolute);
        if (!ambiguousPaths.has(storedTarget)) {
          files.push(ambiguousFile(storedTarget, [name]));
          ambiguousPaths.add(storedTarget);
        }
      }
    }

    files.sort((left, right) => left.path.localeCompare(right.path));
    const conflicts = files.filter((file) => file.action.startsWith("conflict-"));
    const dryRun = hasFlag("--dry-run");
    const result = {
      schemaVersion: REMOVE_OUTPUT_SCHEMA_VERSION,
      command: "remove",
      status: conflicts.length ? "blocked" : dryRun ? "planned" : "applied",
      dryRun,
      force: hasFlag("--force"),
      requestedItems: requestedNames,
      removedItems: sortedUnique(removedNames),
      files,
      summary: {
        requestedItems: requestedNames.length,
        removedItems: removedNames.size,
        files: files.length,
        deletes: files.filter((file) => ["delete", "delete-modified"].includes(file.action)).length,
        preserved: files.filter((file) => file.action === "preserved-shared").length,
        missing: files.filter((file) => file.action === "already-missing").length,
        conflicts: conflicts.length,
      },
    };

    if (conflicts.length) {
      printResult(result);
      const guidance = [];
      if (conflicts.some((file) => file.action === "conflict-local-modification")) {
        guidance.push("review local modifications before removal");
        guidance.push(
          "re-run remove with --force to delete every reported modified target intentionally",
        );
      }
      if (conflicts.some((file) => file.action === "conflict-ambiguous-ownership")) {
        guidance.push(`repair or recreate ${STATE_FILENAME} ownership metadata`);
      }
      throw new Error(
        `Remove stopped before writing because ${conflicts.length} tracked file(s) cannot be removed safely. ${guidance.join("; ")}.`,
      );
    }
    if (dryRun) {
      printResult(result);
      return;
    }

    const nextState = globalThis.structuredClone(state);
    nextState.nerioVersion = cliPackage.version;
    nextState.requestedItems = remainingRequested;
    for (const name of removedNames) delete nextState.items[name];
    for (const file of files) {
      if (file.remainingOwners.length) {
        nextState.files[file.path].owners = file.remainingOwners;
      } else {
        delete nextState.files[file.path];
      }
    }
    applyTransaction(operations, nextState, state[LOCK_CONTENT_HASH] ?? null, validations);
    printResult(result);
  }

  return { remove };
}

module.exports = { REMOVE_OUTPUT_SCHEMA_VERSION, createRemoveCommand };
