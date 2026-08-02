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
  const ui = first.components.find(({ name }) => name === "@nerio-ui/ui");
  assert.equal(ui.purl, "pkg:npm/%40nerio-ui/ui@1.0.0-beta.0");
  assert.equal(ui["bom-ref"], ui.purl);
  const zod = first.components.find(({ name }) => name === "zod");
  assert.equal(zod.scope, "required");
  assert.equal(
    zod.properties.find(({ name }) => name === "nerio:dependency_kind").value,
    "peer,runtime",
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
