# Nerio Core UI implementation best practices

## Status and purpose

This document is the canonical implementation and review standard for Nerio Core UI. It applies to
components, tokens, styles, examples, tests, registry metadata, source installation, documentation,
and agent-authored changes.

The keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** describe requirement
strength. Existing public contracts remain authoritative until a separately approved migration
changes them. These rules guide implementation; they do not silently redesign the current system.

The governing principle is:

> **Rich implementation, restrained API.**

A Core primitive MAY contain sophisticated accessibility, state, responsive, token, localization,
and browser logic internally. Its public responsibility, props, variants, slots, and product
knowledge MUST remain deliberately small.

Read this document with `PROJECT.md`, `DECISIONS.md`, `DESIGN_SYSTEM.md`,
`DESIGN_PRINCIPLES.md`, `COMPONENT_ARCHITECTURE.md`, and
`TIERING_AND_TEMPLATE_EVOLUTION.md`. The more specific accepted source governs its declared scope.
If authoritative sources conflict, implementation MUST pause until the conflict is resolved in the
source documents.

## Ownership model

Every UI decision MUST have one owner.

### 1. Maintainer visual decisions

The maintainer owns the approved visual language. Contributors and agents MUST NOT invent or tune
these decisions locally:

- palette values and neutral temperature;
- accent frequency and saturation;
- spacing scale and visual rhythm;
- typography families, sizes, weights, tracking, and hierarchy;
- radius character;
- border and surface character;
- shadow and elevation character;
- density character;
- motion personality, durations, and easing values;
- icon visual character;
- intentional signature details;
- final visual hierarchy and composition.

Technical work MAY implement an approved visual decision through tokens and shared rules. It MUST
NOT choose new visual values under the label of cleanup, accessibility, consistency, or best
practice. A proposed visual-language change requires explicit maintainer approval and its own scope.

### 2. Core implementation best practices

Core owns reusable, domain-agnostic semantics and behavior: native or Base UI interaction
contracts, accessible naming, keyboard behavior, focus management, typed refs and events, stable
state hooks, token consumption, resilient layout, supported runtime axes, source installation, and
public documentation.

Core MAY be internally sophisticated when standards and cross-product reuse require it. That
sophistication MUST NOT leak product policy into the public API.

### 3. Consumer-owned composition

The consuming application owns routing, fetching, permissions, analytics, persistence policy,
business entities, product-specific copy, workflow orchestration, and page composition. Consumers
MAY compose Core primitives, override public tokens, apply `className`, or edit installed source.
Core MUST NOT absorb application policy only to shorten one consumer example.

### 4. Nerio Pro responsibility

Nerio Pro owns reusable product-ready compositions, advanced workflows, domain-aware patterns, and
opinionated solutions that combine Core primitives. Pro MAY depend on Core; Core MUST NOT depend on
Pro. Templates MAY combine Core, Pro, and template-local code.

## Primitive responsibility boundaries

`core-platform-primitive-coverage.md` is the accepted Core 1.0 decision for native capability
coverage. Apply that matrix before classifying a new platform wrapper or composite as a future Core
candidate. Do not reopen a covered or deferred decision inside an implementation issue without an
explicit synchronized product-decision change.

Before extending Core, classify the capability in this order:

1. **Existing Core primitive:** the capability preserves the primitive's semantic responsibility,
   interaction model, content model, accessibility contract, and likely evolution.
2. **Composition of existing primitives:** the outcome is achieved by arranging existing parts
   without hiding product policy inside one primitive.
3. **Future Core candidate:** the capability is a small, domain-agnostic entity with repeated,
   independent use and a stable accessibility contract, but requires explicit catalog and roadmap
   approval.
4. **Nerio Pro:** the capability is a reusable product solution, advanced composition, or workflow.
5. **Consuming application:** the capability is application policy, data, routing, permissions,
   analytics, persistence, or a one-product composition.

When evidence is incomplete, the implementation SHOULD remain consumer-owned or template-local.
Uncertainty is not evidence for a new Core abstraction.

