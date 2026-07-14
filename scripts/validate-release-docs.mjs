import { readFile } from "node:fs/promises";

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

const [changelog, release] = await Promise.all([
  readFile(new URL("../CHANGELOG.md", import.meta.url), "utf8"),
  readFile(new URL("../RELEASE.md", import.meta.url), "utf8"),
]);

const missingChangelogHeadings = requiredChangelogHeadings.filter(
  (heading) => !changelog.includes(heading),
);
const missingReleaseCommands = requiredReleaseCommands.filter(
  (command) => !release.includes(command),
);

if (missingChangelogHeadings.length || missingReleaseCommands.length) {
  if (missingChangelogHeadings.length) {
    console.error(`CHANGELOG.md is missing: ${missingChangelogHeadings.join(", ")}`);
  }

  if (missingReleaseCommands.length) {
    console.error(`RELEASE.md is missing: ${missingReleaseCommands.join(", ")}`);
  }

  process.exitCode = 1;
} else {
  console.log("Release documentation validation passed.");
}
