const path = require("node:path");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const manifest = require(path.resolve(__dirname, "../../registry/src/manifest.json"));

function serverCommand() {
  const commandIndex = process.argv.indexOf("--command");
  if (commandIndex < 0) {
    return {
      command: process.execPath,
      args: [path.resolve(__dirname, "../src/server.js")],
    };
  }

  const separatorIndex = process.argv.indexOf("--", commandIndex + 2);
  return {
    command: process.argv[commandIndex + 1],
    args: separatorIndex < 0 ? [] : process.argv.slice(separatorIndex + 1),
    env: process.env,
  };
}

function assertFileTargets(actual, expected, description) {
  const received = actual.map((file) => file.target).sort();
  const required = [...expected].sort();
  if (JSON.stringify(received) !== JSON.stringify(required)) {
    throw new Error(
      `${description} file targets drifted. Expected: ${required.join(", ")}. Received: ${received.join(", ")}.`,
    );
  }
}

function assertRegistryParity(name, usage, expectedFiles) {
  const item = manifest.items.find((candidate) => candidate.name === name);
  if (!item) {
    throw new Error(`Registry is missing ${name} for MCP source-install parity coverage.`);
  }
  assertFileTargets(
    usage.files,
    item.files.map((file) => file.target),
    `MCP ${name} Registry`,
  );
  assertFileTargets(usage.files, expectedFiles, `MCP ${name} source-install`);
}

