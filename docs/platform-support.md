# Platform support

Nerio Core targets current evergreen product environments. The policy is enforced by
`pnpm validate:platform-support`; changes to a support range require package metadata, CI, consumer
fixtures, release documentation, and this policy to move together.

## Runtime and framework baseline

| Surface           | Supported baseline | Notes                                                                                  |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------- |
| Node.js           | `>=20.9.0`         | Node 22 is the clean CI and release-gate runtime.                                      |
| React             | `>=19`             | `react` and `react-dom` must use the same supported major.                             |
| Next.js consumers | `>=16.2.0 <17`     | Packages ship TypeScript source; list every used Nerio package in `transpilePackages`. |
| TypeScript        | `>=5.9 <6`         | Published source and declarations are checked with strict TypeScript 5.9.              |
| Tailwind CSS      | `>=4.0.0 <5`       | Required for source installs and the package-mode `@source` contract.                  |
| Motion adapter    | `motion@^12.42.2`  | Optional client-only peer; Core UI and unrelated adapters remain Motion-free.          |

Other React build systems may consume Nerio source when they transpile TypeScript, process Tailwind
CSS v4, and honor package export maps, but they are not release-gate environments yet.

## Browser baseline

The pinned Playwright gate verifies Chromium `140+`, Firefox `141+`, and WebKit `26+`. These are the
minimum engine lines with automated release evidence for this alpha. Patch releases within those
lines and newer evergreen releases are supported; legacy engines and Internet Explorer are not.

The compact cross-engine suite covers documentation and docs-local Template routes, keyboard focus, modal focus
containment and restoration, popup positioning, native form behavior, table overflow, Sidebar,
Toast lifecycle, RTL, reduced motion, and mobile dynamic-viewport bounds. The larger appearance and
component-family matrix remains on Chromium to avoid multiplying equivalent coverage.

## Known platform limitations

- Synthetic safe-area inset values require Chromium DevTools Protocol. Chromium verifies exact
  top/right/bottom/left values; Firefox and WebKit verify dynamic-viewport bounds and overflow
  without pretending to emulate device cutouts.
- Forced-colors emulation is a Chromium behavioral gate. Firefox and WebKit still run keyboard,
  focus, contrast-independent state, RTL, and reduced-motion scenarios.
- WebKit does not synthesize native Arrow-key scrolling for a focused generic overflow region in
  Playwright. WebKit still verifies that Table overflow is focusable and scrollable; Chromium and
  Firefox additionally verify the native Arrow-key path.
- Firefox and WebKit report intentionally canceled same-origin Next.js RSC prefetches with
  engine-specific errors when an overlay closes. The gate ignores only exact cancellation signatures
  on `_rsc` requests. WebKit may also report the matching access-control page error; real resource
  failures, console errors, and page errors still fail.
- Automated browser checks complement, but do not replace, the manual assistive-technology and
  real-device audit tracked separately in #143.
- Native form chrome and font rasterization may differ by operating system. The contract is semantic
  behavior, focus visibility, usable geometry, and tokenized authored styling—not pixel identity.

## Operating-system and assistive-technology scope

CI runs Linux browser engines and the release workflow is also exercised locally on macOS. Windows
and mobile operating systems are supported through evergreen browser behavior but do not yet have a
dedicated native CI runner. VoiceOver, NVDA, JAWS, TalkBack, real iOS safe areas, and platform zoom
remain manual evidence; any confirmed blocker is release-blocking even when automated tests pass.
