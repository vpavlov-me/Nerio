import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

// This is a bounded post-publication status update, not a new candidate approval.
// Do not add runtime, dependency, snapshot, or human-evidence files.
export const publishedDocumentationPaths = Object.freeze([
  "README.md",
  "PROJECT.md",
  "RELEASE.md",
  "docs/core-1-0-publication.md",
  "docs/migrations/beta-1-to-1-0.md",
  "apps/docs/content/llms.txt",
  "apps/docs/app/docs/getting-started/page.tsx",
  "apps/docs/app/docs/migration/page.tsx",
  "apps/docs/scripts/validate-docs.mjs",
  "quality/release-metadata.json",
  "quality/core-1-0-publication.json",
  "scripts/published-release-documentation.mjs",
  "scripts/published-release-documentation.test.mjs",
  "scripts/validate-stable-accessibility-smoke.mjs",
  "scripts/validate-stable-accessibility-smoke.test.mjs",
  "scripts/validate-repository-artifacts.mjs",
  "scripts/validate-stable-readiness.mjs",
  "scripts/validate-stable-readiness.test.mjs",
  "tests/browser/docs-smoke.spec.mjs",
  ".github/workflows/pr-gate.yml",
  ".github/workflows/release-gate.yml",
]);

const policyFiles = [
  "scripts/published-release-documentation.mjs",
  "scripts/published-release-documentation.test.mjs",
  "scripts/validate-repository-artifacts.mjs",
  "scripts/validate-stable-accessibility-smoke.mjs",
  "scripts/validate-stable-accessibility-smoke.test.mjs",
  "scripts/validate-stable-readiness.mjs",
  "scripts/validate-stable-readiness.test.mjs",
  "quality/core-1-0-publication.json",
];

export function publicationPolicyStep(policyCommit) {
  if (!/^[a-f0-9]{40}$/.test(policyCommit)) throw new Error("Invalid policy commit.");
  return `      - name: Validate immutable publication policy
        run: |
          node --input-type=module <<'NODE'
          import { execFileSync } from "node:child_process";
          const policyCommit = "${policyCommit}";
          const source = execFileSync("git", ["show", policyCommit + ":scripts/published-release-documentation.mjs"], { encoding: "utf8" });
          const { publishedDocumentationAnchor } = await import("data:text/javascript;base64," + Buffer.from(source).toString("base64"));
          publishedDocumentationAnchor({ root: process.cwd(), policyCommit, scope: "release" });
          NODE
`;
}

export function withPublicationPolicyStep(source, job, policyCommit) {
  // A separately reviewed policy revision replaces its predecessor's pinned step.
  source = source.replace(
    /      - name: Validate immutable publication policy\n[\s\S]*?          NODE\n/g,
    "",
  );
  // PR gate targets dev: forward runtime work is not a 1.0 publication delta.
  if (job === "always_fast") return source;
  const start = source.indexOf(`\n  ${job}:`);
  if (start < 0) throw new Error(`Missing publication policy job: ${job}`);
  const marker = "          fetch-depth: 0\n";
  const index = source.indexOf(marker, start);
  if (index < 0) throw new Error(`Missing full-history checkout: ${job}`);
  const position = index + marker.length;
  return source.slice(0, position) + publicationPolicyStep(policyCommit) + source.slice(position);
}

// These are the reviewed copy-only page revisions. A path allowlist alone must
// not permit a later behavioral change in either executable TSX document.
const publicationPageHashes = Object.freeze({
  "apps/docs/app/docs/getting-started/page.tsx":
    "bf8c8d41be979e2722c4df16356d6861f0beb60c5c5883337ccb428d6696aefd",
  "apps/docs/app/docs/migration/page.tsx":
    "fbcf989f5c263e825e400f69c46a25038fd5518eff53b08f97e7ab75fc2cabce",
});

