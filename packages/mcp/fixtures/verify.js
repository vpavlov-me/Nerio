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

    const kbdUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "kbd" },
    });
    const kbdUsage = JSON.parse(kbdUsageResult.content[0].text);
    if (
      !kbdUsage.requiredTokens.includes("--n-kbd-background") ||
      !kbdUsage.requiredTokens.includes("--n-kbd-foreground")
    ) {
      throw new Error("MCP get_component_usage did not include Kbd token metadata.");
    }

    const cardUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "card" },
    });
    const cardUsage = JSON.parse(cardUsageResult.content[0].text);
    if (
      !cardUsage.slots.includes("card-visual") ||
      !cardUsage.slots.includes("card-action") ||
      !cardUsage.requiredTokens.includes("--n-card-padding-inline")
    ) {
      throw new Error("MCP Card usage is missing the visual, action, or spacing contract.");
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
      !alertUsage.files.some((file) => file.target === "components/icon.tsx") ||
      !alertUsage.accessibility.some((item) => item.includes("do not announce by default"))
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

    const formGroupUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "form-group" },
    });
    const formGroupUsage = JSON.parse(formGroupUsageResult.content[0].text);
    if (
      formGroupUsage.baseUiPrimitives.length !== 0 ||
      !formGroupUsage.registryDependencies.includes("form-message") ||
      !formGroupUsage.requiredTokens.includes("--n-form-group-gap") ||
      !formGroupUsage.accessibility.some((item) => item.includes("fieldset"))
    ) {
      throw new Error("MCP FormGroup usage is missing native, dependency, or token metadata.");
    }

    const checkboxUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "checkbox" },
    });
    const checkboxUsage = JSON.parse(checkboxUsageResult.content[0].text);
    if (
      !checkboxUsage.baseUiPrimitives.includes("checkbox") ||
      !checkboxUsage.requiredTokens.includes("--n-checkbox-radius") ||
      !checkboxUsage.requiredTokens.includes("--n-input-border-danger") ||
      !checkboxUsage.accessibility.some((item) => item.includes("aria-invalid"))
    ) {
      throw new Error("MCP Checkbox usage is missing Base UI, invalid, or token metadata.");
    }

    const switchUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "switch" },
    });
    const switchUsage = JSON.parse(switchUsageResult.content[0].text);
    if (
      !switchUsage.baseUiPrimitives.includes("switch") ||
      switchUsage.dependencies.includes("@nerio/adapters") ||
      !switchUsage.requiredTokens.includes("--n-switch-thumb-offset") ||
      !switchUsage.accessibility.some((item) => item.includes("immediate on/off settings"))
    ) {
      throw new Error("MCP Switch usage is missing Base UI, dependency, or token metadata.");
    }

    const listUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "list" },
    });
    const listUsage = JSON.parse(listUsageResult.content[0].text);
    if (
      !listUsage.requiredTokens.includes("--n-list-item-padding") ||
      !listUsage.accessibility.some((item) => item.includes("semantic ul")) ||
      !listUsage.usage.includes("<List")
    ) {
      throw new Error("MCP List usage is missing semantic list, token, or usage metadata.");
    }

    const tabsUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "tabs" },
    });
    const tabsUsage = JSON.parse(tabsUsageResult.content[0].text);
    if (
      !tabsUsage.baseUiPrimitives.includes("tabs") ||
      !tabsUsage.requiredTokens.includes("--n-tabs-trigger-height") ||
      !tabsUsage.requiredTokens.includes("--n-motion-hover-duration") ||
      !tabsUsage.accessibility.some((item) => item.includes("first enabled tab"))
    ) {
      throw new Error("MCP Tabs usage is missing Base UI, token, or accessibility metadata.");
    }

    const breadcrumbsUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "breadcrumbs" },
    });
    const breadcrumbsUsage = JSON.parse(breadcrumbsUsageResult.content[0].text);
    if (
      breadcrumbsUsage.baseUiPrimitives.length !== 0 ||
      !breadcrumbsUsage.requiredTokens.includes("--n-breadcrumbs-gap") ||
      !breadcrumbsUsage.accessibility.some((item) => item.includes("aria-current"))
    ) {
      throw new Error("MCP Breadcrumbs usage is missing native, token, or current-page metadata.");
    }

    const paginationUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "pagination" },
    });
    const paginationUsage = JSON.parse(paginationUsageResult.content[0].text);
    if (
      paginationUsage.baseUiPrimitives.length !== 0 ||
      !paginationUsage.requiredTokens.includes("--n-pagination-item-size") ||
      !paginationUsage.accessibility.some((item) => item.includes("aria-disabled"))
    ) {
      throw new Error("MCP Pagination usage is missing native, token, or disabled metadata.");
    }

    const dialogUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "dialog" },
    });
    const dialogUsage = JSON.parse(dialogUsageResult.content[0].text);
    if (
      !dialogUsage.requiredTokens.includes("--n-dialog-width-md") ||
      !dialogUsage.requiredTokens.includes("--n-motion-overlay-enter-duration") ||
      !dialogUsage.dependencies.includes("@nerio/adapters") ||
      !dialogUsage.accessibility.some((item) => item.includes("Close dialog"))
    ) {
      throw new Error("MCP Dialog usage is missing overlay, adapter, or close metadata.");
    }

    const tooltipUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "tooltip" },
    });
    const tooltipUsage = JSON.parse(tooltipUsageResult.content[0].text);
    if (
      !tooltipUsage.requiredTokens.includes("--n-overlay-background") ||
      !tooltipUsage.requiredTokens.includes("--n-overlay-foreground")
    ) {
      throw new Error("MCP Tooltip usage is missing overlay token metadata.");
    }

    const dropdownUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "dropdown-menu" },
    });
    const dropdownUsage = JSON.parse(dropdownUsageResult.content[0].text);
    if (
      !dropdownUsage.requiredTokens.includes("--n-dropdown-min-width") ||
      !dropdownUsage.accessibility.some((item) => item.includes("Disabled items")) ||
      !dropdownUsage.accessibility.some((item) => item.includes("destructive"))
    ) {
      throw new Error("MCP DropdownMenu usage is missing disabled/destructive metadata.");
    }

    const toastUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "toast" },
    });
    const toastUsage = JSON.parse(toastUsageResult.content[0].text);
    if (
      !toastUsage.dependencies.includes("@nerio/adapters") ||
      !toastUsage.files.some((file) => file.target === "components/icon.tsx") ||
      !toastUsage.accessibility.some((item) => item.includes("Static Toast content is separate")) ||
      !toastUsage.usage.includes("ToastProvider")
    ) {
      throw new Error(
        "MCP Toast usage is missing provider, icon, or static/managed anatomy metadata.",
      );
    }

    const listResult = await client.callTool({ name: "list_components", arguments: {} });
    const components = JSON.parse(listResult.content[0].text);
    for (const required of [
      "button",
      "icon-button",
      "dialog",
      "select",
      "tabs",
      "toast",
      "input",
      "field",
      "form-group",
      "checkbox",
      "switch",
      "kbd",
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
      "list",
      "breadcrumbs",
      "pagination",
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
