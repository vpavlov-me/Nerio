# Nerio design system foundations

## Purpose

This document is the visual and token source of truth for Nerio. Read it before introducing or changing tokens, themes, modes, density, shared component styles, demo screens, examples, or documentation.

Nerio is a source-first React design system for modern digital products. It should feel minimal, calm, professional, accessible, and flexible enough for SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, AI interfaces, and data-rich workflows.

Nerio Core remains universal and domain-agnostic. SaaS, fintech, crypto, dashboard, and AI products are priority use cases for Pro patterns and templates, not constraints on the whole system.

## Visual direction

### Neutral-first UI, brand-led interaction

Nerio uses a neutral-first visual language. Most interface hierarchy comes from typography, whitespace, layout, grouping, and contrast rather than color.

Brand color is a controlled interaction accent. It communicates priority, selection, focus, and primary actions. It must not become the visual default for the entire product surface.

Use this distribution as a design-review principle:

- approximately 90% neutral structure;
- approximately 7% semantic feedback color;
- approximately 3% brand emphasis.

This is a guardrail, not literal pixel accounting.

### Intended character

- Minimal and typographic.
- Soft and approachable without becoming decorative.
- Professional enough for dense and high-stakes product interfaces.
- Spacious, structured, and quiet.
- Clear at both comfortable and compact densities.

## Theme, mode, and density contracts

Nerio v1 uses three independent runtime axes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable"></html>
```

### Theme

Theme controls the brand/accent personality. It must not encode light or dark mode.

Initial preset themes:

- `purple` — default branded Nerio theme;
- `blue`;
- `green`;
- `orange`;
- `red`;
- `neutral`.

These are generic brand color presets. Do not introduce vertical-specific Core preset names such as `fintech-blue`.

Product teams may add custom themes by defining a new `data-theme` value and overriding the same semantic/component variables. Custom themes must still use the same `data-mode` and `data-density` axes.

Theme changes should primarily affect:

- primary actions;
- selected and active states;
- focus rings;
- links and interactive text;
- selected surfaces;
- primary chart series;
- restrained brand moments.

Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `neutral-dark`, `blue-light`, `blue-dark`, `red-light`, or `red-dark`.

### Mode

Mode controls the light/dark/system color mode.

Initial modes:

- `system` — default, follows `prefers-color-scheme`;
- `light`;
- `dark`.

Mode changes should primarily affect:

- canvas;
- surfaces;
- text color;
- border color;
- overlay surfaces;
- backdrop treatment.

### Density

Density controls interface spacing and control sizing.

Initial densities:

- `comfortable` — default;
- `compact`.

Density changes should primarily affect:

- spacing tokens;
- control heights;
- row heights;
- compact layout rhythm.

Theme, mode, and density changes must resolve through CSS variables without rebuilding component source.

## Token-customizable appearance values

Font, radius, motion, spacing, shadow/elevation, and contrast are customizable through tokens in v1, but they are not separate runtime axes yet.

Do not introduce these attributes in v1:

```html
<html data-font="geist" data-radius="soft" data-motion="normal" data-contrast="standard"></html>
```

Developers may customize those values by overriding CSS variables instead:

```css
:root {
  --n-font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --n-font-mono: "JetBrains Mono", monospace;
  --n-radius-sm: 0.25rem;
  --n-radius-md: 0.5rem;
  --n-radius-lg: 0.75rem;
  --n-radius-xl: 1rem;
  --n-duration-normal: 160ms;
}
```

Potential future runtime axes include:

- `data-radius="sharp" | "soft" | "rounded"`;
- `data-font="geist" | "system" | "custom"`;
- `data-motion="normal" | "reduced"`;
- `data-contrast="standard" | "high"`;
- `data-scale="default" | "large"`.

These future axes should not be implemented until the project explicitly promotes them through an architecture decision.

## Default purple theme

The default `purple` theme remains visually neutral-first:

- canvas and most surfaces are mode-driven neutral whites, grays, or dark surfaces;
- default text is neutral, never purple;
- cards, tables, panels, and forms are neutral surfaces;
- purple is reserved for primary actions, selected states, focus, links, small progress indicators, the primary chart series, and brand moments;
- hover states should use neutral surface changes before using purple;
- selected navigation and tabs use a very light lavender surface plus a small purple indicator, underline, or icon;
- semantic colors remain subdued and appear only when they communicate product meaning.

## Token architecture

Nerio uses four token layers.

### 1. Primitive tokens

Raw values with no contextual meaning. They include:

- neutral, purple, blue, green, orange, red, amber, cyan, and magenta palettes;
- typography families, weights, sizes, line heights, and tracking;
- spacing, radii, border widths, motion, z-index, breakpoints, and icon sizes;
- chart palettes.

Color palettes should provide complete usable scales, generally `50–950`, with optional `0`, `25`, or `1000` values where needed.

Primitive tokens are public and overrideable. Components must not consume primitive tokens directly.

### 2. Semantic tokens

Semantic tokens map product intent to a theme and mode value. Use semantic names outside the primitive layer.

Examples:

```txt
color.text.primary
color.text.secondary
color.text.tertiary
color.text.disabled
color.text.inverse