| Core boundary                                    | Core owns                                                                            | Core does not own                                                                                             |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `Card` vs KPI Card                               | Generic surface/link anatomy and content regions                                     | Metric comparison, trend rules, chart context, period selection, or KPI actions                               |
| `Table` vs DataGrid                              | Native tabular semantics and resilient static presentation                           | Sorting state, filtering, virtualization, column settings, saved views, or bulk workflows                     |
| Sidebar Primitive vs AppSidebar/AppShell         | Layout regions, physical side, collapse state, and accessible toggles                | Navigation data, routing, permissions, persistence, workspace switching, or full app layout                   |
| Command Primitive vs GlobalSearch/CommandPalette | Accessible query input, result navigation, selection, and empty/loading presentation | Fetching, ranking, routing, global shortcuts, history, analytics, permissions, or a complete palette workflow |
| `Item` vs entity rows                            | Generic content, media, description, metadata, and actions anatomy                   | User, invoice, asset, transaction, or notification data models and business actions                           |
| `Toast` vs notification center/job tracker       | Transient feedback lifecycle, actions, dismissal, and announcements                  | Persistent history, read state, background-job orchestration, retries, or inbox policy                        |
| Empty State vs recovery workflow                 | Generic empty presentation, media, message, and actions                              | Permission recovery, onboarding state machines, data repair, or product-specific next-step logic              |
| `Badge` vs business rules/counting               | Concise status, metadata, or classification                                          | Deriving status, notification totals, overflow rules, unread policy, or entity-specific semantics             |

## Public API admission rule

A proposal to add a prop, variant, tone, emphasis, size, state, slot, event, or imperative handle
MUST document why it is necessary. It SHOULD be admitted only when every relevant condition is true:

1. It represents a stable semantic or behavioral distinction, not a one-off visual preference.
2. It has multiple independent product use cases.
3. Existing composition cannot express it more clearly.
4. Shared, semantic, or component tokens cannot express it.
5. It does not introduce product or business responsibility into Core.
6. It can be explained without referring to one product vertical.
7. It preserves accessibility and the server/client entrypoint boundary.
8. Its long-term maintenance, compatibility, and migration cost is justified.

Reviewers MUST evaluate responsibility and semantic necessity, not an arbitrary prop-count limit.
A small but confused API is still incorrect; a larger compound API MAY be correct when each part
represents meaningful anatomy.

Preferred alternatives MUST be considered in this order:

1. existing composition;
2. semantic or component token;
3. consumer `className` or source ownership;
4. a new meaningful slot;
5. a new semantic variant or prop as the last option.

A proposal rejected by this rule SHOULD stay in the application, a template, or Pro. A proposal
accepted by this rule still requires synchronized source, types, catalog, registry, docs, fixtures,
tests, and migration evidence where applicable.

## Styling decision hierarchy

Every visual implementation decision MUST be classified before it is encoded.

### System rule

A system rule is shared across most of Core: focus treatment, disabled treatment, border hierarchy,
control geometry, typography roles, or motion families. It MUST be expressed through the shared
token or utility contract rather than repeated component literals.

### Family rule

A family rule is shared by related components: form-control heights, overlay surfaces, menu/item
spacing, data-row density, or status presentation. It SHOULD use semantic or family/component
tokens and a shared recipe when that makes the contract clearer.

### Component exception

A component exception exists only because of unique anatomy or behavior: Sheet close placement,
Toast stack offset, Tabs indicator geometry, or Avatar cropping. The source or governing document
MUST record the reason. An exception MUST NOT duplicate a system or family decision.

Local values MAY be used for browser normalization, intrinsic geometry, mathematical constants,
or one-off structural mechanics when no public customization decision exists. Their technical
reason MUST be apparent from the property, nearby code, or a concise comment. Local values MUST NOT
quietly establish palette, typography, spacing, radius, elevation, density, or motion personality.

## Token usage

Nerio uses **primitive → semantic → component** token layering.

- Primitive tokens hold raw scales and values. They MUST remain immutable across `data-theme`,
  `data-mode`, and `data-density` selectors.
- Semantic tokens express reusable meaning such as surface, text, border, action, status, focus,
  spacing, and typography roles. Runtime axes SHOULD remap semantic contracts.
- Component tokens expose a component or family customization contract when a semantic token is too
  broad or the decision is independently useful to consumers.

Component source MUST consume semantic or component aliases, not raw palette tokens. A new semantic
token is justified when multiple families need the same meaning. A new component token is justified
when the value is part of that component's stable customization surface or isolates a unique
mechanic. A token MUST NOT be created for an incidental literal with no reuse or customization need.

