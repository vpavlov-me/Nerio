# Public API stability

This policy applies to the coordinated Core packages:

- `@nerio-ui/tokens`
- `@nerio-ui/adapters`
- `@nerio-ui/registry`
- `@nerio-ui/ui`
- `@nerio-ui/cli`
- `@nerio-ui/mcp`

All six packages use one aligned version. A release is not compatible when only part of the set is
updated.

## Core 1.0 contract

The checked-in snapshot at `quality/public-api-snapshot.json` is the Core 1.0 contract baseline. It
covers:

- package exports, bins, engines, peer ranges, dependencies, files, and side effects;
- TypeScript exports and signatures for every public subpath;
- semantic and component CSS custom properties;
- Registry item names, dependency closure, files, source integrity, slots, states, variants, and
  required tokens;
- CLI commands, help, configuration schemas, lock schema, and default Registry behavior;
- MCP tool names and response object shapes;
- public documentation routes.

Internal source layout, tests, documentation implementation, and class recipes remain private
unless exposed by a contract above.

## What counts as breaking

A change is breaking when a supported consumer must change source, configuration, automation,
styling, or accessibility expectations to keep the same behavior. This includes:

- removing or renaming an export, prop, prop value, token, Registry item, CLI command, MCP tool, or
  public docs route;
- narrowing a TypeScript type, package engine, or peer dependency range;
- changing a default, controlled behavior, emitted value, event timing, DOM element, slot, state
  attribute, ARIA relationship, or keyboard interaction;
- changing source-install targets or overwrite/conflict rules;
- changing Registry, CLI, MCP, or lock-file schemas incompatibly.

Additive optional APIs are features. Compatible bug corrections are fixes. A visually small change
can still be breaking when it alters DOM, ARIA, tokens, events, or source ownership.

## Stable and experimental surfaces

Core exports included in the 1.0 snapshot are stable. Experimental work must live behind an
explicitly documented experimental subpath, Registry namespace, or metadata status and is excluded
from the stable snapshot. Pro product components, templates, and workflows are outside the Core
contract.

## Deprecation and removal

After 1.0, a stable API is deprecated in a minor release before removal in the next major release.
The deprecation includes a replacement and migration example. Deprecated APIs remain tested until
their documented removal. Security or correctness emergencies may require a faster change, but the
release notes must explain the exception.

The pre-1.0 alpha compatibility layer was removed while establishing this baseline. See
[`migrations/alpha-to-beta.md`](./migrations/alpha-to-beta.md).

## Snapshot update workflow

Every public-contract change must be intentional:

```bash
pnpm test:api
pnpm validate:api
node scripts/public-api-snapshot.mjs --write \
  --classification feature \
  --approved-by "Maintainer name" \
  --issue 123
pnpm validate:api
```

Use `breaking`, `feature`, or `fix` according to the rules above. The approval record stores the
reviewer, issue, classification, and snapshot hash. Pull requests must explain consumer impact;
updating the snapshot only to make CI green is not approval.

## Distribution channels

Prereleases use the matching npm dist-tag such as `alpha`, `beta`, or `rc`. After every coordinated
publication is verified, `latest` moves to that same version so an unqualified install resolves to
the newest public Nerio release. Historical channel tags remain protected unless a separately
approved release intentionally advances them. Publishing, changing a dist-tag, creating a Git tag,
and creating a GitHub Release are separate maintainer-approved actions; passing this policy does not
authorize them.

## Source-install ownership

Registry source installs are consumer-owned after installation. Use `nerio diff` before updates and
`nerio update --dry-run` to inspect the plan. A normal update may replace an unchanged installed
file, but it must not overwrite a locally modified file. Consumers resolve those conflicts by
porting their local intent onto the new upstream source and then recording the updated state.
Registry add/update operations validate and stage the complete closure before writing, commit lock
metadata last, and restore both source and lock state on failure. Remote Registry access requires
HTTPS unless a trusted local HTTP endpoint is explicitly opted into.
