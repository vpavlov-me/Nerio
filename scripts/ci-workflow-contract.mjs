import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const ciWorkflowPaths = {
  prGate: ".github/workflows/pr-gate.yml",
  releaseGate: ".github/workflows/release-gate.yml",
};

const developmentCommands = [
  "pnpm install --frozen-lockfile",
  "pnpm format:check",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test:ci-scopes",
  "pnpm test:ui",
  "pnpm test:a11y",
  "pnpm test:catalog",
  "pnpm test:tokens",
  "pnpm test:onboarding",
  "pnpm validate:tokens",
  "pnpm validate:runtime-axes",
  "pnpm validate:typography",
  "pnpm validate:catalog",
  "pnpm validate:docs",
  "pnpm validate:onboarding",
  "pnpm test:docs-examples",
  "pnpm build",
];

const developmentScopedCommands = [
  "pnpm test:branch-policy",
  "pnpm test:browser:pr",
  "pnpm test:visual",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm test:adapters",
  "pnpm validate:package-budgets",
  "pnpm pack:check",
  "pnpm test:manual-audit-plan",
  "pnpm validate:manual-audit-plan",
];

const releaseCommands = [
  ...developmentCommands,
  "pnpm test:branch-policy",
  "pnpm test:visual",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm test:adapters",
  "pnpm test:manual-audit-plan",
  "pnpm validate:manual-audit-plan",
  "pnpm validate:platform-support",
  "pnpm audit:prod",
  "pnpm validate:package-budgets",
  "pnpm validate:release:metadata",
  "pnpm test:release-consumer",
  "pnpm pack:check",
];

const forbiddenPublicationStrings = [
  "npm publish",
  "pnpm publish",
  "NPM_TOKEN",
  "contents: write",
  "id-token: write",
  "release-please",
  "semantic-release",
  "git tag",
  "gh release",
];

function requireStrings(source, path, values, failures) {
  for (const value of values) {
    if (!source.includes(value)) failures.push(`${path}: missing ${value}`);
  }
}

function forbidStrings(source, path, values, failures) {
  for (const value of values) {
    if (source.includes(value)) failures.push(`${path}: forbidden ${value}`);
  }
}

export function readCiWorkflowSources(root) {
  return {
    prGate: readFileSync(resolve(root, ciWorkflowPaths.prGate), "utf8"),
    releaseGate: readFileSync(resolve(root, ciWorkflowPaths.releaseGate), "utf8"),
  };
}

export function ciWorkflowContractFailures({ prGate, releaseGate }) {
  const failures = [];

  requireStrings(prGate, ciWorkflowPaths.prGate, developmentCommands, failures);
  requireStrings(prGate, ciWorkflowPaths.prGate, developmentScopedCommands, failures);
  requireStrings(
    prGate,
    ciWorkflowPaths.prGate,
    [
      "pull_request:",
      "branches:\n      - dev",
      "types: [opened, synchronize, reopened, ready_for_review]",
      "group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}",
      "cancel-in-progress: true",
      "permissions:",
      "contents: read",
      "node scripts/detect-ci-scopes.mjs",
      "pnpm exec playwright install --with-deps chromium",
      "name: PR gate",
      "if: always()",
      "timeout-minutes:",
    ],
    failures,
  );
  forbidStrings(
    prGate,
    ciWorkflowPaths.prGate,
    [
      "pull_request_target",
      "labeled",
      "unlabeled",
      "playwright install --with-deps chromium firefox",
      "command: test:browser:firefox",
      "command: test:browser:webkit",
      "pnpm validate:release:metadata",
      "pnpm test:release-consumer",
      "continue-on-error",
      "secrets.",
      ...forbiddenPublicationStrings,
    ],
    failures,
  );

  requireStrings(releaseGate, ciWorkflowPaths.releaseGate, releaseCommands, failures);
  requireStrings(
    releaseGate,
    ciWorkflowPaths.releaseGate,
    [
      "pull_request:",
      "branches:\n      - main",
      "types: [opened, synchronize, reopened, ready_for_review]",
      "workflow_dispatch:",
      "group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}",
      "cancel-in-progress: true",
      "permissions:",
      "contents: read",
      "fail-fast: false",
      "engine: chromium",
      "command: test:browser:chromium",
      "engine: firefox",
      "command: test:browser:firefox",
      "engine: webkit",
      "command: test:browser:webkit",
      "name: Release gate",
      "if: always()",
      "timeout-minutes:",
    ],
    failures,
  );
  forbidStrings(
    releaseGate,
    ciWorkflowPaths.releaseGate,
    ["pull_request_target", "continue-on-error", "secrets.", ...forbiddenPublicationStrings],
    failures,
  );

  return failures;
}
