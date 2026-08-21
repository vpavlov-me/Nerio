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

## Playground sidebar layout and design-system controls — 2026-08-22

### Source visual truth

- Layout-only reference supplied by the user:
  `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-34a59e44-8316-441b-a561-a55feaba77bd.png`.
- Source pixels: 2940 × 1670. The source was normalized to 1470 × 835 for comparison.
- The reference defines composition only: a persistent settings sidebar on the left and a large
  visualization canvas on the right. Its product header, dark sidebar treatment, cards, presets,
  and Get Code action are explicitly outside the approved visual target.

### Implementation evidence

- URL: `http://127.0.0.1:3000/playground`.
- Browser: Codex in-app browser.
- CSS viewport and implementation pixels: 1470 × 837 at device pixel ratio 1.
- State: Light, Purple, Slate, Comfortable, 100%, Full, Geist, Calm, Raised.
- Implementation screenshot:
  `/Users/vladimirpavlov/Documents/Nerio Design System/playground-layout-implementation.png`.
- Normalized full-view comparison:
  `/Users/vladimirpavlov/Documents/Nerio Design System/playground-layout-comparison.png`.
- Browser geometry: the 288px settings panel begins at x=26.4 and the 1102.8px canvas begins at
  x=340.8. Both begin at y=68 and fill the available application height without body overflow.
- Primary interactions tested: Font to Space Grotesk, UI scale to 110%, Color mode to Light, Reset,
  and all nine settings present in the accessibility tree. The selected font token, scaled card
  padding, local mode, and Reset state updated in the rendered page. A second font pass applied IBM
  Plex Sans to the live Invite teammates Dialog portal.
- Browser console: no warnings or errors.
- Production route CSS resolves to 353216 bytes after adding paired root/canvas runtime selectors,
  3008 bytes above the previous route budget. The reviewed budget is 357312 bytes, preserving the
  policy's approximately 4 KiB headroom without changing JavaScript or runtime-transfer limits.

### Required fidelity surfaces

- Fonts and typography: passed. The sidebar keeps Nerio's existing hierarchy and the Font control
  uses the seven official typography recipes. The reference type treatment was not copied because
  the source is layout-only.
- Spacing and layout rhythm: passed. The settings and visualization regions are adjacent desktop
  columns with a token gap, aligned top edges, independent scrolling, and no document overflow.
  The sidebar is intentionally wider than the normalized reference so nine labeled system controls
  remain readable.
- Colors and visual tokens: passed. The implementation retains Nerio semantic surfaces and supports
  local Light, Dark, and System modes rather than copying the reference palette.
- Image quality and asset fidelity: not applicable. No visual asset from the reference belongs to
  the approved layout target; the existing Nerio scenario assets and adapter icons remain intact.
- Copy and content: passed. Settings copy is concise and English-only. Presets, Copy Code, and Get
  Code are absent; Shuffle is the only optional utility action.
- Responsiveness: passed for the approved desktop target. Existing CSS contracts stack the settings
  panel above a 72dvh canvas below 900px; a separate mobile visual was not part of the supplied
  reference.

### Findings and comparison history

- Pass 1: no actionable P0, P1, or P2 difference remained after normalization. The source and
  implementation share the approved left-settings/right-canvas composition. Differences in header,
  colors, content cards, sidebar width, and utility actions are intentional product constraints from
  the user's layout-only scope.
- Focused-region comparison was unnecessary because the approved target is the full-page region
  relationship, and the normalized full view keeps both boundaries and controls legible.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Adaptive overlay surfaces with dark Tooltip exception — 2026-08-12

### Source truth

- User decision: revoke the rule that every surface displayed above the interface is permanently
  dark.
- Popovers, menus and Select popups, Command, Dialog, Sheet, Calendar, and Toast use the standard
  mode-aware surface and text hierarchy. Tooltip remains intentionally dark in every mode.

### Implementation and verification

- `--n-overlay-*` now resolves through adaptive surface, text, control, selected, border, status,
  and elevation semantics: white with dark text in light mode and black with light text in dark
  mode.
- `--n-overlay-glass-*` retains the former translucent black palette only for Tooltip; chart
  tooltips follow the same narrow exception.
- Toast moved from the glass aliases to the standard overlay family while preserving its 8px
  collapsed stack step, opaque background cards, and 20px maximum radius.
- Dialog and Sheet retain their blurred modal backdrop and established motion, anatomy, safe-area,
  and focus behavior.
- The current design decision, component guidance, LLM reference, token validator, UI contracts,
  and browser assertions now express the same rule. The original visual-language audit is explicitly
  marked as superseded historical evidence.

### Regression evidence

- Token tests: 50/50 passed.
- Token validation: passed with 950 definitions and 46 registry items.
- UI contracts: 175/175 passed.
- Focused docs-browser coverage passed for Data Display/Feedback and Navigation/Layout/Overlays,
  including adaptive light/dark Toast surfaces and a dark Tooltip in both modes.
- Visual regression: 22/22 passed after reviewing and accepting only the four intentionally changed
  reduced-motion baselines for Dialog, Sheet, Popover, and Dropdown Menu. The Tooltip baseline was
  unchanged.

final result: passed

## Playground Label, Slider, and Tabs polish — 2026-08-12

### Source truth

- Three user browser annotations on `http://127.0.0.1:3001/playground`: labels use medium regular primary text; Slider visible vertical gaps are about 8px; segmented Tabs follow the Playground `Full` radius.
- Source visual evidence: the three 1117 × 837 browser annotation screenshots supplied in the current review thread.

### Implementation and verification

- Label: 14px, weight 400, computed primary text color.
- Slider: 8px header-to-track and 8px track-to-description.
- Tabs with `Radii = Full`: list radius 999px; trigger and indicator radius 18px on 32px-high controls, producing a pill shape.
- The local Playground was visually inspected in the in-app browser in the annotated light, Purple / Slate, Comfortable, Full, Raised state.
- Focused Playground and Slider browser tests passed.
- The visual regression suite passed 22/22 after reviewing and updating the intentional Label and Slider snapshots.
- Formatting, lint, typecheck, docs validation, token tests, token validation, and UI tests passed.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states.

final result: passed

## Playground scenario catalog — 2026-08-09

### Source truth

- User reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png`
- Audit screenshot: `design-qa-artifacts/playground-audit-35/01-current-catalog.png`
- Final browser screenshot: `design-qa-artifacts/playground-audit-35/05-final-masonry.png`
- Detailed audit: `design-qa-artifacts/playground-audit-35/audit.md`

### Findings and fixes

1. P1 — Removed the permanently embedded Calendar. Appointment and milestone scenarios now expose Calendar only through DatePicker popovers.
2. P1 — Removed custom scene surfaces and every Card-inside-Card composition. All 35 scenarios render from exported Nerio Core primitives.
3. P2 — Expanded the catalog from 16 cards in four columns to exactly 35 cards in seven desktop columns.
4. P2 — Added real masonry packing with measured row spans; shorter cards no longer inherit the height of the tallest card in their row.
5. P2 — Added three two-column table scenarios for team access, invoices, and API keys.
6. P2 — Rebound component-level semantic tokens to the active Playground palette so system appearance cannot produce mismatched card, text, and input colors.

### Scenario coverage

The catalog now includes workspace setup, sign-in, social links, account access, notification preferences, appointment booking, new milestones, two empty states, billing, payouts, savings, transactions, three data tables, upload and release states, command and navigation patterns, security, password reset, dialog, sheet, popover, menu, toast, loading, error recovery, plans, feedback, destructive confirmation, activity, search, and feature flags.

### Required fidelity surfaces

- Typography: existing Geist type styles and Core component hierarchy are preserved.
- Layout rhythm: a seven-column, horizontally scrollable masonry canvas uses token spacing and independent vertical packing.
- Colors and tokens: canvas, cards, controls, tables, statuses, and overlays resolve from the selected Playground theme.
- Assets: existing Nerio avatar assets and adapter icons are reused.
- Copy: all scenario copy is concise, English-only, and product-contextual.

### Interaction evidence

- Browser metrics: 35 cards, 7 columns, 3 wide cards, zero nested Cards, and zero inline Calendars.
- DatePicker opened the selected August 18, 2026 Calendar in a themed portal and removed it on Escape.
- Dialog portal inherited comfortable density; Toast rendered the 35-scenario confirmation.
- The canvas scrolled to `left=700, top=700` without body overflow or zoom controls.

No actionable P0, P1, or P2 findings remain.

final result: passed

## File upload state block QA — 2026-08-07

### Source truth

- User-provided layout reference: a grouped five-file upload queue showing ready, uploading, processing, failed, and uploaded states.
- Latest browser annotation: keep the five-file queue, remove the Progress bar, add an Upload action to CardHeader, use secondary icon actions with tooltips, and simplify CardFooter to Cancel plus disabled Save without a separator.

### Implementation evidence

- URL: `http://localhost:3000/views/blocks/file-upload-state`
- Desktop viewport and implementation pixels: 1117 × 837 at device scale factor 1.
- Desktop screenshot: `/tmp/nerio-file-upload-revision-desktop.png`
- Mobile viewport: 390 × 844.
- Mobile implementation pixels: 390 × 844 at device scale factor 1.
- Mobile screenshot: `/tmp/nerio-file-upload-revision-mobile.png`
- Full-view comparison: the desktop capture verifies the Card hierarchy, all five queue states, header action, row actions, and footer state together.
- Focused comparison: the live `Delete file` tooltip was opened on the first row and verified through the rendered accessibility tree; a separate crop was unnecessary because the label and control are readable in the desktop capture.
- Browser console: no errors.

### Findings and fixes

1. P1 — The original preview demonstrated only one upload and did not communicate the complete state model. Replaced it with a five-item batch queue covering ready, uploading, processing, failed, and uploaded states.
2. P1 — The upload content floated without a clear container or batch-level hierarchy. Composed it inside Card header, content, and footer regions with a concise queue summary and shared actions.
3. P1 — The first implementation added Progress beneath the uploading Item, but the approved revision keeps this state compact. Removed Progress while retaining the visible `Uploading · 64%` status.
4. P2 — The first mobile pass placed the tall Card beneath the fixed back control without enough clearance. Added responsive block-view spacing and verified the corrected mobile composition.
5. P2 — The footer's summary, separator, and retry-oriented actions did not reflect the final save workflow. Removed the separator and summary, then replaced the actions with Cancel and a disabled Save control.
6. P2 — File actions were low-affordance ghost buttons without supplementary labels, and retry used an upload glyph. Switched them to secondary icon buttons, added `Delete file` and `Retry file` tooltips, and exposed the semantic RefreshCw icon through the Nerio adapter.
7. P2 — The Card did not expose the batch's entry action. Added a secondary Upload action through CardAction in the header.

### Comparison history

- Pass 1: five queue states and responsive Card composition passed, but the later annotation superseded the Progress, footer, and row-action treatment.
- Pass 2: the 1117 × 837 desktop capture verifies the revised action hierarchy and the 390 × 844 capture verifies that rows remain legible and scroll naturally on mobile.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Sign in Block structure and Block View navigation QA — 2026-08-07

### Source truth

- `browser://comments/sign-in-structure-1` — the maintainer-supplied structural reference attached
  to Browser Comment 1. The source image is 1628 × 1302 pixels and defines the required hierarchy:
  title and description, email, a password label row with recovery navigation, one Login action,
  and a centered account-creation prompt. The maintainer explicitly scoped the image to structure,
  not pixel-for-pixel styling.
- The accompanying 1117 × 837 browser annotation identifies the outer preview frame, insufficient
  Card padding, and missing gallery-return action in the pre-fix implementation.

### Implementation evidence

- URL: `http://127.0.0.1:3000/views/blocks/sign-in`
- Browser: Codex in-app browser.
- Final comfortable screenshot:
  `/Users/vladimirpavlov/Documents/Nerio Design System/docs/audits/screenshots/sign-in-comfortable.jpg`
- Implementation capture: 1280 × 720 pixels, matching the 1280 × 720 CSS viewport at device scale
  factor 1.
- The differently proportioned source was not geometrically normalized because it is an explicit
  structure-only reference. The Card region was compared directly for hierarchy and proximity.
- Focused measurements: comfortable Card padding 24px with a 20px form gap; compact Card padding
  20px with a 16px form gap. The Card remains 416px wide in comfortable density.
- Primary interactions tested: Login and Enter do not submit or change state, the visual Forgot
  password and Sign up affordances do not navigate, and Back to Blocks remains the only working
  action and returns to `/blocks`.
- Catalog thumbnail evidence: `data-preview-thumbnail="true"` is present, the updated Sign in
  heading renders in the iframe, and `.block-view__back` resolves to `display: none`.
- Browser console errors: none.

### Required fidelity surfaces

- Fonts and typography: passed. The implementation keeps Nerio Heading, Text, Label, and Button
  typography and preserves the reference hierarchy without importing an external font treatment.
- Spacing and layout rhythm: passed. The outer preview frame is removed, the Card is centered, and
  density-aware outer padding remains larger than the internal form gap in both reviewed densities.
- Colors and visual tokens: passed. All surfaces, borders, actions, focus states, and text roles use
  existing Nerio semantic tokens and continue to support theme and mode switching.
- Image quality and asset fidelity: not applicable. The reference contains no image assets; the Back
  action uses the existing Nerio icon adapter rather than a custom drawing.
