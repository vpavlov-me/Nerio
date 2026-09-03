# Browser, performance, and package quality gates

Nerio's beta-quality evidence is split by the layer that owns each risk. The release-candidate gate
fails when a supported engine, package budget, consumer contract, or deterministic performance check
regresses.

## Tiered CI strategy

Pull requests from working branches into `dev` run `.github/workflows/pr-gate.yml`. Its required
`PR gate` aggregate is the short feedback loop. `always-fast` owns formatting, lint, type checking,
scope-detector tests, branch-policy tests, DCO tests, and exact-candidate tests. Detector outputs then
select independent docs, UI/Chromium, visual, package, CLI, MCP, adapter, manual-release, and
workflow contracts.

Markdown-only changes materially use `docs_only`: their documentation validators run inside
`always-fast`, while the separate docs build job and every runtime job stay skipped. UI changes do
not inherit docs builds, packed Vite work, CLI, MCP, adapters, or manual contracts unless their
paths also select those scopes. Unknown paths and broad root dependency/configuration changes fail
safe by selecting every contract. Conditional jobs may be `success` or `skipped`; the single
`PR gate` aggregate fails on any selected `failure` or `cancelled`.

The workflow-topology measurement below excludes the independent `branch-policy` status, counts
expanded matrix legs as jobs, and counts one frozen-lockfile install per selected contract job:

| Representative change  | Before jobs / installs | After jobs / installs | Material difference                                                                         |
| ---------------------- | ---------------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| Markdown-only docs     | 3 / 1                  | 3 / 1                 | The install count stays flat; runtime, build, package, and browser commands no longer run.  |
| UI runtime + visual    | 5 / 3                  | 5 / 3                 | UI, Chromium, and visual evidence remain; unrelated docs/package/tool commands are removed. |
| release line -> `main` | 12 / 11                | 13 / 11               | Exact-candidate validation adds one no-install job; the complete release boundary remains.  |

The independent `branch-policy` status validates direction and DCO for every pull request. A DCO
match is required for each human commit; Dependabot and recognized bot authors remain exempt.
Development pull requests install Chromium only when selected, never run the full browser suite,
and never run the supported-version Next.js release-consumer matrix.

Pull requests from an approved same-repository release line into `main` run
`.github/workflows/release-gate.yml`. Stable 1.0 uses `release/1.0`; `dev` remains valid for a later
explicitly approved release train. The required `Release gate` aggregate succeeds only after an
exact candidate job proves that the requested 40-character SHA is the checked-out release HEAD.
Every downstream checkout uses that immutable SHA. The gate then requires release quality,
separate Chromium, Firefox, and WebKit jobs, visual regression, CLI/MCP/adapter contracts, package
contracts, the consumer matrix, and the human-evidence contract. Candidate identity and the
all-package SBOM are retained as SHA-named artifacts. Browser engines run in parallel with
`fail-fast: false`, and package work does not wait for browser completion.

Baseline changes still require the `visual-baseline-approved` label. Label changes are not workflow
events, so they never restart development quality. After a maintainer reviews and applies the
label, rerun only the failed `visual-regression` job from the existing workflow run.

Actions are pinned to immutable commit SHAs with readable version comments; Dependabot continues to
propose reviewed GitHub Actions updates. Workflows use read-only contents permission (plus
read-only pull-request metadata for the authenticated visual label lookup), cancel superseded runs,
and never publish packages, create tags, move dist-tags, or create GitHub Releases.

## Browser strategy

`pnpm test:browser` runs the broad appearance and component-family matrix in Chromium and a compact,
shared interaction suite in Chromium, Firefox, and WebKit for both documentation and docs-local
Template routes.
The shared suite covers focus-visible and keyboard order, Dialog and Sheet focus restoration,
Popover, Tooltip, Dropdown Menu, Select, and command positioning, Toast lifecycle, Table overflow,
Sidebar collapse, native forms, dynamic viewport bounds, RTL, and reduced motion.

The release gate allows one diagnostic retry, writes `test-results/browser/results.json`, and enables
`failOnFlakyTests`, so a pass on retry remains visible and still fails the job. Traces, screenshots,
and videos are retained only on failure. Run `pnpm test:browser:repeat` before merging changes that
affect browser behavior; two clean iterations are the minimum local flake check. Engine limitations are listed in
[`platform-support.md`](./platform-support.md); skips require a narrow test annotation and a matching
documented limitation.

## Deterministic performance checks

The Chromium Template project runs `tests/browser/performance-smoke.spec.mjs`; the docs project runs
`tests/browser/docs-performance-smoke.spec.mjs`. Together they block every third-party request,
reject console, page, and hydration errors, enforce the per-route runtime transfer allowances in
`quality/docs-route-budgets.json`, limit cumulative layout shift to 0.1, require Largest Contentful
Paint within 2.5 seconds after local fonts settle, reject document-level horizontal overflow, and
require a documentation search result within one second. These are regression tripwires, not public
speed claims or a substitute for production observability.

## Package and bundle budgets

`pnpm validate:package-budgets` enforces the reviewed thresholds in
`quality/package-budgets.json` for:

- packed and unpacked bytes for all six public packages, including CLI and MCP;
- raw and gzip token CSS and the residual UI stylesheet;
- named server-safe Card and client Button imports;
- a named Lucide icon import, with Lucide included so accidental full-bundle retention is visible;
- each optional adapter subpath with its peer externalized.

