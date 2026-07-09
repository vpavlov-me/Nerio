# Nerio Design System Direction

Status: Draft 0.1  
Audience: maintainers, designers, engineers, AI coding agents  
Scope: Nerio Core, Nerio Pro, documentation, motion foundation, component-page standard

## 1. Purpose

Nerio should be positioned as a designer-grade interface system for modern SaaS, fintech, crypto and AI products. The system must remain practical for engineering, but its visual language, documentation and advanced compositions should feel more curated than a generic React component library.

The current implementation may stay visually simple while the base is being built. This document defines the rules that must be embedded into the system now so the visual refinement stage can be applied consistently later without rewriting components.

## 2. Product positioning

Nerio is a minimal, calm and designer-grade design system for production interfaces.

It should feel:

- precise;
- neutral-first;
- editorial;
- spacious;
- high-quality;
- suitable for financial and operational products;
- visually restrained, with a controlled purple accent;
- more design-led than developer-template-led.

Nerio should avoid feeling like a default Tailwind/shadcn clone, a decorative dashboard kit, or a generic SaaS template.

## 3. Core principles

### 3.1 Foundation first

Every visual decision should be expressed through tokens, primitives or documented composition rules. Avoid one-off visual styling inside components.

### 3.2 Neutral by default

Most surfaces, text, dividers, borders and states should be neutral. Accent color is used only for attention, selection, focus, progress, key actions and meaningful highlights.

### 3.3 Border-first surfaces

Nerio should rely primarily on spacing, subtle borders, layered surfaces and typography. Shadows should be avoided by default and used only when a component truly needs depth.

### 3.4 Motion as system behavior

Motion is part of the interaction model. It should be tokenized, accessible and consistent across overlays, disclosure, navigation, data updates and feedback states.

### 3.5 Basic components stay predictable

Inputs, buttons, selects, dialogs, tables and navigation patterns must remain familiar and accessible. More expressive behavior belongs in compositions, Pro components, empty states, dashboards and documentation examples.

### 3.6 Documentation sells the system

The docs are not only technical reference. Each component page should demonstrate quality, usage context, visual rhythm, interaction behavior and design intent.

## 4. Core vs Pro visual model

### Nerio Core

Core contains foundational primitives and common components. Core should be clean, predictable and flexible.

Examples:

- Button
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Tabs
- Dialog
- Drawer
- Popover
- Tooltip
- Dropdown Menu
- Toast
- Badge
- Card
- Table
- Skeleton
- Pagination
- Avatar
- Breadcrumbs
- Separator

Core components must prioritize:

- accessibility;
- composability;
- token usage;
- stable API;
- restrained visual defaults;
- predictable interaction states;
- reduced-motion support.

### Nerio Pro

Pro contains advanced, opinionated and more visually expressive interface compositions.

Examples:

- Advanced Data Table
- Financial Overview
- Portfolio Summary
- Billing Usage
- User Management
- KYC Flow
- Audit Log
- Transaction Details
- Asset Detail Page
- Settings Hub
- Command Center
- AI Assistant Panel
- Smart Search
- Empty State Gallery
- Paywall Section
- Onboarding Flow
- Dashboard Shell

Pro components may use more custom layout, motion and product-specific composition patterns, while still consuming the same tokens and primitives as Core.

## 5. Visual language

### 5.1 Typography

Typography should carry more of the visual quality than color or decoration.

Rules:

- use strong hierarchy;
- prefer calm, readable sizes;
- avoid overusing bold weights;
- use metadata labels and captions deliberately;
- support compact and comfortable density;
- keep line-height generous enough for product dashboards and documentation.

### 5.2 Color

Nerio should use a neutral-first color model with a purple accent.

Accent usage is allowed for:

- primary action;
- selected state;
- focus ring;
- active navigation item;
- progress indicator;
- key chart highlight;
- AI-related hint;
- important inline emphasis.

Accent usage should be avoided for:

- large decorative backgrounds;
- generic cards;
- every icon;
- every hover state;
- large dashboard surfaces;
- repeated table content.

### 5.3 Surfaces

Surface quality should come from layering, borders and spacing.

Recommended surface levels:

