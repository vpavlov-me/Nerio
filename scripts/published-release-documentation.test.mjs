import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { validateRepositoryArtifacts } from "./validate-repository-artifacts.mjs";
import {
  publishedDocumentationAnchor,
  publishedDocumentationPaths,
  publicationValidationScope,
  withPublicationPolicyStep,
} from "./published-release-documentation.mjs";

function fixture(callback) {
  const root = mkdtempSync(join(tmpdir(), "nerio-published-docs-"));
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  const write = (path, value) => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), typeof value === "string" ? value : JSON.stringify(value));
  };
  try {
    git("init", "--quiet");
    git("config", "user.email", "fixture@example.invalid");
    git("config", "user.name", "Release fixture");
    git("config", "commit.gpgsign", "false");
    git("config", "tag.gpgsign", "false");
    const metadata = {
      coreVersion: "1.0.0",
      channel: "stable",
      registryVersion: "1.0.0",
      docsStatusLabel: "Prepared stable 1.0 candidate",
    };
    write("quality/release-metadata.json", metadata);
    write("quality/stable-accessibility-smoke.json", { status: "complete" });
    write("quality/platform-support.json", { node: "22" });
    write("docs/audits/core-1-0-stable-accessibility-smoke.md", "Historical audit\n");
    write("docs/core-1-0-release-readiness.md", "Historical readiness\n");
    write("README.md", "Candidate\n");
    write("packages/ui/src/index.ts", "export const stable = true;\n");
    git("add", ".");
    git("commit", "-qm", "Candidate");
    const commit = git("rev-parse", "HEAD");
    git("tag", "-a", "v1.0.0", "-m", "Stable release");
    const receipt = {
      schemaVersion: 1,
      version: "1.0.0",
      tag: "v1.0.0",
      tagObject: git("rev-parse", "refs/tags/v1.0.0"),
      commit,
      publishedAt: "2026-01-01T00:00:00Z",
      releaseUrl: "https://github.com/vpavlov-me/Nerio/releases/tag/v1.0.0",
      evidenceUrl: "https://github.com/vpavlov-me/Nerio/issues/151#issuecomment-123",
    };
    write("quality/core-1-0-publication.json", receipt);
    write("quality/release-metadata.json", {
      ...metadata,
      docsStatusLabel: "Published stable 1.0",
    });
    write("README.md", "Published\n");
    callback({ root, git, write, commit, receipt, metadata });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test("published docs accept only the pinned annotated release and status-only changes", () => {
  fixture(({ root, git, commit }) => {
    assert.equal(publishedDocumentationAnchor({ root }), commit);
    git("add", ".");
    assert.equal(publishedDocumentationAnchor({ root }), commit);
    git("commit", "-qm", "Publish status");
    assert.equal(publishedDocumentationAnchor({ root }), commit);
  });
});

for (const path of [
  "packages/ui/src/index.ts",
  "packages/tokens/src/styles.css",
  "packages/cli/src/index.js",
  "packages/mcp/src/server.js",
  "packages/registry/src/manifest.json",
  "package.json",
  "pnpm-lock.yaml",
  "quality/stable-accessibility-smoke.json",
  "quality/platform-support.json",
  "docs/core-1-0-release-readiness.md",
  "docs/audits/core-1-0-stable-accessibility-smoke.md",
  "quality/public-api.json",
  "apps/docs/app/page.tsx",
]) {
  test(`published docs reject changes to ${path}`, () => {
    fixture(({ root, write }) => {
      write(path, "changed\n");
      assert.throws(
        () => publishedDocumentationAnchor({ root }),
        /outside the status-documentation boundary/,
      );
    });
  });
}

test("published docs reject changed version, dependencies, or other release metadata", () => {
  for (const change of [{ coreVersion: "1.0.1" }, { registryVersion: "1.0.1" }, { packages: [] }]) {
    fixture(({ root, metadata, write }) => {
      write("quality/release-metadata.json", {
        ...metadata,
        docsStatusLabel: "Published stable 1.0",
        ...change,
      });
      assert.throws(() => publishedDocumentationAnchor({ root }), /only docsStatusLabel/);
    });
  }
});

test("published docs reject staged runtime changes hidden by an unchanged worktree file", () => {
  fixture(({ root, git, write }) => {
    write("packages/ui/src/index.ts", "export const stable = false;\n");
    git("add", "packages/ui/src/index.ts");
    write("packages/ui/src/index.ts", "export const stable = true;\n");
    assert.throws(
      () => publishedDocumentationAnchor({ root }),
      /outside the status-documentation boundary/,
    );
  });
});

test("published docs require the released commit in current history", () => {
  fixture(({ root, git }) => {
    git("checkout", "--orphan", "unrelated");
    git("add", ".");
    git("commit", "-qm", "Unrelated history");
    assert.throws(
      () => publishedDocumentationAnchor({ root }),
      /Published documentation: released commit must be contained by current history/,
    );
  });
});

test("NUL-delimited paths preserve whitespace in untracked, staged and committed changes", () => {
  for (const path of [" README.md", "\tREADME.md", "README.md "]) {
    fixture(({ root, git, write }) => {
      write(path, "Not an allowlisted status document\n");
      const reject = () =>
        assert.throws(
          () => publishedDocumentationAnchor({ root }),
          /outside the status-documentation boundary/,
        );
      reject();
      git("add", "--", path);
      reject();
      git("commit", "-qm", "Whitespace path");
      reject();
    });
  }
});

test("the unconditional repository validator enforces publication boundaries", () => {
  fixture(({ root, write }) => {
    assert.doesNotThrow(() => validateRepositoryArtifacts(root));
    write("docs/unreviewed.md", "Unexpected post-publication documentation\n");
    assert.throws(
      () => validateRepositoryArtifacts(root),
      /Published documentation: changes outside the status-documentation boundary/,
    );
  });
  for (const [path, job, nextJob] of [
    [".github/workflows/pr-gate.yml", "always_fast", "docs"],
    [".github/workflows/release-gate.yml", "release_quality", "release_browser"],
  ]) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
    const body = source.split(`\n  ${job}:`)[1].split(`\n  ${nextJob}:`)[0];
    assert.match(body, /fetch-depth: 0/);
    assert.match(body, /\n      - run: pnpm validate:repo-artifacts\n/);
    assert.doesNotMatch(body.split("    steps:")[0], /\bif:/);
  }
});

