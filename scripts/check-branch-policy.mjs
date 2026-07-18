import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const allowedDevelopmentBranchPattern =
  "^(feat|feature|fix|refactor|docs|test|chore|dependabot)/[A-Za-z0-9._/-]+$";
export const branchPolicyMessages = {
  main: "Pull requests to main are allowed only from the dev integration branch.",
  mainToDev:
    "Pull requests from main to dev are allowed only for same-repository synchronization.",
  development:
    "Pull requests to dev must use a feat/, feature/, fix/, refactor/, docs/, test/, chore/, or bot-managed dependabot/ branch.",
};

const allowedDevelopmentBranch = new RegExp(allowedDevelopmentBranchPattern);

export function checkBranchPolicy(baseRef, headRef, repositories = {}) {
  if (baseRef === "main") {
    const isRepositoryDev =
      headRef === "dev" &&
      (!repositories.repository ||
        !repositories.headRepository ||
        repositories.repository === repositories.headRepository);
    return isRepositoryDev
      ? { allowed: true, message: "Release pull request dev -> main is allowed." }
      : {
          allowed: false,
          message: branchPolicyMessages.main,
        };
  }

  if (baseRef === "dev") {
    if (headRef === "main") {
      const isRepositoryMain =
        !repositories.repository ||
        !repositories.headRepository ||
        repositories.repository === repositories.headRepository;
      return isRepositoryMain
        ? { allowed: true, message: "Synchronization pull request main -> dev is allowed." }
        : { allowed: false, message: branchPolicyMessages.mainToDev };
    }

    return allowedDevelopmentBranch.test(headRef)
      ? { allowed: true, message: `Development pull request ${headRef} -> dev is allowed.` }
      : {
          allowed: false,
          message: branchPolicyMessages.development,
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

  const result = checkBranchPolicy(baseRef, headRef, {
    headRepository: process.env.GITHUB_HEAD_REPOSITORY,
    repository: process.env.GITHUB_REPOSITORY,
  });
  const output = result.allowed ? console.log : console.error;
  output(result.message);
  if (!result.allowed) process.exitCode = 1;
}