Theme changes personality, mode changes light/dark behavior, and density changes spacing/control
density. These axes MUST remap contracts through CSS variables without rebuilding source. Custom
themes MUST use the same semantic and component contracts. Typography, radius, motion, spacing,
shadow/elevation, and contrast MAY be customized through tokens but MUST NOT become new runtime axes
without an explicit architecture decision.

Token renames or removals MUST include an explicit migration path. During a compatibility period,
deprecated aliases SHOULD resolve to the canonical token without creating two competing public
concepts. Registry `requiredTokens` and public token chips MUST refer to real public CSS variables.

Good placement:

```css
/* A family contract remapped by density. */
--n-input-height-md: var(--n-control-height-md);
```

Poor placement:

```css
/* A product preference disguised as a component implementation detail. */
.n-input {
  height: 37px;
  border-color: #7c3aed;
}
```

Visual customization SHOULD use token overrides, existing variants, `className`, or source
ownership before adding component props.

## Tailwind implementation and distribution

Tailwind CSS v4 is Nerio Core's style authoring engine. The accepted implementation details live in
[`docs/tailwind-styling-contract.md`](./tailwind-styling-contract.md); this section records the
review rules without duplicating that contract.

- Nerio `--n-*` variables remain the canonical primitive, semantic, and component value layer.
  Tailwind MUST NOT introduce a parallel palette or token source.
- Core recipes MUST use complete, statically detectable utility strings. They MUST NOT construct
  utility fragments dynamically or use raw palette utilities for Core semantics.
- Tailwind-first roots MUST use the shared conflict-aware merge helper so a consumer `className`
  deterministically replaces conflicting utilities while preserving non-conflicting state rules.
- Base UI and Nerio `data-*` attributes are the supported state-variant contract. Arbitrary
  selectors MUST target stable attributes and MUST NOT depend on ambiguous BEM class parsing.
- The public `@theme inline` bridge exposes stable foundation and semantic contracts only.
  Component-internal `--n-*` variables remain static component-recipe references.
- Package consumers MUST register installed UI source with `@source`; source-installed components
  are detected from the consumer project and must include the copied bridge and merge helper.
- Consumers own Tailwind Preflight. Nerio's residual CSS is limited to the documented keyframes and
  scoped no-Preflight compatibility rules. A new residual category requires an architecture decision
  and package/source-install evidence.
- Package and source-install modes MUST produce equivalent component behavior and styling. Registry,
  CLI, MCP, docs, fixtures, and packed-consumer evidence MUST describe the same setup.

## Component anatomy and composition

### Semantics and primitives

- Components MUST use native semantic HTML first when the platform supplies the required semantics
  and behavior.
- Interactive patterns without sufficient native behavior MUST use the appropriate Base UI
  primitive. Core MUST NOT recreate an established Base UI state machine.
- ARIA MUST supplement semantics, not replace a suitable native element.
- Production markup MUST NOT contain a clickable `div` or `span` where a button or link is correct.

### Simple and compound APIs

A single high-level API is preferable when the component has one stable content model, consumers do
not need to reorder or omit internal regions, and the minimal path would otherwise become verbose.
Compound composition is preferable when regions are meaningful, independently optional,
reorderable, replaceable, or independently customizable. Compound parts MUST reflect semantic
anatomy, not every internal wrapper.

### Native props, refs, and render composition

- Public roots SHOULD inherit applicable native or Base UI props and MUST omit conflicts explicitly.
- Public roots MUST forward a correctly typed ref to the documented semantic node.
- `render` composition MUST preserve required primitive props, protected accessibility attributes,
  consumer props, event behavior, and both the consumer-provided and forwarded refs.
- Composed refs SHOULD use the shared `composeRefs` utility. Unsafe assertions MUST NOT hide a
  public element or ref mismatch.
- Consumers MUST choose a replacement element with correct semantics.

### State ownership

Interactive primitives SHOULD support the uncontrolled common path and the established controlled
pair when Base UI supports both, such as `value/defaultValue/onValueChange` or
`open/defaultOpen/onOpenChange`. One owner MUST remain the source of truth for each state. A
component MUST NOT mirror controlled state into a second unsynchronized store.

### Stable hooks and DOM integrity

- Meaningful public anatomy MUST expose stable `data-slot` values.
- Base UI `data-state` attributes and Nerio semantic state hooks MUST remain available for styling
  and testing.
- Public state hooks MUST describe truth, not merely appearance.
- Components SHOULD avoid fragile child cloning. When cloning is necessary for a bounded contract,
  types, refs, consumer attributes, and errors MUST be explicit and tested.
