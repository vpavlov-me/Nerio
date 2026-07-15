const fs = require("node:fs");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "../../..");
const cli = path.resolve(__dirname, "../src/index.js");
const manifest = path.resolve(repoRoot, "packages/registry/src/manifest.json");
const expectedFiles = [
  "components/button.tsx",
  "components/icon.tsx",
  "components/kbd.tsx",
  "components/spinner.tsx",
  "components/tooltip.tsx",
  "lib/cn.ts",
  "lib/motion.ts",
  "styles/button.css",
  "styles/icon.css",
  "styles/kbd.css",
  "styles/motion.css",
  "styles/overlays.css",
  "styles/spinner.css",
];
const expectedDialogFiles = [...expectedFiles, "components/dialog.tsx", "styles/overlays.css"];
const expectedSheetFiles = [
  ...expectedFiles,
  "components/button.tsx",
  "components/icon.tsx",
  "components/sheet.tsx",
  "lib/cn.ts",
  "styles/icon.css",
  "styles/overlays.css",
];
const expectedSidebarFiles = [
  "components/icon.tsx",
  "components/sidebar-layout.tsx",
  "components/sidebar.tsx",
  "lib/cn.ts",
  "lib/compose-refs.ts",
  "styles/icon.css",
  "styles/sidebar.css",
];
const expectedCommandFiles = [
  "components/command.tsx",
  "components/icon.tsx",
  "components/spinner.tsx",
  "lib/cn.ts",
  "lib/resolve-class-name.ts",
  "styles/command.css",
  "styles/icon.css",
  "styles/spinner.css",
];
const expectedFieldFiles = [
  "components/field.tsx",
  "components/label.tsx",
  "components/form-message.tsx",
  "lib/cn.ts",
  "styles/forms.css",
];
const expectedInputGroupFiles = [
  "components/input.tsx",
  "components/input-group.tsx",
  "lib/cn.ts",
  "lib/motion.ts",
  "styles/forms.css",
  "styles/input-group.css",
  "styles/motion.css",
];
const expectedFormGroupFiles = [
  "components/form-group.tsx",
  "components/form-message.tsx",
  "lib/cn.ts",
  "styles/forms.css",
];
const expectedBaseFormFiles = [
  "components/checkbox.tsx",
  "components/icon.tsx",
  "components/switch.tsx",
  "lib/cn.ts",
  "lib/resolve-class-name.ts",
  "styles/forms.css",
  "styles/icon.css",
];
const expectedSelectFiles = [
  "components/select.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "lib/resolve-class-name.ts",
  "styles/forms.css",
  "styles/select.css",
  "styles/icon.css",
];
const expectedPhase2BFiles = [
  "components/alert.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/radio-group.tsx",
  "lib/cn.ts",
  "lib/resolve-class-name.ts",
  "styles/feedback.css",
  "styles/forms.css",
  "styles/icon.css",
];
const expectedDisplayFiles = [
  "components/avatar.tsx",
  "components/card.tsx",
  "components/key-value.tsx",
  "components/list.tsx",
  "components/separator.tsx",
  "components/stat.tsx",
  "components/table.tsx",
  "lib/cn.ts",
  "styles/display.css",
];
const expectedNavigationFiles = [
  "components/breadcrumbs.tsx",
  "components/pagination.tsx",
  "lib/cn.ts",
  "styles/navigation.css",
];
const expectedFeedbackFiles = [
  "components/empty-state.tsx",
  "components/skeleton.tsx",
  "components/spinner.tsx",
  "lib/cn.ts",
  "styles/feedback.css",
  "styles/spinner.css",
];
const expectedProgressFiles = ["components/progress.tsx", "lib/cn.ts", "styles/progress.css"];
const expectedOverlayAndTabsFiles = [
  "components/dialog.tsx",
  "components/dropdown-menu.tsx",
  "components/icon.tsx",
  "components/popover.tsx",
  "components/tabs.tsx",
  "components/toast.tsx",
  "components/tooltip.tsx",
  "lib/cn.ts",
  "lib/motion.ts",
  "styles/icon.css",
  "styles/motion.css",
  "styles/overlays.css",
  "styles/tabs.css",
  "styles/toast.css",
];

function run(cwd, ...args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], { cwd, stdio: "pipe" });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`nerio ${args.join(" ")} failed:\n${output}`));
    });
  });
}

function assertFiles(target, files) {
  for (const file of files) {
    if (!fs.existsSync(path.join(target, "components/nerio", file))) {
      throw new Error(`Missing installed file: ${file}`);
    }
  }
}

