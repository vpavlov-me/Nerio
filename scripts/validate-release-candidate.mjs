import { execFileSync, spawnSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function candidateSyntaxFailure(candidate) {
  return /^[0-9a-f]{40}$/.test(candidate ?? "")
    ? undefined
    : "candidate_sha must be an exact lowercase 40-character commit SHA";
}

export function validateReleaseCandidate(
  candidate,
  releaseRef = "origin/dev",
  cwd = process.cwd(),
) {
  const failures = [];
  const syntaxFailure = candidateSyntaxFailure(candidate);
  if (syntaxFailure) return [syntaxFailure];

  const object = spawnSync("git", ["cat-file", "-e", `${candidate}^{commit}`], { cwd });
  if (object.status !== 0) {
    return [`${candidate} is not a commit in this repository checkout`];
  }

  const ancestry = spawnSync("git", ["merge-base", "--is-ancestor", candidate, releaseRef], {
    cwd,
  });
  if (ancestry.status !== 0) {
    failures.push(`${candidate} is not an ancestor of the release branch ${releaseRef}`);
  }

  const containingRefs = execFileSync("git", ["branch", "-r", "--contains", candidate], {
    cwd,
    encoding: "utf8",
  })
    .split(/\r?\n/)
    .map((value) => value.trim())
    .filter(Boolean);
  if (!containingRefs.includes(releaseRef)) {
    failures.push(`${candidate} is not owned by the repository release branch ${releaseRef}`);
  }
  return failures;
}

function parseArgs(args) {
  const options = { releaseRef: "origin/dev" };
  for (let index = 0; index < args.length; index += 2) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--candidate", "--release-ref"].includes(name) || !value) {
      throw new Error(
        "Usage: validate-release-candidate.mjs --candidate <sha> [--release-ref origin/dev]",
      );
    }
    options[name === "--candidate" ? "candidate" : "releaseRef"] = value;
  }
  if (!options.candidate) {
    throw new Error(
      "Usage: validate-release-candidate.mjs --candidate <sha> [--release-ref origin/dev]",
    );
  }
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = parseArgs(process.argv.slice(2));
  const failures = validateReleaseCandidate(options.candidate, options.releaseRef);
  if (failures.length) {
    throw new Error(`Release candidate validation failed:\n- ${failures.join("\n- ")}`);
  }
  console.log(
    `Release candidate ${options.candidate} is a repository-owned ancestor of ${options.releaseRef}.`,
  );
}
