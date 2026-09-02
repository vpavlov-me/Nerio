import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  ciWorkflowContractFailures,
  ciWorkflowPaths,
  readCiWorkflowSources,
} from "./ci-workflow-contract.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("accepts the repository tiered workflow contract", () => {
  assert.deepEqual(ciWorkflowContractFailures(readCiWorkflowSources(root)), []);
});

test("rejects release-only work in the development gate", () => {
  const sources = readCiWorkflowSources(root);
  sources.prGate += "\n      - run: pnpm test:release-consumer\n";
  assert.ok(
    ciWorkflowContractFailures(sources).some(
      (failure) => failure === `${ciWorkflowPaths.prGate}: forbidden pnpm test:release-consumer`,
    ),
  );
});

test("requires all supported release browser engines", () => {
  const sources = readCiWorkflowSources(root);
  sources.releaseGate = sources.releaseGate.replace("engine: webkit", "engine: unsupported");
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.releaseGate}: missing engine: webkit`,
    ),
  );
});

test("requires the production dependency audit in the release gate", () => {
  const sources = readCiWorkflowSources(root);
  sources.releaseGate = sources.releaseGate.replace("      - run: pnpm audit:prod\n", "");
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.releaseGate}: missing pnpm audit:prod`,
    ),
  );
});

test("requires the repository artifact guard in the development gate", () => {
  const sources = readCiWorkflowSources(root);
  sources.prGate = sources.prGate.replace("      - run: pnpm validate:repo-artifacts\n", "");
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.prGate}: missing pnpm validate:repo-artifacts`,
    ),
  );
});

test("retains the route bundle diagnostic from the existing docs build", () => {
  const sources = readCiWorkflowSources(root);
  sources.prGate = sources.prGate.replace(
    "docs-route-bundle-report-${{ github.event.pull_request.head.sha }}",
    "missing-route-report-artifact",
  );
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.prGate}: missing docs-route-bundle-report-\${{ github.event.pull_request.head.sha }}`,
    ),
  );
});
test("keeps each workflow on its intended pull-request base", () => {
  const sources = readCiWorkflowSources(root);
  sources.prGate = sources.prGate.replace("      - dev", "      - main");
  sources.releaseGate = sources.releaseGate.replace("      - main", "      - dev");
  const failures = ciWorkflowContractFailures(sources);
  assert.ok(failures.includes(`${ciWorkflowPaths.prGate}: missing branches:\n      - dev`));
  assert.ok(failures.includes(`${ciWorkflowPaths.releaseGate}: missing branches:\n      - main`));
});

test("keeps publication and write permissions out of pull-request workflows", () => {
  const sources = readCiWorkflowSources(root);
  sources.prGate += "\ncontents: write\n";
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.prGate}: forbidden contents: write`,
    ),
  );
});

test("rejects floating third-party Action references", () => {
  const sources = readCiWorkflowSources(root);
  sources.playwrightCanary = sources.playwrightCanary.replace(
    "actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7",
    "actions/checkout@v7",
  );
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.playwrightCanary}: forbidden @v`,
    ),
  );
});

test("retains reviewed Dependabot updates for pinned GitHub Actions", () => {
  const dependabot = readFileSync(resolve(root, ".github/dependabot.yml"), "utf8");
  assert.match(dependabot, /package-ecosystem: ["']?github-actions["']?/);
  assert.match(dependabot, /interval: ["']?monthly["']?/);
});
