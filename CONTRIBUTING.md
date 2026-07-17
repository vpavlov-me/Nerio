# Contributing to Nerio

Thank you for contributing to Nerio. The project is open source, but its component API, accessibility bar, token architecture, and visual direction are maintained deliberately.

## Before starting

- Search existing issues and discussions before opening a new one.
- For a new component, substantial API change, or design-direction change, open an issue first. This prevents parallel work on an approach that will not be merged.
- Keep pull requests focused. One concern per pull request is the default.

## Development workflow

`main` is Nerio's stable production branch and remains the repository default. `dev` is the permanent
integration branch. Direct pushes, force pushes, and deletion are prohibited for both branches.

1. Update `dev`, then create a focused branch from it.
2. Use `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `test/*`, or `chore/*`, for example
   `feat/command-menu` or `fix/dialog-focus-return`.
3. Open the pull request into `dev`. Feature branches must never target `main` directly.
4. Follow the rules in `AGENTS.md` and the architecture in `PROJECT.md`.
5. Review component and API work against the canonical
   [Core UI best practices](./docs/core-ui-best-practices.md), including responsibility ownership,
   API admission, styling layer, state, accessibility, responsive, motion, and evidence requirements.
6. Add or update documentation, usage examples, types, registry metadata, and accessibility notes together with the implementation.
7. Run the required checks before opening a pull request.
8. Merge into `dev` only after required CI checks pass and review conversations are resolved.

Once the workspace is bootstrapped, the standard commands will be:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm typecheck
pnpm test:ui
pnpm test:a11y
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
- Target `dev` from a supported development branch, unless this is the release pull request from
  `dev` to `main`.

For every proposed prop, variant, size, state, slot, event, or imperative handle, explain why
existing composition, tokens, consumer `className` or source ownership, and existing slots are
insufficient. Do not use arbitrary prop-count limits; demonstrate a stable semantic or behavioral
need, multiple independent use cases, preserved accessibility and entrypoints, and justified
maintenance cost.

Use the reusable component/family review checklist in
[`docs/core-ui-best-practices.md`](./docs/core-ui-best-practices.md#reusable-component-or-family-review-checklist)
for implementation and review evidence.

## Changelog and release notes

Meaningful public changes require a release note and an update to [CHANGELOG.md](./CHANGELOG.md) under `Unreleased`. Internal-only changes can select `No user-facing change` in the pull request template. Deprecated or breaking changes must include concise migration guidance and describe the preferred consumer path. Maintainers may edit release-note wording during review, and multiple pull request entries may later be consolidated into one release entry.

## Release pull requests

After the intended changes have landed in `dev` and the integration branch is release-ready, a
maintainer creates a dedicated pull request from `dev` to `main`. No other source branch is accepted
for `main`. The release pull request reruns all required checks and is merged manually by the
maintainer. `dev` is not deleted after the release.

Codex and other coding agents may prepare a release pull request only when explicitly asked. They
must not merge a pull request into `main` without a separate, direct maintainer request.

## Review and ownership

All changes require maintainer review. The presence of a pull request does not imply acceptance; maintainers may request a smaller scope, a different API, or a different composition strategy to preserve Nerio's long-term consistency.

Contributor authorship remains visible through Git history. Major contributions may additionally be acknowledged in release notes or project documentation.
