import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/* global console, process */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const packageDirs = [
  "packages/tokens",
  "packages/ui",
  "packages/adapters",
  "packages/registry",
  "packages/cli",
  "packages/mcp",
];

for (const packageDir of packageDirs) {
  console.log(`\nChecking ${packageDir} with npm pack --dry-run`);

  const result = spawnSync(npmCommand, ["pack", "--dry-run"], {
    cwd: resolve(root, packageDir),
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`\nPackage dry-run could not start for ${packageDir}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) {
    const exitCode = typeof result.status === "number" ? result.status : 1;
    console.error(`\nPackage dry-run failed for ${packageDir}.`);
    process.exit(exitCode);
  }
}

console.log("\nPackage dry-run checks completed.");
