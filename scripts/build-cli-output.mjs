import { chmodSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";
import { minify } from "terser";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(root, "packages/cli/dist");
const outputFile = resolve(outputDirectory, "index.cjs");

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

await build({
  bundle: true,
  entryPoints: [resolve(root, "packages/cli/src/index.js")],
  external: ["@nerio-ui/registry/*"],
  format: "cjs",
  legalComments: "none",
  minify: true,
  outfile: outputFile,
  platform: "node",
  sourcemap: false,
  target: "node22",
});

const compressed = await minify(readFileSync(outputFile, "utf8"), {
  compress: {
    hoist_funs: true,
    hoist_vars: true,
    keep_fargs: false,
    passes: 3,
    pure_getters: true,
    toplevel: true,
    unsafe: true,
    unsafe_arrows: true,
    unsafe_methods: true,
    unsafe_undefined: true,
  },
  ecma: 2022,
  format: { shebang: true },
  mangle: {
    properties: {
      regex:
        /^(?:DEFAULT_REGISTRY|LOCK_CONTENT_HASH|STATE_FILENAME|__registryLocation|absolute|acquireCommandLock|addItemNames|applyMigrationTransaction|applyTransaction|assertRemoteProtocol|candidate|classifyFile|cliPackage|collectItems|collectTailwindSetupProblems|commandLine|createAddCommand|createCommandLine|createCommands|createDiagnostics|createDiscoveryCommand|createMigrationCommand|createRegistry|createRemoveCommand|createWorkspace|defaultComponentsDirectory|emptyState|errors|existingHash|expectedExists|expectedHash|existsLocally|formatDrift|hasFlag|hashContent|heartbeat|heartbeatError|help|isTokenStylesTarget|isWithin|itemMetadata|itemName|localHash|location|lockPath|metadata|migrationArguments|nextItems|observedAt|option|owner|positionalArguments|previous|readConfig|readManifest|readState|readText|recoverInterruptedTransactions|registryFiles|registryLocation|registryMetadata|releaseCommandLock|removeItemNames|renewPath|requireIntegrity|resolveInstalledTarget|resolveSource|resolveTarget|run|stateDiagnostics|statePath|stateTarget|stats|storedTarget|stylesheets|tailwindProblems|upstream|upstreamContent|upstreamFiles|warnings|workspace)$/,
    },
    toplevel: true,
  },
  parse: { shebang: true },
});
if (!compressed.code) throw new Error("CLI output compression did not produce code.");
writeFileSync(outputFile, compressed.code);

chmodSync(outputFile, 0o755);
const output = readFileSync(outputFile, "utf8");
if (!output.startsWith("#!/usr/bin/env node\n")) {
  throw new Error("CLI output must preserve the executable Node shebang.");
}

console.log(`Built deterministic CLI output (${statSync(outputFile).size} bytes).`);
