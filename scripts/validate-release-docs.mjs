import { readFile } from "node:fs/promises";

const requiredChangelogHeadings = [
  "# Changelog",
  "## Unreleased",
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
  "pnpm format:check",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test:ui",
  "pnpm test:a11y",
  "pnpm validate:catalog",
  "pnpm validate:docs",
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
