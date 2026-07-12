# Nerio component architecture

This document defines the architectural rules for deciding whether a UI capability belongs in an existing component, a variant, or a separate component.

## Core principle

**One component represents one semantic responsibility.**

Components must be grouped by meaning, behavior, accessibility contract, and composition role rather than by visual similarity alone.

Two elements may look nearly identical and still require separate components when they communicate different concepts or are expected to evolve independently.

Examples:

- `Badge` represents status or metadata.
- `Counter` represents a numeric quantity, commonly notifications or unread items.
- `StatusDot` represents a compact state signal without a numeric value.
- `Chip` represents a compact interactive option, filter, selection, or removable value.
- `Tag` represents non-interactive classification or taxonomy.

Do not make one component impersonate several of these concepts through a large combination of props.

## Variant or separate component

Add a variant or size to an existing component only when all of the following remain the same:

- semantic purpose;
- expected user interpretation;
- accessibility role and announcements;
- interaction model;
- content model;
- lifecycle and likely future API direction.

Create a separate component when one or more of those contracts differ meaningfully.

A visual size difference by itself is usually a variant. A change in purpose is usually a component boundary.

## API rules

- Prefer small, explicit APIs over broad boolean-prop matrices.
- Prefer composition and named slots over mode props that replace the component's identity.
- Do not add props for behavior that belongs to another semantic component.
- Avoid variants such as `type="counter"`, `asNotification`, `dot`, or `count` on `Badge` when a dedicated primitive expresses the responsibility more clearly.
- Shared styling must be implemented through tokens, shared utilities, or internal style recipes rather than by merging public component APIs.

## Badge and Counter requirement

`Badge` and `Counter` are separate Core components.

### Badge

Use `Badge` for concise status, metadata, labels, or classification attached to content.

Typical content:

- `Beta`
- `New`
- `Archived`
- `Pro`

`Badge` must not own notification-count behavior, numeric overflow rules, or counter-specific examples.

### Counter

Use `Counter` for compact numeric quantities.

Typical use cases:

- unread messages;
- notifications;
- item totals inside controls;
- compact counts attached to icons, tabs, or buttons.

Counter-specific behavior may include:

- numeric `value`;
- an optional maximum display value such as `99+`;
- zero-value visibility rules;
- fixed-height, minimum-width numeric layout;
- accessible text for abbreviated visual values.

Do not reintroduce Counter behavior into `Badge` for convenience.

## Review requirement for agents

Before adding a prop or variant to an existing component, determine whether it preserves the component's semantic responsibility.

When a requested implementation mixes responsibilities, agents must:

1. call out the architectural conflict;
2. recommend the appropriate component boundary;
3. avoid implementing the mixed API unless the repository's source-of-truth documents are explicitly changed.

During reviews, treat responsibility mixing and speculative universal components as architecture issues, even when the implementation is visually correct.

## Core and Pro boundary

Semantic primitives and common reusable interaction building blocks belong in Core. Product-ready compositions, domain-specific workflows, and advanced patterns belong in Pro.

Examples:

- Core: `Badge`, `Counter`, `StatusDot`, basic `Chip`, basic `Tag`.
- Pro: `TrendChip`, `RiskBadge`, advanced filter-token systems, saved-filter chips, domain-specific status groups, and product-ready compositions built from Core primitives.

Core components must remain domain-agnostic and independently useful. Pro may compose and specialize them without changing their foundational responsibility.
