# ADR 0004: Theme, mode, and density axes

## Status

Accepted

## Context

The earlier theme model used combined names such as `purple-light`, `neutral-dark`, and `fintech-blue-light`.

That model mixed brand/accent personality with color mode. It would not scale cleanly once every theme needed light, dark, system, compact, high-contrast, or future Pro variants.

The Core preset list should be generic and brand-color based rather than vertical-specific.

Nerio also needs to stay flexible for typography, radius, motion, contrast, and other visual parameters without turning v1 into a full theme engine.

## Decision

Nerio separates runtime appearance into three independent v1 axes:

- `data-theme`: brand/accent personality.
- `data-mode`: light/dark/system color mode.
- `data-density`: spacing and control density.

Default runtime attributes:

```html
<html data-theme="purple" data-mode="system" data-density="comfortable">
```

Initial preset values:

```txt
data-theme="purple" | "blue" | "green" | "orange" | "red" | "neutral"
data-mode="system" | "light" | "dark"
data-density="comfortable" | "compact"
```

Custom product themes are supported by adding a new `data-theme` value and overriding the same semantic/component CSS variables.

Font, radius, motion, spacing, shadow/elevation, and contrast are token-customizable in v1, but they are not separate runtime axes.

## Rules

- Theme must not encode light or dark mode.
- Mode must not encode brand/accent personality.
- Density must not require separate component implementations.
- Core preset themes should use generic brand color names.
- Do not create vertical-specific Core preset names such as `fintech-blue`.
- Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `neutral-dark`, `blue-light`, `blue-dark`, `red-light`, or `red-dark`.
- Do not introduce `data-font`, `data-radius`, `data-motion`, `data-contrast`, or `data-scale` in v1.
- Developers may customize font, radius, motion, spacing, and contrast through CSS variables such as `--n-font-sans`, `--n-font-mono`, `--n-radius-md`, `--n-radius-lg`, and `--n-duration-normal`.
- Pro may add premium brand themes such as `enterprise`, `glass`, or `trading`, but those themes must still use the same mode and density axes.
- Future runtime axes for radius, font, motion, contrast, or scale require a new architecture decision.
- Components must consume semantic/component tokens, not raw theme or mode values directly.

## Consequences

This keeps the system composable and prevents a combinatorial explosion of theme names.

A single theme can work across system, light, and dark modes.

A single density system can work across all themes and modes.

Product teams can add custom brand themes without changing the Core component API.

Developers can still customize typography, shape, motion, and contrast through tokens without adding runtime complexity to v1.
