const assert = require("node:assert/strict");
const { Buffer } = require("node:buffer");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const cliRoot = path.resolve(__dirname, "..");
const sourceRoot = path.join(cliRoot, "src");

function read(relative) {
  return fs.readFileSync(path.join(sourceRoot, relative), "utf8");
}

test("the CLI entrypoint only composes bounded internal modules", () => {
  const entrypoint = read("index.js");
  assert.ok(Buffer.byteLength(entrypoint) < 2_000);
  for (const module of ["command-line", "commands", "diagnostics", "registry", "workspace"]) {
    assert.match(entrypoint, new RegExp(`internal/${module}`));
    assert.ok(fs.statSync(path.join(sourceRoot, "internal", `${module}.js`)).isFile());
  }
});

test("presentation, transport, diagnostics, and transactions stay separated", () => {
  const commands = read("internal/commands.js");
  const diagnostics = read("internal/diagnostics.js");
  const registry = read("internal/registry.js");
  const workspace = read("internal/workspace.js");

  assert.doesNotMatch(commands, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES/);
  assert.doesNotMatch(diagnostics, /worker_threads|readRemoteText|applyTransaction/);
  assert.doesNotMatch(registry, /TRANSACTION_PREFIX|nerio\.lock\.json|Worker/);
  assert.doesNotMatch(workspace, /Usage: nerio|function help|process\.argv/);
});
