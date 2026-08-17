# Nerio foundation documentation and standards audit

## Status

- **Audit date:** 2026-08-17
- **Repository baseline:** `dev` at `e3249f9070263b61db13d718c9fd4f86ed1c0448`
- **Scope:** public foundation documentation, token architecture, documentation/source consistency,
  accessibility guidance, and cross-tool token portability
- **Reference input:** DSSpace as a knowledge-base and topic-coverage reference
- **Normative references:** Nerio source-of-truth documents, Design Tokens Community Group (DTCG)
  specifications, and WCAG 2.2

This audit does not promote a third-party knowledge base above Nerio's accepted architecture. DSSpace
is useful for checking whether common design-system topics are represented and understandable. Any
implementation change must still be justified by Nerio's product direction, current source, DTCG
interoperability requirements, or accessibility standards.

## Executive assessment

Nerio already has a mature design-system architecture. It has explicit governance, primitive to
semantic to component token layers, independent theme/mode/density axes, accessible Base UI-backed
components, source installation, package distribution, component documentation, browser and visual
regression coverage, and dedicated validation commands.

The principal gap is public foundation coverage and source-backed documentation, rather than a weak
component or token model. Several decisions are implemented in `packages/tokens/src/styles.css` or
recorded in repository governance documents but are difficult for product designers and consumers to
find in the public documentation. One verified prose assertion in the Themes page has also drifted
from the current token source.

The correct response is to complete the public foundation layer, strengthen documentation contracts,
and add machine checks for source-backed facts. Rebuilding the token architecture or adding more
runtime appearance axes would create churn without solving the observed problem.

## Source hierarchy used by this audit

When recommendations conflict, apply sources in this order:

1. Accepted Nerio decisions and scope-specific source-of-truth documents.
2. Implemented public contracts and token source.
3. Web standards and stable interoperability specifications.
4. Established design-system guidance and knowledge bases, including DSSpace.
5. Examples from individual products or component libraries.

Relevant Nerio sources include:

- `DECISIONS.md`
- `DESIGN_SYSTEM.md`
- `DESIGN_PRINCIPLES.md`
- `COMPONENT_ARCHITECTURE.md`
- `docs/core-ui-best-practices.md`
- `docs/visual-language-1-0.md`
- `packages/tokens/src/styles.css`
- public component source, registry metadata, tests, and documentation

## Audit method

The audit used four checks:

1. Inventory the foundation subjects exposed in the public documentation.
2. Compare documented token values and behavior with the canonical CSS source.
3. Evaluate whether each foundation explains purpose, roles, usage, accessibility, customization,
   examples, and validation rather than merely listing variables.
4. Classify every gap as a documentation gap, implementation gap, architecture proposal, or
   consumer-owned concern.

## Coverage scorecard

| Area                               | Assessment        | Evidence and implication                                                                                                                                       |
| ---------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Governance and source ownership    | Strong            | Normative documents define precedence, responsibility, API admission, and review rules.                                                                        |
| Token layering                     | Strong            | Primitive, semantic, and component contracts are implemented and documented.                                                                                   |
| Theme, mode, and density           | Strong with drift | Runtime axes are coherent; one dark-mode prose description no longer matches the token source.                                                                 |
| Typography                         | Partial           | Scale, families, loading, and core roles exist; resilience, localization, numeric use, wrapping, and validation guidance are incomplete.                       |
| Color                              | Partial           | Primitive and semantic color contracts are substantial; consumers lack a dedicated Color foundation explaining roles, contrast, state, and theme construction. |
| Spacing and layout                 | Gap               | Spacing primitives exist, but public guidance does not explain rhythm, semantic spacing, reflow, overflow, logical properties, or Core/application ownership.  |
| Radius, effects, motion, and icons | Strong            | Dedicated foundation pages exist and align with the current visual direction.                                                                                  |
| Accessibility foundations          | Partial           | Component docs and implementation standards are strong; no public cross-component accessibility foundation consolidates the system contract.                   |
| Content and localization           | Gap               | Individual implementation rules mention long strings and RTL; public guidance for labels, errors, empty states, numbers, dates, and localization is missing.   |
| Documentation/source consistency   | Needs work        | Token existence is validated, but prose values and behavioral summaries can drift from source.                                                                 |
| Token portability                  | Gap               | CSS variables are canonical and appropriate for runtime use; no DTCG-compatible interchange artifact exists for design tools and future Figma workflows.       |

