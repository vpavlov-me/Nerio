# CLI add planning and structured output

`nerio add` accepts one or more explicit Registry item names. `nerio add --all` selects every item
from the configured immutable Registry and cannot be combined with explicit names.

```bash
pnpm exec nerio add button card --dry-run
pnpm exec nerio add button card
pnpm exec nerio add --all --dry-run --json
```

The CLI sorts and deduplicates direct requests, resolves one Registry dependency union and one npm
package dependency union, fetches every source, and preflights every target before any consumer file
is written. A conflict blocks the complete set. A successful operation commits one recoverable
source transaction and one coherent `nerio.lock.json` update.

## JSON contract

`--json` writes one JSON object to standard output. Schema `1.0.0` contains:

- `command`: always `add`;
- `status`: `planned`, `applied`, or `blocked`;
- `dryRun` and `all`: invocation mode flags;
- `registry`: portable Registry schema, name, version, revision, and style contract metadata;
- `requestedItems`: sorted direct roots;
- `resolvedItems`: sorted roots plus Registry dependencies;
- `packageDependencies`: sorted unique npm dependency names;
- `files`: path-sorted portable entries with `action` and sorted `owners`;
- `summary`: requested, resolved, file, write, unchanged, and conflict counts.

File actions are `write`, `overwrite`, `unchanged`, `preserved`,
`conflict-local-modification`, or `conflict-existing-content`. `preserved` identifies the intentional
source-install token stylesheet exception. JSON never includes source content, secrets, temporary
transaction paths, or absolute machine paths.

## Exit behavior

- Exit code `0`: help, dry-run planning, or the requested transaction completed successfully.
- Exit code `1`: invalid input, an unknown item, a preflight conflict, Registry validation or
  transport failure, or a transaction/recovery failure.

A blocked JSON plan is written before the concise error on standard error, allowing automation to
parse every conflict while still treating the command as failed. `--overwrite` converts existing
target conflicts into explicit overwrite actions; it remains an intentional replacement option.
