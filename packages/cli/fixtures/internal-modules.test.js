const assert = require("node:assert/strict");
const { Buffer } = require("node:buffer");
const fs = require("node:fs");
const os = require("node:os");
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
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "add.js")).isFile());
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "discovery.js")).isFile());
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "remove.js")).isFile());
});

test("presentation, transport, diagnostics, and transactions stay separated", () => {
  const commands = read("internal/commands.js");
  const add = read("internal/add.js");
  const remove = read("internal/remove.js");
  const diagnostics = read("internal/diagnostics.js");
  const discovery = read("internal/discovery.js");
  const registry = read("internal/registry.js");
  const workspace = read("internal/workspace.js");

  assert.doesNotMatch(commands, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES/);
  assert.match(commands, /createAddCommand/);
  assert.match(commands, /createRemoveCommand/);
  assert.match(commands, /createDiscoveryCommand/);
  assert.doesNotMatch(commands, /async function add/);
  assert.doesNotMatch(add, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES|TRANSACTION_PREFIX/);
  assert.doesNotMatch(remove, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES|TRANSACTION_PREFIX/);
  assert.doesNotMatch(discovery, /applyTransaction|nerio\.lock\.json|worker_threads/);
  assert.doesNotMatch(diagnostics, /worker_threads|readRemoteText|applyTransaction/);
  assert.doesNotMatch(registry, /TRANSACTION_PREFIX|nerio\.lock\.json|Worker/);
  assert.doesNotMatch(workspace, /Usage: nerio|function help|process\.argv/);
});

test("search positional parsing excludes option values and keeps a multi-word query", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const parsed = createCommandLine(process.cwd(), [
    "search",
    "keyboard",
    "navigation",
    "--limit",
    "5",
    "--registry",
    "./registry.json",
    "--json",
  ]);
  assert.deepEqual(parsed.positionalArguments, ["keyboard", "navigation"]);
});

test("remove positional parsing excludes option values and keeps every explicit item", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const parsed = createCommandLine(process.cwd(), [
    "remove",
    "button",
    "--registry",
    "./registry.json",
    "card",
    "button",
    "--dry-run",
  ]);
  assert.deepEqual(parsed.removeItemNames, ["button", "card", "button"]);
});

test("add positional parsing excludes option values and keeps every explicit item", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const parsed = createCommandLine(process.cwd(), [
    "add",
    "button",
    "--registry",
    "./registry.json",
    "card",
    "button",
    "--dry-run",
  ]);
  assert.deepEqual(parsed.addItemNames, ["button", "card", "button"]);
});

test("registry file planning fetches one shared source for every owner", async (context) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-shared-source-"));
  context.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  let reads = 0;
  const { createWorkspace } = require("../src/internal/workspace");
  const { registryFiles } = createWorkspace({
    cwd,
    cliPackage: { version: "1.0.0-test" },
    readConfig: () => ({}),
    readText: async () => {
      reads += 1;
      return "export const shared = true;\n";
    },
    resolveSource: (registry, source) => `${registry}/${source}`,
  });
  const sharedFile = { target: "shared.ts", source: "shared.ts", role: "utility" };
  const files = await registryFiles(
    "https://registry.example/source",
    new Map([
      ["alpha", { name: "alpha", files: [sharedFile] }],
      ["beta", { name: "beta", files: [sharedFile] }],
    ]),
    "components",
  );

  assert.equal(reads, 1);
  assert.deepEqual(files.get("components/shared.ts").owners, ["alpha", "beta"]);
});