- Copy and content: passed. The complete Login structure is present, Google login is intentionally
  absent, and recovery/account-creation affordances remain visible without acting as navigation.

### Findings and comparison history

1. P1 — The pre-fix Sign in Block omitted the account-creation prompt and placed recovery navigation
   below the primary action. Rebuilt the form hierarchy to match the supplied structure and verified
   the revised Card region.
2. P1 — The full Block View was wrapped in a large bordered preview container. Replaced it with a
   width-only content wrapper; the final full-page capture has no preview border or nested canvas.
3. P2 — Card padding was smaller than the distance between semantic form groups. Raised the Core
   medium Card padding to 24px in comfortable density and 20px in compact density while making the
   Sign in form gap density-aware at 20px and 16px respectively.
4. P1 — The first revised Login action submitted the form and the visual recovery/account actions
   navigated to other previews. The follow-up product decision makes every action inside a public
   Block preview demonstrative only: click, auxiliary-click, keyboard activation, and form
   submission are intercepted at the preview boundary without changing the enabled visual
   treatment.
5. P2 — Public Block Views had no direct return path to the gallery. Added a Nerio secondary Back to
   Blocks action to every public View and suppressed it only inside non-interactive catalog
   thumbnails.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states. A focused Card comparison
was required because the structural reference targets label/action alignment and proximity rather
than the surrounding desktop canvas.

final result: passed

## Playground controls, Slider rhythm, and nested Tabs QA — 2026-08-07

### Source truth

- Six user annotations on `http://127.0.0.1:3001/playground`: Select preview controls use compact segmented Tabs; Slider anatomy has tighter vertical rhythm; the DropdownMenu trigger is centered and content-width with a leading icon; Badge tones label themselves; segmented active text remains readable; and content-layout Tabs hug their triggers by default.
- Source visual evidence: the six 1117 × 837 browser annotation screenshots supplied in the current review thread.
- Existing product truth: Nerio Core Tabs, Slider, Button, Badge, and DropdownMenu components and the live Playground theme controls.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground`
- Viewport: 1117 × 837 CSS pixels at device scale 1; light appearance, purple accent, comfortable density, full radius, 100% scaling, calm motion, flat panel style.
- Select: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-select-segmented-controls.jpg`
- Slider: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-slider-tight-anatomy.jpg`
- DropdownMenu: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-dropdown-hug-trigger.jpg`
- Badge: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-badge-self-describing.jpg`
- Tabs: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-tabs-segmented-hug-contrast.jpg`
- Global preview controls follow-up: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-input-segmented-tabs.jpg`
- All implementation captures are 1117 × 837 JPEGs and match the CSS viewport 1:1; no density normalization was required.
- Focused browser measurements: Select segmented list 266.27px wide with 2px padding and a 20px radius; Slider anatomy gap 4px; DropdownMenu trigger 117.99 × 32px; nested segmented Tabs list 232.66px wide; active text `rgb(15, 23, 42)` over a white indicator.

### Required fidelity surfaces

- Fonts and typography: unchanged Core typography; self-describing Badge labels and Tabs labels retain the intended UI weight, size, and wrapping.
- Spacing and layout rhythm: passes; Slider anatomy uses a 4px internal gap, the action trigger hugs its content, and segmented Tabs no longer stretch across their parent grid.
- Colors and tokens: passes; nested segmented Tabs resolve their own raised indicator and primary foreground instead of inheriting the outer bordered accent treatment.
- Image quality and assets: no raster assets are present in the reviewed surfaces; the DropdownMenu leading mark uses the existing Nerio icon adapter.
- Copy and content: passes; Badge tone names are inside their badges, including the readable `primary soft` label, with no redundant captions.

### Comparison history, findings, and fixes

1. P1 — Nested segmented Tabs inherited bordered indicator styling from the outer Playground option Tabs, producing a purple indicator with dark text. Scoped variant and orientation data to each Tabs anatomy node; the post-fix indicator is white with dark primary text.
2. P1 — Content-layout Tabs stretched to the full grid track. Made `TabsList` content layout explicitly `w-fit`, `max-w-full`, and `self-start`; explicit `layout="fill"` remains available.
3. P2 — Select preview controls used the bordered variant. Added a Matrix controls variant and rendered this section with the compact segmented recipe, including the canonical list background, padding, and radius.
4. P2 — Slider used an 8px anatomy gap, creating excessive distance on both sides of the 32px control. Remapped the shared Slider gap to 4px while preserving the control hit area.
5. P2 — DropdownMenu's trigger stretched to 376.28px and had no leading visual. Centered it in the existing inline composition and added the FileText icon; the post-fix trigger is 117.99px wide.
6. P2 — Badge previews repeated external tone captions and generic `Label` text. Removed the captions and placed each tone name inside its Badge.
7. P1 — The segmented recipe was initially limited to Select while the same Preview options control remained bordered elsewhere. Changed the shared Matrix default to segmented and verified Button, Toggle, Input, FileInput, Textarea, FormGroup, Checkbox, Switch, Select, Slider, DatePicker, and Sheet all resolve to the segmented variant with content-width geometry.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states. Focused component captures were required because the typography, compact widths, and nested indicator treatment were too small to verify reliably from one full-page screenshot.

final result: passed

## Playground specimen architecture refinement QA — 2026-08-07

### Source truth

- `browser://comments/playground-specimen-refinement-1-34` — the 34 annotated Playground captures
  supplied by the maintainer at 1117 × 837 CSS pixels. The annotations define the required
  relationship between section controls and preview frames, the reduced specimen counts, richer
  overlay content, and the requested live radius/accent behavior.
- The individual source captures are state-specific rather than one continuous page image; each
  selected component and its written annotation is treated as the visual contract for that section.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground`
- Browser: Codex in-app browser, 1117 × 837 CSS pixels, device scale factor 1.
- External controls and first specimens:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-refined-controls.png`
- Authentication Dialog with global radius set to `none`:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-auth-dialog-radius-none.png`
- Dropdown Menu and open nested Share submenu:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-dropdown-submenu.png`
- Single Card specimen:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-single-card.png`
- Primary interactions tested: section tabs, Select popup, radius preset, accent swatch, Dialog,
  Dropdown Menu keyboard submenu, and standalone Switch/Checkbox controls.
- Browser console warnings and errors: none.

### Full-view and focused comparison

- The full-view comparison confirms that variant/state tabs now sit between the section header and
  the bordered preview rather than inside the preview surface. Preview frames contain only the
  current component demonstration.
- Focused comparisons were required for the portal-owned Select/Dialog radius, the nested menu, and
  the single Card width. Computed Select popup radius and the document overlay token both resolve to
  `0px` under the `none` preset. The blue accent resolves both
  `--n-color-action-primary` and `--n-tabs-accent-color` to `#3478d4`.
- The first Card pass retained the former three-column grid and narrowed the only remaining Card.
  The post-fix capture resolves the single Card to a readable 376px width centered in its preview.

### Required fidelity surfaces

- Fonts and typography: passed. Existing Major Second heading hierarchy and Geist UI roles remain
  unchanged; new labels and descriptions use existing Heading, Text, Field, and Label primitives.
- Spacing and layout rhythm: passed. External controls use one consistent section-level placement;
  preview content is centered, multi-variant displays wrap, and the single Card no longer occupies a
  stale one-third column.
- Colors and visual tokens: passed. Portal surfaces now inherit the live Playground token map from
  the document root, so Select, Dialog, Sheet, Popover, Dropdown Menu, and Tabs respond to radius and
  accent changes without local literals.
- Image quality and asset fidelity: passed. Avatar examples reuse the existing preview assets and
  adapter icons; no placeholder art, handcrafted SVG, or emoji was introduced.
- Copy and content: passed. Examples use concise English product scenarios: authentication, privacy
  policy, workspace permissions, budgets, filters, project actions, and empty/loading states.

### Findings and comparison history

1. P1 — Tabs were nested inside preview frames, mixing specimen controls with the rendered
   component. Added one section control portal and transposed matrix previews so tabs live outside
   while the preview contains the selected specimen only.
2. P1 — Portal-owned overlays did not inherit Playground radius and accent variables. Mirrored the
   live scoped contract onto the document root for the lifetime of Playground and restored the prior
   document state on unmount.
3. P1 — Dialog, Sheet, Popover, Dropdown Menu, and Command examples used placeholder anatomy rather
   than realistic interaction. Replaced them with working auth, privacy, permissions, filtering,
   project-action, nested-menu, and button-opened command scenarios.
4. P2 — Repeated Card, Breadcrumb, Table caption, Sidebar Primitive, and multi-state inline examples
   added noise. Reduced or removed them as annotated.
5. P2 — The first single-Card implementation inherited the old three-column track and became too
   narrow. Added an only-child grid rule and reverified the centered readable width.
6. P2 — Dropdown Menu showed a submenu affordance without submenu behavior. Added one keyboard-
   accessible nested level backed by Base UI and verified ArrowRight navigation.

No unresolved P0, P1, or P2 findings remain in the reviewed desktop states.

final result: passed

## Playground control anatomy follow-up QA — 2026-08-07

### Source truth

- `browser://comments/playground-control-follow-up-1-11` — the 11 annotated Playground captures
  supplied by the maintainer at 1117 × 837 CSS pixels. The focused captures define the expected
  Tabs treatment, self-describing specimen copy, native field anatomy, fixed Switch geometry, and
  wrapper-free Calendar popup.
- The source captures and implementation checks use the same route, viewport, CSS pixel density,
  light appearance, comfortable density, full radius, and 100% scaling.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground`
- Browser: Codex in-app browser, 1117 × 837 CSS pixels, device scale factor 1.
- Bordered Nerio Tabs and self-describing Button variants:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-button-tabs-refined.png`
- Input states and size placeholders:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-form-controls-refined.png`
- FileInput sizes, short divider, and optically compensated icon:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-file-input-refined.png`
- Checkbox and FormGroup content:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-choice-controls-refined.png`
- RadioGroup title and complete descriptions:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-radio-refined.png`
- Fixed Switch anatomy:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-switch-refined.png`
- Native Slider label, value, and description:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-slider-native-anatomy.png`
- Calendar-only popup surface:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-calendar-bare-popup-v2.png`
- Computed Switch root: 34 × 20 CSS pixels with fixed minimum and maximum inline dimensions.
- Browser console warnings and errors: none in the reviewed states.

### Full-view and focused comparison

- Full-view comparison confirms that every section-level selector is the released Nerio Tabs
  component in its bordered presentation and remains outside the preview frame.
- Focused comparisons were required because the annotations target compact control anatomy. Button,
  Input, FileInput, Checkbox, RadioGroup, Switch, Slider, and Calendar were inspected independently
  at the same viewport rather than judged from one distant full-page capture.
- The final Calendar surface has no outer padding, border, shadow, or extra visible card geometry.
  Its overlay background prevents the underlying trigger copy from bleeding through the Calendar.

### Required fidelity surfaces

- Fonts and typography: passed. Checkbox and RadioGroup titles use primary text at the component's
  intended weight; descriptions use the released secondary/tertiary text roles without custom bold
  wrappers.
- Spacing and layout rhythm: passed. Switch remains 34 × 20px, FileInput uses the shared short
  ButtonGroup divider length, and Calendar owns the complete visible popup rectangle.
- Colors and visual tokens: passed. Tabs use the live accent token, field copy uses semantic text
  roles, and no local color literals were added.
- Image quality and asset fidelity: passed. The existing adapter Upload icon is retained and
  optically aligned; no replacement art, custom SVG, or placeholder asset was introduced.
- Copy and content: passed. Buttons and size specimens describe themselves, checkbox/radio examples
  have meaningful labels and descriptions, and the Slider uses its native budget label/value copy.

### Findings and comparison history

1. P1 — Portaling only `TabsList` removed the ancestor variant context, so the selectors looked
   like unstyled text. Restored the released Tabs wrapper contract around the portaled list and
   verified the bordered underline resolves to the live accent color.
2. P1 — The Switch could grow across the specimen and was composed to the right of custom copy.
   Enforced its token width as width, minimum width, and maximum width in Core, then used the native
   Switch label and description anatomy in Playground.
3. P1 — Calendar inherited a visible Popover wrapper and later allowed underlying trigger text to
   show through the translucent surface. Removed wrapper geometry while retaining the overlay
   background/filter contract, then recaptured the open Calendar.
4. P2 — Button, Input, and FileInput previews repeated variant or size labels outside the controls.
   Moved the identifying copy into Button text and Input placeholders and removed matrix row labels.
5. P2 — FileInput used a full-height native divider and its Upload icon appeared optically
   off-center. Replaced the divider with the shared ButtonGroup-length pseudo-element and applied a
   token-sized inline optical compensation.
6. P2 — Checkbox, FormGroup, RadioGroup, and Slider examples bypassed released component anatomy.
   Rebuilt the specimens with native label, description, value, and group-title props; added the
   missing Public description and simplified the standalone Label example.

No unresolved P0, P1, or P2 findings remain in the reviewed desktop states.

final result: passed

## Long-content Dialog internal-scroll QA — 2026-08-07

### Source truth

- `browser://comment-1/privacy-policy-dialog-before` — the annotated open Privacy policy Dialog
  supplied by the maintainer at 1117 × 837 CSS pixels. The source identifies the missing internal
  scroll treatment, insufficient content length, and incorrect primary body-copy tone.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground#dialog`
