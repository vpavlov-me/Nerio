import { chmodSync, mkdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

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

chmodSync(outputFile, 0o755);
const output = readFileSync(outputFile, "utf8");
if (!output.startsWith("#!/usr/bin/env node\n")) {
  throw new Error("CLI output must preserve the executable Node shebang.");
}

console.log(`Built deterministic CLI output (${statSync(outputFile).size} bytes).`);
