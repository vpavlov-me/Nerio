# Release Process

Nerio Core is not published yet. The exact intended first public version is `0.1.0-alpha.0`. Every
release action is manual and requires an explicit maintainer approval after the gate and tarball
inspection pass.

## Required checks

Run the complete gate from a clean checkout with Node 22 and the pinned pnpm version:

```bash
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:branch-policy
pnpm build
pnpm test:ui
pnpm test:a11y
pnpm test:catalog
pnpm test:tokens
pnpm test:cli
pnpm test:mcp
pnpm test:adapters
pnpm test:browser
pnpm test:docs-examples
pnpm validate:tokens
pnpm validate:runtime-axes
pnpm validate:typography
pnpm validate:catalog
pnpm validate:docs
pnpm validate:release
pnpm pack:check
```

Install the pinned Chromium runtime once before the browser gate with
`pnpm exec playwright install --with-deps chromium`. `pnpm test:browser` starts the demo and public
docs applications locally and runs focused release smoke; it is not a screenshot or full
visual-regression suite. `pnpm test:docs-examples` typechecks published Sidebar examples in an
isolated fixture.

`validate:release` packs all intended packages, checks packed manifests, exports, dependencies, side
effects, bins, file boundaries, and secret/Pro exclusions, installs the tarballs into an isolated
Next.js consumer, exercises packed CLI and MCP discovery, source-installs representative components
and a Foundation item with complete dependency chains, and builds without workspace aliases.
`test:adapters` separately proves the packed `icons`, `table`, `charts`, `forms`, and
`schema` exports, verifies that an icons/UI-only consumer does not install optional integration
peers, and checks each optional subpath both without and with its required peer. CI validates only;
it never publishes, changes package privacy, creates tags, or creates a GitHub Release.

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

Both pull request stages require the full CI and `branch-policy` checks. Direct pushes, force pushes,
and branch deletion are prohibited for `main` and `dev`. `main` remains the default stable branch,
and `dev` remains the permanent integration branch after a release. Release pull requests and merges
to `main` are manual maintainer actions; coding agents must not merge them without a separate, direct
request from the maintainer. Dependabot's reserved `dependabot/*` branches are the only automated
development-branch exception and target `dev`.

## Versioning and package order

Keep the root workspace, apps, and `@nerio-ui/config` private. The intended public packages use the
coordinated `0.1.0-alpha.0` version and are published in dependency order:

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
Form, and Zod as optional peers. The unsupported package root must not statically aggregate adapter
implementations.

## Manual approval and publish sequence

Do not perform any step in this section without an explicit maintainer approval recorded after CI,
browser verification, changelog review, and tarball inspection.

1. Record the release-readiness decision and any accepted non-blocking limitations.
2. Convert `Unreleased` in [CHANGELOG.md](./CHANGELOG.md) to
   `## 0.1.0-alpha.0 — YYYY-MM-DD`, then add a new empty `Unreleased` section above it.
3. Change only the six intended package manifests from `private: true` to `private: false` in a
   dedicated release PR. Rerun the complete gate, replacing the ordinary release validation command
   with `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release`, then obtain a second approval. The
   override requires every intended package to be public; it does not weaken the coordinated
   version, metadata, contents, runtime, source-install, or consumer-build checks.
4. Publish one package at a time in the documented dependency order with the `alpha` dist-tag, for
   example `pnpm --filter @nerio-ui/tokens publish --access public --tag alpha --no-git-checks`.
5. Verify each package before continuing to the next one. Stop immediately on a version, contents,
   provenance, ownership, or install mismatch.
6. Create a signed Git tag and GitHub Release only after all six packages and consumer checks pass.

## Post-release verification

- Confirm `npm view <package>@0.1.0-alpha.0 version dist-tags files` for every package.
- Install the six published packages into a new supported Next.js project and rerun the package and
  source-install smoke paths.
- Run `nerio init`, `list`, `info`, `add`, and `doctor` from the published CLI.
- Start the published MCP server and verify all discovery tools against current registry metadata.
- Verify public docs links, `llms.txt`, canonical metadata, sitemap, robots behavior, and the live
  demo with no console or hydration errors.

## Rollback guidance

If a package is wrong before later packages are published, stop the sequence and leave the release
incomplete. Do not reuse the version. Prefer publishing a corrected `0.1.0-alpha.1` and moving the
`alpha` dist-tag only after verification. If the registry permits and policy requires it, deprecate
the faulty version with a concise install warning. Restore the previous dist-tag when one exists,
document affected packages and consumers, and avoid npm unpublish except for a security incident or
an explicit maintainer/legal decision.

## Public changelog page

The documentation application should add a public Changelog page only when the first public pre-release is ready, at least one supported public installation method exists, package or registry versions are externally meaningful, external users need migration information, and the release policy is stable enough to maintain versioned entries.

Until then, [CHANGELOG.md](./CHANGELOG.md) is the canonical release ledger. It must not appear in primary documentation navigation, and merged development work remains under `Unreleased`.
