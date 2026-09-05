# Migrate from Core 1.0.0-beta.1 to 1.0.0

Nerio Core `1.0.0` is a prepared stable candidate. It is not published yet. Until a separately
approved publication is complete and publicly verified, npm `latest` and `beta` continue to resolve
to `1.0.0-beta.1`, and the protected `alpha` tag remains on `0.1.0-alpha.2`.

Do not change a production lockfile to `1.0.0` or resolve Registry source from `v1.0.0` before the
stable packages, tag, Registry revision, and GitHub Release are public from the same exact
candidate.

## Compatibility from beta.1

The stable candidate keeps the frozen Core 1.0 component and source-install contract compatible
with beta.1. Consumers already on `1.0.0-beta.1` do not need to repeat the beta.0 migration for
Calendar `today`, Tabs string values, Nerio-owned interactive types, Registry integrity and HTTPS,
atomic CLI updates, or MCP structured output.

The stable candidate includes these compatible updates:

- all six coordinated packages and the immutable Registry identity move to `1.0.0` and
  `v1.0.0`;
- `@base-ui/react` advances from the reviewed `1.6.0` pin to `1.7.0` without changing Nerio-owned
  public component types;
- `lucide-react` advances to `1.31.0`; the public Nerio `Github` adapter export retains the shipped
  icon contract even though Lucide removed brand icons upstream;
- additive token aliases, documentation routes, and compatible component corrections may change
  visual snapshots or an editable-source diff without requiring a public API rewrite.

The supported consumer baseline remains Node.js 22 or 24, React `>=19 <20`, Next.js
`>=16.2.0 <17`, TypeScript `>=5.9 <6`, and Tailwind CSS `>=4.1.0 <5`.

## Package consumers after publication

After the stable release is publicly verified, update every Nerio package already used by the
consumer to `1.0.0` in one change. Do not mix stable and beta package versions.

For the standard UI package set:

```bash
pnpm add @nerio-ui/tokens@1.0.0 @nerio-ui/adapters@1.0.0 @nerio-ui/ui@1.0.0 tailwindcss
pnpm add -D @tailwindcss/postcss postcss
pnpm install
pnpm typecheck
pnpm build
```

Keep the existing package-mode integration contract:

- list every used Nerio package in Next.js `transpilePackages`;
- import `@nerio-ui/tokens/tailwind.css` and `@nerio-ui/ui/styles.css`;
- register the installed UI source with Tailwind `@source`;
- keep static components on `@nerio-ui/ui` and interactive components on
  `@nerio-ui/ui/client`.

If the consumer pins transitive dependencies through overrides or resolutions, review those pins
for Base UI 1.7 and Lucide 1.31 before installing. Normal consumers should let the coordinated Nerio
manifests resolve them.

## Editable-source consumers after publication

Update the local Registry and CLI together, then inspect the complete source plan before writing:

```bash
pnpm add -D @nerio-ui/registry@1.0.0 @nerio-ui/cli@1.0.0
pnpm exec nerio doctor
pnpm exec nerio diff
pnpm exec nerio update --dry-run
pnpm exec nerio update
pnpm exec nerio diff
```

A normal update may replace an unchanged installed file. It preserves locally modified files so the
consumer can port local intent onto the stable source. Review compatible style and token changes in
the rendered product instead of treating a non-empty diff as a breaking API migration. The stable
CLI records the immutable `v1.0.0` Registry revision only after that revision is public.

## MCP consumers after publication

Upgrade `@nerio-ui/mcp` to `1.0.0` together with the Registry-backed package set. The beta.1 tool
names, declared output schemas, `structuredContent`, formatted JSON text, and stable error codes are
preserved. Consumers should continue to ignore unknown additive fields and validate structured
output against the declared schema.

## Human evidence boundary

The bounded maintainer-run smoke in issue
[#143](https://github.com/vpavlov-me/Nerio/issues/143) records `release-ready` for the exact stable
candidate. It covers four environment groups and six release-critical scenario groups. Any P0/P1
or accepted stable-blocking defect found before publication still stops the release.

The following programs explicitly continue after stable publication and are not completion steps
for this migration:

- [#585](https://github.com/vpavlov-me/Nerio/issues/585): the complete 22-scenario
  accessibility and real-device matrix across eight environment categories;
- [#146](https://github.com/vpavlov-me/Nerio/issues/146): the independent external-consumer cohort
  covering package mode, editable source, Calendar/DatePicker, Registry updates, and MCP.

Findings from those programs feed a patch or Core 1.1 as appropriate. They must remain truthful and
evidence-backed; automated checks do not stand in for real assistive-technology, device, or consumer
observations.

## Earlier prerelease consumers

Consumers on `1.0.0-beta.0` must first follow
[`beta-0-to-beta-1.md`](./beta-0-to-beta-1.md). Consumers still on an alpha release must begin with
[`alpha-to-beta.md`](./alpha-to-beta.md), then complete the beta.0-to-beta.1 guide before applying
this stable transition.

## Verification

After stable publication and the coordinated update:

- confirm every installed Nerio package reports `1.0.0`;
- confirm source installs record Registry revision `v1.0.0` and only intentional local ownership
  remains in `nerio diff`;
- run the consumer typecheck and production build;
- review affected visual snapshots and representative interactions;
- verify the public tag, GitHub Release, package metadata, and documentation all identify the same
  exact stable candidate.
