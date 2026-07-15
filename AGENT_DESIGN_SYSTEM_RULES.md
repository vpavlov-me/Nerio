# Nerio Core — design-system rules for coding agents

## Status and scope

This document is normative for agent-authored changes to Nerio Core components, tokens, utilities, catalog and registry metadata, examples, tests, documentation, CLI projections, and MCP projections.

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** define requirement strength.

Read this document together with:

- `PROJECT.md` for product scope and positioning;
- `DESIGN_SYSTEM.md` for visual and token decisions;
- `DESIGN_PRINCIPLES.md` for system-wide principles;
- `COMPONENT_ARCHITECTURE.md` for responsibility and API boundaries;
- `TIERING_AND_TEMPLATE_EVOLUTION.md` for Core, Pro, template, and consumer ownership;
- `COMPONENTS.md` and `data/component-catalog.json` for the canonical inventory.

When these sources conflict, do not choose a convenient interpretation. Stop the conflicting implementation, report the conflict, and require an explicit architecture decision.

## Compatibility lock

Existing canonical APIs remain authoritative until an explicit migration task approves a change.

Agents MUST NOT rename, remove, regroup, or reinterpret public props, variants, tones, emphasis levels, sizes, slots, exports, entrypoints, or defaults merely to resemble another design system. Conceptual examples in `DESIGN_PRINCIPLES.md` guide decisions; they are not automatic migration instructions.

Breaking changes require explicit scope, evidence, migration guidance, synchronized repository projections, and release-phase validation.

## Required operating procedure

Before editing, an agent MUST:

1. Read the nearest `AGENTS.md` and all relevant source-of-truth documents.
2. Inspect at least one analogous Nerio component and the underlying Base UI primitive.
3. Identify applicable tokens, utilities, tests, docs patterns, catalog fields, registry metadata, and source-install fixtures.
4. Determine whether the task changes a public contract, visual decision, package boundary, or product tier.
5. State the smallest complete implementation slice and explicit out-of-scope items.

Prefer this decision order:

1. Reuse an existing component unchanged.
2. Compose existing components.
3. Use an existing token or customization escape hatch.
4. Extend an existing component without weakening its semantic responsibility.
5. Add a Core component only for a reusable, domain-agnostic interface concept.
6. Add a dependency only when the platform, Base UI, and current Nerio utilities cannot satisfy the requirement.

After editing, run and report all relevant formatting, linting, type-checking, testing, validation, fixture, and build checks. Report every skipped or unavailable check.

---

## 1. Semantic APIs

### MUST

- Public props describe stable intent, role, state, interaction, or an independently useful treatment.
- Shared concepts use shared names across component families.
- New APIs follow current Nerio conventions unless the task explicitly includes a migration.
- The current canonical Button variants remain `primary`, `secondary`, `outline`, `ghost`, `link`, and `danger`. Deprecated aliases such as `subtle` and `destructive` remain migration debt until an explicit task removes them.
- The current Badge contract uses `tone` for semantic treatment and `emphasis` for quiet versus high-salience presentation.
- New axes require multiple independent use cases and an explanation of why existing APIs, tokens, composition, `className`, `render`, or source ownership are insufficient.

### MUST NOT

- Use palette names such as `purple`, `red`, or `gray` in public props.
- Add a variant, tone, size, slot, or boolean mode for one isolated example.
- Expose multiple axes that express the same decision.
- Treat another design system's taxonomy as permission to break Nerio compatibility.

---

## 2. Accessibility invariants

### MUST

- Use the appropriate Base UI primitive or native semantic element for interactive behavior.
- Preserve Base UI keyboard behavior, focus management, ARIA attributes, roles, event details, state attributes, and lifecycle behavior.
- Preserve required props and refs when using Base UI `render` composition.
- Require accessible names for icon-only controls, preferably through the TypeScript contract.
- Keep visible `focus-visible` treatment.
- Preserve label, description, error, required, invalid, read-only, disabled, and loading relationships where relevant.
- Communicate status, selection, and validation through more than color alone.
- Respect reduced motion and consider forced colors, zoom/reflow, RTL, localization, touch, and narrow containers when relevant.
- Test meaningful keyboard, focus, naming, and state behavior.

