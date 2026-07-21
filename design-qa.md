# Design QA

## Source truth

- Approved visual direction: `/Users/vladimirpavlov/.codex/generated_images/019f7ac5-f8ce-7071-8837-27c8b7c8babd/exec-5c8e8616-399d-48dc-936e-a2589e81c49d.png`
- Overlay references:
  - Dialog: `/Users/vladimirpavlov/.codex/generated_images/019f7ac5-f8ce-7071-8837-27c8b7c8babd/exec-4dd23d49-37d3-41a8-9250-c7d08c3b07d0.png`
  - Sheet: `/Users/vladimirpavlov/.codex/generated_images/019f7ac5-f8ce-7071-8837-27c8b7c8babd/exec-620e078f-88b4-483d-bec0-3948a4ac6158.png`
  - Command: `/Users/vladimirpavlov/.codex/generated_images/019f7ac5-f8ce-7071-8837-27c8b7c8babd/exec-055437fe-3ae0-4e0c-baf1-4112230fad3e.png`

## Implementation evidence

- URL: `http://localhost:3001/playground`
- Viewport: 1440 × 1024
- Default light Playground: `/Users/vladimirpavlov/.codex/visualizations/2026/07/19/019f7ac5-f8ce-7071-8837-27c8b7c8babd/nerio-playground-final-1440.png`
- Dialog open: `/Users/vladimirpavlov/.codex/visualizations/2026/07/19/019f7ac5-f8ce-7071-8837-27c8b7c8babd/nerio-dialog-glass.png`
- Right Sheet open: `/Users/vladimirpavlov/.codex/visualizations/2026/07/19/019f7ac5-f8ce-7071-8837-27c8b7c8babd/nerio-sheet-glass-fixed.png`
- Command section: `/Users/vladimirpavlov/.codex/visualizations/2026/07/19/019f7ac5-f8ce-7071-8837-27c8b7c8babd/nerio-command-glass.png`
- Reference/implementation comparison: `/Users/vladimirpavlov/.codex/visualizations/2026/07/19/019f7ac5-f8ce-7071-8837-27c8b7c8babd/nerio-reference-vs-playground.png`

## Findings and fixes

1. P1 — A single Input inside SheetBody stretched to the full available panel height. Added start content alignment; verified a 32px high, borderless, translucent overlay input.
2. P1 — Playground Density did not resize every control family. Connected Button, IconButton, Input, Select, and Tabs size aliases; verified md controls change from 32px to 28px.
3. P1 — Playground mode and token overrides were scoped only to the component canvas, leaving settings visually disconnected. Moved the runtime attributes and token overrides to the shared Playground root.
4. P2 — Settings and section grouping used unnecessary dividers. Replaced them with whitespace and a cool blue-gray group surface.
5. P2 — Sidebar active state used a white surface. Replaced it with a neutral gray active surface.
6. P2 — The dev server reused stale production build output after validation. Rebuilt a clean development cache and reverified the final route.
7. P1 — Ordinary hover feedback was effectively instant or missing across app-local controls and several Core surfaces. Routed hover feedback through the semantic motion pair, verified a computed `0.22s` duration with the standard easing, and kept reduced-motion behavior explicit.
8. P2 — Default border roles competed with content hierarchy. Reduced the light and dark semantic border contrast and verified the Playground resolves light subtle/default borders to `#f1f5f9` and `#e2e8f0`.
9. P1 — Checkbox inherited too much of the rounded system character and could be mistaken for Radio. Added a deliberate 4px component-radius exception; verified the rendered control resolves to a 16px square with a 4px radius. Updated Checkbox and Switch guidance so grouped zero-or-more choices use Checkbox and every standalone boolean yes/no value uses Switch.
10. P2 — Compact dropdown surfaces inherited the largest overlay radius and appeared inflated. Added separate Select popup and Dropdown Menu component radius tokens mapped to the compact 20px radius, without changing Dialog, Sheet, Command, Toast, or other large overlays.
11. P2 — The docs chrome duplicated theme and density controls that belong in the Playground and showed stale product/version labeling. Replaced the `Core` badge with the current UI package version, reduced the header appearance control to an icon-only mode dropdown, and simplified the footer to `Nerio` without a version.
12. P1 — Neutral fills and borders were opaque, so semantically identical layers flattened when nested on different surfaces. Added immutable cool-dark and white alpha scales, mapped adaptive light and dark surface, interaction, selection, border, neutral-soft, and grid roles to them, and kept canvas, primary surfaces, foregrounds, actions, semantic status colors, and chart series opaque.
13. P2 — The header search icon had only a native title instead of the system Tooltip, and the repository link used a generic Lucide approximation. Composed the Dialog trigger with the real Tooltip contract and replaced the approximation with GitHub's official 2026 Invertocat assets, selecting the permitted black or white mark by color mode.
14. P2 — The homepage provider actions used adapter approximations and then background-bearing sign-in tiles instead of clean company marks. Replaced them with transparent official SVG assets hosted by Google and Apple, and inverted only the Apple glyph in dark mode. Refactored the GitHub label into an explicit inline-flex lockup so its official Mark cannot wrap below or overlap the text.
15. P2 — The homepage showcase displayed static overlay-shaped cards but offered no real way to inspect temporary layers. Added a compact Overlays specimen with working Dialog, right Sheet, Popover, and an icon-only Button using the system Tooltip contract.
16. P2 — Popover inherited the full overlay radius and nested padding, close controls bypassed the current Button contract, Avatar alpha fill produced muddy overlap, and the showcase retained a confusing icon-only example. Added compact Popover radius/spacing tokens, composed Dialog and Sheet close controls through the secondary small Button variant, made Avatar fallback fill opaque by mode, removed the stale showcase control, and restored the standalone account close to a square small icon-button width.
17. P2 — Link Button relied on color alone for hover feedback. Kept its resting underline transparent and revealed it on hover through the shared motion duration and easing, avoiding an instant decoration change or text reflow.
18. P1 — Dialog keyframes repeated the popup's centering translation through `transform`, so Tailwind's independent `translate` property and the animation offset stacked during entry. Preserved centering, limited the surface motion to opacity plus subtle scale, added a coordinated backdrop fade, and introduced an end-aligned `DialogFooter` action slot.
19. P2 — Outline Button and the selected segmented Tabs indicator lacked the small amount of physical separation requested for raised controls. Added dedicated component shadow aliases mapped to the weakest primitive shadow, without affecting filled Buttons, bordered Tabs, or page-level grouping.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states.