## Findings

### F-01 — Foundation navigation exposes implementation slices instead of a complete consumer model

**Priority:** P1

The public Foundations group currently contains Tokens, Typography, Themes, Motion, Radius, Effects,
and Icons. Color is embedded in Tokens, density is embedded in Themes, and accessibility is mostly
repeated per component. Spacing and resilient layout have no public destination.

**Action:** add dedicated Color, Accessibility, and Spacing & layout pages. Keep Tokens focused on
architecture and Themes focused on runtime composition. Density may remain in Themes until its
content is substantial enough to justify a dedicated page.

### F-02 — Typography lacks a complete usage and resilience contract

**Priority:** P0

The typography page documents families, scale values, and a small set of semantic roles. It omits the
implemented `--n-font-size-2xs` primitive and does not explain wrapping, truncation, text resize,
320 CSS pixel reflow, text-spacing overrides, long localized strings, RTL, tabular numerals, or
validation expectations.

**Action:** extend the existing page without changing token values or adding a font runtime axis.
Document raw scale versus semantic role usage, locale fallback ownership, data typography, and a
repeatable validation matrix.

### F-03 — Themes documentation has drifted from the dark-mode source

**Priority:** P0

The Themes page says dark mode remaps major surfaces to gray 950, 900, and 800. The current token
source uses pure black foundations for the canvas/default/raised/overlay roles and white alpha
neutrals for adaptive controls and borders.

**Action:** correct the prose now. Follow with a validator or generated documentation data for facts
that can be derived from `packages/tokens/src/styles.css`.

### F-04 — Accessibility is implemented as a component concern but under-documented as a system concern

**Priority:** P0

Nerio's implementation standard covers semantic HTML, Base UI behavior, keyboard interaction,
focus, forced colors, reduced motion, zoom, reflow, long strings, RTL, and safe-area behavior. Public
consumers have to discover these rules across component pages or repository governance documents.

**Action:** add a public Accessibility foundation covering system invariants, testing responsibilities,
contrast, non-color communication, focus, pointer targets, text and zoom resilience, motion,
localization, and the boundary between automated and manual evidence.

### F-05 — Color contracts are technically strong but hard to use correctly

**Priority:** P1

Nerio has complete primitive palettes and meaningful semantic roles for surfaces, text, borders,
actions, statuses, focus, trends, and charts. The Tokens page presents a representative subset but
does not teach role selection, contrast pairs, state sequences, color-blind-safe communication,
theme creation, or dark-mode review.

**Action:** create a standalone Color foundation backed directly by exported token metadata. Show
primitive versus semantic usage, role families, interaction states, status treatments, contrast
requirements, and custom-theme validation.

### F-06 — Spacing exists as values but not as a documented system

**Priority:** P1

A primitive spacing scale and density aliases exist. Public documentation does not establish how to
choose spacing, distinguish component-internal spacing from composition spacing, handle compact
surfaces, or build resilient layouts.

**Action:** document the scale, semantic density aliases, rhythm principles, container-aware reflow,
wrapping, overflow ownership, logical properties, and localization. Do not make Core own product
page grids, breakpoints, or application-shell composition.

### F-07 — Token lifecycle and interoperability need explicit contracts

**Priority:** P3 / Ecosystem, after stable 1.0

Nerio validates public CSS variables and preserves aliases, but public documentation does not define
how tokens are introduced, deprecated, aliased, migrated, or removed. CSS remains the right runtime
source, while design tools benefit from typed metadata and alias graphs.

