# Release Process

Nerio Core `1.0.0` is the prepared stable candidate for the frozen Core 1.0 API. It is not published,
does not move any npm dist-tag, and does not create `v1.0.0` or a stable GitHub Release. The reviewed
frozen baseline is `3689a58d48878bfdbfa8ad6a27383c08ecf97ea3`.

The current public release remains `1.0.0-beta.1` from exact published `main` commit
`a4089d5b402ea882e44aa6b7b6eb49fd1435cbc9`. All six packages remain available under npm `beta` and
`latest`; the protected `alpha` tag intentionally remains on `0.1.0-alpha.2`.

The signed `v1.0.0-beta.1` tag and GitHub prerelease point to the exact publish candidate. Public
metadata and a clean package/source, CLI, MCP, and Next.js consumer smoke passed after publication.

The candidate-bound readiness record is maintained in
[`docs/core-1-0-release-readiness.md`](./docs/core-1-0-release-readiness.md). It must record the
bounded maintainer-run accessibility smoke, exact-candidate release gate, tarball inspection,
known limitations, and exactly one explicit readiness decision. Every public release action remains
manual and requires separate explicit maintainer approval. Neither that decision nor this document
authorizes publication, a dist-tag change, a tag, or a GitHub Release.

## Release-candidate checks

The `release-gate` workflow runs the complete gate for a separately reviewed approved release-line
pull request into `main`. Stable `1.0.0` uses `release/1.0`; later release trains may use `dev` only
when that branch is the explicitly approved release line. To reproduce it, use a clean checkout
with Node 22 and the pinned pnpm version.

When creating the candidate from the beta metadata, inspect the coordinated version diff before
applying it:

```bash
pnpm prepare:release-version 1.0.0
pnpm prepare:release-version 1.0.0 --write
```

