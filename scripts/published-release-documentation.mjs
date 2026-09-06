import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { lstatSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isDeepStrictEqual } from "node:util";

// This is a bounded post-publication status update, not a new candidate approval.
// Do not add runtime, dependency, snapshot, workflow, or human-evidence files.
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
  "tests/browser/docs-smoke.spec.mjs",
]);

// These are the reviewed copy-only page revisions. A path allowlist alone must
// not permit a later behavioral change in either executable TSX document.
const publicationPageHashes = Object.freeze({
  "apps/docs/app/docs/getting-started/page.tsx":
    "bf8c8d41be979e2722c4df16356d6861f0beb60c5c5883337ccb428d6696aefd",
  "apps/docs/app/docs/migration/page.tsx":
    "fbcf989f5c263e825e400f69c46a25038fd5518eff53b08f97e7ab75fc2cabce",
});

export function publishedDocumentationAnchor({
  root,
  releaseMetadataPath = resolve(root, "quality/release-metadata.json"),
  recordPath = resolve(root, "quality/stable-accessibility-smoke.json"),
  platformSupportPath = resolve(root, "quality/platform-support.json"),
  packagesRoot = resolve(root, "packages"),
}) {
  let metadata;
  try {
    metadata = JSON.parse(readFileSync(releaseMetadataPath, "utf8"));
  } catch {
    // The main validator reports malformed/missing metadata in every mode.
    return null;
  }
  if (metadata?.docsStatusLabel !== "Published stable 1.0") return null;
  const assertPublished = (condition, message) => {
    if (!condition) throw new Error(`Published documentation: ${message}`);
  };
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
  const git = (...args) =>
    execFileSync("git", args, {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  const gitValue = (...args) => git(...args).trim();
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
