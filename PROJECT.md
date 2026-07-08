# Nerio project brief

## Mission

Nerio is an open-source, source-first design system for modern digital products. It should demonstrate strong product-design judgment, practical system thinking, accessible engineering, and AI-native implementation practices while remaining useful as the shared base for future products.

The project is designed with a clear two-layer product model:

- **Nerio Core**: the open-source foundation for tokens, themes, primitive and base UI components, public docs, public registry, CLI, and public MCP/component discovery.
- **Nerio Pro**: the paid advanced layer for complex product components, templates, premium themes, Figma assets, advanced registry items, and Pro MCP/AI tooling.

Core = building blocks. Pro = product-ready solutions.

## Primary users

- Product designers and engineers building modern digital products.
- Teams working on SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.
- Product teams building SaaS, fintech, crypto, data-rich dashboards, and AI interfaces.
- AI coding agents that need clear component contracts and reliable implementation guidance.

## Product position

Nerio is independent from shadcn/ui. It shares the source-distribution philosophy but has its own brand, component API, visual language, CLI, registry, documentation, and AI tooling.

Nerio Core remains universal and domain-agnostic. SaaS, fintech, crypto, data-rich dashboards, and AI products are priority use cases for Pro components and templates, but they must not narrow the whole project positioning.

## Initial technology choices

- Next.js App Router
- React and TypeScript
- Tailwind CSS v4 with CSS-first configuration
- Base UI primitives
- pnpm workspaces and Turborepo
- Lucide through an icon adapter
- TanStack Table through a data-table adapter
- Recharts through a chart adapter
- React Hook Form and Zod through a form adapter

## Workspace target

```text
apps/
  docs/          Public documentation, live previews, and playgrounds
  demo-app/      A realistic universal product workspace used as the visual showcase

packages/
  tokens/        Token source, generated CSS variables, themes, density contracts
  ui/            Core components, utilities, styles, and public registry source items
  adapters/      Icons, forms, tables, charts
  cli/           `nerio init`, `nerio add`, `nerio doctor`
  mcp/           Public component discovery and composition tools for AI agents
  config/        Shared TypeScript, lint, and formatting configuration

data/
  component-catalog.json   Machine-readable source of truth for Core/Pro component tiering
```

Future Pro code may live in a private repository or private workspace. Pro may depend on Core. Core must never depend on Pro.

## Token model

### 1. Primitive tokens

Raw values with no semantic meaning. Examples: `--n-purple-500`, `--n-space-4`, `--n-radius-md`.

### 2. Semantic tokens

Intent-based tokens that themes remap. Examples: `--n-color-surface`, `--n-color-text-primary`, `--n-color-border-subtle`, `--n-color-action-primary`.

### 3. Component tokens

Local contracts used when an individual component needs controlled customization. Examples: `--n-button-height-md`, `--n-dialog-width-md`.

See `DESIGN_SYSTEM.md` for the full token architecture, visual direction, color usage, density, interaction, and component rules.

## Theme contract

The first release must support:

- `purple-light` as the default Nerio theme;
- `neutral-light`;
- `neutral-dark`;
- `fintech-blue-light`;
- `comfortable` density as default;
- `compact` density as an opt-in attribute or class.

Theme and density changes must work through CSS variables without rebuilding component source. The token architecture must make future variants such as `purple-dark` and `fintech-blue-dark` possible without changing component source.

## Core component scope

Nerio Core includes foundation and base reusable components: Button, IconButton, Link, Badge, Input, Textarea, Label, Field, FormGroup, Checkbox, Radio Group, Switch, Select, Tabs, Tooltip, Dialog, Sheet, Popover, Dropdown Menu, Toast, Card, Separator, Skeleton, Empty State, Spinner, Avatar, Table, List, Breadcrumbs, Pagination, Sidebar Primitive, and Command Primitive.

Core should be strong enough to build real products without a paid license. It should not contain advanced product compositions that are better treated as Pro value.

## Pro component scope

Nerio Pro includes advanced product-ready components and templates: DataGrid, Advanced Table, Filter Bar, Saved Views, Column Settings, KPI Card, KPI Group, Trend Chip, Chart Card, Activity Feed, Analytics Panel, AppShell, AppSidebar, Settings Layout, Billing Settings, Team Members, Roles & Permissions, Audit Log, Portfolio Card, Asset Row, Transaction List, Wallet Connector UI, Balance Visibility, PnL components, Risk Badge, AI Chat Shell, Prompt Input, Message, Sources, Tool Call, Reasoning Block, Attachment, Code Block, and product templates.

Pro should sell time savings and product judgment, not duplicate Core components.

## First implementation milestone

Deliver a functional monorepo and a polished Core foundation suitable for public review:

1. Workspace tooling, linting, formatting, typechecking, build scripts, and CI.
2. Token package with the initial theme presets and two density modes.
3. Shared utility package or exports where needed for `cn`, types, and style contracts.
4. Base UI-backed core components: Button, IconButton, Badge, Input, Textarea, Label, Checkbox, Switch, Select, Tabs, Tooltip, Dialog, Popover, Dropdown Menu, Toast, Card, Separator, Skeleton, Empty State, and Spinner.
5. Icon adapter with Lucide implementation and support for custom React SVG components.
6. Public docs application with navigation, theme/density switcher, component preview, usage snippets, anatomy, variants, states, and accessibility notes.
7. Nerio Workspace demo app that uses the published components rather than bespoke UI.
8. Registry foundations and a minimal `nerio add button` vertical slice.
9. `llms.txt` and a minimal MCP component-index endpoint or package.
10. `COMPONENTS.md` and `data/component-catalog.json` kept aligned with implementation status.

## Explicitly out of scope for the first milestone

- Full Figma synchronization.
- A complete visual-regression test suite.
- A large template marketplace.
- Paid Pro distribution and licensing infrastructure.
- Every complex product component at once.
- A custom icon library.
- Any dependency on shadcn CLI, shadcn registry, or shadcn component code.

## Quality bar

- WCAG 2.2 AA is the target for color contrast, focus, keyboard access, labels, semantics, and overlay behavior.
- Mobile and desktop behavior must be intentional.
- Components must remain visually calm, neutral-first, and suitable for both editorial product surfaces and dense operational interfaces.
- The demo must make the system look credible in a real universal product workspace, not like a component catalog pasted onto a page.
