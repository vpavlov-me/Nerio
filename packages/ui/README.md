# `@nerio-ui/ui`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fui)](https://www.npmjs.com/package/@nerio-ui/ui)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fui)](https://www.npmjs.com/package/@nerio-ui/ui)

Accessible React components, utilities, and styles for Nerio Core. The current coordinated release
is `1.0.0-beta.1`.

## Install

```bash
pnpm add @nerio-ui/ui @nerio-ui/tokens @nerio-ui/adapters
```

## Use

```tsx
import { Alert, Card, Field, Table } from "@nerio-ui/ui";
import { Button, Dialog, Select, ToastProvider } from "@nerio-ui/ui/client";
import "@nerio-ui/ui/styles.css";
```

The default entrypoint is server-safe. Interactive Base UI-backed components live under
`@nerio-ui/ui/client`. Nerio ships unbundled JavaScript, declarations, and Tailwind CSS v4 recipes,
so supported Next.js applications consume the exports without `transpilePackages` and register the
compiled package output as shown in
[Getting started](https://nerio.vpavlov.com/docs/getting-started).

Browse the complete [component documentation](https://nerio.vpavlov.com/docs/components/button).

## License

MIT
