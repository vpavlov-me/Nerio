# Repository settings

This file records the required GitHub configuration. It is intentionally versioned so the project remains governed consistently if it moves to an organization later.

## Main branch ruleset

Create a ruleset for `main` with these settings:

- Require a pull request before merging.
- Require 1 approving review.
- Require review from Code Owners.
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution before merging.
- Block force pushes and branch deletion.
- Require linear history.
- Do not allow bypassing for maintainers, except for a documented emergency security fix.

After CI exists, add the `quality` workflow check as required. Do not require a status check before the workflow is committed and verified.

## Merge policy

- Enable squash and rebase merging.
- Disable merge commits.
- Delete head branches automatically after pull requests are merged.
- Use squash merges for small, single-purpose changes; prefer rebase merges when preserving an intentional authored commit history matters.

## Security and automation

Enable these repository features:

- Dependency graph
- Dependabot alerts
- Dependabot security updates
- Secret scanning
- Push protection for secrets
- Private vulnerability reporting
- GitHub Discussions

For Actions, begin with GitHub-owned actions and explicitly pinned third-party actions only. Review every new workflow dependency before it is added.

## Repository metadata

Set the repository description to:

> Source-first React design system for adaptable SaaS and fintech interfaces.

Suggested topics:

`design-system`, `react`, `nextjs`, `tailwindcss`, `base-ui`, `typescript`, `fintech`, `saas`, `accessibility`, `ai-tools`, `mcp`

Add a social preview image once Nerio's first visual identity is ready.
