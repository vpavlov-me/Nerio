# Browser, performance, and package quality gates

Nerio's beta-quality evidence is split by the layer that owns each risk. The release-candidate gate
fails when a supported engine, package budget, consumer contract, or deterministic performance check
regresses.

## Tiered CI strategy

Pull requests from working branches into `dev` run `.github/workflows/pr-gate.yml`. Its required
`PR gate` aggregate is the short feedback loop. The always-on `development-quality` job covers
formatting, lint, type checking, unit and accessibility tests, catalog/token/onboarding validators,
documentation validation and examples, the packed Vite consumer, the workspace build, and measured
documentation route budgets. A repository-owned scope detector
compares the pull-request base and head SHAs, then selects additional contracts:

- runtime UI, tokens, adapters, Registry source, interactive docs, browser tests, or browser config
  run a focused seven-scenario Chromium smoke;
- visual component, token CSS, docs preview, fixture, snapshot, or visual-config changes run
  Chromium visual regression;
- CLI, MCP, adapters, public package boundaries, and manual-audit files run only their matching
  contract jobs;
- branch-policy unit tests run only when the policy workflow, implementation, or tests change.

Markdown-only, audit-only, workflow-only, and package-metadata-only changes do not acquire browser
or visual work unless they also touch a matching runtime surface. Conditional jobs may be
`success` or `skipped`; the `PR gate` fails on `failure` or `cancelled`. The independent
`branch-policy` status always validates pull-request direction. Development pull requests install
Chromium only, never run the full browser suite, and never run the supported-version Next.js
release-consumer matrix. The focused Vite fixture stays independent and runs on every pull request
because it proves public tarballs without workspace aliases or hidden dependencies.

Pull requests from `dev` into `main` run `.github/workflows/release-gate.yml`. The required
`Release gate` aggregate succeeds only after release quality, separate Chromium, Firefox, and
WebKit jobs, visual regression, CLI/MCP/adapter contracts, package contracts, and the manual-audit
contract all pass. Browser engines run in parallel with `fail-fast: false`, and package work does
not wait for browser completion. This preserves the full package, CLI, MCP, adapter, budget,
cross-browser, visual, packed-consumer, and pack evidence at the release boundary.

Baseline changes still require the `visual-baseline-approved` label. Label changes are not workflow
events, so they never restart development quality. After a maintainer reviews and applies the
label, rerun only the failed `visual-regression` job from the existing workflow run.

Both workflows use read-only contents permission, cancel superseded runs for the same pull request,
retain artifacts only on failure, and never publish packages, create tags, or create GitHub
Releases.

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
JavaScript, raw CSS, and deterministic gzip transfer allowances per reviewed route. The checked-in
report covers the home page, Getting Started, Button, Select, Calendar, DatePicker, Command
Primitive, one template detail, and one full-screen view, including major chunks, duplicated package
ownership, and the measured delta from the pre-split baseline.

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

The versioned Registry/source-lifecycle slice measured the CLI tarball at 10,224 bytes after adding
portable installed metadata, three-way hash comparison, non-destructive updates, conflict handling,
and actionable doctor diagnostics. The previous 8,000-byte ceiling was raised to 12,000 bytes; the
50,000-byte unpacked limit remains unchanged. This records the reviewed product value and retains
roughly 15% compressed maintenance headroom without weakening runtime bundle budgets.

## Manual accessibility and device evidence

[`quality/manual-audit-plan.json`](../quality/manual-audit-plan.json) defines the required
environments, evidence fields, stable routes, steps, and expected outcomes for issue #143.
[`docs/audits/core-1-0-accessibility-device-audit.md`](./audits/core-1-0-accessibility-device-audit.md)
is the human evidence record. `pnpm test:manual-audit-plan` and
`pnpm validate:manual-audit-plan` prevent the plan and report from drifting or claiming a manual
pass while evidence is still pending.

These validators prepare the audit only. Automated accessibility, browser, visual, and package
checks never substitute for VoiceOver, NVDA, TalkBack, native picker, physical-device, zoom,
contrast, or lived interaction evidence.

## Local gate

Focused development reproduction:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:ci-scopes
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
pnpm validate:manual-audit-plan
pnpm validate:platform-support
pnpm validate:api
pnpm validate:package-budgets
pnpm validate:release:metadata
pnpm test:consumer:vite
pnpm validate:route-budgets
pnpm test:release-consumer
pnpm pack:check
```

Visual regression remains Chromium-only and follows [`visual-regression.md`](./visual-regression.md).
It runs for visual-contract changes in development and always runs for a release candidate.