export function publicationValidationScope(root, environment = process.env) {
  // The PR base wins over the checked-out source branch, including dev -> main.
  if (environment.GITHUB_BASE_REF) {
    return environment.GITHUB_BASE_REF === "dev" ? "development" : "release";
  }
  if (environment.GITHUB_ACTIONS === "true") return "release";
  try {
    const branch = execFileSync("git", ["symbolic-ref", "--short", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    if (branch === "main" || branch.startsWith("release/")) return "release";
    if (branch === "dev" || environment.NERIO_VALIDATION_BASE_REF === "dev") {
      return "development";
    }
    // Normal local working branches inherit dev even before their PR exists.
    execFileSync("git", ["merge-base", "--is-ancestor", "refs/remotes/origin/dev", "HEAD"], {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
    });
    return "development";
  } catch {
    return "release";
  }
}

export function publishedDocumentationAnchor({
  root,
  policyCommit,
  scope = "release",
  releaseMetadataPath = resolve(root, "quality/release-metadata.json"),
  recordPath = resolve(root, "quality/stable-accessibility-smoke.json"),
  platformSupportPath = resolve(root, "quality/platform-support.json"),
  packagesRoot = resolve(root, "packages"),
}) {
  const assertPublished = (condition, message) => {
    if (!condition) throw new Error(`Published documentation: ${message}`);
  };
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  const gitValue = (...args) => git(...args).trim();
  assertPublished(["release", "development"].includes(scope), "invalid validation scope.");
  assertPublished(!policyCommit || scope === "release", "immutable policy is release-only.");
  if (policyCommit !== undefined) {
    assertPublished(/^[a-f0-9]{40}$/.test(policyCommit), "invalid immutable policy commit.");
    for (const path of policyFiles) {
      const expected = git("show", `${policyCommit}:${path}`);
      assertPublished(
        readFileSync(resolve(root, path), "utf8") === expected &&
          git("show", `:${path}`) === expected,
        `policy file differs from the immutable reviewed anchor: ${path}`,
      );
    }
    for (const [path, job] of [
      [".github/workflows/pr-gate.yml", "always_fast"],
      [".github/workflows/release-gate.yml", "release_quality"],
    ]) {
      const expected = withPublicationPolicyStep(
        git("show", `${policyCommit}:${path}`),
        job,
        policyCommit,
      );
      assertPublished(
        readFileSync(resolve(root, path), "utf8") === expected &&
          git("show", `:${path}`) === expected,
        `workflow differs from the reviewed mandatory policy bootstrap: ${path}`,
      );
    }
  }
  const canonicalMetadata =
    resolve(releaseMetadataPath) === resolve(root, "quality/release-metadata.json");
  let publicationRecorded =
    canonicalMetadata && existsSync(resolve(root, "quality/core-1-0-publication.json"));
  if (canonicalMetadata && !publicationRecorded) {
    try {
      git("cat-file", "-e", "HEAD:quality/core-1-0-publication.json");
      publicationRecorded = true;
    } catch {
      // The original pre-publication branch has no receipt in its tree or history tip.
    }
  }
  let metadata;
  try {
    metadata = JSON.parse(readFileSync(releaseMetadataPath, "utf8"));
  } catch {
    assertPublished(!publicationRecorded, "published release metadata must remain readable.");
    // The main validator reports malformed/missing metadata in every mode.
    return null;
  }
  if (scope === "release" && publicationRecorded && metadata?.coreVersion === "1.0.0") {
    assertPublished(
      metadata.docsStatusLabel === "Published stable 1.0",
      "published 1.0.0 cannot return to a prepared or other status.",
    );
  }
  if (
    metadata?.docsStatusLabel !== "Published stable 1.0" &&
    !(scope === "development" && publicationRecorded)
  )
    return null;
  for (const [actual, expected] of [
    [releaseMetadataPath, "quality/release-metadata.json"],
    [recordPath, "quality/stable-accessibility-smoke.json"],
    [platformSupportPath, "quality/platform-support.json"],
    [packagesRoot, "packages"],
  ]) {
    assertPublished(
      resolve(actual) === resolve(root, expected),
      "canonical evidence paths are required.",
    );
  }
  const receipt = JSON.parse(
    readFileSync(resolve(root, "quality/core-1-0-publication.json"), "utf8"),
  );
  assertPublished(
    receipt?.schemaVersion === 1 && receipt.version === "1.0.0" && receipt.tag === "v1.0.0",
    "invalid publication identity.",
  );
  assertPublished(
    /^[a-f0-9]{40}$/.test(receipt.commit ?? "") && /^[a-f0-9]{40}$/.test(receipt.tagObject ?? ""),
    "exact commit and annotated tag object are required.",
  );
  assertPublished(
    receipt.releaseUrl === "https://github.com/vpavlov-me/Nerio/releases/tag/v1.0.0",
    "unexpected release URL.",
  );
  assertPublished(
    /^https:\/\/github\.com\/vpavlov-me\/Nerio\/issues\/151#issuecomment-\d+$/.test(
      receipt.evidenceUrl ?? "",
    ),
    "publication evidence is required.",
  );
  assertPublished(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(receipt.publishedAt ?? "") &&
      Number.isFinite(Date.parse(receipt.publishedAt)) &&
      Date.parse(receipt.publishedAt) <= Date.now(),
    "valid past publication time is required.",
  );
  const ref = "refs/tags/v1.0.0";
  assertPublished(
    gitValue("cat-file", "-t", ref) === "tag",
    "an annotated release tag is required.",
  );
  assertPublished(
    gitValue("rev-parse", ref) === receipt.tagObject &&
      gitValue("rev-parse", `${ref}^{commit}`) === receipt.commit,
    "release tag identity differs from the publication receipt.",
  );
  try {
    git("merge-base", "--is-ancestor", receipt.commit, "HEAD");
  } catch {
    assertPublished(false, "released commit must be contained by current history.");
  }

  const releasedMetadata = JSON.parse(
    git("show", `${receipt.commit}:quality/release-metadata.json`),
  );
  assertPublished(
    releasedMetadata.coreVersion === "1.0.0" && releasedMetadata.channel === "stable",
    "tag must identify the stable 1.0.0 contract.",
  );
  if (scope === "development") {
    // Validate the preserved historical evidence, never certify the forward dev tree.
    for (const path of [
      "quality/stable-accessibility-smoke.json",
      "docs/audits/core-1-0-stable-accessibility-smoke.md",
      "docs/core-1-0-release-readiness.md",
    ]) {
      const expected = git("show", `${receipt.commit}:${path}`);
      assertPublished(
        lstatSync(resolve(root, path)).isFile() &&
          readFileSync(resolve(root, path), "utf8") === expected &&
          git("show", `:${path}`) === expected,
        `historical release evidence differs from v1.0.0: ${path}`,
      );
    }
    return receipt.commit;
  }
  assertPublished(
    isDeepStrictEqual(metadata, {
      ...releasedMetadata,
      docsStatusLabel: "Published stable 1.0",
    }),
    "only docsStatusLabel may change in release metadata.",
  );

  const paths = new Set(publishedDocumentationPaths);
  const changed = git("diff", "--name-only", "-z", receipt.commit, "--")
    .split("\0")
    .filter(Boolean);
  const untracked = git("ls-files", "--others", "--exclude-standard", "-z")
    .split("\0")
    .filter(Boolean);
  const staged = git("diff", "--cached", "--name-only", "-z", receipt.commit, "--")
    .split("\0")
    .filter(Boolean);
  const allChanges = new Set([...changed, ...staged, ...untracked]);
  const disallowed = [...allChanges].filter((path) => !paths.has(path));
  assertPublished(
    disallowed.length === 0,
    `changes outside the status-documentation boundary: ${disallowed.join(", ")}`,
  );
  for (const path of allChanges) {
    assertPublished(
      lstatSync(resolve(root, path)).isFile(),
      `status files must remain regular files: ${path}`,
    );
    if (Object.hasOwn(publicationPageHashes, path)) {
      const hash = createHash("sha256")
        .update(readFileSync(resolve(root, path)))
        .digest("hex");
      assertPublished(
        hash === publicationPageHashes[path],
        `page differs from the reviewed publication copy: ${path}`,
      );
      if (staged.includes(path)) {
        const stagedSource = execFileSync("git", ["show", `:${path}`], {
          cwd: root,
          stdio: ["ignore", "pipe", "pipe"],
        });
        assertPublished(
          createHash("sha256").update(stagedSource).digest("hex") === publicationPageHashes[path],
          `staged page differs from the reviewed publication copy: ${path}`,
        );
      }
    }
  }
  return receipt.commit;
}
