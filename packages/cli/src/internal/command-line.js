const fs = require("node:fs");
const path = require("node:path");

function createCommandLine(cwd, args) {
  const command = args[0];
  const valueOptions = new Set(["--components", "--limit", "--registry"]);
  const flagOptions = new Set([
    "--all",
    "--allow-insecure-http",
    "--dry-run",
    "--force",
    "--help",
    "--json",
    "--overwrite",
  ]);
  const optionBoundary = args.indexOf("--");
  const optionArguments = optionBoundary === -1 ? args : args.slice(0, optionBoundary);
  const positionalArguments = [];
  for (let index = 1; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--") {
      positionalArguments.push(...args.slice(index + 1));
      break;
    } else if (valueOptions.has(argument)) {
      index += 1;
    } else if (!argument.startsWith("-") || (command === "search" && !flagOptions.has(argument))) {
      positionalArguments.push(argument);
    }
  }
  const itemName =
    ["add", "diff", "info", "update"].includes(command) && !args[1]?.startsWith("--")
      ? args[1]
      : undefined;
  const addItemNames = command === "add" ? positionalArguments : [];
  const removeItemNames = command === "remove" ? positionalArguments : [];

  function option(name) {
    const index = optionArguments.indexOf(name);
    return index >= 0 ? optionArguments[index + 1] : undefined;
  }

  function hasFlag(name) {
    return optionArguments.includes(name);
  }

  function defaultComponentsDirectory() {
    const usesSourceDirectory =
      fs.existsSync(path.join(cwd, "src", "app")) || fs.existsSync(path.join(cwd, "src", "pages"));

    return usesSourceDirectory ? "src/components/nerio" : "components/nerio";
  }

  function help(commandName) {
    const sections = {
      init: [
        "Usage: nerio init [--registry <path-or-url>] [--components <directory>] [--allow-insecure-http]",
        "",
        "Create nerio.json for source-installed components.",
        "Defaults to src/components/nerio for src-dir applications and components/nerio otherwise.",
      ],
      add: [
        "Usage: nerio add <component...> [--all] [--registry <path-or-url>] [--dry-run] [--json] [--overwrite] [--allow-insecure-http]",
        "",
        "Install one or more editable source items and their dependency union in one transaction.",
      ],
      remove: [
        "Usage: nerio remove <component...> [--dry-run] [--json] [--force]",
        "",
        "Remove direct source items and dependencies no longer referenced by another direct item.",
      ],
      diff: [
        "Usage: nerio diff [component] [--registry <path-or-url>] [--allow-insecure-http]",
        "",
        "Compare installed source with its recorded baseline and the configured Registry.",
      ],
      update: [
        "Usage: nerio update [component] [--registry <path-or-url>] [--dry-run] [--force] [--allow-insecure-http]",
        "",
        "Apply safe upstream source changes without overwriting local modifications.",
      ],
      list: [
        "Usage: nerio list [--registry <path-or-url>] [--allow-insecure-http]",
        "",
        "List component names, titles, and categories from the configured registry.",
      ],
      info: [
        "Usage: nerio info <component> [--registry <path-or-url>] [--allow-insecure-http]",
        "",
        "Show registry metadata, dependencies, tokens, files, and usage for one component.",
      ],
      search: [
        "Usage: nerio search <query...> [--limit <1-50>] [--registry <path-or-url>] [--json] [--allow-insecure-http]",
        "",
        "Search documented Registry metadata without installing source.",
      ],
      view: [
        "Usage: nerio view <component> [--registry <path-or-url>] [--json] [--allow-insecure-http]",
        "",
        "Inspect one Registry item's source, file, integrity, and dependency metadata.",
      ],
      docs: [
        "Usage: nerio docs <component> [--registry <path-or-url>] [--json] [--allow-insecure-http]",
        "",
        "Inspect one Registry item's usage and accessibility documentation.",
      ],
      doctor: [
        "Usage: nerio doctor [--registry <path-or-url>] [--allow-insecure-http]",
        "",
        "Validate nerio.json and the configured registry manifest.",
      ],
      root: [
        "Usage: nerio <command> [options]",
        "",
        "Commands:",
        "  nerio init     Create nerio.json",
        "  nerio add      Install editable source components",
        "  nerio remove   Safely remove directly installed source components",
        "  nerio diff     Inspect local and upstream source drift",
        "  nerio update   Preview or apply non-destructive source updates",
        "  nerio list     List registry components",
        "  nerio info     Show metadata for one component",
        "  nerio search   Search documented registry metadata",
        "  nerio view     Inspect source and dependency metadata",
        "  nerio docs     Inspect usage and accessibility guidance",
        "  nerio doctor   Validate configuration and registry metadata",
        "",
        "Recommended local install: pnpm add -D @nerio-ui/registry@1.0.0-beta.1 @nerio-ui/cli@1.0.0-beta.1",
        "Run local commands with: pnpm exec nerio <command> [options]",
        "One-off example: pnpm dlx @nerio-ui/cli@1.0.0-beta.1 init",
        "",
        "Run nerio <command> --help for command options.",
      ],
    };

    return (sections[commandName] || sections.root).join("\n");
  }

  return {
    command,
    itemName,
    addItemNames,
    removeItemNames,
    positionalArguments,
    option,
    hasFlag,
    defaultComponentsDirectory,
    help,
  };
}

module.exports = { createCommandLine };
