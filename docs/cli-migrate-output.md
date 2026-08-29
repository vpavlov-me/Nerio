# CLI versioned migration planning and structured output

`nerio migrate` runs only migration routes compiled into the reviewed CLI. The first route updates
the legacy `nerio.json` schema marker from `0.1.0` to `1.0.0` without changing `registry`,
`components`, or additive consumer fields.

```bash
pnpm exec nerio migrate config 0.1.0 1.0.0
pnpm exec nerio migrate config 0.1.0 1.0.0 --json
pnpm exec nerio migrate config 0.1.0 1.0.0 --apply
```

Preview is the default. `--dry-run` may make that mode explicit; it cannot be combined with
`--apply`. Applying the route acquires the project-local process lock, verifies that `nerio.json`
still matches the planned hash, backs up its exact bytes in a durable local transaction, writes the
new configuration atomically, and removes the temporary backup only after commit. A write failure
restores the backup immediately. If the process stops during commit, the next state-sensitive CLI
command restores an incomplete write or retains a fully committed migration before removing the
journal. The hash is checked again immediately before replacement, so a concurrent edit made while
the transaction is staging is retained and the migration stops. The migration replaces only the
top-level schema marker token in the original JSON bytes; unrelated values, including integers
outside JavaScript's safe range, are not parsed and re-serialized into the written file.

The current configuration must match the addressed `0.1.0` source version. Any other target, source
version, destination version, malformed configuration, or unexpected current schema fails before
writes. Migration planning does not read Registry metadata and never loads or executes
Registry scripts, package hooks, or other external code.

## JSON contract

`--json` writes one JSON object to standard output. Recovery notices and error diagnostics remain on
standard error. Schema `1.0.0` contains:

- `command`: always `migrate`;
- `status`: `planned` or `applied`;
- `migration`: the reviewed `config:0.1.0-to-1.0.0` migration identifier;
- `files`: the exact portable path affected by the migration;

The output contains no configuration values, Registry metadata, secrets, backups, temporary paths,
or absolute machine paths.

## Exit behavior

- Exit code `0`: help, a deterministic preview, or an applied migration.
- Exit code `1`: invalid arguments, an unsupported route, malformed or unexpected configuration,
  a concurrent file change, lock failure, transaction failure, or unsafe recovery journal.