- Browser: Codex in-app browser, 1117 × 837 CSS pixels, device scale factor 1.
- Source and implementation captures are both 1117 × 837 pixels; no density or crop normalization
  was required.
- Open Dialog at the top of its scroll range:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-long-dialog-internal-scroll-final.png`
- Open Dialog after scrolling its body:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-long-dialog-internal-scroll-scrolled.png`
- Computed body geometry: 705px client height, 1156px scroll height, `overflow-y: auto`,
  `scrollbar-width: thin`, and stable scrollbar gutter.
- Primary interactions tested: open, body scroll, Escape dismissal, reopen, and close-button focus.
- Browser console warnings and errors: none in the reviewed state.

### Full-view and focused comparison

- The full-view comparison confirms that the Dialog remains centered within the same viewport while
  its header and close control stay visible at the top of the bounded surface.
- The Dialog itself is the focused region: the source and implementation show the same open,
  dark-overlay state at the same viewport. A second implementation capture records the body after a
  180px scroll, demonstrating that only the content region moves.

### Required fidelity surfaces

- Fonts and typography: passed. Section headings and the Dialog title use primary text; policy
  paragraphs and the updated-at description use the overlay secondary role at the existing type
  scale and line height.
- Spacing and layout rhythm: passed. The surface is bounded by the shared viewport inset, the header
  occupies its own grid row, and the body owns the remaining scrollable row without overflowing the
  viewport.
- Colors and visual tokens: passed. Scrollbar thumb and track use overlay foreground-muted and
  control-background tokens; no local color literals were introduced.
- Image quality and asset fidelity: passed. No image assets are present or required; the released
  close icon remains unchanged.
- Copy and content: passed. The policy now contains substantive collection, use, retention,
  transfer, security, choices, changes, and contact sections, making the long-content behavior
  legible without placeholder repetition.

### Findings and comparison history

1. P1 — Dialog had no viewport maximum and therefore could grow beyond the available screen instead
   of establishing an internal scroll boundary. Converted the surface to a two-row grid, bounded it
   to the viewport inset, hid outer overflow, and assigned vertical overflow to the body.
2. P1 — The original policy remained shorter than the proposed demo scroll region, so no scrollbar
   appeared. Expanded the realistic policy copy and verified 1156px of content inside a 705px body.
3. P2 — Body paragraphs inherited the primary overlay foreground and competed with section
   headings. Applied the released secondary Text tone to all prose while preserving primary
   headings.
4. P2 — Platform overlay scrollbars could remain invisible until active scrolling. Added a stable,
   thin, tokenized scrollbar gutter, thumb, and track to the Core Dialog body.

No unresolved P0, P1, or P2 findings remain in the reviewed desktop state.

final result: passed

## Dialog Checkbox label-weight follow-up QA — 2026-08-07

### Source truth

- `browser://comment-1/remember-me-bold-label-before` — the annotated open Sign in Dialog at
  1117 × 837 CSS pixels, identifying the unexpectedly bold `Remember me` label.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground#dialog`
- Final screenshot:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-dialog-remember-me-native-checkbox.png`
- Source and implementation: 1117 × 837 pixels, device scale factor 1, open Dialog in light page
  appearance with the dark overlay surface.
- Computed label: native Checkbox `data-slot="label"`, `font-weight: 400`, primary overlay color.
- Primary interactions tested: open Dialog and inspect the composed Checkbox field.
- Browser console warnings and errors: none in the reviewed state.

### Comparison and required fidelity surfaces

- Focused comparison was sufficient because the annotation targets one readable label inside an
  otherwise unchanged Dialog. The final full Dialog capture confirms that surrounding field,
  footer, radius, and overlay geometry did not drift.
- Fonts and typography: passed; the label uses the component's normal weight and the description
  retains its smaller supporting role.
- Spacing and layout rhythm: passed; native Checkbox field gaps replace the custom flex wrapper.
- Colors and visual tokens: passed; primary label and supporting description use released semantic
  roles without local overrides.
- Image quality and asset fidelity: passed; no image assets are involved.
- Copy and content: passed; `Remember me` and its 30-day explanation are unchanged.

### Findings and comparison history

1. P2 — The Dialog demo bypassed Checkbox anatomy and wrapped its label in a manual `<strong>`.
   Replaced the custom label with Checkbox `label` and `description` props and removed the same
   stale pattern from the Sheet permissions demo.

No unresolved P0, P1, or P2 findings remain in the reviewed desktop state.

final result: passed

## Sheet hierarchy and nested-overlay QA — 2026-08-07

### Source truth

- `browser://comment-1/right-sheet-hierarchy-before` — the annotated open Right Sheet at
  1117 × 837 CSS pixels, identifying the hidden nested Select, weak content grouping, duplicated
  Default role label, lowercase title, and bold Checkbox label.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground#sheet`
- Closed Select and complete Sheet hierarchy:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-sheet-hierarchy-final.png`
- Open nested Select:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-sheet-nested-select-final.png`
- Source and implementation: 1117 × 837 pixels, device scale factor 1, right-side small Sheet in
  the same light page appearance and dark overlay state.
- Computed layering: Sheet `z-index: 51`; nested Select positioner `z-index: 52`.
- Computed Checkbox label: `font-weight: 400`, primary overlay color, native `data-slot="label"`.
- Primary interactions tested: open Sheet, open/close Default role Select, inspect all form labels,
  close Sheet.
- Browser console warnings and errors: none in the reviewed states.

### Comparison and required fidelity surfaces

- Full-view comparison confirms that the right-side geometry, footer placement, backdrop, and
  surrounding Playground remain unchanged.
- Focused open/closed captures verify both content hierarchy and portal layering; the Select options
  remain fully readable above the Sheet instead of being clipped or hidden behind it.
- Fonts and typography: passed. `Right sheet` uses sentence capitalization; Switch and Checkbox
  labels use their native normal-weight primary text.
- Spacing and layout rhythm: passed. Form blocks use a dedicated 24px vertical gap while each
  control keeps its own tighter label/description anatomy.
- Colors and visual tokens: passed. Floating overlays use the new derived overlay stacking token;
  no literal z-index or color was introduced in the demo.
- Image quality and asset fidelity: passed. No image assets are involved.
- Copy and content: passed. Default role appears once, and all descriptions remain attached to the
  correct control.

### Findings and comparison history

1. P1 — Select, Popover, Tooltip, and DropdownMenu positioners shared the base overlay z-index and
   therefore rendered beneath modal surfaces at base + 1. Added the derived
   `--n-overlay-floating-z-index` at base + 2 and applied it to every floating overlay family.
2. P2 — Default role was composed as both a Field label and a Select label. Removed the outer Field
   and kept the Select's native label and description.
3. P2 — Sheet controls mixed custom bold wrappers with component-owned anatomy and used one tight
   stack gap. Rebuilt Switch and Checkbox examples with native label/description props and added a
   dedicated 24px inter-block rhythm.
4. P2 — The generated side title preserved the lowercase enum value. Converted only its display
   label to sentence case while leaving the public side value unchanged.

No unresolved P0, P1, or P2 findings remain in the reviewed desktop states.

final result: passed

## Sheet trigger-row simplification QA — 2026-08-07

### Source truth

- `browser://comment-1/sheet-trigger-matrix-before` — the annotated Sheet preview at
  1117 × 837 CSS pixels, requesting removal of side labels and repeated size suffixes while keeping
  four side triggers in one row beneath the external size tabs.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground#sheet`
- Final screenshot:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-sheet-four-buttons-row.png`
- Source and implementation: 1117 × 837 pixels, device scale factor 1, light appearance, `sm`
  Sheet size tab selected.
- Preview text is exactly `left`, `right`, `top`, `bottom` with no additional row-label nodes.
- All four triggers resolve to the same 390.39px vertical coordinate and 28px height.
- Primary interactions tested: switch the external size tab and open each side trigger.
- Browser console warnings and errors: none in the reviewed state.

### Comparison and required fidelity surfaces

- The full-view capture confirms that the surrounding Sheet header, external tabs, preview frame,
  settings panel, and following Popover section are unchanged.
- The focused trigger row is fully readable in the full-view screenshot, so a separate crop was not
  needed.
- Fonts and typography: passed; only redundant labels were removed.
- Spacing and layout rhythm: passed; a dedicated four-column max-content grid keeps all triggers on
  one centered row with the system 12px gap.
- Colors and visual tokens: passed; existing secondary Button styling is unchanged.
- Image quality and asset fidelity: passed; no image assets are involved.
- Copy and content: passed; side names remain intact while the already-selected size is no longer
  repeated.

### Findings and comparison history

1. P2 — The generic Matrix renderer displayed each side twice and appended the active size to every
   trigger. Disabled row labels for this specimen and reduced trigger copy to the side value.
2. P2 — Removing labels alone still left the generic minimum item width, wrapping the four triggers
   into two rows. Added a Sheet-specific four-column layout without changing other matrix previews.

No unresolved P0, P1, or P2 findings remain in the reviewed desktop state.

final result: passed

## Playground Typography removal QA — 2026-08-07

### Source truth

- `browser://comment-1/typography-playground-before` — the annotated 1117 × 837 Playground capture
  identified the complete `section#typography` block for removal because Typography already has a
  dedicated documentation page.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground`
- Final screenshot:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/playground-without-typography.png`
- Source and implementation viewport: 1117 × 837 CSS px, device scale factor 1.
- State: light appearance, comfortable density, full radius, 100% scaling.
- Computed DOM: zero `section#typography` nodes, zero `Typography token groups` tablists, and
  `section#kbd` is now the first component specimen.
- Fresh-load browser console: no warnings or errors.

### Comparison

- Full-view comparison confirms the Typography heading, View docs link, tabs, and token cards are
  gone; Playground proceeds directly from its title to the Kbd specimen.
- A separate focused crop was unnecessary because the requested change removes one complete,
  unambiguous section and the full-view capture clearly shows the new first specimen.

### Required fidelity surfaces

- Fonts and typography: the Playground title and remaining component headings are unchanged.
- Spacing and layout rhythm: the removed section leaves the existing section rhythm intact; Kbd
  occupies the first normal specimen position without a custom spacer.
- Colors and visual tokens: unchanged.
- Image quality and assets: no image assets are involved; existing Kbd glyphs remain unchanged.
- Copy and content: only Playground-specific Typography copy was removed; the dedicated Typography
  documentation and token contract remain untouched.

### Findings and fixes

1. P1 — Playground duplicated the full Typography token reference despite the dedicated foundation
   page. Removed the section, its local token data and renderer, its private CSS, and the obsolete
   docs/browser assertions.

No unresolved P0, P1, or P2 findings remain.

final result: passed

## Toast stack depth and dark overlay perimeter QA — 2026-08-07

### Source truth

- `browser://comment-1/toast-stack-before` — the user requested progressively lower opacity and retained backdrop blur for Toast cards behind the frontmost card, with full opacity restored when the stack expands.
- `browser://comment-2/overlay-border-before` — the user requested a quiet, complete perimeter border for floating surfaces in dark mode, including Dialog, Tooltip, and Command.
- Source captures: browser-comment screenshots at 1117 × 837 CSS px, device scale factor 1.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground`
- Viewport: 1117 × 837 CSS px, device scale factor 1; source and implementation use the same viewport and dark theme.
- Collapsed Toast stack: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/toast-stack-collapsed.png`
- Corrected whole-layer opacity:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/toast-root-opacity-after-correction.png`
- Expanded Toast stack: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/toast-stack-expanded.png`
- Dark Dialog perimeter: `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/dark-overlay-border.png`
- Initial collapsed Toast computed opacity by depth: `1`, `0.84`, `0.68`.
- Corrected collapsed Toast root opacity by depth: `1`, `0.6`, `0.2`; every layer retains
  `blur(24px) saturate(1.2)`.
- Descendant content keeps local opacity `1`, confirming that the complete root layer is composited
  at `0.6` and `0.2` instead of making only its background transparent.
- Expanded Toast computed opacity by depth: `1`, `1`, `1`.
- Dialog and both Command specimens resolve to `1px` on all four sides with `rgba(255, 255, 255, 0.1)` in dark mode.
- Primary interactions tested: create a three-item Toast stack, expand it by hovering, collapse it by leaving, and open/close Dialog.
- Browser console warnings and errors: none.

### Full-view and focused comparison

- The full Playground view confirms that the new borders remain subordinate to the dark surfaces instead of outlining them aggressively.
- Focused Toast evidence was required because the depth opacity and expanded state are too small to judge reliably from the full view alone.
- Focused Dialog evidence confirms the border is continuous at the bottom and both sides, not only at the top.

### Required fidelity surfaces

- Fonts and typography: unchanged; Toast and Dialog hierarchy, weights, line height, and wrapping remain intact.
- Spacing and layout rhythm: unchanged; Toast stack offsets, scale, expanded gap, overlay radius, and Dialog geometry are preserved.
- Colors and visual tokens: Toast depth now uses a `0.4` whole-layer opacity step; dark overlays use the existing subtle border semantic at 10% white.
- Image quality and assets: no raster or illustrative assets are involved; existing vector icons remain unchanged and sharp.
- Copy and content: unchanged in all reviewed specimens.

### Findings and fixes

