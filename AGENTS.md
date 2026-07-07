# Nerio agent instructions

This repository is the source of truth for Nerio. Read `PROJECT.md` before making architectural decisions and `DESIGN_SYSTEM.md` before changing tokens, themes, shared component styles, demos, or visual documentation.

## Product constraints

- Build a source-first React design system for modern digital products across SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.
- Use **Base UI** as the sole primitive layer. Do not add Radix UI, shadcn/ui, Headless UI, Ariakit, or another overlapping primitive system.
- Use Next.js, React, TypeScript, Tailwind CSS v4, pnpm workspaces, and Turborepo.
- The project may adopt ideas compatible with registry-based distribution, but it must have its own `nerio` CLI, own registry format, own documentation, and own component APIs. Do not depend on the shadcn CLI, registry, or package.
- All public-facing docs, UI copy, code comments, and issue templates must be written in English.

## Design-system rules

- Design with primitive, semantic, and component tokens. Do not hard-code product colors, typography, radii, shadows, or spacing in component implementations when a token is appropriate.
- Preserve four initial theme presets: `purple-light` as the default, `neutral-light`, `neutral-dark`, and `fintech-blue-light`. Support Comfortable density by default and Compact density through tokens.
- Theme and density changes must work through CSS variables without rebuilding component source.
- Default to semantic names such as `--n-color-surface`, not visual names such as `--n-purple-600`, outside the primitive token layer.
- Components must use semantic or component aliases only; do not consume raw palette tokens directly.
- Every component must have a predictable anatomy, accessible interaction model, keyboard behavior, visible focus treatment, disabled/loading states where relevant, and a small API surface.
- Prefer composition and explicit slots over expansive boolean-prop APIs.
- Use `data-slot`, `data-state`, and `data-variant` attributes deliberately so components remain inspectable and easy to customize.
- Icons must be passed through the Nerio icon adapter. Lucide is the default implementation; components must not become tightly coupled to Lucide.

## Visual direction

- Treat `DESIGN_SYSTEM.md` as the detailed visual source of truth.
- Build neutral-first interfaces: hierarchy comes primarily from typography, spacing, layout, and contrast.
- Purple is a constrained accent for primary actions, selection, active states, focus, links, small progress signals, the primary chart series, and brand moments.
- Do not use purple as the default color for headings, normal icons, card backgrounds, standard borders, secondary actions, routine navigation, or broad page backgrounds.
- Do not use drop shadows or glows. Use whitespace, surface contrast, restrained borders, and backdrops to establish hierarchy and overlays.
- Use borders sparingly. Do not surround every content group with a card or border.
- Default component density is Comfortable. Compact must be implemented through tokens, not parallel components.
- The 4px spacing grid, 32px default control height, soft restrained radii, 12px minimum UI text, 1.5px default icon stroke, and 2px focus ring with 2px offset are baseline contracts.
- Color must convey intent. Keep semantic statuses subdued by default and reserve strong status treatments for urgent or high-salience contexts.

## Engineering rules

- Keep server and client boundaries deliberate in Next.js. Add `use client` only where an interaction actually requires it.
- Use TypeScript strict mode. Avoid `any`, unsafe assertions, and silent error handling.
- Do not introduce dependencies without a clear documented reason.
- Use workspace package boundaries. Avoid imports that bypass package public exports.
- Build only the scope requested; do not create speculative components or an oversized abstraction layer.
- Maintain a clean lint, typecheck, test, and build result before considering a task complete.

## Documentation and AI rules

- Every released component needs a docs page with purpose, anatomy, variants, states, usage snippets, accessibility notes, and guidance on when not to use it.
- Documentation must show usage snippets and live previews. Do not expose a full component source dump in public docs.
- Registry items must carry structured metadata for dependencies, Base UI primitives, slots, variants, required tokens, and installation instructions.
- Keep `llms.txt`, component manifests, and MCP responses aligned with the actual component API.

## Workflow

1. Inspect the current workspace and relevant documentation.
2. State a concise implementation plan in the pull request or task output.
3. Implement the smallest complete vertical slice.
4. Add or update docs, examples, types, and metadata in the same change.
5. Run the repository checks and report exact results.
