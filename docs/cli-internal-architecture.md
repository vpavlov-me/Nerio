# CLI internal architecture

Issue [#352](https://github.com/vpavlov-me/Nerio/issues/352) modularizes the CLI before adding new
lifecycle or bootstrap commands. The published `nerio` bin remains the only public package
entrypoint. Files under `packages/cli/src/internal/` are private implementation details and do not
create supported package subpaths.

## Responsibility boundaries

| Module                     | Responsibility                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `index.js`                 | Compose the runtime and report the final process error.                                               |
| `internal/command-line.js` | Parse current arguments and render existing help text.                                                |
| `internal/add.js`          | Select add roots, build the deterministic preflight plan, and emit human or JSON results.             |
| `internal/remove.js`       | Plan direct-root removal, shared ownership retention, conflicts, and human or JSON results.           |
| `internal/discovery.js`    | Run bounded read-only Registry list, info, search, view, and docs inspection.                         |
| `internal/migrate.js`      | Select reviewed version routes, build deterministic plans, and emit human or JSON results.            |
| `internal/registry.js`     | Read and validate local or remote immutable Registry input.                                           |
| `internal/workspace.js`    | Validate paths and state, plan source changes, and own locks, journals, recovery, and atomic commits. |
| `internal/diagnostics.js`  | Inspect consumer dependencies, Tailwind setup, and installed-source drift.                            |
| `internal/commands.js`     | Orchestrate the existing commands through the bounded internal services.                              |

Transport and transaction modules do not print command help or parse `process.argv`. Command
presentation does not own remote response policy, lock internals, or worker heartbeats. Diagnostics
remain read-only. The architecture contract test protects these boundaries without exposing the
modules as public APIs.

## Package and runtime contract

Repository source stays readable and modular. `prepack` creates one deterministic, minified CommonJS
bin in `packages/cli/dist/`; the public package contains that executable instead of the private
module graph. Esbuild bundles the private graph and Terser performs a deterministic final
compression pass. This keeps package and startup cost bounded without publishing internal subpaths.

The pre-refactor baseline on Node 24.18.0 and pnpm 11.19.0 was:

- source entrypoint: 77,840 bytes;
- package tarball: 19,383 bytes;
- package unpacked: 80,904 bytes;
- `nerio --help`: approximately 0.05 seconds wall time;
- full CLI fixture attempt: 35.96 seconds before an existing invalid-lock-owner race interrupted it.

After-change measurements belong in the pull request and must include the deterministic output,
tarball, unpacked package, help startup, and complete CLI fixture result. The implemented slice
measured:

- deterministic generated bin: 45,522 bytes;
- package tarball: 16,614 bytes (`-2,769`, or `-14.3%`);
- package unpacked: 48,721 bytes (`-32,183`, or `-39.8%`);
- `nerio --help`: 0.05–0.06 seconds across five runs;
- complete local and remote CLI fixtures: 56.41 seconds.

The existing 20,000-byte tarball and 82,000-byte unpacked package budgets were not raised.

The Phase 2.3 inspection slice was measured against the merged safe-remove baseline:

- deterministic generated bin: 53,969 to 56,671 bytes (`+2,702`, or `+5.0%`);
- package tarball: 19,579 to 19,576 bytes (`-3`, or less than `0.1%`);
- package unpacked: 57,950 to 60,960 bytes (`+3,010`, or `+5.2%`);
- direct `nerio --help`: 0.02–0.03 seconds across five warm runs;
- complete local and remote CLI fixtures: 48.26 and 52.57 seconds across two clean runs, compared
  with the 52.23-second safe-remove baseline.

The existing package budgets remain unchanged. The Terser pass offsets most compressed-package
cost while keeping the internal source modules independently reviewable.

The Phase 2.4 versioned-migration slice was measured against the merged inspection baseline:

- deterministic generated bin: 57,437 to 56,004 bytes (`-1,433`, or `-2.5%`);
- package tarball: 19,753 to 19,972 bytes (`+219`, or `+1.1%`);
- package unpacked: 61,724 to 60,404 bytes (`-1,320`, or `-2.1%`);
- direct `nerio --help`: 0.04–0.06 seconds across five warm runs;
- complete built local and remote CLI fixtures: 63.89 and 87.90 seconds across two post-review
  runs.

The 20,000-byte tarball and 82,000-byte unpacked package budgets remain unchanged.

## Multi-item add lifecycle

The first Phase 2 slice accepts multiple explicit roots or `--all`. It sorts and deduplicates direct
requests, resolves one Registry dependency union, fetches every source, and classifies every target
before invoking the existing transaction service. Any conflict blocks the complete set. A successful
operation supplies one ordered operation list and one coherent next lock state to `applyTransaction`,
so rollback, recovery, process locking, source ownership, and lock portability remain unchanged.

`--dry-run` returns the same plan without invoking the transaction. `--json` emits add-result schema
`1.0.0`; its portable contract and exit behavior are documented in `docs/cli-add-output.md`.

## Safe remove lifecycle

The second Phase 2 slice accepts one or more directly installed roots and computes their recorded
dependency closure from `nerio.lock.json`. Any item still reachable from another direct root remains
installed. Files with a remaining owner are preserved with narrowed owner metadata; unowned files
are deleted only when their local hash matches the recorded baseline or `--force` explicitly
authorizes a reported modification. Missing or inconsistent ownership metadata blocks the complete
operation before writes.

Dry-run uses the same deterministic plan without invoking the transaction. A successful operation
supplies one ordered delete list and one coherent next lock state to `applyTransaction`, retaining
the existing process lock, validation, rollback, durable journal, and crash-recovery contracts.
`--json` emits remove-result schema `1.0.0`, documented in `docs/cli-remove-output.md`.

## Read-only Registry inspection

The third Phase 2 slice adds `search`, `view`, and `docs` through the private discovery module.
Every command reads only the validated immutable manifest through the existing Registry service.
Search matches documented schema fields with a default result limit of 20 and a hard maximum of 50.
View returns one item's source path, target, role, integrity, dependency, and component metadata
without fetching source content. Docs returns one item's usage, accessibility guidance, and
optional docs path. Structured output uses inspection schema `1.0.0`, documented in
`docs/cli-registry-inspection.md`.

## Versioned configuration migration

The fourth Phase 2 slice adds one reviewed route: `nerio migrate config 0.1.0 1.0.0`. The route is
compiled into the private migration module and changes only the existing `schemaVersion` field in
`nerio.json`; additive consumer fields remain intact. Preview is the default, while `--apply` uses
the shared project lock and a dedicated durable transaction journal that backs up the exact
configuration bytes, validates the planned hash, writes atomically, rolls back failures, and
recovers an interrupted write on the next state-sensitive command. The transaction rechecks the
hash immediately before replacement, and the migration edits only the top-level schema marker token
so additive JSON values are retained byte for byte.

Structured output uses migration-result schema `1.0.0`, documented in
`docs/cli-migrate-output.md`. Migration planning does not resolve, fetch, or execute Registry
metadata, and unsupported targets or version routes fail before writes.

## Explicit non-goals

- No configuration shape, lock schema, or exit-code semantics change beyond the explicit schema
  marker migration.
- No Registry transport, integrity, timeout, redirect, or credential-policy change.
- No change to existing Registry source transaction, rollback, crash recovery, concurrency, or
  source-ownership behavior.
- No additional configuration or lock migration route, project bootstrap, or arbitrary script
  execution.
- No package publication, tag movement, stable-line backport, or `main` promotion.
