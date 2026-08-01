# Release Process

Nerio Core `1.0.0-beta.0` is the maintainer-approved release candidate for the frozen Core 1.0 API.
The reviewed frozen baseline is `3689a58d48878bfdbfa8ad6a27383c08ecf97ea3`; the exact publish
candidate is the later reviewed `main` commit that contains this coordinated version preparation.
The beta is not published yet. The current public prerelease remains `0.1.0-alpha.2` under npm
`alpha`, and `latest` intentionally remains on `0.1.0-alpha.0`.

Every release action remains manual and requires explicit maintainer approval after the gate and
tarball inspection pass. This document does not authorize publishing, changing dist-tags,
creating a tag, or creating a GitHub Release.

## Release-candidate checks

The `release-gate` workflow runs the complete gate for the separately reviewed `dev -> main`
release-candidate pull request. To reproduce it, use a clean checkout with Node 22 and the pinned
pnpm version. First run the same always-on development commands and focused Chromium smoke:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:ci-scopes
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
pnpm build
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
pnpm test:manual-audit-plan
pnpm validate:manual-audit-plan
pnpm validate:platform-support
pnpm audit:prod
pnpm validate:package-budgets
pnpm validate:release:metadata
pnpm test:release-consumer
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
repeating catalog, API, token, or onboarding unit tests. `pnpm test:release-consumer` packs all intended
packages, checks packed manifests, exports, dependencies, side effects, bins, file boundaries, and
secret/Pro exclusions, installs the tarballs into an isolated Next.js consumer, runs the canonical
local CLI workflow through `pnpm exec nerio` from the packed CLI tarball, resolves the immutable
packaged Registry without a checkout or moving branch URL, exercises installed-source metadata,
`diff`, and update planning, starts the packaged MCP bin through `pnpm exec nerio-mcp`, verifies its
read-only discovery and coordinated version metadata, source-installs representative components
and a Foundation item with complete dependency chains, and builds without workspace aliases.
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

`test:manual-audit-plan` and `validate:manual-audit-plan` protect the required environments,
scenario coverage, routes, evidence fields, and pending-state language for the manual Core 1.0
accessibility and real-device audit. Passing these checks means the audit is prepared; it never
means VoiceOver, NVDA, TalkBack, native picker, physical-device, zoom, contrast, or lived
interaction evidence exists.

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

Normal changes start from `dev` and merge through a reviewed pull request back into `dev`. The only
supported path to the stable `main` branch is a separately reviewed release pull request from `dev`:

```text
feat/*, fix/*, refactor/*, docs/*, test/*, chore/* -> dev -> main
```

Development pull requests into `dev` require the fast aggregate `PR gate` and the independent
`branch-policy` check. The always-on job covers formatting, lint, type checking, focused
unit/contract validators, documentation examples, and the workspace build. A base-to-head scope
detector adds the seven-scenario Chromium smoke and matching visual, CLI, MCP, adapter, public
package, manual-audit, or branch-policy jobs only when their surfaces change. Development never
installs Firefox or WebKit and never runs packed release-consumer smoke.

The separately reviewed `dev -> main` pull request requires the full `release-gate`. Its final
`Release gate` check aggregates every command above, including separate Chromium, Firefox, and
WebKit jobs, package consumers, visual regression, release smoke, and pack inspection. Direct
pushes, force pushes, and branch deletion are
prohibited for `main` and `dev`. `main` remains the default stable branch, and `dev` remains the
permanent integration branch after a release. Release pull requests and merges to `main` are manual
maintainer actions; coding agents must not merge them without a separate, direct request from the
maintainer. Dependabot's reserved `dependabot/*` branches are the only automated development-branch
exception and target `dev`.

## Versioning and package order

Keep the root workspace, apps, and `@nerio-ui/config` private. The six public package manifests are
coordinated at the current published prerelease. A future release PR must bump all six packages,
their internal dependency references, Registry metadata, and release-smoke expectation to the same
approved version. Publish in dependency order:

1. `@nerio-ui/tokens`
2. `@nerio-ui/adapters`
3. `@nerio-ui/registry`
4. `@nerio-ui/ui`
5. `@nerio-ui/cli`
6. `@nerio-ui/mcp`

The six public package manifests use `private: false` only after the dedicated release PR and
explicit maintainer approval. Package consumers receive TypeScript source; supported Next.js
consumers configure `transpilePackages` as documented in Getting started.

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

## Manual approval and publish sequence

Do not perform any step in this section without an explicit maintainer approval recorded after CI,
browser verification, changelog review, and tarball inspection.

1. Record the release-readiness decision and any accepted non-blocking limitations.
2. Convert `Unreleased` in [CHANGELOG.md](./CHANGELOG.md) to
   `## <approved-version> — YYYY-MM-DD`, then add a new empty `Unreleased` section above it.
3. In a dedicated release PR, bump only the six public package manifests and their coordinated
   internal dependency references to the approved version. Keep them public. Update the Registry
   top-level `version` and immutable `sourceRevision` to the same release tag, update the release
   smoke expectation, rerun the complete gate with
   `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release`, then obtain a second approval. The override
   does not weaken version, metadata, contents, runtime, source-install, or consumer-build checks.
4. Publish one package at a time in the documented dependency order with the `beta` dist-tag, for
   example `pnpm --filter @nerio-ui/tokens publish --access public --tag beta --no-git-checks`.
   Do not move `latest` or `alpha`.
5. Verify each package before continuing to the next one. Stop immediately on a version, contents,
   provenance, ownership, or install mismatch.
6. Create a signed Git tag and GitHub Release only after all six packages and consumer checks pass.

## Post-release verification

- Confirm `npm view <package>@<approved-version> version dist-tags files` for every package.
- Run the published-package smoke after all six packages exist:

  ```bash
  NERIO_RELEASE_EXPECT_PUBLIC=1 NERIO_RELEASE_EXPECT_PUBLISHED=1 pnpm test:release-consumer
  ```

  This makes the documented package-qualified `pnpm dlx` path resolve the published coordinated
  dependency graph. The candidate gate intentionally omits this network-only assertion because an
  unpublished exact prerelease dependency cannot resolve from npm.

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
incomplete. Do not reuse the version. Prefer publishing a corrected `1.0.0-beta.1` and moving the
`beta` dist-tag only after verification. If the registry permits and policy requires it, deprecate
the faulty version with a concise install warning. Restore the previous dist-tag when one exists,
document affected packages and consumers, and avoid npm unpublish except for a security incident or
an explicit maintainer/legal decision.

## Public changelog page

The documentation application should add a public Changelog page only when the first public pre-release is ready, at least one supported public installation method exists, package or registry versions are externally meaningful, external users need migration information, and the release policy is stable enough to maintain versioned entries.

Until then, [CHANGELOG.md](./CHANGELOG.md) is the canonical release ledger. It must not appear in primary documentation navigation, and merged development work remains under `Unreleased`.
