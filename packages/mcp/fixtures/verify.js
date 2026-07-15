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

    const spinnerUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "spinner" },
    });
    const spinnerUsage = JSON.parse(spinnerUsageResult.content[0].text);
    if (
      !spinnerUsage.slots.includes("root") ||
      !spinnerUsage.slots.includes("label") ||
      !spinnerUsage.requiredTokens.includes("--n-spinner-duration") ||
      !spinnerUsage.accessibility.some((item) => item.includes("localized label"))
    ) {
      throw new Error("MCP Spinner usage is missing its status, anatomy, or token contract.");
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

    const typographyUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "typography" },
    });
    const typographyUsage = JSON.parse(typographyUsageResult.content[0].text);
    if (
      !typographyUsage.requiredTokens.includes("--n-font-sans-system") ||
      !typographyUsage.requiredTokens.includes("--n-font-sans-inter") ||
      !typographyUsage.requiredTokens.includes("--n-font-sans-space-grotesk") ||
      !typographyUsage.files.some((file) => file.target === "styles/tokens.css") ||
      !typographyUsage.accessibility.some((item) => item.includes("consuming product"))
    ) {
      throw new Error("MCP Typography usage is missing the preset token or install contract.");
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

    const inputGroupUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "input-group" },
    });
    const inputGroupUsage = JSON.parse(inputGroupUsageResult.content[0].text);
    if (
      !inputGroupUsage.registryDependencies.includes("input") ||
      !inputGroupUsage.slots.includes("input-group-addon") ||
      !inputGroupUsage.requiredTokens.includes("--n-input-addon-foreground") ||
      !inputGroupUsage.accessibility.some((item) => item.includes("keyboard accessible"))
    ) {
      throw new Error(
        "MCP InputGroup usage is missing composition, token, or accessibility metadata.",
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
      !tableUsage.requiredTokens.includes("--n-table-container-focus-ring") ||
      !tableUsage.requiredTokens.includes("--n-table-row-min-height") ||
      tableUsage.requiredTokens.includes("--n-font-size-sm") ||
      !tableUsage.usage.includes("TableCaption") ||
      !tableUsage.usage.includes("aria-labelledby") ||
      !tableUsage.slots.includes("footer") ||
      !tableUsage.accessibility.some((item) => item.includes("never nest scroll containers")) ||
      !tableUsage.accessibility.some((item) => item.includes("non-empty runtime string")) ||
      !tableUsage.accessibility.some((item) => item.includes('aria-current="false"'))
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
      !progressUsage.requiredTokens.includes("--n-progress-indeterminate-reduced-position") ||
      !progressUsage.slots.includes("track") ||
      !progressUsage.states.includes("indeterminate") ||
      !progressUsage.accessibility.some((item) =>
        item.includes("requires exactly one accessible name"),
      ) ||
      progressUsage.files.some((file) => file.target === "styles/feedback.css")
    ) {
      throw new Error(
        "MCP Progress usage is missing its dedicated style, state, token, or naming contract.",
      );
    }

    const buttonUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "button" },
    });
    const buttonUsage = JSON.parse(buttonUsageResult.content[0].text);
    if (
      !buttonUsage.requiredTokens.includes("--n-link-color") ||
      !buttonUsage.variants.includes("link") ||
      !buttonUsage.dependencies.includes("@nerio/adapters") ||
      !buttonUsage.accessibility.some((item) => item.includes("native anchor"))
    ) {
      throw new Error("MCP Button usage is not aligned with the native link contract.");
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
      !radioUsage.requiredTokens.includes("--n-radio-size") ||
      !radioUsage.slots.includes("option-description") ||
      !radioUsage.usage.includes("RadioGroupItem")
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
      !checkboxUsage.slots.includes("description") ||
      !checkboxUsage.requiredTokens.includes("--n-checkbox-radius") ||
      !checkboxUsage.requiredTokens.includes("--n-input-border-danger") ||
      !checkboxUsage.accessibility.some((item) => item.includes("aria-invalid")) ||
      !checkboxUsage.variants.includes("indeterminate")
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
      !switchUsage.slots.includes("description") ||
      !switchUsage.requiredTokens.includes("--n-switch-thumb-offset") ||
      !switchUsage.accessibility.some((item) => item.includes("immediate on/off settings")) ||
      !switchUsage.variants.includes("read-only")
    ) {
      throw new Error("MCP Switch usage is missing Base UI, dependency, or token metadata.");
    }

    const itemUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "item" },
    });
    const itemUsage = JSON.parse(itemUsageResult.content[0].text);
    if (
      !itemUsage.requiredTokens.includes("--n-item-gap") ||
      !itemUsage.accessibility.some((item) => item.includes("callback and object refs")) ||
      !itemUsage.usage.includes('render={<a href="/settings" />}')
    ) {
      throw new Error("MCP Item usage is missing composed-ref, token, or usage metadata.");
    }

    const listUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "list" },
    });
    const listUsage = JSON.parse(listUsageResult.content[0].text);
    if (
      !listUsage.requiredTokens.includes("--n-list-item-padding") ||
      !listUsage.accessibility.some((item) => item.includes("semantic ul")) ||
      !listUsage.accessibility.some((item) => item.includes("custom router link")) ||
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
      !tabsUsage.requiredTokens.includes("--n-tabs-trigger-height-md") ||
      !tabsUsage.requiredTokens.includes("--n-tabs-indicator-duration") ||
      !tabsUsage.accessibility.some((item) => item.includes("defaultValue")) ||
      !tabsUsage.usage.includes("TabsTrigger")
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
      !paginationUsage.accessibility.some((item) => item.includes("aria-disabled")) ||
      !paginationUsage.accessibility.some((item) => item.includes("static text")) ||
      !paginationUsage.accessibility.some((item) => item.includes("router adapters"))
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

    const sheetUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "sheet" },
    });
    const sheetUsage = JSON.parse(sheetUsageResult.content[0].text);
    if (
      !sheetUsage.slots.includes("sheet-content") ||
      !sheetUsage.slots.includes("sheet-close") ||
      !sheetUsage.variants.includes("side: left | right | top | bottom") ||
      !sheetUsage.requiredTokens.includes("--n-sheet-width-md") ||
      !sheetUsage.requiredTokens.includes("--n-sheet-backdrop") ||
      !sheetUsage.requiredTokens.includes("--n-overlay-shadow") ||
      !sheetUsage.requiredTokens.includes("--n-motion-overlay-enter-easing") ||
      !sheetUsage.requiredTokens.includes("--n-motion-overlay-exit-duration") ||
      !sheetUsage.requiredTokens.includes("--n-motion-overlay-exit-easing") ||
      !sheetUsage.accessibility.some((item) => item.includes("SheetTitle"))
    ) {
      throw new Error("MCP Sheet usage is missing its slots, side, token, or naming contract.");
    }

    const sidebarUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "sidebar-primitive" },
    });
    const sidebarUsage = JSON.parse(sidebarUsageResult.content[0].text);
    if (
      sidebarUsage.baseUiPrimitives.length !== 0 ||
      !sidebarUsage.slots.includes("sidebar-rail") ||
      !sidebarUsage.states.includes("collapsed") ||
      !sidebarUsage.variants.includes("side: left | right") ||
      !sidebarUsage.requiredTokens.includes("--n-sidebar-collapsed-width") ||
      !sidebarUsage.accessibility.some((item) => item.includes("inert")) ||
      !sidebarUsage.accessibility.some((item) => item.includes("hit-area")) ||
      !sidebarUsage.accessibility.some((item) => item.includes("HTMLDivElement ref")) ||
      !sidebarUsage.usage.includes("SidebarProvider")
    ) {
      throw new Error(
        "MCP Sidebar usage is missing state, slot, token, or accessibility metadata.",
      );
    }

    const commandUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "command-primitive" },
    });
    const commandUsage = JSON.parse(commandUsageResult.content[0].text);
    if (
      !commandUsage.baseUiPrimitives.includes("autocomplete") ||
      !commandUsage.registryDependencies.includes("spinner") ||
      !commandUsage.slots.includes("command-loading") ||
      !commandUsage.states.includes("active") ||
      !commandUsage.variants.includes("consumer-filtered") ||
      !commandUsage.requiredTokens.includes("--n-command-list-max-height") ||
      !commandUsage.requiredTokens.includes("--n-focus-ring") ||
      !commandUsage.accessibility.some((item) => item.includes("IME composition")) ||
      !commandUsage.accessibility.some((item) => item.includes("visible item label")) ||
      !commandUsage.accessibility.some((item) => item.includes("leading content")) ||
      !commandUsage.usage.includes("onSelect")
    ) {
      throw new Error(
        "MCP Command usage is missing Base UI, filtering, selection, token, or accessibility metadata.",
      );
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
      !toastUsage.registryDependencies.includes("button") ||
      !toastUsage.files.some((file) => file.target === "components/icon.tsx") ||
      !toastUsage.accessibility.some((item) => item.includes("icon-only dismissal use Button")) ||
      !toastUsage.accessibility.some((item) => item.includes("Timers pause")) ||
      !toastUsage.accessibility.some((item) => item.includes("first interactive render")) ||
      !toastUsage.requiredTokens.includes("--n-toast-viewport-inset") ||
      !toastUsage.requiredTokens.includes("--n-toast-enter-offset") ||
      !toastUsage.requiredTokens.includes("--n-toast-stack-scale-step") ||
      !toastUsage.accessibility.some((item) => item.includes("bottom-centered")) ||
      !toastUsage.usage.includes("ToastProvider")
    ) {
      throw new Error(
        "MCP Toast usage is missing its Button dependency, provider, lifecycle, viewport, icon, or managed anatomy metadata.",
      );
    }

    const buttonGroupUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "button-group" },
    });
    const buttonGroupUsage = JSON.parse(buttonGroupUsageResult.content[0].text);
    if (
      !buttonGroupUsage.variants.includes("orientation: horizontal | vertical") ||
      !buttonGroupUsage.accessibility.some((item) => item.includes("independent Tab order")) ||
      !buttonGroupUsage.files.some((file) => file.target === "styles/button-group.css")
    ) {
      throw new Error(
        "MCP ButtonGroup usage is missing stable orientation or accessibility metadata.",
      );
    }

    const listResult = await client.callTool({ name: "list_components", arguments: {} });
    const components = JSON.parse(listResult.content[0].text);
    for (const required of [
      "button",
      "button-group",
      "icon-button",
      "dialog",
      "sheet",
      "select",
      "tabs",
      "toast",
      "input",
      "input-group",
      "field",
      "form-group",
      "checkbox",
      "switch",
      "kbd",
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
