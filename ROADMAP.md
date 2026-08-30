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

## Core 1.0 stable sequence

The frozen Core 1.0 surface and beta.1 technical candidate are complete. Stable 1.0 remains blocked
by the manual accessibility/device gate #143 and the public beta.1/external-feedback gate #146,
followed by #148, #150, and the manual publication issue #151.

<!-- parity-track:manual-stable-gates issues:#143,#146,#148,#150,#151 depends-on: -->

Do not start post-1.0 runtime, package, Registry, token, export, or component implementation on the
release line before #151 unless issue #152 accepts a focused blocker from real manual or beta
evidence.

## Phase 2C — Core 1.x capability parity

The canonical decision and complete evidence-backed classification live in
[`docs/core-1-x-capability-parity.md`](./docs/core-1-x-capability-parity.md) and
`quality/core-1-x-capability-parity.json`. That decision supersedes component-count comparison as a
roadmap method.

### Core 1.1 shared contract

<!-- parity-track:shared-direction-contract issues:#342 depends-on:#341 -->

- #342 establishes the minimum inherited direction, RTL, locale, and localization contract on
  `dev`; it stays outside the isolated stable 1.0 candidate.
- The full #342 audit continues as a parallel shared track. A direction-sensitive component API
  waits only for the relevant accepted contract, not for the complete cross-repository audit.

### Core 1.1 primitive parity

<!-- parity-track:primitive-parity-a issues:#343,#344,#345,#346,#347,#370 depends-on:#341,#342 -->

After the relevant #342 foundation, these may proceed in parallel:

- #343 — Accordion and Collapsible (complete on `dev`);
- #344 — additive compound Dialog anatomy and AlertDialog (complete on `dev`);
- #345 — bounded single-select Combobox (complete on `dev`);
- #346 — SearchField (complete on `dev`);
- #347 — OTPField (complete on `dev`);
- #370 — NumberField, split from #346 (complete on `dev`).

<!-- parity-track:primitive-parity-b issues:#348 depends-on:#151,#341,#342 -->

<!-- parity-track:compound-menu issues:#350 depends-on:#341,#342 -->

These are independent parallel slices:

- #348 — separate ToggleGroup and CheckboxGroup responsibilities (complete on `dev`);
- #350 — complete bounded DropdownMenu anatomy (complete on `dev`).

<!-- parity-track:multi-select-decision issues:#349 depends-on:#151,#341,#342,#345,#348 -->

#349 completed its Core 1.2 decision spike after #345 and #348. ADR 0006 accepts a separate bounded
MultiSelect implementation while keeping remote data, creation, virtualization, quotas, and product
filtering outside Core.

### Adoption

<!-- parity-track:adoption issues:#356,#369 depends-on:#151,#341 -->

After stable 1.0, the first #356 recipe tranche and the repository-native Agent Skill #369 may
proceed without waiting for new Core 1.1 components. Later recipes depend only on the exact
components they use.

### Core 1.2 developer platform

<!-- parity-track:developer-platform issues:#351,#352,#353,#354,#355 depends-on:#151,#341 -->

- #351 delivered ADR 0007 with deterministic unbundled compiled runtime output, declarations,
  package-mode consumer evidence, and a self-contained integrity-verified editable source Registry.
- #352 delivered modular transactional lifecycle commands plus deterministic package-mode Next.js
  and Vite bootstrap with clean packed-consumer and served-preview evidence.
- #353 has an accepted Phase 1 contract in ADR 0008 and next implements stable Registry identities,
  local namespaces, one global dependency graph, and same-origin bounded authentication by reusing
  the existing Registry engine.
- #354 owns bounded read-only MCP expansion; Agent Skill work is separate in #369.
- #355 remains a measured build/expand/defer Component Lab decision; current docs and visual
  fixtures remain the default.

### Ecosystem

<!-- parity-track:ecosystem issues:#357 depends-on:#151,#341,#342 -->

#357 owns code-to-Figma export and drift tooling after stable 1.0. Its component tranche waits for
the first accepted Core 1.1 subset, and completion still requires a real file and maintainer visual
approval.

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
