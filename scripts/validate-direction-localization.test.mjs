import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("direction and localization contract stays synchronized", () => {
  const result = spawnSync(process.execPath, ["scripts/validate-direction-localization.mjs"], {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /verified for 16 audited surfaces/);
});
