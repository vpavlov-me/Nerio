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
  "pnpm test:repo-artifacts",
  "pnpm validate:repo-artifacts",
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
  "pnpm test:consumer:vite",
  "pnpm test:consumer-matrix",
  "pnpm validate:route-budgets",
  "pnpm validate:release",
  "NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm test:adapters",
  "pnpm test:stable-accessibility-smoke",
  "pnpm validate:stable-accessibility-smoke",
  "pnpm test:manual-audit-plan",
  "pnpm validate:manual-audit-plan",
  "pnpm test:beta-feedback",
  "pnpm validate:stable-readiness",
  "pnpm test:sbom",
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

const requiredReadinessSections = [
  "# Core 1.0 release readiness",
  "## Decision",
  "## Candidate identity",
  "## Scope and contract",
  "## Package, Registry, and supply-chain evidence",
  "## Consumer and migration evidence",
  "## Browser, visual, performance, and human evidence",
  "## Documentation and governance evidence",
  "## Known non-blocking limitations",
  "## Publication plan",
  "## Verification and rollback",
];

const allowedReadinessDecisions = [
  "**Pending exact candidate evidence.**",
  "**Ready for separately approved manual `1.0.0` release.**",
  "**Blocked before 1.0.**",
];

const paths = parsePathOptions(process.argv.slice(2), {
  "--changelog": resolve(root, "CHANGELOG.md"),
  "--release": resolve(root, "RELEASE.md"),
  "--readiness": resolve(root, "docs/core-1-0-release-readiness.md"),
  "--pr-gate": resolve(root, ".github/workflows/pr-gate.yml"),
  "--release-gate": resolve(root, ".github/workflows/release-gate.yml"),
  "--branch-policy": resolve(root, ".github/workflows/branch-policy.yml"),
  "--playwright-canary": resolve(root, ".github/workflows/playwright-canary.yml"),
});

const [changelog, release, readiness, prGate, releaseGate, branchPolicy, playwrightCanary] =
  await Promise.all([
    readFile(paths["--changelog"], "utf8"),
    readFile(paths["--release"], "utf8"),
    readFile(paths["--readiness"], "utf8"),
    readFile(paths["--pr-gate"], "utf8"),
    readFile(paths["--release-gate"], "utf8"),
    readFile(paths["--branch-policy"], "utf8"),
    readFile(paths["--playwright-canary"], "utf8"),
  ]);

const missingChangelogHeadings = requiredChangelogHeadings.filter(
  (heading) => !changelog.includes(heading),
);
const missingReleaseCommands = requiredReleaseCommands.filter(
  (command) => !release.includes(command),
);
const missingReadinessSections = requiredReadinessSections.filter(
  (section) => !readiness.includes(section),
);
const readinessDecisions = allowedReadinessDecisions.filter((decision) =>
  readiness.includes(decision),
);
const workflowFailures = ciWorkflowContractFailures({
  prGate,
  releaseGate,
  branchPolicy,
  playwrightCanary,
});

if (
  missingChangelogHeadings.length ||
  missingReleaseCommands.length ||
  missingReadinessSections.length ||
  readinessDecisions.length !== 1 ||
  workflowFailures.length
) {
  if (missingChangelogHeadings.length) {
    console.error(`CHANGELOG.md is missing: ${missingChangelogHeadings.join(", ")}`);
  }

  if (missingReleaseCommands.length) {
    console.error(`RELEASE.md is missing: ${missingReleaseCommands.join(", ")}`);
  }

  if (missingReadinessSections.length) {
    console.error(`Core 1.0 readiness report is missing: ${missingReadinessSections.join(", ")}`);
  }

  if (readinessDecisions.length !== 1) {
    console.error("Core 1.0 readiness report must contain exactly one allowed decision.");
  }

  if (workflowFailures.length) {
    console.error(`CI workflow contract failed: ${workflowFailures.join(", ")}`);
  }

  process.exitCode = 1;
} else {
  console.log("Release documentation validation passed.");
}