test("published docs reject missing, replaced, and lightweight release tags", () => {
  for (const mode of ["missing", "replaced", "lightweight"]) {
    fixture(({ root, git }) => {
      git("tag", "-d", "v1.0.0");
      if (mode === "replaced") git("tag", "-a", "v1.0.0", "-m", "Different tag object");
      if (mode === "lightweight") git("tag", "v1.0.0");
      assert.throws(() => publishedDocumentationAnchor({ root }));
    });
  }
});

test("published docs reject tampered publication identities and evidence", () => {
  for (const change of [
    { commit: "f".repeat(40) },
    { tagObject: "f".repeat(40) },
    { version: "1.0.1" },
    { tag: "main" },
    { schemaVersion: 2 },
    { publishedAt: "2999-01-01T00:00:00Z" },
    { publishedAt: "invalid" },
    { releaseUrl: "https://example.invalid" },
    { evidenceUrl: "" },
  ]) {
    fixture(({ root, receipt, write }) => {
      write("quality/core-1-0-publication.json", { ...receipt, ...change });
      assert.throws(() => publishedDocumentationAnchor({ root }));
    });
  }
});

test("published docs cannot use alternate human evidence, platform, package or metadata paths", () => {
  for (const option of [
    "recordPath",
    "platformSupportPath",
    "packagesRoot",
    "releaseMetadataPath",
  ]) {
    fixture(({ root, write }) => {
      const alternate = join(root, "alternate.json");
      if (option === "releaseMetadataPath")
        write("alternate.json", readFileSync(join(root, "quality/release-metadata.json"), "utf8"));
      assert.throws(
        () => publishedDocumentationAnchor({ root, [option]: alternate }),
        /canonical evidence paths/,
      );
    });
  }
});

test("published docs reject deleted and symlinked status documents", () => {
  for (const symlink of [false, true]) {
    fixture(({ root }) => {
      rmSync(join(root, "README.md"));
      if (symlink) symlinkSync("packages/ui/src/index.ts", join(root, "README.md"));
      assert.throws(() => publishedDocumentationAnchor({ root }));
    });
  }
});

test("prepared or future releases do not enter the historical evidence mode", () => {
  for (const docsStatusLabel of [
    undefined,
    "Prepared stable 1.0 candidate",
    "Published stable 1.1",
  ]) {
    fixture(({ root, metadata, write }) => {
      rmSync(join(root, "quality/core-1-0-publication.json"));
      write("quality/release-metadata.json", { ...metadata, docsStatusLabel });
      assert.equal(publishedDocumentationAnchor({ root }), null);
    });
  }
});

test("published 1.0.0 cannot bypass the boundary by reverting its status", () => {
  for (const removeReceipt of [false, true]) {
    fixture(({ root, git, metadata, write }) => {
      git("add", ".");
      git("commit", "-qm", "Record publication");
      if (removeReceipt) rmSync(join(root, "quality/core-1-0-publication.json"));
      write("quality/release-metadata.json", metadata);
      write("packages/ui/src/index.ts", "Unapproved runtime change\n");
      assert.throws(() => publishedDocumentationAnchor({ root }), /cannot return to a prepared/);
    });
  }
});

test("prepared test fixtures do not inherit the enclosing repository publication receipt", () => {
  fixture(({ root, metadata, write }) => {
    write("prepared-fixture.json", metadata);
    assert.equal(
      publishedDocumentationAnchor({
        root,
        releaseMetadataPath: join(root, "prepared-fixture.json"),
      }),
      null,
    );
    assert.throws(
      () => publishedDocumentationAnchor({ root }),
      /outside the status-documentation boundary/,
    );
  });
});

