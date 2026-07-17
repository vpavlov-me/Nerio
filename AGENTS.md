# Nerio agent instructions

This repository is the source of truth for Nerio. Read the following documents before changing the areas they govern:

- `PROJECT.md` before making architectural decisions.
- `DECISIONS.md` before changing accepted product or architecture decisions.
- `DESIGN_SYSTEM.md` before changing tokens, themes, modes, density, shared component styles, demos, or visual documentation.
- `DESIGN_PRINCIPLES.md` before proposing or reviewing component APIs, composition, customization, accessibility, motion, or documentation conventions.
- `docs/core-ui-best-practices.md` before changing or reviewing Core UI responsibilities, public APIs, styling layers, anatomy, states, accessibility, responsive behavior, motion, tests, or examples.
- `AGENT_DESIGN_SYSTEM_RULES.md` before changing Core components, tokens, utilities, catalog and registry metadata, examples, tests, docs, CLI, or MCP projections.
- `COMPONENTS.md` before adding or moving components.
- `COMPONENT_ARCHITECTURE.md` before adding props, variants, component modes, or new component responsibilities.
- `TIERING_AND_TEMPLATE_EVOLUTION.md` before assigning a component to Core or Pro, promoting template-local code, or expanding Core to satisfy a template.

## Product constraints

- Build a source-first React design system for modern digital products across SaaS applications, consumer products, marketplaces, dashboards, internal tools, content platforms, creator tools, productivity products, and data-rich workflows.
- Nerio has two product layers: **Nerio Core** and **Nerio Pro**.
- **Nerio Core** is the open-source foundation: tokens, themes, primitive and base UI components, public docs, public registry, CLI, and public MCP/component discovery.
- **Nerio Pro** is the paid advanced layer: complex product components, templates, premium themes, Figma assets, advanced registry items, and Pro MCP/AI tooling.
- Core = building blocks. Pro = product-ready solutions.
- Templates may compose Core, Pro, and template-local components. A template does not need complete Core coverage.
- Use **Base UI** as the sole primitive layer. Do not add Radix UI, shadcn/ui, Headless UI, Ariakit, or another overlapping primitive system.
- Use Next.js, React, TypeScript, Tailwind CSS v4, pnpm workspaces, and Turborepo.
- The project may adopt ideas compatible with registry-based distribution, but it must have its own `nerio` CLI, own registry format, own documentation, and own component APIs. Do not depend on the shadcn CLI, registry, or package.
- All public-facing docs, UI copy, code comments, and issue templates must be written in English.

## Current roadmap focus

- Current work is in **Phase 2A: Core quality stabilization**.
- Phase 2A cleanup tasks must harden existing Core foundations and components before expanding coverage.
- Do not add new Core components while working on Phase 2A cleanup tasks unless the task explicitly asks for them.
- Phase 2B component coverage expansion must wait until existing Core quality is stronger, or until the task explicitly asks for Phase 2B work.
- Do not mark a component `stable-core` until it passes the full Core quality checklist.

## Product positioning

- Nerio Core remains universal and domain-agnostic.
- SaaS, fintech, crypto, data-rich dashboards, and AI products are priority use cases, especially for Pro patterns and templates.
- Do not position the whole project as fintech-only, crypto-only, banking-only, or SaaS-only.
- Pro components may be domain-specific when they provide clear product value.

## Package and tier boundaries

- Core packages live under the public workspace and include `packages/tokens`, `packages/ui`, `packages/adapters`, `packages/cli`, `packages/mcp`, and `packages/config`.
- Future Pro packages may live in a private repository or private workspace and may depend on Core.
- Core must never import from Pro.
- Pro may import from Core.
- Templates may import Core and Pro and may contain local components that are not published as design-system components.
- Core must not be expanded solely because one template needs a missing element.
- When reuse or the correct tier is uncertain, prefer a template-local implementation or an explicit Pro candidate over a speculative Core abstraction.
- Before promoting template-local code, apply the decision sequence and evidence requirements in `TIERING_AND_TEMPLATE_EVOLUTION.md`.
- Before adding a component, check `COMPONENTS.md` and `data/component-catalog.json`.
- If a component is an advanced composition, domain-specific pattern, or template-like workflow, it usually belongs in Pro.
- Do not move advanced data grids, dashboard systems, billing flows, AI chat shells, or fintech/crypto-specific components into Core unless `COMPONENTS.md` is explicitly updated.

