# Tailwind CSS v4 migration and prerelease report

## Decision

The Tailwind CSS v4-first migration is complete and ready for a separately approved manual
prerelease. Recommend `0.1.0-alpha.1` for the coordinated public packages. The existing
`0.1.0-alpha.0` packages, `alpha` and `latest` dist-tags, signed tag, and GitHub prerelease were
published on 2026-07-15 and cannot be replaced. The migration preserves the alpha public component
APIs but changes the styling authoring and consumer setup contract, so a patch prerelease is the
smallest truthful increment.

This report does not authorize npm publication, dist-tag changes, Git tagging, or a GitHub Release.
Those remain explicit maintainer actions under issue #175 and `RELEASE.md`.

## Architecture

- Tailwind CSS v4 is the component authoring engine. Complete static class strings live beside the
  component structure and state logic.
- Nerio `--n-*` primitive, semantic, and component variables remain the public value layer for
  themes, modes, density, and product customization.
- `packages/tokens/src/tailwind.css` maps Nerio variables into Tailwind utilities with
  `@theme inline`.
- Component roots use the shared conflict-aware `tailwindCn` helper so consumer `className`
  utilities remain deterministic conflict winners.
- Consumers own Preflight. Nerio neither imports nor injects it.
- `@nerio-ui/ui` remains server-safe and `@nerio-ui/ui/client` remains the interactive Base UI
  entrypoint.

The normative contract is `docs/tailwind-styling-contract.md`. The pilot and family-level evidence
remain in `docs/tailwind-migration-pilot-report.md` and
`docs/tailwind-migration-components-report.md`.

## Migrated inventory and residual CSS

All released Core families are Tailwind-first: Foundations, Actions, Forms, Data Display, Feedback,
Progress, Navigation, Layout, Overlays, and compound UI. The final component stylesheet surface is
3,954 bytes. Named shared keyframes are the only rules under `packages/ui/src/styles/*.css`;
`packages/ui/src/styles.css` additionally owns the scoped no-Preflight box-sizing and native-control
typography compatibility rules.

Contract tests reject visual `.n-*` component selectors, BEM arbitrary-selector ambiguity, legacy
merge helpers, `@apply` mirrors, raw palette utilities, and residual CSS outside the allowlist. There
is no second handwritten component styling implementation.

## Package and source-install setup

Package consumers must:

1. install the coordinated `@nerio-ui` packages and Tailwind CSS v4;
2. import `@nerio-ui/tokens/styles.css` and `@nerio-ui/tokens/tailwind.css`;
3. add an explicit Tailwind `@source` for the installed `@nerio-ui/ui/src` path because Tailwind
   ignores `node_modules` by default;
4. import `@nerio-ui/ui/styles.css` for the residual keyframes and scoped compatibility rules;
5. add the used TypeScript source packages to Next.js `transpilePackages`.

Source-install consumers receive the copied token styles, Tailwind bridge, shared merge helper,
residual styles, and complete component dependency closure from the Registry. `nerio init`, `list`,
`info`, `add`, and `doctor` share the same Registry contract. `doctor` diagnoses missing bridge
imports, package `@source`, source-install token/bridge imports, explicit no-Preflight setup, and
stale pre-migration component CSS.

## Migration from 0.1.0-alpha.0

The React component APIs, package entrypoints, tokens, runtime axes, accessibility contracts, and
server/client boundaries remain alpha-compatible. Consumers must update build setup:

- add Tailwind CSS v4 and the Nerio Tailwind bridge;
- register package source or import the copied source-install bridge;
- retain the Nerio residual styles entrypoint;
- choose whether the application imports Tailwind Preflight;
- remove copied pre-migration Nerio component styles after `nerio doctor` confirms the replacement;
- keep `transpilePackages` for every consumed source-first package.

No visual redesign, new component, Pro surface, runtime appearance axis, or unrelated public API
cleanup is included.

## Validation evidence

The migration and its prerelease blockers landed through PRs #176-#182, #200-#205, #207, and #209.
Focused blockers #183, #184, #188, #189, #190, #191, and #202 are closed. The implementation tree
promoted by PR #205 is `bfa691b3bcc5cbf9fe92f1d41dbe89270c060c93`; GitHub CI run
`29646147404` and the production Vercel deployment passed.

The complete local release gate covers formatting, lint, typecheck, branch policy, UI and
accessibility contracts, invalid catalog/token fixtures, token/runtime/typography/catalog/docs
validators, CLI, MCP, adapters, docs examples, Chromium browser smoke, production builds, package
contents, and packed package/source-install consumers.

Fresh clean-worktree verification on 2026-07-18 passed:

- formatting, lint, typecheck, branch policy, catalog/token invalid-fixture suites, and all focused
  validators;
- 138 UI contract tests and 17 accessibility tests;
- CLI, MCP, adapter-isolation, and docs-example fixtures;
- docs and demo production builds;
- 14 Chromium release/docs scenarios across appearance, responsive, focus, overlays, Command,
  Toast LTR/RTL, reduced motion, forced colors, Tailwind family recipes, and safe areas;
- `pnpm pack:check` for all six packages, including manifest, file, export, dependency, peer, and bin
  inspection;
- `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release`, including packed CLI/MCP discovery,
  representative source installs, and a clean Next.js consumer production build.

## Known limitations

- This is an alpha release and is not API-frozen or production-stable.
- Packages ship TypeScript source; supported Next.js consumers configure `transpilePackages`.
- Tailwind ignores package source under `node_modules` unless the consumer adds the documented
  `@source` directive.
- Preflight ownership is intentionally consumer-controlled; no-Preflight consumers need the Nerio
  compatibility styles.
- IconButton and documented Button aliases remain temporary alpha migration compatibility.
- Full cross-browser expansion and visual-regression infrastructure remain owned by later roadmap
  tasks.

## Manual handoff for 0.1.0-alpha.1

1. Select the final unchanged `main` commit after this evidence is promoted.
2. Create a dedicated release PR that bumps all six public packages and coordinated internal
   references to `0.1.0-alpha.1`, updates the release smoke expectation and changelog heading, and
   changes no implementation behavior.
3. Inspect every packed manifest and tarball, then run the complete public-manifest gate with
   `NERIO_RELEASE_EXPECT_PUBLIC=1 pnpm validate:release`.
4. Obtain explicit maintainer approval and verify npm authentication, scope access, provenance, and
   trusted-publishing configuration.
5. Publish tokens, adapters, registry, UI, CLI, and MCP in that dependency order under `alpha`,
   verifying each package before continuing.
6. Independently verify package and source-install consumers, CLI commands, MCP discovery, Next.js
   production build, themes, modes, density, interactions, and residual styles from npm artifacts.
7. Create the signed `v0.1.0-alpha.1` tag and GitHub prerelease only after all package verification
   passes. Record package URLs, commit, tag, release, CI/deployment, provenance, dist-tags, clean
   consumer logs, known limitations, and follow-ups in issue #175.
