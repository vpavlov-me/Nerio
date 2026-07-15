# Nerio Core UI Best Practices for Coding Agents

## Status and scope

This document is normative for agent-authored changes to Nerio Core components, tokens, utilities, styles, registry metadata, CLI and MCP projections, examples, tests, documentation, and validation scripts.

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** define requirement strength.

This document complements the repository source-of-truth files. It does not replace `PROJECT.md`, `DESIGN_SYSTEM.md`, `COMPONENT_ARCHITECTURE.md`, `TIERING_AND_TEMPLATE_EVOLUTION.md`, `COMPONENTS.md`, or `data/component-catalog.json`.

A task may narrow scope, but it MUST NOT silently override an architecture or visual rule. When a task conflicts with a source-of-truth document, the agent MUST identify the conflict and either follow an explicitly approved migration or leave the conflicting part unimplemented and report it.

## Decision ownership

Every decision belongs to one of four ownership layers.

### Maintainer-owned visual decisions

The maintainer owns palette values, neutral temperature, accent frequency, typography character, spacing rhythm, radii, border and surface character, elevation character, density character, motion personality and values, icon character, signature details, and final visual hierarchy.

Agents MUST implement approved values through shared contracts. They MUST NOT invent a local visual direction.

### Core implementation responsibility

Core owns reusable semantic primitives, accessibility, interaction behavior, stable public APIs, tokens, source installation, package exports, tests, registry metadata, docs, and tooling needed to distribute those primitives.

### Consumer-owned composition

Applications own routing, fetching, permissions, persistence policy, analytics, business entities, product workflows, product-specific responsive composition, and domain data.

### Nerio Pro responsibility

Pro owns reusable product-ready workflows, advanced compositions, domain-specific patterns, templates, premium themes, and higher-level systems that should not expand Core primitives.

## Required operating procedure

Before editing, an agent MUST:

1. Read the nearest `AGENTS.md`.
2. Read `PROJECT.md`, `DESIGN_SYSTEM.md`, `docs/design-principles.md`, `COMPONENT_ARCHITECTURE.md`, `TIERING_AND_TEMPLATE_EVOLUTION.md`, and this document when the change affects their scope.
3. Check `COMPONENTS.md` and `data/component-catalog.json` before adding, moving, promoting, or changing a public component contract.
4. Inspect at least one analogous Nerio implementation and reuse established package, export, slot, style, test, registry, docs, CLI, and MCP conventions.
5. Inspect the underlying Base UI primitive before changing interactive behavior.
6. Identify existing semantic and component tokens before adding a local value or new token.
7. Determine whether the change affects public API, source-install output, registry metadata, package exports, docs examples, or release compatibility.
8. State the smallest complete vertical slice and the exact validation commands before implementation.

During implementation, an agent MUST prefer this decision order:

1. Reuse an existing component unchanged.
2. Compose existing components.
3. Customize through semantic or component tokens.
4. Use the established root `className`, meaningful slots, or Base UI `render` composition.
5. Extend an existing component only when its semantic responsibility remains unchanged.
6. Add a new Core component only when it represents a reusable, domain-agnostic interface concept.
7. Add a dependency only when the platform, Base UI, and existing Nerio utilities cannot satisfy the requirement.

After editing, an agent MUST run and report the repository checks relevant to the changed surface. It MUST identify checks that could not run and MUST NOT claim completion when a required check is failing without explaining the failure.

---

## 1. Semantic APIs

### Required

- Public props MUST describe intent, role, state, interaction, or a stable component mode.
- The same concept MUST use the same term across components.
- Status-bearing components SHOULD use `tone` when they own semantic feedback such as `neutral`, `accent`, `info`, `success`, `warning`, or `danger`.
- `variant` MAY represent an established component-specific hierarchy or mode.
- `appearance` MAY exist only when visual treatment is a validated independent axis rather than a synonym for semantic intent.
- `size` MUST exist only when the component has a real, reusable size contract.
- A component MUST expose only the axes it needs. Agents MUST NOT standardize every component on `variant`, `tone`, `appearance`, and `size` simultaneously.
- Existing public names MUST remain compatible unless a task explicitly includes migration and deprecation work.
- Current compatibility contracts MUST be respected. For example, Button currently uses canonical `primary`, `secondary`, `outline`, `ghost`, `link`, and `danger` variants, while deprecated aliases remain migration-only; Badge uses `tone` and retains its documented deprecated alias until the approved removal point.