`pnpm validate:route-budgets` reads production Next.js client-reference manifests and enforces raw
JavaScript, raw CSS, and deterministic gzip transfer allowances per reviewed route. The tracked
baseline in `quality/docs-route-bundle-baseline.json` covers the home page, Getting Started, Button,
Select, Calendar, DatePicker, Command Primitive, one template detail, and one full-screen view. A
current full diagnostic, including major chunks, duplicated package ownership, and measured deltas,
is written to ignored `artifacts/docs-route-bundle-report.json` and uploaded by CI from the existing
production build. See the [artifact retention policy](./artifact-retention.md) for inspection,
baseline refresh, and budget-review commands.

`pnpm test:consumer:vite` packs the public artifacts and builds a clean Vite + React + TypeScript +
Tailwind CSS v4 fixture with explicit dependencies, representative server-safe and client imports,
and no workspace aliases. It also proves that Table, Motion, React Hook Form, Recharts, and Zod
optional peers are not installed by an unrelated consumer. This is compatibility evidence for the
tested fixture, not a new blanket support claim.

The validator compares public barrel imports with direct implementation controls to prove
representative named component and icon imports do not retain unrelated code. Release smoke separately proves optional-peer isolation, exact
package boundaries, package/source-install builds, and a single emitted token payload.

Budgets include limited maintenance headroom. A threshold may be raised only in a focused reviewed
change that records the measured delta, the consumer value that justifies it, and the result in the
pull request and changelog. Moving a number merely to make CI green is not an override process.

The expanded Operations Workspace template introduced five local avatar assets, charts, risk and
capacity views, and richer initiative content. Its deterministic Chromium runtime transfer changed
from 581,370 bytes before the template expansion to 778,265 bytes after it (+196,895). The reviewed
ceiling is 844,800 bytes: the measurement rounds to the next KiB before adding the policy's 64 KiB
runtime-variance allowance. Static JavaScript, CSS, and deterministic gzip bundle ceilings remain
unchanged.

The versioned Registry/source-lifecycle slice measured the CLI tarball at 10,224 bytes after adding
portable installed metadata, three-way hash comparison, non-destructive updates, conflict handling,
and actionable doctor diagnostics. The previous 8,000-byte ceiling was raised to 12,000 bytes; the
50,000-byte unpacked limit remains unchanged. This records the reviewed product value and retains
roughly 15% compressed maintenance headroom without weakening runtime bundle budgets.

## Human accessibility evidence

[`quality/stable-accessibility-smoke.json`](../quality/stable-accessibility-smoke.json) defines the
bounded stable 1.0 human gate. It covers maintainer-run VoiceOver, keyboard-only navigation,
zoom/reflow/contrast, and mobile touch across the release-critical scenario groups. A stable
channel requires `pnpm validate:stable-accessibility-smoke --expect-pass` against the exact
candidate and deployment, with evidence for every result and no unresolved accepted blocker.

[`quality/manual-audit-plan.json`](../quality/manual-audit-plan.json) defines the required
environments, evidence fields, stable routes, steps, and expected outcomes for issue #143.
[`docs/audits/core-1-0-accessibility-device-audit.md`](./audits/core-1-0-accessibility-device-audit.md)
is the human evidence record. `pnpm test:manual-audit-plan` and
`pnpm validate:manual-audit-plan` prevent the plan and report from drifting or claiming a manual
pass while evidence is still pending.

These validators prepare the broader post-release audit only. Automated accessibility, browser,
visual, and package checks never substitute for VoiceOver, NVDA, TalkBack, native picker,
physical-device, zoom, contrast, or lived interaction evidence.

`pnpm validate:stable-readiness` reads the release channel. Beta candidates accept truthful pending
human records. A stable channel switches the scoped smoke to strict completion while continuing to
validate the broader manual-audit and external-feedback records in their truthful current states.
`quality/beta-feedback.json` remains the machine-readable record for issue #146 until real external
consumers complete the post-release cycle. The optional strict completion validators remain
available for closing those follow-up programs; they are not stable 1.0 publication prerequisites.

After the source candidate is locked, only the stable-smoke record, its human-readable audit, and
[`core-1-0-release-readiness.md`](./core-1-0-release-readiness.md) may change before final approval.
The candidate-lock validator rejects every other post-candidate path, including release policy,
application, package, Registry, component, and test changes. Those changes require a new candidate
and an explicit evidence refresh or documented non-runtime carry-forward.

## Local gate

Focused development reproduction:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:ci-scopes
pnpm test:repo-artifacts
pnpm validate:repo-artifacts
pnpm test:ui
pnpm test:a11y
pnpm test:catalog
pnpm test:tokens
pnpm test:onboarding
pnpm validate:tokens
pnpm validate:runtime-axes
pnpm validate:typography
pnpm validate:catalog
pnpm validate:docs
pnpm validate:onboarding
pnpm test:docs-examples
pnpm test:consumer:vite
pnpm build
pnpm validate:route-budgets
pnpm test:browser:pr
```

Complete release-candidate reproduction:

```bash
pnpm test:branch-policy
pnpm test:browser:chromium
pnpm test:browser:firefox
pnpm test:browser:webkit
pnpm test:visual
pnpm test:cli
pnpm test:mcp
pnpm test:adapters
pnpm test:api
pnpm test:manual-audit-plan
pnpm test:beta-feedback
pnpm validate:stable-readiness
pnpm validate:platform-support
pnpm validate:api
pnpm validate:package-budgets
pnpm validate:release:metadata
pnpm test:consumer:vite
pnpm validate:route-budgets
pnpm test:release-consumer
pnpm pack:check
pnpm test:sbom
```

Visual regression remains Chromium-only and follows [`visual-regression.md`](./visual-regression.md).
It runs for visual-contract changes in development and always runs for a release candidate.
