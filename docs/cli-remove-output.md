# CLI remove planning and structured output

`nerio remove` accepts one or more directly installed Registry item names. It reads the portable
installed-source graph from `nerio.lock.json`; removal does not fetch Registry source.

```bash
pnpm exec nerio remove button --dry-run
pnpm exec nerio remove button card --dry-run --json
pnpm exec nerio remove button
```

The CLI sorts and deduplicates requests, keeps every item still reachable from another direct root,
and plans one source and lock transaction. Shared files remain installed with their owner metadata
narrowed to retained items. An unowned file is deleted only when its local hash matches the recorded
baseline. A locally modified file or incomplete ownership record blocks the complete operation
before writes. `--force` explicitly converts every reported local-modification conflict into a
modified-file deletion; it does not bypass ambiguous ownership or path validation.

## JSON contract

`--json` writes one JSON object to standard output. Recovery notices and error diagnostics remain on
standard error. Schema `1.0.0` contains:

- `command`: always `remove`;
- `status`: `planned`, `applied`, or `blocked`;
- `dryRun` and `force`: invocation mode flags;
- `requestedItems`: sorted direct roots selected for removal;
- `removedItems`: sorted roots and dependencies no longer referenced by another direct root;
- `files`: path-sorted portable entries with `action`, `removedOwners`, and `remainingOwners`;
- `summary`: requested-item, removed-item, file, delete, preserved, missing, and conflict counts.

File actions are `delete`, `delete-modified`, `preserved-shared`, `already-missing`,
`conflict-local-modification`, or `conflict-ambiguous-ownership`. JSON never includes source
content, secrets, temporary transaction paths, or absolute machine paths.

## Exit behavior

- Exit code `0`: help, dry-run planning, or the requested transaction completed successfully.
- Exit code `1`: invalid input, a non-direct request, a preflight conflict, invalid lock metadata, or
  a transaction or recovery failure.

A blocked JSON plan is written before the concise error on standard error, allowing automation to
parse every conflict while still treating the command as failed. Removal commits all source and lock
changes together or restores their previous state through the existing transaction journal.
