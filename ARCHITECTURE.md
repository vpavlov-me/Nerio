# Nerio architecture

## Product split

Nerio has two layers:

- **Core**: open-source foundation and base components.
- **Pro**: paid advanced components and product-ready patterns.

Core should be stable, composable, accessible, and dependency-light.

Pro can move faster and focus on high-value product workflows.

## Package graph

Current Core workspace target:

```text
packages/tokens
  -> Token source, CSS variables, themes, modes, density contracts

packages/ui
  -> Core components, utilities, styles, public registry source items
  -> Depends on packages/tokens and packages/adapters when needed

packages/adapters
  -> Icons, forms, tables, charts

packages/cli
  -> nerio init, nerio add, nerio doctor

packages/mcp
  -> Public component discovery and composition tools for AI agents

packages/config
  -> Shared TypeScript, lint, and formatting configuration
```

Future Pro target:

```text
@nerio/pro
  -> Depends on @nerio/ui
  -> Advanced components and product-ready patterns

@nerio/pro-themes
  -> Depends on @nerio/tokens
  -> Premium brand themes

@nerio/pro-registry
  -> Depends on Core registry contracts
  -> Private registry items and templates

@nerio/pro-mcp
  -> Depends on public MCP contracts
  -> Licensed AI tooling and Pro documentation access
```

## Dependency rule

Core packages must never depend on Pro packages.

Allowed:

```ts
import { Button } from "@nerio/ui";
import { DataGrid } from "@nerio/pro";
```

Not allowed in Core:

```ts
import { DataGrid } from "@nerio/pro";
```

## Appearance runtime rule

Theme, mode, and density are the only v1 runtime appearance axes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable"></html>
```

- `data-theme` controls brand/accent personality: `purple`, `blue`, `green`, `orange`, `red`, `neutral`, or custom.
- `data-mode` controls color mode: `system`, `light`, `dark`.
- `data-density` controls spacing and control sizing: `comfortable`, `compact`.

Do not encode mode into theme names. Names such as `purple-light`, `neutral-dark`, `blue-light`, and `red-dark` are not valid Nerio runtime values.

Do not use vertical-specific Core preset names such as `fintech-blue`. Core presets should use generic brand color names.

## Token override rule

Font, radius, motion, spacing, shadow/elevation, and contrast are token-customizable in v1, not runtime axes.

Allowed in v1:

```css
:root {
  --n-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --n-radius-md: 0.5rem;
  --n-duration-normal: 160ms;
}
```

Not allowed in v1 without a new architecture decision:

```html
<html data-font="inter" data-radius="soft" data-motion="normal" data-contrast="standard"></html>
```

## Distribution

Core:

- Public GitHub repository
- Public docs
- Public registry
- Public packages where needed
- Public CLI
- Public MCP/component discovery

Pro:

- Private repository or private workspace
- Private registry
- Private package
- License token
- Paid Figma kit
- Pro templates
- Pro MCP access

## Component model

Each released component should include:

- React implementation
- TypeScript API
- Token-based styling
- Accessibility considerations
- Usage examples
- Registry metadata
- Documentation page
- Component catalog entry

## Registry strategy

Core components should be installable through:

```bash
npx nerio add button
```

Pro components should eventually be installable through:

```bash
npx nerio login
npx nerio add pro:data-grid
```

## Tiering rule

Core owns foundations and reusable building blocks.

Pro owns advanced composition and product-ready workflows.

Examples:

- Button: Core
- Dialog: Core
- Basic Table: Core
- DataGrid: Pro
- Sidebar Primitive: Core
- AppSidebar: Pro
- Basic Empty State: Core
- Illustrated Empty State patterns: Pro
- Theme tokens: Core
- Premium brand themes: Pro
- Command Primitive: Core
- Command Palette: Pro
- AI Chat Shell: Pro

## Documentation rule

Public docs must be in English.

Core docs should include complete usage guidance.

Public Pro docs may include:

- Component description
- Preview
- API shape
- Use cases
- Installation CTA

Public Pro docs must not expose private Pro source code.

## AI and MCP rule

Agents should use:

- `AGENTS.md` for repository rules
- `PROJECT.md` for product context
- `DESIGN_SYSTEM.md` for visual and token decisions
- `COMPONENTS.md` for Core/Pro tiering
- `data/component-catalog.json` for machine-readable component metadata
- `DECISIONS.md` for accepted product and architecture decisions
