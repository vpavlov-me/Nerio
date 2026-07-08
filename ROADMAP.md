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
- Theme system
- `purple-light` default theme
- `neutral-light` theme
- `neutral-dark` theme
- `fintech-blue-light` theme
- Comfortable density
- Compact density through tokens
- Public docs app
- Public registry foundation
- `nerio init`
- Minimal `nerio add button` flow
- `llms.txt`
- Minimal public MCP component index
- Demo app foundation

## Phase 2 — Core component coverage

Goal: cover the standard baseline for real product interfaces.

Scope:

- Actions: Button, IconButton, Link
- Forms: Input, Textarea, Label, Field, FormGroup, Checkbox, Radio Group, Switch, Select
- Overlays: Dialog, Sheet, Popover, Tooltip, Dropdown Menu
- Data display: Card, Badge, Avatar, Table, List, Separator
- Feedback: Alert, Toast, Progress, Skeleton, Empty State, Spinner
- Navigation and layout: Tabs, Breadcrumbs, Pagination, Sidebar Primitive, Command Primitive
- Registry metadata for every released component
- Docs pages with purpose, anatomy, variants, states, usage snippets, and accessibility notes
- `data/component-catalog.json` status updates as components move from planned to implemented

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
- More premium themes
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
