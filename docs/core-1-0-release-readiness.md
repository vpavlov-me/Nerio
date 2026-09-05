# Core 1.0 release readiness

This record documents the final candidate-bound preparation tracked by
[#150](https://github.com/vpavlov-me/Nerio/issues/150). It does not publish packages, move npm
dist-tags, merge the release pull request, create `v1.0.0`, or create a GitHub Release. Those actions
remain separately approved work in [#151](https://github.com/vpavlov-me/Nerio/issues/151).

## Decision

**Ready for separately approved manual `1.0.0` release.**

The decision applies to source candidate
`c318f0760a340a0c5949e604b8381d7fef83c1f1` plus the allowlisted evidence commits described below.
It authorizes no merge or public release mutation.

## Candidate identity

| Field                            | Exact identity                                                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Release line                     | `release/1.0`                                                                                                      |
| Release pull request             | [#584](https://github.com/vpavlov-me/Nerio/pull/584)                                                               |
| Approved base                    | `031fecd546b2122faf8a5ec92e17bc743dca9729` (`origin/main`)                                                         |
| Original manual-smoke candidate  | `da3923f38f91f38b77f890ad28e043ab16f45fe1`                                                                         |
| Original manual-smoke deployment | <https://nerio-mbwxunoxu-dquality.vercel.app>                                                                      |
| Source candidate                 | `c318f0760a340a0c5949e604b8381d7fef83c1f1`                                                                         |
| Source ancestry                  | The approved base is an ancestor; the source candidate is 28 commits ahead and 0 behind                            |
| Source-candidate deployment      | <https://nerio-f6yjsyqij-dquality.vercel.app>                                                                      |
| Source release workflow          | [run 33950076831](https://github.com/vpavlov-me/Nerio/actions/runs/33950076831)                                    |
| Source branch policy             | [run 33950076874](https://github.com/vpavlov-me/Nerio/actions/runs/33950076874)                                    |
| Source Vercel record             | [deployment 2daWnCCMADN44y8U1DDUbv1oFRa1](https://vercel.com/dquality/nerio/2daWnCCMADN44y8U1DDUbv1oFRa1)          |
| Pre-report evidence commit       | `0efb75c4e282e01fd5a4bdc4efd3df5591e5f547`                                                                         |
| Pre-report evidence deployment   | <https://nerio-dny89ea4q-dquality.vercel.app>                                                                      |
| Pre-report release workflow      | [run 33950479728](https://github.com/vpavlov-me/Nerio/actions/runs/33950479728)                                    |
| Pre-report branch policy         | [run 33950479721](https://github.com/vpavlov-me/Nerio/actions/runs/33950479721)                                    |
| Pre-report Vercel record         | [deployment 4UcasHnjy5Z5Pybh1NT47TdKfJJq](https://vercel.com/dquality/nerio/4UcasHnjy5Z5Pybh1NT47TdKfJJq)          |
| Terminal release head            | The commit containing this report; its exact SHA and final CI evidence are recorded externally in #150 and PR #584 |

The pre-report evidence workflow completed all 13 jobs successfully, including exact-candidate
ownership, quality, package and tool contracts, three consumer profiles, Chromium, Firefox, WebKit,
visual regression, strict human evidence, and the aggregate Release gate. Vercel reported `READY`
for the same evidence SHA. GitHub verifies the SSH signature on every pull-request commit through
the pre-report evidence commit, all 29 commits carry DCO sign-off, and the pull request is mergeable.
At report authoring, the only unresolved review threads request this final readiness refresh and its
current checksums. The post-report external record in #150 and PR #584 owns the final thread count,
terminal signature, workflow, and deployment because this commit cannot attest to its future state.

An earlier evidence attempt on `347fc14d9306226cf22f7184e98114366c7afcda` exposed a real
time-of-check/time-of-use race in CLI stale Registry lock cleanup. A successful failed-job rerun was
not accepted as sufficient evidence. The race was reproduced and fixed in
`b4c25c85f9dd8422ae0bfd1f186c6cdcbfc10169`, retained unchanged through the final source candidate,
and covered by a deterministic fixture that forces a candidate to disappear after `lstat`. Only
post-`lstat` `ENOENT` is treated as a concurrent cleanup; other filesystem errors still fail.
Repeated local CLI fixtures and the final source-candidate and pre-report tool-contract jobs passed.

Later source review aligned the frozen Foundations decision and CI evidence routing, corrected RTL
Dialog centering with synchronized Registry/API integrity, made the pre-merge audit resilient to
registry transport failures without weakening publication, hardened the route-report output guard,
corrected public Dialog guidance and docs interactions, made a flaky focus assertion await restoration,
and made all six packed package READMEs publication-safe. Every correction was reviewed on an exact
source SHA; the final source workflow passed all 11 technical jobs before the evidence relock.

The candidate-bound pre-report evidence artifacts are:

- [exact candidate identity](https://github.com/vpavlov-me/Nerio/actions/runs/33950479728/artifacts/9964647943),
  archive digest `7b0c2566f6765b9b658a428e7d731f073211ffa4632f27e8b9a3ead3ffc8c6fb` and
  extracted payload SHA-256 `fb8e21b07887e35d86fda2c30f73494200b9952fa3f7697e48ccedc6662b8468`;
- [CycloneDX 1.5 SBOM](https://github.com/vpavlov-me/Nerio/actions/runs/33950479728/artifacts/9964659279),
  archive digest `4f9b72a7404314d6ec2f722d6dd30db27d6850d37a99acdd0fc8e1f48f633c09` and
  extracted JSON SHA-256 `364db411910db91eb26977bd01f8e478788bcd761782968439c4d35594b88475`,
  covering all six public packages among 19 components;
- [documentation route-bundle report](https://github.com/vpavlov-me/Nerio/actions/runs/33950479728/artifacts/9964690293),
  archive digest `d7bf2c896b303883f0a6ba7af82908f81ffa8e6eccc653278e1fcd19f74f940f` and
  extracted JSON SHA-256 `4317a7309f30259826c0f52dd7b045d5f8811869e5095a7b99663326b3b18695`.

Within the source-candidate release workflow
[33950076831](https://github.com/vpavlov-me/Nerio/actions/runs/33950076831), all 11
non-human-evidence, non-aggregate jobs completed successfully. Its strict human-evidence job and
aggregate failed only because the six package README source changes followed the prior evidence
commit. The pre-report evidence commit relocked that record after an explicit scoped carry-forward.
This report relies on the exact technical job results rather than presenting that source workflow as
an overall pass.

After the source candidate, the release line permits changes only to:

- `quality/stable-accessibility-smoke.json`;
- `docs/audits/core-1-0-stable-accessibility-smoke.md`;
- `docs/core-1-0-release-readiness.md`.

The pre-report evidence commit changes the first two paths. The commit containing this report is the
terminal third evidence change. A Git commit cannot embed its own future SHA or workflow result;
therefore #150 and PR #584 record that terminal SHA, signature, deployment, and green workflow after
this file is committed and CI completes. Publication must use that exact terminal release head. Any
other changed path invalidates the candidate lock.

## Scope and contract

The coordinated release identity is:

- Core version and public installation target: `1.0.0`;
- channel: `stable`;
- frozen public API baseline: `core-1.0`;
- Registry version: `1.0.0`;
- immutable Registry source revision: `v1.0.0`;
- Registry schema: `1.1.0`;
- style contract: `tailwind-v1`;
- documentation state: `Prepared stable 1.0 candidate`.

The approved normalized API snapshot SHA-256 is
`3ecaa4f308634ab925cafba35ab6447ad742735878cd09535c81408c3b96595f`. The stable Registry contains
46 foundation and component items; its raw manifest SHA-256 is
`5309074b769563ad9922266e522c88f934c21a5b3cf747aec546482fb5a4d849`, while the canonical Registry
projection recorded by the parity contract is
`8de0514a1f7eccfc62ae2dc16677ddd3fa2d1aa06b46d3de273af9f089d6b42c`. Every distributed source file
has its own SHA-256 integrity entry.

The six coordinated public artifacts, all prepared at `1.0.0`, are:

1. `@nerio-ui/tokens`;
2. `@nerio-ui/adapters`;
3. `@nerio-ui/ui`;
4. `@nerio-ui/registry`;
5. `@nerio-ui/cli`;
6. `@nerio-ui/mcp`.

Core 1.1 components, recipes, Pro, templates, ecosystem work, and unrelated development changes stay
on `dev` and outside this release.

## Package, Registry, and supply-chain evidence

The pre-report evidence workflow measured and passed these package and CSS budgets:

| Artifact                      |  Measured |     Limit |
| ----------------------------- | --------: | --------: |
| `@nerio-ui/tokens` tarball    |  13,411 B |  15,000 B |
| `@nerio-ui/tokens` unpacked   |  86,276 B | 100,000 B |
| `@nerio-ui/adapters` tarball  |   4,392 B |   5,000 B |
| `@nerio-ui/adapters` unpacked |  10,685 B |  30,000 B |
| `@nerio-ui/ui` tarball        |  65,811 B |  67,000 B |
| `@nerio-ui/ui` unpacked       | 328,493 B | 500,000 B |
| `@nerio-ui/registry` tarball  |  30,559 B |  31,000 B |
| `@nerio-ui/registry` unpacked | 179,222 B | 250,000 B |
| `@nerio-ui/cli` tarball       |  19,348 B |  20,000 B |
| `@nerio-ui/cli` unpacked      |  80,919 B |  82,000 B |
| `@nerio-ui/mcp` tarball       |   3,601 B |   4,000 B |
| `@nerio-ui/mcp` unpacked      |   9,836 B |  30,000 B |
| Token CSS, raw                |  79,688 B |  83,000 B |
| Token CSS, gzip               |  10,744 B |  11,500 B |
| UI residual CSS, raw          |   4,039 B |   5,000 B |
| UI residual CSS, gzip         |     818 B |   3,000 B |

Named-import budgets also passed: server Card 3,880/20,000 B, client Button 13,386/50,000 B,
Search icon 2,292/10,000 B, and every adapter entry remained below its assigned 1,000 B or 8,000 B
ceiling.

The source and pre-report workflows both received `No known vulnerabilities found` from the npm
advisory service without invoking their documented transport-failure tolerance. The bare strict
`pnpm audit:prod` remains mandatory immediately before #151 publication approval; a registry error
there blocks publication.

The release workflow passed packed-manifest and contents inspection for all six packages, public
manifest validation without workspace protocols, export and dependency boundaries, Registry
identity and transaction contracts, CLI and MCP schemas and startup, optional-peer isolation,
production audit, pinned Actions, minimum workflow permissions, DCO, and candidate-bound SBOM
validation. Repository automation contains no npm publication credential and performs no package,
dist-tag, Git tag, or GitHub Release mutation.

## Consumer and migration evidence

The release workflow passed isolated consumers for Node 22 minimum, Node 22 current, and Node 24
current profiles. Coverage includes package and editable-source modes, both supported Preflight
setups, the maintained Vite fixture, server/client entrypoints, tokens, styles, components,
adapters, Registry, CLI, and MCP.

A separate disposable consumer previously reproduced a real public `1.0.0-beta.1` to locally packed
`1.0.0` migration against source commit `b4c25c85f9dd8422ae0bfd1f186c6cdcbfc10169`. It used Node
24.18.0, pnpm 11.19.0, React 19.2.8, Next.js 16.2.12, TypeScript 5.9.3, and Tailwind CSS 4.3.3. That
full migration was not rerun after the later Dialog integrity correction and documentation/package
README changes; it remains historical migration evidence rather than an exact-current-candidate run.

All six stable tarballs were packed while repository HEAD was exactly
`b4c25c85f9dd8422ae0bfd1f186c6cdcbfc10169`. The packed CLI `src/index.js` SHA-256,
`b2f7595b9ed36d532bf091d0ffb3cb38734453236336bffa306d86a98a2e63e4`, matched that source commit and
remains the current CLI source hash. The final source and pre-report package jobs separately packed
and inspected the exact `c318f076` package set, including the corrected Dialog source and
publication-safe embedded READMEs. The three isolated consumer jobs also installed and exercised
the exact current package/source content.

In that historical migration, the beta phase installed all six public beta packages; exercised CLI
init/list/info/add/doctor/diff and update dry-run; source-installed 22 requested and 27 resolved
items; passed the published-beta MCP fixture and typecheck; and produced a clean Next.js production
build. The initial `doctor` run failed because the source consumer did not yet declare its required
direct dependencies. After installing `@base-ui/react@1.6.0`, `clsx@2.1.1`, and
`tailwind-merge@3.6.0`, `doctor` passed.

The historical stable phase replaced all six packages in one operation with local `1.0.0`
tarballs, upgraded `@base-ui/react` from 1.6.0 to 1.7.0, and retained no workspace protocol. Before
update, CLI diff
reported the seven expected upstream changes in Item, Label, Select, Textarea, Toast, Tooltip, and
`styles/tokens.css`. Update applied cleanly; the final diff and doctor were clean. The final lock uses
top-level schema `1.0.0` and Nerio version `1.0.0`, with embedded Registry schema `1.1.0`, Registry
version `1.0.0`, source revision `v1.0.0`, and style contract `tailwind-v1`. The full MCP fixture,
typecheck, clean production build, and complete CLI fixture including the multi-contender cleanup
race passed, with no temporary Registry lock or transaction artifact left behind.

Package-qualified stable `pnpm dlx` and public provenance remain #151 checks because `1.0.0` is not
yet published.

## Browser, visual, performance, and human evidence

The browser, visual, performance, and route-budget jobs passed on both the source-candidate and
pre-report evidence SHAs over identical product runtime content:

| Gate                               | Source candidate | Evidence commit |
| ---------------------------------- | ---------------: | --------------: |
| Chromium                           |          111/111 |         111/111 |
| Firefox                            |            17/17 |           17/17 |
| WebKit                             |            17/17 |           17/17 |
| Visual regression                  |            22/22 |           22/22 |
| Documentation route budgets        |              9/9 |             9/9 |
| Performance subset inside Chromium |            10/10 |           10/10 |

The two Linux workflows are independent single-pass browser matrices, not one
`--repeat-each=2` invocation. Together they record 290 successful cross-engine executions over
identical runtime content, including 34 Firefox executions. The relaxed stable gate accepts those two
independent candidate-bound passes as sufficient cross-engine confirmation.

The local `pnpm test:browser:repeat` command did not pass as a complete gate. It produced 254
successful Chromium and WebKit repeat executions, while Firefox was initially unavailable. After
Firefox installation, its processes still could not reach a Nerio page or assertion on macOS 27
because of the upstream Playwright 1.62.1 sandbox failure documented in
[microsoft/playwright#42082](https://github.com/microsoft/playwright/issues/42082). That local run is
diagnostic evidence only and is not counted as a successful release gate.

The bounded human smoke records four passing environment groups and six passing scenario groups
with no findings:

- MacBook Air M4, macOS 27.0, Safari 27.0, and VoiceOver;
- MacBook Air M4, macOS 27.0, Chrome 152.0.7977.65, keyboard-only navigation;
- 200% and 400% zoom/reflow plus macOS Increase Contrast, checked in Safari and Chrome;
- physical iPhone 15 with touch navigation in Safari, plus a physical Safari check on an iPad Air
  5th generation from 2022.

The six scenario groups cover documentation navigation, forms and native controls, overlays and
focus restoration, Calendar and DatePicker, feedback and status behavior, and responsive touch,
zoom, reflow, and contrast.

The manual observations were originally performed on
`da3923f38f91f38b77f890ad28e043ab16f45fe1` and deployment
<https://nerio-mbwxunoxu-dquality.vercel.app> in the default horizontal LTR presentation. They were
not repeated on later candidates, and no human RTL run is claimed. The current chain is recorded by
the [package README carry-forward](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5550022599),
the [release-hardening and docs review](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5549958394),
and the [Dialog RTL/API review](https://github.com/vpavlov-me/Nerio/issues/143#issuecomment-5538121438).

The package Dialog correction changes the horizontal anchor only for RTL; its default-LTR geometry
is equivalent to the human-tested behavior. Candidate-bound unit and Chromium, Firefox, and WebKit
tests cover RTL centering, containment, Escape dismissal, and focus restoration. Later public docs
changes remove the destructive-account ordinary Dialog from Security settings and make existing
Playground actions dismiss their controlled Dialogs. Exact-source Chromium tests assert those two
changed LTR docs paths. This is automated evidence, not a human retest. The final six package README
changes affect only embedded documentation text and no interaction or package implementation.

The evidence chain therefore carries the bounded default-LTR decision to `c318f076` without
pretending that changed RTL or docs branches were manually exercised. The source and pre-report
workflows provide exact-candidate automated coverage for those changes.

Issue [#143](https://github.com/vpavlov-me/Nerio/issues/143) is closed; its bounded smoke decision is
`release-ready`. The broader accessibility and device audit continues after stable in
[#585](https://github.com/vpavlov-me/Nerio/issues/585), and the external-consumer program continues
in [#146](https://github.com/vpavlov-me/Nerio/issues/146).

## Documentation and governance evidence

The candidate synchronizes installation, source-first setup, foundations, components, platform
support, API stability, Registry, CLI, MCP, AI-readable metadata, migration, security, contribution,
support, rollback, catalog, sitemap, search, and release policy. The complete gate validates docs
examples, production build, route budgets, catalog/API/token contracts, package/source/MCP paths,
and agreement between metadata, manifests, Registry, commands, and `llms.txt`. The six embedded
package READMEs now describe their `1.0.0` responsibility without freezing a temporary npm dist-tag
or pending-publication statement into immutable tarballs.

The stable public-foundation children #486, #487, #488, #489, and #492 are closed; #484 is merged.
#490, #491, and #357 remain independent post-1.0 work. The mixed parent #485 is closed as the
completed stable tranche without closing those forward issues. No known product/runtime P0/P1 or
accepted stable-blocking product P2 remains. The two report-only review findings are addressed by
this refresh and are resolved only after its terminal external verification.

The prepared dated `1.0.0` changelog entry is candidate release content, not proof of publication.
The authoritative public checks remain npm versions and dist-tags, the signed Git tag, and the
GitHub Release, all of which are still absent.

## Known non-blocking limitations

- Packages are source-first TypeScript; consumers must follow the documented transpilation,
  Tailwind CSS v4 `@source`, token, style, and server/client setup.
- Maintained compatibility is bounded to Node 22/24, React 19, Next.js 16.2 within 16.x,
  TypeScript 5.9, Tailwind CSS 4.1 within 4.x, the maintained Vite fixture, and the documented
  Chromium, Firefox, and WebKit floors.
- The disposable beta.1 migration covers one Node 24 synthetic consumer at source commit
  `b4c25c85f9dd8422ae0bfd1f186c6cdcbfc10169`.
  It was not repeated after the later Dialog integrity and package-documentation corrections and
  does not cover every consumer configuration, a locally conflicting source tree, or public stable
  resolution. Exact current-candidate package/source consumers passed separately.
- The local Firefox repeat is blocked by an upstream macOS 27 runner incompatibility. Two green
  single-pass Linux candidate workflows provide the accepted independent Firefox coverage.
- The broader device and assistive-technology matrix in #585 and the independent external-consumer
  cycle in #146 are post-release programs.
- Stable npm resolution, provenance, package-qualified `pnpm dlx`, dist-tags, signed release tag,
  GitHub Release, and public stable documentation remain verification work for #151.
- Post-release findings will ship through a focused patch or 1.1 work; published `1.0.0` artifacts
  will not be mutated.

## Publication plan

As checked on 2026-09-05, all six npm packages resolve `latest` and `beta` to `1.0.0-beta.1` and
`alpha` to `0.1.0-alpha.2`. No public `1.0.0`, `stable` dist-tag, `v1.0.0` tag, or stable GitHub
Release exists.

After separate maintainer approval in #151:

1. Confirm the exact terminal release head, its signature, clean checkout, and npm ownership without
   printing credentials.
2. Publish under the non-default `stable` tag in dependency order: tokens, adapters, UI, Registry,
   CLI, then MCP. Verify version, contents, ownership, provenance, dependencies, and Registry
   identity after every package; stop on the first mismatch.
3. Run the exact-version public consumer, CLI, MCP, source, and migration smoke while `latest`
   remains unchanged.
4. Move only `latest` after all six coordinated artifacts pass. Confirm `stable` and `latest` both
   resolve `1.0.0`, and preserve `alpha` and `beta`.
5. Create the signed `v1.0.0` tag and non-prerelease GitHub Release only after the public package
   graph is coherent.

### GitHub Release draft

- Title: `Nerio Core 1.0.0`
- Tag: `v1.0.0`
- Prerelease: no

```markdown
# Nerio Core 1.0.0

Nerio Core 1.0.0 is the first stable release of Nerio's frozen, source-first Core contract.

## Highlights

- Six coordinated public packages: tokens, adapters, UI, Registry, CLI, and MCP.
- A 46-item immutable source Registry with per-file SHA-256 integrity.
- Tailwind CSS v4 source and package workflows with documented server/client boundaries.
- Stable component, token, Registry, CLI, MCP, accessibility, and platform contracts.
- Tested Next.js minimum/current consumers, the maintained Vite fixture, Chromium, Firefox,
  WebKit, visual baselines, route budgets, and package budgets.

## Install

    pnpm add @nerio-ui/tokens@1.0.0 @nerio-ui/adapters@1.0.0 @nerio-ui/ui@1.0.0 tailwindcss
    pnpm add -D @tailwindcss/postcss postcss
    pnpm dlx @nerio-ui/cli@1.0.0 init

Upgrade every Nerio package already used by a consumer together. For beta.1 migrations, run
`nerio doctor`, inspect `nerio diff`, and use `nerio update --dry-run` before applying source
updates.

The wider assistive-technology/device audit and external-consumer cohort continue after release and
may produce focused patch or 1.1 follow-ups.
```

## Verification and rollback

Before publication, #151 must verify the exact terminal SHA and run:

```bash
pnpm install --frozen-lockfile
pnpm audit:prod
NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release
pnpm pack:check
```

After all six packages exist under `stable`, but before moving `latest`:

```bash
NERIO_RELEASE_EXPECT_PUBLIC=1 NERIO_RELEASE_EXPECT_PUBLISHED=1 pnpm test:release-consumer
```

Public verification must confirm every package version, dist-tag, provenance record, public tarball,
dependency edge, Registry identity, CLI and MCP bin, stable docs route, signed tag, and GitHub Release
target. It must also rerun clean Next.js and Vite consumers plus the documented source and migration
lifecycle from real public artifacts.

If publication becomes partial or incorrect:

1. Stop immediately and record the exact public state.
2. Do not reuse the affected version, mutate the Registry revision, or make a partial package graph
   the default installation target.
3. Keep or restore `latest` to the previous safe coordinated version when possible; preserve
   protected `alpha` and `beta`.
4. Prepare the next coordinated patch, stage and verify all six packages under `stable`, and move
   `latest` only after the replacement graph passes.
5. Deprecate a faulty version when appropriate; do not unpublish except for a critical security,
   legal, or explicit maintainer decision.
