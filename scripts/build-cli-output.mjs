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
  compress: true,
  ecma: 2022,
  mangle: true,
});
if (!compressed.code) throw new Error("CLI output compression did not produce code.");
writeFileSync(outputFile, compressed.code);

chmodSync(outputFile, 0o755);
const output = readFileSync(outputFile, "utf8");
if (!output.startsWith("#!/usr/bin/env node\n")) {
  throw new Error("CLI output must preserve the executable Node shebang.");
}

console.log(`Built deterministic CLI output (${statSync(outputFile).size} bytes).`);
