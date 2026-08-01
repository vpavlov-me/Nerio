# Platform support

Nerio Core targets current evergreen product environments. The policy is enforced by
`pnpm validate:platform-support`; changes to a support range require package metadata, the
release-candidate gate, consumer fixtures, release documentation, and this policy to move together.

## Runtime and framework baseline

| Surface           | Supported baseline | Notes                                                                                  |
| ----------------- | ------------------ | -------------------------------------------------------------------------------------- |
| Node.js           | `>=20.9.0`         | Node 22 is the clean CI and release-gate runtime.                                      |
| React             | `>=19 <20`         | `react` and `react-dom` use tested React 19; future majors require release evidence.   |
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

Working-branch pull requests into `dev` use `pnpm test:browser:pr` only for runtime or interactive
documentation changes. That focused Chromium smoke covers page health, an overlay, a representative
form, a responsive product composition, mobile navigation, RTL with reduced motion, and DatePicker.
It is fast feedback, not cross-engine release evidence. Every `dev -> main` release candidate runs
the complete Chromium suite plus the focused Firefox and WebKit projects in separate jobs.

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
- Automated browser checks complement, but do not replace, the
  [manual assistive-technology and real-device audit](./audits/core-1-0-accessibility-device-audit.md)
  tracked in #143.
- Native form chrome and font rasterization may differ by operating system. The contract is semantic
  behavior, focus visibility, usable geometry, and tokenized authored styling—not pixel identity.

## Operating-system and assistive-technology scope

The `dev -> main` release gate runs Linux browser engines and the release workflow is also exercised
locally on macOS. Development pull requests do not claim cross-engine release evidence. Windows and
mobile operating systems are supported through evergreen browser behavior but do not yet have a
dedicated native CI runner. VoiceOver, NVDA, JAWS, TalkBack, real iOS safe areas, and platform zoom
remain manual evidence; any confirmed blocker is release-blocking even when automated tests pass.
