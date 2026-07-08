# Nerio

**A source-first design system for modern digital products.**

Nerio is an open-source React design system built for teams that need a reliable, accessible foundation without surrendering control of their component code. It combines semantic design tokens, composable primitives, a source registry, and AI-readable guidance so modern products can start consistent and stay adaptable.

> Status: Foundation in progress. The first public release is under active development.

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

## Planned stack

- Next.js, React, TypeScript
- Tailwind CSS v4
- Base UI primitives
- pnpm workspaces and Turborepo
- Lucide as the default icon source through an icon adapter
- TanStack Table and Recharts through dedicated adapters
- React Hook Form and Zod for form integrations

## Planned workspace

```text
apps/
  docs/          Public documentation and component playground
  demo-app/      Universal showcase product built with Nerio Core

packages/
  tokens/        Design tokens, themes, modes, and CSS variable contracts
  ui/            Core component source and public registry items
  adapters/      Icons, forms, tables, and charts
  cli/           `nerio` project and component commands
  mcp/           Public AI discovery and composition tools
  config/        Shared TypeScript, linting, and build configuration

data/
  component-catalog.json   Machine-readable Core/Pro component catalog
```

Future Pro implementation may live in a private repository or private workspace. Core must never depend on Pro. Pro may depend on Core.

## Theme, mode, and density

Nerio separates three runtime axes:

- Theme: Purple, Blue, Green, Orange, Red, Neutral, or custom
- Mode: System, Light, Dark
- Density: Comfortable, Compact

Default runtime attributes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable">
```

Theme controls brand/accent personality. Mode controls light/dark/system color mode. Density controls spacing and control sizing.

Preset themes are generic brand colors. Product teams can add custom themes by defining a new `data-theme` value and overriding semantic/component variables.

## Initial Core scope

The first release will establish the token foundation and Core component categories: actions, forms, overlays, navigation, feedback, data display, layout primitives, and common reusable building blocks.

Advanced product-ready patterns such as DataGrid, KPI dashboards, billing flows, finance/crypto widgets, AI chat shells, premium themes, Figma assets, and templates belong to Nerio Pro unless the component matrix says otherwise.

See [`COMPONENTS.md`](./COMPONENTS.md) for the current Core/Pro component matrix.

## Contributing

Nerio welcomes issues and pull requests. All contributions are reviewed by maintainers to preserve the system's API, visual consistency, accessibility standards, and long-term direction.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

Distributed under the [MIT License](./LICENSE).

## Author

Created and maintained by [Vladimir Pavlov](https://github.com/vpavlov-me).
