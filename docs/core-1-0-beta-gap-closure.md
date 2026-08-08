# Core 1.0 beta technical gap closure

This report records the technical work completed after the `1.0.0-beta.0` publication and the
evidence collected for the coordinated, unpublished `1.0.0-beta.1` candidate.

**Decision: Technical gaps closed; manual beta and accessibility gates remain**

This is a beta engineering decision, not stable approval. No npm package was published, no dist-tag
was moved, no Git tag or GitHub Release was created, and `main` was not changed by this work.

## Scope and immutable evidence

| Field                        | Value                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------- |
| Tracking issue               | [#330](https://github.com/vpavlov-me/Nerio/issues/330)                                              |
| Final preparation issue      | [#336](https://github.com/vpavlov-me/Nerio/issues/336)                                              |
| Gap-window start             | `06748c14b099f7720d4e1cf9acdc90e81448cabe` — synchronized `main` into `dev`                         |
| Verified technical candidate | `d71093e19e9d9f68076be47f63ad0a438138a7b8`                                                          |
| Candidate verification       | GitHub-verified merge commit from [PR #362](https://github.com/vpavlov-me/Nerio/pull/362)           |
| Exact-candidate release gate | [run 30756737816](https://github.com/vpavlov-me/Nerio/actions/runs/30756737816), all 13 jobs passed |
| Change window                | 154 files, 12,857 insertions, 2,760 deletions                                                       |
| Prepared version             | `1.0.0-beta.1` across all six public packages                                                       |
| Published version            | npm `beta` remains `1.0.0-beta.0`                                                                   |
| Manual accessibility gate    | [#143](https://github.com/vpavlov-me/Nerio/issues/143), open; evidence pending                      |
| External beta gate           | [#146](https://github.com/vpavlov-me/Nerio/issues/146), open; evidence pending                      |

The report itself follows the verified candidate as documentation-only evidence. The exact
candidate validator proved that `d71093e19e9d9f68076be47f63ad0a438138a7b8` is a repository-owned
ancestor of `origin/dev`; every release job checked out that SHA rather than an ambiguous branch
tip.

## Delivery sequence

| Gap                                     | Issue                                                  | Pull request and merge commit                                                                                                                                                                                                                                                                        | Result                                                                                            |
| --------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Toolchain, support, browsers, metadata  | [#331](https://github.com/vpavlov-me/Nerio/issues/331) | [#337](https://github.com/vpavlov-me/Nerio/pull/337), `6ecc65a5fb17a258fd49733a929d6de279ad5932`                                                                                                                                                                                                     | Node 22/24 and bounded dependency profiles, pinned browser baseline, coordinated metadata tooling |
| Calendar SSR and public type isolation  | [#332](https://github.com/vpavlov-me/Nerio/issues/332) | [#338](https://github.com/vpavlov-me/Nerio/pull/338), `938efc3a47f6e0b720991eaf12dbb81e49a2c6a7`                                                                                                                                                                                                     | Clock-independent Calendar/DatePicker markup and Nerio-owned interactive contracts                |
| Registry atomicity and remote hardening | [#333](https://github.com/vpavlov-me/Nerio/issues/333) | [#339](https://github.com/vpavlov-me/Nerio/pull/339), `445854f0fdfa58e94aad8a30286a879f806e0f3c`; [#340](https://github.com/vpavlov-me/Nerio/pull/340), `cce8437e37758c3f35f34dc56966445132065c44`; [#358](https://github.com/vpavlov-me/Nerio/pull/358), `a0b51076512055d10084ac9bfebf2832c0d42e4f` | Recoverable operation-atomic updates, serialization, heartbeat lease, HTTPS/integrity/bounds      |
| Consumers, docs architecture, budgets   | [#334](https://github.com/vpavlov-me/Nerio/issues/334) | [#359](https://github.com/vpavlov-me/Nerio/pull/359), `0bbb726adc509055b1d051d48c0d4f82dc41e55b`; [#360](https://github.com/vpavlov-me/Nerio/pull/360), `7b83434a49a9c133fe9d8af714cf44b2d1285dfb`                                                                                                   | Packed Vite evidence, server content/client islands, complete measured route budgets              |
| CI, supply chain, strict manual gates   | [#335](https://github.com/vpavlov-me/Nerio/issues/335) | [#361](https://github.com/vpavlov-me/Nerio/pull/361), `3e1f1186dfeae05c3b880031fe989afa898e6193`                                                                                                                                                                                                     | Scope-aware PR jobs, exact SHA, DCO, pinned Actions, SBOM, truthful strict completion validators  |
| Coordinated beta metadata               | [#336](https://github.com/vpavlov-me/Nerio/issues/336) | [#362](https://github.com/vpavlov-me/Nerio/pull/362), `d71093e19e9d9f68076be47f63ad0a438138a7b8`                                                                                                                                                                                                     | Prepared beta.1 metadata and migration plus deterministic browser/visual acceptance timing        |

All implementation pull requests targeted `dev`. The work did not add Core components, Pro
workflows, date ranges, scheduling, recurrence, upload workflows, multi-thumb sliders, DataGrid, or
product-specific abstractions.

## Gap and SemVer map

| Public contract                        | Consumer-visible change                                                                                                         | Classification for the beta line                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Node and Tailwind support              | Node minimum is 22; Tailwind minimum is 4.1.0                                                                                   | Breaking support-policy change                                  |
| Calendar and DatePicker initialization | Empty initial markup no longer reads the host clock; products pass consumer-owned `today` when current-day behavior is required | Breaking default-semantics correction                           |
| Interactive component types            | Public props, values, states, and event details no longer derive from Base UI declarations; `TabsValue` is `string`             | Breaking type-contract cleanup                                  |
| Registry schema and transport          | Every source has SHA-256 integrity; remote access is HTTPS-first and bounded                                                    | Compatible schema/transport feature with migration requirements |
| CLI update lifecycle                   | Add/update are operation-atomic, journaled, serialized, and recoverable                                                         | Backward-compatible reliability feature                         |
| MCP discovery                          | Four tools declare output schemas and return equivalent `structuredContent`; missing lookup has `COMPONENT_NOT_FOUND`           | Backward-compatible response extension                          |
| Framework evidence                     | Packed Next minimum/current profiles and one Vite fixture build independently                                                   | Evidence expansion, no blanket framework promise                |
| Documentation architecture and budgets | Reference content is server-rendered with typed client preview islands and measured route budgets                               | Internal architecture and performance contract                  |
| CI and supply chain                    | Scope-aware PR checks, strict release boundary, exact candidate, DCO, pinned Actions, candidate SBOM                            | Process and release-contract hardening                          |

Because the support policy, Calendar semantics, and public TypeScript surface changed from
`1.0.0-beta.0`, all six packages and the Registry revision were prepared together as
`1.0.0-beta.1`. The reviewed API approval classifies the normalized snapshot as breaking under
issue #336 with hash `248544c8b546`.

## Consumer migration

The complete consumer-facing instructions are in
[`migrations/beta-0-to-beta-1.md`](./migrations/beta-0-to-beta-1.md). The required actions are:

1. Move supported tooling to Node 22 or 24 and Tailwind CSS 4.1 or newer within the 4.x line.
2. Update the six coordinated Nerio packages together after a separately authorized publication.
3. Pass `today` from the application boundary when Calendar or an empty DatePicker should expose a
   current-day marker or open on the user's current month.
4. Replace Base UI-derived event annotations with the corresponding Nerio exports and use stable
   string identifiers for Tabs.
5. For source installs, run `nerio doctor`, `nerio diff`, and `nerio update --dry-run` before the
   update; move production Registry mirrors to HTTPS and add declared integrity to custom
   manifests.
6. MCP consumers may migrate from parsing the preserved JSON text to validated
   `structuredContent`.

The prepared `1.0.0-beta.1` commands in README and onboarding surfaces are not externally
resolvable until publication is separately authorized.

## Support and browser matrix

| Surface      | Verified range or version         | Evidence                              |
| ------------ | --------------------------------- | ------------------------------------- |
| Node.js      | `>=22`; CI consumers on 22 and 24 | Minimum/current packed Next consumers |
| React        | `>=19 <20`                        | 19.0.0 minimum; 19.2.8 current        |
| Next.js      | `>=16.2.0 <17`                    | 16.2.0 minimum; 16.2.12 current       |
| TypeScript   | `>=5.9 <6`                        | 5.9.2 minimum; 5.9.3 current          |
| Tailwind CSS | `>=4.1.0 <5`                      | 4.1.0 minimum; 4.3.3 current          |
| Playwright   | 1.62.1                            | Pinned reproducible release gate      |
| Chromium     | 151+                              | 114/114 release tests passed          |
| Firefox      | 153+                              | 16/16 release tests passed            |
| WebKit       | 26.5+                             | 16/16 release tests passed            |

The minimum optional-peer profile is TanStack Table 8.21.3, Motion 12.42.2, React Hook Form 7.68.0,
Recharts 3.6.0, and Zod 4.2.1. The current profile is Table 8.21.3, Motion 12.43.0, React Hook Form
7.83.0, Recharts 3.10.1, and Zod 4.4.3. Each adapter is checked with its peer installed, while the
packed icons/UI-only consumer proves unrelated peers do not arrive transitively.

Exact safe-area inset emulation and forced-colors automation remain Chromium-specific. Firefox and
WebKit cover dynamic viewport bounds, overflow, keyboard/focus behavior, native forms, RTL, and
reduced motion without claiming unavailable emulation.

## SSR, Registry, CLI, and MCP evidence

Calendar resolves its initial visible month from controlled `month`, `defaultMonth`, controlled
`value`, `defaultValue`, consumer-owned `today`, then the neutral `1970-01-01` fallback. Without
`today`, initial markup has no host-clock-derived `aria-current="date"` or `data-today`. Cross-time
zone SSR/hydration and unavailable-date roving-focus contracts are covered by the UI and browser
suites.

Registry validation covered 46 items and the exact SHA-256 integrity for every source. CLI fixtures
covered dry run, local-path and URL installs, dependency closure, form/feedback/display examples,
HTTPS policy, time and size bounds, redirects, content types, integrity, secret-safe errors,
transaction rollback, abrupt-exit recovery, process locking, dead-owner reclamation, and heartbeat
startup failure. The lock file commits only after the source transaction succeeds.

The MCP fixture passed over the official stdio transport. All four discovery tools retain the JSON
text payload while exposing declared output schemas and equivalent structured content.

## Independent consumer evidence

The exact-candidate release run built six packed public packages in three isolated Next profiles:

- Node 22 with minimum React, Next, TypeScript, Tailwind, and optional peers;
- Node 22 with current supported dependencies;
- Node 24 with current supported dependencies.

Each profile completed the documented eight-command local CLI workflow, packaged MCP-bin discovery,
representative source installs, a clean Next production build, adapter subpath isolation, and all
five optional peer integrations.

The independent Vite + React + TypeScript + Tailwind CSS v4 fixture built four packed packages,
static and client components, token/UI Tailwind bridges, forms, overlays, feedback, and date
controls without monorepo aliases or hidden optional peers. This is a verified fixture, not a
blanket claim for every Vite configuration.

## Documentation architecture and measured budgets

Standard reference pages now keep reference content on the server and load typed, statically
registered preview islands only where interaction is required. The release gate built 81
static/SSG routes and validated nine production route budgets.

Measured production JavaScript and deterministic gzip transfer changed as follows:

| Route                                |            JS before → after |      Transfer before → after |
| ------------------------------------ | ---------------------------: | ---------------------------: |
| `/`                                  |     748,996 → 748,079 (-917) |     274,063 → 274,356 (+293) |
| `/docs/getting-started`              |     475,637 → 475,462 (-175) |     194,285 → 194,172 (-113) |
| `/docs/components/button`            | 974,738 → 480,485 (-494,253) | 322,882 → 196,037 (-126,845) |
| `/docs/components/select`            | 968,517 → 479,602 (-488,915) | 320,782 → 195,708 (-125,074) |
| `/docs/components/calendar`          | 978,516 → 489,601 (-488,915) | 323,847 → 199,141 (-124,706) |
| `/docs/components/date-picker`       | 983,687 → 514,508 (-469,179) | 325,255 → 207,177 (-118,078) |
| `/docs/components/command-primitive` | 980,265 → 482,745 (-497,520) | 325,022 → 196,794 (-128,228) |
| `/templates/operations-workspace`    |     734,057 → 733,140 (-917) |     270,392 → 270,614 (+222) |
| `/views/operations-workspace`        | 1,129,114 → 1,128,311 (-803) |   384,858 → 386,655 (+1,797) |

Small transfer increases on shared shell/template routes remain inside the reviewed approximately
4 KiB deterministic headroom. The large standard component-page reductions are the intended
server-content/client-island result.

## CI topology before and after

The scope-aware development workflow preserves one required aggregate while avoiding unrelated
runtime work:

| Representative change | Before jobs / installs | After jobs / installs | Result                                                                   |
| --------------------- | ---------------------: | --------------------: | ------------------------------------------------------------------------ |
| Markdown-only docs    |                  3 / 1 |                 3 / 1 | Documentation validators run; runtime/build/browser jobs skip            |
| UI runtime + visual   |                  5 / 3 |                 5 / 3 | UI, Chromium, and visual remain; unrelated package/tool work is removed  |
| `dev -> main` release |                12 / 11 |               13 / 11 | Exact-candidate no-install job added; complete release boundary retained |

Unknown paths and broad root dependency/configuration changes fail safe by selecting every
contract. The release workflow keeps independent Chromium, Firefox, WebKit, visual, package, tool,
quality, consumer, and manual/beta jobs with `fail-fast: false`.

## Package and performance budgets

All package and CSS budgets passed on the exact candidate:

| Surface              |         Tarball |          Unpacked |
| -------------------- | --------------: | ----------------: |
| `@nerio-ui/tokens`   | 12,318 / 15,000 |  76,817 / 100,000 |
| `@nerio-ui/ui`       | 63,716 / 65,000 | 319,341 / 500,000 |
| `@nerio-ui/adapters` |   3,492 / 5,000 |    8,696 / 30,000 |
| `@nerio-ui/registry` | 29,813 / 31,000 | 176,740 / 250,000 |
| `@nerio-ui/cli`      | 18,970 / 19,000 |   79,823 / 80,000 |
| `@nerio-ui/mcp`      |   3,213 / 4,000 |    8,928 / 30,000 |

Token CSS measured 71,298 / 72,000 bytes raw and 10,074 / 11,000 gzip. UI residual CSS measured
4,039 / 5,000 raw and 818 / 3,000 gzip. The CLI has the narrowest remaining package headroom;
future growth requires a focused reviewed threshold change with measured consumer value.

Local performance verification passed 10/10 tests across the full-screen Template, eight measured
documentation routes, and search responsiveness. Route budgets cover JavaScript, CSS,
deterministic and browser transfer, runtime, CLS, LCP, network errors, hydration, and overflow.

## Supply-chain evidence

- Every human commit in the sequence uses a matching DCO sign-off; beta preparation commits and
  merge commits are GitHub-verified.
- Third-party Actions are pinned to immutable reviewed SHAs with readable version comments and
  Dependabot updates.
- Workflow permissions are read-only except for the minimum pull-request metadata read required by
  visual approval.
- The exact candidate is validated for repository membership and `dev` ancestry before downstream
  jobs start.
- A deterministic CycloneDX SBOM covers all six public packages and is bound to
  `d71093e19e9d9f68076be47f63ad0a438138a7b8`.
- `pnpm audit --prod --audit-level low` reported no known vulnerabilities.
- Six `npm pack --dry-run` inspections passed for `1.0.0-beta.1`.
- Workflows contain no npm credentials and perform no publication, tag, dist-tag, or GitHub Release
  mutation.

GitHub emitted an informational annotation that the pinned `actions/upload-artifact` release still
targets the Actions Node 20 runtime and was force-run by GitHub on Node 24. This does not alter
Nerio's product Node 22/24 matrix and did not fail any job.

## Commands and exact results

| Command or gate                                        | Result                                                                                                 |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `pnpm prepare:release-version 1.0.0-beta.1`            | Dry-run completed before tracked writes; 15 coordinated paths and before/after SHA-256 values reported |
| `pnpm prepare:release-version 1.0.0-beta.1 --write`    | Applied the reviewed coordinated plan                                                                  |
| `pnpm format:check && pnpm lint && pnpm typecheck`     | Passed locally and in release quality                                                                  |
| Branch, DCO, CI-scope, workflow, candidate tests       | 34 focused tests passed; exact candidate accepted                                                      |
| `pnpm test:ui`                                         | 173/173 passed                                                                                         |
| `pnpm test:a11y`                                       | 25/25 automated tests passed; not manual evidence                                                      |
| Catalog, token, API, onboarding tests                  | 43 + 50 + 8 + 7 passed                                                                                 |
| `pnpm validate:registry`                               | Integrity valid for 46 items                                                                           |
| `pnpm test:cli && pnpm test:mcp && pnpm test:adapters` | Passed, including packed/current/minimum optional-peer isolation                                       |
| `pnpm test:consumer:minimum`                           | Passed on Node 22                                                                                      |
| `pnpm test:consumer:current`                           | Passed independently on Node 22 and Node 24                                                            |
| `pnpm test:consumer:vite`                              | Passed with four packed packages and optional-peer isolation                                           |
| `pnpm build && pnpm validate:route-budgets`            | 81 static/SSG routes built; 9 production route budgets passed                                          |
| `pnpm test:browser:chromium`                           | 114/114 passed in Linux release CI                                                                     |
| `pnpm test:browser:firefox`                            | 16/16 passed in Linux release CI                                                                       |
| `pnpm test:browser:webkit`                             | 16/16 passed in Linux release CI                                                                       |
| Local repeat                                           | 260/260 Chromium + WebKit tests passed across two iterations                                           |
| `pnpm test:visual`                                     | 30/30 passed locally and in Linux release CI                                                           |
| `pnpm test:performance`                                | 10/10 passed locally                                                                                   |
| `pnpm validate:package-budgets`                        | All package, CSS, import, icon, and adapter budgets passed                                             |
| `pnpm audit:prod`                                      | No known vulnerabilities                                                                               |
| `pnpm pack:check`                                      | All six beta.1 package dry runs passed                                                                 |
| Candidate SBOM                                         | Generated and validated for all six packages at `d71093e19e9d9f68076be47f63ad0a438138a7b8`             |
| Manual/beta contract job                               | 22-scenario/8-environment audit plan valid but pending; external beta valid but pending                |
| Exact release workflow                                 | 13/13 jobs passed, including aggregate `Release gate`                                                  |

The local macOS Firefox Nightly process could not create its headless software framebuffer and
timed out in `browserType.launch` before assertions. That environment failure was not counted as a
pass or hidden by a retry. The authoritative Linux release job subsequently passed 16/16 Firefox
tests against the exact candidate.

The mandatory local repeat exposed two real acceptance-harness races. InputGroup hover asserted
before its intentional transition advanced, and the Finance chart snapshot could capture a
Recharts SVG reveal animation mid-frame. The harness now waits for the hover state and disables the
chart reveal only in deterministic visual capture. Focused 10-iteration checks and the full clean
repeat/visual gates passed without changing runtime behavior or visual baselines.

## Remaining manual requirements

Technical automation cannot close either remaining human gate:

- [#143](https://github.com/vpavlov-me/Nerio/issues/143) remains open with
  `manual-evidence-pending`. It still requires a locked candidate plus real VoiceOver, NVDA,
  TalkBack, physical iOS/Android device, 200%/400% zoom and reflow, reduced-motion, high-contrast,
  native-control, and scenario-level evidence. The issue was reopened because its canonical record
  had no candidate, CI/Vercel lock, environment results, finding dispositions, or allowed final
  decision.
- [#146](https://github.com/vpavlov-me/Nerio/issues/146) remains open. Stable readiness still
  requires the complete external feedback window, at least three independent consumers, package
  and source modes, date controls, Registry update evidence, finding dispositions, and an
  affirmative human proceed decision.

`pnpm validate:stable-readiness` passed only because the active channel is beta and the pending
records are truthful. A stable channel automatically selects strict completion validators, which
reject missing or future-dated human evidence and blocking decisions.

## Known limitations and next authority boundary

- `1.0.0-beta.1` is prepared but unpublished; npm `beta` still resolves to `1.0.0-beta.0`.
- Publication, dist-tag movement, Git tags, GitHub Releases, and `dev -> main` promotion require
  separate explicit authorization.
- This work does not claim stable readiness.
- Vite evidence covers the maintained fixture, not every Vite/plugin combination.
- Windows and mobile operating systems do not have native CI runners; their assistive-technology
  and real-device claims remain manual.
- No automated result in this report substitutes for the evidence required by #143 or #146.
