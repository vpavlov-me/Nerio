# Nerio decisions

This file records current product and architecture decisions, superseding older domain-specific repository wording.

## Product positioning

Nerio is a universal, domain-agnostic design system for modern digital products. It should work for SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.

Nerio must not be positioned as a fintech, crypto, banking, or SaaS-only system. Those categories are valid use cases, not product constraints.

## Primitive layer

Base UI is the only interactive primitive layer. Do not add shadcn/ui, Radix UI, Headless UI, Ariakit, or overlapping primitive systems.

## Distribution

Nerio is source-first and independent. It has its own component APIs, registry format, CLI, documentation, MCP tooling, and visual language.

## Themes

The initial runtime themes are `neutral-light`, `neutral-dark`, and `nerio-blue`. The blue theme is a universal branded theme and must not use vertical-specific naming.

## Typography

Geist is the default typeface through semantic font tokens. Components consume `--n-font-sans` and `--n-font-mono` rather than depending on app-specific font class names.

## Demo app

The showcase application is `apps/demo-app` and is called Nerio Workspace. It should demonstrate a credible universal product workspace, not a banking or finance dashboard.
