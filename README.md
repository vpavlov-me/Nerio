# Nerio

**A source-first design system for modern digital products.**

Nerio is an open-source React design system built for teams that need a reliable, accessible foundation without surrendering control of their component code. It combines semantic design tokens, composable primitives, a source registry, and AI-readable guidance so modern products can start consistent and stay adaptable.

> Status: Foundation in progress. The first public release is under active development.

## What Nerio is for

- Product interfaces for SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.
- A neutral visual baseline that can become a distinct product brand through tokens and themes.
- Components installed as editable source code, not locked behind a UI package.
- Accessibility aligned with WCAG 2.2 AA.
- Practical AI workflows through structured component metadata, an MCP server, and `llms.txt`.

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
  demo-app/      Universal showcase product built entirely with Nerio

packages/
  tokens/        Design tokens, themes, and CSS variable contracts
  ui/            Component source and registry items
  adapters/      Icons, forms, tables, and charts
  cli/           `nerio` project and component commands
  mcp/           AI discovery and composition tools
  config/        Shared TypeScript, linting, and build configuration
```

## Themes

Nerio will ship with:

- Neutral Light
- Neutral Dark
- Nerio Blue
- Comfortable density by default, with Compact density available through tokens

## Initial scope

The first release will establish the token foundation and core component categories: actions, inputs and forms, overlays, navigation, feedback, data display, layout, and common product patterns. Complex elements such as a data table, date picker, command menu, combobox, file upload, and chart adapters will be added incrementally with production-quality examples.

## Contributing

Nerio welcomes issues and pull requests. All contributions are reviewed by maintainers to preserve the system's API, visual consistency, accessibility standards, and long-term direction.

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

## License

Distributed under the [MIT License](./LICENSE).

## Author

Created and maintained by [Vladimir Pavlov](https://github.com/vpavlov-me).