async function verify() {
  const client = new Client({ name: "nerio-mcp-fixture", version: "0.1.0" });
  const transport = new StdioClientTransport(serverCommand());

  try {
    await client.connect(transport);
    const serverVersion = client.getServerVersion();
    if (serverVersion?.name !== "nerio-components" || serverVersion.version !== manifest.version) {
      throw new Error(
        `MCP server metadata drifted. Expected nerio-components ${manifest.version}; received ${serverVersion?.name ?? "unknown"} ${serverVersion?.version ?? "unknown"}.`,
      );
    }
    const listed = await client.listTools();
    const names = listed.tools.map((tool) => tool.name).sort();
    const expected = ["get_component", "get_component_usage", "get_registry", "list_components"];
    if (JSON.stringify(names) !== JSON.stringify(expected)) {
      throw new Error(`Unexpected MCP tools: ${names.join(", ")}`);
    }

    const registryResult = await client.callTool({ name: "get_registry", arguments: {} });
    const registry = JSON.parse(registryResult.content[0].text);
    if (
      registry.schemaVersion !== manifest.schemaVersion ||
      registry.version !== manifest.version ||
      registry.sourceRevision !== manifest.sourceRevision ||
      registry.styleContractVersion !== manifest.styleContractVersion
    ) {
      throw new Error("MCP Registry metadata drifted from the versioned manifest.");
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

    const motionUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "motion-adapter" },
    });
    const motionUsage = JSON.parse(motionUsageResult.content[0].text);
    if (
      motionUsage.docsPath !== "/docs/foundations/motion" ||
      !motionUsage.optionalPeerDependencies.includes("motion") ||
      !motionUsage.files.some((file) => file.target === "lib/motion-adapter.tsx") ||
      !motionUsage.requiredTokens.includes("--n-duration-normal")
    ) {
      throw new Error("MCP Motion Adapter usage is missing its optional-peer or token contract.");
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

    const inputUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "input" },
    });
    const inputUsage = JSON.parse(inputUsageResult.content[0].text);
    if (
      !inputUsage.variants.some((item) => item.includes("datetime-local")) ||
      !inputUsage.accessibility.some((item) => item.includes("browser-owned pickers")) ||
      !inputUsage.accessibility.some((item) => item.includes("valueAsDate"))
    ) {
      throw new Error("MCP Input usage is missing the native temporal contract.");
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
    if (!buttonUsage.files.some((file) => file.target === "styles/tokens.css")) {
      throw new Error("MCP Button usage is missing the source-install token stylesheet.");
    }
    if (
      !buttonUsage.requiredTokens.includes("--n-link-color") ||
      !buttonUsage.variants.includes("link") ||
      !buttonUsage.dependencies.includes("@nerio-ui/adapters") ||
      !buttonUsage.accessibility.some((item) => item.includes("native anchor"))
    ) {
      throw new Error("MCP Button usage is not aligned with the native link contract.");
    }

    const sourceInstallContracts = {
      avatar: [
        "components/avatar.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      card: [
        "components/card.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      "key-value": [
        "components/key-value.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      separator: [
        "components/separator.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      stat: [
        "components/stat.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      table: [
        "components/table.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      item: [
        "components/item.tsx",
        "lib/cn.ts",
        "lib/compose-refs.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      list: [
        "components/list.tsx",
        "lib/cn.ts",
        "lib/compose-refs.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      "empty-state": [
        "components/empty-state.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      skeleton: [
        "components/skeleton.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/feedback.css",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      spinner: [
        "components/spinner.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/spinner.css",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
      progress: [
        "components/progress.tsx",
        "lib/cn.ts",
        "lib/tailwind-cn.ts",
        "styles/progress.css",
        "styles/tailwind.css",
        "styles/tokens.css",
      ],
    };
    for (const [name, expectedFiles] of Object.entries(sourceInstallContracts)) {
      const result = await client.callTool({ name: "get_component_usage", arguments: { name } });
      assertRegistryParity(name, JSON.parse(result.content[0].text), expectedFiles);
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
      switchUsage.dependencies.includes("@nerio-ui/adapters") ||
      !switchUsage.slots.includes("description") ||
      !switchUsage.requiredTokens.includes("--n-switch-thumb-offset") ||
      !switchUsage.accessibility.some((item) => item.includes("immediate on/off settings")) ||
      !switchUsage.variants.includes("read-only")
    ) {
      throw new Error("MCP Switch usage is missing Base UI, dependency, or token metadata.");
    }

    const sliderUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "slider" },
    });
    const sliderUsage = JSON.parse(sliderUsageResult.content[0].text);
    assertRegistryParity("slider", sliderUsage, [
      "components/slider.tsx",
      "lib/cn.ts",
      "lib/compose-refs.ts",
      "lib/motion.ts",
      "lib/resolve-class-name.ts",
      "lib/tailwind-cn.ts",
      "styles/tailwind.css",
      "styles/tokens.css",
    ]);
    if (
      !sliderUsage.baseUiPrimitives.includes("slider") ||
      !sliderUsage.slots.includes("thumb") ||
      !sliderUsage.variants.includes("vertical") ||
      !sliderUsage.requiredTokens.includes("--n-slider-focus-ring") ||
      !sliderUsage.accessibility.some((item) => item.includes("exactly one accessible name")) ||
      !sliderUsage.accessibility.some((item) => item.includes("intentionally rejecting arrays"))
    ) {
      throw new Error(
        "MCP Slider usage is missing single-value, accessibility, or token metadata.",
      );
    }

    const fileInputUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "file-input" },
    });
    const fileInputUsage = JSON.parse(fileInputUsageResult.content[0].text);
    assertRegistryParity("file-input", fileInputUsage, [
      "components/file-input.tsx",
      "lib/cn.ts",
      "lib/motion.ts",
      "lib/tailwind-cn.ts",
      "styles/motion.css",
      "styles/tailwind.css",
      "styles/tokens.css",
    ]);
    if (
      fileInputUsage.baseUiPrimitives.length !== 0 ||
      !fileInputUsage.slots.includes("file-input") ||
      !fileInputUsage.variants.includes("multiple") ||
      !fileInputUsage.requiredTokens.includes("--n-file-input-button-background") ||
      !fileInputUsage.accessibility.some((item) => item.includes("FileList")) ||
      !fileInputUsage.accessibility.some((item) => item.includes("rejects controlled value"))
    ) {
      throw new Error("MCP FileInput usage is missing native selection or token metadata.");
    }

    const calendarUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "calendar" },
    });
    const calendarUsage = JSON.parse(calendarUsageResult.content[0].text);
    assertRegistryParity("calendar", calendarUsage, [
      "components/calendar.tsx",
      "lib/cn.ts",
      "lib/compose-refs.ts",
      "lib/tailwind-cn.ts",
      "styles/tailwind.css",
      "styles/tokens.css",
    ]);
    if (
      calendarUsage.baseUiPrimitives.length !== 0 ||
      !calendarUsage.registryDependencies.includes("button") ||
      !calendarUsage.slots.includes("day") ||
      !calendarUsage.states.includes("unavailable") ||
      !calendarUsage.requiredTokens.includes("--n-calendar-day-background-selected") ||
      !calendarUsage.accessibility.some((item) => item.includes("YYYY-MM-DD")) ||
      !calendarUsage.accessibility.some((item) => item.includes("Shift plus Page"))
    ) {
      throw new Error("MCP Calendar usage is missing ISO, grid, keyboard, or token metadata.");
    }

    const datePickerUsageResult = await client.callTool({
      name: "get_component_usage",
      arguments: { name: "date-picker" },
    });
    const datePickerUsage = JSON.parse(datePickerUsageResult.content[0].text);
    assertRegistryParity("date-picker", datePickerUsage, ["components/date-picker.tsx"]);
    if (
      !datePickerUsage.baseUiPrimitives.includes("popover") ||
      !datePickerUsage.registryDependencies.includes("calendar") ||
      !datePickerUsage.registryDependencies.includes("field") ||
      !datePickerUsage.registryDependencies.includes("popover") ||
      !datePickerUsage.slots.includes("form-control") ||
      !datePickerUsage.states.includes("required") ||
      !datePickerUsage.requiredTokens.includes("--n-calendar-day-background-selected") ||
      !datePickerUsage.accessibility.some((item) => item.includes("YYYY-MM-DD")) ||
      !datePickerUsage.accessibility.some((item) => item.includes("restore focus"))
    ) {
      throw new Error("MCP DatePicker usage is missing ISO, form, focus, or token metadata.");
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
      !dialogUsage.dependencies.includes("@nerio-ui/adapters") ||
      !dialogUsage.accessibility.some(
        (item) => item.includes("Close dialog") && item.includes("localized accessible name"),
      )
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
      !toastUsage.dependencies.includes("@nerio-ui/adapters") ||
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
      !buttonGroupUsage.files.some((file) => file.target === "lib/tailwind-cn.ts") ||
      !buttonGroupUsage.files.some((file) => file.target === "styles/tailwind.css")
    ) {
      throw new Error(
        "MCP ButtonGroup usage is missing stable orientation or accessibility metadata.",
      );
    }

    const listResult = await client.callTool({ name: "list_components", arguments: {} });
    const components = JSON.parse(listResult.content[0].text);
    for (const required of [
      "button",
      "motion-adapter",
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
