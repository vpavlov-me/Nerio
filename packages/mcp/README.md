# `@nerio-ui/mcp`

[![npm version](https://img.shields.io/npm/v/%40nerio-ui%2Fmcp)](https://www.npmjs.com/package/@nerio-ui/mcp)
[![npm downloads](https://img.shields.io/npm/dw/%40nerio-ui%2Fmcp)](https://www.npmjs.com/package/@nerio-ui/mcp)

Read-only Model Context Protocol server for Nerio component and Registry discovery. The prepared
coordinated stable candidate is `1.0.0`; npm `latest` remains on `1.0.0-beta.1` until approved
publication.

## Install

```bash
pnpm add -D @nerio-ui/mcp
```

Configure an MCP client to run the package-local binary:

```json
{
  "command": "pnpm",
  "args": ["exec", "nerio-mcp"]
}
```

For package-qualified one-off execution, use `pnpm dlx @nerio-ui/mcp`. The server exposes read-only
tools with structured output for package, Registry, component, and composition discovery.

See the [AI documentation](https://nerio.vpavlov.com/docs/ai).

## License

MIT
