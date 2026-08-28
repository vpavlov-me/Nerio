const fs = require("node:fs");
const path = require("node:path");

function createCommandLine(cwd, args) {
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
        "Usage: nerio add <component> [--registry <path-or-url>] [--dry-run] [--overwrite] [--allow-insecure-http]",
        "",
        "Install an editable source component, its registry dependencies, and exact source metadata.",
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
        "  nerio diff     Inspect local and upstream source drift",
        "  nerio update   Preview or apply non-destructive source updates",
        "  nerio list     List registry components",
        "  nerio info     Show metadata for one component",
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

  return { command, itemName, option, hasFlag, defaultComponentsDirectory, help };
}

module.exports = { createCommandLine };