## Design-system rules

- Treat `DESIGN_PRINCIPLES.md` as the system-wide decision framework and `AGENT_DESIGN_SYSTEM_RULES.md` as the normative implementation contract for coding agents.
- Treat `docs/core-ui-best-practices.md` as the canonical Core UI implementation and review standard. Apply its ownership model, API admission rule, system/family/component-exception hierarchy, and reusable review checklist without duplicating those rules locally.
- Existing canonical APIs remain authoritative until an explicit migration task approves a change. Do not silently reshape Nerio APIs to match another design system.
- Design with primitive, semantic, and component tokens. Do not hard-code product colors, typography, radii, shadows, or spacing in component implementations when a token is appropriate.
- One component represents one semantic responsibility. Group components by meaning, behavior, accessibility contract, and composition role rather than visual similarity.
- Before adding a prop or variant, verify that the semantic purpose, interaction model, content model, and likely API evolution remain unchanged. If they differ, prefer a separate component.
- Agents must call out requests that mix component responsibilities and recommend the appropriate boundary before implementation.
- Theme, mode, and density are the only v1 runtime appearance axes:
  - `data-theme="purple" | "blue" | "green" | "orange" | "red" | "neutral"` controls brand/accent personality.
  - `data-mode="system" | "light" | "dark"` controls color mode.
  - `data-density="comfortable" | "compact"` controls spacing and control density.
- `purple` is the default theme, `system` is the default mode, and `comfortable` is the default density.
- Do not create combined theme names such as `purple-light`, `purple-dark`, `neutral-light`, `blue-dark`, or `red-light`.
- Do not create vertical-specific theme names such as `fintech-blue` for Core presets. Use generic brand color names by default.
- Custom product themes are allowed by adding a new `data-theme` value and overriding CSS variables. They must still use the same `data-mode` and `data-density` axes.
- Font, radius, motion, spacing, shadow/elevation, and contrast are token-customizable in v1, but they are not separate runtime axes.
- Do not introduce `data-font`, `data-radius`, `data-motion`, `data-contrast`, or `data-scale` unless a later architecture decision explicitly promotes them to runtime axes.
- Developers may customize typography, radius, motion, spacing, or contrast by overriding CSS variables such as `--n-font-sans`, `--n-font-mono`, `--n-radius-md`, `--n-radius-lg`, `--n-duration-normal`, and semantic color variables.
- Theme, mode, density, and token overrides must work through CSS variables without rebuilding component source.
- Default to semantic names such as `--n-color-surface`, not visual names such as `--n-purple-600`, outside the primitive token layer.
- Components must use semantic or component aliases only; do not consume raw palette tokens directly.
- Component source styles must use semantic or component aliases only.
- Registry `requiredTokens` must describe public customization points, preferably component aliases, not random internal semantic tokens.
- Token chips in docs and registry metadata must reference real CSS variables from `packages/tokens/src/styles.css`.
- `pnpm validate:docs` is expected to catch missing token references in token CSS, registry `requiredTokens`, and docs reference token chips.
- Catalog, token, or runtime-axis changes must run both the focused invalid-fixture tests (`pnpm test:catalog` and `pnpm test:tokens`) and the corresponding validators; do not rely on valid-state checks alone.
- Every component must have a predictable anatomy, accessible interaction model, keyboard behavior, visible focus treatment, disabled/loading states where relevant, and a small API surface.
- Prefer composition and explicit slots over expansive boolean-prop APIs.
- Use `data-slot`, `data-state`, and `data-variant` attributes deliberately so components remain inspectable and easy to customize.
- Icons must be passed through the Nerio icon adapter. Lucide is the default implementation; components must not become tightly coupled to Lucide.

## Core quality checklist

Before moving any Core component toward `stable-core`, verify:

