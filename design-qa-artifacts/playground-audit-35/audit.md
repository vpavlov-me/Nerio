# Playground catalog audit — 35-card iteration

## Source truth

- User reference: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-7606849f-d237-4b03-be65-0428a6eb09ad.png`
- Initial implementation: `01-current-catalog.png`
- Final implementation: `05-final-masonry.png`

## Findings resolved

1. P1 — The Calendar was rendered permanently inside a scenario. Replaced it with closed DatePicker triggers; the Calendar now exists only while its popover is open.
2. P1 — Several scenes used custom shells or card-like nested surfaces. Rebuilt every visible scenario from exported Nerio Core primitives and removed nested Card instances.
3. P2 — The catalog contained 16 scenes in four columns. Expanded it to exactly 35 scenarios in a seven-column desktop masonry grid.
4. P2 — Equal grid rows left large dead zones below shorter cards. Added measured row spans so each column packs independently while retaining two-column table cards.
5. P2 — A dark docs appearance could leak root-level component aliases into the locally light Playground. Rebound component semantic tokens to the active Playground palette.

## Browser evidence

- 35 `[data-playground-card]` elements
- 7 computed grid columns
- 3 two-column table cards
- 0 nested `.n-card` descendants
- 0 inline `.n-calendar` elements before DatePicker interaction
- DatePicker, Dialog, Toast, and two-axis canvas scrolling verified

final result: passed
