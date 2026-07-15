# Nerio design principles

Nerio is an open-source, source-first React design system for modern digital products. It combines accessible behavior, a coherent visual language, and editable component source without hiding implementation details from product teams.

These principles apply to Nerio Core components, tokens, documentation, registry entries, CLI and MCP metadata, examples, tests, and supporting tooling.

## How to use these principles

These principles guide new work and the review of existing work. They do not silently redefine the current public API.

Existing canonical APIs remain authoritative until an explicit migration task is approved. For example, the current Button variant set and the current Badge `tone` and `emphasis` axes must not be renamed or reorganized merely because another taxonomy appears conceptually cleaner. Any breaking change requires evidence, migration guidance, and synchronized updates across source, exports, registry metadata, docs, CLI, MCP, fixtures, and tests.

## Source-of-truth precedence and conflicts

These principles are a general decision framework. They fill gaps and guide future proposals; they do not supersede accepted decisions or the repository's scope-specific sources of truth.

- `DECISIONS.md` records accepted product and architecture decisions.
- `DESIGN_SYSTEM.md` governs approved visual and token contracts.
- `COMPONENT_ARCHITECTURE.md` governs component responsibility and API boundaries.
- `TIERING_AND_TEMPLATE_EVOLUTION.md`, `COMPONENTS.md`, and `data/component-catalog.json` govern ownership, tiering, and inventory within their declared scopes.
- The nearest `AGENTS.md` and `AGENT_DESIGN_SYSTEM_RULES.md` govern agent operating procedure.

Apply the most specific current source within its declared scope. Principles may support a proposed change, but they must not silently override an accepted public API or recorded decision. When two authoritative sources disagree or their scope is ambiguous, stop the affected implementation, identify the conflicting documents and clauses, and require an explicit decision that updates the relevant sources before proceeding.

## 1. Semantic intent before visual treatment

Public APIs describe the role, meaning, state, or interaction of a component. Visual implementation details are not the primary contract.

- Action APIs use stable roles and interaction treatments that can be explained independently of one screen.
- Status APIs use semantic concepts such as `neutral`, `info`, `success`, `warning`, and `danger` rather than palette names.
- Current Nerio component-family conventions remain canonical. New APIs must follow them or include an explicit migration plan.
- A visual treatment may become a separate axis only when consumers need it independently from semantic intent and the added complexity is justified.
- Color names such as `purple`, `red`, or `gray` do not belong in public component props.

The same concept uses the same term throughout the system.

## 2. Accessibility is a system invariant

Accessibility is part of the component contract. Every interactive component starts from the appropriate Base UI primitive or native semantic HTML element.

Nerio preserves keyboard behavior, focus management, accessible names, form relationships, disabled and invalid semantics, screen-reader output, forced-colors behavior, and reduced-motion preferences. Styling, composition, and custom `render` elements must not weaken behavior supplied by the underlying primitive.

## 3. Composition has a complexity budget

Components expose structure when consumers need to omit, reorder, replace, or independently customize meaningful parts. Simple elements remain simple.

Compound composition is appropriate for components with independently useful regions. Small presentational differences use existing variants, children, tokens, or `className`. Structural flexibility must not become a large boolean-prop matrix or a deeply nested API that adds no practical control.

## 4. Progressive disclosure

The common path is obvious and requires minimal code. Advanced control appears only when the use case requires it.

A component should work with sensible defaults, support richer composition when needed, and provide controlled state without forcing every consumer to manage state. Documentation presents minimal, standard, and advanced usage in that order.

## 5. Predictable conventions

Shared concepts behave consistently across components.

Nerio standardizes naming for size, variants, tones, emphasis, controlled and uncontrolled state, event handlers, slots, data attributes, and customization hooks. Consistency applies to meaning; it does not require every component to expose the same props.

Compatibility aliases are temporary migration tools, not alternate permanent APIs.

## 6. Type safety is part of the public API

Every public component contract is explicit, discoverable, and safe to extend.

Props, refs, events, states, variants, and slots are fully typed. Types derive from the underlying Base UI primitive, native element, and established style contract whenever practical. Internal convenience must not weaken consumer types, introduce public `any`, or hide unresolved ref and event mismatches behind assertions.

## 7. Tokens before local values

Components express design decisions through Nerio's primitive, semantic, and component token architecture.

Components consume semantic or component aliases rather than raw palette values. Theme, mode, and density remap contracts through CSS variables without rebuilding component source. Local arbitrary values require a documented technical reason and must not replace a reusable system or family decision.

## 8. Behavior, structure, and styling remain distinct

Base UI owns established interaction behavior and accessibility. Nerio component source owns composition, defaults, and the public API. Style recipes, utilities, and component CSS own visual states. Semantic and component tokens own theme-wide and family-wide decisions.

These concerns may remain co-located when that improves source readability. Nerio does not require a separate styling package until a real cross-framework use case justifies one.

## 9. Customization follows predictable escape hatches

Customization uses this order:

1. Theme, mode, density, and semantic token overrides
2. Existing component variants, tones, emphasis, and sizes
3. Root `className`
4. Meaningful slot or part customization for multi-part components
5. Base UI `render` composition where supported
6. Direct editing of source-installed components

Nerio avoids specificity wars, hidden selectors, unstable DOM traversal, and public props created for isolated visual tweaks.

## 10. Source ownership and extensibility

Installed component source is readable, editable, and understandable without the registry runtime or documentation website.

Components can be composed, wrapped, or adapted after installation. Dependencies remain minimal and justified. Shared abstractions improve consistency without making copied source difficult to understand or maintain.

## 11. Motion communicates state

Motion explains state changes, hierarchy, continuity, and cause-and-effect.

Nerio prefers cancellable CSS transitions, shared duration and easing tokens, and GPU-friendly properties such as opacity and transform. Components respect reduced-motion preferences. Decorative looping motion and animation that delays input feedback are excluded from Core defaults.

## 12. Core is restrained and domain-agnostic

Core components solve reusable interface problems across modern products without embedding product workflows or business entities.

Visual hierarchy begins with spacing, typography, alignment, layout, and contrast. Neutral surfaces are the default. Accent color communicates action, state, selection, focus, or a restrained brand moment. Borders and elevation appear when they clarify structure or actual layering. Decorative gradients, excessive surface nesting, and ornamental effects do not define Core defaults.

Product-ready workflows, advanced compositions, and domain-specific behavior belong in Nerio Pro, templates, or consuming applications according to the repository tiering rules.

## 13. Documentation is part of the product

A component is incomplete until its behavior, composition, states, accessibility, API, and realistic usage are documented.

Documentation must be usable by people and coding agents. Examples compile against public imports, use realistic content, and make constraints explicit. Component source, exports, catalog entries, registry metadata, CLI and MCP projections, tests, and docs evolve together.

## Review question

Before accepting a component change, ask:

> Does this change make the component's meaning, behavior, source, and customization more predictable without expanding Core responsibility unnecessarily?

## Influences

These principles are adapted for Nerio from established design-system practices, including HeroUI's design principles and Base UI's accessible primitive architecture:

- https://heroui.com/en/docs/react/getting-started/design-principles
- https://base-ui.com/react/overview/about
