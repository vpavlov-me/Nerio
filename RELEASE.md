# Release Process

Nerio Core is not published yet. The first public pre-release is expected to be a manual maintainer decision, likely `0.1.0-alpha.0`.

## Required checks

Run the full quality gate before preparing a release:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:ui
pnpm test:a11y
pnpm validate:docs
pnpm validate:release
pnpm test:cli
pnpm test:mcp
pnpm build
pnpm pack:check
```

All checks must pass locally or in CI. CI is a validation gate only: it does not publish packages, configure npm tokens, create tags, create GitHub Releases, or approve a release. npm publishing remains manual and maintainer-approved.

## Versioning

Keep the root workspace and apps private. The intended public Core packages must use coordinated versions:

- `@nerio/tokens`
- `@nerio/ui`
- `@nerio/adapters`
- `@nerio/registry`
- `@nerio/cli`
- `@nerio/mcp`

`@nerio/config` is internal workspace tooling and remains private.

## Dry run

Before any publish decision, run the package dry-run check locally and inspect the included files:

```bash
pnpm pack:check
```

`pack:check` runs `npm pack --dry-run` for the intended public Core packages only. It does not check the root workspace, apps, `@nerio/config`, Pro packages, or templates.

## First public pre-release

The following are documented future steps for preparing `0.1.0-alpha.0`; do not perform them until an explicit maintainer approval.

1. Confirm the intended public package list and that every package is ready to become public.
2. Confirm coordinated package versions.
3. Run the full quality gate and `pnpm pack:check`.
4. Review packed files for every intended package.
5. Review [CHANGELOG.md](./CHANGELOG.md), including deprecated and migration-sensitive APIs.
6. Convert `Unreleased` into `## 0.1.0-alpha.0 — YYYY-MM-DD` and add a new empty `Unreleased` section above it.
7. Create the Git tag only after maintainer approval.
8. Create a GitHub Release from the changelog entry.
9. Publish packages manually only after approval.
10. Verify registry, CLI, and MCP compatibility after publishing.

## Public changelog page

The documentation application should add a public Changelog page only when the first public pre-release is ready, at least one supported public installation method exists, package or registry versions are externally meaningful, external users need migration information, and the release policy is stable enough to maintain versioned entries.

Until then, [CHANGELOG.md](./CHANGELOG.md) is the canonical release ledger. It must not appear in primary documentation navigation, and merged development work remains under `Unreleased`.
