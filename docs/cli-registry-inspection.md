# CLI Registry inspection and structured output

`nerio search`, `nerio view`, and `nerio docs` inspect the configured immutable Registry without
installing or fetching source. They use the same package, local-file, HTTPS, trusted-local HTTP,
timeout, redirect, response-size, schema, path, and credential policy as the existing Registry
commands.

```bash
pnpm exec nerio search keyboard --limit 5
pnpm exec nerio search "single date" --json
pnpm exec nerio view button
pnpm exec nerio view button --json
pnpm exec nerio docs button
```

Search is case-insensitive and requires every whitespace-separated query term to match the item's
documented metadata. It covers name, title, description, category, dependencies, Registry
dependencies, Base UI primitives, slots, variants, states, required tokens, accessibility, usage,
and the optional docs path. File source and target paths are excluded from search ranking. Results
are sorted by item name and limited to 20 items by default; `--limit` accepts an integer from 1 to 50.

View returns exactly one item and includes its source paths, install targets, roles, SHA-256
integrity, package and Registry dependencies, Base UI primitives, slots, variants, states, required
tokens, and optional docs path. It never returns source content. Docs returns exactly one item's
description, usage, accessibility guidance, and optional docs path. A missing docs path is reported
as absent rather than inferred from the item name.

## JSON contract

`--json` writes one JSON object to standard output using inspection schema `1.0.0`.

- Search returns `command`, `query`, `limit`, `total`, `count`, and `items`. Each result contains
  `name`, `title`, `description`, `category`, and a nullable `docsPath`.
- View returns `command`, portable Registry release metadata, and an explicit projection of the
  documented Registry item fields. Each file is limited to `source`, `target`, `role`, and
  `integrity`; additive Registry extensions are not emitted.
- Docs returns `command`, portable Registry release metadata, and an `item` containing `name`,
  `title`, `description`, nullable `docsPath`, `usage`, and `accessibility`.

Output is bounded by the 2 MiB Registry manifest limit, a maximum of 50 search results, and exactly
one item for view or docs. It contains no source content, secrets, consumer files, lock state,
temporary paths, or absolute machine paths.

## Exit behavior

- Exit code `0`: help or inspection completed successfully, including a search with no matches.
- Exit code `1`: invalid input or limit, an unknown item, or Registry validation or transport
  failure.

These commands do not acquire the project mutation lock, run transaction recovery, create
configuration, or write consumer-owned files.
