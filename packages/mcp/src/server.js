#!/usr/bin/env node
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const {
  get_component,
  get_component_usage,
  get_registry,
  list_components,
} = require("./tool-runtime.js");

const server = new McpServer({ name: "nerio-components", version: "0.1.0" });
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true };

function textResult(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
  };
}

server.registerTool(
  "list_components",
  {
    title: "List Nerio components",
    description: "List components available in the Nerio source registry.",
    annotations: readOnly,
  },
  async () => textResult(list_components()),
);

server.registerTool(
  "get_registry",
  {
    title: "Get the Nerio Registry version",
    description:
      "Read the Registry schema, release version, exact source revision, and style contract version.",
    annotations: readOnly,
  },
  async () => textResult(get_registry()),
);

server.registerTool(
  "get_component",
  {
    title: "Get a Nerio component",
    description: "Read full registry metadata for one Nerio component.",
    inputSchema: { name: z.string().min(1) },
    annotations: readOnly,
  },
  async ({ name }) => textResult(get_component(name)),
);

server.registerTool(
  "get_component_usage",
  {
    title: "Get Nerio component usage",
    description:
      "Read usage, install files, tokens, primitives, variants, slots, and accessibility guidance.",
    inputSchema: { name: z.string().min(1) },
    annotations: readOnly,
  },
  async ({ name }) => textResult(get_component_usage(name)),
);

async function main() {
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
