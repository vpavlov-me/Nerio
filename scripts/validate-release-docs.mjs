import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parsePathOptions } from "./validator-options.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredChangelogHeadings = [
  "# Changelog",
  "## Unreleased",
  "### Core 0.1 alpha summary",
  "#### Foundations",
  "#### Components",
  "#### Source registry and CLI",
  "#### MCP and AI",
  "#### Documentation and demo",
  "#### Accessibility",
  "#### Known limitations",
  "### Added",
  "### Changed",
  "### Fixed",
  "### Deprecated",
  "### Removed",
  "### Accessibility",
  "### Migration",
  "## Maintenance rules",
];

const requiredReleaseCommands = [
  "pnpm install --frozen-lockfile",
  "pnpm format:check",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test:ui",
  "pnpm test:a11y",
  "pnpm test:catalog",
  "pnpm test:tokens",
  "pnpm validate:tokens",
  "pnpm validate:runtime-axes",
  "pnpm validate:typography",
  "pnpm validate:catalog",
  "pnpm validate:docs",
  "pnpm validate:release",
  "NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm build",
  "pnpm pack:check",
];

const paths = parsePathOptions(process.argv.slice(2), {
  "--changelog": resolve(root, "CHANGELOG.md"),
  "--release": resolve(root, "RELEASE.md"),
  "--ci": resolve(root, ".github/workflows/ci.yml"),
});

const [changelog, release, ci] = await Promise.all([
  readFile(paths["--changelog"], "utf8"),
  readFile(paths["--release"], "utf8"),
  readFile(paths["--ci"], "utf8"),
]);

const missingChangelogHeadings = requiredChangelogHeadings.filter(
  (heading) => !changelog.includes(heading),
);
const missingReleaseCommands = requiredReleaseCommands.filter(
  (command) => !release.includes(command),
);
const requiredCiCommands = requiredReleaseCommands.filter(
  (command) => command !== "pnpm install --frozen-lockfile" && !command.startsWith("NERIO_RELEASE"),
);
const missingCiCommands = requiredCiCommands.filter((command) => !ci.includes(`run: ${command}`));

if (missingChangelogHeadings.length || missingReleaseCommands.length || missingCiCommands.length) {
  if (missingChangelogHeadings.length) {
    console.error(`CHANGELOG.md is missing: ${missingChangelogHeadings.join(", ")}`);
  }

  if (missingReleaseCommands.length) {
    console.error(`RELEASE.md is missing: ${missingReleaseCommands.join(", ")}`);
  }

  if (missingCiCommands.length) {
    console.error(`CI workflow is missing: ${missingCiCommands.join(", ")}`);
  }

  process.exitCode = 1;
} else {
  console.log("Release documentation validation passed.");
}