1. P1 — Every behind Toast used the same content-only opacity, so the stack had no depth progression and the surface itself stayed visually solid. Moved depth opacity to the managed Toast root, derived it from `--toast-index`, retained the existing backdrop filter, and restored full opacity through `data-expanded`.
2. P1 — Overlay width was globally zero, so dark Dialog and Command surfaces relied on elevation that visually favored the top edge. Added the existing subtle semantic border to explicit dark mode and system-dark mode while leaving light mode unchanged.
3. P1 follow-up — The first whole-root progression at `0.84` and `0.68` still left the rear text too
   legible and could read like background-only transparency. Increased the root-level step so the
   collapsed stack resolves to `1`, `0.6`, and `0.2`; expanded roots still resolve to `1`.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states.

final result: passed

## Card border visibility QA — 2026-08-07

### Source truth

- User annotation screenshot: `browser://comment-1/card-dark-before`.
- Source route and state: `http://127.0.0.1:3001/playground#stat`, dark appearance, 1117 × 837
  CSS-pixel viewport.
- Review scope: add a restrained Card boundary in both light and dark modes without replacing the
  existing light-mode elevation hierarchy.

### Implementation evidence

- Browser: Codex in-app browser at device scale 1.
- Dark implementation:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/card-border-dark-stat.png`
- Light implementation:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/card-border-light-stat.png`
- Both implementation screenshots: 1117 × 837 pixels.
- Computed dark Card boundary: 1px solid `rgba(255, 255, 255, 0.1)`.
- Computed light Card boundary: 1px solid `rgba(15, 23, 42, 0.06)`.
- Primary interactions: global mode menu and Playground appearance radio group remained functional.
- Console: no application errors or warnings observed.

### Findings and comparison history

1. P1 — `--n-card-border-width` resolved to zero, leaving black raised Cards indistinguishable from
   the black canvas when their soft shadow had no visible contrast. Mapped the component token to the
   default 1px border width.
2. P2 — Secondary and interactive Card states explicitly replaced the border with transparency.
   Mapped secondary Cards to the subtle border and linked-card hover to the default border so the
   boundary remains present through every variant and interaction state.
3. Post-fix evidence — the dark screenshot shows a quiet but continuous boundary around the Stat
   Cards and their preview field. The light screenshot retains the softer 6% boundary plus the
   existing natural shadow, so the border does not compete with elevation.

### Required fidelity surfaces

- Fonts and typography: passed; no type tokens or text styles changed.
- Spacing and layout rhythm: passed; the border uses the existing box model and does not change Card
  padding, gaps, radius, or grid placement.
- Colors and visual tokens: passed; the component uses existing mode-aware subtle/default semantic
  border tokens rather than new palette values.
- Image quality and asset fidelity: not applicable; the reviewed surface contains no image assets.
- Copy and content: passed; no product copy changed.

No unresolved P0, P1, or P2 Card-boundary findings remain in the reviewed light and dark states.

final result: passed

## Major Second typography scale QA — 2026-08-07

### Source truth

- User reference:
  `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7b4bf848-7170-4c74-97a4-26ee87427e7d.png`
- Review scope: font-size progression only. The reference uses a `1.125` Major Second scale from a
  14px base; its layout, color, controls, and assets are not implementation targets.
- Source pixels: 2940 × 1670.

### Implementation evidence

- URL: `http://127.0.0.1:3001/docs/getting-started#principles`
- Browser: Codex in-app browser.
- Viewport and density: 1117 × 837 CSS pixels at device scale 1.
- Implementation screenshot:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/getting-started-major-second.png`
- Implementation pixels: 1117 × 837.
- Combined focused comparison:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdaf0-a49a-7853-8164-7b9d0fd07777/typography-comparison-v2.png`
- Computed sizes: body 14px, direct documentation h3 22.5px, direct documentation h2 25.25px,
  page h1 33.51px at the reviewed fluid desktop width.
- Primary interactions: documentation navigation and anchor navigation remained functional.
- Console: no application errors observed.

### Findings and comparison history

1. P1 — Tailwind Preflight resets semantic heading sizes, while documentation h2 styling specified
   only weight and margin. The rendered heading therefore inherited the 14px body size. Added
   explicit documentation h2/h3/h4 semantic size mappings.
2. P1 — The upper token scale jumped from 20px to 24px and ended at 3xl, so it could not represent
   the reference's steady Major Second progression. Changed 3xl to 22.5px and added 4xl at 25.25px
   and 5xl at 28.5px.
3. P2 — A mathematically exact negative scale would push microcopy below the existing readability
   floors. Retained 11px, 12px, and 13px micro tokens and applied the rounded Major Second
   progression only from the 14px UI base upward.
4. Post-fix evidence — the combined comparison shows a visible, consistent hierarchy between body,
   h3, h2, and the fluid page heading without copying the reference product chrome.

### Required fidelity surfaces

- Fonts and typography: passed. Nerio keeps its existing Geist documentation family and optical
  weights; the reviewed size progression, tight heading line height, and restrained negative
  tracking now produce clear hierarchy.
- Spacing and layout rhythm: passed for this scoped change. Existing documentation spacing remains
  unchanged; larger headings fit the current content column without collision or clipping.
- Colors and visual tokens: passed. No color values changed; typography continues to use semantic
  foreground tokens.
- Image quality and asset fidelity: not applicable. The reference contains no image asset that
  belongs in the Nerio implementation; it is used only as a type-scale specimen.
- Copy and content: passed. No product copy changed.

No unresolved P0, P1, or P2 typography findings remain in the reviewed desktop state.

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

## Profile settings identity Item refinement QA — 2026-08-07

### Source truth

- Approved pre-refinement capture:
  `/Users/vladimirpavlov/Documents/Nerio Design System/docs/audits/screenshots/profile-settings-compact.jpg`
- Approved direction: show a real avatar image, present avatar/name/email as a bordered Item that
  previews the public profile, align Profile photo with the other editable fields, and remove the
  Display name description.

### Implementation evidence

- URL: `http://localhost:3000/views/blocks/profile-settings`
- Browser: Codex in-app browser.
- Final compact-density screenshot:
  `/Users/vladimirpavlov/Documents/Nerio Design System/docs/audits/screenshots/profile-settings-item-avatar-compact.jpg`
- Side-by-side source and implementation comparison:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/profile-settings-item-avatar-comparison.jpg`
- Source and implementation captures are both normalized to 1117 × 837 pixels at the same
  1117 × 837 CSS viewport. The implementation was captured at device scale factor 2 and
  downsampled from 2234 × 1674 to the CSS-pixel target before comparison.
- State: light appearance, compact density, initial static preview.
- Full-view evidence: the 512px Card retains its centered geometry while the bordered Item creates a
  clear preview region above the aligned settings fields.
- A focused crop was unnecessary because the 1:1 combined comparison keeps the avatar image, Item
  border, field alignment, and Display name copy legible.
- Static-preview behavior remains unchanged: Save changes is disabled.
- Browser console errors: none.

### Required fidelity surfaces

- Fonts and typography: passed. ItemTitle and ItemDescription provide a clearer identity hierarchy
  without introducing custom text styling.
- Spacing and layout rhythm: passed. The Item occupies the full settings column; Profile photo,
  Display name, and Bio now share one vertical field alignment.
- Colors and visual tokens: passed. The Item outline, Card, controls, and disabled action inherit
  released Nerio theme tokens.
- Image quality and asset fidelity: passed. Avatar uses the existing 128px raster portrait at its
  native square crop through the released Avatar component.
- Copy and content: passed. Name, e-mail, and portrait form one profile preview; the redundant
  `Shown across Nerio.` helper is removed.

### Findings and comparison history

1. P1 — The initials-only identity row did not demonstrate Avatar image rendering. Added a real
   existing portrait asset with the accessible name `Vladimir Pavlov profile photo`.
2. P1 — Avatar identity and Profile photo appeared as one loosely assembled control group, obscuring
   the distinction between preview and settings. Moved identity into a released outlined Item and
   aligned FileInput with Display name and Bio.
3. P2 — The Display name description repeated context already established by the Card header.
   Removed it to reduce visual noise.

No unresolved P0, P1, or P2 visual findings remain in the reviewed desktop state.

final result: passed

## Profile settings product-coherence QA — 2026-08-07

### Source truth

- Approved refinement source:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/01-profile-settings-current.jpg`
- Approved product direction: keep Profile settings focused on personal identity, group the Avatar
  and FileInput into one photo region, replace duplicated security controls with profile visibility,
  and show a truthful saved state.

### Implementation evidence

- URL: `http://localhost:3000/views/blocks/profile-settings`
- Browser: Codex in-app browser.
- Final compact-density screenshot:
  `/Users/vladimirpavlov/Documents/Nerio Design System/docs/audits/screenshots/profile-settings-compact.jpg`
- Side-by-side source and implementation comparison:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/profile-settings-coherent-comparison.jpg`
- Source and implementation captures are both 1117 × 837 pixels at the same 1117 × 837 CSS
  viewport and device scale factor 1. The comparison preserves both captures at 1:1 scale.
- State: light appearance, compact density, initial static preview.
- Full-view evidence: the centered 512px Card preserves the established geometry while presenting
  one coherent personal-profile workflow.
- A focused crop was unnecessary because the 1:1 comparison keeps the photo, fields, visibility
  control, saved state, and disabled action legible.
- Static-preview behavior: Save changes is disabled and the preview does not expose a false
  successful action.
- Browser console errors: none.

### Required fidelity surfaces

- Fonts and typography: passed. Heading, identity, field, helper, Switch, status, and Button copy
  use released Nerio components and typography.
- Spacing and layout rhythm: passed. Avatar and FileInput now read as one photo region; fields,
  visibility, and save state retain token-driven grouping and separation.
- Colors and visual tokens: passed. Card, Avatar, fields, Switch, Separator, and disabled Button
  inherit the active Nerio theme without hard-coded visual values.
- Image quality and asset fidelity: passed. The released Avatar renders the accessible `VP`
  fallback; no placeholder bitmap, custom SVG, CSS drawing, or generated asset was introduced.
- Copy and content: passed. `Vladimir Pavlov`, `nerio@vpavlov.com`, the Nerio-specific bio, upload
  limits, workspace visibility, and saved state form one internally consistent demo.

### Findings and comparison history

1. P1 — The source mixed personal profile, workspace administration, and account security in one
   Card. Narrowed the Block to a clear personal-profile scope.
2. P1 — Two-factor authentication duplicated the dedicated Security settings Block and suggested a
   security workflow this static preview cannot represent. Replaced it with a profile-visibility
   Switch that belongs to the current scope.
3. P2 — Avatar identity and FileInput were visually disconnected. Grouped them into one responsive
   photo region.
4. P2 — Workspace name and workspace description conflicted with the person shown above them.
   Replaced them with Display name and Bio using coherent Nerio demo content.
5. P2 — `Unsaved changes` made the untouched initial state appear dirty. Replaced it with `All
changes saved` and disabled Save changes.

No unresolved P0, P1, or P2 visual findings remain in the reviewed desktop state.

final result: passed

## Profile settings Block and Blocks navigation QA — 2026-08-07

### Source truth

- Current-state Profile settings capture:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/profile-settings-source.jpg`
- Approved structure: place Profile settings inside a bounded Card, add a descriptive header,
  identity and avatar-upload controls, preserve workspace fields, expose a 2FA Switch, and repair the
  primary action contrast.
- Approved Blocks behavior: gallery cards navigate internally in the same tab now that every public
  Block View exposes Back to Blocks. Templates retain their new-tab behavior.

### Implementation evidence

- URLs: `http://localhost:3000/views/blocks/profile-settings` and
  `http://localhost:3000/blocks`.
- Browser: Codex in-app browser.
- Final compact-density screenshot for this iteration:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/01-profile-settings-current.jpg`
- Side-by-side source and implementation comparison:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/profile-settings-comparison.jpg`
- Source and implementation captures are both 1117 × 837 pixels at the same 1117 × 837 CSS
  viewport and device scale factor 1. The comparison preserves both captures at 1:1 scale, so no
  density normalization was required.
- State: light appearance, compact density, initial static preview.
- Full-view comparison evidence: the prior full-width form is replaced by a centered 512px Card with
  20px token-resolved compact padding and a 649px rendered height.
- A separate focused crop was unnecessary because the combined 1:1 comparison keeps the avatar,
  FileInput, field labels, Switch, and action copy legible.
- Save profile computed colors: foreground `rgb(255, 255, 255)` on background
  `rgb(109, 40, 217)`. Its child text resolves to the same white foreground.
- Static-preview behavior: Save profile does not change the URL or expose success feedback.
- Blocks navigation: selecting Profile settings changed the same tab from `/blocks` to
  `/views/blocks/profile-settings`; Back to Blocks returned that tab to `/blocks`.
- Browser console errors: none.

### Required fidelity surfaces

- Fonts and typography: passed. Profile, identity, security, field, helper, and action copy use
  released Heading, Text, Field, Switch, and Button typography.
- Spacing and layout rhythm: passed. The Card creates one bounded reading column; token-driven gaps
  separate identity, upload, workspace, security, and save regions while Separators mark major
  changes in meaning.
- Colors and visual tokens: passed. Card, avatar, fields, Switch, Separator, and Button inherit the
  active Nerio theme. Narrowing the save-bar selector to its direct status child stops secondary
  text color from leaking into the primary Button.
- Image quality and asset fidelity: passed. The released Avatar component renders the accessible
  `VP` fallback; no placeholder image, custom SVG, CSS drawing, or generated asset was introduced.
