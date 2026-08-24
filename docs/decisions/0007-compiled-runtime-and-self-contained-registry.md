# ADR 0007: Compiled package runtime and self-contained source Registry

## Status

Accepted

## Context

Nerio's six coordinated public packages currently publish their workspace `src` directories. This
keeps the artifacts transparent and lets the Registry resolve editable source directly from the UI,
token, and adapter packages, but package-mode consumers must transpile TypeScript from
`node_modules`. Supported Next.js applications therefore list every runtime-imported Nerio package
in `transpilePackages` and register `@nerio-ui/ui/src` with Tailwind `@source`.

Issue [#351](https://github.com/vpavlov-me/Nerio/issues/351) requires a measured decision between
source packages, compiled ESM, a hybrid model, and configuration-only improvements. The decision
must preserve the public import paths, server/client graph, optional peers, Tailwind v4 output,
editable Registry source, and one canonical token/style payload.

The spike uses `dev` commit `876ae04d0f9726e6be0c4499170e3bdefe6d5829`, Node 24.18.0,
Next.js 16.2.12, TypeScript 5.9.3, Vite 8.1.4, and the current Tailwind profile.

## Evidence

### Current source-package baseline

The existing artifacts pass package budgets, six-package pack validation, the clean current Next.js
consumer, the maintained Vite consumer, and optional-adapter isolation. Removing
`transpilePackages` without changing output fails the clean Next.js Turbopack build with five
`Unknown module type` errors for the `.ts` entrypoints in tokens, UI, adapters, and Registry.
Configuration-only changes therefore cannot remove the framework setup.

Exact `npm pack --dry-run --json` measurements are:

| Package              | Current tarball | Current unpacked |
| -------------------- | --------------: | ---------------: |
| `@nerio-ui/tokens`   |        12,954 B |         88,113 B |
| `@nerio-ui/ui`       |        90,773 B |        484,356 B |
| `@nerio-ui/adapters` |         3,684 B |          9,646 B |
| `@nerio-ui/registry` |        36,759 B |        224,975 B |
| `@nerio-ui/cli`      |        18,627 B |         79,819 B |
| `@nerio-ui/mcp`      |         2,933 B |          8,822 B |

### Compiled and hybrid prototypes

A bundled ESM prototype preserved the public subpaths but failed the clean Next.js prerender with
`useState is not a function`. Bundling moved modules across the package's server/client analysis
boundary even though the client entry retained `"use client"`. Bundled output is rejected.

An unbundled TypeScript emit preserves each module and directive. A hybrid artifact that included
both `src` and `dist` passed Next.js, but duplicated package payloads: UI became 173,895 B compressed
and 968,228 B unpacked. Hybrid output is rejected because source Registry mode can be separated
without making every runtime consumer install both representations.

A compiled-only UI package initially broke Registry installs because the published manifest points
into sibling package `src` directories. The successful prototype instead generated a self-contained
Registry artifact: it copied every integrity-verified source file behind the manifest, rewrote only
the manifest's internal source locations, and removed Registry dependencies on tokens, UI, and
adapters. The editable files and hashes remain unchanged.

The selected prototype produced these exact artifacts:

| Package              | Selected tarball | Selected unpacked | Change                                             |
| -------------------- | ---------------: | ----------------: | -------------------------------------------------- |
| `@nerio-ui/tokens`   |         13,181 B |          89,460 B | unbundled ESM, declarations, CSS                   |
| `@nerio-ui/ui`       |         86,701 B |         486,708 B | unbundled ESM, declarations, residual CSS          |
| `@nerio-ui/adapters` |          4,207 B |          13,320 B | unbundled ESM and declarations per subpath         |
| `@nerio-ui/registry` |        135,668 B |         788,366 B | self-contained source payload and metadata runtime |
| `@nerio-ui/cli`      |         18,627 B |          79,819 B | existing CommonJS runtime                          |
| `@nerio-ui/mcp`      |          2,933 B |           8,822 B | existing CommonJS runtime and declarations         |

The common package-mode set of tokens, UI, and adapters decreases from 107,411 B to 104,089 B
compressed. The source-install tool set of CLI plus Registry and its current three transitive Nerio
packages decreases from 162,797 B to 154,295 B compressed because the generated Registry no longer
installs runtime packages only to read their source.

The selected prototype passes the clean Next.js consumer with no `transpilePackages`, the maintained
Vite consumer, representative Registry source installs, and the current optional-adapter matrix.
Tailwind scans `@nerio-ui/ui/dist`; static utility strings remain visible. Token CSS, residual UI
CSS, and every measured import bundle remain unchanged:

- server Card: 3,880 B;
- client Button: 13,386 B;
- named Search icon: 2,292 B;
- table/charts/forms/schema/motion adapter imports: 107/142/58/40/1,543 B;
- token CSS: 82,540 B raw and 11,151 B gzip;
- residual UI CSS: 4,039 B raw and 818 B gzip.

## Decision

Adopt deterministic unbundled compiled output for the TypeScript runtime packages and make the
Registry artifact self-contained.

- `@nerio-ui/tokens`, `@nerio-ui/ui`, and `@nerio-ui/adapters` publish generated ESM JavaScript and
  `.d.ts` declarations from `dist`.
- The UI build preserves per-module `"use client"` directives and does not bundle server and client
  graphs together.
- `@nerio-ui/registry` publishes a generated `dist` containing its manifest, public commands,
  metadata helper, and the exact integrity-verified source files referenced by the manifest. It no
  longer depends on runtime UI, token, or adapter packages.
- `@nerio-ui/cli` and `@nerio-ui/mcp` retain their existing CommonJS JavaScript runtimes. They are
  already executable without TypeScript transpilation.
- Public import paths remain unchanged. Export targets, `files`, side effects, package budgets,
  snapshot metadata, and pack validators move to the generated artifacts.
- Package-mode Tailwind setup scans `@nerio-ui/ui/dist`. Source-install mode continues to scan copied
  consumer source normally.
- Supported Next.js consumers remove Nerio from `transpilePackages`.
- Initial compiled output omits JavaScript and declaration source maps. The repository and
  self-contained Registry preserve exact source, while maps materially enlarge the coordinated
  artifacts without changing the current consumer evidence. Source maps require a later measured
  decision.
- Generated `dist` directories are reproducible release artifacts, not committed source. Pack,
  consumer, SBOM, and release validation build them before inspection.

## Compatibility and migration

This is a compatible package-mode feature. Component APIs, package names, public subpaths, CSS
imports, peers, runtime behavior, Registry item identities, target paths, and source integrity do
not change. Next.js consumers remove `transpilePackages` and change package-mode Tailwind discovery
from `@nerio-ui/ui/src` to `@nerio-ui/ui/dist`. Source-installed consumers require no migration.

The public snapshot update is classified as a feature because package `files` and export targets are
part of the supported contract. No package is published and no dist-tag, Git tag, GitHub Release,
`main` branch, or stable 1.0 artifact moves through this decision or its implementation.

## Rejected alternatives

- Retain source packages: valid but keeps avoidable Next.js transpilation and couples Registry source
  delivery to runtime packages.
- Configuration-only improvement: cannot remove the verified Turbopack `.ts` loader failure.
- Bundled compiled ESM: violates the verified server/client prerender boundary.
- Hybrid `src` plus `dist` in runtime packages: preserves Registry paths but duplicates the largest
  package payload for every package-mode consumer.
- Compiled runtime without self-contained Registry source: breaks editable Registry installs.
- Precompiled component CSS: would duplicate Tailwind's consumer-owned build and undermine token and
  utility customization.

## Implementation boundary

Implementation must add deterministic builds, self-contained Registry preparation, exact export and
budget updates, clean Next.js and Vite fixtures, optional-peer evidence, CLI doctor guidance, docs,
onboarding, API snapshot approval, SBOM validation, and release metadata alignment in one focused
follow-up PR. It must not publish packages, alter component APIs, bundle runtime dependencies,
replace source mode, change the visual language, or promote `dev` to `main`.
