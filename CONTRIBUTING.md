# Contributing to Nerio

Thank you for contributing to Nerio. The project is open source, but its component API, accessibility bar, token architecture, and visual direction are maintained deliberately.

## Before starting

- Search existing issues and discussions before opening a new one.
- For a new component, substantial API change, or design-direction change, open an issue first. This prevents parallel work on an approach that will not be merged.
- Keep pull requests focused. One concern per pull request is the default.

## Development workflow

1. Fork the repository and create a branch from `main`.
2. Use a descriptive branch name, for example `feat/command-menu` or `fix/dialog-focus-return`.
3. Follow the rules in `AGENTS.md` and the architecture in `PROJECT.md`.
4. Add or update documentation, usage examples, types, registry metadata, and accessibility notes together with the implementation.
5. Run the required checks before opening a pull request.

Once the workspace is bootstrapped, the standard commands will be:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Commit messages

Use Conventional Commit-style prefixes:

- `feat:` new user-facing capability
- `fix:` bug fix
- `docs:` documentation only
- `refactor:` internal change without behavior change
- `test:` tests only
- `chore:` tooling, maintenance, or repository work

## Developer Certificate of Origin

Contributions must include a DCO sign-off confirming that the contributor has the right to submit the work under the MIT License:

```text
Signed-off-by: Your Name <your.email@example.com>
```

Use `git commit -s` to add it automatically. The repository will enforce this once CI is bootstrapped.

## Pull request requirements

A pull request should:

- Explain the problem and the chosen approach.
- Link the relevant issue when one exists.
- Include screenshots or a short recording for visible changes.
- Preserve keyboard behavior, focus management, and semantic markup.
- Avoid hard-coded visual values when a token can express the intent.
- Keep documentation in English.
- Pass required CI checks.

## Review and ownership

All changes require maintainer review. The presence of a pull request does not imply acceptance; maintainers may request a smaller scope, a different API, or a different composition strategy to preserve Nerio's long-term consistency.

Contributor authorship remains visible through Git history. Major contributions may additionally be acknowledged in release notes or project documentation.
