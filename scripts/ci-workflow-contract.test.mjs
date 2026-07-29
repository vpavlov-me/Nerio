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

test("keeps each workflow on its intended pull-request base", () => {
  const sources = readCiWorkflowSources(root);
  sources.prGate = sources.prGate.replace("      - dev", "      - main");
  sources.releaseGate = sources.releaseGate.replace("      - main", "      - dev");
  const failures = ciWorkflowContractFailures(sources);
  assert.ok(failures.includes(`${ciWorkflowPaths.prGate}: missing branches:\n      - dev`));
  assert.ok(failures.includes(`${ciWorkflowPaths.releaseGate}: missing branches:\n      - main`));
});

test("keeps publication and write permissions out of pull-request workflows", () => {
  const sources = {
    prGate: readFileSync(resolve(root, ciWorkflowPaths.prGate), "utf8") + "\ncontents: write\n",
    releaseGate: readFileSync(resolve(root, ciWorkflowPaths.releaseGate), "utf8"),
  };
  assert.ok(
    ciWorkflowContractFailures(sources).includes(
      `${ciWorkflowPaths.prGate}: forbidden contents: write`,
    ),
  );
});