- `surface.canvas` — page background;
- `surface.base` — default component background;
- `surface.subtle` — secondary sections;
- `surface.raised` — floating overlays;
- `surface.inset` — nested content, code blocks, search fields;
- `surface.selected` — selected or active item.

### 5.4 Borders

Borders should be thin, neutral and consistent.

Rules:

- default to 1px borders;
- avoid heavy outlines;
- use border contrast instead of shadow where possible;
- use accent borders only for active, selected or focused states;
- nested layouts should use separators sparingly.

### 5.5 Radius

Radius should feel modern but not playful.

Recommended model:

- small controls: medium radius;
- cards and panels: slightly larger radius;
- large layout blocks: larger radius, but not pill-shaped;
- pills/badges: explicit pill radius only when semantically useful.

### 5.6 Density

Nerio should support at least two density modes:

- `comfortable` — default, spacious, designer-grade;
- `compact` — dense tables, fintech screens, admin tools.

Density should affect spacing, control height and table row height through tokens, not component-specific overrides.

## 6. Motion foundation

Motion must be implemented as a tokenized foundation before visual polish starts.

### 6.1 Duration tokens

Suggested token names:

```ts
export const motionDuration = {
  instant: '80ms',
  fast: '140ms',
  normal: '220ms',
  slow: '360ms',
};
```

### 6.2 Easing tokens

Suggested token names:

```ts
export const motionEasing = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  enter: 'cubic-bezier(0, 0, 0.2, 1)',
  exit: 'cubic-bezier(0.4, 0, 1, 1)',
  expressive: 'cubic-bezier(0.16, 1, 0.3, 1)',
};
```

### 6.3 Semantic motion tokens

Semantic tokens should describe intent, not CSS implementation.

Recommended names:

```ts
export const semanticMotion = {
  hover: 'fast standard',
  press: 'instant standard',
  focus: 'fast standard',
  reveal: 'normal enter',
  collapse: 'fast exit',
  overlayEnter: 'normal enter',
  overlayExit: 'fast exit',
  pageEnter: 'slow expressive',
  dataRefresh: 'normal standard',
  successFeedback: 'normal expressive',
  errorFeedback: 'normal standard',
};
```

### 6.4 Component-level motion rules

- Button: subtle press state, no large movement.
- Input: focus ring and border transition only.
- Select/Dropdown/Popover: opacity + small translate/scale.
- Dialog/Drawer: overlay fade + content reveal.
- Tabs: active indicator transition.
- Accordion/Disclosure: height/opacity transition.
- Toast: slide/fade, short duration.
- Table: avoid animating row layout by default; animate inline updates only.
- Skeleton: support calm loading animation and reduced-motion fallback.
- Empty State: optional illustration reveal in Pro only.

### 6.5 Accessibility

All motion must respect `prefers-reduced-motion`.

Rules:

- no required information should depend on animation;
- reduced motion should remove large movement and keep opacity/state changes minimal;
- repeated loops should be avoided in core components;
- animated previews in docs should have calm defaults.

## 7. Component architecture rules

Every Core component should follow a consistent implementation contract.

### 7.1 Required component qualities

Each component should support:

- `className` extension;
- variant API where useful;
- size API where useful;
- `data-slot` attributes for stable styling hooks;
- accessible keyboard behavior;
- visible focus state;
- disabled state;
- loading state where relevant;
- dark mode compatibility;
- compact/comfortable density compatibility;
- reduced-motion compatibility;
- semantic color tokens;
- no hardcoded arbitrary colors unless mapped to tokens.

### 7.2 State coverage

Each interactive component should define visual states for:

- default;
- hover;
- active/pressed;
- focus-visible;
- disabled;
- invalid/error where relevant;
- loading where relevant;
- selected/checked/open where relevant.

### 7.3 Slot structure

Components with internal parts should expose predictable slots.

Example:

```tsx
<Button data-slot="button">
  <span data-slot="button-icon" />
  <span data-slot="button-label" />
</Button>
```

Slot names should be stable and documented on the component page.

### 7.4 Variant naming

Variants should describe semantic purpose or visual role.

Recommended examples:

- `default`
- `primary`
- `secondary`
- `outline`
- `ghost`
- `subtle`
- `danger`
- `success`
- `warning`

Avoid decorative names such as `fancy`, `glass`, `neon`, `cool`, `modern`.

