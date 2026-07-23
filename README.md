# Nerio

**A source-first design system for modern digital products.**

Nerio is an open-source React design system built for teams that need a reliable, accessible foundation without surrendering control of their component code. It combines semantic design tokens, composable primitives, a source registry, and AI-readable guidance so modern products can start consistent and stay adaptable.

> Status: `0.1.0-alpha.1` is published under the npm `alpha` tag and as a GitHub prerelease. The
> `latest` tag intentionally remains on `0.1.0-alpha.0` while the Tailwind CSS v4-first line is
> validated before 1.0.

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
  docs/          Public documentation and component playground
  demo-app/      Universal showcase product built with Nerio Core

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

The current alpha establishes the token foundation and Core component categories: actions, forms,
overlays, navigation, feedback, data display, layout primitives, and common reusable building
blocks. The approved visual language remains neutral-first, compact, alpha-neutral, and restrained
in its use of brand color.

Advanced product-ready patterns such as DataGrid, KPI dashboards, billing flows, finance/crypto widgets, AI chat shells, premium themes, Figma assets, and templates belong to Nerio Pro unless the component matrix says otherwise.

See [`COMPONENTS.md`](./COMPONENTS.md) for the current Core/Pro component matrix.
See the [Core platform primitive coverage decision](./docs/core-platform-primitive-coverage.md) for
the complete native-versus-component boundary. Input supports native date, month, week, time, and
`datetime-local` values while preserving browser-owned picker, validity, and form behavior. Core
1.0 includes a single-value Slider, native FileInput, Calendar, and a bounded single-date DatePicker;
their product-workflow extensions remain outside Core.

## Package entrypoints

`@nerio-ui/ui` is the server-safe default entrypoint for static Core components and utilities. Interactive Base UI-backed components such as Button, Select, Slider, Dialog, Tabs, Toast, Tooltip, Popover, DropdownMenu, Checkbox, RadioGroup, and Switch are exported from `@nerio-ui/ui/client`. IconButton remains a deprecated alpha compatibility export; new work uses Button's icon-only mode. Styles remain available through `@nerio-ui/ui/styles.css`.

`@nerio-ui/adapters` has no aggregating root entrypoint. Import icons and their public SVG types from
`@nerio-ui/adapters/icons`. Optional integrations use `@nerio-ui/adapters/table`,
`@nerio-ui/adapters/charts`, `@nerio-ui/adapters/forms`, `@nerio-ui/adapters/schema`, or the
client-only `@nerio-ui/adapters/motion`; install the matching TanStack Table, Recharts, React Hook
Form, Zod, or Motion peer only when that subpath is used. Core UI remains CSS-first and never
imports Motion.

Source-installed registry components keep their local paths, such as `@/components/nerio/components/button`.

The Core packages ship TypeScript source. Next.js consumers must list the Nerio packages they use
in `transpilePackages`; the complete configuration is documented in Getting started.

Runtime, framework, browser-engine, operating-system, and assistive-technology expectations are
defined in the [platform support policy](./docs/platform-support.md) and checked in CI.

```tsx
import { Alert, Breadcrumbs, Card, FileInput, List, Pagination, Table } from "@nerio-ui/ui";
import { Settings } from "@nerio-ui/adapters/icons";
import { Button, Dialog, Select, Slider, ToastProvider } from "@nerio-ui/ui/client";
import "@nerio-ui/ui/styles.css";
```

## Registry CLI

Install the version-aligned Registry and CLI in the consuming project. The `nerio` CLI then installs
editable source files through the project-local bin:

```bash
pnpm add -D @nerio-ui/registry@0.1.0-alpha.1 @nerio-ui/cli@0.1.0-alpha.1
pnpm exec nerio init
pnpm exec nerio list
pnpm exec nerio info button
pnpm exec nerio add button --dry-run
pnpm exec nerio add button
pnpm exec nerio diff button
pnpm exec nerio update button --dry-run
pnpm exec nerio doctor
```

For one-off initialization or installation, use the real package name:
`pnpm dlx @nerio-ui/cli@0.1.0-alpha.1 init` or
`pnpm dlx @nerio-ui/cli@0.1.0-alpha.1 add button`. Prefer the local installation for repeatable
updates and explicit CLI/Registry version alignment.

The default Registry is the immutable manifest packed with the installed `@nerio-ui/registry`
version; local-path and HTTP overrides remain available. `nerio add` writes the requested source
closure and records its exact Registry version, revision, file paths, dependency closure, and
original hashes in `nerio.lock.json`. `nerio diff` separates local and upstream drift. `nerio
update --dry-run` previews a deterministic update, while `nerio update` applies only safe upstream
changes and never overwrites locally modified source silently. Run `nerio doctor` after configuring
the consumer stylesheet to validate versions, installed metadata, dependencies, source drift, the
Tailwind bridge, package `@source`, token imports, no-Preflight compatibility, and stale legacy CSS.

## MCP server

Install the read-only MCP server with `pnpm add -D @nerio-ui/mcp@0.1.0-alpha.1`, then configure the
client to run the published bin with command `pnpm` and arguments `["exec", "nerio-mcp"]`. A
package-qualified one-off configuration may use command `pnpm` and arguments
`["dlx", "@nerio-ui/mcp@0.1.0-alpha.1"]`. The server version comes from coordinated package
metadata, and its Registry tools report the exact Registry version, source revision, schema, and
style contract.

## Pre-release status

The root workspace, apps, and `@nerio-ui/config` remain private. The public Core packages are
`@nerio-ui/tokens`, `@nerio-ui/ui`, `@nerio-ui/adapters`, `@nerio-ui/registry`, `@nerio-ui/cli`, and
`@nerio-ui/mcp`.

The npm `alpha` tag points to the published Tailwind-first `0.1.0-alpha.1`; `latest` remains on
`0.1.0-alpha.0`. The alpha.1 package, signed tag, and GitHub prerelease passed the packed-package
audit, clean consumer build, and browser matrix. Its architecture and migration guidance are
recorded in the [final migration report](./docs/tailwind-migration-report.md). Alpha APIs may still
change before 1.0. See [RELEASE.md](./RELEASE.md) and [CHANGELOG.md](./CHANGELOG.md).

## Contributing

Nerio welcomes issues and pull requests. All contributions are reviewed by maintainers to preserve the system's API, visual consistency, accessibility standards, and long-term direction.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

Distributed under the [MIT License](./LICENSE).

## Author

Created and maintained by [Vladimir Pavlov](https://github.com/vpavlov-me).