- Components MUST NOT duplicate hidden interactive trees to solve responsiveness.
- Hidden or inert content MUST NOT leave invisible focus targets in the tab sequence.
- Layout primitives MUST NOT accept business-data props that turn them into product components.

### Entrypoints

Static components and utilities MUST remain available from the server-safe `@nerio-ui/ui`
entrypoint. Interactive Base UI-backed components belong in `@nerio-ui/ui/client`. `use client` MUST
be added only when the implementation actually requires client interaction.

## Universal state and accessibility baseline

Every applicable review MUST consider this state matrix:

- default;
- hover;
- active or pressed;
- focus-visible;
- selected, current, or checked;
- disabled;
- loading;
- invalid or error;
- read-only;
- empty or indeterminate where relevant.

Not every component exposes every state. Review notes SHOULD mark a state not applicable rather
than inventing an API to satisfy the matrix.

### Required behavior and evidence

- Interactive elements MUST have an accessible name. Descriptions and errors MUST be associated
  with the correct control.
- Keyboard interaction MUST follow native behavior or the corresponding WAI-ARIA Authoring
  Practices convention. Focus and selection MUST remain distinguishable.
- Modal and composite widgets MUST manage focus deliberately and restore it to a logical target.
- Focus MUST remain visible and MUST NOT be obscured by author-created sticky or overlay content.
- Pointer targets SHOULD provide a usable hit area without changing semantics or creating
  overlapping targets. Touch and pointer input MUST not weaken keyboard operation.
- State, validation, and urgency MUST NOT be communicated by color alone.
- Live announcements MUST be concise. High urgency MUST be reserved for genuinely urgent changes;
  routine updates SHOULD use polite announcements or no live region.
- Native disabled, read-only, required, and invalid semantics SHOULD be used when applicable.
- Forced-colors behavior MUST preserve structure, state, and focus.
- Motion MUST respect `prefers-reduced-motion`; essential information MUST remain available without
  animation.
- Content MUST survive zoom, text resizing, reflow, long localized strings, and narrow containers
  without losing information or operation.
- Direction-sensitive layout and keyboard behavior MUST be verified in RTL where applicable.
- Components that own viewport edges MUST define dynamic viewport and safe-area behavior. Otherwise
  safe-area responsibility remains with the application shell.

Automated axe coverage is evidence, not proof of accessibility. Manual keyboard and browser-level
evidence remain required for behavior that DOM assertions cannot establish.

## Responsive layout and layering

- Components MUST be resilient at narrow widths before desktop enhancements are added.
- Container-owned components SHOULD respond to their actual container when viewport breakpoints do
  not represent the constraint.
- Content SHOULD wrap by default. Truncation MUST be intentional, documented, and paired with a way
  to access essential content.
- The component MUST own overflow created by its anatomy; the consumer owns overflow created by
  unbounded application content unless the public contract says otherwise.
- Logical properties SHOULD be used for inline/block layout. Physical properties MAY be used when
  the API deliberately describes a physical side and MUST still be tested in RTL.
- Overlays SHOULD use Base UI portals, positioning, dismissal, focus management, and scroll locking.
- Backdrops and overlay layers MUST use the shared layer/token contract. Arbitrary z-index escalation
  is prohibited.
- Sticky positioning is appropriate when content remains in normal flow and its containing context
  owns the behavior. Fixed positioning is appropriate only for viewport-owned UI with explicit
  safe-area, obscured-focus, and mobile-browser handling.
- A responsive composition MUST NOT render two live interactive trees and hide one with CSS.
  Applications SHOULD choose one tree per active viewport or move state to one shared owner.

## Motion implementation

- Motion MUST explain state, hierarchy, continuity, or spatial change.
- Shared motion tokens MUST be considered before component-local timing.
- Enter and exit transitions SHOULD use one coherent coordinate system and deterministic end states.
- Layout animation requires an explicit interaction reason; opacity and transform SHOULD be
  preferred when they communicate the same change.
- Essential information MUST NOT be conveyed only through motion.
- Reduced-motion behavior MUST preserve state and ordering, and SHOULD remove nonessential travel.
- Core MUST NOT introduce perpetual decorative movement.
- Tests MUST be able to reach a deterministic final state without relying on arbitrary sleeps.

This document does not approve new durations, easing curves, distances, or motion personality.
Those remain maintainer visual decisions.

## Testing and review strategy