final result: passed

## Table loading and EmptyState preview follow-up QA — 2026-07-21

### Source truth

- Two user annotations on `http://localhost:3000/docs/components/table`: show more loading rows and give the empty preview an icon with more breathing room.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-empty-icon-loading-four-rows-final.jpg`
- Loading preview: four visual rows with four Skeleton cells per row while the semantic header remains visible.
- Empty preview: one 28 × 28px icon media slot and 24px block padding inside the composed EmptyState.

### Findings and fixes

1. P2 — Two loading rows made the state preview feel too sparse. Expanded the visual loading set to four rows without changing the table semantics or `aria-busy` contract.
2. P2 — The empty state had title and description only, with insufficient vertical separation. Added a decorative PackageOpen icon through Nerio's icon adapter and token-driven 24px block padding.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Primary group radius and Secondary row radius clarification QA — 2026-07-21

### Source truth

- User clarification on `http://localhost:3000/docs/components/table`: Primary owns one rounded tbody group and must not round every row; Secondary needs individual row radii for its separate hover surfaces.

### Implementation decision

- Restored the Core Table primitive to group-only tbody corner compensation.
- Kept individual 16px logical start/end row radii in the docs-owned Secondary presentation recipe only; no public Table prop or appearance variant was added.
- Primary evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-primary-group-radius-final.jpg`
- Secondary evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-secondary-row-radius-final.jpg`

### Expected geometry

- Primary: only the first row's upper corners and last row's lower corners resolve to 16px; intermediate row corners resolve to 0px.
- Secondary: every row's logical start and end corners resolve to 16px.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Table preview simplification and header divider QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/table`: reduce the overloaded preview set to the rich Primary composition, Secondary without the muted frame, Loading with persistent headers, and Empty; replace full-height header borders with short decorative dividers.
- Column resizing was explicitly deferred because it is consumer-owned interactive behavior rather than part of the presentational Core Table primitive.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Primary preview evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-docs-simplified-previews-final.jpg`
- Empty and Loading evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-empty-loading-previews-final.jpg`
- Rendered preview labels: Primary Table composition, Secondary Table composition, Empty Table row, and Loading Table rows.
- Computed header divider geometry: 13px high by 1px wide inside a 37.5938px header cell, centered with `translate: 0 -50%`, and colored by `--n-table-border`.
- Loading structure: four persistent headers (`Project`, `Owner`, `Status`, `Updated`) and two visual skeleton rows with four cells each.

### Findings and fixes

