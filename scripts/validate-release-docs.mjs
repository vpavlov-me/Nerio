import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ciWorkflowContractFailures } from "./ci-workflow-contract.mjs";
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
  "pnpm test:branch-policy",
  "pnpm test:ci-scopes",
  "pnpm test:ui",
  "pnpm test:a11y",
  "pnpm test:catalog",
  "pnpm test:api",
  "pnpm test:tokens",
  "pnpm test:onboarding",
  "pnpm validate:tokens",
  "pnpm validate:runtime-axes",
  "pnpm validate:typography",
  "pnpm validate:catalog",
  "pnpm validate:api",
  "pnpm validate:docs",
  "pnpm validate:onboarding",
  "pnpm validate:release:metadata",
  "pnpm test:consumer:minimum",
  "pnpm test:consumer:current",
  "pnpm test:consumer-matrix",
  "pnpm validate:release",
  "NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm test:adapters",
  "pnpm test:manual-audit-plan",
  "pnpm validate:manual-audit-plan",
  "pnpm validate:platform-support",
  "pnpm validate:package-budgets",
  "pnpm test:browser:pr",
  "pnpm test:browser:chromium",
  "pnpm test:browser:firefox",
  "pnpm test:browser:webkit",
  "pnpm test:browser",
  "pnpm test:visual",
  "pnpm test:docs-examples",
  "pnpm build",
  "pnpm pack:check",
];

const paths = parsePathOptions(process.argv.slice(2), {
  "--changelog": resolve(root, "CHANGELOG.md"),
  "--release": resolve(root, "RELEASE.md"),
  "--pr-gate": resolve(root, ".github/workflows/pr-gate.yml"),
  "--release-gate": resolve(root, ".github/workflows/release-gate.yml"),
});

const [changelog, release, prGate, releaseGate] = await Promise.all([
  readFile(paths["--changelog"], "utf8"),
  readFile(paths["--release"], "utf8"),
  readFile(paths["--pr-gate"], "utf8"),
  readFile(paths["--release-gate"], "utf8"),
]);

const missingChangelogHeadings = requiredChangelogHeadings.filter(
  (heading) => !changelog.includes(heading),
);
const missingReleaseCommands = requiredReleaseCommands.filter(
  (command) => !release.includes(command),
);
const workflowFailures = ciWorkflowContractFailures({ prGate, releaseGate });

if (missingChangelogHeadings.length || missingReleaseCommands.length || workflowFailures.length) {
  if (missingChangelogHeadings.length) {
    console.error(`CHANGELOG.md is missing: ${missingChangelogHeadings.join(", ")}`);
  }

  if (missingReleaseCommands.length) {
    console.error(`RELEASE.md is missing: ${missingReleaseCommands.join(", ")}`);
  }

  if (workflowFailures.length) {
    console.error(`CI workflow contract failed: ${workflowFailures.join(", ")}`);
  }

  process.exitCode = 1;
} else {
  console.log("Release documentation validation passed.");
}
