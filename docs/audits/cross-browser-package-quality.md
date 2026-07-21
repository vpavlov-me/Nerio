# Cross-browser, performance, and package quality evidence

## Scope

Issue #142 raises the existing Chromium-focused alpha gate toward beta-quality compatibility and
performance evidence without changing Core component APIs, visual values, or product scope.

The implementation adds:

- shared docs and demo interaction suites for Chromium, Firefox, and WebKit;
- production-build browser servers with local-development route policy for deterministic smoke;
- failure-only traces, screenshots, videos, and an explicit CI retry report;
- deterministic route, hydration, layout-shift, third-party dependency, and search checks;
- an enforced runtime/framework/browser support policy;
- packed, unpacked, CSS, named-import, icon, and optional-adapter budgets;
- single-token-payload assertions in package, no-Preflight, and source-install consumer builds.

## Local evidence — 2026-07-21

| Gate                                    | Result                                                                                                                                         |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Format                                  | `pnpm format:check` passed                                                                                                                     |
| Lint                                    | `pnpm lint` passed, 12 tasks                                                                                                                   |
| TypeScript                              | `pnpm typecheck` passed, 12 tasks                                                                                                              |
| Build                                   | `pnpm build` passed, 8 tasks                                                                                                                   |
| UI contracts                            | `pnpm test:ui` passed, 147 tests                                                                                                               |
| Accessibility                           | `pnpm test:a11y` passed, 18 tests                                                                                                              |
| Catalog/token invalid fixtures          | `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release` passed, including 15 catalog/release-documentation tests and 47 token/runtime-axis tests |
| CLI/MCP                                 | `pnpm test:cli` and `pnpm test:mcp` passed                                                                                                     |
| Adapters                                | `pnpm test:adapters` passed, including packed optional-peer isolation and 3 Motion tests                                                       |
| Platform policy                         | `pnpm validate:platform-support` passed                                                                                                        |
| Package budgets                         | `pnpm validate:package-budgets` passed for all configured thresholds                                                                           |
| Packed release consumer                 | `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release` passed for 6 public packages and all three consumer style modes                          |
| Chromium browser                        | Full docs/demo suite passed: 30 tests                                                                                                          |
| Firefox browser                         | Shared docs/demo suite passed in Linux CI: 5 tests                                                                                             |
| WebKit browser                          | Shared docs/demo suite passed: 5 tests                                                                                                         |
| Visual regression                       | `pnpm test:visual` passed, 18 screenshots                                                                                                      |
| Branch/docs examples/package inspection | `pnpm test:branch-policy`, `pnpm test:docs-examples`, and `pnpm pack:check` passed                                                             |

Representative measured budgets:

- `@nerio-ui/ui`: 49,804-byte tarball against a 65,000-byte threshold;
- token CSS: 61,630 raw bytes and 9,018 gzip bytes against 70,000/11,000 thresholds;
- UI residual CSS: 4,039 raw bytes and 818 gzip bytes against 5,000/3,000 thresholds;
- named Card import: 3,731 bytes, identical to the direct Card control;
- named Button import: 12,695 bytes, identical to the direct Button control;
- named Search icon: 1,739 bytes, identical to the direct Lucide Search control.

## Pull request CI evidence — 2026-07-21

PR #256 quality run `29841581017` passed all 40 browser tests in 2.0 minutes: 30 Chromium, 5 Firefox,
and 5 WebKit. The first attempt passed without a retry or flaky result. The same SHA passed branch
policy, visual regression, docs and demo Vercel previews, build, and package inspection.

A later documentation-only SHA exposed two WebKit keyboard timing races as pass-on-retry results.
The harness now waits for the Base UI focus transfer before sending the next key; the two affected
scenarios passed 10/10 locally with `--repeat-each=5`. CI now enables `failOnFlakyTests`, so a future
retry cannot produce an approval-ready green job.

The local macOS Firefox 141 binary still cannot establish Playwright's Juggler connection. It times
out before opening a page with the browser-level graphics error
`RenderCompositorSWGL failed mapping default framebuffer`; Chromium and WebKit launch normally on the
same machine. This local browser-runtime limitation is not converted into a test skip because the
required Linux Firefox evidence is green. Future passes on retry remain flake evidence to investigate,
not silently equivalent to a first-attempt pass.

## Boundaries

- No Core component API, responsibility, tier, token value, or visual recipe changed.
- No Pro component, template, backend, or continuous monitoring service was added.
- Chromium retains the broad appearance matrix; Firefox and WebKit run the load-bearing shared
  interaction suite instead of duplicating every equivalent appearance combination.
- Engine limitations are narrow and documented in `docs/platform-support.md`; unexpected console,
  page, resource, positioning, focus, overflow, or lifecycle failures remain blocking.
