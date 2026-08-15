# `@nerio-ui/tokens`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Ftokens)](https://www.npmjs.com/package/@nerio-ui/tokens)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Ftokens)](https://www.npmjs.com/package/@nerio-ui/tokens)

Design tokens, themes, modes, density, typography recipes, and CSS variable contracts for Nerio
Core. The current coordinated release is `1.0.0-beta.1`.

## Install

```bash
pnpm add @nerio-ui/tokens
```

## Use

Import the canonical token values and the Tailwind CSS v4 bridge from the consuming application:

```css
@import "tailwindcss";
@import "@nerio-ui/tokens/styles.css";
@import "@nerio-ui/tokens/tailwind.css";
```

The package also exports the supported theme, mode, density, typography, and motion contracts from
`@nerio-ui/tokens`.

See [Getting started](https://nerio.vpavlov.com/docs/getting-started) and the
[token documentation](https://nerio.vpavlov.com/docs/foundations/tokens).

## License

MIT
