# ADR 0008: Namespaced Registries and bounded authentication

## Status

Accepted

## Context

Nerio currently resolves one Registry location from `--registry`, `NERIO_REGISTRY`, `nerio.json`,
or the packaged default. The CLI validates one manifest, resolves one in-Registry dependency graph,
fetches integrity-verified source through one bounded transport, and commits one operation-atomic
source and lock transaction.

Issue [#353](https://github.com/vpavlov-me/Nerio/issues/353) requires multiple explicitly trusted
public, community, internal, and future Pro-compatible Registry origins without weakening that
single-Registry baseline. The decision must separate a project's convenient namespace aliases from
Registry identity, keep unqualified projects compatible, resolve one deterministic graph across
Registries, scope credentials to their intended origin, and preserve exact origin metadata through
lock, diff, update, CLI, and bounded MCP projections.

Roadmap [#152](https://github.com/vpavlov-me/Nerio/issues/152) authorizes Core 1.2 forward
development on `dev` while the stable 1.0 candidate remains isolated. This decision uses `dev`
commit `9c363f08ec1dfc96ab27f70f1c8a706bfd591935`, Registry schema `1.1.0`, 56 Registry items, and
coordinated package version `1.0.0-beta.1`. It does not alter or enter the stable 1.0 candidate.

## Existing contract to preserve

The implementation must extend the current modules rather than create a second Registry stack:

- `packages/cli/src/internal/registry.js` owns package, local-file, HTTPS, trusted-local HTTP,
  timeout, redirect, response-size, content-type, schema, path, and credential-safe location rules;
- `packages/cli/src/internal/workspace.js` owns target confinement, integrity, shared ownership,
  project locking, transaction staging, rollback, recovery, and lock validation;
- command modules own bounded selection, discovery, plan, mutation, and structured output;
- the packaged Registry remains self-contained and integrity-verified under ADR 0007;
- MCP remains read-only and projects canonical Registry metadata rather than owning transport or
  mutation behavior.

The namespaced contract must not execute Registry code, fetch credentials, write consumer files, or
relax any existing validation before the complete cross-Registry plan passes.

## Reference protocol evidence

Public protocols are references, not API authorities for Nerio:

- shadcn/ui demonstrates a practical local `@namespace/item` address and per-namespace
  configuration, but Nerio keeps whole immutable manifests, exact source integrity, and one atomic
  transaction instead of adopting item URL templates or its Registry schema;
- npm maps local package scopes to registries and requires credentials to be scoped to a registry
  URI fragment, reinforcing that a convenient name and a credential scope are separate concepts;
- the OCI Distribution Specification permits redirects but requires clients not to forward
  `Authorization` across host boundaries unless explicitly configured;
- the Fetch and HTTP specifications define URL origins and authentication protection spaces, which
  anchor Nerio's same-origin credential rule.

Nerio deliberately selects a smaller contract than these general systems.

## Decision

Adopt a configuration-local namespace layer over stable manifest-owned Registry identities. Add
bounded environment-backed request authentication and resolve every requested item and dependency
into one identity-keyed graph before any consumer-owned write.

This ADR approves the contract only. Source, schemas, lock migration, commands, fixtures, public
snapshots, and Registry-author documentation require separate implementation PRs after maintainer
approval.

## Item reference syntax

Two item address forms are accepted:

- `button` is unqualified and resolves only in the configured default Registry;
- `@acme/button` resolves only through the project's `acme` namespace entry.

Namespace aliases:

- use lowercase ASCII and match `^[a-z](?:[a-z0-9]*)(?:-[a-z0-9]+)*$`;
- are at most 32 characters;
- are compared exactly after validation; uppercase input is rejected rather than normalized;
- are local configuration labels, never global ownership claims or trust identities;
- reserve `default` for the virtual alias of the configured default Registry;
- cannot be inferred, downloaded from an index, or introduced by a Registry manifest.

Registry item names retain the existing lowercase name contract. A qualified reference contains
exactly one namespace and one item segment. URLs, package paths, nested namespaces, empty segments,
fragments, query strings, and version selectors are not item references.

The default Registry may additionally expose one configured alias through its own `registry.alias`
field. The unqualified name, virtual `@default` alias, and that optional alias all resolve through
the same canonical default entry; they do not duplicate its source, authentication, or identity
configuration. Two configured entries must not claim the same namespace, and each `expectedId`
must occur in exactly one canonical entry across `registry` and `registries`. A command fails before
network or filesystem mutation when a namespace is absent, malformed, reserved, duplicated, or
maps to a non-canonical Registry entry.

Unqualified names never search every configured Registry and never use first-match resolution.
This preserves existing behavior and prevents a newly added Registry from taking over an existing
unqualified item.

## Configuration schema

Namespaced operation requires explicit `nerio.json` schema `2.0.0`. Existing schema `1.0.0`
projects remain valid single-Registry projects and keep their current unqualified behavior.

The accepted schema shape is:

```json
{
  "schemaVersion": "2.0.0",
  "registry": {
    "alias": "nerio",
    "source": "@nerio-ui/registry/manifest.json",
    "expectedId": "com.vpavlov.nerio.core"
  },
  "registries": {
    "acme": {
      "source": "https://registry.acme.example/v1/manifest.json",
      "expectedId": "com.acme.design-system",
      "auth": {
        "headers": [
          {
            "name": "Authorization",
            "environment": "ACME_REGISTRY_TOKEN",
            "scheme": "Bearer"
          }
        ]
      }
    }
  },
  "components": "components/nerio"
}
```

The default `registry` entry is required and may declare one optional `alias`. `registries` may be
empty; each key is the alias for one additional canonical entry. An alias must be unique across the
default entry and `registries`, and an `expectedId` must be unique across all entries. Every entry
accepts one source:

- a package export such as `@nerio-ui/registry/manifest.json`;
- a project-relative local manifest path;
- an HTTPS manifest URL;
- trusted local HTTP only under the existing explicit `--allow-insecure-http` exception and only
  when the entry has no authentication.

Every schema 2 entry requires `expectedId`. Remote URLs must not contain user information, query
strings, or fragments. Query-parameter authentication and inline credential values are rejected.
Registry configuration is declarative data; it cannot contain scripts, executable credential
helpers, command substitutions, token endpoints, or refresh behavior.

`--registry` and `NERIO_REGISTRY` remain compatibility overrides only for schema 1 single-Registry
commands. They must not silently replace one entry inside a schema 2 trust graph. A future explicit
namespaced override requires a separate decision because process-global overrides are not a safe
identity or authentication model for cross-Registry plans.

## Stable Registry identity

Registry manifest schema `2.0.0` adds required `registryId`. The identifier:

- is an opaque, stable, lowercase reverse-domain-style string such as
  `com.vpavlov.nerio.core`;
- is between 3 and 128 ASCII characters;
- contains dot-separated labels made from lowercase letters, numbers, and internal hyphens;
- is distinct from the display name, namespace alias, package name, URL, version, source revision,
  and style contract version;
- must never change merely because hosting, version, or a local alias changes.

The CLI compares the manifest's `registryId` with the configured `expectedId` before accepting any
item or source. The Registry ID is a trust anchor chosen by configuration, not cryptographic proof
of publisher ownership. TLS, the explicitly configured source, source integrity, and lock history
remain part of the trust decision.

Every schema 2 file requires SHA-256 integrity, including package and local Registries. The manifest
continues to own its schema version, release version, source revision, style contract version, item
metadata, source paths, targets, and integrity. A namespace may not override manifest identity or
metadata.

## Dependency model

The canonical graph key is `(registryId, itemName)`, not namespace text or item name alone.

Schema 2 `registryDependencies` accepts:

- an unqualified string such as `button`, which always means the item in the same Registry;
- an object `{ "registryId": "com.acme.icons", "item": "icon" }`, which means one exact item in
  another explicitly configured Registry.

Registry manifests do not reference consumer-local aliases. A cross-Registry dependency resolves
only when exactly one configured entry has the required `expectedId` and its loaded manifest
matches that ID. Registries cannot discover, configure, or substitute another Registry.

Resolution follows these rules:

1. Parse and validate every requested reference.
2. Load each explicitly needed manifest through the shared bounded transport.
3. Verify configured identity, schema compatibility, origin policy, and complete manifest shape.
4. Resolve the full dependency closure with `(registryId, itemName)` graph keys.
5. Reject unknown items, missing Registries, global cycles, incompatible schemas, identity changes,
   target conflicts, package dependency conflicts, and unsafe source locations.
6. Sort the canonical graph deterministically by Registry ID and item name after dependency
   constraints are satisfied.
7. Fetch and integrity-check every unique source.
8. Preflight the complete target and lock plan before invoking the existing transaction engine.

An unqualified dependency can never redirect to the default Registry or another Registry. This is
the namespace-takeover boundary.

Existing identical-file shared ownership remains valid only among items from the same Registry ID.
Two different Registry IDs targeting the same consumer path always conflict, even when content,
role, source text, or integrity matches. Cross-Registry co-ownership would make removal, update,
origin drift, and incident response ambiguous.

## Origin contract

Each loaded Registry has one canonical origin record:

- `kind`: `package`, `file`, or `https`;
- `source`: the configured package export, normalized project-relative file path, or sanitized HTTPS
  manifest URL;
- `manifestLocation`: the final sanitized manifest location after permitted redirects;
- `registryId`: the verified manifest identity.

Local absolute machine paths are used internally for confinement checks but are never written to
portable lock state or structured output. URL user information, query values, fragments, and all
authentication data are removed from diagnostics and projections.

Changing an alias while keeping the same `registryId` and origin is cosmetic. Changing a configured
origin for an installed Registry is a trust change: `doctor`, `diff`, `update`, and mutating commands
must stop and report the old and new sanitized origins. The implementation must provide one
explicit, dry-run-first origin migration that verifies the same `registryId`, complete source
integrity, and the resulting global plan before updating lock metadata. Editing the config alone is
not acceptance of silent origin substitution.

Changing `expectedId` is a different Registry, not an origin migration. Existing items must be
removed through their recorded ownership graph or migrated through a separately reviewed contract;
they cannot be silently rebound.

## Bounded authentication

Authentication is optional and available only for HTTPS Registry entries. The initial contract
supports at most one case-insensitive instance of each of these headers:

- `Authorization` with scheme `Bearer` or `Basic`;
- `X-API-Key` with no scheme.

Every value comes from one environment variable matching `^[A-Z][A-Z0-9_]{0,63}$`. Inline values,
URL credentials, query credentials, cookies, arbitrary headers, multiline values, control
characters, and values larger than 8 KiB are rejected. Missing variables fail before the first
authenticated request and identify the namespace and variable name, never a partial value.

Credential scope is deliberately narrower than ordinary redirect behavior:

- headers are attached only when the request URL has the exact HTTPS origin of the configured
  manifest source;
- an authenticated redirect is followed only when the target has that exact origin;
- a cross-origin redirect aborts before a second request and never receives credentials;
- authenticated manifest source files must resolve to the same origin;
- protocol downgrade, user information, or an origin change always aborts;
- unauthenticated Registries retain the existing bounded redirect policy.

The CLI never logs request headers or values, includes them in errors, stores them in config output
or lock state, returns them from plans or MCP, or echoes remote response bodies on authentication
failure. `401` and `403` produce stable errors containing only the namespace, sanitized origin, and
status. Authentication material is resolved only for the request that needs it and discarded after
the command.

## Lock, diff, and update contract

Namespaced projects use lock schema `2.0.0`. The lock records:

- a `registries` table keyed by stable Registry ID with aliases, portable canonical origin, schema,
  version, source revision, and style contract version;
- requested roots as `{ registryId, item }` records;
- items keyed by canonical Registry ID and item name with exact same- and cross-Registry
  dependencies;
- every file's Registry ID, source, integrity, role, canonical owners, and installed hash;
- the CLI version and existing transaction metadata required for recovery.

The lock stores no credentials, environment variable names, response headers, source content,
temporary paths, or absolute local paths. Human and JSON output may show configured aliases for
usability, but comparisons and ownership use stable IDs.

`diff` and `update` load the complete recorded graph, compare every Registry ID and sanitized origin,
and plan one deterministic cross-Registry result. Source writes and the lock remain one operation-
atomic transaction. A failure in any Registry, dependency, source, integrity check, conflict, or
origin check stops the complete plan before consumer-owned writes. Rollback restores the complete
prior source and lock state.

Lock schema `1.0.0` remains readable for schema 1 projects. Migration to schema 2 is explicit and
dry-run-first. It loads the configured default schema 2 manifest, verifies its `registryId`, maps all
existing unqualified roots, items, owners, and files to that ID, preserves installed hashes and
integrity, and commits config plus lock through the existing migration transaction. It never
guesses an identity from the display name or URL.

The lock is reproducibility metadata, not an offline source cache. Offline use works only when the
recorded package or local sources are available. Remote reproduction requires the configured origin
to return the same Registry identity and integrity-verified files. Persisting source blobs or
credentials requires a separate cache design.

## CLI and MCP projection

Namespaced implementation extends `list`, `info`, `search`, `view`, `docs`, `add`, `remove`, `diff`,
`update`, and `doctor` without changing the meaning of unqualified schema 1 commands.

Structured output receives a new schema version before adding Registry IDs, aliases, canonical item
references, origins, or cross-Registry dependencies. Existing `1.0.0` JSON schemas are not silently
reshaped. Human diagnostics use qualified aliases when ambiguity exists and stable IDs when trust
or origin drift is the subject.

MCP may expose bounded read-only Registry ID, alias, sanitized portable origin, version, revision,
style contract, item reference, and dependency information. It must not read environment-backed
credentials, perform authenticated requests independently of the shared resolver, expose auth
configuration, reveal local absolute paths, or gain consumer-file mutation. Expanded discovery and
planning remain bounded by issue [#354](https://github.com/vpavlov-me/Nerio/issues/354); #353 only
adds the minimum identity data needed to keep existing Registry projections truthful.

## Extension boundary

Core owns a generic in-memory credential resolver that turns one validated Registry auth definition
into the approved request headers. The initial implementation reads environment variables only.

A future Pro or enterprise package may provide short-lived material through an explicitly approved
credential-provider interface that returns the same bounded header representation in memory. Core
must not import Pro, understand accounts, licenses, entitlements, payments, plans, teams, refresh
tokens, browsers, keychains, or hosted services. Providers cannot change Registry identity, origin,
redirect, integrity, planning, transaction, redaction, or output policy.

No provider interface becomes public merely to anticipate Pro. It requires a separate measured
decision and consumer before admission.

## Threat assumptions

The implementation must assume:

- a configured Registry or one of its responses may be malicious or compromised;
- a remote host may redirect, overrun size limits, stall, return the wrong content type, claim a
  different identity, reference unsafe paths, create cycles, collide with targets, or serve content
  that fails integrity;
- a user may accidentally reuse an alias, change an origin, omit a secret, or expose a secret in a
  URL;
- error, JSON, lock, MCP, recovery, and dry-run paths are potential secret disclosure surfaces;
- multiple Registries may intentionally or accidentally provide the same names and paths;
- concurrent local commands and interrupted writes remain possible.

Nerio trusts the local project configuration, process environment, operating system, package
resolver, platform TLS trust store, and explicit trusted-local HTTP opt-in. It cannot protect
secrets from another process or user that can already read the invoking process environment or
modify the project and executable. Registry ID is not a signature or certificate; it prevents
accidental and silent substitution only when combined with the configured origin, TLS, lock history,
and file integrity.

## Rejected alternatives

### Treat namespace aliases as Registry identity

Rejected because aliases are project-local and renameable. Trust, lock ownership, and updates need
a manifest-owned stable ID.

### Search all Registries for unqualified items

Rejected because configuration order would change behavior and permit namespace takeover. The
default Registry exclusively owns unqualified roots, and same-Registry dependencies stay local.

### Put consumer aliases in Registry manifests

Rejected because manifests cannot control or predict local names. Cross-Registry dependencies use
stable Registry IDs.

### Auto-discover Registries or use a global namespace directory

Rejected because it adds a takeover and availability authority outside the project's explicit trust
configuration. Nerio may document community Registries without making discovery part of resolution.

### Allow inline, query, or arbitrary-header credentials

Rejected because they expand secret persistence and redaction surfaces. The initial environment-
backed two-header contract covers common token and API-key access without becoming a general HTTP
client.

### Forward credentials across configured redirects

Rejected because origin allowlists and redirect-specific credentials add a second trust graph. An
authenticated Registry stays on one exact HTTPS origin.

### Let cross-Registry items share target ownership

Rejected because removal, update, compromise isolation, and origin migration become ambiguous even
when current bytes match.

### Create a second authenticated transport or transaction engine

Rejected because it would fork the accepted timeout, redirect, size, content-type, integrity,
redaction, confinement, rollback, and recovery guarantees.

### Store source content for offline installation

Rejected from this slice because a portable content cache has its own size, eviction, trust,
confidentiality, and lifecycle contract. Integrity-verified package and local Registries already
support offline operation.

### Add licensing or hosted Registry behavior to Core

Rejected by the Core/Pro boundary. Authentication transports opaque material; it does not determine
why access was granted.

## Consequences

- Existing schema 1 projects remain unchanged and unqualified.
- Schema 2 projects gain explicit local namespaces without treating aliases as trust identities.
- Cross-Registry plans remain deterministic, integrity-verified, target-safe, and operation-atomic.
- Credentials have a small declarative surface and cannot follow cross-origin redirects.
- Origin changes become explicit migrations instead of silent rebinding.
- Lock schema and structured CLI output require intentional versioned migrations.
- Registry authors must publish stable IDs and complete integrity under schema 2.
- The initial contract does not support arbitrary authentication protocols, global discovery,
  offline caching, hosted accounts, or licensing.

## Implementation sequence after approval

1. Add schema 2 config and manifest validators, stable identity/origin models, bounded environment
   authentication, and transport regression fixtures while preserving schema 1 behavior.
2. Add the canonical cross-Registry graph, conflict rules, lock schema 2, explicit config/lock and
   origin migrations, and operation-atomic add/remove/diff/update behavior.
3. Add namespaced discovery/doctor output, the minimum truthful MCP projection, Registry-author
   documentation and validators, clean local/public/authenticated fixtures, package evidence, and
   versioned public snapshots.

Each implementation slice requires one focused PR into `dev`. No slice may publish packages, move
tags or dist-tags, promote `dev` to `main`, deploy a Registry service, create real credentials, add
Pro behavior, or claim stable release readiness.

## Decision validation boundary

This decision PR must prove:

- documentation formatting and repository decision validation pass;
- `quality/public-api-snapshot.json` remains unchanged;
- Registry manifest, config, lock, CLI/MCP runtime, package exports, and release metadata remain
  unchanged;
- the current single-Registry CLI tests remain green where documentation validation exercises them;
- the decision, Core 1.x parity projection, and roadmap describe the same Phase 1 outcome.

## References

- [shadcn/ui Registry namespaces](https://ui.shadcn.com/docs/registry/namespace)
- [npm `.npmrc` authentication scoping](https://docs.npmjs.com/files/npmrc/)
- [OCI Distribution Specification](https://github.com/opencontainers/distribution-spec/blob/main/spec.md)
- [Fetch Standard](https://fetch.spec.whatwg.org/)
- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110)
- [Nerio ADR 0007](./0007-compiled-runtime-and-self-contained-registry.md)
- [Nerio Core 1.x capability parity](../core-1-x-capability-parity.md)
- [Issue #353](https://github.com/vpavlov-me/Nerio/issues/353)