Once the worktree already identifies itself as `1.0.0`, do not rerun that one-time preparation
command: it intentionally rejects a no-op version. Run the always-on development commands and
focused Chromium smoke instead:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:ci-scopes
pnpm test:repo-artifacts
pnpm validate:repo-artifacts
pnpm test:ui
pnpm test:a11y
pnpm test:catalog
pnpm test:api
pnpm test:tokens
pnpm test:onboarding
pnpm validate:tokens
pnpm validate:runtime-axes
pnpm validate:typography
pnpm validate:catalog
pnpm validate:api
pnpm validate:docs
pnpm validate:onboarding
pnpm test:docs-examples
pnpm test:consumer:vite
pnpm build
pnpm validate:route-budgets
pnpm test:browser:pr
```

Then run every release-only contract:

```bash
pnpm test:branch-policy
pnpm test:browser:chromium
pnpm test:browser:firefox
pnpm test:browser:webkit
pnpm test:visual
pnpm test:cli
pnpm test:mcp
pnpm test:adapters
pnpm test:stable-accessibility-smoke
pnpm validate:stable-accessibility-smoke
pnpm test:manual-audit-plan
pnpm validate:manual-audit-plan
pnpm test:beta-feedback
pnpm validate:stable-readiness
pnpm test:sbom
pnpm validate:platform-support
pnpm test:release-metadata
pnpm validate:release-metadata
pnpm test:consumer:minimum
pnpm test:consumer:current
pnpm test:consumer:vite
pnpm test:consumer-matrix
pnpm validate:route-budgets
pnpm audit:prod
pnpm validate:package-budgets
pnpm validate:release:metadata
pnpm pack:check
```

Install the pinned browser runtimes once before the browser gate with
`pnpm exec playwright install --with-deps chromium firefox webkit`. The release workflow runs the
three engine scripts in parallel with independent failure artifacts and `fail-fast: false`.
`pnpm test:browser` remains the convenient complete local compatibility command; run it after the
engine-specific commands when reproducing the complete gate. Run `pnpm test:browser:repeat` for two
clean iterations before merging browser-sensitive changes. `pnpm test:visual` separately compares
the deterministic Core fixtures against maintainer-approved image baselines; review and update them
through [`docs/visual-regression.md`](./docs/visual-regression.md). `pnpm test:docs-examples`
typechecks published Sidebar examples in an isolated fixture.

`pnpm test:api` protects the Core 1.0 public contract and the reviewed SemVer approval workflow.
`pnpm validate:api` compares package exports, TypeScript signatures, tokens, Registry data,
CLI/MCP contracts, package support ranges, and public docs routes with the checked-in snapshot.
`pnpm validate:release:metadata` checks release documentation and public onboarding without
repeating catalog, API, token, or onboarding unit tests. `pnpm test:consumer:minimum` and
`pnpm test:consumer:current` pack all intended packages, check packed manifests, exports,
dependencies, side effects, bins, file boundaries, and secret/Pro exclusions, install the tarballs
into isolated Next.js consumers, run the canonical local CLI workflow through `pnpm exec nerio` from
the packed CLI tarball, resolve the immutable packaged Registry without a checkout or moving branch
URL, exercise installed-source metadata, `diff`, and update planning, start the packaged MCP bin
through `pnpm exec nerio-mcp`, verify its read-only discovery and coordinated version metadata,
source-install representative components and a Foundation item with complete dependency chains,
and build without workspace aliases. `pnpm test:release-consumer` remains a compatibility alias for
the current profile; the complete local wrapper and release workflow require the minimum/current
matrix.
Package-qualified one-off execution through `pnpm dlx` is intentionally a post-publication check:
run the same smoke with `NERIO_RELEASE_EXPECT_PUBLISHED=1` only after all six exact package versions
exist on npm.

`pnpm validate:release` remains the complete local wrapper:

```bash
pnpm validate:release
NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release
pnpm test:browser
```

The GitHub release workflow calls the focused unit, metadata, and consumer commands directly, so it
does not rerun those tests through the wrapper or invoke `release-smoke.mjs` twice.
`test:adapters` separately proves the packed `icons`, `table`, `charts`, `forms`, `schema`, and
client-only `motion` exports, verifies that an icons/UI-only consumer does not install optional
integration peers, and checks each optional subpath both without and with its required peer. The
Motion gate additionally snapshot-protects the stable API, checks SSR/hydration and live preference
changes, and measures Core, token-only, `domAnimation`, and `domMax` bundles. CI validates only; it
never publishes, changes package privacy, creates tags, or creates a GitHub Release.

`test:stable-accessibility-smoke` and `validate:stable-accessibility-smoke` protect the bounded
maintainer-run human gate for stable 1.0. The strict stable channel requires the exact candidate,
deployment, all smoke environments and scenarios, evidence links, no unresolved accepted blocker,
and a `release-ready` decision. `test:manual-audit-plan` and `validate:manual-audit-plan` keep the
broader post-release accessibility and real-device plan truthful. Passing those plan checks never
claims VoiceOver, NVDA, TalkBack, native picker, physical-device, zoom, contrast, or lived
interaction evidence that has not been collected.

`validate:platform-support` keeps package engines, peer ranges, app baselines, Playwright projects,
CI, and the documented policy aligned. `audit:prod` blocks known production dependency
vulnerabilities before a release candidate can pass. `validate:package-budgets` enforces
packed/unpacked package, CSS, named component/icon import, and optional adapter budgets. Threshold
changes follow the reviewed override policy in `docs/quality-gates.md`.

Package and source-install builds cover Tailwind with and without Preflight. The UI stylesheet may
contain only named shared keyframes and the documented scoped no-Preflight box-sizing and
native-control typography rules; the Tailwind contract test rejects visual component selectors or a
second styling layer.

## Branch and release flow

Normal changes start from `dev` and merge through a reviewed pull request back into `dev`. Stable
1.0 fixes are selected into the isolated `release/1.0` branch from `main`. The supported paths are:

```text
feat/*, fix/*, refactor/*, docs/*, test/*, chore/* -> dev
main + selected stable-safe fixes -> release/1.0 -> main
main -> dev -> approved later release pull request -> main
```

Development pull requests into `dev` require the fast aggregate `PR gate` and the independent
`branch-policy` check. The always-on job covers formatting, lint, type checking, focused
unit/contract validators, documentation examples, and the workspace build. A base-to-head scope
detector adds the seven-scenario Chromium smoke and matching visual, CLI, MCP, adapter, public
package, manual-audit, or branch-policy jobs only when their surfaces change. Development never
installs Firefox or WebKit and never runs packed release-consumer smoke.

The separately reviewed approved release-line pull request into `main` requires the full
`release-gate`. Its final
`Release gate` check aggregates every command above, including separate Chromium, Firefox, and
WebKit jobs, package consumers, visual regression, release smoke, and pack inspection. Direct
pushes, force pushes, and branch deletion are
prohibited for `main` and `dev`. `main` remains the default stable branch, and `dev` remains the
permanent integration branch after a release. After stable publication, synchronize the stable-only
fixes back into `dev` through a reviewed development pull request before preparing the 1.1
prerelease. Record the pre-sync `dev` SHA and preserve every forward 1.1 surface from #342–#370:
the stable release intentionally removes those surfaces from `main`, so a blind merge or cherry-pick
must not delete them from `dev`. Apply the stable release delta without committing, restore the
forward scope from the recorded `dev` SHA, and review the resulting diff before committing the
sync. Release pull requests and merges to `main` are manual maintainer actions; coding agents must
not merge them without a separate, direct request from the maintainer. Dependabot's reserved
`dependabot/*` branches are the only automated development-branch exception and target `dev`.

## Versioning and package order

Keep the root workspace, apps, and `@nerio-ui/config` private. The six already-public package
manifests are coordinated at the prepared stable candidate. A release PR must keep all six packages,
their internal dependency references, Registry metadata, and release-smoke expectation on the same
approved version. Publish in dependency order:

1. `@nerio-ui/tokens`
2. `@nerio-ui/adapters`
3. `@nerio-ui/ui`
4. `@nerio-ui/registry`
5. `@nerio-ui/cli`
6. `@nerio-ui/mcp`

The six public package manifests remain `private: false`; changing package visibility is not part of
the stable release. Package consumers receive TypeScript source; supported Next.js consumers
configure `transpilePackages` as documented in Getting started.

## Credentials and dry run

The approving maintainer needs npm publish access to the `@nerio-ui` scope, an authenticated npm CLI,
and the account's required 2FA or automation-token policy. Confirm the target identity without
printing credentials:

```bash
npm whoami
npm access list packages @nerio-ui
```

Run `pnpm pack:check`, then create local tarballs with `pnpm --filter <package> pack` when a manual
archive inspection is needed. For every package, inspect `package.json`, `LICENSE`, exported source,
styles, bins, dependency versions, and the absence of apps, fixtures, secrets, private assets, Pro
code, and workspace protocols.

For `@nerio-ui/adapters`, also confirm that the packed manifest exposes only the documented subpaths,
keeps Lucide as the icon implementation dependency, and marks TanStack Table, Recharts, React Hook
Form, Zod, and Motion as optional peers. The unsupported package root must not statically aggregate
adapter implementations.

## Candidate lock, approval, and publish sequence

Steps 1–3 finalize and review the candidate; they do not authorize publication. Do not perform
step 4 or any later public action without explicit maintainer approval recorded after CI, browser
verification, changelog review, tarball inspection, and the bounded accessibility smoke.

1. Before locking the exact candidate SHA, convert `Unreleased` in
   [CHANGELOG.md](./CHANGELOG.md) to
   `## <approved-version> — YYYY-MM-DD`, then add a new empty `Unreleased` section above it.
2. Confirm the already-prepared six package manifests, their coordinated internal dependencies,
   Registry `version` and immutable `sourceRevision`, release metadata, migration guide, and smoke
   expectation all use the approved version. If the version changes, prepare a new candidate in the
   release PR and lock a new SHA and deployment before collecting human evidence.
3. Run the complete exact-candidate gate with
   `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release`, complete the bounded smoke, and record its
   evidence only in the permitted evidence files. Rerun the gate on that evidence-only commit,
   record the release-readiness decision and accepted non-blocking limitations, and obtain explicit
   publication approval. The override does not weaken version, metadata, contents, runtime,
   source-install, or consumer-build checks.
4. Publish one package at a time in the documented dependency order with the non-default `stable`
   staging dist-tag, for example
   `pnpm --filter @nerio-ui/tokens publish --access public --tag stable --no-git-checks`. During this
   per-package publication phase, do not move protected `alpha` or `beta`, and do not move `latest`.
   Never make a partially published coordinated version the default install target.
5. Verify each package before continuing to the next one. Stop immediately on a version, contents,
   provenance, ownership, or install mismatch.
6. After all six packages exist, run the published exact-version smoke before changing `latest`:

   ```bash
   NERIO_RELEASE_EXPECT_PUBLIC=1 NERIO_RELEASE_EXPECT_PUBLISHED=1 pnpm test:release-consumer
   ```

   This makes the documented package-qualified CLI and MCP `pnpm dlx` paths resolve the published
   coordinated dependency graph and verifies both bins against the exact approved version. The
   candidate gate intentionally omits this network-only assertion because an unpublished exact
   release version cannot resolve from npm.

7. Move only `latest` for all six packages to the approved version after the published-package
   smoke passes. Verify `stable` and `latest` for every package, and confirm that protected `alpha`
   and `beta` remain unchanged.
8. Create a signed Git tag and GitHub Release only after all six packages and consumer checks pass.

## Post-release verification

- Confirm `npm view <package>@<approved-version> version dist-tags files` for every package, verify
  both `stable` and `latest` resolve to the approved version, and confirm that protected `alpha` and
  `beta` remain unchanged.

- Install the six published packages into a new supported Next.js project and rerun the package and
  source-install smoke paths.
- Run `pnpm exec nerio init`, `list`, `info`, `add`, `diff`, `update --dry-run`, and `doctor` from a
  local `@nerio-ui/cli` and `@nerio-ui/registry` install without supplying a Registry override;
  confirm `nerio.json` points to the packaged Registry and `nerio.lock.json` contains no absolute
  paths or source content.
- Start the published MCP server with `pnpm exec nerio-mcp` and verify all discovery tools,
  including exact package/Registry version, revision, schema, and style contract metadata.
- Verify public docs links, `llms.txt`, canonical metadata, sitemap, robots behavior, and the live
  demo with no console or hydration errors.
- Open the structured external evaluation window in
  [`docs/beta-feedback-cycle.md`](./docs/beta-feedback-cycle.md). Keep it open for at least 14
  calendar days and until three independent consumers have completed meaningful evaluations.

## Rollback guidance

If a package is wrong before later packages are published, stop the sequence and leave the release
incomplete. Do not reuse the version. Prepare and publish the next coordinated patch version, verify
all six replacement packages through the `stable` staging tag, and only then move `latest`. Keep
protected `alpha` and `beta` unchanged. If a verified replacement is not ready, keep or explicitly
restore `latest` to the previous safe coordinated version and correct any partial `stable` staging
state. If the registry permits and policy requires it, deprecate the faulty version with a concise
install warning. Document affected packages and consumers, and avoid npm unpublish except for a
security incident or an explicit maintainer/legal decision.

## Public changelog page

The public Changelog page is part of the documentation Overview navigation now that Nerio has public pre-releases, supported installation methods, externally meaningful package and Registry versions, and versioned migration guidance.

[CHANGELOG.md](./CHANGELOG.md) remains the canonical technical release ledger. Keep the public page focused on notable releases and project announcements, and keep merged development work under `Unreleased` until it ships in a coordinated release.
