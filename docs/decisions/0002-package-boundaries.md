# ADR 0002: Package boundaries

## Status

Accepted

## Context

Nerio needs clear boundaries between public Core packages and future private Pro packages. AI agents and contributors must be able to understand where code belongs before implementing components.

## Decision

Core implementation currently lives in public workspace packages:

```text
packages/tokens
packages/ui
packages/adapters
packages/cli
packages/mcp
packages/config
```

Future Pro implementation may live in a private repository or private workspace.

Core packages must never depend on Pro packages.

Pro packages may depend on Core packages.

## Rules

- `packages/ui` contains Core components and public registry source items.
- `packages/tokens` contains token source, generated CSS variables, themes, and density contracts.
- `packages/adapters` contains icon, form, table, and chart adapters.
- `packages/cli` contains public CLI commands such as `nerio init`, `nerio add`, and `nerio doctor`.
- `packages/mcp` contains public AI component discovery and composition tools.
- Future Pro packages may use `@nerio/pro`, `@nerio/pro-themes`, `@nerio/pro-registry`, and `@nerio/pro-mcp` naming.
- Any component implementation must match the tier defined in `COMPONENTS.md` and `data/component-catalog.json`.

## Consequences

This keeps the open-source foundation clean while allowing a private Pro layer to evolve without leaking paid implementation details into Core.