- Copy and content: passed. The Card explains its scope, shows `Vladimir Pavlov` and
  `nerio@vpavlov.com`, documents upload limits, retains workspace details, and names the 2FA
  requirement.

### Findings and comparison history

1. P1 — The original profile form expanded across nearly the full canvas and had no surface
   boundary. Wrapped the content in the released Card and constrained it to a centered 32rem maximum.
2. P1 — Save profile inherited secondary text color from the broad `.composition-save-bar span`
   selector, producing insufficient text/background separation. Scoped the rule to the direct status
   child and verified white text on the purple primary surface.
3. P2 — The original form lacked identity, avatar upload, security context, and descriptive Card
   copy. Added Avatar, FileInput, a Security section, and a labelled 2FA Switch using released
   components.
4. P2 — Blocks cards opened duplicate tabs despite every public preview now providing a return path.
   Removed only the Blocks `target` and `rel` attributes, updated the accessible name, and verified
   same-tab forward and return navigation. Templates remain unchanged.

No unresolved P0, P1, or P2 visual findings remain in the reviewed desktop state.

final result: passed

## Reset password Block refinement QA — 2026-08-07

### Source truth

- Current-state source capture:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/01-reset-password-current.png`
- Approved change set: retain the compact Card and add clearer recovery guidance, the branded email
  placeholder, and a visual-only route back to Sign in.

### Implementation evidence

- URL: `http://localhost:3000/views/blocks/reset-password`
- Browser: Codex in-app browser.
- Final comfortable screenshot:
  `/Users/vladimirpavlov/Documents/Nerio Design System/docs/audits/screenshots/reset-password-comfortable.jpg`
- Side-by-side source and implementation comparison:
  `/Users/vladimirpavlov/.codex/visualizations/2026/08/07/019fdc4e-7ab6-7863-8654-3bbb0c41ed3b/reset-password-comparison.jpg`
- Source and implementation captures are both 1117 × 837 pixels at the same 1117 × 837 CSS
  viewport and device scale factor 1. The comparison places both unchanged captures side by side,
  so no density normalization was required.
- State: light appearance, comfortable density, initial static preview.
- Full-view comparison evidence: Card width, canvas position, padding, field width, and primary action
  geometry remain unchanged while the approved copy and account-return row expand the Card
  vertically.
- A separate focused crop was unnecessary because the 1:1 combined comparison keeps every form
  label, placeholder, and action legible.
- Static-preview behavior: Send reset link does not change the URL or reveal validation/success
  feedback; Sign in is a visual affordance rather than an anchor.
- Browser console errors: none.

### Required fidelity surfaces

- Fonts and typography: passed. The longer descriptor wraps naturally within the existing Card and
  the account-return row uses released Text and link Button typography.
- Spacing and layout rhythm: passed. The existing token-driven form gap and Card padding preserve a
  clear header, field, primary action, and return-path sequence.
- Colors and visual tokens: passed. No color or visual literals were introduced; the field, action,
  secondary copy, and link inherit the existing theme-aware Nerio tokens.
- Image quality and asset fidelity: passed. The approved form contains no image or decorative asset,
  and none was added.
- Copy and content: passed. The recovery explanation is explicit, the email placeholder is
  `nerio@vpavlov.com`, and `Remembered your password? Sign in` restores the expected return path.

### Findings and comparison history

1. P2 — The original descriptor did not explain which email to enter or the resulting action.
   Replaced it with the approved account-specific recovery instruction and verified its wrapping at
   the same viewport.
2. P2 — The original form ended after the primary action, leaving no visible return path to
   authentication. Added the centered Sign in prompt using the existing non-interactive link
   treatment.
3. P2 — The original generic email placeholder did not follow the branded auth examples. Replaced
   it with `nerio@vpavlov.com`.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Create account Block structure QA — 2026-08-07

### Source truth

- `browser://comments/create-account-structure-1` — the maintainer-supplied structural reference
  attached to Browser Comment 1. It defines the company identity above the Card, centered account
  heading, full name and email fields, side-by-side password confirmation, password guidance,
  primary action, existing-account prompt, and legal agreement below the Card.
- The maintainer explicitly scoped the screenshot to layout and required the implementation to use
  Nerio components, icon adapters, and semantic tokens rather than copying its visual styling.

### Implementation evidence

- URL: `http://127.0.0.1:3000/views/blocks/create-account`
- Browser: Codex in-app browser.
- Final comfortable screenshot:
  `/Users/vladimirpavlov/Documents/Nerio Design System/docs/audits/screenshots/create-account-comfortable.jpg`
- Implementation capture: 1280 × 720 pixels, matching the 1280 × 720 CSS viewport at device scale
  factor 1.
- The source and implementation use different canvas proportions; no density normalization was
  applied because the source is an explicit structure-only reference. The Card and surrounding
  identity/legal regions were compared as focused layout regions.
- Focused measurements: Card padding 24px, form gap 20px, and two equal 177px password columns in
  comfortable density. The password grid collapses to one column below the local 30rem breakpoint.
- Static-preview behavior: Create account does not submit or change the URL; Sign in, Terms of
  Service, and Privacy Policy are visual affordances rather than anchors. Back to Blocks remains
  outside the disabled preview boundary.
- Catalog thumbnail evidence: the updated Create account heading renders in the second iframe and
  Back to Blocks resolves to `display: none` after the thumbnail appearance contract initializes.
- Browser console errors: none.

### Required fidelity surfaces

- Fonts and typography: passed. Company identity, title, description, labels, helper, account prompt,
  and legal copy use Nerio Heading, Text, Label, Field, and Button typography.
- Spacing and layout rhythm: passed. Brand, Card, and legal copy form three clear regions; full-width
  fields precede the paired credential row, and the existing-account prompt closes the Card.
- Colors and visual tokens: passed. The company mark, Card, inputs, text roles, borders, and action
  use existing semantic tokens and remain theme-aware.
- Image quality and asset fidelity: passed. The reference contains only a simple company mark; the
  implementation uses the released Nerio Icon component with the adapter Box icon rather than a
  generated asset, custom SVG, or CSS drawing.
- Copy and content: passed. The English branded placeholders are `Vladimir Pavlov` and
  `nerio@vpavlov.com`. Password, confirmation, minimum-length guidance, account action, Sign in
  prompt, Terms of Service, and Privacy Policy are all present; the obsolete Email verification
  alert is removed.

### Findings and comparison history

1. P1 — The prior Create account preview lacked company identity, confirm-password, account-switch,
   and legal agreement regions. Added the complete structural sequence and verified it in the final
   full-page capture.
2. P2 — The prior form ended with an Email verification Alert that is absent from the selected
   reference. Replaced it with password-length guidance and the existing-account prompt.
3. P2 — The first revised primary action used submit semantics and appended an empty query string
   despite the global static-preview boundary. Changed this visual action to `type="button"` and
   reverified that the URL remains unchanged.
4. P2 — Password and confirm-password needed a paired desktop relationship without creating mobile
   overflow. Added a token-spaced two-column grid with a one-column narrow-screen fallback.

No unresolved P0, P1, or P2 visual findings remain in the reviewed states.

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

# Playground Canvas Design QA

- Source visual truth: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png`
- Source pixels: `2940 x 1670`, normalized to `1600 x 911`
- Implementation: `http://127.0.0.1:3001/playground`
- Final implementation screenshot: `design-qa-artifacts/playground-implementation-1600x911-final.png`
- Final comparison board: `design-qa-artifacts/playground-comparison-final-3200x959.png`
- CSS viewport: `1600 x 911`
- Device scale factor: `1`
- State: system light appearance, purple accent, slate neutral, comfortable density, full radius, 100% scaling, calm motion, flat panels

## Findings

No actionable P0, P1, or P2 findings remain.

The implementation preserves the reference's two-region workbench, compact settings rail, neutral scrollable canvas, dense multi-column card composition, varied card heights, and realistic product contexts. Intentional product differences are the existing Nerio documentation header, system-owned appearance, Nerio semantic colors, and the use of Core primitives instead of presenting a local chart as a Core component.

## Required fidelity surfaces

- Fonts and typography: Existing Geist typography is preserved. Headings, labels, helper text, and card hierarchy follow Nerio tokens and match the compact reference hierarchy.
- Spacing and layout rhythm: The left rail is fixed, the right canvas owns both overflow axes, body overflow is disabled, and the four-column masonry surface keeps consistent card gaps and padding.
- Colors and visual tokens: Default light canvas, neutral surfaces, borders, status colors, and accent controls all use live Nerio semantic tokens. System dark mode is inherited automatically.
- Image quality and asset fidelity: The only visible raster assets are the existing high-resolution Nerio avatar and brand assets. UI symbols use the existing adapter icon library.
- Copy and content: All sixteen cards use concise English product copy and realistic mock data.

## Full-view comparison evidence

`design-qa-artifacts/playground-comparison-final-3200x959.png` places the normalized source and final browser render in the same image. The primary composition, canvas density, card treatment, and settings-to-preview relationship are aligned. The source's dark settings rail is intentionally not copied because Playground appearance follows the system theme.

## Focused-region comparison evidence

A separate crop was not needed: the original-size comparison board keeps the left controls and the first three card columns legible at 1:1 inspection. Controls, borders, radii, helper copy, icon alignment, and card spacing were checked there.

## Comparison history

1. Initial browser render established the correct full-height split and a `1744 x 1876` scrollable canvas inside an `805 x 769` viewport, with sixteen rendered scenes and no body overflow.
2. First comparison found that Reset was below the visible settings viewport. A persistent footer was added.
3. Second comparison found that the first footer treatment overlapped Panel style. Settings were separated into a scrollable body and fixed footer.
4. Third comparison tightened group spacing so every requested control and Reset are visible together at the QA viewport. The final browser render reported zero console errors.

## Primary interactions verified

- Accent, neutral, density, radius, scaling, motion, panel style, and Reset
- Horizontal and vertical canvas scrolling without canvas zoom
- System dark appearance
- Calendar and DatePicker state
- InputGroup and Checkbox state
- Dialog portal theming
- Toast feedback
- Responsive mobile stacking contract

## Follow-up polish

- P3: The settings rail is slightly wider than the source so five radius presets retain readable labels and touch targets.
- P3: The existing Nerio docs navigation is intentionally simpler than the reference site's global navigation.

## Final result

final result: passed

## Playground settings iteration — 2026-08-09

### Source truth

- User-provided reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png`
- User feedback: use the semantic canvas background, present every Live settings value as a simple Select, and reveal Reset only after customization.

### Implementation evidence

- URL: `http://127.0.0.1:3001/playground`
- Viewport: `1600 × 911` CSS pixels at device scale factor `1`
- Implementation screenshot: `design-qa-artifacts/playground-implementation-selects-1600x911.png`
- Side-by-side comparison: `design-qa-artifacts/playground-comparison-selects-3200x951.png`
- State: system light appearance and the neutral Playground preset, with the canvas and both settings states inspected.

### Findings and fixes

1. P2 — The canvas used the subtle surface token instead of the page background. Mapped the canvas to `--n-color-surface-canvas`; the inspected light render resolves to pure white.
2. P2 — Live settings mixed swatches, segmented controls, radius diagrams, and scale buttons. Replaced all seven controls with the system Select component while preserving the same values and live token behavior.
3. P2 — Reset was permanently visible and reserved a footer in the neutral state. Made the action conditional on any setting differing from `Purple / Slate / Comfortable / Full / 100% / Calm / Flat`; browser interaction confirmed it appears after selecting Blue and disappears after Reset.

No actionable P0, P1, or P2 findings remain in this iteration.

### Required fidelity surfaces

- Fonts and typography: existing Geist hierarchy and 14px control baseline remain unchanged.
- Spacing and layout rhythm: the settings rail now has one consistent field rhythm; no empty Reset footer remains in the neutral state.
- Colors and visual tokens: the canvas uses the semantic canvas token and resolves to `#ffffff` in the reviewed light state.
- Image quality and asset fidelity: existing avatar and brand assets are unchanged.
- Copy and content: all setting names and available values are preserved.

### Focused-region evidence

The settings rail is readable at 1:1 in the full comparison, so a separate crop is unnecessary. The Select labels, values, chevrons, group dividers, canvas boundary, and conditional Reset state were inspected directly.

final result: passed

## Playground settings card iteration — 2026-08-09

### Source truth

