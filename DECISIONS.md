# Nerio decisions

This file records current product and architecture decisions, superseding older domain-specific repository wording.

## Product positioning

Nerio is a universal, domain-agnostic design system for modern digital products. It should work for SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.

Nerio must not be positioned as a fintech, crypto, banking, or SaaS-only system. Those categories are valid priority use cases, especially for Pro components and templates, not product constraints for the whole system.

## Core and Pro split

Nerio has two product layers:

- **Nerio Core**: open-source foundation, tokens, themes, primitive and base UI components, public docs, public registry, CLI, and public MCP/component discovery.
- **Nerio Pro**: paid advanced product components, templates, premium themes, Figma assets, advanced registry items, and Pro MCP/AI tooling.

Core = building blocks. Pro = product-ready solutions.

Core must be useful enough to build real products without a paid license. Pro should provide time savings, product judgment, advanced workflows, and domain-specific patterns.

## Component tiering

`COMPONENTS.md` is the human-readable source of truth for Core/Pro component tiering.

`data/component-catalog.json` is the machine-readable source of truth for agents, docs generation, registry metadata, and future tooling.

A component belongs in Core when it is a generic primitive, base component, or foundation needed across most products.

A component belongs in Pro when it is an advanced composition, data-heavy workflow, SaaS/admin pattern, fintech/crypto pattern, AI interface pattern, premium theme, Figma asset, or template.

## Primitive layer

Base UI is the only interactive primitive layer. Do not add shadcn/ui, Radix UI, Headless UI, Ariakit, or overlapping primitive systems.

## Distribution

Nerio is source-first and independent. It has its own component APIs, registry format, CLI, documentation, MCP tooling, and visual language.

Core distribution should be public through the repository, public docs, public registry, and public packages where needed.

Pro distribution may use a private repository, private registry, private package, license token, paid Figma kit, and Pro MCP access.

## Package boundaries

Core packages must never depend on Pro packages.

Pro packages may depend on Core packages.

Core implementation currently lives in public workspace packages such as `packages/tokens`, `packages/ui`, `packages/adapters`, `packages/cli`, `packages/mcp`, and `packages/config`.

Future Pro implementation may live in a private repository or private workspace.

## Theme, mode, and density axes

Nerio separates brand theme, color mode, and density:

- theme: `purple`, `blue`, `green`, `orange`, `red`, `neutral`, or custom;
- mode: `system`, `light`, `dark`;
- density: `comfortable`, `compact`.

Default runtime attributes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable">
```

Theme controls brand/accent personality. Mode controls light/dark/system color mode. Density controls spacing and control sizing.

Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `neutral-dark`, `blue-light`, `blue-dark`, `red-light`, or `red-dark`.

Do not create vertical-specific Core preset names such as `fintech-blue`. Core presets should use generic brand color names.

Custom product themes are allowed by adding a new `data-theme` value and overriding CSS variables. Custom themes must still use the same mode and density axes.

Purple is the default branded Nerio theme and must be used as a restrained accent, not as the default color for broad surfaces, headings, routine icons, or secondary UI.

## Typography

Geist is the default typeface through semantic font tokens. Components consume `--n-font-sans` and `--n-font-mono` rather than depending on app-specific font class names.

## Demo app

The showcase application is `apps/demo-app` and is called Nerio Workspace. It should demonstrate a credible universal product workspace, not a banking or finance-only dashboard.

Future Pro templates may include SaaS, fintech, crypto, dashboard, billing, and AI assistant examples.
