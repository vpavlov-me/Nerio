# `@nerio-ui/cli`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fcli)](https://www.npmjs.com/package/@nerio-ui/cli)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fcli)](https://www.npmjs.com/package/@nerio-ui/cli)

Command-line tools for installing, inspecting, diffing, and safely updating editable Nerio source.
The prepared coordinated stable candidate is `1.0.0`; npm `latest` remains on `1.0.0-beta.1` until
approved publication.

## Install

```bash
pnpm add -D @nerio-ui/cli @nerio-ui/registry
```

## Use

```bash
pnpm exec nerio init
pnpm exec nerio list
pnpm exec nerio info button
pnpm exec nerio add button --dry-run
pnpm exec nerio add button
pnpm exec nerio diff button
pnpm exec nerio update button --dry-run
pnpm exec nerio doctor
```

For a one-off command, use `pnpm dlx @nerio-ui/cli init`. A project-local installation is preferred
for repeatable, version-aligned updates.

See the [Registry and CLI documentation](https://nerio.vpavlov.com/docs/registry).

## License

MIT