**Action:** keep the generated DTCG 2025.10 export and drift validation under post-1.0 issues #490
and #357. The first implementation step should be a one-way generated interchange artifact, not a
second hand-maintained token source. Promote JSON to canonical only after tooling evidence justifies
the migration. This audit does not move the accepted P3 / Ecosystem work into the pre-stable
foundation sequence.

### F-08 — Content and localization guidance is fragmented

**Priority:** P2

Component APIs support accessible labels and descriptions, but the public system does not define
concise labels, action naming, validation messages, destructive confirmation, empty-state content,
number/date formatting, pluralization, or localization resilience.

**Action:** add a Content and localization foundation after the visual and accessibility foundations
are complete. Treat product voice and domain terminology as consumer-owned while documenting stable
interface-writing and internationalization constraints.

### F-09 — Source-backed documentation facts need automated verification

**Priority:** P0

Current validators check token existence and several documentation contracts. They do not prevent a
prose statement about resolved mode values, available scale steps, or supported presets from becoming
stale.

**Action:** identify facts that can be represented as structured data and generate tables or validate
their declared mappings. Avoid parsing arbitrary prose as a long-term strategy. At minimum, tests
should cover supported runtime axes, typography steps, theme presets, and documented light/dark role
mappings.

## Recommended implementation sequence

### Tranche A — Correct and establish the audit baseline

- Add this audit.
- Correct the dark-mode description in Themes.
- Expand Typography with the implemented scale and resilience guidance.
- Keep all token values and public component APIs unchanged.

### Tranche B — Complete high-value public foundations

- Add Accessibility.
- Add Color.
- Add navigation, table-of-contents entries, search/LLM index coverage, and documentation tests.
- Source examples and token tables from shared metadata where practical.

### Tranche C — Document spatial behavior

- Add Spacing & layout.
- Explain semantic density aliases and composition boundaries.
- Add examples for narrow containers, wrapping, overflow, RTL, and long localized content.

### Tranche D — Add token interoperability deliberately after stable 1.0

- Follow the accepted P3 / Ecosystem disposition in #490 and #357; do not start this tranche in the
  pre-stable foundation sequence.
- Record an ADR for DTCG 2025.10 compatibility.
- Generate a typed token interchange artifact from the canonical source or from one accepted
  structured source.
- Preserve aliases, descriptions, types, deprecation metadata, and extension points.
- Validate generated CSS and interchange output for equivalence.

### Tranche E — Expand product guidance

- Add Content and localization.
- Add data-visualization guidance when the chart adapter contract is accepted.
- Consider imagery and illustration only when Nerio owns reusable assets or style decisions.

## Non-goals

This audit does not authorize:

- new `data-font`, `data-radius`, `data-motion`, `data-contrast`, or `data-scale` runtime axes;
- palette, radius, typography, motion, or spacing value changes based only on a reference site;
- product-page grid, application-shell, routing, or workflow ownership in Core;
- component API changes without independent product and migration evidence;
- a parallel manually maintained token source;
- a visual redesign of Nerio Core.

## Acceptance criteria for the foundation program

The program is complete when:

1. Every public foundation has a clear purpose, role model, usage guidance, customization contract,
   accessibility implications, examples, and review checklist.
2. Documented token names, supported presets, scale steps, and runtime mappings are sourced from or
   validated against canonical implementation data.
3. Color and typography guidance includes WCAG 2.2 contrast, resize, reflow, text-spacing, focus, and
   non-color communication requirements where applicable.
4. Spacing and layout guidance preserves the Core versus application ownership boundary.
5. New documentation is indexed by navigation, search, `llms.txt`, and documentation validation.
6. DTCG interoperability, if implemented, is generated and validated rather than duplicated by hand.
7. Existing package and source-install behavior remains unchanged unless a separately approved ADR
   and migration plan says otherwise.

## External references

- DSSpace: https://dsspace.dev/
- DTCG Design Tokens Format Module 2025.10:
  https://www.designtokens.org/TR/2025.10/format/
- DTCG Color Module 2025.10:
  https://www.designtokens.org/TR/2025.10/color/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/
