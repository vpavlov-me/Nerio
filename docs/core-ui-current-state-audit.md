# Nerio Core UI current-state audit

## Scope

This historical baseline supports issue #155 and records the documentation-only review of Nerio Core
after the 0.1.0 alpha release. It does not approve visual changes or silently redefine public
contracts. It is not the post-Tailwind assessment; see
[`core-ui-post-tailwind-audit.md`](./core-ui-post-tailwind-audit.md) for the durable delta report.

The review sampled implementation, component CSS, registry metadata, public docs examples,
contract tests, accessibility tests, and browser evidence from every Core category. Paths in the
matrix identify the 0.1.0-alpha.0 baseline rather than the current Tailwind-first implementation.
Findings are grouped by systemic cause rather than subjective cosmetic preference.

Classifications:

- **Already aligned:** current implementation and evidence match the best-practice direction.
- **Documentation gap:** implementation may be sound, but a reusable rule was not explicit.
- **Objective technical deviation:** evidence shows a contract defect suitable for a focused issue.
- **Future visual decision:** a maintainer-owned choice that this audit does not score or change.
- **Potential product-scope leak:** product responsibility appears inside a Core primitive.

## Representative evidence

| Core category         | Representative source and styles                                               | Registry and docs evidence                                                 | Test evidence                                                                                            | Classification                                                          |
| --------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Foundation            | `typography.tsx`, `icon.tsx`, `typography.css`, `icon.css`, token runtime axes | `typography` and `icon` registry items; typography and icon reference data | Core contracts, accessibility coverage, token/runtime-axis validators                                    | Already aligned; visual values remain future maintainer decisions       |
| Actions               | `button.tsx`, `button-group.tsx`, `button.css`, `button-group.css`             | `button`/`button-group` metadata and Button docs                           | Button type, state, keyboard, loading, render, and group contracts                                       | Baseline deviation resolved by #169; otherwise aligned                  |
| Forms                 | `field.tsx`, `input.tsx`, `select.tsx`, `forms.css`, `select.css`              | `field`, `input`, and `select` metadata and examples                       | Label/description/error, controlled state, Base UI, and axe coverage                                     | Already aligned; systemic state-review guidance was a documentation gap |
| Overlays              | `dialog.tsx`, `sheet.tsx`, `overlays.css`                                      | `dialog` and `sheet` metadata and examples                                 | Focus management/restoration, dismissal, safe-area, responsive, and source-install evidence              | Already aligned                                                         |
| Data display          | `card.tsx`, `table.tsx`, `item.tsx`, `display.css`                             | `card`, `table`, and `item` metadata and examples                          | Semantic roots, refs, table naming/overflow, responsive and accessibility evidence                       | Already aligned                                                         |
| Feedback              | `toast.tsx`, `progress.tsx`, `empty-state.tsx`, feedback styles                | `toast`, `progress`, and `empty-state` metadata and examples               | Announcements, lifecycle, timing, naming, reduced-motion, RTL, and browser evidence                      | Already aligned                                                         |
| Navigation and layout | `tabs.tsx`, `sidebar.tsx`, `command.tsx`, family styles                        | `tabs`, `sidebar-primitive`, and `command-primitive` metadata and docs     | Keyboard navigation, active-descendant behavior, refs, collapse/focus, RTL, browser and install evidence | Already aligned                                                         |

## Systemic findings

### Already aligned

- Core generally uses native semantics for static elements and Base UI for established interactive
  patterns.
- Server-safe and client-only entrypoints are deliberate and documented.
- Component styles consume semantic or component aliases, while runtime axes remap CSS-variable
  contracts.
- Representative compound components expose meaningful slots and keep product workflows outside
  Core.
- Contract, accessibility, browser, catalog, token, source-install, CLI, and MCP evidence are
  separated by risk rather than forced into one test type.
- Existing boundary notes correctly keep DataGrid, AppShell/AppSidebar, complete command palettes,
  notification centers, background-job managers, KPI workflows, and entity-specific rows outside
  Core primitives.

### Documentation gaps addressed by #155

The repository already had strong principles and agent rules, but it lacked one canonical review
standard that joined the following decisions:

- designer-owned visual choices versus technical implementation rules;
- strict public API admission and ordered alternatives;
- system, family, and component-exception styling layers;
- one universal state/accessibility/responsive/motion baseline;
- a reusable component/family review checklist;
- explicit contract, accessibility, browser, and visual-regression test ownership.

`docs/core-ui-best-practices.md` now owns that normative guidance. Other governance surfaces link to
it instead of copying the full rules.

### Historical objective technical deviation — resolved

At the time of the baseline audit, custom Button render targets did not preserve the complete ref
contract. The native `BaseButton` path received the forwarded ref, but the custom `render` branch
did not compose its existing ref with the forwarded Button ref.

This deviation was tracked and resolved by [issue #169](https://github.com/vpavlov-me/Nerio/issues/169)
without changing Button anatomy, styling, variants, link semantics, or the public API. The
post-Tailwind report records its final classification and current evidence.

### Future visual decisions

This audit makes no quality judgment about palette values, neutral temperature, accent frequency,
spacing rhythm, typography character, radii, borders, surfaces, elevation, density character,
motion personality, icon character, signature details, or final visual hierarchy. Those choices are
maintainer-owned and require separately approved visual-language work.

### Potential product-scope leaks

No new product-scope leak was found in the representative Core sample. This conclusion is bounded
to the audited surfaces; future proposals must still pass the responsibility and API admission rules.

## Outcome

- No production component, style, visual token value, rendered example, public prop, variant, slot,
  default, export, or runtime behavior changed in #155.
- One historical objective deviation was moved to a focused follow-up and resolved.
- The audit found no reason to expand Core, begin Pro implementation, or alter the current visual
  baseline.
