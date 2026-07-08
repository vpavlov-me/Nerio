# ADR 0001: Core and Pro split

## Status

Accepted

## Context

Nerio should support both open-source adoption and a future commercial product layer.

The open-source layer must be useful enough to build real products. The commercial layer should provide advanced components, product-ready patterns, templates, premium themes, Figma assets, and AI tooling.

## Decision

Nerio will be split into two product tiers:

- Nerio Core
- Nerio Pro

Nerio Core contains foundations and basic reusable components.

Nerio Pro contains advanced product patterns, templates, premium themes, Figma assets, and AI tooling.

Core = building blocks. Pro = product-ready solutions.

## Rules

- Core must never import from Pro.
- Pro may import from Core.
- Core components should be generic, composable, accessible, and useful without a paid license.
- Pro components may be domain-specific, workflow-heavy, and commercially valuable.
- Pro should not duplicate Core components without meaningful added product value.
- Component tiering must be recorded in `COMPONENTS.md` and `data/component-catalog.json`.

## Consequences

This allows Nerio to grow as an open-source design system while preserving a clear path for commercial advanced components and templates.
