# Core 1.0 API freeze

Date: 2026-08-01  
Issue: #145  
Branch target: `dev`

## Decision

Pass for the technical Core 1.0 API freeze. The canonical public surface is internally aligned,
snapshot-protected, and migratable in both package and editable-source consumption modes.

This decision does not publish a beta or stable release, change npm dist-tags, create a Git tag, or
promote `dev` to `main`.

## Frozen surface

`quality/public-api-snapshot.json` records one coordinated baseline for:

- all six public package manifests and public TypeScript entrypoints;
- 939 public CSS custom properties;
- 46 Registry items and their source/dependency contracts;
- CLI commands and configuration/lock schemas;
- MCP tools and response key shapes;
- public documentation routes, including `/docs/migration`.

The reviewed approval classifies this pre-1.0 cleanup as breaking under issue #145. Future drift
must be classified as breaking, feature, or fix and recorded with a reviewer and issue before the
snapshot changes.

## Alpha compatibility removal

The freeze removes:

- `IconButton`;
- Button `subtle`, `destructive`, and `loadingLabel`;
- Badge `variant`, `icon`, and `BadgeVariant`;
- Select and RadioGroup `onChange`;
- Pagination item string `"aria-label"`;
- Icon `absoluteStrokeWidth`;
- the adapter `LucideIcon` type alias;
- List `ordered`.

The canonical replacements are documented in `docs/migrations/alpha-to-beta.md` and on the public
`/docs/migration` route. The API gate also rejects the reintroduction of alpha compatibility debt
in public source and metadata.

## Support decision

Core 1.0 supports React `>=19 <20`. React 20 and later require new compatibility evidence instead
of being accepted implicitly. Node, Next.js, TypeScript, Tailwind, and browser engine lines remain
governed by `quality/platform-support.json` and `docs/platform-support.md`.

## Package pilot: HR dashboard

Consumer: `/Users/vladimirpavlov/Documents/nerio-hr-dashboard`  
Validation copy: `/Users/vladimirpavlov/Documents/.codex-validation/nerio-hr-frozen`

The package pilot installed the locally packed frozen `tokens`, `adapters`, and `ui` candidates. Its
first production build correctly rejected the removed Select `onChange` alias in the product shell.
After migrating that call to `onValueChange`, lint and the production build passed.

The build statically prerendered:

- `/`
- `/people`
- `/people/maya-chen`
- `/recruiting`
- `/time-off`

No Pro component or product-workflow API was required.

## Editable-source pilot: CRM

Consumer: `/Users/vladimirpavlov/Documents/nerio-crm`  
Validation copy: `/Users/vladimirpavlov/Documents/.codex-validation/nerio-crm-frozen`

The source pilot installed locally packed coordinated Registry, CLI, MCP, adapters, tokens, and UI
candidates. The frozen CLI reported 46 Registry items. Before writing, `doctor`, `diff`, and
`update --dry-run` identified eight upstream-changed component files, one added `avatar-image`
file, the existing theme-token ownership, and the previously changed Command source that now
matched upstream.

The normal update applied safe upstream files and preserved
`components/nerio/styles/tokens.css` byte-for-byte at SHA-256
`9165b2fcbdc7b5f58b90a364453b0d53cf4747307a0a2af5dfc37481a5e17fa2`.

After the migration, a product-owned Badge source marker and the product-owned token file were both
classified as locally modified. A second normal update preserved both byte-for-byte; the Badge hash
remained `2b7ceeeec4551b1ee960fabe925c808cfb76e8c68136f4f644bffa04eea106ed`.
This verifies consumer ownership for both a leaf component and a theme customization.

The CRM product migrated Select `onChange` to `onValueChange`. Lint completed with no errors (14
source-install warnings), the production build passed, and `doctor` reported valid configuration
with the two intentional local modifications.

The build statically prerendered:

- `/`
- `/accounts`
- `/activities`
- `/contacts`
- `/deals/northstar`
- `/pipeline`

No Pro component or product-workflow API was required.

## Repository evidence

Focused evidence:

- `pnpm test:api`: 8/8 passed;
- `pnpm validate:api`: reviewed snapshot passed;
- `pnpm test:catalog`: 29/29 passed;
- `pnpm validate:catalog`: 100 catalog entries, 46 installable identities, 46 Registry items;
- `pnpm validate:docs`: 46 components and 939 tokens aligned;
- `pnpm validate:release:metadata`: passed;
- `pnpm test:ui`: 170/170 passed;
- `pnpm test:a11y`: 25/25 passed;
- `pnpm typecheck`: 11/11 tasks passed.
- Chromium: 106/106 passed in a clean no-retry run;
- WebKit: 16/16 passed;
- visual regression: 29 passed on the complete run and the only initially unstable Finance mobile
  baseline passed in a separate clean one-test run without retries.

The release browser pass also found that the hardened documentation Content Security Policy omitted
same-origin preview frames. The policy now permits `'self'` for `child-src` and `frame-src` while
retaining the explicit external allowlist. The local Firefox binary could not launch because macOS
denied its plugin-container sandbox and SWGL could not map a framebuffer; no Firefox test scenario
ran locally. The required Firefox result therefore remains assigned to the Linux release-gate CI
before issue #145 closes.
