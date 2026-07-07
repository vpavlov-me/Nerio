# Nerio design system foundations

## Purpose

This document is the visual and token source of truth for Nerio. Read it before introducing or changing tokens, themes, shared component styles, demo screens, examples, or documentation.

Nerio is a source-first React design system for modern SaaS products, dashboards, settings, operational tools, and data-rich workflows. It should feel minimal, calm, professional, accessible, and flexible enough for a broad range of product brands.

## Visual direction

### Neutral-first UI, purple-led interaction

Nerio uses a neutral-first visual language. Most interface hierarchy comes from typography, whitespace, layout, grouping, and contrast rather than color.

Purple is a controlled brand and interaction accent. It communicates priority, selection, focus, and primary actions. It must not become the visual default for the entire product surface.

Use this distribution as a design-review principle:

- approximately 90% neutral structure;
- approximately 7% semantic feedback color;
- approximately 3% purple brand emphasis.

This is a guardrail, not literal pixel accounting.

### Intended character

- Minimal and typographic.
- Soft and approachable without becoming decorative.
- Professional enough for dense and high-stakes product interfaces.
- Spacious, structured, and quiet.
- Clear at both comfortable and compact densities.

## Theme contracts

The initial theme presets are:

- `purple-light` — default Nerio theme;
- `neutral-light`;
- `neutral-dark`;
- `fintech-blue-light`.

Themes and density must resolve through CSS variables without rebuilding component source. Theme architecture must allow future variants such as `purple-dark` and `fintech-blue-dark` by remapping tokens only.

Recommended runtime attributes:

```html
<html data-theme="purple-light" data-density="comfortable">
```

### Default purple-light theme

`purple-light` remains visually neutral-first:

- canvas and most surfaces are clean neutral whites and balanced grays;
- default text is near-black neutral, never purple;
- cards, tables, panels, and forms are neutral surfaces;
- purple is reserved for primary actions, selected states, focus, links, small progress indicators, the primary chart series, and brand moments;
- hover states should use neutral surface changes before using purple;
- selected navigation and tabs use a very light lavender surface plus a small purple indicator, underline, or icon;
- semantic colors remain subdued and appear only when they communicate product meaning.

## Token architecture

Nerio uses four token layers.

### 1. Primitive tokens

Raw values with no contextual meaning. They include:

- neutral, purple, blue, green, amber, red, cyan, and magenta palettes;
- typography families, weights, sizes, line heights, and tracking;
- spacing, radii, border widths, motion, z-index, breakpoints, and icon sizes;
- chart palettes.

Color palettes should provide complete usable scales, generally `50–950`, with optional `0`, `25`, or `1000` values where needed.

Primitive tokens are public and overrideable. Components must not consume primitive tokens directly.

### 2. Semantic tokens

Semantic tokens map product intent to a theme value. Use semantic names outside the primitive layer.

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

Brand, mode, density, and future contrast settings should remain composable rather than producing duplicated components.

- brand: purple, neutral, fintech-blue;
- mode: light, dark;
- density: comfortable, compact;
- contrast: standard, high-contrast later.

## Color usage

### Purple

Purple is reserved for:

- primary calls to action;
- selected and active states;
- visible focus rings;
- links and interactive text;
- one key metric or progress signal in a local context;
- the selected or primary data series in charts;
- logo, empty states, and restrained brand highlights.

Do not use purple as the default color for:

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
surface.sunken
surface.raised
surface.overlay

text.primary
text.secondary
text.tertiary
text.disabled

border.subtle
border.default
border.strong
border.interactive