### Prohibited

- Public APIs MUST NOT use product color names such as `purple`, `red`, `blue`, or `gray`.
- Agents MUST NOT make implementation details or one-off visual preferences the primary public meaning.
- Agents MUST NOT create component-specific synonyms for established state or event concepts.
- Agents MUST NOT copy a mixed legacy axis into a new component without reviewing whether intent and appearance should remain separate.
- Agents MUST NOT perform opportunistic renames inside an unrelated task.

---

## 2. Public API admission rule

Before adding a prop, variant, tone, appearance, size, state, event, or slot, the agent MUST answer all applicable questions:

1. Does it represent a stable semantic, behavioral, or structural distinction?
2. Does it have multiple independent product use cases?
3. Can existing composition solve it more clearly?
4. Can a semantic or component token solve it without expanding API?
5. Can root `className`, an existing slot, or source ownership solve it?
6. Does it keep business and product responsibility outside Core?
7. Can it be explained without one product vertical or one docs example?
8. Does it preserve accessibility and the server-safe/client entrypoint contract?
9. Is its maintenance, documentation, testing, and migration cost justified?

Preferred alternatives, in order:

1. Existing component composition
2. Semantic or component token
3. Root `className` or direct source ownership
4. Existing meaningful slot or Base UI `render`
5. New slot
6. New semantic API as the last option

The agent MUST document the reasoning in the issue or pull request whenever a new public contract is introduced.

---

## 3. Accessibility invariants

### Required

- Interactive components MUST use the appropriate Base UI primitive or native semantic HTML element.
- Base UI keyboard behavior, focus management and restoration, ARIA attributes, roles, event details, state attributes, portal behavior, and dismissal behavior MUST be preserved.
- Components using `render` MUST preserve the rendered element's correct semantics, merge all required props, and compose callback and object refs.
- Every icon-only control MUST have an accessible name.
- Every interactive component MUST have a visible `focus-visible` treatment defined by shared contracts.
- Form controls MUST preserve label, description, error, required, invalid, read-only, and disabled relationships where relevant.
- Disabled and loading behavior MUST prevent unintended interaction and expose truthful semantic state.
- Status, validation, selection, and destructive meaning MUST remain understandable without color alone.
- Motion MUST respect `prefers-reduced-motion`.
- Relevant components MUST consider forced colors, zoom and reflow, RTL, localization, touch input, safe areas, and dynamic viewport behavior.
- Keyboard and focus behavior MUST be covered by focused tests when relevant.

### Prohibited

- Agents MUST NOT replace an accessible primitive with an interactive `div` or `span`.
- Agents MUST NOT remove focus indication without an accessible replacement defined by the system.
- Agents MUST NOT recreate a state machine already supplied by Base UI.
- Agents MUST NOT override protected accessibility attributes with consumer props.
- Agents MUST NOT change the expected rendered element through `render` unless semantics remain correct.
- Agents MUST NOT create invisible focus targets, duplicated interactive trees, or hidden DOM copies solely for responsive presentation.

---

## 4. Composition with a complexity budget

### Required

- Compound parts SHOULD be used when consumers need to omit, reorder, replace, or independently customize meaningful structural regions.
- Single-element controls SHOULD remain simple components.
- Children and explicit parts SHOULD express structural content.
- Common ergonomic props MAY exist when they remove repeated boilerplate without hiding anatomy, semantics, or behavior.
- Existing Nerio export conventions MUST be followed. A new component MUST NOT introduce a new namespace or dot-notation convention by itself.
- Shared visual implementation MUST be extracted through tokens, internal helpers, or family contracts rather than by merging unrelated public responsibilities.

