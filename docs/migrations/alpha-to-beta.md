# Migrate from Core alpha to the frozen 1.0 API

The Core 1.0 freeze removes temporary alpha compatibility APIs. Migrate all six coordinated Nerio
packages together and use React 19.

## Package consumers

| Alpha API                                  | Frozen API                                                     |
| ------------------------------------------ | -------------------------------------------------------------- |
| `IconButton`                               | `<Button icon={Settings} aria-label="Settings" />`             |
| `Button variant="subtle"`                  | `Button variant="secondary"`                                   |
| `Button variant="destructive"`             | `Button variant="danger"`                                      |
| `Button loadingLabel="Saving"`             | Remove `loadingLabel`; the visible action name stays stable    |
| `Badge variant="success"`                  | `Badge tone="success"`                                         |
| `Badge icon={Check}`                       | `Badge leadingIcon={Check}`                                    |
| `BadgeVariant`                             | `BadgeTone`                                                    |
| `Select onChange={handler}`                | `Select onValueChange={handler}`                               |
| `RadioGroup onChange={handler}`            | `RadioGroup onValueChange={handler}`                           |
| Pagination item `{ "aria-label": "Next" }` | Pagination item `{ ariaLabel: "Next" }`                        |
| `Icon absoluteStrokeWidth`                 | `Icon lucideAbsoluteStrokeWidth`                               |
| `LucideIcon` from the adapter              | `IconComponent`, or a Lucide type imported from `lucide-react` |
| `<List ordered ... />`                     | `<List marker="decimal" ... />`                                |

Date controls retain one string contract: `Calendar` and `DatePicker` values are `YYYY-MM-DD`
calendar dates, not timestamps. Keep timezone conversion in product code.

Then run:

```bash
pnpm install
pnpm typecheck
pnpm build
```

## Editable source consumers

Upgrade the local CLI and Registry together, then inspect before writing:

```bash
pnpm exec nerio doctor
pnpm exec nerio list
pnpm exec nerio diff
pnpm exec nerio update --dry-run
pnpm exec nerio update
pnpm exec nerio diff
```

Unchanged installed files can update automatically. Locally modified files are reported as
conflicts and remain untouched. For each conflict, compare the new Registry source, port the
product-specific change onto it, and rerun `diff` and `doctor`.

The conventional source root is `src/components/nerio` for applications with a `src/app` or
`src/pages` directory, and `components/nerio` otherwise. Keep the root selected in
`nerio.config.json`; moving installed files without updating configuration breaks dependency and
hash tracking.

## CLI and MCP automation

Do not parse human-readable CLI output as a stable data format unless the command documents it.
Protect automation against the frozen command set and configuration/lock schemas. MCP consumers
should use the documented tool names and response keys, ignore unknown additive keys, and keep the
MCP package version aligned with the Registry and CLI.

## Verification

A migration is complete when:

- no removed alpha name remains in product source;
- package versions are aligned;
- `nerio doctor` passes for source installs;
- `nerio diff` reports only intentional local ownership;
- typecheck, production build, and relevant accessibility/browser smoke pass.

The complete compatibility definition and SemVer rules are in
[`docs/public-api-stability.md`](../public-api-stability.md).
