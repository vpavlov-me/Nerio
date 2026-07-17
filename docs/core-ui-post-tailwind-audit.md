# Nerio Core UI post-Tailwind audit

## Purpose and boundaries

This durable delta report revalidates the original #155 governance baseline against the accepted
Tailwind CSS v4-first implementation on `dev`. It is evidence, not a competing normative source.
The authoritative rules remain `docs/core-ui-best-practices.md`,
`docs/tailwind-styling-contract.md`, `AGENT_DESIGN_SYSTEM_RULES.md`, and the repository source of
truth documents they reference.

The review covers the Tailwind bridge, residual CSS, representative components from every released
Core family, runtime axes, public entrypoints, Registry, CLI, MCP, docs, source-install fixtures,
packed consumers, and browser evidence. It does not redesign components, alter visual values, change
public APIs, expand Core, or fix implementation defects in this audit PR.

## Evidence reviewed

- Accepted migration implementation and reports: #176 through #182,
  `docs/tailwind-styling-contract.md`, `docs/tailwind-migration-pilot-report.md`, and
  `docs/tailwind-migration-components-report.md`.
- Value and runtime contracts: `packages/tokens/src/styles.css`,
  `packages/tokens/src/tailwind.css`, `scripts/validate-tokens.mjs`, and
  `scripts/validate-runtime-axes.mjs`.
- Component and residual-CSS surfaces: every released source file under
  `packages/ui/src/components`, `packages/ui/src/styles.css`, and the residual stylesheet allowlist.
- Distribution surfaces: `packages/registry/src/manifest.json`, CLI/MCP fixtures, release smoke,
  package exports, docs setup, and the packed/source-install consumers.
- Quality evidence: Core contracts, accessibility tests, Tailwind contract tests, catalog and docs
  validators, browser smoke, CI, and the `dev` deployment for `53b26a5`.

## Post-migration family matrix

| Family                         | Representative evidence                                                                               | Result                                                                                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundation                     | Typography, Icon, Kbd, Spinner; token bridge and runtime-axis validators                              | **Aligned.** Static recipes use Nerio variable contracts; named keyframes remain within the residual allowlist.                                                              |
| Actions                        | Button, IconButton compatibility wrapper, ButtonGroup; render/ref contracts and merge tests           | **Aligned.** The historical Button render-ref deviation is resolved by #169; Tailwind changes did not alter its public contract.                                             |
| Forms                          | Input, Field, Checkbox, RadioGroup, Switch, Select; Base UI states, ARIA wiring, source-install files | **Aligned.** Static recipes, data-attribute states, reduced motion, forced colors, and controlled/uncontrolled behavior are covered.                                         |
| Data display                   | Card, Table, List, Item, Badge, Avatar, Stat, KeyValue, Separator                                     | **Aligned implementation; fixture gap deferred to #184.** Registry closure is correct, but the CLI fixture does not independently prove it for every migrated family.        |
| Feedback                       | Alert, Toast, Empty State, Progress, Skeleton, Spinner                                                | **Aligned implementation; fixture gap deferred to #184.** Residual keyframes are allowlisted and recipes remain Tailwind-first.                                              |
| Navigation and layout          | Tabs, Breadcrumbs, Pagination, Sidebar Primitive, Command Primitive                                   | **Aligned.** Stable `data-slot` selectors replace ambiguous BEM arbitrary variants; RTL, responsive, focus, and source-install evidence remain covered.                      |
| Overlays                       | Dialog, Sheet, Popover, Tooltip, Dropdown Menu, Toast lifecycle                                       | **Aligned.** Base UI continues to own interaction, portals, dismissal, and focus; residual motion remains keyframe-only.                                                     |
| Distribution and documentation | package/source-install setup, Registry, CLI, MCP, docs, packed consumer, release smoke                | **Two objective deviations deferred:** #183 for missing Tailwind setup diagnostics in `nerio doctor`, and #184 for incomplete independent source-install closure assertions. |

## Reconciliation with the original audit

| Baseline category or finding                                                             | Classification                                    | Current evidence                                                                                                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Handwritten component CSS as the implementation model                                    | **Superseded by the accepted Tailwind contract.** | Static Tailwind recipes now own visual rules; `--n-*` variables remain the canonical values.                                                |
| Component semantic boundaries, API admission, Base UI ownership, and server/client split | **Still applicable.**                             | No migration-approved API or responsibility change was found.                                                                               |
| Theme, mode, density, custom themes, RTL, forced colors, and reduced motion              | **Still applicable.**                             | Runtime-axis and browser evidence remain required because Tailwind consumes the same CSS-variable contracts.                                |
| Button custom `render` ref composition (#169)                                            | **Resolved by #169.**                             | Current contract tests cover the composed callback and object-ref shapes.                                                                   |
| Documentation gap addressed by original #155                                             | **Still applicable, extended for Tailwind.**      | This audit adds concise Tailwind authoring and distribution rules to agent and reviewer guidance without copying the full styling contract. |
| No product-scope leak in representative Core samples                                     | **Still applicable.**                             | The migration did not add product workflows, new Core components, or Pro responsibility to Core.                                            |
| Source-install/package alignment                                                         | **Replaced by Tailwind-specific deviations.**     | #183 and #184 cover setup diagnostics and family-complete dependency-closure proof.                                                         |

## Findings and ownership

### #183 — Tailwind setup diagnostics in `nerio doctor`

`nerio doctor` currently accepts a valid registry/configuration without inspecting the consumer's
Tailwind bridge, package `@source`, copied bridge, no-Preflight compatibility path, or stale styling
setup. This is a P2 prerelease blocker because a consumer can receive a successful diagnosis while
emitting no component utilities. The focused issue owns diagnostics and invalid fixtures; this audit
does not modify CLI behavior.

### #184 — Family-complete source-install closure assertions

The migrated Display, Feedback, and Progress fixture expectations omit `tailwind-cn` and the copied
bridge even though those installed components require them. Because assertions use an accumulated
target, the current test cannot prove family-local dependency closure. This is a P2 prerelease
blocker. The focused issue owns exact empty-target fixture coverage and MCP parity; this audit does
not modify registry or fixture behavior.

## Execution order after this audit

1. Resolve #183 and #184 as focused Tailwind distribution/tooling slices, then complete #174 and
   the manual prerelease work in #175.
2. Execute #158 for Actions and Forms using only evidence-backed semantic, API, accessibility, and
   distribution findings; Tailwind migration itself is complete and out of scope.
3. Execute #160 for Data Display and Feedback. It inherits #184 only as distribution evidence, not
   as permission to redesign the family.
4. Execute #161 for Navigation, Layout, and Overlays using the accepted migration contract and the
   family conventions established by #158 and #160.

Each family pass must preserve implementations classified as aligned and create another focused
issue for any deviation that does not fit its vertical slice.

## Conclusion

The Tailwind-first migration preserves Core's semantic, accessibility, runtime-axis, public API,
and ownership baseline. The remaining work is limited to the two focused distribution and validation
deviations above. No visual redesign, runtime fix, public API migration, product-scope expansion, or
new Core component is approved by this report.