### MUST NOT

- Replace an accessible primitive with a clickable `div` or `span`.
- Recreate a Base UI state machine already supplied by the primitive.
- Remove focus indication or overwrite protected semantics for styling convenience.
- Use `render` when the replacement element has incorrect semantics.

---

## 3. Composition with a complexity budget

### MUST

- Use compound parts when consumers need to omit, reorder, replace, or independently customize meaningful regions.
- Keep single-element controls simple.
- Follow established Nerio composition and export conventions.
- Preserve one semantic responsibility per component.

### MUST NOT

- Model anatomy through growing boolean and position-prop matrices when composition is clearer.
- Create compound APIs that provide no meaningful structural control.
- Add routing, fetching, permissions, persistence, analytics, business entities, or workflow policy to a Core primitive.

---

## 4. Progressive disclosure and state

### MUST

- Keep the minimal valid example short and production-correct.
- Require only information essential for semantics or behavior.
- Support an uncontrolled common path when the primitive supports it.
- Follow established controlled pairs such as `value/defaultValue/onValueChange`, `open/defaultOpen/onOpenChange`, and `pressed/defaultPressed/onPressedChange`.
- Present basic usage before variants, composition, controlled state, and escape hatches.

### MUST NOT

- Force consumers to manage state already supported internally by the primitive.
- Require providers or configuration objects without a system-level reason.
- Put advanced props in the default example.

---

## 5. Predictable conventions and types

### MUST

- Preserve shared prop meanings and current component-family size scales.
- Follow Base UI or native event naming.
- Keep Base UI and Nerio state attributes available for styling and testing.
- Merge consumer `className` values deterministically.
- Export discoverable public props types.
- Derive props from Base UI/native contracts and omit conflicts explicitly.
- Forward correctly typed refs and preserve event-detail types.
- Use discriminated unions when they materially prevent invalid content models.

### MUST NOT

- Introduce duplicate aliases without a compatibility requirement.
- Use `any` in a public contract.
- Hide ref, event, render, or element mismatches behind unsafe assertions.
- Add polymorphic machinery when Base UI `render` or an existing Nerio convention solves the case.

---

## 6. Tokens before local values

### MUST

- Follow the primitive → semantic → component token architecture in `DESIGN_SYSTEM.md`.
- Consume semantic or component aliases in component source.
- Keep primitive tokens immutable across theme, mode, and density selectors.
- Keep component styles compatible with supported themes, modes, and densities.
- Add semantic or component tokens only for reusable decisions and synchronize docs and metadata.
- Document any unavoidable local value as a technical exception.

### MUST NOT

- Add raw color values or palette-specific utilities to component source when a semantic contract applies.
- Duplicate an existing token or create one for a one-off cosmetic preference.
- Change maintainer-owned visual values inside an architecture, behavior, or accessibility task.

---

## 7. Separation of responsibilities

- Base UI owns established interaction behavior and accessibility.
- Nerio source owns composition, defaults, and public API.
- Component CSS, recipes, and utilities own visual variants and state styling.
- Semantic and component tokens own theme-wide and family-wide decisions.
- `@nerio/ui` remains the server-safe default entrypoint; interactive Base UI-backed components belong in `@nerio/ui/client`.

Agents MUST NOT duplicate primitive state solely for styling, hide behavior in undocumented utilities, add business logic to Core, create a new styling package without a proven cross-framework need, or add `use client` without an interaction requirement.

---

## 8. Predictable customization

Consider customization in this order:

1. Theme, mode, density, and token overrides
2. Existing variants, tones, emphasis levels, and sizes
3. Root `className`
4. Meaningful slot or part customization
5. Base UI `render` composition
6. Direct source editing

Public roots SHOULD accept `className`. Multi-part components SHOULD expose only meaningful `data-slot` hooks. Class merging and public DOM/state hooks MUST be deterministic.

Agents MUST NOT add props for isolated styling requests already solved by the sequence above, use `!important`, require deep or unstable selectors, or expose every internal wrapper as a public slot.

