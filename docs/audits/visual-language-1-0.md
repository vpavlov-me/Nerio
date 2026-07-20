# Nerio 1.0 visual-language audit

Status: Approved audit evidence
Decision: [`docs/visual-language-1-0.md`](../visual-language-1-0.md)
Issue: [#135](https://github.com/vpavlov-me/Nerio/issues/135)

## Scope and method

The audit reviewed the implemented Core component playground, representative product compositions,
light and dark mode, comfortable and compact density, and transient overlay states. Findings are
grouped by their likely system owner rather than by the screen where a symptom appeared. This keeps
follow-up implementation focused on primitive, semantic, family, or component-exception causes.

This is design evidence. It does not implement token or component changes.

## Cause map

| System cause         | Recurring baseline symptom                                                                                   | Approved rule                                                                                                                              | Implementation owner                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Neutral compositing  | Fixed gray fills flatten when repeated or feel dirty over different surfaces.                                | Use cool alpha-neutral semantic layers where compositing is intentional; retain fixed values for isolation-sensitive overlap.              | Primitive and semantic color tokens.                             |
| Foundation mapping   | Tinted canvas and raised surfaces weaken the clean hierarchy.                                                | Light foundations are white; dark foundations are black. Layering comes from alpha neutrals, spacing, and narrow elevation.                | Mode semantic mappings.                                          |
| Accent distribution  | Purple appears in routine navigation, icons, or broad soft surfaces.                                         | Reserve accent for primary action, focus, links, small selection signals, progress, and meaningful data.                                   | Semantic action/selection roles and family aliases.              |
| Group hierarchy      | Every island receives a border or card wrapper.                                                              | Use whitespace between regions, one neutral field for a related group, and dividers only inside repeated content.                          | Layout guidance and surface/border semantics.                    |
| Border contrast      | Borders compete with text and make the interface busy.                                                       | Borders are sparse, cool, alpha-neutral, and lower contrast than fills or content.                                                         | Border semantic tokens.                                          |
| Elevation            | A blanket no-shadow rule leaves a few raised or selected surfaces visually unresolved.                       | Keep shadows exceptional and very soft; allow only where actual layering or a family rule needs it.                                        | Elevation semantics and narrow component aliases.                |
| Geometry             | Medium radii make the system rigid; one large radius makes Checkbox and popups bubble-like.                  | Use high rounded geometry by role, with smaller semantic exceptions for Checkbox and compact popups.                                       | Radius primitives and component aliases.                         |
| Density              | Spaciousness is created by oversized controls or excessive internal padding.                                 | Keep 32px default controls and compact interiors; place generous air between sections.                                                     | Density aliases and layout guidance.                             |
| Typography           | Similar small text sizes and repeated bold weights obscure hierarchy.                                        | Keep most UI text at 12–14px with regular baseline weight and clearer scale steps between roles.                                           | Typography semantic roles.                                       |
| Hover behavior       | Surface and color changes happen instantly across components.                                                | Route all applicable hover transitions through shared motion variables.                                                                    | Motion semantics and component recipes.                          |
| Motion causality     | Dialogs zoom abruptly or entry and exit use unrelated movement.                                              | Use calm opacity plus restrained transform, one coordinate system, and directional continuity.                                             | Motion primitives, overlay family aliases, component exceptions. |
| Overlay character    | Tooltips, menus, popovers, command, and toasts look like ordinary white cards.                               | Use compact inverted dark glass with white text, transparency, blur, and a blurred backdrop where modal.                                   | Overlay family semantics.                                        |
| Popup anatomy        | Popover and Dropdown Menu inherit task-surface radius and loose padding.                                     | Use a smaller popup radius and compact, aligned item spacing.                                                                              | Popup family aliases.                                            |
| Selection            | Sidebar active rows use a broad soft brand surface.                                                          | Use a neutral selected surface; add a small accent indicator only when needed.                                                             | Navigation selected aliases.                                     |
| Form semantics       | Checkbox is used as a general boolean control or looks like Radio.                                           | Use Checkbox for grouped multi-selection, Switch for boolean values, and a small Checkbox radius.                                          | Component guidance and Checkbox alias.                           |
| Form labeling        | Persistent labels add noise, while placeholder-only fields risk losing accessible names.                     | Visual examples may use placeholders, but every control keeps a programmatic name and required meaning outside transient placeholder text. | Documentation and accessibility contract.                        |
| Icon actions         | Icon-only controls appear without explanatory Tooltip; brand marks are approximated by the system icon pack. | Require Tooltip plus accessible name for icon-only actions; use official SVGs for company marks.                                           | Docs/examples, Button guidance, app-owned brand assets.          |
| Overlap isolation    | Alpha-filled Avatars blend incorrectly when AvatarGroup items overlap.                                       | Use an opaque isolation token for Avatar overlap while keeping general neutral layers compositing-aware.                                   | Avatar component exception.                                      |
| Task-surface actions | Dialog/Sheet close actions and footers vary between examples.                                                | Close is an icon-only secondary Button; task action rows align to inline end.                                                              | Overlay family composition and documented exception.             |

## Representative evidence

### Direction calibration

- [Structured settings](../assets/visual-language-1-0/direction-a-structured-settings.jpg)
- [Docs-shell settings](../assets/visual-language-1-0/direction-b-docs-shell-settings.jpg)
- [Editorial settings](../assets/visual-language-1-0/direction-c-editorial-settings.jpg)

The settings variations isolated the effect of border density, neutral temperature, geometry,
typographic hierarchy, and layout composition. Direction B provided the closest foundation. The
final approval increased radius, removed island borders, constrained accent, and separated regional
whitespace from internal component padding.

### Product and overlay calibration

- [Data-heavy screen](../assets/visual-language-1-0/approved-data-overlay-screen.jpg)
- [Dialog](../assets/visual-language-1-0/approved-overlay-dialog.jpg)
- [Sheet](../assets/visual-language-1-0/approved-overlay-sheet.jpg)
- [Command](../assets/visual-language-1-0/approved-overlay-command.jpg)

These screens tested dense rows, grouped content, navigation, modal focus, anchored transient UI,
toasts, and dark glass over a realistic product surface.

### Component-system coverage

- [Light / Comfortable](../assets/visual-language-1-0/component-board-light-comfortable.jpg)
- [Dark / Comfortable](../assets/visual-language-1-0/component-board-dark-comfortable.jpg)
- [Light / Compact](../assets/visual-language-1-0/component-board-light-compact.jpg)

The light/comfortable montage covers representative actions, forms, overlays, navigation, data
display, feedback, layout, and foundation specimens. The dark/comfortable and light/compact previews
verify the mode and density character without treating a single page composition as a frozen product
template.

## Follow-up boundary

The audit identifies system causes but does not authorize unrelated API or component expansion.
Follow-up work must preserve Base UI behavior, current public component responsibilities, existing
runtime axes, and Core/Pro boundaries. A local defect should be fixed in the token or family layer
that owns it; a genuine component exception must record why the system rule does not apply.
