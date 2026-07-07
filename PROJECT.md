# Nerio project brief

## Mission

Nerio is an open-source, source-first design system for modern digital products. It should demonstrate strong product-design judgment, practical system thinking, accessible engineering, and AI-native implementation practices while remaining useful as the shared base for future products.

## Primary users

- Product designers and engineers building modern digital products.
- Teams working on SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.
- AI coding agents that need clear component contracts and reliable implementation guidance.

## Product position

Nerio is independent from shadcn/ui. It shares the source-distribution philosophy but has its own brand, component API, visual language, CLI, registry, documentation, and AI tooling.

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
  ui/            Components, utilities, styles, and registry source items
  adapters/      Icons, forms, tables, charts
  cli/           `nerio init`, `nerio add`, `nerio doctor`
  mcp/           Component discovery and composition tools for AI agents
  config/        Shared TypeScript, lint, and formatting configuration
```

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

## First implementation milestone

Deliver a functional monorepo and a polished foundation suitable for public review:

1. Workspace tooling, linting, formatting, typechecking, build scripts, and CI.
2. Token package with the initial theme presets and two density modes.
3. Shared utility package or exports where needed for `cn`, types, and style contracts.
4. Base UI-backed core components: Button, IconButton, Badge, Input, Textarea, Label, Checkbox, Switch, Select, Tabs, Tooltip, Dialog, Popover, Dropdown Menu, Toast, Card, Separator, Skeleton, Empty State, and Spinner.
5. Icon adapter with Lucide implementation and support for custom React SVG components.
6. Public docs application with navigation, theme/density switcher, component preview, usage snippets, anatomy, variants, states, and accessibility notes.
7. Nerio Workspace demo app that uses the published components rather than bespoke UI.
8. Registry foundations and a minimal `nerio add button` vertical slice.
9. `llms.txt` and a minimal MCP component-index endpoint or package.

## Explicitly out of scope for the first milestone

- Full Figma synchronization.
- A complete visual-regression test suite.
- A large template marketplace.
- Every complex product component at once.
- A custom icon library.
- Any dependency on shadcn CLI, shadcn registry, or shadcn component code.

## Quality bar

- WCAG 2.2 AA is the target for color contrast, focus, keyboard access, labels, semantics, and overlay behavior.
- Mobile and desktop behavior must be intentional.
- Components must remain visually calm, neutral-first, and suitable for both editorial product surfaces and dense operational interfaces.
- The demo must make the system look credible in a real universal product workspace, not like a component catalog pasted onto a page.
