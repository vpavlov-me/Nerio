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
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "create.js")).isFile());
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "discovery.js")).isFile());
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "migrate.js")).isFile());
  assert.ok(fs.statSync(path.join(sourceRoot, "internal", "remove.js")).isFile());
});

test("presentation, transport, diagnostics, and transactions stay separated", () => {
  const commands = read("internal/commands.js");
  const add = read("internal/add.js");
  const create = read("internal/create.js");
  const remove = read("internal/remove.js");
  const diagnostics = read("internal/diagnostics.js");
  const discovery = read("internal/discovery.js");
  const migrate = read("internal/migrate.js");
  const registry = read("internal/registry.js");
  const workspace = read("internal/workspace.js");

  assert.doesNotMatch(commands, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES/);
  assert.match(commands, /createAddCommand/);
  assert.match(commands, /createCreateCommand/);
  assert.match(commands, /createRemoveCommand/);
  assert.match(commands, /createDiscoveryCommand/);
  assert.match(commands, /createMigrationCommand/);
  assert.doesNotMatch(commands, /async function add/);
  assert.doesNotMatch(add, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES|TRANSACTION_PREFIX/);
  assert.doesNotMatch(create, /readManifest|registryLocation|child_process|eval|Function\(/);
  assert.doesNotMatch(remove, /worker_threads|REMOTE_(?:SOURCE|MANIFEST)_BYTES|TRANSACTION_PREFIX/);
  assert.doesNotMatch(discovery, /applyTransaction|nerio\.lock\.json|worker_threads/);
  assert.doesNotMatch(migrate, /readManifest|registryLocation|eval|Function\(/);
  assert.doesNotMatch(diagnostics, /worker_threads|readRemoteText|applyTransaction/);
  assert.doesNotMatch(registry, /TRANSACTION_PREFIX|nerio\.lock\.json|Worker/);
  assert.doesNotMatch(workspace, /Usage: nerio|function help|process\.argv/);
});

test("create parsing keeps one directory and excludes framework and profile values", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const parsed = createCommandLine(process.cwd(), [
    "create",
    "my-app",
    "--framework",
    "next",
    "--profile",
    "current",
    "--json",
  ]);
  assert.deepEqual(parsed.positionalArguments, ["my-app"]);
  assert.equal(parsed.option("--framework"), "next");
  assert.equal(parsed.option("--profile"), "current");
});

test("search parsing preserves create-only options as query terms", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const parsed = createCommandLine(process.cwd(), ["search", "--framework", "next"]);
  assert.deepEqual(parsed.positionalArguments, ["--framework", "next"]);
});

test("create current profile matches coordinated release and dependency support metadata", () => {
  const release = require("../../../quality/release-metadata.json");
  const support = require("../../../quality/dependency-support.json").profiles.current;
  const { CORE_VERSION, CREATE_PROFILE, CREATE_VERSIONS } = require("../src/internal/create");
  assert.equal(CREATE_PROFILE, "current");
  assert.equal(CORE_VERSION, release.coreVersion);
  assert.deepEqual(CREATE_VERSIONS, {
    next: support.next,
    react: support.react,
    reactDom: support.reactDom,
    tailwindcss: support.tailwindcss,
    typescript: support.typescript,
    vite: support.vite,
  });
});

test("create detects replacement of its validated parent directory", () => {
  const {
    assertDirectoryIdentity,
    bindDirectory,
    directoryIdentity,
    hasDirectoryIdentity,
  } = require("../src/internal/create");
  const previousCwd = process.cwd();
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-create-parent-"));
  const replacement = `${directory}-replacement`;
  try {
    const identity = directoryIdentity(directory);
    fs.renameSync(directory, replacement);
    fs.mkdirSync(directory);
    assert.throws(
      () => assertDirectoryIdentity(directory, identity),
      /target parent changed during project creation/,
    );
    fs.rmSync(directory, { recursive: true });
    fs.renameSync(replacement, directory);
    const boundIdentity = directoryIdentity(directory);
    bindDirectory(directory, boundIdentity);
    fs.renameSync(directory, replacement);
    fs.mkdirSync(directory);
    fs.writeFileSync("bound-marker", "bound\n");
    assert.equal(fs.existsSync(path.join(replacement, "bound-marker")), true);
    assert.equal(fs.existsSync(path.join(directory, "bound-marker")), false);
    assert.throws(
      () => assertDirectoryIdentity(directory, boundIdentity),
      /target parent changed during project creation/,
    );
    assert.equal(hasDirectoryIdentity(directory, boundIdentity), false);
    assert.equal(hasDirectoryIdentity(".", boundIdentity), true);
    fs.rmSync("bound-marker");
    assert.equal(fs.existsSync(path.join(replacement, "bound-marker")), false);
  } finally {
    process.chdir(previousCwd);
    fs.rmSync(directory, { recursive: true, force: true });
    fs.rmSync(replacement, { recursive: true, force: true });
  }
});

test("migrate positional parsing keeps the explicit target and version route", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const parsed = createCommandLine(process.cwd(), [
    "migrate",
    "config",
    "0.1.0",
    "1.0.0",
    "--apply",
    "--json",
  ]);
  assert.deepEqual(parsed.migrationArguments, ["config", "0.1.0", "1.0.0"]);
  assert.equal(parsed.hasFlag("--apply"), true);
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

test("search positional parsing preserves token queries and the end-of-options boundary", () => {
  const { createCommandLine } = require("../src/internal/command-line");
  const direct = createCommandLine(process.cwd(), ["search", "--n-card-padding-inline", "--json"]);
  const bounded = createCommandLine(process.cwd(), ["search", "--", "--json"]);
  assert.deepEqual(direct.positionalArguments, ["--n-card-padding-inline"]);
  assert.deepEqual(bounded.positionalArguments, ["--json"]);
  assert.equal(bounded.hasFlag("--json"), false);
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
