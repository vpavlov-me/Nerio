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

    const linkUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "link" },
    });
    const linkUsage = JSON.parse(linkUsageResult.content[0].text);
    if (
      !linkUsage.requiredTokens.includes("--n-link-color") ||
      linkUsage.baseUiPrimitives.length !== 0 ||
      !linkUsage.accessibility.some((item) => item.includes("native anchor"))
    ) {
      throw new Error("MCP Link usage is not aligned with the native anchor contract.");
    }

    const alertUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "alert" },
    });
    const alertUsage = JSON.parse(alertUsageResult.content[0].text);
    if (
      !alertUsage.requiredTokens.includes("--n-alert-padding") ||
      !alertUsage.variants.includes("warning") ||
      !alertUsage.files.some((file) => file.target === "components/icon.tsx")
    ) {
      throw new Error("MCP Alert usage is missing tone, token, or icon adapter metadata.");
    }

    const radioUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "radio-group" },
    });
    const radioUsage = JSON.parse(radioUsageResult.content[0].text);
    if (
      !radioUsage.baseUiPrimitives.includes("radio-group") ||
      !radioUsage.registryDependencies.includes("form-message") ||
      !radioUsage.requiredTokens.includes("--n-radio-size")
    ) {
      throw new Error("MCP RadioGroup usage is missing Base UI, dependency, or token metadata.");
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
      "link",
      "alert",
      "radio-group",
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