1. P1 — Separate overflow, RTL, sticky-column, grouped-header, visual-state, and sortable demos repeated the same primitive while obscuring the canonical product compositions. Removed those preview-only demos and their docs-local sticky/width CSS.
2. P1 — Loading rendered only anonymous skeleton cells, making the table structure disappear while data loaded. Kept the real header visible and aligned every skeleton row to the same four columns.
3. P1 — Header separators used full cell-height borders. Replaced them with non-interactive, tokenized 1em pseudo-element dividers centered on each subsequent header cell.
4. P2 — Verified exactly four component examples in the in-app browser and confirmed no console warnings or errors.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Primary and Secondary Table presentation QA — 2026-07-21

### Source truth

- Primary reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-f042c835-6a6d-46a5-aeca-be6f0d8dd78e.png`
- Secondary reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-310ac20b-0902-4a6a-909b-c717d8bb962c.png`
- Product boundary: both are consumer presentation recipes composed from the same Core Table, Checkbox, Button, and Pagination components. They are not new public Table props and do not move selection, reordering, row actions, or pagination state into Core.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Viewport: 1470 × 900 CSS pixels, light mode/default state.
- Primary focused screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-primary-reference-final.png`
- Primary full example: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-primary-reference-full-example.png`
- Primary combined comparison: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-primary-reference-comparison.png`
- Secondary focused screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-secondary-reference-final.png`
- Secondary full example: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-secondary-reference-full-example.png`
- Secondary combined comparison: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-secondary-reference-comparison.png`
- Dark-mode evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-primary-reference-dark.png`
- Computed Primary geometry: 32px outer radius, 4px outer padding, 28px inset row-group radius, muted outer surface, footer inside the same shell.
- Computed Secondary geometry: transparent borderless outer shell, 32px rounded muted header, open body rows, and unframed footer.
- Computed dark-mode boundary: 1px solid `rgba(255, 255, 255, 0.1)`; row dividers use the same visible semantic border value.

### Fidelity review

- Typography: passes. Both recipes inherit Nerio's documentation sans typography and regular-weight body cells; the references' hierarchy between quiet headers and primary row content is preserved.
- Spacing and radii: passes. Primary uses the requested compensated 32px/28px radius pair and 4px inset; Secondary removes the outer inset while retaining the rounded header pill and open row rhythm.
- Colors and tokens: passes. Neutral semantic surfaces and borders replace literal screenshot colors and remain legible in both light and dark modes; no purple table boundary is present.
- Controls and states: passes. Checkboxes, restrained drag handles, sortable header, real Nerio Pagination, neutral current-page treatment, row hover/selection, and whole-row native drag image remain functional.
- Assets: passes. The table presentation itself requires no new image asset; visible glyphs continue through the Nerio icon adapter and interactive controls remain real components.
- Content: passes for the documentation specimen. The implementation intentionally keeps four compact records so the recipe remains scannable within the docs preview; the reference's denser records and row action payload are consumer data-grid content, not part of the Core Table contract.

### Findings and fixes

1. P1 — A single presentation could not express both supplied visual modes without turning a consumer layout choice into a Core API variant. Added two explicit documentation compositions while keeping the public Table API unchanged.
2. P1 — Primary needed one continuous muted product surface. Kept the body row group inset and moved the Pagination footer into the same shell.
3. P1 — Secondary needed no container backing. Removed its outer background, border, radius, and padding, then placed the muted radius only on the header cells.
4. P2 — Verified the final light-mode references together with the implementation in combined comparison images and separately confirmed the raised dark-mode border token.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states.

final result: passed

## Interactive Table preview and compensated geometry QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/table`: remove the purple Table boundary, restore a 4px container gutter, compensate the outer and inner radii at 32px and 28px, replace the uneven specimens with a coherent product-table preview, demonstrate selection and row reordering, use the Nerio Pagination component, and keep the floating Secondary copy action opaque at rest and on hover.
- This direction supersedes the earlier 8px TableContainer padding follow-up.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final interactive preview screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-preview-interactive-final.png`
- Final copy-action screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/code-copy-secondary-opaque.png`
- Computed geometry: 4px TableContainer padding, 32px outer radius, and 28px first/last row-group corner radii.
- Computed selected-row indicator: neutral `rgba(15, 23, 42, 0.1)` in light mode; no brand-purple boundary remains.
- Computed copy action at rest and forced `:hover`: `data-variant="secondary"`, opaque white surface, opacity 1.

### Findings and fixes

