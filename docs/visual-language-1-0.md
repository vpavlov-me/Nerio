# Nerio 1.0 visual language

- Status: Approved
- Decision owner: Maintainer
- Approval date: 2026-07-20
- Decision issue: [#135](https://github.com/vpavlov-me/Nerio/issues/135)

## Purpose

This document records the maintainer-approved visual language for Nerio 1.0. It is an art-direction
contract, not an implementation change. It turns the explored visual direction into rules that can
be implemented through the existing primitive, semantic, and component token architecture without
inventing local styles or changing public component APIs.

Read it with `DESIGN_SYSTEM.md`, `DESIGN_PRINCIPLES.md`, and
`docs/core-ui-best-practices.md`. Those documents continue to govern architecture, responsibility,
accessibility, and implementation. Where the older draft in `docs/design-system-direction.md`
describes a different visual character, this approved decision governs.

## Approved character

Nerio is minimal, calm, compact, and soft. It creates hierarchy with typography, whitespace,
alignment, neutral surface contrast, and predictable motion. The system is approachable through
rounded geometry and gentle transitions, but remains precise enough for dense operational
interfaces.

The recurring signature is:

1. clean white or black foundations;
2. cool alpha-neutral layers that respond to the surface beneath them;
3. generously separated regions with conventionally compact internal spacing;
4. rounded containers and pill-like actions, with semantic geometry exceptions;
5. dark translucent glass for transient UI above the page.

This character must work across all six accent themes. Purple remains the default Nerio accent, but
the visual identity does not depend on filling the interface with purple.

## Color and surfaces

### Foundations

- The light canvas is pure white.
- Default light surfaces are pure white. A surface is not tinted merely to look layered.
- The dark canvas and default dark surfaces are pure black.
- Neutral layers use a cool blue-gray recipe rather than a dirty warm gray.
- Reusable neutral fills, borders, hover states, and selected surfaces should be expressed as
  alpha-neutral semantic values where compositing is intentional. The same role then remains visible
  when placed over white, black, or another neutral layer.
- Fixed opaque neutrals remain valid where compositing would create an incorrect result, including
  overlapping Avatar boundaries and other isolation-sensitive geometry.

### Surface hierarchy

- `canvas` is the page foundation.
- `default` is the ordinary content surface and normally matches the canvas.
- `subtle` or `sunken` is a cool alpha-neutral group field used for controls, grouped cards, table
  regions, and quiet alerts.
- `raised` is used only when a surface genuinely needs separation. In light mode it remains white;
  in dark mode it remains black.
- `overlay` is a transient surface above the interface and follows the inverted-glass rule below.
- `selected` communicates state with a restrained neutral surface first. Brand color is not the
  default navigation selection fill.

### Grouping, borders, and elevation

- Separate major regions with whitespace. Internal spacing stays compact and conventional; the
  extra air belongs between groups, not between every element inside a group.
- Use a neutral group field when several related controls, cards, or table rows need one visual
  boundary.
- Do not draw an enclosing border around every island or section.
- Dividers may separate repeated list or table rows. They do not imply an outer card border.
- Borders are quiet alpha-neutral separators and must remain lower contrast than text or control
  fills.
- Shadows are not a default hierarchy mechanism. A very soft, natural shadow is allowed only when
  it clarifies actual elevation or a narrow family exception, such as an outline action or the
  selected item in a segmented control.
- Glows and decorative product gradients are rejected.

### Accent and semantic color

- Brand color is constrained to the primary call to action, focus, links, small selection
  indicators, progress, the primary data series, and intentional brand moments.
- Secondary actions, routine navigation, headings, ordinary icons, surfaces, and standard borders
  remain neutral.
- Active sidebar rows use a neutral selected surface, not a soft brand fill.
- Additional colors are allowed only when they carry semantic or data meaning. Charts may use
  multiple distinguishable series colors; a chart is not forced into monochrome purple.
- Status treatments remain subdued by default. Strong treatments are reserved for urgent or
  high-salience states and must not rely on color alone.

## Transient and overlay surfaces

Tooltips, popovers, dropdown menus, command surfaces, toasts, and other transient UI use an
inverted-glass treatment:

- in light mode, the surface is translucent black with white foreground;
- in dark mode, it preserves the same high-contrast transient character instead of becoming a
  simple light-mode inversion;
- the surface uses background blur and a restrained translucent outline only when needed for edge
  definition;
- modal and sheet backdrops use blur as part of the focus transition;
- the glass treatment must preserve WCAG contrast over realistic content and forced-color fallbacks;
- popup radius is smaller than dialog or sheet radius so compact anchored surfaces do not become
  bubble-like;
- internal popup spacing is compact, regular, and aligned to item anatomy.

Dialog and Sheet remain larger neutral task surfaces. Their close action is an icon-only secondary
Button, and their action footer aligns actions to the inline end. These are component or family
rules, not reasons to add a new public visual variant.

## Typography

- Core remains font-token driven and keeps the approved system stack. The docs may use Geist as an
  application-level brand choice.
- Default UI and control text lives primarily in the 12–14px range, with 14px as the default body
  and control size.
- Regular weight is the baseline. Bold is not the default way to create hierarchy.
- Hierarchy uses deliberately larger steps between roles: display, section heading, body, label,
  metadata, and code should be visibly distinct even when most UI text is compact.
- Headings should use medium or semibold only where the role needs it; avoid repeated heavy weights
  across cards and controls.
- Labels, metadata, and helper text remain concise and use neutral contrast levels.
- Code uses the mono token and the same compact rhythm.
- Comfortable and compact density may tighten control and row metrics, but must not create a second
  typographic scale or reduce text below the 12px UI floor.
- Truncation is intentional, not a default. Essential content needs a discoverable full value.

### Form labels

Compact visual examples may omit a persistent visible label when the placeholder carries the visual
prompt. The control must still have a programmatic accessible name and its required meaning must not
depend on placeholder persistence. Floating labels are not part of the approved 1.0 language. A
future task may define a more elegant persistent-label pattern; this decision does not change the
current accessible `Field` contract.

## Geometry and spacing

- The system uses visibly rounded geometry. Buttons and compact actions are pill-like; containers
  and cards have generous rounded corners.
- Radius increases with scale and role. Containers are rounder than controls, while large task
  surfaces may be rounder still.
- Geometry must preserve semantic recognition. Checkbox is the explicit exception: it uses a small
  radius so it cannot be confused with Radio.
- Popover and Dropdown Menu use a reduced popup radius relative to Dialog and Sheet.
- Default control height remains 32px. Larger sizes are functional size choices, not the default
  visual character.
- The 4px spacing grid remains the base rhythm.
- Major page regions use generous separation. Component interiors use standard, compact padding and
  consistent alignment.
- Comfortable is the default density. Compact remaps semantic density and component aliases; it does
  not fork components or mutate primitive scales.
- Controls retain usable pointer targets and keyboard focus without becoming visually oversized.

## Interaction states

- Hover is always transitioned through shared motion variables; no instant hover is part of the
  default system.
- Neutral surface change is the first hover treatment. Brand-tinted hover is reserved for a branded
  action or selection that already owns the accent.
- Active or pressed states deepen the same visual direction as hover; they do not jump to an
  unrelated treatment.
- Selected navigation and segmented-control states use neutral contrast, optional restrained
  elevation, and a small brand indicator only where needed.
- Focus-visible uses the established 2px ring and 2px offset. Focus must remain visible without
  making every resting control accented.
- Disabled states reduce contrast while preserving structure and readable meaning.
- Loading preserves dimensions and communicates progress without sudden layout shifts.
- Invalid and destructive states use semantic color plus text, iconography, or another non-color
  cue.
- Read-only content remains legible and distinguishable from disabled content.
- Link Buttons gain an underline on hover and focus-visible.
- Icon-only actions require a Tooltip and a programmatic accessible name.
- Official company marks use official SVG assets. System icons continue through the Nerio icon
  adapter.

Checkbox is used for grouped multi-selection. Switch is used for a boolean on/off or yes/no value.
This semantic rule prevents visually similar controls from being used interchangeably.

## Motion

Motion is calm, smooth, predictable, and spatially coherent.

- All state transitions use the shared duration and easing families.
- Hover feedback is short but perceptible; it must not be instant.
- Reveals and overlays use a natural combination of opacity, restrained scale, and spatial travel.
- Directional components preserve causality: a right-side Sheet enters from and exits toward the
  right; a menu remains anchored to its trigger; a toast stack preserves reading order.
- Dialogs use a subtle fade with a small scale/vertical settle rather than an exaggerated zoom or
  disconnected slide.
- Exits reverse the same coordinate system used on entry.
- Feedback never delays input acknowledgement.
- Reduced motion removes nonessential travel and scale while preserving state order and a clear
  opacity transition.
- Decorative looping motion is absent from Core.

The implementation issues may tune token values only to realize this approved personality. They
must not create one-off per-component timings.

## Iconography and signature details

- The default icon character remains the adapter-provided Lucide set with a 1.5px stroke.
- Icon size follows the existing semantic size scale and aligns optically with text rather than the
  raw SVG box.
- Decorative icons are hidden from assistive technology; meaningful icons require an accessible
  name or accompanying text.
- Brand logos are not approximated through the system icon set.

The two repeatable Nerio signature details are:

1. soft, highly rounded neutral geometry on the page;
2. compact dark glass for UI that appears above the page.

They are system patterns, not decorative effects to apply everywhere.

## Visual evidence

### Explored directions

The three early settings/form variations deliberately changed hierarchy, surface grouping, density,
and geometry before the final direction was chosen.

| Direction                       | Evidence                                                                 | Decision                                                                               |
| ------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| A — structured settings         | [View](./assets/visual-language-1-0/direction-a-structured-settings.jpg) | Rejected: too many dividers, insufficient radius, and brand-soft navigation selection. |
| B — docs-shell settings         | [View](./assets/visual-language-1-0/direction-b-docs-shell-settings.jpg) | Closest foundation; evolved into the approved rounded, border-light direction.         |
| C — editorial numbered settings | [View](./assets/visual-language-1-0/direction-c-editorial-settings.jpg)  | Rejected: too editorial and composition-specific for universal Core.                   |

### Final product screens

- Settings/form surface: direction B is the calibrated form and settings reference; its accepted
  rules are recorded above rather than its exact page composition.
- Data-heavy/table surface:
  [approved reference](./assets/visual-language-1-0/approved-data-overlay-screen.jpg).
- Navigation/overlay-heavy surfaces:
  [Dialog](./assets/visual-language-1-0/approved-overlay-dialog.jpg),
  [Sheet](./assets/visual-language-1-0/approved-overlay-sheet.jpg), and
  [Command](./assets/visual-language-1-0/approved-overlay-command.jpg).

### Component boards and runtime axes

The light/comfortable board is a curated montage from the implementation playground used during
visual calibration. It covers representative actions, forms, overlays, navigation, data display,
feedback, layout, and foundation specimens. The dark/comfortable and light/compact previews verify
that the same system remains coherent across both runtime axes.

- [Light / Comfortable component board](./assets/visual-language-1-0/component-board-light-comfortable.jpg)
- [Dark / Comfortable component board](./assets/visual-language-1-0/component-board-dark-comfortable.jpg)
- [Light / Compact component board](./assets/visual-language-1-0/component-board-light-compact.jpg)

These boards are evidence, not frozen pixel snapshots. The token and family rules in this document
are authoritative. Visual regression baselines should be introduced only after the downstream
implementation issues land.

## Approved, rejected, unchanged, and deferred

### Approved changes

- Cool alpha-neutral compositing for reusable neutral layers.
- Pure white light foundations and pure black dark foundations.
- More rounded containers and pill-like actions, with semantic exceptions.
- Whitespace between regions and compact conventional spacing inside groups.
- Fewer and lower-contrast borders.
- Neutral active navigation instead of a brand-soft fill.
- Inverted dark glass for transient overlay UI and blurred backdrops.
- Smooth tokenized hover and state motion.
- Narrow, soft-shadow exceptions for actual elevation and selected segmented surfaces.
- Small regular-weight typography with clearer role-to-role scale steps.
- Official SVG company marks and tooltips for icon-only actions.

### Rejected alternatives

- Warm or dirty gray neutral recipes as the default Nerio character.
- Purple as a broad surface, navigation, heading, or routine icon color.
- Border-first cards around every group or island.
- Large controls and oversized internal padding as a proxy for spaciousness.
- Medium or low radii that make the system feel rigid.
- One maximum radius applied indiscriminately to Checkbox, Popover, and Dropdown Menu.
- Floating labels.
- Instant hover changes, exaggerated overlay zoom, and unrelated entry/exit directions.
- Decorative shadows, glows, and gradients.
- Monochrome charts when multiple series need semantic differentiation.

### Intentionally unchanged

- Base UI remains the sole interactive primitive layer.
- Public component responsibilities, variants, sizes, slots, and entrypoints remain unchanged.
- Theme, mode, and density remain the only v1 runtime appearance axes.
- Purple remains the default theme and constrained brand accent.
- Comfortable remains the default density; 32px remains the default control height.
- The 4px spacing grid, 12px minimum UI text, 1.5px icon stroke, and 2px focus ring with 2px
  offset remain system baselines.
- Accessibility, controlled/uncontrolled state, responsive behavior, and source-install contracts
  remain governed by the canonical Core standards.

### Deferred

- A persistent visible form-label pattern that remains as visually quiet as a placeholder.
- Figma library production.
- Visual-regression baseline creation after implementation.
- Pro components, templates, marketing identity, and product-specific compositions.

## Token implications

The implementation should preserve the existing architecture and classify changes before editing:

### Primitive implications

- Calibrate the neutral source values and reusable alpha steps.
- Calibrate high-radius values and shared duration/easing values.
- Preserve primitive immutability across theme, mode, and density.

### Semantic implications

- Map canvas/default/raised to clean white or black foundations by mode.
- Map subtle, sunken, control, selected, hover, and border roles to cool alpha-neutral values where
  compositing is intended.
- Keep fixed opaque semantic isolation values only where overlap requires them.
- Provide overlay surface, foreground, outline, backdrop, and blur semantics for the glass family.
- Keep accent and status roles semantic and theme-remappable.

### Component and family implications

- Remap control, container, task-surface, and compact-popup radii by role.
- Apply density through existing semantic and component contracts.
- Centralize hover transition properties through motion aliases.
- Add or remap narrow aliases for outline Button elevation, selected segmented Tabs elevation,
  Avatar overlap isolation, popup geometry, Dialog motion, and overlay glass.
- Preserve public aliases or provide compatibility mapping when a public token name changes.

Every downstream token change must run the token, runtime-axis, docs, component contract,
accessibility, and browser evidence required by the changed surface.

## API impact and downstream work

This decision introduces no breaking public API change. Visual implementation should use tokens,
existing variants, stable state attributes, composition, and justified component exceptions.

If implementation discovers a true behavioral or semantic API gap, it must be isolated in its own
issue with migration and synchronized source, catalog, registry, docs, CLI, MCP, fixture, and test
work. It must not be hidden inside visual cleanup.

The approved direction feeds the existing downstream work:

- #136: color and surface token implementation;
- #137: typography and density implementation;
- #138: geometry, spacing, and component-family implementation;
- #139: interaction state and motion implementation;
- #140: visual evidence and regression coverage after implementation.

The recurring inconsistency audit that supports these implications is recorded in
[`docs/audits/visual-language-1-0.md`](./audits/visual-language-1-0.md).