### Prohibited

- Agents MUST NOT model anatomy through a growing matrix of props such as `showIcon`, `showDescription`, `showFooter`, `hasAction`, or `iconPosition` when composition expresses the structure more clearly.
- Agents MUST NOT split a simple component into compound parts when consumers gain no meaningful control.
- Agents MUST NOT create deeply nested composition for a simple visual difference.
- Agents MUST NOT make a component impersonate several semantic components through mode props.
- Agents MUST NOT use fragile child cloning when explicit composition or the Base UI contract provides a safer option.

---

## 5. Progressive disclosure

### Required

- The minimal valid example MUST be short, useful, and compile against public imports.
- Required props MUST be limited to information essential for semantics or behavior.
- Stateful components SHOULD be uncontrolled by default when the underlying primitive supports a useful uncontrolled mode.
- Controlled state MUST follow established pairs such as:
  - `value`, `defaultValue`, `onValueChange`
  - `open`, `defaultOpen`, `onOpenChange`
  - `pressed`, `defaultPressed`, `onPressedChange`
  - `checked`, `defaultChecked`, `onCheckedChange`
- Advanced customization MUST remain optional.
- Documentation MUST present minimal usage before variants, states, composition, controlled state, and escape hatches.

### Prohibited

- Agents MUST NOT require consumers to manage state for a standard use case already supported by the primitive.
- Agents MUST NOT require a provider, context, or configuration object without a system-level reason.
- Agents MUST NOT put advanced props into the default example.
- Agents MUST NOT expose two public ways to express the same behavior without a compatibility requirement.

---

## 6. Predictable conventions

### Required

- Shared prop names MUST retain shared meanings.
- Event names SHOULD follow the Base UI or native platform convention.
- Base UI state attributes MUST remain available for styling, testing, and source customization.
- Public state hooks SHOULD use deliberate `data-slot`, `data-state`, `data-variant`, `data-tone`, `data-size`, and other truthful semantic attributes where relevant.
- Consumer `className` values MUST merge deterministically with component styles.
- Existing behavior MUST remain backward compatible unless the task explicitly authorizes a breaking migration.
- Server-safe components and utilities MUST remain available from `@nerio/ui`; interactive Base UI-backed components MUST remain in `@nerio/ui/client`.

### Prohibited

- Agents MUST NOT introduce aliases such as `isDisabled` beside `disabled`, or `onChange` beside an established `onValueChange`, without a compatibility requirement.
- Agents MUST NOT add a size, tone, variant, slot, or mode solely for one docs example.
- Agents MUST NOT make the same prop mean different things across related component families.
- Agents MUST NOT add `use client` to a server-safe surface without an actual interaction requirement.

---

## 7. Type safety and public contracts

### Required

- TypeScript strictness MUST be preserved.
- Every public component MUST export a discoverable props type following the repository convention.
- Props SHOULD derive from the underlying Base UI primitive or native element contract and established Nerio types.
- Conflicting inherited props MUST be omitted explicitly.
- Refs MUST be forwarded and correctly typed where the public root supports a ref.
- Event details and state types from Base UI MUST be preserved rather than weakened.
- Public variant or tone unions SHOULD have one canonical definition rather than duplicated string literals.
- Package and source-installed types MUST describe the same contract.

### Prohibited

- Agents MUST NOT introduce `any` into a public contract.
- Type assertions MUST NOT hide an unresolved element, ref, or event mismatch.
- Agents MUST NOT add generic polymorphic machinery when Base UI `render` or an existing Nerio convention solves the use case.
- Internal implementation details MUST NOT leak accidentally into the public API.
- Agents MUST NOT claim type safety using tests that compile only inside monorepo path aliases while source-install fixtures fail.

---

## 8. Token architecture and local values

### Required