- User reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png`
- Implementation screenshot: `design-qa-artifacts/playground-settings-card/01-settings-card.png`
- Side-by-side comparison: `design-qa-artifacts/playground-settings-card/02-comparison.png`
- Viewport: `1600 × 911` CSS pixels at device scale factor `1`.
- State: light system appearance, Purple accent, Slate neutral recipe, Raised panel style, no customization Reset.

### Findings and fixes

1. P2 — Settings read as a permanent sidebar and shared an edge with the canvas. Replaced the sidebar surface with the Core Card anatomy and moved it to the right side of the workspace.
2. P2 — The canvas was not visually bounded as an independent region. Added a token border and container radius while preserving its semantic canvas background and two-axis scrolling.
3. P2 — Twenty-pixel card gaps felt denser than the requested reference rhythm. Increased both masonry axes to `40px`; measured masonry spans continue to recompute from the live row gap.
4. P2 — Flat was the neutral panel preset. Changed the default and Reset target to Raised and rebound Card shadow directly inside the local Playground theme.
5. P2 — Accent and neutral Select values were text-only. Added color swatches to the selected values and all six options in each popup.
6. P3 — The reference keeps settings on the left; the implementation intentionally mirrors the composition with Settings on the right per user direction.

### Required fidelity surfaces

- Fonts and typography: the existing Geist hierarchy remains unchanged; the settings title is reduced to one Core CardTitle, `Settings`.
- Spacing and layout rhythm: workspace padding and inter-panel gap use Core tokens; card-to-card gaps resolve to `40px`.
- Colors and visual tokens: both panel borders, canvas background, Raised elevation, and Select swatches use the active Playground semantic palette.
- Image quality and asset fidelity: no new raster assets were required; existing avatar assets remain unchanged.
- Copy and content: the duplicate `Live settings / Theme` hierarchy and palette icon were removed without changing the seven setting labels.

### Interaction evidence

- Neutral state: Panel style is Raised and Reset is absent.
- Customized state: selecting Blue reveals Reset; Reset restores Purple and Raised and disappears again.
- Accent popup exposes six colored swatches; Neutral recipe popup exposes six colored swatches.
- Browser metrics: Settings column `2`, canvas column `1`, both borders `1px`, masonry gap `40px`, and 35 scenario cards preserved.

The full comparison is sufficient for panel geometry, heading hierarchy, container boundaries, and card rhythm. Popup swatches were verified directly in the browser because they are an interaction state absent from the static reference.

No actionable P0, P1, or P2 findings remain.

final result: passed

## Playground masonry and global appearance iteration — 2026-08-09

### Source truth and evidence

- User reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png`
- Light implementation: `design-qa-artifacts/playground-masonry-theme/01-final-light.png`
- Dark implementation: `design-qa-artifacts/playground-masonry-theme/02-final-dark.png`
- Side-by-side comparison: `design-qa-artifacts/playground-masonry-theme/03-comparison.png`
- Viewport: `1600 × 911` CSS pixels at device scale factor `1`.

### Findings and fixes

1. P1 — The earlier per-card row-span calculation used the visible 40px gap as the grid track step. That quantized placement and could leave excessive vertical air; an intermediate attempt also exposed invalid `Infinity` rows when parsing an unresolved `calc()`. Replaced it with one centralized seven-column packing pass using the computed column gap and explicit row starts/spans.
2. P1 — Playground resolved only `prefers-color-scheme`, so explicit Light and Dark choices in the docs header did not update its local semantic palette. Added a root `data-mode` observer and resolve System through the media query only when System is selected.
3. P2 — Thirteen scenario cards used the secondary gray Card surface. Removed the scenario-level variant axis; all 35 now render the standard Card variant.

### Required fidelity surfaces

- Fonts and typography: unchanged across Light and Dark; headings and muted copy retain the Core hierarchy.
- Spacing and layout rhythm: centralized packing preserves the visible 40px gap, seven columns, three two-column cards, and zero card intersections.
- Colors and visual tokens: Light resolves all 35 Card surfaces to `rgb(255, 255, 255)`; Dark resolves the same standard Card contract to `rgb(0, 0, 0)` with light foreground tokens.
- Image quality and asset fidelity: existing avatars and adapter icons remain unchanged in both appearance states.
- Copy and content: all 35 scenario names and product data remain unchanged.

### Interaction and browser evidence

- Header `System → Dark → Light → System` updates both root `data-mode` and Playground `data-mode` without reload.
- Dark inspection: canvas, Settings, and Card surfaces resolve to black; Card headings resolve to `rgb(244, 247, 251)`.
- Light inspection: every scenario Card resolves to white; Card headings resolve to `rgb(15, 23, 42)`.
- Structural inspection: 35 default Cards, zero secondary Cards, zero overlapping card pairs, and no invalid grid rows.
- Console contains only the Next.js development connection and React DevTools informational messages.

The full comparison covers hierarchy, density, white standard surfaces, and masonry rhythm. The dedicated Dark screenshot is the focused comparison for appearance synchronization.

No actionable P0, P1, or P2 findings remain.

final result: passed

## Playground workspace background correction — 2026-08-09

### Source truth and evidence

- User browser annotation: the outer workspace around Canvas and Settings must use the standard page background, without a gray backing surface.
- Light implementation: `design-qa-artifacts/playground-standard-background/01-final-light.png`
- Dark implementation: `design-qa-artifacts/playground-standard-background/02-final-dark.png`
- Viewport: `1600 × 911` CSS pixels at device scale factor `1`.

### Finding and fix

1. P2 — The outer workspace used `--n-color-surface-subtle`, creating a visible gray panel behind both framed regions. Rebound it to `--n-color-surface-canvas`; the canvas and Settings borders remain unchanged.

### Required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: workspace padding, panel gap, masonry spacing, and the seven-column layout are unchanged.
- Colors and visual tokens: the workspace now resolves to the semantic canvas background in both Light and Dark instead of a separate gray surface.
- Image quality and asset fidelity: unchanged.
- Copy and content: unchanged.

### Verification

- The focused Chromium test confirms that the workspace computed background equals `--n-color-surface-canvas` while switching through the global appearance control.
- Light resolves to the standard white page background; Dark resolves to the standard black page background.
- Both inner containers retain their one-pixel boundaries in the reviewed screenshots.
- A focused inspection was sufficient because this correction changes one semantic surface token and follows the user annotation directly.

No actionable P0, P1, or P2 findings remain.

final result: passed

## Playground masonry recovery — 2026-08-09

### Source truth and evidence

- Source visual: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png` (`2940 × 1670` pixels).
- Fixed implementation: `design-qa-artifacts/playground-grid-recovery/01-fixed.png` (`1470 × 837` pixels).
- Full-view comparison: `design-qa-artifacts/playground-grid-recovery/02-comparison.png` (`2485 × 700` pixels); both captures were normalized to `700px` height before comparison.
- Browser viewport: `1470 × 837` CSS pixels, device scale factor `2`; the in-app capture is normalized to CSS-pixel dimensions.
- State: Light, Purple accent, Slate neutral recipe, Comfortable density, Full radius, Raised panels.

### Finding, fix, and post-fix evidence

1. P1 — During an early style recalculation, `column-gap` could temporarily be non-numeric. The packing pass propagated that value into all seven column heights, leaving 28 cards with `grid-row: Infinity` and 409 overlapping card pairs. The layout now waits for a finite gap and positive card measurements before applying positions. Post-fix browser inspection reports 35 cards, zero invalid rows, zero overlaps, and a `2098px` masonry height.

### Required fidelity surfaces

- Fonts and typography: unchanged by the fix; card hierarchy and wrapping remain intact.
- Spacing and layout rhythm: seven columns and the visible `40px` gutter are restored; cards pack vertically without intersections.
- Colors and visual tokens: unchanged; the standard canvas and Card surfaces remain active.
- Image quality and asset fidelity: existing avatars and icons are unchanged.
- Copy and content: all 35 scenarios and Settings values are unchanged.

### Verification

- The targeted Chromium Playground test passes and now rejects `Infinity` or `NaN` grid rows explicitly.
- Reloaded in-app browser inspection at the reported viewport confirms the repaired layout.
- One existing React development warning about a leaked `leadingIcon` prop remains outside this grid-only correction; it does not affect masonry geometry.
- Focused crops were unnecessary because the defect and recovery are clearly visible at full-canvas scale.

No actionable P0, P1, or P2 masonry findings remain.

final result: passed

## Playground annotated component refactor — 2026-08-09

### Source truth and evidence

- User browser annotations: Settings field grouping, bordered workspace Item, project listing, notification feed, and compact transaction Item geometry.
- Original reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png` (`2940 × 1670` pixels).
- Fixed implementation: `design-qa-artifacts/playground-annotation-refactor/01-final.png` (`1470 × 837` pixels).
- Full-view comparison: `design-qa-artifacts/playground-annotation-refactor/02-comparison.png` (`2485 × 700` pixels); both sources were normalized to `700px` height.
- Browser viewport: `1470 × 837` CSS pixels, device scale factor `2`; Light appearance with neutral Playground defaults.

### Findings, fixes, and post-fix evidence

1. P2 — Settings wrapped every Select in a redundant layout group, making field ownership less clear and increasing vertical separation. Removed the wrappers so all seven controls are direct Select fields and locally mapped `--n-field-gap` to `4px`. Browser geometry confirms a `4px` label-to-trigger gap for every field.
2. P2 — The Northstar Studio identity used a plain Item even though it is a discrete workspace preview. Switched it to the built-in `outline` variant.
3. P2 — Projects repeated an Empty State already demonstrated elsewhere. Replaced it with three realistic project previews built from small outlined Items, ItemMedia, ItemContent, and ItemActions.
4. P2 — Notification center repeated the same Empty State pattern. Replaced it with three compact notification Items and system ItemSeparators.
5. P2 — Recent transaction Items used medium padding inside an already padded Card. Switched them to the built-in small Item size; computed inline padding is now `8px` for all three rows.
6. P1 — Fast Refresh could replace one of the edited scenario Cards while masonry still observed the previous DOM node, leaving replacement Cards at `grid-row: auto`. Added child-list synchronization so the ResizeObserver tracks the current Card set. A live component rename after page load preserved 35 Cards, zero auto/invalid rows, and zero intersections.

### Required fidelity surfaces

- Fonts and typography: unchanged; labels, Item titles, descriptions, and actions retain the Core hierarchy.
- Spacing and layout rhythm: Settings field anatomy is tighter; Item sizes now match their Card contexts; masonry remains seven columns with no overlap.
- Colors and visual tokens: all changes use existing Select, Item, Card, Badge, Button, and semantic token contracts.
- Image quality and asset fidelity: the existing workspace avatar and adapter icons are preserved; no approximate assets were introduced.
- Copy and content: duplicated empty-state copy was replaced with realistic project and notification data while the remaining 33 scenario concepts stay unchanged.

### Verification

- In-app browser inspection: 35 Cards, zero overlaps, zero `auto`/`Infinity`/`NaN` rows, three project Items, three notification Items, outlined workspace identity, and small transaction Items.
- Settings inspection: seven accessible comboboxes, each with a `4px` label-to-trigger gap.
- Console inspection after reload: no warnings or errors.
- `lint`, `typecheck`, docs validation, token validation, formatting, and `git diff --check` pass.
- The full comparison is sufficient for Settings, workspace identity, and project-list geometry. Notification and transaction anatomy were additionally checked from their live DOM structure and computed Item metrics because those Cards sit outside the initial canvas viewport.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Playground contextual SaaS cards — 2026-08-09

### Source truth and evidence

- User browser annotations: replace component-demo cards with contextual SaaS entities, expand project filters, and compact the Atlas search-result Items.
- Original reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png` (`2940 × 1670` pixels).
- Focused implementation: `design-qa-artifacts/playground-contextual-cards/01-final.png` (`1470 × 837` pixels).
- Comparison board: `design-qa-artifacts/playground-contextual-cards/02-comparison.png` (`2485 × 700` pixels); both captures were normalized to `700px` height.
- Browser viewport: `1470 × 837` CSS pixels, device scale factor `2`; Light appearance with neutral Playground defaults and the canvas scrolled to the annotated Cards.

### Findings, fixes, and post-fix evidence

1. P2 — Command search exposed an isolated component specimen instead of a product entity. Replaced it with Move task: a selected work Item, destination project and section Selects, assignee preservation, and contextual Cancel/Move actions.
2. P2 — Quick filter contained only a popover trigger and two switches. Replaced it with Project filters containing a keyword Field, Status and Owner Selects, an alerts Switch, controlled Reset behavior, and Save filters feedback.
3. P2 — Context menu described an implementation pattern instead of a SaaS object. Replaced it with Atlas launch: project progress, owner, target date, blocker state, and an entity-bound action menu in CardAction.
4. P2 — Search-result Items added medium padding inside an already padded Card. Switched both Atlas results to the built-in small Item size; computed inline padding is `8px` for each row.

### Required fidelity surfaces

- Fonts and typography: existing Core heading, label, helper, Item, and KeyValue hierarchy is preserved.
- Spacing and layout rhythm: the new forms use primitive-owned field gaps; small search Items remove the excessive nested inset; masonry remains intersection-free.
- Colors and visual tokens: all states use existing semantic Card, Item, Select, Input, Switch, Progress, Badge, and Button tokens.
- Image quality and asset fidelity: no new raster or approximate assets were introduced; adapter icons are used where needed.
- Copy and content: generic component names were replaced with realistic task, project, filter, ownership, and release data.

### Verification

- In-app browser inspection: 35 Cards, zero overlaps, zero invalid rows, and no remaining Command search, Quick filter, or Context menu headings.
- Contextual anatomy: Move task exposes two Selects and one Switch; Project filters exposes four filter controls plus Reset and Save filters; Atlas launch binds actions directly to the project Card.
- Search results: two small plain Items, each resolving to `8px` inline padding.
- Console inspection: no warnings or errors.
- `lint`, `typecheck`, docs validation, token validation, formatting, and `git diff --check` pass.
- The focused screenshot was required because the annotated Cards sit below and to the right of the initial canvas viewport; it clearly covers Move task, Atlas launch, and Project filters. Search-result padding was additionally verified from the live Item metrics.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Playground compact Items and destructive action corrections — 2026-08-09

### Source truth and evidence

- User browser annotations: compact Feature flags and Activity feed Item geometry, Switch semantics for Compact tables, and a destructive Delete account action.
- Original reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png` (`2940 × 1670` pixels).
- Focused implementation: `design-qa-artifacts/playground-final-item-actions/01-final.png` (`1470 × 837` pixels).
- Comparison board: `design-qa-artifacts/playground-final-item-actions/02-comparison.png` (`2485 × 700` pixels); both captures were normalized to `700px` height.
- Browser viewport: `1470 × 837` CSS pixels, device scale factor `2`; Light appearance with neutral Playground defaults.

