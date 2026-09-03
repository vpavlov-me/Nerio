export const postCandidateEvidencePaths = Object.freeze([
  "docs/audits/core-1-0-stable-accessibility-smoke.md",
  "docs/core-1-0-release-readiness.md",
  "quality/stable-accessibility-smoke.json",
]);

const postCandidateEvidencePathSet = new Set(postCandidateEvidencePaths);

export function isPostCandidateEvidencePath(path) {
  return postCandidateEvidencePathSet.has(path);
}