- Primitive tokens remain immutable raw foundation values across theme, mode, and density selectors.
- Component source MUST consume semantic or component aliases rather than primitive token variables or raw palette values.
- Themes and modes remap semantic color contracts.
- Density remaps semantic density aliases and component contracts rather than primitive scales.
- A semantic token MUST represent a reusable intent shared across components or product contexts.
- A component alias MUST represent a stable local component contract that needs independent mapping or documentation.
- New public tokens MUST be added to `packages/tokens/src/styles.css`, documented, and reflected in registry metadata where applicable.
- Registry `requiredTokens`, docs token chips, and catalog projections MUST reference real public `--n-*` variables.
- Deprecated or renamed public tokens MUST retain an intentional migration path until the approved removal point.
- Local CSS values MAY exist only for a documented technical constraint such as intrinsic geometry that is not a reusable design decision.

### Prohibited

- Agents MUST NOT add raw hex, RGB, HSL, or OKLCH values to component source.
- Agents MUST NOT consume primitive palette or spacing tokens directly from component styles.
- Agents MUST NOT introduce component tokens for isolated cosmetic preferences.
- Agents MUST NOT duplicate an existing token under a new name.
- Agents MUST NOT redefine primitive scales inside theme, mode, or density selectors.
- Agents MUST NOT add a component prop when a token override is the correct customization mechanism.

---

## 9. Separation of responsibilities

### Required

- Base UI primitives own interaction behavior and accessibility.
- Nerio component source owns composition, defaults, public API, and integration with the primitive.
- Component styles own visual states and family-specific presentation.
- Semantic and component tokens own shared appearance contracts.
- `data/component-catalog.json` owns the canonical machine-readable component inventory.
- Registry metadata projects installation and component contract data.
- CLI and MCP consume the aligned registry contract rather than inventing parallel component knowledge.
- These layers MAY remain co-located when source readability improves, but responsibility boundaries MUST remain explicit.

### Prohibited

- Agents MUST NOT duplicate primitive state in React solely to style a data attribute already supplied by Base UI.
- Agents MUST NOT place product or business logic inside Core.
- Agents MUST NOT create a separate framework-agnostic styling package without an approved cross-framework requirement.
- Agents MUST NOT hide behavior inside undocumented styling helpers.
- Agents MUST NOT allow docs, catalog, registry, CLI, MCP, and source exports to describe different public contracts.

---

## 10. Predictable customization

Customization MUST be supported in this order:

1. Semantic or component token overrides
2. Existing semantic variants, tones, modes, and sizes
3. Root `className`
4. Meaningful slot or part customization for multi-part components
5. Base UI `render` composition where supported
6. Direct editing of source-installed files

### Required

- Every public rendered root SHOULD accept `className` unless an established equivalent exists.
- Multi-part components SHOULD expose only meaningful parts using the existing Nerio slot pattern.
- Custom classes MUST merge in a documented deterministic order.
- Escape hatches MUST preserve accessibility, state behavior, refs, and source-install compatibility.
- Direct source editing MUST remain understandable without registry runtime knowledge.

### Prohibited

- Agents MUST NOT add a public prop for an isolated styling request that an existing escape hatch already solves.
- Agents MUST NOT use `!important` in component source.
- Agents MUST NOT require deep selectors, unstable DOM traversal, or global element selectors for normal customization.
- Agents MUST NOT expose every internal wrapper as a public slot.
- Agents MUST NOT promise customization through undocumented internal DOM structure.

---

## 11. Source-first ownership and package boundaries

### Required

- Installed source MUST be readable and usable without the documentation site or registry runtime.
- A source-installed component MUST compile with its declared files, dependencies, tokens, and adapters outside the monorepo.
- Package usage and source installation MUST preserve the same documented semantics and API.
- Dependencies MUST be minimal, maintained, and justified by capability Nerio should not own.
- Shared helpers MUST improve consistency while remaining easy to locate from component source.
- Components that require Base UI MUST declare the correct primitive dependency in registry metadata.
- Static components and utilities MUST preserve the server-safe entrypoint; interactive components MUST preserve the client entrypoint.

### Prohibited

