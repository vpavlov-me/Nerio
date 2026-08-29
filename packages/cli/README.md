# `@nerio-ui/cli`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fcli)](https://www.npmjs.com/package/@nerio-ui/cli)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fcli)](https://www.npmjs.com/package/@nerio-ui/cli)

Command-line tools for creating maintained package-mode starters and installing, removing,
inspecting, diffing, and safely updating editable Nerio source.
The current coordinated release is `1.0.0-beta.1`.

## Install

```bash
pnpm add -D @nerio-ui/cli @nerio-ui/registry
```

## Use

Create a deterministic project with the current clean-tested Next.js or Vite package profile:

```bash
pnpm dlx @nerio-ui/cli create my-next-app --framework next
pnpm dlx @nerio-ui/cli create my-vite-app --framework vite
```

Generated projects pin the supported stack, configure Tailwind, tokens, residual styles, and
compiled package scanning, and preserve the static `@nerio-ui/ui` versus interactive
`@nerio-ui/ui/client` boundary. Source-mode projects continue to use `init` and `add` inside an
existing application.

```bash
pnpm exec nerio init
pnpm exec nerio list
pnpm exec nerio info button
pnpm exec nerio search keyboard --limit 5
pnpm exec nerio view button --json
pnpm exec nerio docs button
pnpm exec nerio migrate config 0.1.0 1.0.0
pnpm exec nerio add button --dry-run
pnpm exec nerio add button card --dry-run
pnpm exec nerio add --all --dry-run --json
pnpm exec nerio add button
pnpm exec nerio remove button --dry-run
pnpm exec nerio diff button
pnpm exec nerio update button --dry-run
pnpm exec nerio doctor
```

Multiple explicit items and `--all` resolve one dependency union, preflight every target, and commit
source plus `nerio.lock.json` in one recoverable transaction. Add `--json` for the stable bounded
`1.0.0` add-result schema; use `--dry-run` to produce the same deterministic plan without writes.
Remove accepts direct items only and deletes just their unreferenced dependency closure. Shared
files remain installed with updated owners. Locally modified or ambiguous tracked source blocks the
whole operation unless `--force` explicitly authorizes each reported modified-file deletion.
`remove --json` uses its own bounded `1.0.0` result schema.

Search, view, and docs inspect validated immutable metadata without installing or fetching source.
Search is capped at 20 results by default or 50 explicitly; `--json` uses inspection schema `1.0.0`.

For a one-off command, use `pnpm dlx @nerio-ui/cli init`. A project-local installation is preferred
for repeatable, version-aligned updates.

See the [Registry and CLI documentation](https://nerio.vpavlov.com/docs/registry).

## License

MIT