---

## 9. Source-first ownership and Core scope

### MUST

- Keep source-installed components readable without the registry runtime or docs website.
- Preserve supported behavior after source installation.
- Keep dependencies minimal, maintained, and justified.
- Keep Core domain-agnostic and independently useful.
- Keep package mode and source-install mode aligned within their documented boundaries.

### MUST NOT

- Add runtime dependencies on docs, catalog data, registry metadata, or the website.
- Introduce large abstractions to remove small harmless duplication.
- Add fintech-, crypto-, analytics-, SaaS-, or entity-specific business semantics to Core.
- Add dependencies for capabilities already supplied by the platform, Base UI, or current utilities.

---

## 10. Motion communicates state

Motion MUST explain state, hierarchy, continuity, or cause-and-effect. Prefer cancellable CSS transitions, shared duration/easing tokens, opacity and transform, Base UI enter/exit attributes, immediate input feedback, deterministic end states, and reduced-motion equivalents.

Agents MUST NOT add decorative looping motion, animate layout when a simpler property communicates the same change, add a JavaScript animation dependency for a reliable CSS transition, hide latency with animation, or change motion personality outside an approved visual-language task.

---

## 11. Visual restraint

Default surfaces remain neutral. Accent communicates action, state, selection, focus, or a restrained brand moment. Hierarchy begins with spacing, typography, alignment, layout, and contrast. Borders clarify boundaries; elevation represents actual layering. `DESIGN_SYSTEM.md` remains authoritative for approved values.

Agents MUST NOT add decorative gradients, add shadows to flat components only for prominence, create unnecessary nested surfaces, spread accent across broad neutral regions, or invent palette, spacing, typography, radius, border, elevation, density, motion, or icon-character decisions in a technical task.

---

## 12. Documentation and machine-readable alignment

A public component is incomplete until its contract is aligned across source, exports, `data/component-catalog.json`, `COMPONENTS.md`, registry metadata, docs, examples, CLI and MCP projections, fixtures, and tests.

Where applicable, documentation MUST include:

1. Purpose and intended use
2. Anatomy or composition model
3. Installation command
4. Minimal usage
5. Current variants, tones, emphasis levels, and sizes
6. Relevant interaction and visual states
7. Composition and controlled-state examples
8. Accessibility behavior and author responsibilities
9. Public API reference
10. Realistic examples using public imports
11. When to choose another component or keep logic in the application

Verify relevant default, hover, active, focus-visible, disabled, loading, invalid, read-only, selected/current/checked, open/closed, empty/populated, and indeterminate states.

Before declaring a public change complete, verify public exports and entrypoints, catalog and registry projections, types and refs, accessibility behavior, controlled/uncontrolled behavior, theme/mode/density behavior, source-install fixtures, docs examples, CLI/MCP projections, and repository checks.

## Definition of done

A change is complete only when:

- it preserves one reusable Core responsibility;
- the public API is small, predictable, typed, and compatible or explicitly migrated;
- Base UI behavior and accessibility are preserved;
- styles use approved token contracts;
- customization follows established escape hatches;
- source-install and package behavior remain coherent;
- docs and machine-readable projections match implementation;
- meaningful changed behavior is tested;
- no unnecessary dependency, abstraction, token, variant, prop, slot, wrapper, or client boundary was added;
- changed files, checks, and unresolved limitations are reported.

## Immediate rejection checklist

Reject or revise an implementation containing any of the following without an approved exception:

- interactive `div` or `span`;
- missing accessible name for an icon-only control;
- removed focus-visible treatment;
- visual-only variant without a stable contract;
- color-named public prop;
- boolean-prop anatomy;
- duplicated Base UI behavior;
- raw color or undocumented arbitrary value in component source;
- public `any` or unsafe ref/render/event assertion;
- `!important`;
- unnecessary dependency;
- silent breaking change or permanent duplicate compatibility API;
- product-specific business logic in Core;
- unsynchronized source, catalog, registry, docs, CLI, MCP, fixtures, or tests;
- missing docs or tests for a new public component.
