# `@nerio-ui/adapters`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fadapters)](https://www.npmjs.com/package/@nerio-ui/adapters)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fadapters)](https://www.npmjs.com/package/@nerio-ui/adapters)

Responsibility-scoped adapters for Nerio Core. The current coordinated release is
`1.0.0-beta.1`.

## Install

```bash
pnpm add @nerio-ui/adapters
```

## Use

The package intentionally has no aggregating root entrypoint. Import only the integration you use:

```tsx
import { Settings } from "@nerio-ui/adapters/icons";
import type { IconComponent } from "@nerio-ui/adapters/icons";
```

Available subpaths are `icons`, `table`, `charts`, `forms`, `schema`, and the client-only `motion`
adapter. Optional integrations require only their matching peer dependency.

See [Getting started](https://nerio.vpavlov.com/docs/getting-started) and the
[icon documentation](https://nerio.vpavlov.com/docs/foundations/icons).

## License

MIT