### Findings, fixes, and post-fix evidence

1. P2 — Feature flag rows used medium Item padding inside an already padded Card. Switched all three rows to the built-in small Item size; computed inline padding is now `8px`.
2. P2 — Compact tables used Toggle semantics for a persistent binary setting. Replaced it with the system Switch in the checked state.
3. P1 — Delete account was styled as a neutral secondary action despite being irreversible. Applied the Button `danger` variant; the live result resolves to a red background with white text.
4. P2 — Activity feed rows repeated medium Item padding inside the Card. Switched all three rows to the small Item size; computed inline padding is now `8px`.

### Required fidelity surfaces

- Fonts and typography: unchanged; Item titles, descriptions, and actions preserve the Core hierarchy.
- Spacing and layout rhythm: compact Items remove the nested inset while preserving the seven-column masonry and Card padding.
- Colors and visual tokens: the destructive action and Switch states use existing semantic Button and Switch tokens.
- Image quality and asset fidelity: existing avatars and adapter icons are preserved; no approximate assets were introduced.
- Copy and content: scenario copy and data remain unchanged; only component semantics and geometry changed.

### Verification

- In-app browser inspection: 35 Cards, seven columns, zero overlaps, and zero `auto`/`Infinity`/`NaN` rows.
- Component inspection: three small Activity feed Items, three small Feature flags Items, Compact tables exposed as a checked Switch, and Delete account exposed as a `danger` Button.
- Computed geometry: every corrected Item resolves to `8px` inline padding.
- Console inspection: no warnings or errors.
- `lint`, `typecheck`, docs validation, token validation, formatting, and `git diff --check` pass.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Playground Notifications card correction — 2026-08-09

### Source truth and evidence

- User browser annotation: promote Save preferences to the primary CTA and compose Quiet hours as an Item with its Switch on the right.
- Original reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png` (`2940 × 1670` pixels).
- Focused implementation: `design-qa-artifacts/playground-notifications-card/01-final.png` (`1470 × 837` pixels).
- Comparison board: `design-qa-artifacts/playground-notifications-card/02-comparison.png` (`2485 × 700` pixels); both captures were normalized to `700px` height.
- Browser viewport: `1470 × 837` CSS pixels, device scale factor `2`; Light appearance with neutral Playground defaults.

### Findings, fixes, and post-fix evidence

1. P2 — Save preferences used the secondary Button variant despite being the Card's completion action. Restored the default primary variant.
2. P2 — Quiet hours rendered as a standalone labeled Switch, so the control was not aligned with the other entity rows. Composed a small system Item with ItemContent and ItemActions; the checked Switch now sits on the right.

### Required fidelity surfaces

- Fonts and typography: unchanged; the new Item uses the existing ItemTitle and ItemDescription hierarchy.
- Spacing and layout rhythm: the small Item resolves to `8px` inline padding and keeps the Switch right-aligned.
- Colors and visual tokens: the CTA and Switch use existing primary semantic tokens.
- Image quality and asset fidelity: no assets were added or changed.
- Copy and content: all notification labels, descriptions, and values remain unchanged.

### Verification

- In-app browser inspection: 35 Cards, zero overlaps, and zero invalid masonry rows.
- Notifications anatomy: primary Save preferences Button; one small Item; checked Quiet hours Switch positioned in ItemActions on the right.
- Console inspection: no warnings or errors.
- `lint`, `typecheck`, docs validation, token validation, formatting, and `git diff --check` pass.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Playground canvas origin and milestone actions — 2026-08-09

### Source truth and evidence

- User feedback: the canvas appeared broken again, and Set new milestone incorrectly grouped Cancel and Set milestone in ButtonGroup.
- Original reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png` (`2940 × 1670` pixels).
- Focused implementation: `design-qa-artifacts/playground-canvas-milestone/01-final.png` (`1470 × 837` pixels).
- Comparison board: `design-qa-artifacts/playground-canvas-milestone/02-comparison.png` (`2485 × 700` pixels); both captures were normalized to `700px` height.
- Browser viewport: `1470 × 837` CSS pixels, device scale factor `2`; Light appearance with neutral Playground defaults.

### Findings, fixes, and post-fix evidence

1. P1 — The masonry itself remained valid, but the shared review tab had been left at `scrollLeft: 819px` by the previous focused QA inspection, hiding the first columns and making the canvas appear broken. Restored the canvas viewport to its origin (`scrollLeft: 0`, `scrollTop: 0`) and kept that state for handoff.
2. P2 — Set new milestone used ButtonGroup for two independent footer actions. Removed that grouping so CardFooter owns the spacing between a secondary Cancel Button and primary Set milestone Button.

### Required fidelity surfaces

- Fonts and typography: unchanged.
- Spacing and layout rhythm: the seven-column masonry is visible from its true origin; independent Card footer actions retain primitive-owned spacing.
- Colors and visual tokens: Cancel remains secondary and Set milestone remains primary.
- Image quality and asset fidelity: no assets were added or changed.
- Copy and content: milestone copy and form values remain unchanged.

### Verification

- In-app browser inspection: 35 Cards, seven columns, zero overlaps, zero invalid rows, and canvas scroll position `0, 0`.
- Milestone anatomy: zero ButtonGroup instances in the Card; separate visible Cancel and Set milestone Buttons.
- Console inspection: no warnings or errors.
- `lint`, `typecheck`, docs validation, token validation, formatting, and `git diff --check` pass.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Card component section spacing — 2026-08-09

### Source truth

- Original user direction: set `--n-card-section-gap` to `1rem`.
- Follow-up user clarification: apply the change at the Card component level.
- Superseding implementation decision after review: treat this as a Card-owned token contract rather than a declaration on each Card root. A root declaration blocks inherited theme and density overrides, so the Card-namespaced token supplies the `1rem` default from the token layer while Card instances continue to inherit consumer overrides.

### Finding and fix

1. P2 — A Card-root custom-property declaration would override theme and density wrappers. Updated the Card-namespaced token default to `--n-space-4` in the token layer and intentionally left the Card root without a local `--n-card-section-gap` declaration, so inherited consumer overrides remain effective.

### Verification

- In-app browser inspection: all 35 Playground Cards resolve `--n-card-section-gap` to `1rem`; sampled CardContent row gaps resolve to `16px`.
- Masonry remains valid with 35 Cards, zero overlaps, and zero invalid rows.
- `pnpm --filter @nerio-ui/ui test`: 175 tests passed across 2 contract test files.
- UI lint, UI typecheck, token validation, formatting, and `git diff --check` pass.
- Console inspection: no warnings or errors.

No actionable P0, P1, or P2 findings remain in the requested scope.

final result: passed

## Card header spacing separation — 2026-08-09

### Source truth

- User browser annotation on the Notifications Card header: retain the Card section gap at `1rem`, but reduce the CardHeader title/description spacing to `0.5rem`.

### Finding and fix

1. P2 — CardHeader reused `--n-card-section-gap`, coupling its compact title/description relationship to the larger content rhythm. Added a component-local `--n-card-header-gap: 0.5rem` and applied it to both the CardHeader grid and its title/description group. CardContent and CardFooter continue to use the `1rem` section gap.

### Verification

- Notifications Card: CardHeader gap `8px`, title/description gap `8px`, CardContent gap `16px`.
- All 35 Playground Cards expose `--n-card-header-gap: 0.5rem` and `--n-card-section-gap: 1rem` through the Card root.
- Masonry remains valid with zero overlaps and zero invalid rows.
- UI contract tests: 174 passed; UI lint, UI typecheck, formatting, and `git diff --check` pass.
- Console inspection: no warnings or errors.

No actionable P0, P1, or P2 findings remain in the requested scope.

final result: passed

## Release readiness independent actions — 2026-08-09

### Source truth

- User direction: the Review and Approve CTAs in Release readiness must be separate Buttons rather than a ButtonGroup.

### Finding and fix

1. P2 — Release readiness grouped two independent workflow actions in ButtonGroup. Removed the grouping so CardFooter owns the spacing between secondary Review and primary Approve Buttons.

### Verification

- Release readiness contains zero ButtonGroup instances and two direct footer Buttons: Review (`secondary`) and Approve (`primary`).
- Masonry remains valid with 35 Cards, zero overlaps, and zero invalid rows.
- Docs lint, docs typecheck, docs validation, formatting, and `git diff --check` pass.
- Console inspection: no warnings or errors.

No actionable P0, P1, or P2 findings remain in the requested scope.

final result: passed

## Project filters independent actions — 2026-08-09

### Source truth

- User direction: Reset and Save filters in Project filters must be separate Buttons rather than a ButtonGroup.

### Finding and fix

1. P2 — Project filters grouped two independent form actions in ButtonGroup. Removed the grouping so CardFooter owns the spacing between secondary Reset and primary Save filters Buttons; existing reset and toast behavior remains unchanged.

### Verification

- Project filters contains zero ButtonGroup instances and two direct footer Buttons: Reset (`secondary`) and Save filters (`primary`).
- Masonry remains valid with 35 Cards, zero overlaps, and zero invalid rows.
- Docs lint, docs typecheck, docs validation, formatting, and `git diff --check` pass.
- Console inspection: no warnings or errors.

No actionable P0, P1, or P2 findings remain in the requested scope.

final result: passed

## Loading, plan radio, Move task, and CardFooter corrections — 2026-08-09

### Source truth

- User browser annotations: remove the redundant Fetching recent changes indicator, move plan metadata into RadioGroupItem descriptions, separate Move task actions, and reduce the independent CardFooter action gap to `0.5rem`.

### Findings and fixes

1. P2 — Loading state showed three simultaneous loading patterns. Removed the inline Spinner and Fetching recent changes copy; retained three Skeleton rows and the Syncing loading Badge.
2. P2 — Plan names and metadata were combined in each radio label. Kept Starter, Studio, and Enterprise as labels and moved Free, $48 per member, and Contact sales into RadioGroupItem descriptions.
3. P2 — Move task grouped independent Cancel and Move task actions in ButtonGroup. Removed the group while preserving secondary and primary roles.
4. P2 — CardFooter reused the `1rem` section gap, producing excessive space between independent actions. Added component-local `--n-card-footer-gap: 0.5rem` and bound CardFooter to it; CardContent remains at `1rem`.

### Verification

- Loading state: three Skeletons, Syncing Badge present, Fetching recent changes absent.
- Choose a plan: three concise labels and three separate descriptions exposed through the RadioGroupItem contract.
- Move task and Release readiness: zero ButtonGroup instances, direct secondary/primary Buttons, computed footer gap `8px`.
- Masonry remains valid with 35 Cards, zero overlaps, and zero invalid rows.
- UI contract tests: 174 passed; UI/docs lint, UI/docs typecheck, docs validation, formatting, and `git diff --check` pass.
- Console inspection: no warnings or errors.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Card header gap refinement — 2026-08-09

### Source truth

- User direction: set the Card component's `--n-card-header-gap` to `0.2rem`.

### Finding and fix

1. P2 — The component-local CardHeader gap remained wider than requested at `0.5rem`. Reduced it to `0.2rem` while preserving `--n-card-footer-gap: 0.5rem` and `--n-card-section-gap: 1rem`.

### Verification

- Card source contract requires `[--n-card-header-gap:0.2rem]` and continues to bind CardHeader and its title/description group to that variable.
- UI contract tests: 174 passed; UI lint, UI typecheck, formatting, and `git diff --check` pass.

No actionable P0, P1, or P2 findings remain in the requested scope.

final result: passed

## Playground CTA, ItemGroup, Slider, and wide-card balance — 2026-08-09

### Source truth

- User browser annotations: make Save links primary, tighten the Account access item group, correct Slider spacing and typography, and place two-column cards only over balanced adjacent columns.

### Findings and fixes

1. P2 — Social links used a secondary Save CTA. Restored the primary Button variant.
2. P2 — Account access combined medium Items with a non-zero group gap. Switched its rows to the system `sm` Item size and corrected the ItemGroup token to zero so explicit separators do not gain additional spacing.
3. P2 — Slider used a `0.25rem` section gap and label/XS typography. Reduced the component gap to `0.125rem`, assigned MD tokens to label and value, and assigned SM to the description.
4. P2 — Wide cards selected only the lowest adjacent columns, even when their heights diverged. The layout now prioritizes the most balanced adjacent pair for span-two Cards, using vertical position as the tie-breaker; card heights remain intrinsic.

### Verification

- Social links exposes Save links as primary.
- Account access contains three `sm` Items in an ItemGroup with a computed zero gap.
- Payout Slider resolves to a 2px vertical gap at 100% scaling, MD label/value, and a smaller SM description.
- All three wide cards stay within one canvas-gap plus 8px of the adjacent-column skyline; the catalog keeps 35 Cards with no overlaps or invalid grid rows.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Collapsible Settings and field rhythm — 2026-08-09

### Source truth

- User direction: allow the Settings card to collapse like a sidebar so the canvas uses the released width, and make every Settings Select use the same label-to-control spacing as the Password Field.

### Findings and fixes