1. P1 — The previous Table preview split behavior across unrelated specimens and did not demonstrate the product-level composition. Replaced the lead example with one interactive team table using Nerio Checkbox, Button, Icon, Table, and Pagination components.
2. P1 — Added sortable Name, page selection, select-all/row selection, pointer drag-and-drop, and Arrow Up/Arrow Down reordering on the drag handles while keeping sorting, selection, pagination, and reorder state consumer-owned.
3. P1 — Restored `--n-table-container-padding` to `--n-space-1`, mapped the outer radius to `--n-radius-2xl`, introduced `--n-table-row-group-radius` at `--n-radius-xl`, and changed the selected-row indicator to a neutral border token.
4. P1 — Returned the shared floating code-copy control to Secondary and locally pinned its resting, hover, and active backgrounds to the opaque semantic surface.
5. P2 — Reduced only the Table documentation preview's inline chrome padding so the complete row content and one-line pagination footer remain visually balanced at the reviewed desktop width.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Interactive Table preview follow-up QA — 2026-07-21

### Source truth

- Browser comments on `http://localhost:3000/docs/components/table`: keep the results and Pagination footer inside the muted shell, remove the selected row's lower divider, reduce drag-handle emphasis, drag the complete row rather than only the icon, remove the header divider before the checkbox, and soften the current-page border.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-preview-follow-up-final.png`
- Computed shell: muted surface, 1px subtle border, 32px radius, and 4px padding; the results label and Nerio Pagination are descendants of the same shell.
- Computed checkbox-header inline-start border: none.
- Computed selected-row lower border width: 0px.
- Computed drag-handle foreground: disabled neutral text; the native drag image is explicitly set to the containing table row.
- Computed current-page boundary: 1px subtle neutral border.

### Findings and fixes

1. P1 — Pagination previously sat outside the neutral grouping surface. Added one consumer-level product shell around the single-table `TableContainer` and Pagination footer without violating the Core rule that TableContainer directly wraps one Table.
2. P1 — Selected rows retained the ordinary inter-row divider. The Core Table recipe now removes the lower border from truthful selected/current tbody rows while keeping header and footer rows neutral.
3. P1 — The native drag preview was the small draggable Button. Kept the handle as the drag initiator but supplied its containing `tr` to `DataTransfer.setDragImage`, so the complete row moves visually; the source row also receives a subdued dragging state.
4. P2 — Removed the preview-only header separator before the checkbox and remapped the handle to the disabled neutral foreground.
5. P2 — Remapped `--n-pagination-border-current` from the interactive accent border to the subtle neutral border; current state remains conveyed by background, font weight, and `aria-current="page"`.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Dark border contrast QA — 2026-07-21

### Source truth

- User review on `http://localhost:3000/docs/components/table`: dark-mode borders were too low-contrast to remain perceptible.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final dark-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-dark-border-contrast.png`
- Computed dark border ladder: subtle `rgba(255, 255, 255, 0.10)`, default `rgba(255, 255, 255, 0.16)`, strong `rgba(255, 255, 255, 0.20)`.
- Computed light border ladder remains unchanged at 6%, 10%, and 12% cool-dark alpha.

### Findings and fixes

1. P1 — The dark semantic border ladder used 6%, 10%, and 12% white alpha, leaving table separators and restrained boundaries almost indistinguishable from the canvas. Raised the ladder to 10%, 16%, and 20% while preserving semantic hierarchy.
2. P1 — Explicit dark mode and system-dark mode must remain equivalent. Updated both scopes and verified the runtime token contract.
3. P2 — Foundation documentation still described the old dark default alias. Updated the documented adaptive-border mapping to `--n-white-a-16`.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Documentation Table and Dropdown QA — 2026-07-21

### Source truth

- Browser comment 1 on `http://localhost:3000/docs/components/list`: page-actions menu rendered with the wrong dark overlay treatment.
- Browser comment 2 on the same route: documentation tables did not inherit the updated Nerio Table visual contract.

### Implementation evidence

- Final Dropdown screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/list-dropdown-final.png`
- Final documentation Table screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/list-documentation-nerio-table.png`
- URL: `http://localhost:3000/docs/components/list`

### Findings and fixes

