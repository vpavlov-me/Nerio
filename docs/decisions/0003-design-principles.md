# ADR 0003: Design principles

## Status

Accepted

## Context

Nerio needs a consistent visual language across Core components, Pro components, demos, docs, and AI-generated code.

## Decision

Nerio should use a minimal, neutral-first, spacious, professional visual direction.

Brand color is a restrained accent and should be used with restraint.

The system should rely primarily on typography, spacing, layout, surface contrast, and restrained borders rather than shadows, glows, or saturated surfaces.

Theme, mode, and density are separate runtime axes:

- theme controls brand/accent personality;
- mode controls light/dark/system color mode;
- density controls spacing and control sizing.

## Rules

- Use `data-theme="purple"` as the default branded theme.
- Support default brand preset themes: `purple`, `blue`, `green`, `orange`, `red`, and `neutral`.
- Support custom product themes through new `data-theme` values and CSS variable overrides.
- Use `data-mode="system"` as the default color mode.
- Use `data-density="comfortable"` as the default density.
- Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `neutral-dark`, `blue-light`, or `red-dark`.
- Do not create vertical-specific Core preset names such as `fintech-blue`.
- Use brand color for primary actions, selection, active states, focus, links, small progress signals, the primary chart series, and brand moments.
- Do not use brand color as the default color for headings, normal icons, card backgrounds, standard borders, secondary actions, routine navigation, or broad page backgrounds.
- Do not use drop shadows or glows.
- Prefer whitespace, surface contrast, restrained borders, and backdrops for hierarchy.
- Use borders sparingly.
- Do not wrap every content group in a bordered card.
- Compact density must be implemented through tokens, not parallel components.
- Components must use primitive, semantic, and component tokens.
- Components must not consume raw palette tokens directly outside the primitive token layer.

## Consequences

This creates a calmer product language suitable for SaaS, fintech, crypto, data-rich dashboards, AI products, and broader modern digital products without making the open-source Core feel vertical-specific.
