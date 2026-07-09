const path = require("node:path");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");

async function verify() {
  const client = new Client({ name: "nerio-mcp-fixture", version: "0.1.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [path.resolve(__dirname, "../src/server.js")],
  });

  try {
    await client.connect(transport);
    const listed = await client.listTools();
    const names = listed.tools.map((tool) => tool.name).sort();
    const expected = ["get_component", "get_component_usage", "list_components"];
    if (JSON.stringify(names) !== JSON.stringify(expected)) {
      throw new Error(`Unexpected MCP tools: ${names.join(", ")}`);
    }

    const result = await client.callTool({ name: "get_component", arguments: { name: "button" } });
    const payload = JSON.parse(result.content[0].text);
    if (payload.name !== "button" || payload.baseUiPrimitives[0] !== "button") {
      throw new Error("MCP get_component returned invalid Button metadata.");
    }

    const usageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "button" },
    });
    const usage = JSON.parse(usageResult.content[0].text);
    if (!usage.requiredTokens.includes("--n-button-height-md") || !usage.files.length) {
      throw new Error("MCP get_component_usage did not include install and token metadata.");
    }

    const tableUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "table" },
    });
    const tableUsage = JSON.parse(tableUsageResult.content[0].text);
    if (
      !tableUsage.requiredTokens.includes("--n-table-border") ||
      tableUsage.requiredTokens.includes("--n-font-size-sm") ||
      !tableUsage.usage.includes("TableHeader")
    ) {
      throw new Error("MCP Table usage is not aligned with the Core table registry contract.");
    }

    const progressUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "progress" },
    });
    const progressUsage = JSON.parse(progressUsageResult.content[0].text);
    if (
      !progressUsage.requiredTokens.includes("--n-progress-radius") ||
      !progressUsage.accessibility.some((item) => item.includes("accessible progressbar name"))
    ) {
      throw new Error("MCP Progress usage is missing accessible progress metadata.");
    }

    const listResult = await client.callTool({ name: "list_components", arguments: {} });
    const components = JSON.parse(listResult.content[0].text);
    for (const required of [
      "button",
      "dialog",
      "select",
      "tabs",
      "toast",
      "input",
      "field",
      "checkbox",
      "switch",
      "icon-button",
      "badge",
      "skeleton",
      "empty-state",
      "card",
      "avatar",
      "progress",
      "stat",
      "key-value",
      "table",
    ]) {
      if (!components.some((component) => component.name === required)) {
        throw new Error(`MCP list_components did not include ${required}.`);
      }
    }
  } finally {
    await client.close();
  }

  console.log("MCP fixture passed over the official stdio transport.");
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