1. P1 — Page actions used a custom `div role="menu"` and inherited global dark overlay tokens. Replaced it with Nerio `DropdownMenu`, removing duplicate outside-click and Escape handling.
2. P1 — DropdownMenu consumed generic overlay color aliases directly. Introduced dedicated `--n-dropdown-*` surface, border, spacing, item-state, danger, disabled, and focus aliases and synchronized Registry and docs metadata.
3. P1 — The shared DocumentationTable and two component-local copies rendered raw table anatomy. Consolidated them onto Nerio `TableContainer`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`.
4. P1 — Foundation pages and the component playground mixed the Nerio root with raw `thead`, `tbody`, `tr`, `th`, and `td` elements. Migrated every docs table slot to the public Nerio components; no raw table tags remain under `apps/docs`.
5. P2 — A stale app-local selector could still override the refactored Dropdown surface during development. Renamed the app-local sizing hook and left all visual ownership in the Core Dropdown recipe.
6. P2 — The opened menu showed a browser focus outline around the popup surface. Removed the popup outline while preserving Base UI item highlighting and focus rings.

No unresolved P0, P1, or P2 findings remain in the reviewed states.

final result: passed

## Table visual QA — 2026-07-21

### Source truth

- Approved Table reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-0c15317f-3400-4077-9c25-29567bc47725.png`

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final local screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-stable-local-v3.png`
- The source reference and final rendered screenshot were reviewed together in the same visual comparison input.

### Findings and fixes

1. P1 — The original Core recipe read as a flat grid without the reference's neutral wrapper and continuous white row surface. Added restrained wrapper padding, a white body group, quiet headers, header dividers, and subtle row separators.
2. P1 — Hover and selected states resolved to the same white surface. Mapped hover and selected rows to distinct neutral semantic surfaces while keeping the states scoped to `tbody`.
3. P2 — The row group initially inherited the full outer container radius. Reduced the inner body corners to `--n-radius-lg` while retaining the larger outer container radius.
4. P2 — The first local preview used text labels for previous and next pagination controls. Replaced them with icon-only chevrons and preserved explicit accessible labels.
5. P2 — Native row headers rendered heavier than the reference. Normalized `tbody th` to the regular system weight without changing native semantics.

Sorting and pagination remain consumer-owned, the Table API and accessibility contracts are unchanged, and no unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Default-only documentation Table QA — 2026-07-21

### Source truth

- Browser comment on `http://localhost:3000/docs/components/table#api`: documentation reference tables must use the default Nerio Table recipe without a docs-specific visual layer.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table#api`
- Final API table screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-api-default-nerio.png`
- DOM audit: the API table resolves only the public `n-table` recipe; its parent resolves only `n-table-container`, with no documentation-specific class names.

### Findings and fixes

1. P1 — The shared documentation table composed the public Nerio slots but still applied `documentation-table*` classes for fixed layout, custom wrapping, vertical alignment, and code typography. Removed both classes and their CSS.
2. P1 — Playground API matrices still added custom minimum widths, cell sizing, alignment, and typography. Removed the `component-api-matrix` hook and its CSS.
3. P1 — Token foundation tables still applied table-specific column widths and alignment. Removed the container hooks and all associated table selectors while retaining only the swatch component's own styling.
4. P1 — A repository-wide source audit confirms there are no raw HTML table anatomy tags under `apps/docs`; documentation tables compose `TableContainer`, `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, and `TableCell`.

The Table documentation's explicit responsive, sticky, sortable, and pagination specimens retain only the styles required to demonstrate those documented behaviors. All reference and matrix tables now inherit the default Core Table visual contract with no docs-owned table styling.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Code copy button QA — 2026-07-21

### Source truth

- Browser comment on `http://localhost:3000/docs/components/table`: the transparent copy control allowed syntax-highlighted code to remain visible beneath it in dark mode.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final dark-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/code-copy-outline-opaque-dark.png`
- Computed button surface: opaque `rgb(0, 0, 0)` with the dark default border at 16% white alpha; the code block remains an independent 8% white-alpha surface.

### Findings and fixes

1. P1 — The shared `CodeExample` copy action used the translucent Secondary Button over readable code. Switched it to Outline and supplied the semantic default surface for both resting and hover states, so content cannot show through.
2. P1 — The defect affected every documentation snippet because the action is shared. Fixed the common component rather than applying a Table-only override.
3. P2 — Verified the actual copy interaction, accessible label, icon feedback, and dark-mode rendering after the visual change.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Table container padding QA — 2026-07-21

### Source truth

- Browser comment on the API table at `http://localhost:3000/docs/components/table#api`: the neutral TableContainer wrapper must use exactly 4px padding.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table#api`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-api-padding-4px-final.png`
- Computed `TableContainer` padding: 4px on the block-start, inline-end, block-end, and inline-start edges.

### Findings and fixes

1. P1 — TableContainer reused the density-aware cell padding token, producing a much wider neutral gutter than requested. Added the dedicated `--n-table-container-padding` component token mapped to `--n-space-1`.
2. P1 — Updated the complete Core contract: Tailwind recipe, Registry required tokens, component-reference metadata, Table token documentation, stable preview wrapper, and focused contract coverage.
3. P2 — Verified the API table in the same light-mode state as the source annotation and confirmed all four computed padding values equal 4px.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Table section gap and boundary QA — 2026-07-21

### Source truth

- Browser comments on `http://localhost:3000/docs/components/list#variants`: add a 4px gap between the header row and body row group, and add an outer table boundary.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/list#variants`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/list-table-gap-border-final.png`
- Computed vertical distance from the header row bottom to the first body row top: 4px.
- Computed TableContainer boundary: 1px solid `rgba(15, 23, 42, 0.06)` in light mode.