- Agents MUST NOT add runtime dependencies on docs, website data, registry metadata, or MCP.
- Agents MUST NOT introduce a large abstraction to remove small harmless duplication.
- Agents MUST NOT add fintech-, crypto-, analytics-, AI-, or SaaS-specific business semantics to Core primitives.
- Agents MUST NOT add a dependency when the platform, Base UI, or an existing utility provides the capability.
- Core MUST NOT import from Pro.

---

## 12. Responsive layout, direction, and layering

### Required

- Components MUST remain usable in narrow containers and at supported zoom levels.
- Content wrapping, truncation, and overflow ownership MUST be explicit.
- Component-level responsiveness SHOULD depend on the component's available space when viewport assumptions are not required.
- Logical properties SHOULD be preferred where they improve RTL correctness.
- Portals, backdrops, scroll locking, dismissal, focus restoration, safe areas, and z-index layers MUST follow the established overlay family contracts.
- Sticky or fixed positioning MUST have a documented behavioral reason and a clear containing context.
- Long content and localization stress MUST be considered for public layouts and examples.
- Responsive variants MUST avoid duplicated interactive trees and conflicting focus order.

### Prohibited

- Agents MUST NOT hide essential content at a breakpoint without an accessible alternative.
- Agents MUST NOT make a primitive own application-shell safe-area responsibilities unless its documented contract requires them.
- Agents MUST NOT create viewport-specific product composition inside a domain-agnostic primitive.
- Agents MUST NOT add arbitrary z-index values outside the shared layering contract.

---

## 13. Motion communicates state

### Required

- Motion MUST explain state, hierarchy, continuity, or cause-and-effect.
- CSS transitions SHOULD be the default for component state changes.
- Base UI attributes such as `data-starting-style` and `data-ending-style` SHOULD drive enter and exit transitions where supported.
- Motion MUST use shared duration and easing tokens.
- Enter and exit states MUST use a consistent coordinate system and deterministic end state.
- Opacity and transform SHOULD be preferred when they communicate the interaction adequately.
- Input feedback MUST feel immediate and MUST NOT wait for decorative animation.
- Reduced-motion behavior MUST preserve meaning without unnecessary movement.

### Prohibited

- Agents MUST NOT add decorative looping motion to Core defaults.
- Agents MUST NOT animate layout properties without a documented need.
- Agents MUST NOT add a JavaScript animation dependency for a transition CSS expresses reliably.
- Agents MUST NOT use motion to hide slow state updates.
- Essential information MUST NOT be communicated only through motion.

---

## 14. Visual restraint

### Required

- Default surfaces SHOULD remain neutral.
- Accent color MUST communicate action, state, selection, focus, or an approved brand moment.
- Hierarchy SHOULD begin with spacing, typography, alignment, layout, and contrast.
- Borders SHOULD clarify grouping, boundaries, or interactive affordance.
- Elevation MAY communicate real layering only where the visual source of truth defines it.
- Component defaults MUST remain coherent across supported themes, modes, and densities.
- Agents MUST reuse approved visual tokens and family contracts rather than invent local values.

### Prohibited

- Agents MUST NOT add decorative gradients to Core component defaults.
- Agents MUST NOT add shadows or glows to flat components solely for prominence.
- Agents MUST NOT create nested card surfaces where spacing and grouping are sufficient.
- Agents MUST NOT spread accent color across neutral regions without semantic reason.
- Agents MUST NOT change visual token values, component geometry, or motion personality in an architecture-only task.

---

## 15. Documentation, catalog, registry, CLI, and MCP readiness

A component change is incomplete until its public contract is represented consistently in all applicable projections.

### Required component documentation

Every public component MUST include, where applicable:

1. Purpose and intended use
2. Guidance on when to choose another component
3. Anatomy or composition model
4. Installation or registry command
5. Minimal usage
6. Semantic variants, tones, sizes, and modes that actually exist
7. Relevant interactive and visual states
8. Composition and controlled-state examples
9. Accessibility behavior and author responsibilities
10. Public API reference
11. Realistic examples using public imports
12. Core, Pro, and consumer-owned responsibility boundaries

### Required state coverage

Agents MUST document and verify relevant states, including:

