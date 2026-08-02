import assert from "node:assert/strict";
import test from "node:test";
import { createSbom, packageDirectories } from "./generate-sbom.mjs";
import { sbomFailures } from "./validate-sbom.mjs";

const candidate = "0123456789abcdef0123456789abcdef01234567";

test("generates a deterministic candidate-bound SBOM for all public packages", () => {
  const first = createSbom(candidate);
  const second = createSbom(candidate);
  assert.deepEqual(first, second);
  assert.equal(first.specVersion, "1.5");
  assert.equal(
    first.components.filter(({ name }) => name.startsWith("@nerio-ui/")).length,
    packageDirectories.length,
  );
  assert.deepEqual(sbomFailures(first, candidate), []);
});

test("rejects candidate drift", () => {
  const sbom = createSbom(candidate);
  assert.ok(
    sbomFailures(sbom, "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa").some((failure) =>
      failure.includes("exact candidate SHA"),
    ),
  );
});