### Findings and fixes

1. P1 — Table header and body groups touched directly, flattening their hierarchy. Added `--n-table-section-gap` mapped to `--n-space-1` and rendered a non-semantic visual spacer before `tbody`.
2. P1 — `--n-table-container-border` resolved to `none`. Remapped it to the semantic subtle border while retaining the existing public customization point.
3. P1 — Synchronized the new section-gap token across Registry, component-reference metadata, Table docs, and focused contract coverage.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Table container padding follow-up QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/list#variants`: increase the TableContainer inner padding from 4px to 8px.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/list#variants`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/list-table-padding-8px-final.png`
- Computed TableContainer padding: 8px on all four edges; the 4px header/body gap and 1px outer border remain unchanged.

### Findings and fixes

1. P1 — The previously requested 4px container padding was superseded by the follow-up direction. Remapped `--n-table-container-padding` from `--n-space-1` to `--n-space-2`.
2. P2 — Updated focused contract coverage and verified the final light-mode geometry in the browser.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Page actions brand icon QA — 2026-07-21

### Source truth

- Browser comment on `http://localhost:3000/docs/components/table`: replace the generic action glyphs with recognizable brand SVG logos.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/page-actions-brand-icons.png`
- Verified the open menu at the same desktop state as the source annotation and confirmed Escape closes the Base UI-backed menu.

### Findings and fixes

1. P1 — Cursor, VS Code, ChatGPT, and Claude used generic adapter glyphs that did not identify their destinations. Replaced them with the corresponding `react-icons` SVG brand marks.
2. P1 — The page-actions menu still duplicated menu behavior in app-local state and a custom `div role="menu"`. Composed the trigger and items through Nerio `DropdownMenu`, restoring owned focus, Escape, outside-click, and foreground behavior.
3. P2 — Preserved the existing action labels, descriptions, external-link indicators, control sizing, and neutral overlay presentation.

No unresolved P0, P1, or P2 findings remain in the reviewed state.

final result: passed

## Page actions brand icon follow-up QA — 2026-07-21

### Source truth

- Browser annotation screenshot on `http://localhost:3000/docs/components/table`: the page-actions brand icons looked undersized and the ChatGPT mark did not read as the current OpenAI/ChatGPT logo.
- Official reference: OpenAI Design Guidelines, Blossom logo section.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Viewport: 1117 × 837 CSS pixels, light page with the dark DropdownMenu open.
- Full-view evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/page-actions-brand-icons-chatgpt-final.jpg`
- Focused menu evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/page-actions-brand-icons-chatgpt-focused.jpg`
- Computed icon geometry: Cursor, VS Code, ChatGPT, and Claude each render in an 18 × 18px visual box; the utility Markdown and external-link icons retain the normal menu size.

### Fidelity review

- Typography: unchanged and aligned with the existing DropdownMenu contract.
- Spacing and layout rhythm: passes; the larger brand marks remain aligned to the first text line without changing the menu grid or row height.
- Colors and tokens: passes; all brands use the menu foreground token in both modes rather than hard-coded brand colors.
- Image and asset fidelity: passes; ChatGPT uses the recognizable OpenAI Blossom/knot supplied by `react-icons`, with no handcrafted SVG or approximation.
- Copy and content: unchanged.

### Findings and fixes

1. P1 — The previous Bootstrap OpenAI glyph collapsed at the inherited 13px menu size and read as an unrelated rounded symbol. Replaced it with the clearer Remix OpenAI Blossom/knot asset.
2. P2 — Mixed icon libraries produced inconsistent optical sizes. Added one docs-scoped brand-icon hook that maps all four brands to the existing `--n-icon-size-lg` token while leaving utility icons untouched.
3. P2 — Verified the open interactive Nerio DropdownMenu in the in-app browser, checked all five leading SVG view boxes, and confirmed the four brand boxes resolve to 18 × 18px.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Table radius follow-up QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/table`: set the Table outer radius to 20px and the inner row-group radius to 16px.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-radius-20-16-final.jpg`
- Computed Primary geometry: 20px outer shell radius, 16px TableContainer/first-row/last-row inner radii, and unchanged 4px shell padding.
- Computed Secondary geometry: no outer shell, with the muted header pill resolving to the same 20px outer table radius.

### Findings and fixes

