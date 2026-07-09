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
pnpm pack:check
```

CI must pass before release. Confirm the docs app builds successfully before release.

CI is a validation gate only. It does not publish packages, configure npm tokens, create release tags, or approve a release.

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

Before any real publish decision, run the package dry-run check locally and inspect the included files:

```bash
pnpm pack:check
```

`pack:check` runs `npm pack --dry-run` for the intended public Core packages only: `@nerio/tokens`, `@nerio/ui`, `@nerio/adapters`, `@nerio/registry`, `@nerio/cli`, and `@nerio/mcp`. It does not check the root workspace, apps, `@nerio/config`, Pro packages, or templates.

## Publishing

Do not publish automatically from CI. npm publishing must remain manual and maintainer-approved.

Do not publish Pro packages, private packages, apps, templates, or unreleased workspace tooling.
