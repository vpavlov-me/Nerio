# Core 1.0 release readiness

This candidate-bound record is finalized only after the stable source candidate is locked. It
prepares the evidence and manual publication plan for issue
[#150](https://github.com/vpavlov-me/Nerio/issues/150); it never publishes packages, moves npm
dist-tags, merges the release pull request, creates `v1.0.0`, or creates a GitHub Release.

## Decision

**Pending exact candidate evidence.**

Replace this decision only after the exact source candidate, reviewed deployment, bounded human
smoke, complete release gate, and evidence-only head are recorded and independently verified.

## Candidate identity

- Candidate source commit: pending final lock.
- Evidence-only head: pending final evidence commit.
- Approved base: `origin/main` at release-line creation.
- Release line: `release/1.0`.
- Release pull request: [#584](https://github.com/vpavlov-me/Nerio/pull/584).
- Reviewed deployment: pending final lock.

The release commit may add only the three allowlisted evidence artifacts after the source candidate.
Any other changed path invalidates the lock and requires a new candidate plus an explicit evidence
refresh or documented non-runtime carry-forward.

## Scope and contract

- Version: coordinated Nerio Core `1.0.0`.
- Frozen public API baseline: `core-1.0`, protected by the approved snapshot and hash.
- Stable Registry inventory: 46 source-first foundation and component items.
- Post-1.0 components, recipes, Pro, templates, ecosystem, and adoption work on `dev` remain outside
  this release.
- The exhaustive device/assistive-technology audit and external-consumer cohort continue after
  stable publication in #585 and #146.

## Package, Registry, and supply-chain evidence

The coordinated public artifacts are `@nerio-ui/tokens`, `@nerio-ui/adapters`, `@nerio-ui/ui`,
`@nerio-ui/registry`, `@nerio-ui/cli`, and `@nerio-ui/mcp`, all prepared at `1.0.0`. The Registry is
version `1.0.0`, immutable source revision `v1.0.0`, schema `1.1.0`, and style contract
`tailwind-v1`; every source file carries SHA-256 integrity metadata.

The final report records the exact candidate-bound SBOM, production audit, package-budget, packed
manifest, public-manifest, DCO, signature, pinned-Action, and branch-policy results. Publication
remains credential-free and absent from repository CI.

## Consumer and migration evidence

The final report records minimum and current Node 22 consumers, the current Node 24 consumer, the
maintained Vite fixture, package and source installation, CLI lifecycle, MCP structured output, and
the `1.0.0-beta.1` to `1.0.0` migration. Package-qualified `pnpm dlx` checks remain post-publication
because the stable packages do not yet exist on npm.

## Browser, visual, performance, and human evidence

The final report records Chromium, Firefox, WebKit, visual regression, route budgets, package
budgets, and the bounded maintainer smoke. Automated checks do not substitute for the human smoke.
The larger real-device and external-consumer programs remain truthful post-release follow-ups.

## Documentation and governance evidence

The final report records stable installation, component, foundation, platform, migration, support,
security, contribution, release, rollback, Registry, CLI, MCP, API, and AI-readable documentation.
It also confirms that the docs, catalog, packages, Registry, commands, release metadata, and
`llms.txt` agree.

## Known non-blocking limitations

- Packages are source-first TypeScript; consumers must follow the documented transpilation,
  Tailwind CSS v4 `@source`, token, style, and server/client entrypoint setup.
- Maintained compatibility claims remain bounded to Node 22/24, React 19, TypeScript 5.9, Tailwind
  CSS 4.1 within 4.x, the tested Next.js profiles, the maintained Vite fixture, and the documented
  Chromium, Firefox, and WebKit floors.
- The broader accessibility/device matrix and independent external-consumer cycle remain
  post-release evidence. Findings will ship through focused patches or 1.1 work instead of mutating
  the immutable `1.0.0` artifacts.

## Publication plan

After separate maintainer approval, stage packages under the non-default `stable` tag in dependency
order: tokens, adapters, UI, Registry, CLI, then MCP. Verify every package and the coordinated public
consumer before moving only `latest`. Preserve protected `alpha` and `beta` tags. Create the signed
`v1.0.0` tag and non-prerelease GitHub Release only after the six public artifacts are coherent.

## Verification and rollback

Issue [#151](https://github.com/vpavlov-me/Nerio/issues/151) owns credentialed publication and public
verification. It must confirm npm metadata, provenance, dist-tags, immutable Registry identity,
signed Git/GitHub release identity, stable docs, clean Next.js and Vite consumers, source lifecycle,
CLI, MCP, migrations, and public commands from real artifacts. On partial or incorrect publication,
stop, preserve the public state, restore safe tags when necessary, and publish a coordinated patch;
never mutate the Registry, rewrite the stable tag, or reuse a bad version.
