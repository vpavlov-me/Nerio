import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { checkBranchPolicy } from "./check-branch-policy.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

test("allows only dev release pull requests into main", () => {
  assert.equal(checkBranchPolicy("main", "dev").allowed, true);
  assert.deepEqual(checkBranchPolicy("main", "fix/security"), {
    allowed: false,
    message: "Pull requests to main are allowed only from the dev integration branch.",
  });
  assert.equal(
    checkBranchPolicy("main", "dev", {
      repository: "vpavlov-me/Nerio",
      headRepository: "contributor/Nerio",
    }).allowed,
    false,
  );
  assert.equal(
    checkBranchPolicy("main", "dev", {
      repository: "vpavlov-me/Nerio",
      headRepository: "vpavlov-me/Nerio",
    }).allowed,
    true,
  );
});

test("allows conventional development branches into dev", () => {
  for (const prefix of [
    "feat",
    "feature",
    "fix",
    "refactor",
    "docs",
    "test",
    "chore",
    "dependabot",
  ]) {
    assert.equal(checkBranchPolicy("dev", `${prefix}/example`).allowed, true, prefix);
  }
});

test("allows same-repository main synchronization and rejects unclassified branches into dev", () => {
  assert.equal(
    checkBranchPolicy("dev", "main", {
      repository: "vpavlov-me/Nerio",
      headRepository: "vpavlov-me/Nerio",
    }).allowed,
    true,
  );
  assert.equal(
    checkBranchPolicy("dev", "main", {
      repository: "vpavlov-me/Nerio",
      headRepository: "contributor/Nerio",
    }).allowed,
    false,
  );
  assert.equal(checkBranchPolicy("dev", "dev").allowed, false);
  assert.equal(checkBranchPolicy("dev", "experiment").allowed, false);
});

test("rejects unsupported base branches", () => {
  assert.equal(checkBranchPolicy("release", "dev").allowed, false);
});

test("keeps the checked-out workflow aligned with branch and DCO implementations", () => {
  const workflow = readFileSync(resolve(root, ".github/workflows/branch-policy.yml"), "utf8");
  assert.match(
    workflow,
    /GITHUB_HEAD_REPOSITORY: \$\{\{ github\.event\.pull_request\.head\.repo\.full_name \}\}/,
  );
  assert.match(workflow, /GITHUB_REPOSITORY: \$\{\{ github\.repository \}\}/);
  assert.match(workflow, /node scripts\/check-branch-policy\.mjs/);
  assert.match(
    workflow,
    /github\.event\.pull_request\.head\.repo\.full_name != github\.repository/,
  );
  assert.match(workflow, /github\.base_ref != 'main' \|\| github\.head_ref != 'dev'/);
  assert.match(workflow, /github\.base_ref != 'dev' \|\| github\.head_ref != 'main'/);
  assert.match(workflow, /node scripts\/check-dco\.mjs --base "\$BASE_SHA" --head "\$HEAD_SHA"/);
});
