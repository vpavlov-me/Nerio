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
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/motion.css",
  "styles/spinner.css",
  "styles/tailwind.css",
];
const expectedDialogFiles = [...expectedFiles, "components/dialog.tsx", "styles/overlays.css"];
const expectedSheetFiles = [
  ...expectedFiles,
  "components/button.tsx",
  "components/icon.tsx",
  "components/sheet.tsx",
  "lib/cn.ts",
  "styles/overlays.css",
];
const expectedSidebarFiles = [
  "components/icon.tsx",
  "components/sidebar-layout.tsx",
  "components/sidebar.tsx",
  "lib/cn.ts",
  "lib/compose-refs.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
];
const expectedCommandFiles = [
  "components/command.tsx",
  "components/icon.tsx",
  "components/spinner.tsx",
  "lib/cn.ts",
  "lib/resolve-class-name.ts",
  "lib/tailwind-cn.ts",
  "styles/spinner.css",
  "styles/tailwind.css",
];
const expectedFieldFiles = [
  "components/field.tsx",
  "components/label.tsx",
  "components/form-message.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
];
const expectedInputGroupFiles = [
  "components/input.tsx",
  "components/input-group.tsx",
  "lib/cn.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/motion.css",
  "styles/tailwind.css",
];
const expectedFormGroupFiles = [
  "components/form-group.tsx",
  "components/form-message.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
];
const expectedBaseFormFiles = [
  "components/checkbox.tsx",
  "components/icon.tsx",
  "components/switch.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "lib/resolve-class-name.ts",
  "styles/tailwind.css",
];
const expectedSelectFiles = [
  "components/select.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "lib/resolve-class-name.ts",
  "styles/select.css",
  "styles/tailwind.css",
];
const expectedPhase2BFiles = [
  "components/alert.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/radio-group.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "lib/resolve-class-name.ts",
  "styles/feedback.css",
  "styles/tailwind.css",
];
const expectedDisplayFiles = [
  "components/avatar.tsx",
  "components/card.tsx",
  "components/item.tsx",
  "components/key-value.tsx",
  "components/list.tsx",
  "components/separator.tsx",
  "components/stat.tsx",
  "components/table.tsx",
  "lib/cn.ts",
  "lib/compose-refs.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedNavigationFiles = [
  "components/breadcrumbs.tsx",
  "components/pagination.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
];
const expectedFeedbackFiles = [
  "components/empty-state.tsx",
  "components/skeleton.tsx",
  "components/spinner.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "styles/feedback.css",
  "styles/spinner.css",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedProgressFiles = [
  "components/progress.tsx",
  "lib/cn.ts",
  "lib/tailwind-cn.ts",
  "styles/progress.css",
  "styles/tailwind.css",
  "styles/tokens.css",
];
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
  "lib/tailwind-cn.ts",
  "styles/motion.css",
  "styles/overlays.css",
  "styles/tailwind.css",
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

async function runFailure(cwd, ...args) {
  try {
    await run(cwd, ...args);
  } catch (error) {
    return error.message;
  }
  throw new Error(`nerio ${args.join(" ")} unexpectedly succeeded.`);
}

function writePackageTailwindSetup(target, { explicitPreflight = false } = {}) {
  const appDirectory = path.join(target, "app");
  fs.mkdirSync(appDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(appDirectory, "globals.css"),
    [
      "@layer theme, base, components, utilities;",
      '@import "tailwindcss/theme.css" layer(theme);',
      explicitPreflight ? '@import "tailwindcss/preflight.css" layer(base);' : "",
      '@import "tailwindcss/utilities.css" layer(utilities);',
      '@import "@nerio-ui/tokens/tailwind.css";',
      '@import "@nerio-ui/ui/styles.css";',
      '@source "../node_modules/@nerio-ui/ui/src";',
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
}

function writeSourceTailwindSetup(
  target,
  {
    includeBridge = true,
    includeCompatibility = true,
    extensionlessTailwindImports = false,
    includeLegacyStyle = false,
    includeTokens = true,
  } = {},
) {
  const appDirectory = path.join(target, "app");
  fs.mkdirSync(appDirectory, { recursive: true });
  if (includeCompatibility) {
    fs.writeFileSync(
      path.join(appDirectory, "nerio-compat.css"),
      [
        ':where([class^="n-"], [class*=" n-"]) { box-sizing: border-box; }',
        ':where(button, input, select, textarea):where([class^="n-"], [class*=" n-"]) { font-family: inherit; }',
        "",
      ].join("\n"),
    );
  }
  if (includeLegacyStyle) {
    fs.writeFileSync(
      path.join(target, "components/nerio/styles/button.css"),
      ".n-button { color: red; }\n",
    );
  }
  fs.writeFileSync(
    path.join(appDirectory, "globals.css"),
    [
      "@layer theme, base, components, utilities;",
      `@import "tailwindcss/theme${extensionlessTailwindImports ? "" : ".css"}" layer(theme);`,
      `@import "tailwindcss/utilities${extensionlessTailwindImports ? "" : ".css"}" layer(utilities);`,
      includeTokens ? '@import "../components/nerio/styles/tokens.css";' : "",
      includeBridge ? '@import "../components/nerio/styles/tailwind.css";' : "",
      includeCompatibility ? '@import "./nerio-compat.css";' : "",
      includeLegacyStyle ? '@import "../components/nerio/styles/button.css";' : "",
      "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
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

function listInstalledFiles(target) {
  const root = path.join(target, "components/nerio");
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        visit(entryPath);
      } else {
        files.push(path.relative(root, entryPath));
      }
    }
  };
  visit(root);
  return files.sort();
}

function assertExactInstall(target, expectedFiles, family) {
  const actual = listInstalledFiles(target);
  const expected = [...expectedFiles].sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${family} source install did not match its exact Registry closure.\nExpected: ${expected.join(", ")}\nActual: ${actual.join(", ")}`,
    );
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
  const invalidPackageTarget = path.join(tempRoot, "invalid-package");
  const preflightTarget = path.join(tempRoot, "preflight");
  const sourceTarget = path.join(tempRoot, "source");
  const missingBridgeTarget = path.join(tempRoot, "missing-bridge");
  const missingCompatibilityTarget = path.join(tempRoot, "missing-compatibility");
  const missingExtensionlessCompatibilityTarget = path.join(
    tempRoot,
    "missing-extensionless-compatibility",
  );
  const invalidSourceTarget = path.join(tempRoot, "invalid-source");
  const missingInstalledTokenTarget = path.join(tempRoot, "missing-installed-token");
  const staleSourceTarget = path.join(tempRoot, "stale-source");
  const displayTarget = path.join(tempRoot, "display");
  const feedbackTarget = path.join(tempRoot, "feedback");
  const progressTarget = path.join(tempRoot, "progress");
  fs.mkdirSync(localTarget);
  fs.mkdirSync(urlTarget);
  fs.mkdirSync(invalidPackageTarget);
  fs.mkdirSync(preflightTarget);
  fs.mkdirSync(sourceTarget);
  fs.mkdirSync(missingBridgeTarget);
  fs.mkdirSync(missingCompatibilityTarget);
  fs.mkdirSync(missingExtensionlessCompatibilityTarget);
  fs.mkdirSync(invalidSourceTarget);
  fs.mkdirSync(missingInstalledTokenTarget);
  fs.mkdirSync(staleSourceTarget);
  fs.mkdirSync(displayTarget);
  fs.mkdirSync(feedbackTarget);
  fs.mkdirSync(progressTarget);

  const { server, manifestUrl } = await startRegistryServer();
  try {
    await run(localTarget, "init", "--registry", manifest);
    writePackageTailwindSetup(localTarget);
    await run(localTarget, "doctor");
    await run(preflightTarget, "init", "--registry", manifest);
    writePackageTailwindSetup(preflightTarget, { explicitPreflight: true });
    await run(preflightTarget, "doctor");

    await run(invalidPackageTarget, "init", "--registry", manifest);
    fs.mkdirSync(path.join(invalidPackageTarget, "app"));
    fs.writeFileSync(
      path.join(invalidPackageTarget, "app/globals.css"),
      '@import "tailwindcss";\n@import "@nerio-ui/ui/styles.css";\n',
    );
    const invalidPackageOutput = await runFailure(invalidPackageTarget, "doctor");
    if (
      !invalidPackageOutput.includes("@nerio-ui/tokens/tailwind.css") ||
      !invalidPackageOutput.includes("@source")
    ) {
      throw new Error("Doctor did not report actionable package Tailwind setup remediation.");
    }

    for (const target of [
      sourceTarget,
      missingBridgeTarget,
      missingCompatibilityTarget,
      missingExtensionlessCompatibilityTarget,
      invalidSourceTarget,
      missingInstalledTokenTarget,
      staleSourceTarget,
    ]) {
      await run(target, "init", "--registry", manifest);
      await run(target, "add", "button");
    }
    writeSourceTailwindSetup(sourceTarget);
    await run(sourceTarget, "doctor");
    writeSourceTailwindSetup(missingBridgeTarget, { includeBridge: false });
    const missingBridgeOutput = await runFailure(missingBridgeTarget, "doctor");
    if (!missingBridgeOutput.includes("copied styles/tailwind.css bridge")) {
      throw new Error("Doctor did not report the missing source-install Tailwind bridge.");
    }
    writeSourceTailwindSetup(missingCompatibilityTarget, { includeCompatibility: false });
    const missingCompatibilityOutput = await runFailure(missingCompatibilityTarget, "doctor");
    if (!missingCompatibilityOutput.includes("missing scoped Nerio compatibility styles")) {
      throw new Error("Doctor did not report the missing no-Preflight compatibility path.");
    }
    writeSourceTailwindSetup(missingExtensionlessCompatibilityTarget, {
      includeCompatibility: false,
      extensionlessTailwindImports: true,
    });
    const missingExtensionlessCompatibilityOutput = await runFailure(
      missingExtensionlessCompatibilityTarget,
      "doctor",
    );
    if (
      !missingExtensionlessCompatibilityOutput.includes("missing scoped Nerio compatibility styles")
    ) {
      throw new Error(
        "Doctor did not report the missing no-Preflight compatibility path for extensionless Tailwind imports.",
      );
    }
    writeSourceTailwindSetup(invalidSourceTarget, { includeTokens: false });
    const invalidSourceOutput = await runFailure(invalidSourceTarget, "doctor");
    if (!invalidSourceOutput.includes("styles/tokens.css")) {
      throw new Error("Doctor did not report the missing source-install token stylesheet.");
    }
    writeSourceTailwindSetup(missingInstalledTokenTarget);
    fs.rmSync(path.join(missingInstalledTokenTarget, "components/nerio/styles/tokens.css"));
    const missingInstalledTokenOutput = await runFailure(missingInstalledTokenTarget, "doctor");
    if (!missingInstalledTokenOutput.includes("copied styles/tokens.css variables")) {
      throw new Error("Doctor did not report a missing copied token stylesheet.");
    }
    writeSourceTailwindSetup(staleSourceTarget, { includeLegacyStyle: true });
    const staleSourceOutput = await runFailure(staleSourceTarget, "doctor");
    if (!staleSourceOutput.includes("unsupported legacy component stylesheet")) {
      throw new Error("Doctor did not report an imported legacy source stylesheet.");
    }

    for (const [target, components, expectedFiles, family] of [
      [
        displayTarget,
        ["avatar", "card", "key-value", "separator", "stat", "table", "item", "list"],
        expectedDisplayFiles,
        "Display",
      ],
      [feedbackTarget, ["empty-state", "skeleton", "spinner"], expectedFeedbackFiles, "Feedback"],
      [progressTarget, ["progress"], expectedProgressFiles, "Progress"],
    ]) {
      await run(target, "init", "--registry", manifest);
      for (const component of components) {
        await run(target, "add", component);
      }
      assertExactInstall(target, expectedFiles, family);
    }

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
      !listOutput.includes("motion-adapter\tMotion Adapter\tfoundation") ||
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
      !infoOutput.includes("@nerio-ui/adapters") ||
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
    const motionInfoOutput = await run(localTarget, "info", "motion-adapter");
    if (
      !motionInfoOutput.includes("Optional peer dependencies: motion") ||
      !motionInfoOutput.includes("Documentation: /docs/foundations/motion") ||
      !motionInfoOutput.includes("lib/motion-adapter.tsx")
    ) {
      throw new Error(
        "Motion Adapter registry metadata did not include its optional-peer contract.",
      );
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
      !buttonGroupInfoOutput.includes("lib/tailwind-cn.ts") ||
      !buttonGroupInfoOutput.includes("styles/tailwind.css")
    ) {
      throw new Error(
        "ButtonGroup registry metadata did not include the stable orientation contract.",
      );
    }
    await run(localTarget, "add", "button");
    const customizedTokensPath = path.join(localTarget, "components/nerio/styles/tokens.css");
    fs.writeFileSync(customizedTokensPath, "/* Product token overrides. */\n");
    await run(localTarget, "add", "card");
    if (fs.readFileSync(customizedTokensPath, "utf8") !== "/* Product token overrides. */\n") {
      throw new Error("Adding a component replaced customized source-install token styles.");
    }
    fs.copyFileSync(path.join(repoRoot, "packages/tokens/src/styles.css"), customizedTokensPath);
    await run(localTarget, "add", "typography");
    await run(localTarget, "add", "motion-adapter");
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
      !installedIconSource.includes('from "@nerio-ui/adapters/icons"') ||
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
      "lib/motion-adapter.tsx",
      "lib/tailwind-cn.ts",
      "styles/tailwind.css",
      "styles/tokens.css",
    ]);
    const installedMotionAdapter = fs.readFileSync(
      path.join(localTarget, "components/nerio/lib/motion-adapter.tsx"),
      "utf8",
    );
    if (
      !installedMotionAdapter.includes('"use client"') ||
      !installedMotionAdapter.includes('reducedMotion="user"') ||
      !installedMotionAdapter.includes("motionTransitions")
    ) {
      throw new Error("Installed Motion Adapter source is missing its client or motion contract.");
    }
    const installedTypographyTokens = fs.readFileSync(
      path.join(localTarget, "components/nerio/styles/tokens.css"),
      "utf8",
    );
    if (!installedTypographyTokens.includes(".n-typography-inter")) {
      throw new Error("Installed Typography token stylesheet is missing the Inter recipe.");
    }
    assertInstall(localTarget, expectedDialogFiles);
    const dialogSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/dialog.tsx"),
      "utf8",
    );
    if (
      !dialogSource.includes('closeLabel = "Close dialog"') ||
      !dialogSource.includes('data-slot="close"')
    ) {
      throw new Error("Installed Dialog source is missing its localizable close anatomy contract.");
    }
    assertFiles(localTarget, expectedSheetFiles);
    const sheetSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/sheet.tsx"),
      "utf8",
    );
    if (
      !sheetSource.includes("BaseDialog.Root") ||
      !sheetSource.includes('data-slot="sheet-content"') ||
      !sheetSource.includes("showClose") ||
      !sheetSource.includes('className="n-sheet__close-icon absolute') ||
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
    if (
      !sidebarSource.includes("defaultExpanded") ||
      !sidebarSource.includes('data-state={expanded ? "expanded" : "collapsed"}') ||
      !sidebarSource.includes("aria-controls={sidebarId}") ||
      !sidebarSource.includes("inert={!expanded || undefined}") ||
      !sidebarLayoutSource.includes('from "../lib/compose-refs"') ||
      !sidebarLayoutSource.includes("React.forwardRef<HTMLDivElement, SidebarContentProps>") ||
      !sidebarLayoutSource.includes("React.useMemo(() => composeRefs(ref), [ref])") ||
      !sidebarSource.includes("size-(--n-sidebar-rail-hit-area)") ||
      !sidebarSource.includes("top-1/2") ||
      !sidebarSource.includes('from "../lib/tailwind-cn"')
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
    if (
      !commandSource.includes("BaseAutocomplete.Root") ||
      !commandSource.includes("itemToInputValue") ||
      commandSource.includes("items as readonly CommandItemData[]") ||
      !commandSource.includes("onActiveValueChange") ||
      !commandSource.includes('data-leading={hasLeading ? "true" : "false"}') ||
      commandSource.includes('<span aria-hidden className="n-command__item-leading"') ||
      !commandSource.includes('data-slot="command-loading"') ||
      !commandSource.includes("filterProp === false") ||
      !commandSource.includes("data-[leading=false]") ||
      !commandSource.includes("shadow-(--n-focus-ring)") ||
      !commandSource.includes('from "../lib/tailwind-cn"')
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

    if (
      !tableSource.includes("[&>.n-table]:min-w-max") ||
      !tableSource.includes("[data-align=numeric]") ||
      !tableSource.includes("--n-table-container-focus-ring") ||
      !tableSource.includes("tbody>tr:hover") ||
      !tableSource.includes("[aria-current]:not([aria-current=false])") ||
      !tableSource.includes("data-focusable:focus-visible")
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
      !composeRefsSource.includes("ref.current = node") ||
      !composeRefsSource.includes('typeof cleanup === "function"') ||
      !composeRefsSource.includes("() => ref(null)")
    ) {
      throw new Error(
        "Installed Button/Item/List source does not preserve callback, object, and cleanup ref composition.",
      );
    }
    if (
      !listSource.includes('const Root = ordered ? "ol" : "ul"') ||
      !listSource.includes('"n-list__link"') ||
      !listSource.includes("listSurfaceClasses") ||
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
      !buttonSource.includes("React.cloneElement(renderedElement") ||
      !buttonSource.includes('from "../lib/compose-refs"') ||
      !buttonSource.includes("composeRefs(renderRef, ref)")
    ) {
      throw new Error(
        "Installed Button source does not preserve custom rendering and ref composition.",
      );
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

    if (
      !toastSource.includes("--toast-managed-base-y") ||
      !toastSource.includes("--toast-managed-dismiss-x") ||
      !toastSource.includes("--toast-managed-dismiss-y") ||
      !toastSource.includes("--toast-managed-scale") ||
      !toastSource.includes("safe-area-inset-left") ||
      !toastSource.includes("safe-area-inset-right") ||
      !toastSource.includes("translate3d(var(--toast-managed-x),var(--toast-managed-y),0)") ||
      !toastSource.includes('from "../lib/tailwind-cn"')
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
    writePackageTailwindSetup(urlTarget);
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
