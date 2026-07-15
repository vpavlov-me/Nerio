# Toast stack design QA

- Latest source evidence: `/var/folders/vj/7mc511px4dxbs9mxrj3ycyv00000gn/T/codex-clipboard-8ab3dd62-9572-488e-a3b0-9053c5f50205.png`
- Implementation URL: `http://localhost:3000/docs/components/toast`
- Implementation screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-stack-full-viewport.png`
- Typography annotation screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-description-md-full-viewport.png`
- Static anatomy annotation screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-static-no-backing-no-dismiss.png`
- Latest upward-stack screenshot: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-stack-upward-compact.png`
- Latest source/implementation comparison: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-stack-upward-comparison.png`
- Focused implementation crop: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-stack-implementation-crop.jpg`
- Side-by-side comparison: `/Users/vladimirpavlov/.codex/visualizations/2026/07/15/019f648a-33a3-7b52-b313-8bb8c87a0f2b/toast-stack-comparison.png`
- Viewport: 1117 × 837; focused comparison normalized to 806 × 296.
- State: compact density, system mode, three-toast collapsed stack after activating `Stack notifications`.

## Full-view comparison evidence

The full viewport confirms the group is fixed to the horizontal center and the bottom safe area. The frontmost toast ends 14 px above the viewport edge while the two older, smaller cards step upward behind it. The stack no longer needs extra bottom compensation.

## Focused comparison evidence

The latest side-by-side comparison uses the user's spacing-bug capture and the corrected implementation. The source exposes oversized internal gaps and full cards running down the page; the implementation resets inherited heading/paragraph margins and collapses the group upward. Browser geometry measures widths of 544, 516.8, and 489.6 px with top positions of 761, 745, and 729 px.

## Required fidelity surfaces

- Fonts and typography: Nerio typography is intentionally preserved. Hierarchy matches the reference pattern with a semibold title and an `--n-font-size-md` description. The static demo description stays on one line without overflow.
- Spacing and layout rhythm: bottom-center anchoring, 16 px upward stack steps, 5% scale steps, compact 62 px front-card height, radii, and shadow match the corrected animation direction. Title and description margins resolve to 0 px with the intended 4 px grid gap.
- Colors and visual tokens: neutral overlay surfaces, subtle borders, and `--n-shadow-surface-floating` preserve Nerio's token system while matching the reference contrast.
- Image quality and asset fidelity: the reference contains no raster product assets. The Nerio adapter icons remain crisp vector UI icons; no placeholder or CSS-drawn asset was introduced.
- Copy and content: application-specific reference copy was not copied. The static demo remains presentation-only; dismissal stays in the managed Toast contract.

## Findings

No actionable P0, P1, or P2 mismatch remains for the requested stack positioning and composition.

## Comparison history

1. Initial browser measurement found the second and third cards extending below the frontmost card.
2. The first correction added bottom preview compensation, but the latest animation feedback clarified that the reduced cards must step upward.
3. Removed preview-depth compensation and reversed collapsed transforms to -16 px and -32 px. The frontmost card remains at the 14 px bottom safe-area inset.
4. Browser-annotation follow-up changed the description to the `md` typography token and shortened the static demo copy. Computed browser evidence confirms a 14 px font size, one client rect, and equal 283 px client and scroll widths.
5. Latest annotation follow-up removed the static dismiss control and the status-icon backing surface. Computed browser evidence confirms a transparent indicator background, no box shadow, no static close slot, and one-line demo copy without overflow.
6. Reset inherited margins on managed Base UI title and description elements. Card height dropped from 114 px to 62 px, with title and description separated by the intended 4 px token gap.

## Follow-up polish

- P3: The reference uses an action-only content example, while the Nerio demo keeps its status indicator. This is an intentional component-contract difference rather than stack-layout drift.

## Verification

- Primary interaction tested: creating a three-toast stack.
- Console errors: none.
- Next.js error overlay: absent.

final result: passed
