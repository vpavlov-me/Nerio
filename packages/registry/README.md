# `@nerio-ui/registry`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fregistry)](https://www.npmjs.com/package/@nerio-ui/registry)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fregistry)](https://www.npmjs.com/package/@nerio-ui/registry)

The immutable, version-aligned source registry for Nerio Core. The prepared coordinated stable
candidate is `1.0.0`; npm `latest` remains on `1.0.0-beta.1` until approved publication.

## Install

Install the Registry together with the CLI:

```bash
pnpm add -D @nerio-ui/registry @nerio-ui/cli
```

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

The package exports Registry metadata through `@nerio-ui/registry` and its immutable manifest at
`@nerio-ui/registry/manifest.json`.

See the [Registry documentation](https://nerio.vpavlov.com/docs/registry).

## License

MIT