function assertInstall(target, files = expectedFiles) {
  assertFiles(target, files);

  const source = fs.readFileSync(
    path.join(target, "components/nerio/components/button.tsx"),
    "utf8",
  );
  if (!source.includes("BaseButton") || source.includes("BaseCheckbox")) {
    throw new Error("Installed Button source is not scoped to its direct dependencies.");
  }
}

function startRegistryServer() {
  const server = http.createServer((request, response) => {
    const requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const filePath = path.resolve(repoRoot, `.${requestedPath}`);
    if (!filePath.startsWith(`${repoRoot}${path.sep}`) || !fs.existsSync(filePath)) {
      response.writeHead(404).end("Not found");
      return;
    }
    response.writeHead(200, {
      "content-type": filePath.endsWith(".json") ? "application/json" : "text/plain",
    });
    fs.createReadStream(filePath).pipe(response);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      resolve({
        server,
        manifestUrl: `http://127.0.0.1:${address.port}/packages/registry/src/manifest.json`,
      });
    });
  });
}

async function verify() {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "nerio-cli-"));
  const localTarget = path.join(tempRoot, "local");
  const urlTarget = path.join(tempRoot, "url");
  fs.mkdirSync(localTarget);
  fs.mkdirSync(urlTarget);

  const { server, manifestUrl } = await startRegistryServer();
  try {
    await run(localTarget, "init", "--registry", manifest);
    await run(localTarget, "doctor");
    const helpOutput = await run(localTarget, "--help");
    if (!helpOutput.includes("nerio list") || !helpOutput.includes("nerio info")) {
      throw new Error("Help output does not include list and info commands.");
    }
    const addHelpOutput = await run(localTarget, "add", "--help");
    if (!addHelpOutput.includes("nerio add <component>") || !addHelpOutput.includes("--dry-run")) {
      throw new Error("Add help output does not describe the source install options.");
    }
    const listOutput = await run(localTarget, "list");
    if (
      !listOutput.includes("button\tButton\tactions") ||
      !listOutput.includes("icon-button\tIconButton\tactions") ||
      !listOutput.includes("alert\tAlert\tfeedback") ||
      !listOutput.includes("breadcrumbs\tBreadcrumbs\tnavigation")
    ) {
      throw new Error("List output did not include registry component name, title, and category.");
    }
    const infoOutput = await run(localTarget, "info", "button");
    if (
      !infoOutput.includes("Button (button)") ||
      !infoOutput.includes("Dependencies:") ||
      !infoOutput.includes("Registry dependencies: spinner, tooltip, kbd, badge") ||
      !infoOutput.includes("@nerio/adapters") ||
      !infoOutput.includes("Required tokens:") ||
      !infoOutput.includes("Usage:") ||
      !infoOutput.includes('<Button icon={Settings} aria-label="Workspace settings"')
    ) {
      throw new Error("Info output did not include the expected registry metadata.");
    }
    const cardInfoOutput = await run(localTarget, "info", "card");
    if (!cardInfoOutput.includes("--n-card-padding-inline")) {
      throw new Error("Card registry metadata did not include the spacing contract.");
    }
    const typographyInfoOutput = await run(localTarget, "info", "typography");
    if (
      !typographyInfoOutput.includes("--n-font-sans-system") ||
      !typographyInfoOutput.includes("styles/tokens.css") ||
      !typographyInfoOutput.includes("consumer-loaded Geist, Inter, IBM Plex")
    ) {
      throw new Error("Typography registry metadata did not include the preset token contract.");
    }
    const dryRunOutput = await run(localTarget, "add", "input", "--dry-run");
    if (
      !dryRunOutput.includes("Would add Input") ||
      !dryRunOutput.includes("components/input.tsx")
    ) {
      throw new Error("Dry run output did not describe the input install plan.");
    }
    const inputGroupDryRunOutput = await run(localTarget, "add", "input-group", "--dry-run");
    if (
      !inputGroupDryRunOutput.includes("Would add InputGroup") ||
      !inputGroupDryRunOutput.includes("components/input-group.tsx")
    ) {
      throw new Error("Dry run output did not describe the InputGroup install plan.");
    }
    const buttonGroupInfoOutput = await run(localTarget, "info", "button-group");
    if (
      !buttonGroupInfoOutput.includes("orientation: horizontal | vertical") ||
      !buttonGroupInfoOutput.includes("independent Tab order") ||
      !buttonGroupInfoOutput.includes("styles/button-group.css")
    ) {
      throw new Error(
        "ButtonGroup registry metadata did not include the stable orientation contract.",
      );
    }
    await run(localTarget, "add", "button");
    await run(localTarget, "add", "typography");
    await run(localTarget, "add", "button-group");
    await run(localTarget, "add", "icon-button");
    await run(localTarget, "add", "button");
    await run(localTarget, "add", "dialog");
    await run(localTarget, "add", "sheet");
    await run(localTarget, "add", "sidebar-primitive");
    await run(localTarget, "add", "command-primitive");
    await run(localTarget, "add", "field");
    await run(localTarget, "add", "input-group");
    await run(localTarget, "add", "form-group");
    await run(localTarget, "add", "checkbox");
    await run(localTarget, "add", "switch");
    await run(localTarget, "add", "select");
    await run(localTarget, "add", "alert");
    await run(localTarget, "add", "radio-group");
    await run(localTarget, "add", "avatar");
    await run(localTarget, "add", "key-value");
    await run(localTarget, "add", "separator");
    await run(localTarget, "add", "stat");
    await run(localTarget, "add", "table");
    await run(localTarget, "add", "item");
    await run(localTarget, "add", "list");
    await run(localTarget, "add", "progress");
    await run(localTarget, "add", "skeleton");
    await run(localTarget, "add", "spinner");
    await run(localTarget, "add", "empty-state");
    await run(localTarget, "add", "tabs");
    await run(localTarget, "add", "breadcrumbs");
    await run(localTarget, "add", "pagination");
    await run(localTarget, "add", "popover");
    await run(localTarget, "add", "dropdown-menu");
    await run(localTarget, "add", "tooltip");
    await run(localTarget, "add", "toast");
    assertInstall(localTarget);
    const installedIconSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/icon.tsx"),
      "utf8",
    );
    if (
      !installedIconSource.includes('from "@nerio/adapters/icons"') ||
      installedIconSource.includes("@/") ||
      !installedIconSource.includes("lucideAbsoluteStrokeWidth") ||
      !installedIconSource.includes("focusable={false}") ||
      installedIconSource.indexOf("{...svgProps}") >
        installedIconSource.indexOf("aria-hidden={decorative ? true : undefined}")
    ) {
      throw new Error(
        "Installed Icon source is missing its adapter, Lucide isolation, or protected accessibility contract.",
      );
    }
    assertFiles(localTarget, [
      "components/typography.tsx",
      "styles/typography.css",
      "styles/tokens.css",
    ]);
    const installedTypographyTokens = fs.readFileSync(
      path.join(localTarget, "components/nerio/styles/tokens.css"),
      "utf8",
    );
    if (!installedTypographyTokens.includes(".n-typography-inter")) {
      throw new Error("Installed Typography token stylesheet is missing the Inter recipe.");
    }
    assertInstall(localTarget, expectedDialogFiles);
    assertFiles(localTarget, expectedSheetFiles);
    const sheetSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/sheet.tsx"),
      "utf8",
    );
    if (
      !sheetSource.includes("BaseDialog.Root") ||
      !sheetSource.includes('data-slot="sheet-content"') ||
      !sheetSource.includes("showClose") ||
      !sheetSource.includes('className="n-sheet__close-icon"') ||
      sheetSource.includes('cn("n-sheet__close"')
    ) {
      throw new Error("Installed Sheet source did not preserve its modal and slot contracts.");
    }
    assertFiles(localTarget, expectedSidebarFiles);
    const sidebarSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/sidebar.tsx"),
      "utf8",
    );
    const sidebarLayoutSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/sidebar-layout.tsx"),
      "utf8",
    );
    const sidebarStyles = fs.readFileSync(
      path.join(localTarget, "components/nerio/styles/sidebar.css"),
      "utf8",
    );
    if (
      !sidebarSource.includes("defaultExpanded") ||
      !sidebarSource.includes('data-state={expanded ? "expanded" : "collapsed"}') ||
      !sidebarSource.includes("aria-controls={sidebarId}") ||
      !sidebarSource.includes("inert={!expanded || undefined}") ||
      !sidebarLayoutSource.includes('from "../lib/compose-refs"') ||
      !sidebarLayoutSource.includes("React.forwardRef<HTMLDivElement, SidebarContentProps>") ||
      !sidebarLayoutSource.includes("React.useMemo(() => composeRefs(ref), [ref])") ||
      !sidebarStyles.includes("block-size: var(--n-sidebar-rail-hit-area)") ||
      !sidebarStyles.includes("inset-block-start: 50%") ||
      sidebarStyles.includes("inset-block: 0")
    ) {
      throw new Error(
        "Installed Sidebar source did not preserve geometry, ref, state, focus safety, or ARIA contracts.",
      );
    }
    assertFiles(localTarget, expectedCommandFiles);
    const commandSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/command.tsx"),
      "utf8",
    );
    const commandStyles = fs.readFileSync(
      path.join(localTarget, "components/nerio/styles/command.css"),
      "utf8",
    );
    if (
      !commandSource.includes("BaseAutocomplete.Root") ||
      !commandSource.includes("itemToInputValue") ||
      commandSource.includes("items as readonly CommandItemData[]") ||
      !commandSource.includes("onActiveValueChange") ||
      !commandSource.includes('data-leading={hasLeading ? "true" : "false"}') ||
      commandSource.includes('<span aria-hidden className="n-command__item-leading"') ||
      !commandSource.includes('data-slot="command-loading"') ||
      !commandSource.includes("filterProp === false") ||
      !commandStyles.includes('data-leading="false"') ||
      !commandStyles.includes("var(--n-focus-ring)")
    ) {
      throw new Error(
        "Installed Command source did not preserve filtering, active-value, or status contracts.",
      );
    }
    assertFiles(localTarget, expectedFieldFiles);
    assertFiles(localTarget, expectedInputGroupFiles);
    const inputGroupSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/input-group.tsx"),
      "utf8",
    );
    if (
      !inputGroupSource.includes("InputGroupAddon") ||
      !inputGroupSource.includes('data-slot="input-group"') ||
      !inputGroupSource.includes("child.type !== Input")
    ) {
      throw new Error("Installed InputGroup source did not preserve explicit composition anatomy.");
    }
    const fieldSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/field.tsx"),
      "utf8",
    );
    if (
      !fieldSource.includes("React.forwardRef<HTMLDivElement") ||
      !fieldSource.includes('children.props["aria-describedby"]') ||
      !fieldSource.includes('role={invalid ? "alert" : undefined}')
    ) {
      throw new Error("Installed Field source did not preserve the ref and aria wiring contract.");
    }
    assertFiles(localTarget, expectedBaseFormFiles);
    assertFiles(localTarget, expectedFormGroupFiles);
    const formGroupSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/form-group.tsx"),
      "utf8",
    );
    if (
      !formGroupSource.includes("React.forwardRef<HTMLFieldSetElement") ||
      !formGroupSource.includes("<fieldset") ||
      !formGroupSource.includes("<legend") ||
      !formGroupSource.includes("aria-describedby={describedBy}") ||
      !formGroupSource.includes('role={invalid ? "alert" : undefined}')
    ) {
      throw new Error("Installed FormGroup source did not preserve fieldset and aria wiring.");
    }
    const checkboxSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/checkbox.tsx"),
      "utf8",
    );
    if (
      !checkboxSource.includes("@base-ui/react/checkbox") ||
      !checkboxSource.includes("invalid?: boolean") ||
      !checkboxSource.includes("aria-invalid") ||
      !checkboxSource.includes("icon={Check}") ||
      !checkboxSource.includes("icon={Minus}")
    ) {
      throw new Error("Installed Checkbox source is missing Base UI, invalid, or icon contract.");
    }
    const switchSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/switch.tsx"),
      "utf8",
    );
    if (
      !switchSource.includes("@base-ui/react/switch") ||
      !switchSource.includes("forwardRef") ||
      !switchSource.includes("data-readonly")
    ) {
      throw new Error("Installed Switch source is missing Base UI or ref support.");
    }
    assertFiles(localTarget, expectedSelectFiles);
    const selectSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/select.tsx"),
      "utf8",
    );
    if (
      !selectSource.includes("React.forwardRef<HTMLDivElement") ||
      !selectSource.includes("placeholder={placeholder}") ||
      !selectSource.includes("autoComplete={autoComplete}")
    ) {
      throw new Error("Installed Select source did not preserve placeholder and form metadata.");
    }
    assertFiles(localTarget, expectedPhase2BFiles);
    assertFiles(localTarget, expectedDisplayFiles);
    assertFiles(localTarget, expectedNavigationFiles);
    assertFiles(localTarget, expectedFeedbackFiles);
    assertFiles(localTarget, expectedProgressFiles);
    assertFiles(localTarget, expectedOverlayAndTabsFiles);

    const tableSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/table.tsx"),
      "utf8",
    );
    if (!tableSource.includes('scope = "col"')) {
      throw new Error("Installed Table source does not preserve column header scope.");
    }
    if (
      !tableSource.includes('"aria-labelledby": string') ||
      !tableSource.includes("data-focusable") ||
      !tableSource.includes("TableContainerAccessibleName") ||
      !tableSource.includes("focusable === true") ||
      !tableSource.includes("ariaLabel.trim()") ||
      !tableSource.includes("isFocusableRegion")
    ) {
      throw new Error("Installed Table source does not preserve its named scroll-region contract.");
    }

    const tableStyles = fs.readFileSync(
      path.join(localTarget, "components/nerio/styles/display.css"),
      "utf8",
    );
    if (
      !tableStyles.includes(".n-table-container > .n-table") ||
      !tableStyles.includes('[data-align="numeric"]') ||
      !tableStyles.includes("--n-table-container-focus-ring") ||
      !tableStyles.includes(".n-table tbody > tr:hover") ||
      !tableStyles.includes('[aria-current]:not([aria-current="false"])') ||
      !tableStyles.includes(".n-table-container[data-focusable]:focus-visible")
    ) {
      throw new Error("Installed Table styles do not preserve responsive and state hooks.");
    }

    const listSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/list.tsx"),
      "utf8",
    );
    const itemSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/item.tsx"),
      "utf8",
    );
    const composeRefsSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/lib/compose-refs.ts"),
      "utf8",
    );
    if (
      !itemSource.includes('from "../lib/compose-refs"') ||
      !itemSource.includes("composeRefs(renderRef, ref)") ||
      !listSource.includes('from "../lib/compose-refs"') ||
      !composeRefsSource.includes('typeof ref === "function"') ||
      !composeRefsSource.includes("ref.current = node")
    ) {
      throw new Error(
        "Installed Item/List source does not preserve callback and object ref composition.",
      );
    }
    if (
      !listSource.includes('const Root = ordered ? "ol" : "ul"') ||
      !listSource.includes('className={cn("n-list__link", linkClassName)}') ||
      !listSource.includes('data-slot="link"') ||
      !listSource.includes("href={item.href}") ||
      !listSource.includes("React.cloneElement") ||
      !listSource.includes('"data-slot": "link"')
    ) {
      throw new Error("Installed List source does not preserve protected native link anatomy.");
    }

    const breadcrumbsSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/breadcrumbs.tsx"),
      "utf8",
    );
    if (
      !breadcrumbsSource.includes('"aria-label": ariaLabel = "Breadcrumb"') ||
      !breadcrumbsSource.includes('aria-current={isCurrent ? "page" : undefined}') ||
      !breadcrumbsSource.includes("aria-hidden")
    ) {
      throw new Error(
        "Installed Breadcrumbs source does not preserve landmark, current page, or separator semantics.",
      );
    }

    const paginationSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/pagination.tsx"),
      "utf8",
    );
    if (
      !paginationSource.includes('"aria-label": ariaLabel = "Pagination"') ||
      !paginationSource.includes('aria-current={page.current ? "page" : undefined}') ||
      !paginationSource.includes('aria-disabled="true"') ||
      !paginationSource.includes('"data-current": current ? "" : undefined') ||
      (paginationSource.match(/data-current=\{current \? "" : undefined\}/g) ?? []).length < 4 ||
      !paginationSource.includes('"data-slot": slot')
    ) {
      throw new Error(
        "Installed Pagination source does not preserve landmark, current page, or disabled semantics.",
      );
    }

    const progressSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/progress.tsx"),
      "utf8",
    );
    if (
      !progressSource.includes("aria-labelledby") ||
      !progressSource.includes("aria-valuenow") ||
      !progressSource.includes("data-state={normalized.state}")
    ) {
      throw new Error("Installed Progress source does not preserve accessible progress metadata.");
    }
    const progressItem = JSON.parse(fs.readFileSync(manifest, "utf8")).items.find(
      (item) => item.name === "progress",
    );
    if (
      !progressItem ||
      progressItem.files.some((file) => file.target === "styles/feedback.css") ||
      !progressItem.files.some((file) => file.target === "styles/progress.css") ||
      !progressItem.states?.includes("indeterminate")
    ) {
      throw new Error(
        "Progress registry install must use its dedicated stylesheet and state contract.",
      );
    }

    const buttonSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/button.tsx"),
      "utf8",
    );
    if (
      !buttonSource.includes("isRenderElement") ||
      !buttonSource.includes("React.cloneElement(renderedElement")
    ) {
      throw new Error("Installed Button source does not preserve custom link rendering.");
    }

    const radioSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/radio-group.tsx"),
      "utf8",
    );
    if (
      !radioSource.includes("@base-ui/react/radio-group") ||
      !radioSource.includes("aria-labelledby") ||
      !radioSource.includes("RadioGroupItem")
    ) {
      throw new Error("Installed RadioGroup source does not preserve Base UI label wiring.");
    }

    const tabsSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/tabs.tsx"),
      "utf8",
    );
    if (
      !tabsSource.includes("@base-ui/react/tabs") ||
      !tabsSource.includes("TabsTrigger") ||
      !tabsSource.includes("TabsIndicator") ||
      !tabsSource.includes("renderBeforeHydration = true") ||
      !tabsSource.includes("React.forwardRef<HTMLDivElement") ||
      tabsSource.includes("onClick={()") ||
      !tabsSource.includes("moveFocusPastDisabledTab")
    ) {
      throw new Error(
        "Installed Tabs source does not preserve the Base UI compound-component contract.",
      );
    }

    const dropdownSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/dropdown-menu.tsx"),
      "utf8",
    );
    if (
      !dropdownSource.includes("destructive") ||
      !dropdownSource.includes("disabled={item.disabled}") ||
      !dropdownSource.includes("onOpenChange")
    ) {
      throw new Error("Installed DropdownMenu source is missing item state or open control.");
    }

    const toastSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/toast.tsx"),
      "utf8",
    );
    if (
      !toastSource.includes("createToastManager") ||
      !toastSource.includes("Dismiss notification") ||
      !toastSource.includes("data?.tone") ||
      !toastSource.includes("inline-end") ||
      !toastSource.includes("readDocumentDirection") ||
      !toastSource.includes("data-direction") ||
      !toastSource.includes("dismissOnClick") ||
      !toastSource.includes('import { Button } from "./button"') ||
      !toastSource.includes("icon={X}")
    ) {
      throw new Error(
        "Installed Toast source is missing manager, first-render direction, RTL swipe, or action dismissal contract.",
      );
    }

    const toastStyles = fs.readFileSync(
      path.join(localTarget, "components/nerio/styles/toast.css"),
      "utf8",
    );
    if (
      !toastStyles.includes("--toast-managed-base-y") ||
      !toastStyles.includes("--toast-managed-dismiss-x") ||
      !toastStyles.includes("--toast-managed-dismiss-y") ||
      !toastStyles.includes("--toast-managed-scale") ||
      !toastStyles.includes("max(") ||
      !toastStyles.includes("inset-inline-start: 50%") ||
      !toastStyles.includes(".n-toast-viewport:dir(rtl)") ||
      !toastStyles.includes("translateX(50%)") ||
      !toastStyles.includes("var(--n-toast-stack-offset) * -1") ||
      !toastStyles.includes("scale(var(--toast-managed-scale))") ||
      !toastStyles.includes("font-size: var(--n-font-size-md)") ||
      !toastStyles.includes("margin: 0") ||
      !toastStyles.includes("align-content: center") ||
      toastStyles.includes("background: var(--n-toast-status-background)") ||
      !toastStyles.includes("translate3d(var(--toast-managed-x), var(--toast-managed-y), 0)")
    ) {
      throw new Error(
        "Installed Toast styles are missing the bottom-centered scaled stack or unified transform coordinate system.",
      );
    }

    const alertSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/alert.tsx"),
      "utf8",
    );
    if (alertSource.includes('tone === "danger" ? "alert" : "status"')) {
      throw new Error("Installed Alert source still defaults static alerts to live regions.");
    }

    await run(urlTarget, "init", "--registry", manifestUrl);
    const urlListOutput = await run(urlTarget, "list", "--registry", manifestUrl);
    if (!urlListOutput.includes("button\tButton\tactions")) {
      throw new Error("List output did not work with an HTTP registry override.");
    }
    const urlInfoOutput = await run(urlTarget, "info", "button", "--registry", manifestUrl);
    if (!urlInfoOutput.includes("Button (button)") || !urlInfoOutput.includes("Files:")) {
      throw new Error("Info output did not work with an HTTP registry override.");
    }
    await run(urlTarget, "add", "button");
    await run(urlTarget, "doctor");
    assertInstall(urlTarget);
  } finally {
    server.close();
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log(
    "CLI fixture passed for dry-run, local-path, URL, registry dependency, form, feedback, and display installs.",
  );
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
