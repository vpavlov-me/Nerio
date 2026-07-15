# Nerio Design Principles

Nerio is an open-source, source-first design system for modern digital products. It provides accessible behavior, a coherent visual language, and editable component source without hiding implementation details from product teams.

These principles apply to Nerio Core components, tokens, documentation, examples, registry entries, CLI and MCP projections, and agent-authored changes.

## 1. Semantic intent over visual treatment

Public APIs describe the role, priority, state, or interaction represented by a component. Visual implementation details are not the primary meaning of an API.

- Action APIs use semantic names when a distinction changes priority or risk, such as `primary`, `secondary`, and `danger`.
- Feedback and status APIs use semantic tones such as `neutral`, `accent`, `info`, `success`, `warning`, and `danger` where the component owns status meaning.
- Presentation modes such as `outline`, `ghost`, or `link` may remain in an established API for compatibility, but new APIs must not mix semantic intent and visual treatment without an explicit architecture decision.
- `tone`, `variant`, `appearance`, and `size` are independent concepts only when a component has validated use cases for each axis. Components do not expose every axis by default.
- Color names never appear in public component APIs.

The same semantic concept uses the same name across the system. Existing public APIs are migrated only through an approved compatibility plan.

## 2. Accessibility is a system invariant

Accessibility is part of the component contract. Every interactive component starts from the appropriate Base UI primitive or the correct native HTML element.

Nerio preserves keyboard behavior, focus management and restoration, accessible names and descriptions, form relationships, disabled and invalid semantics, screen-reader output, forced-colors behavior, directionality, and reduced-motion preferences. Styling and composition must never weaken the behavior supplied by the underlying primitive.

## 3. Composition has a complexity budget

Components expose structure when consumers need to omit, reorder, replace, or independently customize meaningful parts. Simple elements remain simple.

Compound composition is preferred for components with independently useful regions. Small presentational differences use existing variants, tokens, children, or `className`. Structural flexibility must not turn into a large collection of boolean props, and simple components must not become unnecessarily verbose compound APIs.

## 4. Progressive disclosure

The common path is obvious and requires minimal code. Advanced control appears only when the use case requires it.

A component should work with sensible defaults, support richer composition when needed, and provide controlled state without forcing every consumer to manage state. Documentation presents minimal, standard, and advanced usage in that order.

## 5. Predictable conventions

Shared concepts behave consistently across components.

Nerio standardizes naming for controlled and uncontrolled state, event handlers, sizes, semantic tones, variants, slots, state attributes, refs, and customization hooks. Consistency applies to meaning; it does not require every component to expose the same props.

## 6. Type safety is part of the public API

Every public component contract is explicit, discoverable, and safe to extend.

Props, refs, events, states, variants, and slots are fully typed. Types derive from the underlying Base UI primitive, native element, and established Nerio contracts whenever possible. Internal convenience must not weaken consumer types, expose unstable implementation details, or require `any`.

## 7. Tokens before local values

Components express design decisions through semantic and component token aliases.

Primitive scales are foundation inputs and remain immutable across runtime axes. Component source consumes semantic or component aliases rather than raw palettes or primitive values. Themes, modes, density, typography recipes, and consumer overrides can therefore change appearance without rewriting component structure or behavior.

Local literals and arbitrary values require a documented technical reason. A one-off cosmetic preference does not justify a new token.

## 8. Behavior, structure, and styling remain distinct

Base UI supplies interaction behavior and accessibility. Nerio component source defines composition, defaults, and public API. Component styles and state hooks define visual behavior. Semantic and component tokens define shared appearance contracts.

These concerns may remain co-located for source ownership and readability while their responsibilities stay clear. Nerio does not create a separate framework-agnostic styling package until a real approved cross-framework requirement justifies one.

## 9. Customization uses predictable escape hatches

Customization follows a stable order:

1. Semantic and component token overrides
2. Existing semantic variants, tones, modes, and sizes
3. Root `className`
4. Meaningful slot or part customization for multi-part components
5. Base UI `render` composition where supported
6. Direct editing of installed source

Nerio avoids specificity wars, hidden selectors, unstable DOM traversal, and prop APIs created for isolated visual tweaks.

## 10. Source ownership and extensibility

Installed component source is readable, editable, and understandable without the registry runtime or documentation site.

Components can be composed, wrapped, or adapted after source installation. Dependencies remain minimal and justified. Shared helpers improve consistency without making copied source difficult to follow. Public package usage and source installation preserve the same documented component contract.

## 11. Motion communicates state

Motion explains state changes, hierarchy, continuity, and cause-and-effect.

Nerio prefers cancellable CSS transitions, shared duration and easing tokens, and properties such as opacity and transform when they communicate the interaction adequately. Components respect reduced-motion preferences and expose deterministic end states. Decorative or looping motion is excluded from Core defaults.

## 12. Core is restrained and domain-agnostic

Core components solve reusable interface problems across modern digital products without embedding product-specific workflows, business entities, routing, fetching, persistence, permissions, analytics, or domain policy.

Visual hierarchy begins with typography, spacing, layout, and contrast. Neutral surfaces are the default. Accent color signals action, state, selection, or focus. Borders and elevation appear only when they clarify a real boundary or layering role already defined by the visual source of truth. Decorative gradients, excessive nesting, and ornamental effects do not define Core defaults.

Product-ready workflows and advanced reusable compositions belong in Nerio Pro. Application-specific logic remains consumer-owned.

## 13. Documentation is part of the product

A component is incomplete until its behavior, composition, states, accessibility, API, installation contract, and examples are represented consistently.

Documentation must be usable by people and coding agents. Examples compile against public imports and demonstrate realistic content without expanding Core responsibility. Component source, public exports, `data/component-catalog.json`, registry metadata, CLI source installation, MCP responses, tests, and docs evolve together.