1. P1 — The prior 32px/28px pair was superseded by the new visual direction. Remapped `--n-table-container-radius` to `--n-radius-lg` (20px) and `--n-table-row-group-radius` to `--n-radius-md` (16px).
2. P2 — Updated focused contract coverage and the changelog so the canonical token mapping and documented recipe remain aligned.
3. P2 — Verified both presentation recipes in the in-app browser and confirmed no console warnings or errors.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Borderless Table and tbody clipping QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/table`: remove the Table's outer border and clip the inner tbody content.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final light-mode screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-borderless-tbody-overflow-hidden-final.jpg`
- Computed Primary styles: outer shell and TableContainer both resolve to `0px none`; tbody resolves to `overflow: hidden`; 20px outer and 16px inner radii remain unchanged.
- Computed Secondary styles: outer shell and TableContainer both resolve to `0px none`; tbody resolves to `overflow: hidden`.

### Findings and fixes

1. P1 — The default `--n-table-container-border` still created an external boundary around the neutral wrapper. Set its default to `none` while preserving the public token as an opt-in customization point.
2. P1 — The body row group relied only on cell corner radii. Added `overflow: hidden` to the native tbody slot so child backgrounds and interaction states remain clipped to the 16px group corners.
3. P2 — Updated focused contract coverage and verified both presentation recipes in the in-app browser with no console warnings or errors.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Page actions filled-brand stroke correction QA — 2026-07-21

### Source truth

- User annotation on `http://localhost:3000/docs/components/badge`: the brand SVGs still looked distorted because filled marks appeared to inherit outline-icon treatment.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/badge`
- Final menu evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/page-actions-brand-icons-no-outline-final.jpg`
- Computed utility icon: 13 × 13px, `fill: none`, `stroke-width: 2px`.
- Computed Cursor, VS Code, ChatGPT, and Claude marks: 18 × 18px, `fill: currentColor`, `stroke-width: 0px`.

### Findings and fixes

1. P1 — Nerio `Icon` intentionally supplies `strokeWidth={2}` for the default outline adapter, but that prop overrode `react-icons`' zero-stroke default and outlined every filled brand path. Rendered the four brand components directly with protected decorative SVG attributes while keeping normal utility icons on the Nerio `Icon` contract.
2. P2 — Direct brand rendering no longer inherited the `Icon` component's size utility. Added explicit token-driven block and inline dimensions to the existing docs-scoped brand hook, preserving the approved 18 × 18px optical size.
3. P2 — Verified the open Base UI-backed DropdownMenu in the in-app browser and confirmed no console warnings or errors.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Table states, EmptyState, typography, and documentation follow-up QA — 2026-07-21

### Source truth

- Seven user annotations on `http://localhost:3000/docs/components/table`: keep checked rows neutral and geometry-stable, remove Pagination's current border, round row hover surfaces, compose EmptyState, remove accidental monospace, restore visible list bullets, and align cell content to the top.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Primary selection and Pagination evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-primary-selected-no-shift-final.jpg`
- EmptyState evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-empty-state-component-final.jpg`
- Accessibility list and top-aligned API table evidence: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-accessibility-primary-bullets-final.jpg`
- Checked-row geometry before/after: 45px row height, identical six column widths, 11.0547px Checkbox top offset, 14 × 14px Checkbox, no selection indicator width, and a retained transparent 1px lower boundary.
- Pagination current state: transparent background and border with primary action text.
- Row geometry: group-only 16px corners in Primary and 16px logical start/end radii on every Secondary tbody row.
- Documentation computed styles: sans-serif Pattern labels, `vertical-align: top` cells, `list-style-type: disc`, and primary-colored markers.

### Findings and fixes

1. P1 — Removing a selected row's lower border and adding a selection indicator changed row height and column geometry. Kept the boundary width stable, made it transparent in the Checkbox composition, removed the extra row selection treatment, and aligned the inline Checkbox independently of its mounted indicator.
2. P1 — Pagination still communicated the current page with a neutral border and fill. Remapped its current background and border to transparent and added a public primary-foreground token while preserving `aria-current`, weight, focus, and forced-colors treatment.
3. P1 — Secondary intermediate hover surfaces ended with straight edges. Kept Primary's unified tbody radius and applied the 16px row-group radius to the logical first and last cells of each Secondary row.
4. P1 — The empty preview used raw text instead of the released component. Composed compact EmptyState title and description inside the spanning TableCell.
5. P2 — Pattern labels inherited monospace through a broad `codeColumns` setting. Kept recipe and state labels sans-serif while retaining code typography only for actual slots, props, and tokens.
6. P2 — Preflight removed list markers from `.doc-list`. Restored disc markers explicitly and mapped their color to the primary action token.
7. P2 — Table cells used the browser's middle alignment in uneven rows. Added top alignment to the shared Table recipe and verified the token reference table.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Table vertical centering follow-up QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/table`: restore middle alignment so every value and control is vertically centered within its row.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-cells-vertical-middle-final.jpg`
- Computed target cell: `ethan@acme.com`, `vertical-align: middle`, 45px row height.
- Computed alignment set across all rendered Nerio Table header and body cells: `middle` only.