- default
- hover
- active or pressed
- focus-visible
- selected, current, or checked
- disabled
- loading
- invalid or error
- read-only
- open and closed
- empty, populated, or indeterminate where applicable

Only states relevant to the component are required.

### Projection rules

- Update `data/component-catalog.json` first when the canonical component contract changes.
- Update `COMPONENTS.md`, public exports, registry items, docs metadata, CLI fixtures, MCP fixtures, and release fixtures in the same vertical slice when applicable.
- Public examples MUST compile through the docs example fixture.
- Docs MUST use public imports and MUST NOT present pseudo-code as copy-paste-complete code.
- Registry `requiredTokens` and docs token chips MUST reference real public variables.
- `llms.txt` and agent-facing summaries MUST not claim unsupported props, states, packages, or tiers.

---

## 16. Testing and review strategy

Use the smallest test layer that proves the public contract, while preserving broader release gates.

### Contract tests

Cover public props, refs, semantics, state, controlled and uncontrolled behavior, events, and source-install behavior.

### Accessibility tests

Cover names, roles, keyboard interaction, focus behavior, labels and descriptions, disabled and invalid semantics, announcements, and automated accessibility assertions where useful.

### Browser tests

Cover real positioning, overflow, portal lifecycle, focus restoration, responsive behavior, RTL, safe areas, dynamic viewport behavior, and interactions that DOM-unit tests cannot prove.

### Visual regression tests

Protect approved visual output only after the corresponding visual language is intentionally approved. They MUST NOT freeze temporary pixel values or incidental DOM structure.

### Review checklist

Every affected component or family MUST be reviewed for:

- semantic responsibility and tier boundary
- API necessity and migration impact
- composition alternatives
- token layer and local literals
- anatomy and native semantics
- relevant state matrix
- accessibility and focus
- responsive, RTL, localization, and overflow behavior
- motion and reduced motion
- server/client entrypoint
- package and source installation
- docs, catalog, registry, CLI, and MCP alignment
- visual-language compliance without local invention

---

## Definition of done

A change is complete only when all applicable conditions are true:

- The component solves one reusable Core responsibility.
- The public API is semantic, small, predictable, and fully typed.
- Base UI or native behavior and accessibility are preserved.
- Component source consumes semantic or component aliases only.
- Customization uses established escape hatches.
- Server/client package boundaries remain correct.
- Package and source-install contracts both work.
- Catalog, exports, registry, docs, CLI, MCP, tests, and examples agree.
- Tests cover the meaningful behavior introduced or changed.
- Existing public APIs remain compatible, or migration guidance and deprecation are included.
- No unnecessary dependency, abstraction, token, variant, wrapper, slot, or runtime axis was added.
- The agent reports changed files, validation commands and results, migrations, and unresolved limitations.

## Immediate rejection checklist

Reject or revise an implementation containing any of the following unless an approved source-of-truth migration explicitly requires it:

- interactive `div` or `span`
- missing accessible name for an icon-only control
- removed or hidden focus-visible treatment
- color-named public props
- one-off visual props or variants
- boolean-prop anatomy
- duplicated Base UI behavior
- lost or incorrectly typed refs
- raw colors or primitive tokens in component source
- undocumented arbitrary values
- `any` in a public API
- `!important`
- arbitrary z-index or motion values
- unnecessary dependency or abstraction
- silent breaking change
- product-specific business logic in Core
- server-safe/client entrypoint regression
- catalog, registry, docs, CLI, or MCP drift
- missing docs or tests for a new public contract

## Required validation baseline

Run the focused checks for the changed surface and report exact results. The default repository baseline is:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm validate:catalog
pnpm validate:tokens
pnpm validate:runtime-axes
pnpm validate:docs
pnpm test:docs-examples
pnpm test:ui
pnpm test:a11y
pnpm test:cli
pnpm test:mcp
pnpm build
```

Also run focused invalid-fixture tests when catalog, token, runtime-axis, or release validation changes, and run `pnpm validate:release`, `pnpm test:browser`, or `pnpm pack:check` when the affected contract requires them.
