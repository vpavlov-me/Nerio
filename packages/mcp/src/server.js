#!/usr/bin/env node
const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const { z } = require("zod");
const mcpPackage = require("../package.json");
const {
  NerioMcpError,
  get_component,
  get_component_usage,
  get_registry,
  list_components,
} = require("./tool-runtime.js");

const server = new McpServer({ name: "nerio-components", version: mcpPackage.version });
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true };
const errorSchema = z.object({
  code: z.enum(["COMPONENT_NOT_FOUND", "INTERNAL_ERROR"]),
  message: z.string(),
});
const componentSummarySchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
});
const registrySchema = z.object({
  schemaVersion: z.string(),
  name: z.string(),
  version: z.string(),
  sourceRevision: z.string(),
  styleContractVersion: z.string(),
});
const registryFileSchema = z.object({
  source: z.string(),
  target: z.string(),
  role: z.string(),
  integrity: z.string(),
});
const componentSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  docsPath: z.string().optional(),
  usage: z.string(),
  dependencies: z.array(z.string()),
  optionalPeerDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()),
  files: z.array(registryFileSchema),
  baseUiPrimitives: z.array(z.string()),
  slots: z.array(z.string()),
  variants: z.array(z.string()),
  states: z.array(z.string()).optional(),
  requiredTokens: z.array(z.string()),
  accessibility: z.array(z.string()),
});

function structuredResult(key, value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    structuredContent: { [key]: value },
  };
}

function errorResult(error) {
  const payload = {
    error: {
      code: error instanceof NerioMcpError ? error.code : "INTERNAL_ERROR",
      message: error instanceof NerioMcpError ? error.message : "Unexpected MCP tool failure.",
    },
  };
  return {
    isError: true,
    content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
    structuredContent: payload,
  };
}

async function safeResult(key, operation) {
  try {
    return structuredResult(key, operation());
  } catch (error) {
    return errorResult(error);
  }
}

server.registerTool(
  "list_components",
  {
    title: "List Nerio components",
    description: "List components available in the Nerio source registry.",
    outputSchema: {
      components: z.array(componentSummarySchema).optional(),
      error: errorSchema.optional(),
    },
    annotations: readOnly,
  },
  async () => safeResult("components", list_components),
);

server.registerTool(
  "get_registry",
  {
    title: "Get the Nerio Registry version",
    description:
      "Read the Registry schema, release version, exact source revision, and style contract version.",
    outputSchema: { registry: registrySchema.optional(), error: errorSchema.optional() },
    annotations: readOnly,
  },
  async () => safeResult("registry", get_registry),
);

server.registerTool(
  "get_component",
  {
    title: "Get a Nerio component",
    description: "Read full registry metadata for one Nerio component.",
    inputSchema: { name: z.string().min(1) },
    outputSchema: { component: componentSchema.optional(), error: errorSchema.optional() },
    annotations: readOnly,
  },
  async ({ name }) => safeResult("component", () => get_component(name)),
);

server.registerTool(
  "get_component_usage",
  {
    title: "Get Nerio component usage",
    description:
      "Read usage, install files, tokens, primitives, variants, slots, and accessibility guidance.",
    inputSchema: { name: z.string().min(1) },
    outputSchema: { usage: componentSchema.optional(), error: errorSchema.optional() },
    annotations: readOnly,
  },
  async ({ name }) => safeResult("usage", () => get_component_usage(name)),
);

async function main() {
  await server.connect(new StdioServerTransport());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
