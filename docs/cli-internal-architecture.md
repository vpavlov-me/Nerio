# CLI internal architecture

Issue [#352](https://github.com/vpavlov-me/Nerio/issues/352) modularizes the CLI before adding new
lifecycle or bootstrap commands. The published `nerio` bin and its seven existing commands remain
the only public CLI contract. Files under `packages/cli/src/internal/` are private implementation
details and do not create supported package subpaths.

## Responsibility boundaries

| Module                     | Responsibility                                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `index.js`                 | Compose the runtime and report the final process error.                                               |
| `internal/command-line.js` | Parse current arguments and render existing help text.                                                |
| `internal/add.js`          | Select add roots, build the deterministic preflight plan, and emit human or JSON results.             |
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
module graph. This keeps package and startup cost bounded without publishing internal subpaths.

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

## Multi-item add lifecycle

The first Phase 2 slice accepts multiple explicit roots or `--all`. It sorts and deduplicates direct
requests, resolves one Registry dependency union, fetches every source, and classifies every target
before invoking the existing transaction service. Any conflict blocks the complete set. A successful
operation supplies one ordered operation list and one coherent next lock state to `applyTransaction`,
so rollback, recovery, process locking, source ownership, and lock portability remain unchanged.

`--dry-run` returns the same plan without invoking the transaction. `--json` emits add-result schema
`1.0.0`; its portable contract and exit behavior are documented in `docs/cli-add-output.md`.

## Explicit non-goals

- No new command, configuration schema, lock schema, or exit-code semantics.
- No Registry transport, integrity, timeout, redirect, or credential-policy change.
- No transaction, rollback, crash recovery, concurrency, or source-ownership behavior change.
- No remove, search, migration, or project bootstrap implementation in this slice.
- No package publication, tag movement, stable-line backport, or `main` promotion.
