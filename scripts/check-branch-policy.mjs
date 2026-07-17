import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const allowedDevelopmentBranch =
  /^(?:feat|feature|fix|refactor|docs|test|chore)\/[A-Za-z0-9._/-]+$/;

export function checkBranchPolicy(baseRef, headRef) {
  if (baseRef === "main") {
    return headRef === "dev"
      ? { allowed: true, message: "Release pull request dev -> main is allowed." }
      : {
          allowed: false,
          message: "Pull requests to main are allowed only from the dev integration branch.",
        };
  }

  if (baseRef === "dev") {
    if (headRef === "main") {
      return { allowed: false, message: "Pull requests from main to dev are not allowed." };
    }

    return allowedDevelopmentBranch.test(headRef)
      ? { allowed: true, message: `Development pull request ${headRef} -> dev is allowed.` }
      : {
          allowed: false,
          message:
            "Pull requests to dev must use a feat/, feature/, fix/, refactor/, docs/, test/, or chore/ branch.",
        };
  }

  return {
    allowed: false,
    message: `Branch policy is defined only for pull requests to main or dev, not ${baseRef}.`,
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const baseRef = process.env.GITHUB_BASE_REF ?? process.argv[2];
  const headRef = process.env.GITHUB_HEAD_REF ?? process.argv[3];

  if (!baseRef || !headRef) {
    console.error("Usage: check-branch-policy.mjs <base-ref> <head-ref>");
    process.exit(2);
  }

  const result = checkBranchPolicy(baseRef, headRef);
  const output = result.allowed ? console.log : console.error;
  output(result.message);
  if (!result.allowed) process.exitCode = 1;
}