### Findings and fixes

1. P1 — The explicit top-alignment recipe introduced uneven control and multiline-content positioning across otherwise uniform data rows. Replaced it with explicit middle alignment in the shared Core Table recipe.
2. P2 — Updated the focused contract assertion and changelog wording to keep the source, tests, and documentation synchronized.
3. P2 — Verified the live local page in the in-app browser with no console warnings or errors.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Table sorting and row-reorder polish QA — 2026-07-21

### Source truth

- User follow-up on `http://localhost:3000/docs/components/table`: make every data header sortable with a trailing arrow but no button-like hover, remove the divider before select-all, move a floating row instead of the table during drag, and shorten the drag tooltip.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-sorters-drag-polish-final.jpg`
- Both Primary and Secondary previews render sortable Name, Role, Status, and Email headers; selecting Role produces `aria-sort="ascending"` only on that column.
- Sort controls resolve to a transparent background and border, including their forced hover and active overrides.
- The select-all header pseudo-divider resolves to `display: none`.
- The icon-only reorder control retains its row-specific accessible name while its visible Tooltip resolves to `Reorder`.
- Reordering builds one detached table containing only a cloned row with locked cell widths, disables text selection on the live table surface, dims the source row, and marks the current drop target with an inset primary insertion line.

### Findings and fixes

1. P1 — Name alone looked like a separate ghost Button while the other headers looked static. Composed the same sortable Button and trailing directional icon in all four data headers, while forcing its resting, hover, and active surfaces to remain transparent.
2. P1 — The shared decorative header divider appeared immediately before the select-all Checkbox. Suppressed that one pseudo-element without removing dividers between data columns.
3. P1 — Passing the live `tr` to `setDragImage` allowed Chromium to capture surrounding table content and text selection. Built a detached, width-locked row clone as the drag image and added source, target, and selection states to keep the gesture legible.
4. P2 — The icon-only Button inherited its long accessible name as Tooltip copy. Preserved the detailed screen-reader label and provided the concise visible Tooltip `Reorder` explicitly.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Secondary hover radius, Pagination variants, and EmptyState action QA — 2026-07-21

### Source truth

- Three user annotations on `http://localhost:3000/docs/components/table`: Secondary rows stay square until hover, Pagination uses outline controls and a secondary current page, and the table EmptyState must use the released component with a secondary create action.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Secondary and Pagination screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-secondary-pagination-variants-final.jpg`
- EmptyState screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-empty-state-create-action-final.jpg`
- Secondary rows explicitly resolve all resting inline corner radii to 0 and apply the 16px row radius only through `tr:hover`.
- Pagination defaults map to Button outline background, border, foreground, and shadow aliases; current controls map to Button secondary background, border, foreground, and no-shadow aliases.
- The empty table row composes `EmptyState`, `EmptyStateMedia`, `EmptyStateHeader`, and `EmptyStateActions`; its action is a small secondary `Create project` Button with the Nerio Plus icon.

### Findings and fixes

1. P1 — Permanent per-row corners bent the visible separators in the open Secondary presentation. Removed resting row radii and applied them only to the hovered row.
2. P1 — The current Pagination page used primary text alone instead of the requested control hierarchy. Mapped default and current Pagination tokens to the established outline and secondary Button recipes.
3. P2 — The table preview already used the system EmptyState anatomy, but it omitted its action slot and therefore looked less complete than the canonical component preview. Added the released EmptyStateActions slot with a secondary create action and synchronized the code excerpt.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Transparent table EmptyState surface QA — 2026-07-21

### Source truth

- User annotation on `http://localhost:3000/docs/components/table`: EmptyState represents the absence of rows and must not inherit a white row background or row hover treatment.

### Implementation evidence

- URL: `http://localhost:3000/docs/components/table`
- Final screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/21/019f8343-bceb-7c70-9bff-261036ba357a/table-empty-state-transparent-row-final.jpg`
- Empty body cell computed background: transparent.
- Empty body cell computed border: transparent.
- Focused action state retains the same transparent cell background and border; browser console remains clean.

### Findings and fixes

1. P1 — The spanning EmptyState cell inherited the standard tbody row background, divider, hover, and focus-within surface. Marked the documentation composition's empty row explicitly and neutralized those row visuals in every interaction state.
2. P2 — Kept the table header, system EmptyState anatomy, icon, copy, and secondary `Create project` action unchanged.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed
