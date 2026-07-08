# ADR 0004: Theme, mode, and density axes

## Status

Accepted

## Context

The earlier theme model used combined names such as `purple-light`, `neutral-dark`, and `fintech-blue-light`.

That model mixed brand/accent personality with color mode. It would not scale cleanly once every theme needed light, dark, system, compact, high-contrast, or future Pro variants.

## Decision

Nerio separates runtime appearance into three independent axes:

- `data-theme`: brand/accent personality.
- `data-mode`: light/dark/system color mode.
- `data-density`: spacing and control density.

Default runtime attributes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable">
```

Initial values:

```txt
data-theme="purple" | "neutral" | "fintech-blue"
data-mode="system" | "light" | "dark"
data-density="comfortable" | "compact"
```

## Rules

- Theme must not encode light or dark mode.
- Mode must not encode brand/accent personality.
- Density must not require separate component implementations.
- Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `neutral-dark`, `fintech-blue-light`, or `fintech-blue-dark`.
- Pro may add premium brand themes such as `enterprise`, `glass`, or `trading`, but those themes must still use the same mode and density axes.
- Components must consume semantic/component tokens, not raw theme or mode values directly.

## Consequences

This keeps the system composable and prevents a combinatorial explosion of theme names.

A single theme can work across system, light, and dark modes.

A single density system can work across all themes and modes.
