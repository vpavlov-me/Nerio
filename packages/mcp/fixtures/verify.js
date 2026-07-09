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

    const iconButtonUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "icon-button" },
    });
    const iconButtonUsage = JSON.parse(iconButtonUsageResult.content[0].text);
    if (
      !iconButtonUsage.registryDependencies.includes("button") ||
      !iconButtonUsage.requiredTokens.includes("--n-icon-button-size-sm") ||
      !iconButtonUsage.requiredTokens.includes("--n-icon-button-size-lg")
    ) {
      throw new Error(
        "MCP get_component_usage did not include IconButton dependency and size metadata.",
      );
    }

    const fieldUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "field" },
    });
    const fieldUsage = JSON.parse(fieldUsageResult.content[0].text);
    if (
      !fieldUsage.registryDependencies.includes("label") ||
      !fieldUsage.registryDependencies.includes("form-message") ||
      !fieldUsage.accessibility.some((item) => item.includes("aria-describedby"))
    ) {
      throw new Error(
        "MCP get_component_usage did not include Field dependency and aria metadata.",
      );
    }

    const selectUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "select" },
    });
    const selectUsage = JSON.parse(selectUsageResult.content[0].text);
    if (
      !selectUsage.requiredTokens.includes("--n-select-height-md") ||
      !selectUsage.requiredTokens.includes("--n-overlay-z-index") ||
      !selectUsage.accessibility.some((item) => item.includes("placeholder"))
    ) {
      throw new Error(
        "MCP get_component_usage did not include Select token and placeholder metadata.",
      );
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