- API stability: public props, slots, variants, and composition model are intentional.
- Accessibility: semantics, labels, keyboard behavior, focus management, disabled/loading/invalid states, and announcements are covered where relevant.
- Token usage: source styles consume semantic or component aliases only.
- Theme, mode, and density behavior: `data-theme`, `data-mode`, and `data-density` work through CSS variables without rebuilding source.
- Registry metadata: dependencies, Base UI primitives, slots, variants, required tokens, usage, accessibility guidance, and tier are accurate.
- Docs coverage: purpose, anatomy, variants, states, usage snippets, accessibility notes, when-not-to-use guidance, and real token chips are present.
- CLI install fixture: installed files and registry dependencies remain accurate.
- MCP metadata alignment: MCP responses reflect the same registry contract exposed to the CLI and docs.
- Validation commands: run and report `pnpm validate:docs`, plus relevant lint, typecheck, test, fixture, and build checks for the changed surface.

## Visual direction

- Treat `DESIGN_SYSTEM.md` as the detailed visual source of truth.
- Build neutral-first interfaces: hierarchy comes primarily from typography, spacing, layout, and contrast.
- Purple is the default constrained accent for primary actions, selection, active states, focus, links, small progress signals, the primary chart series, and brand moments.
- Do not use brand colors as the default color for headings, normal icons, card backgrounds, standard borders, secondary actions, routine navigation, or broad page backgrounds.
- Do not use drop shadows or glows. Use whitespace, surface contrast, restrained borders, and backdrops to establish hierarchy and overlays.
- Use borders sparingly. Do not surround every content group with a card or border.
- Default component density is Comfortable. Compact must be implemented through tokens, not parallel components.
- The 4px spacing grid, 32px default control height, soft restrained radii, 12px minimum UI text, 1.5px default icon stroke, and 2px focus ring with 2px offset are baseline contracts.
- Color must convey intent. Keep semantic statuses subdued by default and reserve strong status treatments for urgent or high-salience contexts.

## Engineering rules

- Keep server and client boundaries deliberate in Next.js. Add `use client` only where an interaction actually requires it.
- Treat `@nerio-ui/ui` as the server-safe default entrypoint for static components and utilities. Put interactive Base UI-backed components in `@nerio-ui/ui/client`, and keep `@nerio-ui/ui/styles.css` unchanged.
- Use TypeScript strict mode. Avoid `any`, unsafe assertions, and silent error handling.
- Do not introduce dependencies without a clear documented reason.
- Use workspace package boundaries. Avoid imports that bypass package public exports.
- Build only the scope requested; do not create speculative components or an oversized abstraction layer.
- Maintain a clean lint, typecheck, test, and build result before considering a task complete.

## Documentation and AI rules

- Every released component needs a docs page with purpose, anatomy, variants, states, usage snippets, accessibility notes, and guidance on when not to use it.
- Documentation must show usage snippets and live previews. Do not expose a full component source dump in public docs.
- Mark Pro components clearly as `Pro` in docs, navigation, manifests, and previews.
- Public Pro documentation may include descriptions, previews, API shape, and installation CTA, but must not expose private Pro source code.
- Registry items must carry structured metadata for dependencies, Base UI primitives, slots, variants, required tokens, installation instructions, and product tier.
- Keep `llms.txt`, component manifests, `data/component-catalog.json`, and MCP responses aligned with the actual component API.
- Treat `data/component-catalog.json` as the canonical machine-readable component inventory. When a component changes, update the catalog first, then its `COMPONENTS.md` matrix row and all affected registry, docs, CLI, MCP, and fixture projections. Run `pnpm validate:catalog` before requesting review.

## Workflow

1. Determine the intended base branch before starting. Normal work always targets `dev`.
2. Update `dev` and create a `feat/*`, `fix/*`, `refactor/*`, `docs/*`, `test/*`, or `chore/*`
   branch from it. Do not create a feature branch from `main`.
3. Inspect the current workspace and relevant documentation.
4. Check `COMPONENTS.md`, `data/component-catalog.json`, and the tiering guidance before creating, moving, or promoting components.
5. State a concise implementation plan in the pull request or task output.
6. Implement the smallest complete vertical slice.
7. Add or update docs, examples, types, registry metadata, and component catalog entries in the same change.
8. Run the repository checks and report exact results.
9. Open ordinary pull requests into `dev`; never open a feature pull request directly into `main`.
10. Use `dev -> main` only for an explicitly requested release pull request. Never merge a pull
    request into `main` without a separate, direct request from the user.
11. After a task pull request is merged and the final remote state is verified, stop processes
    started from its worktree, remove that worktree from the local machine, and run
    `git worktree prune`. Never remove a worktree that contains uncommitted changes or unmerged
    commits; report it as retained instead.
