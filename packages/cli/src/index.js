#!/usr/bin/env node
const cliPackage = require("../package.json");
const { createCommandLine } = require("./internal/command-line");
const { createRegistry } = require("./internal/registry");
const { createWorkspace } = require("./internal/workspace");
const { createDiagnostics } = require("./internal/diagnostics");
const { createCommands } = require("./internal/commands");

const cwd = process.cwd();
const commandLine = createCommandLine(cwd, process.argv.slice(2));
const registry = createRegistry({ cwd, cliPackage, ...commandLine });
const workspace = createWorkspace({ cwd, cliPackage, ...registry });
const diagnostics = createDiagnostics({ cwd, cliPackage, ...workspace });
const commands = createCommands({
  cwd,
  cliPackage,
  ...commandLine,
  ...registry,
  ...workspace,
  ...diagnostics,
});

commands.run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
