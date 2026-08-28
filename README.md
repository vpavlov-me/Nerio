# Nerio

**A source-first design system for modern digital products.**

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fui?label=npm)](https://www.npmjs.com/package/@nerio-ui/ui)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fui?label=downloads)](https://www.npmjs.com/package/@nerio-ui/ui)
[![release gate](https://github.com/vpavlov-me/Nerio/actions/workflows/release-gate.yml/badge.svg)](https://github.com/vpavlov-me/Nerio/actions/workflows/release-gate.yml)
[![license](https://img.shields.io/github/license/vpavlov-me/Nerio)](./LICENSE)

Nerio is an open-source React design system built for teams that need a reliable, accessible foundation without surrendering control of their component code. It combines semantic design tokens, composable primitives, a source registry, and AI-readable guidance so modern products can start consistent and stay adaptable.

> Status: `1.0.0-beta.1` is the current public beta for the frozen Core 1.0 API. All six public
> packages resolve from npm under both `latest` and `beta`; protected `alpha` remains on
> `0.1.0-alpha.2`. External feedback and manual accessibility/device evidence remain required before
> stable 1.0.

| Package                                     | npm                                                                                                                           | Purpose                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| [`@nerio-ui/ui`](./packages/ui)             | [![npm](https://img.shields.io/npm/v/%40nerio-ui%2Fui?label=version)](https://www.npmjs.com/package/@nerio-ui/ui)             | React components, utilities, and styles |
| [`@nerio-ui/tokens`](./packages/tokens)     | [![npm](https://img.shields.io/npm/v/%40nerio-ui%2Ftokens?label=version)](https://www.npmjs.com/package/@nerio-ui/tokens)     | Tokens, themes, modes, and density      |
| [`@nerio-ui/adapters`](./packages/adapters) | [![npm](https://img.shields.io/npm/v/%40nerio-ui%2Fadapters?label=version)](https://www.npmjs.com/package/@nerio-ui/adapters) | Icons and optional integration adapters |
| [`@nerio-ui/registry`](./packages/registry) | [![npm](https://img.shields.io/npm/v/%40nerio-ui%2Fregistry?label=version)](https://www.npmjs.com/package/@nerio-ui/registry) | Source registry manifest and metadata   |
| [`@nerio-ui/cli`](./packages/cli)           | [![npm](https://img.shields.io/npm/v/%40nerio-ui%2Fcli?label=version)](https://www.npmjs.com/package/@nerio-ui/cli)           | Source installation and update CLI      |
| [`@nerio-ui/mcp`](./packages/mcp)           | [![npm](https://img.shields.io/npm/v/%40nerio-ui%2Fmcp?label=version)](https://www.npmjs.com/package/@nerio-ui/mcp)           | Read-only AI component discovery server |

## Product model

Nerio has two product layers:

- **Nerio Core**: the open-source foundation for tokens, themes, primitive and base UI components, public documentation, public registry, CLI, and public MCP/component discovery.
- **Nerio Pro**: the future paid layer for advanced product components, templates, premium themes, Figma assets, advanced registry items, and Pro MCP/AI tooling.

Core = building blocks. Pro = product-ready solutions.

## What Nerio is for

- Product interfaces for SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, AI interfaces, and data-rich workflows.
- A neutral visual baseline that can become a distinct product brand through tokens and themes.
- Components installed as editable source code, not locked behind a UI package.
- Accessibility aligned with WCAG 2.2 AA.
- Practical AI workflows through structured component metadata, an MCP server, and `llms.txt`.

Nerio Core remains universal and domain-agnostic. SaaS, fintech, crypto, dashboard, and AI products are priority use cases for Pro patterns and templates, not constraints on the whole system.

## Principles

1. **Source over abstraction.** Components should be understandable and editable in the consuming product.
2. **Tokens before styling.** Primitive, semantic, and component tokens keep themes resilient.
3. **Accessible by default.** Keyboard behavior, focus management, semantics, and contrast are product requirements.
4. **Composable by design.** Small primitives and clear slots are preferred over rigid one-off APIs.
5. **Useful in real interfaces.** The system targets dense, data-heavy product work as confidently as marketing surfaces.
6. **AI-readable, human-owned.** Agents can discover the system and assemble interfaces, while maintainers keep architectural control.

## Technology

- Next.js, React, TypeScript
- Tailwind CSS v4
- Base UI primitives
- pnpm workspaces and Turborepo
- Lucide as the default icon source through an icon adapter
- Lucide, TanStack Table, Recharts, React Hook Form, and Zod through responsibility-scoped adapter
  subpaths

## Workspace

```text
apps/
  docs/          Public documentation, component playground, Templates, and full-screen Views

packages/
  tokens/        Design tokens, themes, modes, and CSS variable contracts
  ui/            Core component source and public registry items
  adapters/      Isolated icon, table, chart, form, schema, and optional Motion integration subpaths
  cli/           `nerio` project and component commands
  mcp/           Public AI discovery and composition tools
  config/        Shared TypeScript, linting, and build configuration

data/
  component-catalog.json   Machine-readable Core/Pro component catalog
```

Future Pro implementation may live in a private repository or private workspace. Core must never depend on Pro. Pro may depend on Core.

## Theme, mode, and density

Nerio exposes three v1 runtime axes:

- Theme: Purple, Blue, Green, Orange, Red, Neutral, or custom
- Mode: System, Light, Dark
- Density: Comfortable, Compact

Default runtime attributes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable"></html>
```

Theme controls brand/accent personality. Mode controls light/dark/system color mode. Density controls spacing and control sizing.

Preset themes are generic brand colors. Product teams can add custom themes by defining a new `data-theme` value and overriding semantic/component variables.

Font, radius, motion, spacing, shadow/elevation, and contrast are token-customizable in v1, but they are not separate runtime axes. Customize them through CSS variables such as `--n-font-sans`, `--n-radius-md`, and `--n-duration-normal` rather than attributes such as `data-font` or `data-radius`.

Typography defaults to the platform System UI stack, so Core does not require a font download. The
documentation application uses Geist as its local brand treatment. Core also provides scoped
`.n-typography-system`, `.n-typography-geist`, `.n-typography-inter`, `.n-typography-ibm-plex`,
`.n-typography-manrope`, `.n-typography-source-sans`, and `.n-typography-space-grotesk` token recipes;
products load optional font families themselves. No font files are bundled, and typography presets are
not a runtime axis.

## Core scope

The current beta establishes the token foundation and Core component categories: actions, forms,
overlays, navigation, feedback, data display, layout primitives, and common reusable building
blocks. The approved visual language remains neutral-first, compact, alpha-neutral, and restrained
in its use of brand color.

Advanced product-ready patterns such as DataGrid, KPI dashboards, billing flows, finance/crypto widgets, AI chat shells, premium themes, Figma assets, and templates belong to Nerio Pro unless the component matrix says otherwise.

The documentation application includes a focused Blocks catalog of bounded product compositions, a
Templates catalog for complete app-like scenarios, and the visual Playground in every deployment.
Blocks use same-origin full-screen previews, stay smaller than a product page or shell, and do not
add Core APIs or backend behavior. Operations Workspace and Finance & Assets are the current
deterministic docs-local Templates rather than released Pro packages.

See [`COMPONENTS.md`](./COMPONENTS.md) for the current Core/Pro component matrix.
See the [Core platform primitive coverage decision](./docs/core-platform-primitive-coverage.md) for
the complete native-versus-component boundary. Input supports native date, month, week, time, and
`datetime-local` values while preserving browser-owned picker, validity, and form behavior. Core
1.0 includes Toggle for one retained button state, a single-value Slider, native FileInput,
Calendar, and a bounded single-date DatePicker;
their product-workflow extensions remain outside Core.

## Package entrypoints

Install the current coordinated release. Unqualified package requests resolve through npm
`latest`, which tracks the newest public Nerio version:

```bash
pnpm add @nerio-ui/ui @nerio-ui/tokens @nerio-ui/adapters
```

`@nerio-ui/ui` is the server-safe default entrypoint for static Core components and utilities.
Interactive Base UI-backed components such as Button, Toggle, Select, Slider, Dialog, Tabs, Toast,
Tooltip, Popover, DropdownMenu, Checkbox, RadioGroup, and Switch are exported from
`@nerio-ui/ui/client`. Icon-only actions use Button's `icon` plus `aria-label` contract. Styles
remain available through `@nerio-ui/ui/styles.css`.

`@nerio-ui/adapters` has no aggregating root entrypoint. Import icons and their public SVG types from
`@nerio-ui/adapters/icons`. Optional integrations use `@nerio-ui/adapters/table`,
`@nerio-ui/adapters/charts`, `@nerio-ui/adapters/forms`, `@nerio-ui/adapters/schema`, or the
client-only `@nerio-ui/adapters/motion`; install the matching TanStack Table, Recharts, React Hook
Form, Zod, or Motion peer only when that subpath is used. Core UI remains CSS-first and never
imports Motion.

Source-installed registry components keep their local paths, such as
`@/components/nerio/components/button`. `nerio init` defaults to `src/components/nerio` when it
detects `src/app` or `src/pages`, matching the standard Next.js `@/*` alias; projects without a
`src` application directory keep the `components/nerio` default. Use `--components` to override it.

The runtime Core packages ship unbundled JavaScript and declarations, so supported Next.js
consumers do not need `transpilePackages`. Tailwind scans the compiled UI output through the
package-mode `@source` path documented in Getting started. Editable source remains available
through the version-aligned Registry and CLI workflow.

Runtime, framework, browser-engine, operating-system, and assistive-technology expectations are
defined in the [platform support policy](./docs/platform-support.md) and checked in CI.

```tsx
import { Alert, Breadcrumbs, Card, FileInput, List, Pagination, Table } from "@nerio-ui/ui";
import { Settings } from "@nerio-ui/adapters/icons";
import { Button, Dialog, Select, Slider, ToastProvider, Toggle } from "@nerio-ui/ui/client";
import "@nerio-ui/ui/styles.css";
```

## Registry CLI

Install the version-aligned Registry and CLI in the consuming project. The `nerio` CLI then installs
editable source files through the project-local bin:

```bash
pnpm add -D @nerio-ui/registry@1.0.0-beta.1 @nerio-ui/cli@1.0.0-beta.1
pnpm exec nerio init
pnpm exec nerio list
pnpm exec nerio info button
pnpm exec nerio add button --dry-run
pnpm exec nerio add button card --dry-run
pnpm exec nerio add --all --dry-run --json
pnpm exec nerio add button
pnpm exec nerio diff button
pnpm exec nerio update button --dry-run
pnpm exec nerio doctor
```

For one-off initialization or installation, use the real package name:
`pnpm dlx @nerio-ui/cli@1.0.0-beta.1 init` or
`pnpm dlx @nerio-ui/cli@1.0.0-beta.1 add button`. Prefer the local installation for repeatable
updates and explicit CLI/Registry version alignment.

The default Registry is the immutable manifest packed with the installed `@nerio-ui/registry`
version; local-path and HTTPS overrides remain available. Plain HTTP is rejected unless a trusted
local Registry is selected with the explicit `--allow-insecure-http` flag. Remote manifests and
source are bounded by a 10-second request/body timeout, a 2 MiB manifest limit, a 4 MiB per-source
limit, at most three redirects, content-type handling, schema/path validation, and SHA-256
integrity checks.

`nerio add` accepts one or more explicit Registry items, while `nerio add --all` selects every item.
It resolves one sorted dependency and package-dependency union, fetches and preflights every target
before writing, and reports every conflict without partially applying the set. `--dry-run` renders
the same deterministic plan without writes, and `--json` emits the bounded versioned add-result
schema documented in `docs/cli-add-output.md`. A successful add stages the full operation, commits
source, and writes `nerio.lock.json` last; any source or lock failure restores
the previous source and lock state and removes temporary artifacts. A durable local journal lets the
next state-sensitive command (`add`, `diff`, `update`, or `doctor`) recover an operation interrupted
by process exit or machine failure; a fully committed source-and-lock transaction is retained and
only its orphaned journal is removed. State-sensitive Registry commands share one project-local
process lock, so installs, updates, validation, and recovery cannot race source state against
`nerio.lock.json`; `list` and `info` remain read-only inspection commands. A dead owner's lock is
reclaimed before journal recovery, and an expired heartbeat distinguishes a restarted or PID-reused
owner. The lock records
exact Registry version, revision, file paths, dependency closure, original hashes, integrity
metadata, and owners.
`nerio diff` separates local and upstream drift. `nerio update --dry-run` previews a deterministic
update, while `nerio update` applies only safe upstream changes and never overwrites locally modified
source silently. Run `nerio doctor` after configuring the consumer stylesheet to validate versions,
installed metadata, dependencies, source drift, the Tailwind bridge, package `@source`, token
imports, no-Preflight compatibility, and stale legacy CSS.

## MCP server

Install the read-only MCP server with `pnpm add -D @nerio-ui/mcp@1.0.0-beta.1`, then configure the
client to run the published bin with command `pnpm` and arguments `["exec", "nerio-mcp"]`. A
package-qualified one-off configuration may use command `pnpm` and arguments
`["dlx", "@nerio-ui/mcp@1.0.0-beta.1"]`. The server version comes from coordinated package
metadata, and its Registry tools report the exact Registry version, source revision, schema, and
style contract. Every tool declares an output schema and returns equivalent structured content and
JSON text; missing components use the stable `COMPONENT_NOT_FOUND` error code.

## Pre-release status

The root workspace, apps, and `@nerio-ui/config` remain private. The public Core packages are
`@nerio-ui/tokens`, `@nerio-ui/ui`, `@nerio-ui/adapters`, `@nerio-ui/registry`, `@nerio-ui/cli`, and
`@nerio-ui/mcp`.

The coordinated `1.0.0-beta.1` packages, Registry revision, CLI, and MCP server are published under
npm `latest` and `beta` from the signed `v1.0.0-beta.1` release. Protected `alpha` remains on
`0.1.0-alpha.2`. Public metadata, clean package/source installation, the CLI lifecycle, MCP startup,
and a clean Next.js consumer were verified after publication. The external-feedback and manual
accessibility/device gates remain open before stable documentation begins. The frozen contract is
defined by the
[public API stability policy](./docs/public-api-stability.md); alpha consumers should use the
[Core 1.0 migration guide](./docs/migrations/alpha-to-beta.md). See
[RELEASE.md](./RELEASE.md), [CHANGELOG.md](./CHANGELOG.md), the
[beta technical gap-closure report](./docs/core-1-0-beta-gap-closure.md), and the
[beta feedback cycle](./docs/beta-feedback-cycle.md).

## Contributing

Nerio welcomes issues and pull requests. All contributions are reviewed by maintainers to preserve the system's API, visual consistency, accessibility standards, and long-term direction.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

Distributed under the [MIT License](./LICENSE).

## Author

Created and maintained by [Vladimir Pavlov](https://github.com/vpavlov-me).
