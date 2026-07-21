# Browser, performance, and package quality gates

Nerio's beta-quality evidence is split by the layer that owns each risk. CI fails when a supported
engine, package budget, consumer contract, or deterministic performance check regresses.

## Browser strategy

`pnpm test:browser` runs the broad appearance and component-family matrix in Chromium and a compact,
shared interaction suite in Chromium, Firefox, and WebKit for both the docs and demo applications.
The shared suite covers focus-visible and keyboard order, Dialog and Sheet focus restoration,
Popover, Tooltip, Dropdown Menu, Select, and command positioning, Toast lifecycle, Table overflow,
Sidebar collapse, native forms, dynamic viewport bounds, RTL, and reduced motion.

CI allows one retry and writes `test-results/browser/results.json`, so a pass on retry remains visible
instead of becoming a hidden green result. Traces, screenshots, and videos are retained only on
failure. Run `pnpm test:browser:repeat` before merging changes that affect browser behavior; two clean
iterations are the minimum local flake check. Engine limitations are listed in
[`platform-support.md`](./platform-support.md); skips require a narrow test annotation and a matching
documented limitation.

## Deterministic performance checks

The Chromium docs and demo projects run `tests/browser/performance-smoke.spec.mjs`; the docs project
also runs `tests/browser/docs-performance-smoke.spec.mjs`. Together they block every third-party
request, reject console, page, and hydration errors, cap primary-route transferred resources at 8
MiB, limit cumulative layout shift to 0.1 after local fonts settle, and require a documentation
search result within one second. These are regression tripwires, not public speed claims or a
substitute for production observability.

## Package and bundle budgets

`pnpm validate:package-budgets` enforces the reviewed thresholds in
`quality/package-budgets.json` for:

- packed and unpacked bytes for all six public packages, including CLI and MCP;
- raw and gzip token CSS and the residual UI stylesheet;
- named server-safe Card and client Button imports;
- a named Lucide icon import, with Lucide included so accidental full-bundle retention is visible;
- each optional adapter subpath with its peer externalized.

The validator compares public barrel imports with direct implementation controls to prove
representative named component and icon imports do not retain unrelated code. Release smoke separately proves optional-peer isolation, exact
package boundaries, package/source-install builds, and a single emitted token payload.

Budgets include limited maintenance headroom. A threshold may be raised only in a focused reviewed
change that records the measured delta, the consumer value that justifies it, and the result in the
pull request and changelog. Moving a number merely to make CI green is not an override process.

## Local gate

```bash
pnpm validate:platform-support
pnpm validate:package-budgets
pnpm exec playwright install chromium firefox webkit
pnpm test:browser
pnpm test:browser:repeat
```

Visual regression remains Chromium-only and follows [`visual-regression.md`](./visual-regression.md).