1. P2 — The Settings column was permanently reserved. Added explicit Hide and Settings controls, a collapsed workspace state with a zero-width settings column, and an inert/hidden panel state while preserving all theme values in React state.
2. P2 — Playground Selects locally overrode the shared Field gap to `0.25rem`, diverging from the Password Field. Removed the override so both resolve through the system `--n-field-gap` token at `0.375rem`.

### Verification

- Expanded Settings exposes seven Selects and a Collapse settings control.
- Collapsed Settings is inert and `aria-hidden`, exposes a Show settings control, and expands the canvas into the released column.
- Accent color remains selected after collapse and restore.
- Accent color and Password both resolve to a 6px label-to-control gap at 100% scaling.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Outline ItemGroup spacing — 2026-08-09

### Source truth

- User browser annotation: bordered project Items should keep visible space between their outlines, while spacing should be owned by the ItemGroup component rather than the Playground card.

### Finding and fix

1. P2 — ItemGroup used the zero-gap plain-list contract for outline Items as well, causing adjacent borders to touch. Added `--n-item-group-outline-gap: var(--n-space-2)` and made ItemGroup adopt it whenever the group directly contains an outline Item. Plain groups with explicit ItemSeparator children continue to use a zero gap.

### Verification

- Projects contains three `sm` outline Items and resolves its ItemGroup gap to 8px.
- Account access and other plain ItemGroups keep a computed zero gap.
- No Playground-specific spacing class or wrapper was added.

No actionable P0, P1, or P2 findings remain in the annotated scope.

final result: passed

## Vertical Playground settings layout — 2026-08-09

### Source truth

- User direction: place the scenario canvas above Settings, place Settings below the canvas, remove the show/hide behavior and heading, keep the remaining Selects in one horizontal row, and remove Motion and UI scale from the live controls.

### Findings and fixes

1. P2 — The side-by-side workspace constrained the canvas and made Settings read as a sidebar. Replaced it with a two-row workspace: the scrollable canvas occupies the flexible top row and the settings Card occupies the bottom row.
2. P2 — The collapse/restore state no longer matched the intended persistent control surface. Removed the state, focus-transfer logic, hidden/inert attributes, rail, and both toggle controls.
3. P2 — Seven vertically stacked controls made the panel taller than necessary. Removed Motion and UI scale from the UI, retained their `Calm` and `100%` defaults internally, and arranged Accent color, Neutral color, Density, Radii, and Panel style in one horizontal row.
4. P3 — The Settings heading duplicated the complementary region label. Removed the visible heading while preserving `aria-label="Theme settings"` on the region.

### Verification

- The canvas precedes Settings in the DOM and renders above it at desktop and narrow widths.
- Settings exposes exactly five Selects in one horizontal row; the narrow layout provides horizontal overflow instead of stacking the controls.
- No Settings heading, collapse control, restore control, hidden state, or inert state remains.
- The focused Chromium smoke passes control behavior, reset behavior, horizontal field alignment, canvas overflow, and console/page-error checks.

This direction supersedes the earlier collapsible Settings layout while retaining the shared 6px Field rhythm.

final result: passed

## Centered Playground viewport and settings width — 2026-08-09

### Source truth

- User browser annotation: center the Settings panel with a 900px maximum width, hide canvas scrollbars, and start the canvas exactly centered on both axes.

### Findings and fixes

1. P2 — Settings filled the entire workspace width. Limited the Card to `56.25rem` (`900px` at the root font size), retained fluid width below that limit, and centered it in the workspace.
2. P2 — Native scrollbars competed with the canvas content. Hid scrollbar chrome in Firefox and WebKit/Blink while retaining two-axis mouse, trackpad, keyboard, and programmatic scrolling.
3. P2 — The canvas opened at its top-left scroll origin. Added a one-time post-layout centering step that waits for the measured masonry surface to overflow, then positions both scroll axes at half their available range.

### Verification

- At the annotated desktop viewport, Settings is horizontally centered and no wider than 900px.
- Canvas computed `scrollbar-width` is `none`, while its scroll extents remain larger than its client dimensions.
- Browser smoke verifies `scrollLeft` and `scrollTop` are within one pixel of the exact center after masonry layout.

final result: passed

## Expanded Playground canvas rhythm — 2026-08-09

### Source truth

- User direction: double the internal canvas padding and the gaps between scenario cards.

### Implementation and verification

- Canvas surface padding increased from 32px to 64px through the existing spacing token.
- The shared masonry gap increased from 40px to 80px on both axes; the measured packing algorithm continues to use the same computed gap as its vertical placement offset.
- Focused browser coverage asserts the exact 64px padding and 80px gap while preserving seven columns, balanced wide-card placement, and zero overlaps.

This direction supersedes the earlier 40px canvas-gutter review value.

final result: passed

## Playground origin, navigation order, and header alignment — 2026-08-10

### Source truth

- User direction: restore the canvas start to its top-left origin, move Playground to the first primary-navigation position, and remove the visual gap between the header and canvas.

### Findings and fixes

1. P2 — Programmatic post-layout centering overrode the familiar canvas origin. Removed the centering observer and scroll mutation so each load starts at `scrollLeft: 0` and `scrollTop: 0`; the user owns all subsequent scrolling.
2. P2 — Playground appeared after the reference catalogs in primary navigation. Reordered the links to Playground, Docs, Components, Blocks, Templates without changing destinations or active-state behavior.
3. P2 — Workspace padding added 24px of empty space above the canvas. Removed only the block-start padding so the canvas begins directly after the sticky header; inline and block-end workspace padding remain unchanged.

### Verification

- Browser smoke asserts the exact primary-navigation label order.
- Canvas starts at `(0, 0)` and remains independently scrollable with hidden scrollbar chrome.
- The measured difference between the header bottom and canvas top is below one pixel.

This direction supersedes the earlier centered initial canvas viewport.

final result: passed

## Footer text size — 2026-08-10

### Source truth

- User browser annotation: the site footer must use the system MD text size instead of helper-sized text.

### Implementation and verification

- Replaced `--n-helper-font-size` with `--n-font-size-md` on the shared docs footer.
- Browser coverage asserts the rendered footer text resolves to 14px on the homepage.

final result: passed

## Documentation inline code and prose links — 2026-08-10

### Source truth

- User browser annotation: inline code in documentation prose needs a compact visual container, and prose links need a persistent branded, underlined treatment so neither blends into body copy.

### Implementation and verification

- Scoped the treatment to `code` and anchors inside prose paragraphs, list items, and description details; navigation, controls, and full-size code examples remain unchanged.
- Inline code now uses the semantic control surface, default border, small radius, mono typography, and compact token spacing. Clone decoration keeps wrapped inline fragments visually coherent.
- Prose links now use the semantic link color with a persistent underline, hover color, and the shared focus ring.
- Browser coverage compares the rendered inline-code surface and border and the rendered link color against their semantic tokens, and asserts the visible underline.

final result: passed

## Compact Playground canvas rhythm — 2026-08-10

### Source truth

- User browser annotation: reduce the Playground canvas gaps and padding so more interface examples are visible together and theme changes are easier to compare.

### Implementation and verification

- Restored the canvas surface padding from 64px to the previous 32px spacing token.
- Restored the shared masonry gap from 80px to 40px while keeping the measured layout algorithm tied to the same computed value.
- Focused browser coverage asserts the 32px padding and 40px gap while retaining the seven-column layout and overlap checks.

This direction supersedes the expanded Playground canvas rhythm from 2026-08-09.

final result: passed

## Documentation prose leading and inline-code refinement — 2026-08-10

### Source truth

- User browser annotations: documentation prose needs 150–160% line height, while inline code should use syntax-aware color, a background without a border, and an approximately 4px radius matching the supplied reference.

### Implementation and verification

- Added the documentation prose line-height token as an alias of the existing relaxed typography token (`1.55`) and applied it to direct section prose, lists, and description lists.
- Reused the existing syntax string color for inline-code foregrounds so package paths connect visually to import strings in full code examples across light and dark themes.
- Removed the inline-code border and replaced the 12px small radius with the 4px extra-small radius token; the semantic control background and compact spacing remain.
- Narrowed prose code and link selectors to direct documentation content so component-preview copy is not restyled.
- Browser coverage asserts token-resolved prose leading, inline-code foreground/background, no border, 4px radius, and the existing branded link treatment.

This direction supersedes the bordered inline-code treatment from earlier on 2026-08-10.

final result: passed

## Playground canvas edge and card spacing — 2026-08-10

### Source truth

- User browser annotation: the canvas outer padding must be 48px, while the gap between cards must be 32px.

### Implementation and verification

- Set the canvas surface padding to the existing 48px spacing token.
- Set the shared masonry gap to the existing 32px spacing token; the measured vertical layout continues to read the same computed gap.
- Focused browser coverage asserts the exact 48px outer padding and 32px card gap while retaining overlap protection.

This direction supersedes the compact 32px padding and 40px gap values from earlier on 2026-08-10.

final result: passed

## Nerio-branded Playground content — 2026-08-10

### Source truth

- User browser annotation: organizational names, URLs, email domains, and named product examples in the Playground must use Nerio instead of unrelated placeholder brands.

### Implementation and verification

- Replaced the Northstar workspace identity with Nerio and changed all team addresses to the existing `@nerio.dev` project domain.
- Replaced the social fields with the canonical repository path (`github.com/vpavlov-me/Nerio`) and documentation site (`nerio.vpavlov.com`) from the shared site configuration.
- Replaced Atlas project, search, launch, and preview copy with Nerio-branded equivalents; the invite placeholder now uses `teammate@nerio.dev`.
- Retained person names and the Starter, Studio, and Enterprise tier labels because they represent users and plan names rather than unrelated organizations.
- Browser coverage asserts the canonical visible field values and fails if Northstar or Atlas appears anywhere in the Playground.

final result: passed

## Neutral inline-code foreground — 2026-08-10

### Source truth

- User browser annotation: inline code in prose should remain neutral instead of borrowing the green syntax color; use secondary text on the gray background.

### Implementation and verification

- Replaced the syntax-string foreground with the semantic secondary text color for inline code only.
- Preserved the neutral control background, borderless 4px container, compact spacing, and colored syntax tokens inside full code blocks.
- Browser coverage compares the rendered inline-code foreground against `--n-color-text-secondary`.

This direction supersedes the syntax-colored inline-code foreground from earlier on 2026-08-10.

final result: passed

## Documentation prose font size — 2026-08-10

### Source truth

- User browser annotation: documentation body copy should use a 15–16px typography step for readability, scoped to documentation content rather than the global design system.

### Implementation and verification

- Added a documentation prose font-size alias to the existing 16px large typography token.
- Applied it only to direct section paragraphs, documentation lists, and description lists; the global 14px UI base, navigation, controls, component previews, and design-system typography remain unchanged.
- Kept the existing relaxed 1.55 prose leading, which now resolves proportionally against the 16px content size.
- Browser coverage compares both rendered prose size and line height against their documentation token aliases while retaining the 14px global body assertion.

final result: passed

## Collapsed Toast stack text occlusion — 2026-08-12

### Source truth

- User-provided 904 × 304 browser crop: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-2edb5b03-6ee6-44f3-b9e7-4554a5d66b67.png`.
- Required behavior: collapsed background Toast cards expose only their surface edge; title and description copy must remain fully hidden behind the card in front.

### Implementation evidence

- URL: `http://127.0.0.1:3001/docs/components/toast`.
- Browser: Codex in-app browser.
- Before/after comparison: `/tmp/nerio-toast-stack-before-after.png`.
- The collapsed stack offset changed from 16px to 8px through the public Toast stack token.
- Measured collapsed top positions step by exactly 8px. The second and third title bounds begin below the top edge of the preceding card, so no background copy is visible.
- Expanding, dismissal, scaling, opacity, reading order, and the frontmost Toast geometry remain unchanged.

### Regression evidence

- Token tests: 50/50 passed.
- Token validation: passed with 950 definitions and 46 registry items.
- UI contracts: 175/175 passed.
- Browser coverage now asserts the 8px collapsed step and verifies each background title is geometrically occluded by the preceding Toast.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Playground plan Badge removal — 2026-08-12

### Source truth

- User browser annotation on the `Choose a plan` card: remove the `Studio includes unlimited projects` Badge and preserve the rest of the scenario.

### Implementation and verification

- URL: `http://127.0.0.1:3001/playground`.
- Browser: Codex in-app browser.
- The annotated Badge is absent from both the card and the document text.
- The Starter, Studio, and Enterprise options remain unchanged, Studio remains selected, and the `Continue with Studio` action remains present.
- No surrounding layout, content, styling, or interaction was changed.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed

## Toast opaque stack and 20px radius cap — 2026-08-12

### Source truth

- User follow-up: remove the opacity fade from background Toast cards and make Toast an exception whose maximum corner radius is 20px.

### Implementation and verification

- URL: `http://127.0.0.1:3001/playground`.
- Browser: Codex in-app browser.
- Three managed Toasts were opened with Playground `Radii = Full`.
- All three Toasts resolve to opacity 1; the existing 8px collapsed stack step still keeps background copy hidden.
- All three Toasts resolve to a 20px radius while the active overlay radius is 32px.
- The default Toast token uses a CSS minimum, so smaller radius modes remain smaller and only values above 20px are capped.
- Other overlay components and their radius mappings are unchanged.

No unresolved P0, P1, or P2 visual findings remain in the reviewed state.

final result: passed
