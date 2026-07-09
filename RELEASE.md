# Release Process

Nerio Core is not published yet. The first public pre-release is expected to be a manual maintainer decision, likely `0.1.0-alpha.0`.

## Required Checks

Run the full quality gate before preparing a release:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm validate:docs
pnpm test:cli
pnpm test:mcp
pnpm build
```

Confirm the docs app builds successfully before release.

## Versioning

Keep the root workspace and apps private. Future public Core packages are expected to share the selected pre-release version:

- `@nerio/tokens`
- `@nerio/ui`
- `@nerio/adapters`
- `@nerio/registry`
- `@nerio/cli`
- `@nerio/mcp`

`@nerio/config` is internal workspace tooling and should remain private.

## Dry Run

Before any real publish, run npm dry-runs from each intended public package and inspect the included files:

```bash
pnpm --filter @nerio/tokens exec npm pack --dry-run
pnpm --filter @nerio/ui exec npm pack --dry-run
pnpm --filter @nerio/adapters exec npm pack --dry-run
pnpm --filter @nerio/registry exec npm pack --dry-run
pnpm --filter @nerio/cli exec npm pack --dry-run
pnpm --filter @nerio/mcp exec npm pack --dry-run
```

## Publishing

Do not publish automatically from CI. npm publishing must remain manual until maintainers explicitly approve the release process.

Do not publish Pro packages, private packages, apps, templates, or unreleased workspace tooling.
