# Nerio roadmap

## Product direction

Nerio is a source-first design system for modern digital products.

The project has two product layers:

- **Nerio Core**: open-source foundation and base components.
- **Nerio Pro**: paid advanced components, templates, premium themes, Figma assets, and AI tooling.

Core = building blocks. Pro = product-ready solutions.

## Phase 1 — Core foundation

Goal: make Nerio usable as a credible open-source component system.

Scope:

- Monorepo tooling, linting, formatting, typechecking, build scripts, and CI
- Token package
- Theme axis: `purple`, `blue`, `green`, `orange`, `red`, `neutral`, plus custom theme support
- Mode axis: `system`, `light`, `dark`
- Density axis: `comfortable`, `compact`
- Token-customizable values: font, radius, motion, spacing, shadow/elevation, contrast
- No additional runtime appearance axes in v1: no `data-font`, `data-radius`, `data-motion`, `data-contrast`, or `data-scale`
- Default runtime attributes: `data-theme="purple" data-mode="system" data-density="comfortable"`
- Public docs app
- Public registry foundation
- `nerio init`
- Minimal `nerio add button` flow
- `llms.txt`
- Minimal public MCP component index
- Demo app foundation

## Phase 2A — Core quality stabilization

Goal: make the existing Core foundations and components stable enough for future Pro work.

Scope:

- Token foundation, semantic aliases, and component aliases
- Token validation for missing CSS variable references
- Button and IconButton quality pass
- Forms quality pass: Field, FormMessage, Label, Input, Textarea, Checkbox, Switch, Select
- Overlay quality pass: Dialog, Popover, Tooltip, Dropdown Menu, Toast
- Data-display quality pass: Table, Card, Badge, Avatar, Progress, Skeleton, Empty State, Stat, KeyValue, Separator
- Registry metadata, docs reference, CLI fixture, and MCP fixture alignment
- Maturity status updates using `planned`, `implemented-initial`, `quality-pass-needed`, `stable-core`, and `future`

## Phase 2B — Core coverage expansion

Goal: add missing Core components after the foundation is stable.

### Pre-release readiness

Before continuing broad Phase 2B expansion, prepare Core for a future public pre-release without publishing:

- audit package metadata, exports, bins, and intended public/private boundaries;
- keep CI aligned with format, lint, typecheck, docs validation, CLI fixture, MCP fixture, and build checks;
- run package pack dry-runs for intended public Core packages before any manual publishing decision;
- maintain concise changelog and manual release notes;
- document package imports, client imports, styles, and source installs;
- improve CLI discovery with `list`, `info`, and clearer help;
- document that npm publishing requires maintainer approval.

Scope:

- Actions: Button link variant
- Forms: FormGroup, Radio Group
- Overlays: Sheet
- Data display: List
- Feedback: Alert
- Navigation and layout: Breadcrumbs, Pagination, Sidebar Primitive, Command Primitive
- Registry metadata, docs pages, CLI fixtures, and MCP fixtures for newly released components

## Phase 3 — Pro alpha

Goal: build the first commercially useful Pro package.

Scope:

- DataGrid
- Advanced Table
- Filter Bar
- Saved Views
- Column Settings
- KPI Card
- KPI Group
- Trend Chip
- Chart Card
- Activity Feed
- Analytics Panel
- AppShell
- AppSidebar
- Documentation Shell
- Documentation Sidebar
- Page Table of Contents
- Documentation Search
- Settings Layout
- Billing Settings
- Team Members
- Crypto Portfolio components
- AI Chat Shell
- Prompt Input
- Private registry structure
- Private package install strategy

## Phase 4 — Pro commercial

Goal: prepare Nerio Pro for paid release.

Scope:

- License key flow
- Personal token
- CI token
- Pro docs and gated source access
- Public Pro previews and API pages
- Figma Pro kit
- Pro templates
- Private MCP tools
- Pricing page
- License agreement
- Team license model

## Phase 5 — Ecosystem

Goal: expand Nerio into a broader design/dev ecosystem.

Scope:

- Theme Builder
- Optional future runtime axes for radius, font, motion, contrast, or scale after explicit architecture decisions
- More premium brand themes
- More product templates
- AI agent skills
- MCP documentation tools
- Figma variables sync
- Team and enterprise workflows
- Priority support model

## Maintenance rule

When roadmap scope changes, update these files in the same pull request:

- `PROJECT.md`
- `DECISIONS.md`
- `COMPONENTS.md`
- `data/component-catalog.json`
- `AGENTS.md` when agent behavior or boundaries change
