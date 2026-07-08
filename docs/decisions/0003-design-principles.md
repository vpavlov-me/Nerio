# ADR 0003: Design principles

## Status

Accepted

## Context

Nerio needs a consistent visual language across Core components, Pro components, demos, docs, and AI-generated code.

## Decision

Nerio should use a minimal, neutral-first, spacious, professional visual direction.

Purple is the default branded accent and should be used with restraint.

The system should rely primarily on typography, spacing, layout, surface contrast, and restrained borders rather than shadows, glows, or saturated surfaces.

Theme, mode, and density are separate runtime axes:

- theme controls brand/accent personality;
- mode controls light/dark/system color mode;
- density controls spacing and control sizing.

## Rules

- Use `data-theme="purple"` as the default branded theme.
- Use `data-mode="system"` as the default color mode.
- Use `data-density="comfortable"` as the default density.
- Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `neutral-dark`, `fintech-blue-light`, or `fintech-blue-dark`.
- Use purple for primary actions, selection, active states, focus, links, small progress signals, the primary chart series, and brand moments.
- Do not use purple as the default color for headings, normal icons, card backgrounds, standard borders, secondary actions, routine navigation, or broad page backgrounds.
- Do not use drop shadows or glows.
- Prefer whitespace, surface contrast, restrained borders, and backdrops for hierarchy.
- Use borders sparingly.
- Do not wrap every content group in a bordered card.
- Compact density must be implemented through tokens, not parallel components.
- Components must use primitive, semantic, and component tokens.
- Components must not consume raw palette tokens directly outside the primitive token layer.

## Consequences

This creates a calmer product language suitable for SaaS, fintech, crypto, data-rich dashboards, AI products, and broader modern digital products without making the open-source Core feel vertical-specific.