## 8. Standard component page structure

Every component documentation page must follow one consistent structure.

### 8.1 Required sections

1. Hero
   - component name;
   - concise description;
   - package/import path;
   - status badge: stable, beta or experimental.

2. Preview
   - live component preview;
   - theme toggle where available;
   - density toggle where available;
   - reduced-motion toggle where useful.

3. Usage
   - minimal usage snippet;
   - common usage snippet;
   - composition example if relevant.

4. Variants
   - visual variants;
   - size variants;
   - semantic variants.

5. Anatomy
   - slots;
   - internal structure;
   - styling hooks.

6. States
   - default;
   - hover;
   - focus;
   - disabled;
   - loading;
   - error;
   - selected/open/checked when relevant.

7. Motion
   - what animates;
   - duration/easing token used;
   - reduced-motion behavior;
   - motion anti-patterns.

8. Accessibility
   - keyboard behavior;
   - ARIA notes;
   - focus behavior;
   - screen reader expectations.

9. API
   - props table;
   - default values;
   - controlled/uncontrolled behavior where relevant.

10. Design notes
   - when to use;
   - when to avoid;
   - visual guidance;
   - composition guidance.

11. Related components
   - adjacent components;
   - recommended compositions.

### 8.2 Component page template

The docs app should expose a reusable `ComponentPage` template or equivalent layout primitive. Component documentation should not recreate the page structure manually every time.

Recommended blocks:

- `ComponentHero`
- `ComponentPreview`
- `ComponentUsage`
- `ComponentVariants`
- `ComponentAnatomy`
- `ComponentStates`
- `ComponentMotion`
- `ComponentAccessibility`
- `ComponentAPI`
- `ComponentDesignNotes`
- `RelatedComponents`

## 9. Signature patterns

Nerio should gradually build recognizable patterns that make it feel more design-led.

### 9.1 Command-first UI

Support fast actions, command palettes, smart search and AI-assisted panels.

Potential components:

- `CommandPanel`
- `ActionBar`
- `SearchWithSuggestions`
- `AIInlineHint`
- `QuickCreate`

### 9.2 Calm financial surfaces

Financial and crypto interfaces should feel clear, structured and low-noise.

Potential components:

- `FinancialOverview`
- `PortfolioSummary`
- `AssetCard`
- `TransactionList`
- `RiskScoreCard`

### 9.3 Designer-grade empty states

Empty states should be treated as first-class interface components.

Required content model:

- title;
- description;
- primary action;
- optional secondary action;
- optional illustration;
- optional example preview.

### 9.4 Animated layout blocks

Pro components can use motion to make layout changes feel intentional.

Potential components:

- `AnimatedStatsGrid`
- `SettingsSection`
- `BillingUsage`
- `RecentActivity`
- `OnboardingStep`

## 10. Anti-patterns

Avoid:

- visual styling that exists only inside one component;
- excessive purple usage;
- large decorative gradients in product UI;
- heavy shadows by default;
- random animation timings;
- motion without reduced-motion fallback;
- overly custom form controls;
- unclear icon-only actions;
- hidden focus states;
- documentation pages with inconsistent structure;
- examples that look like placeholders instead of real product UI.

## 11. Immediate implementation goals

This iteration should not focus on making every component visually perfect. It should establish the system hooks required for later refinement.

Immediate goals:

1. Add this document to the repository.
2. Add motion tokens and semantic motion utilities.
3. Add reduced-motion handling.
4. Standardize component state classes and slot naming.
5. Create a reusable component documentation page template.
6. Update existing component docs to follow the same structure.
7. Ensure components consume tokens instead of hardcoded visual values.
8. Add visual and motion guidance to component examples.
9. Add compact/comfortable density hooks if not already present.
10. Keep the current visual design restrained until foundations are complete.

## 12. Implementation checklist for AI agents

When implementing or editing a component, verify:

- the component uses design tokens;
- the component has stable slots;
- all relevant states are covered;
- focus-visible is implemented;
- disabled behavior is implemented;
- motion uses shared tokens;
- reduced-motion fallback exists;
- docs page follows the standard structure;
- examples use realistic product content;
- component API remains simple and predictable;
- no decorative styling bypasses the system foundation.
