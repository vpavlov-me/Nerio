# Visual regression workflow

Nerio protects the maintainer-approved 1.0 visual language with a focused Playwright screenshot
suite. It complements contract, accessibility, and browser behavior tests; it does not replace them.

## Coverage

The private, no-index `/visual-test` route renders deterministic Core fixtures with fixed content.
The committed baselines cover every Core category and the load-bearing appearance matrix:

- Purple, light, Comfortable on desktop;
- Purple, dark, Comfortable on desktop;
- Purple, light, Compact on desktop;
- Purple, light, Comfortable on mobile;
- Blue as the non-Purple theme representative;
- RTL geometry;
- reduced-motion end states for Dialog, Sheet, Popover, Dropdown Menu, and Tooltip.

Forced-colors remains a behavioral assertion in `pnpm test:browser`. Chromium screenshot tooling does
not currently provide a reliable forced-colors pixel baseline across platforms.

The suite waits for the locally served Geist fonts, fixes locale, timezone, browser, viewport, and
device scale factor, blocks analytics, removes volatile chrome, and finishes animations before
capture. Fixtures contain no timestamps, random IDs, or network-owned content.

## Run and review

Install the pinned Chromium build once, then run:

```bash
pnpm exec playwright install chromium
pnpm test:visual
```

On failure, inspect the expected, actual, and diff images plus the retained trace and video under
`test-results/visual`. CI uploads the same evidence as the `visual-regression-artifacts` artifact.
The suite permits at most 100 changed pixels per image with a 0.15 per-pixel color threshold; do not
raise these limits to make a material visual change pass.

## Update baselines

Baseline updates are deliberate review artifacts, never an automatic side effect:

```bash
pnpm test:visual:update
git diff -- tests/visual/__screenshots__
```

Keep the baseline-only commit separate from implementation and documentation commits. Review every
changed expected image, attach representative evidence to the pull request, and explain the visual
rule that changed. A maintainer must apply the `visual-baseline-approved` pull-request label before
CI accepts a baseline change. `CODEOWNERS` assigns the fixture, config, tests, and snapshots to the
Nerio maintainer.

Do not update baselines for unexplained diffs, platform churn, failed font loading, animation
midpoints, or volatile data. Fix determinism first and rerun the suite at least twice from a clean
checkout before requesting approval.