test("reviewed policy revisions replace rather than duplicate the immutable bootstrap", () => {
  const source =
    "jobs:\n  release_quality:\n    steps:\n      - uses: checkout\n        with:\n          fetch-depth: 0\n";
  const first = withPublicationPolicyStep(source, "release_quality", "a".repeat(40));
  assert.equal(
    withPublicationPolicyStep(first, "release_quality", "b".repeat(40)),
    withPublicationPolicyStep(source, "release_quality", "b".repeat(40)),
  );
  assert.equal(withPublicationPolicyStep(first, "always_fast", "b".repeat(40)), source);
});

test("immutable bootstrap rejects a modified guard, caller, receipt or workflow", () => {
  fixture(({ root, git, write, commit }) => {
    const protectedFiles = [
      "scripts/published-release-documentation.mjs",
      "scripts/published-release-documentation.test.mjs",
      "scripts/validate-repository-artifacts.mjs",
      "scripts/validate-stable-accessibility-smoke.mjs",
      "scripts/validate-stable-accessibility-smoke.test.mjs",
      "scripts/validate-stable-readiness.mjs",
      "scripts/validate-stable-readiness.test.mjs",
    ];
    for (const path of protectedFiles) write(path, "Reviewed policy source\n");
    for (const [path, job] of [
      [".github/workflows/pr-gate.yml", "always_fast"],
      [".github/workflows/release-gate.yml", "release_quality"],
    ])
      write(
        path,
        `jobs:\n  ${job}:\n    steps:\n      - uses: checkout\n        with:\n          fetch-depth: 0\n`,
      );
    git("add", ".");
    git("commit", "-qm", "Reviewed immutable policy");
    const policyCommit = git("rev-parse", "HEAD");
    for (const [path, job] of [
      [".github/workflows/pr-gate.yml", "always_fast"],
      [".github/workflows/release-gate.yml", "release_quality"],
    ])
      write(
        path,
        withPublicationPolicyStep(git("show", `${policyCommit}:${path}`) + "\n", job, policyCommit),
      );
    git("add", ".");
    assert.equal(publishedDocumentationAnchor({ root, policyCommit }), commit);
    for (const path of [
      ...protectedFiles,
      "quality/core-1-0-publication.json",
      ".github/workflows/pr-gate.yml",
    ]) {
      const approved = readFileSync(join(root, path), "utf8");
      write(path, "Policy bypass\n");
      assert.throws(() => publishedDocumentationAnchor({ root, policyCommit }), /differs from/);
      git("add", path);
      write(path, approved);
      assert.throws(() => publishedDocumentationAnchor({ root, policyCommit }), /differs from/);
      git("add", path);
    }
  });
});

test("dev sync retains forward runtime work without certifying a new release", () => {
  fixture(({ root, git, write, commit }) => {
    git("add", ".");
    git("commit", "-qm", "Publication sync");
    git("switch", "-c", "dev");
    write("packages/ui/src/index.ts", "export const forwardDevelopment = true;\n");
    write("quality/platform-support.json", { node: "24" });
    git("add", ".");
    git("commit", "-qm", "Preserve forward development");
    assert.equal(publicationValidationScope(root, {}), "development");
    assert.equal(publicationValidationScope(root, { GITHUB_BASE_REF: "main" }), "release");
    assert.equal(publicationValidationScope(root, { GITHUB_BASE_REF: "dev" }), "development");
    assert.equal(publicationValidationScope(root, { GITHUB_ACTIONS: "true" }), "release");
    assert.equal(publishedDocumentationAnchor({ root, scope: "development" }), commit);
    assert.doesNotThrow(() => validateRepositoryArtifacts(root, "development"));
    assert.throws(
      () => publishedDocumentationAnchor({ root }),
      /outside the status-documentation boundary/,
    );
    write("quality/stable-accessibility-smoke.json", { status: "rewritten" });
    assert.throws(
      () => publishedDocumentationAnchor({ root, scope: "development" }),
      /historical release evidence differs/,
    );
  });
});

test("allowlisted TSX pages accept the reviewed copy but reject later executable changes", () => {
  for (const path of [
    "apps/docs/app/docs/getting-started/page.tsx",
    "apps/docs/app/docs/migration/page.tsx",
  ]) {
    fixture(({ root, write, commit, git }) => {
      const approved = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
      write(path, approved);
      assert.equal(publishedDocumentationAnchor({ root }), commit);
      write(path, `${approved}\nexport const unexpectedBehavior = true;\n`);
      assert.throws(
        () => publishedDocumentationAnchor({ root }),
        /page differs from the reviewed publication copy/,
      );
      git("add", path);
      write(path, approved);
      assert.throws(() => publishedDocumentationAnchor({ root }), /staged page differs/);
    });
  }
});

test("post-publication allowlist never extends the pre-publication evidence allowlist", async () => {
  const { postCandidateEvidencePaths } = await import("./stable-accessibility-evidence-paths.mjs");
  assert.deepEqual(postCandidateEvidencePaths, [
    "docs/audits/core-1-0-stable-accessibility-smoke.md",
    "docs/core-1-0-release-readiness.md",
    "quality/stable-accessibility-smoke.json",
  ]);
  assert.equal(
    publishedDocumentationPaths.some(
      (path) => path.startsWith("packages/") || postCandidateEvidencePaths.includes(path),
    ),
    false,
  );
});