background.hover
background.pressed
background.selected-neutral
```

The neutral scale should be clean and balanced, without a strongly visible blue, purple, or warm tint.

### Semantic colors

Use semantic colors only when they add meaning:

- positive and negative product changes;
- validation feedback;
- destructive actions;
- operational status;
- category distinction in charts when comparison is required.

Use neutral styles for common low-salience statuses such as draft, inactive, paused, and pending review.

## Foundations

### Spacing and layout

Use a 4px base grid. A 2px value is acceptable only for optical alignment, hairlines, and small internal corrections.

Expose semantic layout tokens for page gutters, content widths, sidebars, navigation rails, panels, dialogs, workspace gaps, section gaps, and stack gaps.

Use container-aware layouts where possible. Prefer container queries for components used inside split views, resizable panes, and dense workspaces.

### Radius

Use a soft but restrained radius profile:

```txt
radius.control   = around 8px
radius.container = around 12px
radius.overlay   = around 16px
radius.round     = full pill or circle
```

Do not make every element excessively rounded.

### Borders and elevation

- Default shadow is `none`.
- Do not use drop shadows or glows for cards, panels, menus, dialogs, drawers, popovers, or tooltips.
- Overlays rely on surface contrast, z-index, a restrained border, and backdrop treatment.
- Use borders sparingly and keep them thin, low-contrast, and structural.
- Prefer whitespace and dividers over enclosing every page region in a card.

### Density

Density is token-driven, not component-driven.

- `comfortable` is the default;
- `compact` is an opt-in mode.

Default primary control height is `32px`.

Density affects at least control height, component padding, table rows, list rows, navigation density, section spacing, and overlay padding.

Recommended control sizes:

```txt
xs = 24px
sm = 28px
md = 32px
lg = 36px
xl = 40px
```

## Typography and icons

Use a variable sans-serif stack. Inter is the reference default unless the codebase defines an equivalent default through tokens.

The typography system must remain themeable. Required roles include:

- display;
- heading;
- body;
- label;
- caption;
- metric;
- metric label;
- table cell;
- table header;
- code;
- mono.

Minimum UI font size is `12px`. Numeric and metric roles should use `tabular-nums`.

Typography, spacing, and contrast should create most hierarchy instead of color.

Icon rules:

- default stroke weight: `1.5px`;
- normalize sizing, stroke, alignment, and inherited color through the Nerio icon adapter;
- default icon color inherits secondary neutral text;
- purple icon color is reserved for active, selected, focused, or primary contexts.

## Interaction and accessibility

Every interactive component must explicitly support:

- default;
- hover;
- pressed;
- selected;
- disabled;
- loading;
- read-only;
- drag where relevant;
- focus-visible.

Focus treatment:

```txt
2px ring
2px offset
minimum 3:1 contrast against adjacent UI
```

Additional requirements:

- target WCAG 2.2 AA for text, controls, focus, labels, keyboard use, and overlays;
- minimum pointer target is 24px;
- offer touch-friendly variants where appropriate;
- preserve visible keyboard focus;
- support reduced motion;
- use soft functional durations only: 120ms fast, 180ms standard, 240ms slow.

Do not use motion as decoration.

## Component rules

### Buttons

- Primary: purple fill; one primary action per local context.
- Secondary: neutral surface and subtle border.
- Tertiary: text-only or quiet neutral action.
- Destructive: semantic red only for genuinely destructive outcomes.

### Navigation and tabs

- Default: neutral text on transparent background.
- Hover: subtle neutral surface.
- Active: dark text with a light lavender surface, a thin purple indicator, underline, or active icon.
- Avoid heavy purple pills for routine navigation.

### Cards and panels

Cards, panels, tables, and forms use neutral surfaces by default. Do not create a card grid for every content grouping. Use a small purple detail only when it strengthens hierarchy, such as a focused field, selected item, primary action, or progress signal.

### Statuses

Soft treatment is the default. Use colored dots or icons with restrained backgrounds and mostly neutral labels. Use strong status treatments only for urgent, critical, destructive, or high-salience states.

### Charts

- One primary selected series may be purple.
- Comparison series should be neutral gray.
- Green and red are used only for explicit positive or negative meaning.
- Categorical palettes should be restrained and low-saturation.
- Gridlines, axes, labels, and tooltip chrome remain neutral.

## Responsive behavior

Use intentional responsive behavior rather than generic scaling.

- Side panels become bottom sheets on narrow screens when appropriate.
- Tables may use horizontal scroll, condensed columns, or a detail pattern based on data priority.
- Preserve the data model when adapting tables rather than hiding important information without an alternative path.
- Design dashboard and workspace components for persistent sidebars, resizable panels, and dense desktop layouts.

## Implementation guardrails

- Do not hard-code raw colors, typography, radii, shadows, or spacing in components when a token applies.
- Do not add a new component variant where token composition solves the problem.
- Prefer composition and explicit slots over expansive boolean-prop APIs.
- Preserve predictable anatomy, keyboard behavior, visible focus, disabled states, loading states, and small APIs.
- Keep all docs, public UI copy, comments, and examples in English.
- Do not reference external design systems in code, docs, examples, or copy.

## Example quality bar

The demo and documentation should show realistic SaaS interfaces built from Nerio components, not static mockups or a catalog of isolated cards. Prioritize scenarios such as settings, team and permissions, billing, data tables, and operational dashboards.

A valid example should demonstrate neutral-first hierarchy, restrained purple usage, accessible focus states, density support, semantic statuses, and real data-heavy composition.