color.surface.canvas
color.surface.default
color.surface.subtle
color.surface.sunken
color.surface.raised
color.surface.overlay
color.surface.selected

color.border.subtle
color.border.default
color.border.strong
color.border.interactive
color.border.focus
color.border.danger

color.action.primary
color.action.primary-hover
color.action.primary-active
color.action.primary-foreground
color.action.secondary
color.action.secondary-hover
color.action.tertiary

color.focus.ring
color.focus.offset

color.status.success
color.status.warning
color.status.danger
color.status.info
color.status.neutral

color.trend.positive
color.trend.negative
color.trend.pending
color.trend.locked
color.trend.verified
color.trend.unverified
color.trend.risk

chart.primary
chart.comparison
chart.grid
chart.axis
chart.tooltip
chart.selection
chart.categorical.*
```

Every status role should support both `soft` and `strong` treatments:

- `soft`: subtle background, optional colored dot or icon, mostly neutral label text;
- `strong`: stronger fill and contrasting foreground, reserved for urgent or high-salience contexts.

### 3. Component aliases

Component aliases define local contracts that resolve to semantic tokens. Examples:

```txt
button.primary.background
button.primary.background-hover
button.primary.foreground

input.background
input.border
input.border-hover
input.border-focus
input.focus-ring

navigation.item.background-hover
navigation.item.background-active
navigation.item.indicator-active

table.row.background-hover
table.row.background-selected

badge.status-soft.*
badge.status-strong.*

dialog.background
dialog.border
dialog.backdrop
```

Components use semantic or component aliases only. Do not use raw palette values in component styles.

### 4. Theme sets

Theme, mode, density, and future appearance settings should remain composable rather than producing duplicated components.

- theme: purple, blue, green, orange, red, neutral, or custom;
- mode: system, light, dark;
- density: comfortable, compact;
- token-customizable in v1: font, radius, motion, spacing, shadow/elevation, contrast;
- future runtime axes: radius, font, motion, contrast, scale.

## Color usage

### Brand color

Brand color is reserved for:

- primary calls to action;
- selected and active states;
- visible focus rings;
- links and interactive text;
- one key metric or progress signal in a local context;
- the selected or primary data series in charts;
- logo, empty states, and restrained brand highlights.

Do not use brand color as the default color for:

- headings;
- ordinary icons;
- card or panel backgrounds;
- standard borders;
- secondary actions;
- routine navigation items;
- every chart series;
- broad background fields;
- decorative gradients in product UI.

### Neutrals

Neutrals carry the interface. Required roles include:

```txt
surface.canvas
surface.default
surface.subtle
surface.raised
surface.overlay
text.primary
text.secondary
text.tertiary
border.subtle
border.default
border.strong
```

### Borders and shadows

Use borders sparingly. Do not surround every content group with a card or border.

Do not use drop shadows or glows as a default hierarchy tool. Prefer spacing, surface contrast, restrained borders, and backdrops.

## Density

Comfortable is the default density.

Compact is an opt-in density for dense operational views. Compact must be implemented through tokens and CSS variables, not separate compact components.
