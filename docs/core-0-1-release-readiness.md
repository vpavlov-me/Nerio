# Core 0.1 release readiness

## Decision

**Ready for a separately approved manual `0.1.0-alpha.0` release.** The repository gate, packed
package smoke test, clean consumer build, docs surface, and browser matrix pass. This decision does
not authorize publishing packages, changing package privacy, creating a tag, or creating a GitHub
Release.

## Scope and status

- The catalog contains 50 `stable-core` Core entries and one `deprecated-compatibility` entry
  (IconButton).
- All 44 planned Pro entries remain outside the Core 0.1 release scope.
- `data/component-catalog.json`, `COMPONENTS.md`, the registry, package entrypoints, docs navigation,
  CLI/MCP discovery, README, project brief, and `llms.txt` describe the same Core boundary.
- Core packages do not import Pro code, templates, premium themes, or private assets.

## Package and consumer evidence

The coordinated intended public packages are `@nerio/tokens`, `@nerio/adapters`,
`@nerio/registry`, `@nerio/ui`, `@nerio/cli`, and `@nerio/mcp`, all at `0.1.0-alpha.0` and still
`private: true`.

`pnpm validate:release` verifies every packed manifest, repository/license/Node metadata, file
boundary, and absence of workspace protocols. It then installs all six tarballs into an isolated
Next.js project, exercises server-safe and client entrypoints, imports styles and tokens, runs the
packed CLI and MCP runtime, installs representative action/form/overlay/feedback/navigation/data
components with dependency chains, and completes a production build without monorepo aliases.

`pnpm test:adapters` additionally verifies the packed responsibility-scoped adapter exports. The
icons/UI-only fixture typechecks and builds without TanStack Table, Recharts, React Hook Form, or
Zod, while table, charts, forms, and schema fixtures fail predictably without their matching optional
peer and pass once it is installed.

Release-blocking defects fixed by the gate:

- The packed MCP server now resolves `@nerio/registry/manifest.json` instead of a monorepo-relative
  path.
- Select source installation now includes `resolve-class-name.ts`.
- Package consumers receive the required documented Next.js `transpilePackages` configuration for
  TypeScript source packages.
- Every public package now carries the coordinated version and explicit repository, license,
  homepage, issues, Node, dependency, peer dependency, export, bin, and side-effect metadata where
  applicable.

## Browser matrix

The demo browser gate passed 24 checks across:

- Purple, Blue, Green, Orange, Red, and Neutral themes.
- System, Light, and Dark modes.
- Comfortable and Compact density token behavior.
- Desktop and 390-pixel mobile viewports with no horizontal overflow.
- Keyboard-visible focus, mobile Sheet open/dismiss behavior, and focus restoration.
- Loading, empty, error, and success states.
- RTL layout, reduced motion, and forced colors.
- No framework overlays, console errors, hydration errors, or failed resources.

The docs browser gate passed 14 checks covering Getting started, package/source guidance, release
and contribution links, canonical metadata, component rendering, sitemap scope, legacy composition
`noindex` behavior, the removal of Blocks/Templates from Core navigation, and no console or hydration
errors.

The Sheet browser gate additionally verifies all four physical sides, the sm/md/lg sizes, neutral
footer and default icon close paths, safe-area viewport metadata and offsets, long internal scrolling,
mobile dynamic viewport resizing, compact density, RTL, reduced motion, forced colors, side-specific
enter/exit timing, and focus restoration without console or framework errors.

## Complete command gate

Run from a clean checkout:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm test:ui
pnpm test:a11y
pnpm test:cli
pnpm test:mcp
pnpm test:adapters
pnpm validate:tokens
pnpm validate:runtime-axes
pnpm validate:typography
pnpm validate:catalog
pnpm validate:docs
pnpm validate:release
pnpm pack:check
```

## Known non-blocking limitations

- No public npm release exists. Package manifests deliberately remain private pending explicit
  approval.
- IconButton and documented Button aliases remain only for alpha migration compatibility.
- Package distribution is source-first TypeScript; Next.js consumers configure
  `transpilePackages`.
- App-local composition stress tests remain available as unindexed internal preview routes, not as
  public Core Blocks or Templates.