Tests SHOULD assert the layer that owns the risk.

### Contract tests

Contract tests cover public props and types, refs, semantic roots, controlled/uncontrolled state,
events, protected attributes, data hooks, runtime behavior, and source-install contracts. They MUST
not freeze incidental wrapper structure.

### Accessibility tests

Accessibility tests cover roles, names, descriptions, relationships, keyboard behavior, focus,
state communication, announcements, and automated axe checks. They MUST include author
responsibilities that the primitive cannot infer.

### Browser tests

Browser tests cover real positioning, clipping, overflow, focus restoration, responsive behavior,
RTL, forced colors, safe areas, dynamic viewports, portals, and lifecycle behavior that DOM-only
tests cannot prove.

### Visual regression tests

Visual regression tests MAY protect approved visual output after a visual-language decision is
accepted. They MUST NOT be introduced by a technical governance task to freeze incidental pixels,
temporary values, or an unapproved visual baseline.

### Reusable component or family review checklist

Reviewers MUST record the relevant evidence for:

- [ ] Responsibility boundary: Core, composition, future Core candidate, Pro, or consumer ownership.
- [ ] API necessity: the admission rule passes and alternatives were considered in order.
- [ ] Composition: single API versus compound anatomy is deliberate.
- [ ] Token layer: system, family, and component-exception decisions are correctly placed.
- [ ] Tailwind contract: static utilities, Nerio variables, deterministic `className` conflict
      resolution, data-attribute variants, residual-CSS policy, and consumer setup are correct.
- [ ] Anatomy and semantics: native/Base UI choice, slots, refs, render composition, and state hooks.
- [ ] State matrix: every applicable state is implemented and documented.
- [ ] Accessibility: naming, keyboard, focus, announcements, forced colors, reduced motion, zoom, and reflow.
- [ ] Resilience: narrow containers, overflow, RTL, localization, safe areas, and dynamic viewports.
- [ ] Motion: purpose, shared tokens, coordinate system, reduced-motion equivalent, and deterministic end state.
- [ ] Source installation: package and copied-source behavior remain coherent.
- [ ] Docs and examples: smallest correct API, realistic states, ownership boundary, and public imports.
- [ ] Visual-language compliance: no contributor-invented visual decision or unapproved value.

The checklist is a relevance review, not permission to add states, variants, tokens, or tests that a
component does not need.

## Documentation and example practices

Public examples MUST:

- demonstrate the smallest correct public API first;
- compile through the documentation fixtures;
- avoid unused imports and placeholder pseudocode presented as complete code;
- separate primitive behavior from application-owned composition;
- use realistic, domain-agnostic states without expanding the Core API;
- explain when to use the component and when to choose another component or layer;
- keep all public copy in English;
- preserve Core, Pro, template, and consumer ownership boundaries.

Documentation SHOULD progress from minimal usage to variants, composition, controlled state, and
escape hatches. It MUST describe author responsibilities that types or primitives cannot enforce.
Source, exports, catalog, registry, docs, CLI, MCP, fixtures, tests, and changelog MUST remain aligned
when their shared public contract changes.

## Review decision record

For a new capability or API change, the issue or pull request SHOULD record:

```text
Responsibility:
Stable semantic or behavioral distinction:
Independent use cases:
Composition considered:
Token/className/source alternatives considered:
Accessibility and entrypoint impact:
Maintenance and migration cost:
System, family, or component-exception styling layer:
Required contract, accessibility, browser, and visual evidence:
```

## Primary references

Nerio's repository contracts remain authoritative for Nerio-specific decisions. The technical
baseline follows current primary platform and library guidance:

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and its understanding documents for keyboard access,
  focus, reflow, target size, status messages, and motion.
- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) for established widget
  semantics, keyboard conventions, accessible names, and focus management. APG examples are
  guidance, not production design-system code.
- [HTML Living Standard](https://html.spec.whatwg.org/) and
  [MDN semantic HTML guidance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/HTML)
  for platform semantics and native behavior.
- [React state guidance](https://react.dev/learn/sharing-state-between-components) and
  [React ref guidance](https://react.dev/reference/react/forwardRef) for state ownership and minimal
  imperative surfaces.
- [Base UI accessibility](https://base-ui.com/react/overview/accessibility) and
  [composition](https://base-ui.com/react/handbook/composition) guidance for primitive behavior,
  `render` composition, refs, and consumer responsibilities.
