import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const ciWorkflowPaths = {
  prGate: ".github/workflows/pr-gate.yml",
  releaseGate: ".github/workflows/release-gate.yml",
  playwrightCanary: ".github/workflows/playwright-canary.yml",
};

const pinnedActions = [
  "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7",
  "pnpm/action-setup@0ebf47130e4866e96fce0953f49152a61190b271 # v6",
  "actions/setup-node@820762786026740c76f36085b0efc47a31fe5020 # v7",
];
const pinnedUploadAction =
  "actions/upload-artifact@043fb46d1a93c77aae656e7c1c64a875d1fc6a0a # v7.0.1";

const developmentCommands = [
  "pnpm install --frozen-lockfile",
  "pnpm format:check",
  "pnpm lint",
  "pnpm typecheck",
  "pnpm test:ci-scopes",
  "pnpm test:repo-artifacts",
  "pnpm validate:repo-artifacts",
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
  "pnpm test:consumer:vite",
  "pnpm build",
  "pnpm validate:route-budgets",
];

const developmentScopedCommands = [
  "pnpm test:browser:pr",
  "pnpm test:visual",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm test:adapters",
  "pnpm validate:package-output",
  "pnpm validate:package-budgets",
  "pnpm pack:check",
  "pnpm test:manual-audit-plan",
  "pnpm test:beta-feedback",
  "pnpm validate:stable-readiness",
];

const releaseCommands = [
  ...developmentCommands,
  "pnpm test:visual",
  "pnpm test:cli",
  "pnpm test:mcp",
  "pnpm test:adapters",
  "pnpm test:manual-audit-plan",
  "pnpm test:beta-feedback",
  "pnpm validate:stable-readiness",
  "pnpm validate:platform-support",
  "pnpm audit:prod",
  "pnpm validate:package-output",
  "pnpm validate:package-budgets",
  "pnpm validate:release:metadata",
  "pnpm test:consumer:${{ matrix.profile }}",
  "pnpm pack:check",
  "pnpm generate:sbom",
  "pnpm validate:sbom",
];

const branchPolicyCommands = [
  "node scripts/check-branch-policy.mjs",
  "node scripts/check-dco.mjs --base \"$BASE_SHA\" --head \"$HEAD_SHA\"",
  "node --test scripts/check-branch-policy.test.mjs scripts/check-dco.test.mjs",
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
    playwrightCanary: readFileSync(resolve(root, ciWorkflowPaths.playwrightCanary), "utf8"),
  };
}

export function ciWorkflowContractFailures({ prGate, releaseGate, playwrightCanary = "" }) {
  const failures = [];

  requireStrings(prGate, ciWorkflowPaths.prGate, developmentCommands, failures);
  requireStrings(prGate, ciWorkflowPaths.prGate, developmentScopedCommands, failures);
  requireStrings(prGate, ciWorkflowPaths.prGate, branchPolicyCommands, failures);
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
      "pull-requests: read",
      "node scripts/detect-ci-scopes.mjs",
      "name: branch-policy",
      "name: always-fast",
      "name: docs-contract",
      "name: ui-contract",
      "name: workflow-contract",
      "docs_only:",
      "broad:",
      "unknown:",
      "if: needs.scopes.outputs.docs_only == 'true'",
      "github.event.pull_request.draft == false",
      "needs.scopes.outputs.docs == 'true' && needs.scopes.outputs.docs_only != 'true'",
      "IS_DRAFT: ${{ github.event.pull_request.draft }}",
      "Draft pull request: expensive checks are deferred until ready for review.",
      "GITHUB_TOKEN: ${{ github.token }}",
      "pnpm exec playwright install --with-deps chromium",
      "docs-route-bundle-report-${{ github.event.pull_request.head.sha }}",
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
      "${{ inputs.",
      "@v",
      ...forbiddenPublicationStrings,
    ],
    failures,
  );

  requireStrings(releaseGate, ciWorkflowPaths.releaseGate, releaseCommands, failures);
  requireStrings(releaseGate, ciWorkflowPaths.releaseGate, branchPolicyCommands, failures);
  requireStrings(
    releaseGate,
    ciWorkflowPaths.releaseGate,
    [
      "pull_request:",
      "branches:\n      - main",
      "types: [opened, synchronize, reopened, ready_for_review]",
      "group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}",
      "cancel-in-progress: true",
      "permissions:",
      "contents: read",
      "name: branch-policy",
      "PULL_REQUEST_CANDIDATE: ${{ github.event.pull_request.head.sha }}",
      "node scripts/validate-release-candidate.mjs",
      "ref: ${{ needs.candidate.outputs.candidate_sha }}",
      "release-candidate-${{ steps.candidate.outputs.candidate_sha }}",
      "sbom-${{ needs.candidate.outputs.candidate_sha }}",
      "docs-route-bundle-report-${{ needs.candidate.outputs.candidate_sha }}",
      "github.event.pull_request.draft == false",
      "IS_DRAFT: ${{ github.event.pull_request.draft }}",
      "Draft release pull request: full release validation is deferred until ready for review.",
      "fail-fast: false",
      "engine: chromium",
      "command: test:browser:chromium",
      "engine: firefox",
      "command: test:browser:firefox",
      "engine: webkit",
      "command: test:browser:webkit",
      "profile: minimum",
      "profile: current",
      "node: 24",
      "name: release-consumer-${{ matrix.profile }}-node-${{ matrix.node }}",
      "name: Release gate",
      "if: always()",
      "timeout-minutes:",
      ...pinnedActions,
      pinnedUploadAction,
    ],
    failures,
  );
  forbidStrings(
    releaseGate,
    ciWorkflowPaths.releaseGate,
    [
      "pull_request_target",
      "workflow_dispatch:",
      "DISPATCH_CANDIDATE",
      "continue-on-error",
      "secrets.",
      "${{ inputs.",
      "@v",
      ...forbiddenPublicationStrings,
    ],
    failures,
  );
  const releaseCheckoutCount = (
    releaseGate.match(/uses: actions\/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7/g) ??
    []
  ).length;
  const exactCandidateCheckoutCount = (
    releaseGate.match(/ref: \$\{\{ needs\.candidate\.outputs\.candidate_sha \}\}/g) ?? []
  ).length;
  if (
    releaseCheckoutCount === 0 ||
    exactCandidateCheckoutCount !== releaseCheckoutCount - 1 ||
    !releaseGate.includes("ref: dev")
  ) {
    failures.push(
      `${ciWorkflowPaths.releaseGate}: every downstream checkout must use the exact validated candidate SHA`,
    );
  }

  requireStrings(prGate, ciWorkflowPaths.prGate, [...pinnedActions, pinnedUploadAction], failures);
  requireStrings(playwrightCanary, ciWorkflowPaths.playwrightCanary, pinnedActions, failures);
  for (const [key, source] of Object.entries({
    prGate,
    releaseGate,
    playwrightCanary,
  })) {
    forbidStrings(source, ciWorkflowPaths[key], ["@v", "@main", "@master"], failures);
  }

  return failures;
}
