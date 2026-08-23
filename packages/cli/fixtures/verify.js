const fs = require("node:fs");
const crypto = require("node:crypto");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { clearInterval, setInterval, setTimeout } = require("node:timers");

const repoRoot = path.resolve(__dirname, "../../..");
const cli = path.resolve(__dirname, "../src/index.js");
const manifest = path.resolve(repoRoot, "packages/registry/src/manifest.json");
const cliVersion = require("../package.json").version;
const publicCommands = require("../../registry/src/public-commands.json");
const incompatibleRegistryVersion = cliVersion.replace(/(\d+)$/, (value) => `${Number(value) + 1}`);
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
const expectedAlertDialogFiles = [...expectedDialogFiles, "components/alert-dialog.tsx"];
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
  "lib/component-props.ts",
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
  "lib/component-props.ts",
  "lib/tailwind-cn.ts",
  "lib/resolve-class-name.ts",
  "styles/tailwind.css",
];
const expectedSelectFiles = [
  "components/select.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/tailwind-cn.ts",
  "lib/resolve-class-name.ts",
  "styles/select.css",
  "styles/tailwind.css",
];
const expectedComboboxFiles = [
  "components/combobox.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/spinner.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/resolve-class-name.ts",
  "lib/tailwind-cn.ts",
  "styles/select.css",
  "styles/spinner.css",
  "styles/tailwind.css",
];
const expectedMultiSelectFiles = [
  "components/multi-select.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/select.css",
  "styles/tailwind.css",
];
const expectedSearchFieldFiles = [
  "components/button.tsx",
  "components/field.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/input.tsx",
  "components/input-group.tsx",
  "components/label.tsx",
  "components/search-field.tsx",
  "components/spinner.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/motion.css",
  "styles/spinner.css",
  "styles/tailwind.css",
];
const expectedNumberFieldFiles = [
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/number-field.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/tokens.css",
  "styles/tailwind.css",
];
const expectedOtpFieldFiles = [
  "components/form-message.tsx",
  "components/otp-field.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/tokens.css",
  "styles/tailwind.css",
];
const expectedPhase2BFiles = [
  "components/alert.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/radio-group.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/tailwind-cn.ts",
  "lib/resolve-class-name.ts",
  "styles/feedback.css",
  "styles/tailwind.css",
];
const expectedDisplayFiles = [
  "components/avatar.tsx",
  "components/avatar-image.tsx",
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
const expectedSliderFiles = [
  "components/slider.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/resolve-class-name.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedToggleFiles = [
  "components/icon.tsx",
  "components/toggle.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/motion.ts",
  "lib/resolve-class-name.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedToggleGroupFiles = [
  "components/icon.tsx",
  "components/toggle-group.tsx",
  "components/toggle.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/motion.ts",
  "lib/resolve-class-name.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedCheckboxGroupFiles = [
  "components/checkbox-group.tsx",
  "components/checkbox.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/resolve-class-name.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedCalendarFiles = [
  "components/calendar.tsx",
  "lib/cn.ts",
  "lib/compose-refs.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedDatePickerFiles = [
  "components/button.tsx",
  "components/calendar.tsx",
  "components/date-picker.tsx",
  "components/field.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "components/label.tsx",
  "components/popover.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/compose-refs.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/motion.css",
  "styles/tailwind.css",
  "styles/tokens.css",
];
const expectedFileInputFiles = [
  "components/file-input.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/motion.css",
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
  "lib/component-props.ts",
  "lib/motion.ts",
  "lib/tailwind-cn.ts",
  "styles/motion.css",
  "styles/overlays.css",
  "styles/tailwind.css",
];
const expectedDisclosureFiles = [
  "components/accordion.tsx",
  "components/collapsible.tsx",
  "lib/cn.ts",
  "lib/component-props.ts",
  "lib/tailwind-cn.ts",
  "styles/tailwind.css",
  "styles/tokens.css",
];

function execute(cwd, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, ...args], {
      cwd,
      stdio: "pipe",
      env: { ...process.env, ...env },
    });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk));
    child.stderr.on("data", (chunk) => (output += chunk));
    child.on("close", (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(`nerio ${args.join(" ")} failed:\n${output}`));
    });
  });
}

function run(cwd, ...args) {
  return execute(cwd, args);
}

function runWithEnv(cwd, env, ...args) {
  return execute(cwd, args, env);
}

async function runFailure(cwd, ...args) {
  try {
    await run(cwd, ...args);
  } catch (error) {
    return error.message;
  }
  throw new Error(`nerio ${args.join(" ")} unexpectedly succeeded.`);
}

async function runResult(cwd, ...args) {
  try {
    return await run(cwd, ...args);
  } catch (error) {
    return error.message;
  }
}

async function runFailureWithEnv(cwd, env, ...args) {
  try {
    await runWithEnv(cwd, env, ...args);
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

function writeLifecycleRegistry(
  registryRoot,
  {
    version = cliVersion,
    sourceRevision = "fixture-beta.0",
    schemaVersion = "1.0.0",
    sharedSource = "export const shared = 'one';\n",
    buttonSource = "export const button = 'one';\n",
    tokenSource = ":root { --fixture: one; }\n",
    includeExtra = false,
  } = {},
) {
  const sourceRoot = path.join(registryRoot, "source");
  fs.mkdirSync(sourceRoot, { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, "shared.ts"), sharedSource);
  fs.writeFileSync(path.join(sourceRoot, "button.ts"), buttonSource);
  fs.writeFileSync(path.join(sourceRoot, "tokens.css"), tokenSource);
  fs.writeFileSync(path.join(sourceRoot, "tailwind.css"), "@theme inline {}\n");
  if (includeExtra) {
    fs.writeFileSync(path.join(sourceRoot, "extra.ts"), "export const extra = true;\n");
  }

  const items = [
    {
      name: "shared",
      title: "Shared",
      description: "Fixture shared source.",
      category: "foundation",
      dependencies: ["react"],
      registryDependencies: [],
      files: [
        { source: "./source/shared.ts", target: "lib/shared.ts", role: "utility" },
        { source: "./source/tokens.css", target: "styles/tokens.css", role: "style" },
        { source: "./source/tailwind.css", target: "styles/tailwind.css", role: "style" },
      ],
      baseUiPrimitives: [],
      slots: [],
      variants: [],
      requiredTokens: [],
      accessibility: [],
      usage: "import { shared } from '@/components/nerio/lib/shared';",
    },
    {
      name: "button",
      title: "Button",
      description: "Fixture button source.",
      category: "actions",
      dependencies: ["react"],
      registryDependencies: includeExtra ? ["shared", "extra"] : ["shared"],
      files: [{ source: "./source/button.ts", target: "components/button.ts", role: "component" }],
      baseUiPrimitives: [],
      slots: [],
      variants: [],
      requiredTokens: [],
      accessibility: [],
      usage: "import { button } from '@/components/nerio/components/button';",
    },
  ];
  if (includeExtra) {
    items.splice(1, 0, {
      name: "extra",
      title: "Extra",
      description: "Fixture dependency added by an upstream release.",
      category: "foundation",
      dependencies: [],
      registryDependencies: [],
      files: [{ source: "./source/extra.ts", target: "lib/extra.ts", role: "utility" }],
      baseUiPrimitives: [],
      slots: [],
      variants: [],
      requiredTokens: [],
      accessibility: [],
      usage: "import { extra } from '@/components/nerio/lib/extra';",
    });
  }
  for (const item of items) {
    for (const file of item.files) {
      const content = fs.readFileSync(path.resolve(registryRoot, file.source));
      file.integrity = `sha256-${crypto.createHash("sha256").update(content).digest("hex")}`;
    }
  }

  const manifestPath = path.join(registryRoot, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        schemaVersion,
        name: "nerio-fixture",
        version,
        sourceRevision,
        styleContractVersion: "tailwind-v1",
        items,
      },
      null,
      2,
    )}\n`,
  );
  return manifestPath;
}

function writeConcurrencyRegistry(registryRoot) {
  const sourceRoot = path.join(registryRoot, "source");
  fs.mkdirSync(sourceRoot, { recursive: true });
  const items = ["alpha", "beta"].map((name) => {
    const source = `export const ${name} = true;\n`;
    fs.writeFileSync(path.join(sourceRoot, `${name}.ts`), source);
    return {
      name,
      title: name[0].toUpperCase() + name.slice(1),
      description: `Fixture ${name} source.`,
      category: "foundation",
      dependencies: [],
      registryDependencies: [],
      files: [
        {
          source: `./source/${name}.ts`,
          target: `components/${name}.ts`,
          role: "component",
          integrity: `sha256-${crypto.createHash("sha256").update(source).digest("hex")}`,
        },
      ],
      baseUiPrimitives: [],
      slots: [],
      variants: [],
      requiredTokens: [],
      accessibility: [],
      usage: `import { ${name} } from '@/components/nerio/components/${name}';`,
    };
  });
  const manifestPath = path.join(registryRoot, "manifest.json");
  fs.writeFileSync(
    manifestPath,
    `${JSON.stringify(
      {
        schemaVersion: "1.1.0",
        name: "nerio-concurrency-fixture",
        version: cliVersion,
        sourceRevision: "fixture-concurrency",
        styleContractVersion: "tailwind-v1",
        items,
      },
      null,
      2,
    )}\n`,
  );
  return manifestPath;
}

function managedSnapshot(target) {
  const snapshot = {};
  const visit = (entry) => {
    if (!fs.existsSync(entry)) return;
    const stats = fs.statSync(entry);
    if (stats.isDirectory()) {
      for (const child of fs.readdirSync(entry)) visit(path.join(entry, child));
      return;
    }
    snapshot[path.relative(target, entry)] = fs.readFileSync(entry).toString("base64");
  };
  visit(path.join(target, "components"));
  visit(path.join(target, "nerio.lock.json"));
  return snapshot;
}

function assertNoTransactionArtifacts(target, description) {
  const artifacts = fs
    .readdirSync(target)
    .filter(
      (entry) =>
        entry.startsWith(".nerio-transaction-") ||
        entry.startsWith(".nerio-registry-lock") ||
        entry.endsWith(".tmp"),
    );
  if (artifacts.length) {
    throw new Error(`${description} left temporary artifacts: ${artifacts.join(", ")}`);
  }
}

function assertInterruptedTransaction(target, description) {
  if (!fs.readdirSync(target).some((entry) => entry.startsWith(".nerio-transaction-"))) {
    throw new Error(`${description} did not preserve a recovery journal.`);
  }
}

function discardCrashedRegistryLock(target) {
  const lockPath = path.join(target, ".nerio-registry-lock");
  if (!fs.existsSync(lockPath)) {
    throw new Error("A crashed Registry command did not preserve its process lock.");
  }
  fs.rmSync(lockPath);
  for (const entry of fs.readdirSync(target)) {
    if (entry.startsWith(".nerio-registry-lock.renew-")) {
      fs.rmSync(path.join(target, entry));
    }
  }
}

async function waitForFixture(predicate, description) {
  const deadline = Date.now() + 7_000;
  while (!predicate()) {
    if (Date.now() >= deadline) throw new Error(`Timed out waiting for ${description}.`);
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

async function verifyConcurrentTransactions(tempRoot) {
  const registryRoot = path.join(tempRoot, "concurrency-registry");
  const target = path.join(tempRoot, "concurrency-consumer");
  fs.mkdirSync(registryRoot);
  fs.mkdirSync(target);
  const fixtureManifest = writeConcurrencyRegistry(registryRoot);
  await run(target, "init", "--registry", fixtureManifest);

  const heartbeatStartupTarget = path.join(tempRoot, "heartbeat-startup-consumer");
  fs.mkdirSync(heartbeatStartupTarget);
  await run(heartbeatStartupTarget, "init", "--registry", fixtureManifest);
  const heartbeatStartupFailure = await runFailureWithEnv(
    heartbeatStartupTarget,
    {
      NODE_OPTIONS: "--permission --allow-fs-read=* --allow-fs-write=*",
    },
    "doctor",
  );
  if (!heartbeatStartupFailure.includes("Use --allow-worker to manage permissions")) {
    throw new Error(
      `Worker-denied Registry command did not report its heartbeat startup failure.\n${heartbeatStartupFailure}`,
    );
  }
  assertNoTransactionArtifacts(heartbeatStartupTarget, "Worker-denied Registry command");
  const afterHeartbeatStartupFailure = await runResult(heartbeatStartupTarget, "doctor");
  if (afterHeartbeatStartupFailure.includes("Registry lock wait exceeded")) {
    throw new Error(
      `Registry command waited on a lock left by heartbeat startup failure.\n${afterHeartbeatStartupFailure}`,
    );
  }
  assertNoTransactionArtifacts(heartbeatStartupTarget, "Registry command after heartbeat failure");

  const alpha = runWithEnv(target, { NERIO_TEST_TRANSACTION_PAUSE_MS: "2500" }, "add", "alpha");
  await waitForFixture(
    () =>
      fs.existsSync(path.join(target, ".nerio-registry-lock")) &&
      fs.readdirSync(target).some((entry) => entry.startsWith(".nerio-transaction-")),
    "the first concurrent Registry transaction",
  );
  const leaseBeforeBlockedCall = fs.statSync(path.join(target, ".nerio-registry-lock")).mtimeMs;
  await new Promise((resolve) => setTimeout(resolve, 1_500));
  if (fs.statSync(path.join(target, ".nerio-registry-lock")).mtimeMs <= leaseBeforeBlockedCall) {
    throw new Error("Registry lease stopped while the command thread was blocked.");
  }
  const beta = run(target, "add", "beta");
  await Promise.all([alpha, beta]);

  const lock = JSON.parse(fs.readFileSync(path.join(target, "nerio.lock.json"), "utf8"));
  if (
    !lock.items.alpha ||
    !lock.items.beta ||
    !lock.requestedItems.includes("alpha") ||
    !lock.requestedItems.includes("beta") ||
    !fs.existsSync(path.join(target, "components/nerio/components/alpha.ts")) ||
    !fs.existsSync(path.join(target, "components/nerio/components/beta.ts"))
  ) {
    throw new Error("Concurrent Registry installs lost source or lock metadata.");
  }
  assertNoTransactionArtifacts(target, "Concurrent Registry installs");

  const fencedTarget = path.join(tempRoot, "fenced-registry-consumer");
  fs.mkdirSync(fencedTarget);
  await run(fencedTarget, "init", "--registry", fixtureManifest);
  const fencedFailure = runFailureWithEnv(
    fencedTarget,
    { NERIO_TEST_TRANSACTION_PAUSE_MS: "2500" },
    "add",
    "alpha",
  );
  await waitForFixture(
    () =>
      fs.readdirSync(fencedTarget).some((entry) => entry.startsWith(".nerio-transaction-")) &&
      fs.readdirSync(fencedTarget).some((entry) => entry.startsWith(".nerio-registry-lock.renew-")),
    "a blocked Registry command with its renewal guard",
  );
  const renewal = fs
    .readdirSync(fencedTarget)
    .find((entry) => entry.startsWith(".nerio-registry-lock.renew-"));
  fs.rmSync(path.join(fencedTarget, renewal));
  const fencedOutput = await fencedFailure;
  if (
    !fencedOutput.includes("Recovery data remains") ||
    fs.existsSync(path.join(fencedTarget, "components/nerio/components/alpha.ts"))
  ) {
    throw new Error(`A Registry owner continued after losing its renewal guard.\n${fencedOutput}`);
  }
  await runResult(fencedTarget, "doctor");
  assertNoTransactionArtifacts(fencedTarget, "Fenced Registry transaction");

  for (const [reservedIndex, reservedTarget] of [
    ".nerio-registry-lock",
    ".NERIO-REGISTRY-LOCK",
    ".nerio-registry-lock.candidate-registry-item",
  ].entries()) {
    const reservedManifest = path.join(
      registryRoot,
      `manifest-${reservedIndex}-${reservedTarget.replaceAll(".", "-")}.json`,
    );
    const manifest = JSON.parse(fs.readFileSync(fixtureManifest, "utf8"));
    manifest.items[0].files[0].target = reservedTarget;
    fs.writeFileSync(reservedManifest, `${JSON.stringify(manifest, null, 2)}\n`);
    const reservedConsumer = path.join(
      tempRoot,
      `reserved-lock-target-${reservedIndex}-${reservedTarget.replaceAll(".", "-")}`,
    );
    fs.mkdirSync(reservedConsumer);
    await run(reservedConsumer, "init", "--registry", fixtureManifest, "--components", ".");
    const failure = await runFailure(
      reservedConsumer,
      "add",
      "alpha",
      "--registry",
      reservedManifest,
      "--overwrite",
    );
    if (!failure.includes("Registry target uses a reserved Nerio path")) {
      throw new Error(`Registry lock target was not rejected: ${reservedTarget}\n${failure}`);
    }
    assertNoTransactionArtifacts(reservedConsumer, `Reserved Registry target ${reservedTarget}`);
  }

  const readOnlyTarget = path.join(tempRoot, "read-only-registry-consumer");
  fs.mkdirSync(readOnlyTarget);
  await run(readOnlyTarget, "init", "--registry", fixtureManifest);
  fs.chmodSync(readOnlyTarget, 0o555);
  try {
    const listed = await run(readOnlyTarget, "list");
    const inspected = await run(readOnlyTarget, "info", "alpha");
    if (
      !listed.includes("alpha\tAlpha\tfoundation") ||
      !inspected.includes("alpha") ||
      fs.readdirSync(readOnlyTarget).some((entry) => entry.startsWith(".nerio-registry-lock"))
    ) {
      throw new Error("Read-only Registry inspection required project-root lock state.");
    }
  } finally {
    fs.chmodSync(readOnlyTarget, 0o755);
  }

  const invalidOwnerTarget = path.join(tempRoot, "invalid-lock-owner-consumer");
  fs.mkdirSync(invalidOwnerTarget);
  await run(invalidOwnerTarget, "init", "--registry", fixtureManifest);
  const invalidLockPath = path.join(invalidOwnerTarget, ".nerio-registry-lock");
  fs.writeFileSync(invalidLockPath, "invalid-owner\n");
  const child = spawn(process.execPath, [cli, "doctor"], {
    cwd: invalidOwnerTarget,
    stdio: "pipe",
    env: process.env,
  });
  let output = "";
  child.stdout.on("data", (chunk) => (output += chunk));
  child.stderr.on("data", (chunk) => (output += chunk));
  const closed = new Promise((resolve) => child.on("close", resolve));
  await waitForFixture(
    () =>
      fs
        .readdirSync(invalidOwnerTarget)
        .some((entry) => entry.startsWith(".nerio-registry-lock.candidate-")),
    "a command waiting on the invalid lock owner",
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (child.exitCode !== null || fs.readFileSync(invalidLockPath, "utf8") !== "invalid-owner\n") {
    throw new Error(`A missing or invalid Registry lock owner was reaped.\n${output}`);
  }
  child.kill();
  await closed;
  for (const entry of fs.readdirSync(invalidOwnerTarget)) {
    if (entry.startsWith(".nerio-registry-lock")) {
      fs.rmSync(path.join(invalidOwnerTarget, entry), { recursive: true, force: true });
    }
  }

  fs.writeFileSync(invalidLockPath, "invalid-owner\n");
  const progressingCandidate = path.join(
    invalidOwnerTarget,
    `.nerio-registry-lock.candidate-${crypto.randomUUID()}`,
  );
  fs.writeFileSync(progressingCandidate, "live-candidate\n");
  let candidateBeat = 0;
  const candidateHeartbeat = setInterval(() => {
    const skewed = new Date(Date.now() - 120_000 + candidateBeat++);
    fs.utimesSync(progressingCandidate, skewed, skewed);
  }, 250);
  const candidateChild = spawn(process.execPath, [cli, "doctor"], {
    cwd: invalidOwnerTarget,
    stdio: "pipe",
    env: process.env,
  });
  await new Promise((resolve) => setTimeout(resolve, 5_500));
  clearInterval(candidateHeartbeat);
  if (candidateChild.exitCode !== null || !fs.existsSync(progressingCandidate)) {
    throw new Error("A progressing clock-skewed Registry lock candidate was removed.");
  }
  await new Promise((resolve) => {
    candidateChild.once("close", resolve);
    candidateChild.kill();
  });
  for (const entry of fs.readdirSync(invalidOwnerTarget)) {
    if (entry.startsWith(".nerio-registry-lock")) {
      fs.rmSync(path.join(invalidOwnerTarget, entry), { recursive: true, force: true });
    }
  }

  const progressingOwner = {
    schemaVersion: "1.0.0",
    pid: process.pid,
    token: crypto.randomUUID(),
    createdAt: new Date(Date.now() - 120_000).toISOString(),
  };
  fs.writeFileSync(invalidLockPath, `${JSON.stringify(progressingOwner)}\n`);
  let ownerBeat = 0;
  const ownerHeartbeat = setInterval(() => {
    const skewed = new Date(Date.now() - 120_000 + ownerBeat++);
    fs.utimesSync(invalidLockPath, skewed, skewed);
  }, 250);
  const progressingOwnerChild = spawn(process.execPath, [cli, "doctor"], {
    cwd: invalidOwnerTarget,
    stdio: "pipe",
    env: process.env,
  });
  await new Promise((resolve) => setTimeout(resolve, 5_500));
  clearInterval(ownerHeartbeat);
  if (progressingOwnerChild.exitCode !== null || !fs.existsSync(invalidLockPath)) {
    throw new Error("A progressing clock-skewed Registry lock owner was reaped.");
  }
  await new Promise((resolve) => {
    progressingOwnerChild.once("close", resolve);
    progressingOwnerChild.kill();
  });
  for (const entry of fs.readdirSync(invalidOwnerTarget)) {
    if (entry.startsWith(".nerio-registry-lock")) {
      fs.rmSync(path.join(invalidOwnerTarget, entry), { recursive: true, force: true });
    }
  }

  const foreignNamespaceLock = {
    schemaVersion: "1.0.0",
    pid: Number.MAX_SAFE_INTEGER,
    token: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const foreignNamespaceContent = `${JSON.stringify(foreignNamespaceLock)}\n`;
  fs.writeFileSync(invalidLockPath, foreignNamespaceContent);
  const futureLeaseTime = new Date(Date.now() + 120_000);
  fs.utimesSync(invalidLockPath, futureLeaseTime, futureLeaseTime);
  const foreignChild = spawn(process.execPath, [cli, "doctor"], {
    cwd: invalidOwnerTarget,
    stdio: "pipe",
    env: process.env,
  });
  let foreignOutput = "";
  foreignChild.stdout.on("data", (chunk) => (foreignOutput += chunk));
  foreignChild.stderr.on("data", (chunk) => (foreignOutput += chunk));
  const foreignClosed = new Promise((resolve) => foreignChild.on("close", resolve));
  await waitForFixture(
    () =>
      fs
        .readdirSync(invalidOwnerTarget)
        .some((entry) => entry.startsWith(".nerio-registry-lock.candidate-")),
    "a command waiting on a fresh foreign-namespace lock",
  );
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (
    foreignChild.exitCode !== null ||
    fs.readFileSync(invalidLockPath, "utf8") !== foreignNamespaceContent
  ) {
    throw new Error(`A fresh lock with a locally missing PID was reaped.\n${foreignOutput}`);
  }
  foreignChild.kill();
  await foreignClosed;
  for (const entry of fs.readdirSync(invalidOwnerTarget)) {
    if (entry.startsWith(".nerio-registry-lock")) {
      fs.rmSync(path.join(invalidOwnerTarget, entry), { recursive: true, force: true });
    }
  }

  const resumedOwner = {
    schemaVersion: "1.0.0",
    pid: process.pid,
    token: crypto.randomUUID(),
    createdAt: new Date(Date.now() - 120_000).toISOString(),
  };
  const resumedOwnerContent = `${JSON.stringify(resumedOwner)}\n`;
  fs.writeFileSync(invalidLockPath, resumedOwnerContent);
  const resumedStaleTime = new Date(Date.now() - 120_000);
  fs.utimesSync(invalidLockPath, resumedStaleTime, resumedStaleTime);
  const resumedRenewal = path.join(
    invalidOwnerTarget,
    `.nerio-registry-lock.renew-${resumedOwner.token}`,
  );
  fs.linkSync(invalidLockPath, resumedRenewal);
  const resumedChild = spawn(process.execPath, [cli, "doctor"], {
    cwd: invalidOwnerTarget,
    stdio: "pipe",
    env: process.env,
  });
  let resumedOutput = "";
  resumedChild.stdout.on("data", (chunk) => (resumedOutput += chunk));
  resumedChild.stderr.on("data", (chunk) => (resumedOutput += chunk));
  const resumedClosed = new Promise((resolve) => resumedChild.on("close", resolve));
  await waitForFixture(
    () =>
      fs
        .readdirSync(invalidOwnerTarget)
        .some((entry) => entry.startsWith(".nerio-registry-lock.reap-")),
    "a contender electing a stale Registry lock reaper",
  );
  const resumedAt = new Date();
  fs.utimesSync(invalidLockPath, resumedAt, resumedAt);
  fs.rmSync(resumedRenewal);
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (
    resumedChild.exitCode !== null ||
    fs.readFileSync(invalidLockPath, "utf8") !== resumedOwnerContent
  ) {
    throw new Error(`A resumed fresh Registry lease was reaped.\n${resumedOutput}`);
  }
  resumedChild.kill();
  await resumedClosed;
  for (const entry of fs.readdirSync(invalidOwnerTarget)) {
    if (entry.startsWith(".nerio-registry-lock")) {
      fs.rmSync(path.join(invalidOwnerTarget, entry), { recursive: true, force: true });
    }
  }

  const reusedPidLock = {
    schemaVersion: "1.0.0",
    pid: process.pid,
    token: crypto.randomUUID(),
    createdAt: new Date(Date.now() - 120_000).toISOString(),
  };
  fs.writeFileSync(invalidLockPath, `${JSON.stringify(reusedPidLock)}\n`);
  const staleTime = new Date(Date.now() - 120_000);
  fs.utimesSync(invalidLockPath, staleTime, staleTime);
  const abandonedReapClaim = path.join(
    invalidOwnerTarget,
    `.nerio-registry-lock.reap-${crypto.randomUUID()}`,
  );
  fs.writeFileSync(abandonedReapClaim, "abandoned\n");
  fs.utimesSync(abandonedReapClaim, staleTime, staleTime);
  const abandonedCandidate = path.join(
    invalidOwnerTarget,
    `.nerio-registry-lock.candidate-${crypto.randomUUID()}`,
  );
  fs.writeFileSync(abandonedCandidate, "abandoned\n");
  fs.utimesSync(abandonedCandidate, staleTime, staleTime);
  const abandonedRenewal = path.join(
    invalidOwnerTarget,
    `.nerio-registry-lock.renew-${crypto.randomUUID()}`,
  );
  fs.linkSync(invalidLockPath, abandonedRenewal);
  await Promise.all([
    run(invalidOwnerTarget, "add", "alpha"),
    run(invalidOwnerTarget, "add", "beta"),
  ]);
  const reclaimedLock = JSON.parse(
    fs.readFileSync(path.join(invalidOwnerTarget, "nerio.lock.json"), "utf8"),
  );
  if (
    !reclaimedLock.items.alpha ||
    !reclaimedLock.items.beta ||
    !fs.existsSync(path.join(invalidOwnerTarget, "components/nerio/components/alpha.ts")) ||
    !fs.existsSync(path.join(invalidOwnerTarget, "components/nerio/components/beta.ts"))
  ) {
    throw new Error("Multi-contender stale Registry lock recovery lost source or lock metadata.");
  }
  assertNoTransactionArtifacts(invalidOwnerTarget, "Multi-contender stale Registry lock recovery");
}

async function verifyAtomicTransactions(tempRoot) {
  const registryRoot = path.join(tempRoot, "transaction-registry");
  const baselineTarget = path.join(tempRoot, "transaction-baseline");
  fs.mkdirSync(registryRoot);
  fs.mkdirSync(baselineTarget);
  const fixtureManifest = writeLifecycleRegistry(registryRoot);

  for (const point of [
    "after-staging",
    "after-commit:1",
    "after-commit:3",
    "before-lock-write",
    "during-lock-write",
  ]) {
    const target = path.join(tempRoot, `transaction-add-${point.replace(":", "-")}`);
    fs.mkdirSync(target);
    await run(target, "init", "--registry", fixtureManifest);
    const failure = await runFailureWithEnv(target, { NERIO_TEST_FAILURE: point }, "add", "button");
    if (
      !failure.includes(`Injected Registry transaction failure: ${point}`) ||
      !failure.includes("rolled back without source or lock changes") ||
      Object.keys(managedSnapshot(target)).length
    ) {
      throw new Error(`Atomic add did not fully roll back the ${point} failure.`);
    }
    assertNoTransactionArtifacts(target, `Atomic add ${point}`);
  }

  for (const point of ["after-commit:1", "after-commit:3", "before-lock-write"]) {
    const target = path.join(tempRoot, `transaction-add-crash-${point.replace(":", "-")}`);
    fs.mkdirSync(target);
    await run(target, "init", "--registry", fixtureManifest);
    await runFailureWithEnv(target, { NERIO_TEST_CRASH: point }, "add", "button");
    assertInterruptedTransaction(target, `Interrupted add ${point}`);
    discardCrashedRegistryLock(target);
    const recovery = await runResult(target, "doctor");
    if (
      !recovery.includes("Recovered interrupted Registry transaction") ||
      Object.keys(managedSnapshot(target)).length
    ) {
      throw new Error(`Interrupted add did not recover the ${point} journal.`);
    }
    assertNoTransactionArtifacts(target, `Interrupted add ${point}`);
  }

  await run(baselineTarget, "init", "--registry", fixtureManifest);
  await run(baselineTarget, "add", "button");
  const baseline = managedSnapshot(baselineTarget);
  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-transaction-update",
    sharedSource: "export const shared = 'transaction-update';\n",
    buttonSource: "export const button = 'transaction-update';\n",
    tokenSource: ":root { --fixture: transaction-update; }\n",
    includeExtra: true,
  });

  for (const point of [
    "after-staging",
    "after-commit:1",
    "after-commit:3",
    "before-lock-write",
    "during-lock-write",
  ]) {
    const target = path.join(tempRoot, `transaction-update-${point.replace(":", "-")}`);
    fs.cpSync(baselineTarget, target, { recursive: true });
    const failure = await runFailureWithEnv(
      target,
      { NERIO_TEST_FAILURE: point },
      "update",
      "button",
      "--force",
    );
    if (
      !failure.includes(`Injected Registry transaction failure: ${point}`) ||
      JSON.stringify(managedSnapshot(target)) !== JSON.stringify(baseline)
    ) {
      throw new Error(`Atomic update did not restore source and lock after ${point}.`);
    }
    assertNoTransactionArtifacts(target, `Atomic update ${point}`);
  }

  for (const point of ["after-commit:1", "after-commit:3", "before-lock-write"]) {
    const target = path.join(tempRoot, `transaction-update-crash-${point.replace(":", "-")}`);
    fs.cpSync(baselineTarget, target, { recursive: true });
    await runFailureWithEnv(target, { NERIO_TEST_CRASH: point }, "update", "button", "--force");
    assertInterruptedTransaction(target, `Interrupted update ${point}`);
    discardCrashedRegistryLock(target);
    const recovery = await runResult(target, "doctor");
    if (
      !recovery.includes("Recovered interrupted Registry transaction") ||
      JSON.stringify(managedSnapshot(target)) !== JSON.stringify(baseline)
    ) {
      throw new Error(`Interrupted update did not recover the ${point} journal.`);
    }
    assertNoTransactionArtifacts(target, `Interrupted update ${point}`);
  }

  const committedTarget = path.join(tempRoot, "transaction-add-crash-after-lock");
  fs.mkdirSync(committedTarget);
  await run(committedTarget, "init", "--registry", fixtureManifest);
  await runFailureWithEnv(
    committedTarget,
    { NERIO_TEST_CRASH: "after-lock-write" },
    "add",
    "button",
  );
  assertInterruptedTransaction(committedTarget, "Committed interrupted add");
  discardCrashedRegistryLock(committedTarget);
  const committedBeforeRecovery = managedSnapshot(committedTarget);
  await runResult(committedTarget, "doctor");
  if (
    JSON.stringify(managedSnapshot(committedTarget)) !== JSON.stringify(committedBeforeRecovery)
  ) {
    throw new Error("Recovery rolled back a transaction whose source and lock had committed.");
  }
  assertNoTransactionArtifacts(committedTarget, "Committed interrupted add");

  const invalidJournalTarget = path.join(tempRoot, "transaction-invalid-journal");
  const outsideTarget = path.join(tempRoot, "transaction-invalid-journal-outside.ts");
  fs.mkdirSync(invalidJournalTarget);
  await run(invalidJournalTarget, "init", "--registry", fixtureManifest);
  fs.writeFileSync(outsideTarget, "consumer-owned\n");
  const invalidTransaction = path.join(invalidJournalTarget, ".nerio-transaction-invalid");
  fs.mkdirSync(invalidTransaction);
  fs.writeFileSync(
    path.join(invalidTransaction, "journal.json"),
    `${JSON.stringify(
      {
        schemaVersion: "1.0.0",
        phase: "committing",
        snapshots: [
          {
            target: outsideTarget,
            root: path.join(invalidJournalTarget, "components/nerio"),
            existed: false,
            backup: null,
            mode: null,
          },
        ],
        lockSnapshot: {
          target: path.join(invalidJournalTarget, "nerio.lock.json"),
          existed: false,
          backup: null,
          mode: null,
        },
      },
      null,
      2,
    )}\n`,
  );
  const invalidRecovery = await runFailure(invalidJournalTarget, "doctor");
  if (
    !invalidRecovery.includes("outside the configured components directory") ||
    fs.readFileSync(outsideTarget, "utf8") !== "consumer-owned\n" ||
    !fs.existsSync(invalidTransaction)
  ) {
    throw new Error("Recovery accepted an unsafe journal or removed its evidence.");
  }
}

async function verifySourceLifecycle(tempRoot) {
  const registryRoot = path.join(tempRoot, "lifecycle-registry");
  const target = path.join(tempRoot, "lifecycle-consumer");
  const legacyTarget = path.join(tempRoot, "legacy-consumer");
  const symlinkTarget = path.join(tempRoot, "symlink-consumer");
  const outsideTarget = path.join(tempRoot, "outside-components");
  fs.mkdirSync(registryRoot);
  fs.mkdirSync(target);
  fs.mkdirSync(legacyTarget);
  fs.mkdirSync(symlinkTarget);
  fs.mkdirSync(outsideTarget);
  const fixtureManifest = writeLifecycleRegistry(registryRoot);

  await run(symlinkTarget, "init", "--registry", fixtureManifest);
  const symlinkComponentsRoot = path.join(symlinkTarget, "components/nerio");
  fs.mkdirSync(symlinkComponentsRoot, { recursive: true });
  fs.symlinkSync(outsideTarget, path.join(symlinkComponentsRoot, "lib"), "dir");
  const symlinkFailure = await runFailure(symlinkTarget, "add", "button");
  if (
    !symlinkFailure.includes("Registry target escapes the components directory") ||
    fs.existsSync(path.join(outsideTarget, "shared.ts")) ||
    fs.existsSync(path.join(symlinkComponentsRoot, "components/button.ts"))
  ) {
    throw new Error("CLI did not stop a source install that escaped through a symlink.");
  }

  fs.writeFileSync(
    path.join(target, "package.json"),
    `${JSON.stringify({ name: "fixture", private: true, dependencies: { react: "19.0.0" } }, null, 2)}\n`,
  );
  await run(target, "init", "--registry", fixtureManifest);
  await run(target, "add", "button");
  writeSourceTailwindSetup(target);
  const initialDoctor = await run(target, "doctor");
  if (!initialDoctor.includes(`Registry nerio-fixture ${cliVersion} (fixture-beta.0)`)) {
    throw new Error("Doctor did not report the exact installed Registry contract.");
  }

  const lockPath = path.join(target, "nerio.lock.json");
  const initialLock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  if (
    initialLock.schemaVersion !== "1.0.0" ||
    initialLock.registry.version !== cliVersion ||
    initialLock.registry.sourceRevision !== "fixture-beta.0" ||
    initialLock.registry.styleContractVersion !== "tailwind-v1" ||
    !initialLock.requestedItems.includes("button") ||
    !initialLock.items.shared ||
    !initialLock.files["components/nerio/components/button.ts"]?.hash ||
    JSON.stringify(initialLock).includes(tempRoot)
  ) {
    throw new Error("Installed source metadata is incomplete or contains machine-specific paths.");
  }
  const betaZeroLockTarget = path.join(tempRoot, "beta-zero-lock-consumer");
  fs.cpSync(target, betaZeroLockTarget, { recursive: true });
  const betaZeroLockPath = path.join(betaZeroLockTarget, "nerio.lock.json");
  const betaZeroLock = JSON.parse(fs.readFileSync(betaZeroLockPath, "utf8"));
  for (const file of Object.values(betaZeroLock.files)) delete file.integrity;
  fs.writeFileSync(betaZeroLockPath, `${JSON.stringify(betaZeroLock, null, 2)}\n`);
  await run(betaZeroLockTarget, "doctor");
  await run(betaZeroLockTarget, "update", "button");
  const migratedIntegrityLock = JSON.parse(fs.readFileSync(betaZeroLockPath, "utf8"));
  if (
    Object.values(migratedIntegrityLock.files).some(
      (file) => !/^sha256-[a-f0-9]{64}$/.test(file.integrity || ""),
    )
  ) {
    throw new Error("A beta.0 lock did not acquire Registry integrity after a safe update.");
  }
  const legacyConfigTarget = path.join(tempRoot, "legacy-config");
  fs.cpSync(target, legacyConfigTarget, { recursive: true });
  const legacyConfigPath = path.join(legacyConfigTarget, "nerio.json");
  const legacyConfig = JSON.parse(fs.readFileSync(legacyConfigPath, "utf8"));
  legacyConfig.schemaVersion = "0.1.0";
  fs.writeFileSync(legacyConfigPath, `${JSON.stringify(legacyConfig, null, 2)}\n`);
  const legacyConfigDoctor = await run(legacyConfigTarget, "doctor");
  if (!legacyConfigDoctor.includes("supported legacy 0.1.0 schema")) {
    throw new Error("Doctor did not provide migration guidance for legacy nerio.json.");
  }

  const missingMetadataTarget = path.join(tempRoot, "missing-lifecycle-metadata");
  fs.cpSync(target, missingMetadataTarget, { recursive: true });
  fs.rmSync(path.join(missingMetadataTarget, "nerio.lock.json"));
  const missingMetadataDoctor = await runFailure(missingMetadataTarget, "doctor");
  if (!missingMetadataDoctor.includes("nerio.lock.json is missing for installed source")) {
    throw new Error("Doctor did not report installed source with missing lifecycle metadata.");
  }

  const missingRegistryDependencyTarget = path.join(tempRoot, "missing-registry-dependency");
  fs.cpSync(target, missingRegistryDependencyTarget, { recursive: true });
  const incompleteLockPath = path.join(missingRegistryDependencyTarget, "nerio.lock.json");
  const incompleteLock = JSON.parse(fs.readFileSync(incompleteLockPath, "utf8"));
  delete incompleteLock.items.shared;
  fs.writeFileSync(incompleteLockPath, `${JSON.stringify(incompleteLock, null, 2)}\n`);
  const missingRegistryDependencyDoctor = await runFailure(
    missingRegistryDependencyTarget,
    "doctor",
  );
  if (!missingRegistryDependencyDoctor.includes("missing Registry dependency shared")) {
    throw new Error("Doctor did not report an incomplete installed dependency closure.");
  }

  writeLifecycleRegistry(registryRoot, {
    version: incompatibleRegistryVersion,
    sourceRevision: "fixture-version-mismatch",
  });
  const versionMismatchDoctor = await runFailure(target, "doctor");
  if (
    !versionMismatchDoctor.includes(
      `CLI ${cliVersion} and Registry ${incompatibleRegistryVersion} do not match`,
    )
  ) {
    throw new Error("Doctor did not report an incompatible Registry and CLI version.");
  }
  writeLifecycleRegistry(registryRoot);

  const unchangedDiff = await run(target, "diff", "button");
  if (!unchangedDiff.includes("unchanged\tcomponents/nerio/components/button.ts")) {
    throw new Error("Diff did not report an unchanged installed file.");
  }

  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-upstream-shared",
    sharedSource: "export const shared = 'two';\n",
  });
  const upstreamDiff = await run(target, "diff", "button");
  if (!upstreamDiff.includes("upstream changed\tcomponents/nerio/lib/shared.ts")) {
    throw new Error("Diff did not report an upstream-only shared utility change.");
  }
  await run(target, "update", "button");
  if (
    fs.readFileSync(path.join(target, "components/nerio/lib/shared.ts"), "utf8") !==
    "export const shared = 'two';\n"
  ) {
    throw new Error("Update did not apply a safe upstream-only shared utility change.");
  }

  const buttonPath = path.join(target, "components/nerio/components/button.ts");
  fs.writeFileSync(buttonPath, "export const button = 'local';\n");
  const localDiff = await run(target, "diff", "button");
  if (!localDiff.includes("locally modified\tcomponents/nerio/components/button.ts")) {
    throw new Error("Diff did not report a local-only modification.");
  }
  await run(target, "update", "button");
  if (fs.readFileSync(buttonPath, "utf8") !== "export const button = 'local';\n") {
    throw new Error("Update replaced a local-only modification.");
  }

  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-conflict",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
  });
  const conflictPreview = await run(target, "update", "button", "--dry-run");
  if (
    !conflictPreview.includes(
      "locally modified, upstream changed\tcomponents/nerio/components/button.ts",
    ) ||
    !conflictPreview.includes("require local resolution")
  ) {
    throw new Error("Dry-run did not report a deterministic source conflict.");
  }
  const conflictFailure = await runFailure(target, "update", "button");
  if (
    !conflictFailure.includes("Update stopped before writing") ||
    fs.readFileSync(buttonPath, "utf8") !== "export const button = 'local';\n"
  ) {
    throw new Error("Update did not stop before overwriting a conflicting local change.");
  }
  await run(target, "update", "button", "--force");
  if (fs.readFileSync(buttonPath, "utf8") !== "export const button = 'upstream';\n") {
    throw new Error("Intentional force update did not apply upstream source.");
  }

  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-added-dependency",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
    includeExtra: true,
  });
  const addedDependency = await run(target, "update", "button", "--dry-run");
  if (!addedDependency.includes("added\tcomponents/nerio/lib/extra.ts")) {
    throw new Error("Update did not report a newly added Registry dependency file.");
  }
  await run(target, "update", "button");
  const extraPath = path.join(target, "components/nerio/lib/extra.ts");
  if (!fs.existsSync(extraPath)) {
    throw new Error("Update did not install a newly added Registry dependency file.");
  }

  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-removed-dependency",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
  });
  const removedDependency = await run(target, "update", "button", "--dry-run");
  if (!removedDependency.includes("removed\tcomponents/nerio/lib/extra.ts")) {
    throw new Error("Update did not report a removed Registry dependency file.");
  }
  await run(target, "update", "button");
  if (fs.existsSync(extraPath)) {
    throw new Error("Update did not remove an unchanged obsolete dependency file.");
  }

  fs.writeFileSync(extraPath, "export const extra = 'consumer';\n");
  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-added-dependency-collision",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
    includeExtra: true,
  });
  const addedCollision = await runFailure(target, "update", "button");
  if (
    !addedCollision.includes("Update stopped before writing") ||
    fs.readFileSync(extraPath, "utf8") !== "export const extra = 'consumer';\n"
  ) {
    throw new Error("Update overwrote an untracked local file added by a new dependency.");
  }
  await run(target, "update", "button", "--force");
  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-removed-dependency-after-collision",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
  });
  await run(target, "update", "button");

  const tokensPath = path.join(target, "components/nerio/styles/tokens.css");
  fs.writeFileSync(tokensPath, ":root { --fixture: local; }\n");
  await run(target, "update", "button");
  if (fs.readFileSync(tokensPath, "utf8") !== ":root { --fixture: local; }\n") {
    throw new Error("Update replaced customized tokens without an upstream token change.");
  }
  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-token-conflict",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
    tokenSource: ":root { --fixture: upstream; }\n",
  });
  const tokenConflict = await runFailure(target, "update", "button");
  if (
    !tokenConflict.includes("Update stopped before writing") ||
    fs.readFileSync(tokensPath, "utf8") !== ":root { --fixture: local; }\n"
  ) {
    throw new Error("Customized token conflict was not preserved for review.");
  }

  const incompatibleManifest = writeLifecycleRegistry(registryRoot, {
    schemaVersion: "2.0.0",
    sourceRevision: "fixture-future-schema",
  });
  const incompatibleOutput = await runFailure(target, "list", "--registry", incompatibleManifest);
  if (!incompatibleOutput.includes("newer than this CLI supports")) {
    throw new Error("CLI did not reject an unsupported future Registry schema.");
  }

  const restoredManifest = writeLifecycleRegistry(registryRoot, {
    version: "1.0.0",
    sourceRevision: "fixture-1.0.0",
  });
  await run(legacyTarget, "init", "--registry", restoredManifest);
  const prereleaseConfigPath = path.join(legacyTarget, "nerio.json");
  const prereleaseConfig = JSON.parse(fs.readFileSync(prereleaseConfigPath, "utf8"));
  prereleaseConfig.schemaVersion = "0.1.0";
  fs.writeFileSync(prereleaseConfigPath, `${JSON.stringify(prereleaseConfig, null, 2)}\n`);
  for (const [source, installed] of [
    ["shared.ts", "lib/shared.ts"],
    ["tokens.css", "styles/tokens.css"],
    ["tailwind.css", "styles/tailwind.css"],
    ["button.ts", "components/button.ts"],
  ]) {
    const destination = path.join(legacyTarget, "components/nerio", installed);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(registryRoot, "source", source), destination);
  }
  await run(legacyTarget, "add", "button");
  const migratedLock = JSON.parse(
    fs.readFileSync(path.join(legacyTarget, "nerio.lock.json"), "utf8"),
  );
  if (
    migratedLock.registry.version !== "1.0.0" ||
    migratedLock.registry.sourceRevision !== "fixture-1.0.0"
  ) {
    throw new Error("Matching prerelease source could not be adopted into 1.0 metadata.");
  }

  const missingDependenciesPackage = JSON.parse(
    fs.readFileSync(path.join(target, "package.json"), "utf8"),
  );
  missingDependenciesPackage.dependencies = {};
  fs.writeFileSync(
    path.join(target, "package.json"),
    `${JSON.stringify(missingDependenciesPackage, null, 2)}\n`,
  );
  writeLifecycleRegistry(registryRoot, {
    sourceRevision: "fixture-conflict",
    sharedSource: "export const shared = 'two';\n",
    buttonSource: "export const button = 'upstream';\n",
  });
  const missingDependencyDoctor = await runFailure(target, "doctor");
  if (!missingDependencyDoctor.includes("Required source dependencies are not declared: react")) {
    throw new Error("Doctor did not report a missing required npm dependency.");
  }
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
  const srcDirTarget = path.join(tempRoot, "src-dir");
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
  fs.mkdirSync(path.join(srcDirTarget, "src", "app"), { recursive: true });

  const { server, manifestUrl } = await startRegistryServer();
  try {
    await verifySourceLifecycle(tempRoot);
    await verifyAtomicTransactions(tempRoot);
    await verifyConcurrentTransactions(tempRoot);
    await run(srcDirTarget, "init", "--registry", manifest);
    const srcDirConfig = JSON.parse(fs.readFileSync(path.join(srcDirTarget, "nerio.json"), "utf8"));
    if (srcDirConfig.components !== "src/components/nerio") {
      throw new Error("Init did not choose the import-aligned default for a src-dir application.");
    }
    await run(srcDirTarget, "add", "command-primitive");
    const srcDirCommand = fs.readFileSync(
      path.join(srcDirTarget, "src/components/nerio/components/command.tsx"),
      "utf8",
    );
    if (srcDirCommand.includes("children={renderItem}")) {
      throw new Error("Source-installed Command does not satisfy the Next.js ESLint baseline.");
    }
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
    if (
      !helpOutput.includes("nerio list") ||
      !helpOutput.includes("nerio info") ||
      !helpOutput.includes(publicCommands.cli.localInstall) ||
      !helpOutput.includes("pnpm exec nerio <command>") ||
      !helpOutput.includes(publicCommands.cli.oneOffCommands[0])
    ) {
      throw new Error(
        "Help output does not include the canonical local and one-off command model.",
      );
    }
    const addHelpOutput = await run(localTarget, "add", "--help");
    if (!addHelpOutput.includes("nerio add <component>") || !addHelpOutput.includes("--dry-run")) {
      throw new Error("Add help output does not describe the source install options.");
    }
    const initHelpOutput = await run(localTarget, "init", "--help");
    if (
      !initHelpOutput.includes("src/components/nerio") ||
      !initHelpOutput.includes("components/nerio")
    ) {
      throw new Error("Init help output does not explain the source-directory-aware default.");
    }
    const listOutput = await run(localTarget, "list");
    if (
      !listOutput.includes("button\tButton\tactions") ||
      !listOutput.includes("motion-adapter\tMotion Adapter\tfoundation") ||
      !listOutput.includes("alert\tAlert\tfeedback") ||
      !listOutput.includes("breadcrumbs\tBreadcrumbs\tnavigation") ||
      !listOutput.includes("slider\tSlider\tforms") ||
      !listOutput.includes("file-input\tFileInput\tforms") ||
      !listOutput.includes("calendar\tCalendar\tforms") ||
      !listOutput.includes("date-picker\tDatePicker\tforms")
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
    const fileInputInfoOutput = await run(localTarget, "info", "file-input");
    if (
      !fileInputInfoOutput.includes("FileInput (file-input)") ||
      !fileInputInfoOutput.includes("--n-file-input-button-background") ||
      !fileInputInfoOutput.includes("FileList") ||
      !fileInputInfoOutput.includes("components/file-input.tsx")
    ) {
      throw new Error("FileInput registry metadata did not include its native selection contract.");
    }
    const inputInfoOutput = await run(localTarget, "info", "input");
    if (
      !inputInfoOutput.includes("datetime-local") ||
      !inputInfoOutput.includes("browser-owned pickers") ||
      !inputInfoOutput.includes("valueAsDate")
    ) {
      throw new Error("Input registry metadata did not include the native temporal contract.");
    }
    const calendarInfoOutput = await run(localTarget, "info", "calendar");
    if (
      !calendarInfoOutput.includes("Calendar (calendar)") ||
      !calendarInfoOutput.includes("Registry dependencies: button") ||
      !calendarInfoOutput.includes("--n-calendar-day-background-selected") ||
      !calendarInfoOutput.includes("YYYY-MM-DD") ||
      !calendarInfoOutput.includes("components/calendar.tsx")
    ) {
      throw new Error("Calendar registry metadata did not include its ISO grid contract.");
    }
    const datePickerInfoOutput = await run(localTarget, "info", "date-picker");
    if (
      !datePickerInfoOutput.includes("DatePicker (date-picker)") ||
      !datePickerInfoOutput.includes("Registry dependencies: calendar, field, popover") ||
      !datePickerInfoOutput.includes("--n-calendar-day-background-selected") ||
      !datePickerInfoOutput.includes("YYYY-MM-DD") ||
      !datePickerInfoOutput.includes("components/date-picker.tsx")
    ) {
      throw new Error("DatePicker registry metadata did not include its ISO form contract.");
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
      !motionInfoOutput.includes("lib/motion-adapter.tsx") ||
      !motionInfoOutput.includes("accepts only children")
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
      buttonGroupInfoOutput.includes("orientation: horizontal | vertical") ||
      !buttonGroupInfoOutput.includes("independent Tab order") ||
      !buttonGroupInfoOutput.includes("lib/tailwind-cn.ts") ||
      !buttonGroupInfoOutput.includes("styles/tailwind.css")
    ) {
      throw new Error(
        "ButtonGroup registry metadata did not include the horizontal-only contract.",
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
    await run(localTarget, "add", "button");
    await run(localTarget, "add", "dialog");
    await run(localTarget, "add", "alert-dialog");
    await run(localTarget, "add", "sheet");
    await run(localTarget, "add", "sidebar-primitive");
    await run(localTarget, "add", "command-primitive");
    await run(localTarget, "add", "field");
    await run(localTarget, "add", "input-group");
    await run(localTarget, "add", "form-group");
    await run(localTarget, "add", "checkbox");
    await run(localTarget, "add", "checkbox-group");
    await run(localTarget, "add", "switch");
    await run(localTarget, "add", "toggle");
    await run(localTarget, "add", "toggle-group");
    await run(localTarget, "add", "select");
    await run(localTarget, "add", "combobox");
    await run(localTarget, "add", "multi-select");
    await run(localTarget, "add", "search-field");
    await run(localTarget, "add", "number-field");
    await run(localTarget, "add", "otp-field");
    await run(localTarget, "add", "slider");
    await run(localTarget, "add", "calendar");
    await run(localTarget, "add", "date-picker");
    await run(localTarget, "add", "file-input");
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
    await run(localTarget, "add", "collapsible");
    await run(localTarget, "add", "accordion");
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
    assertFiles(localTarget, expectedCheckboxGroupFiles);
    const checkboxGroupSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/checkbox-group.tsx"),
      "utf8",
    );
    if (
      !checkboxGroupSource.includes("@base-ui/react/checkbox-group") ||
      !checkboxGroupSource.includes("CheckboxGroupItem") ||
      !checkboxGroupSource.includes("onValueChange") ||
      !checkboxGroupSource.includes('data-slot="group"') ||
      !checkboxGroupSource.includes('addEventListener("reset"')
    ) {
      throw new Error(
        "Installed CheckboxGroup source did not preserve grouped values, composition, slots, or reset behavior.",
      );
    }
    assertFiles(localTarget, expectedToggleGroupFiles);
    const toggleGroupSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/toggle-group.tsx"),
      "utf8",
    );
    if (
      !toggleGroupSource.includes("@base-ui/react/toggle-group") ||
      !toggleGroupSource.includes("ToggleGroupItem") ||
      !toggleGroupSource.includes("multiple?: boolean") ||
      !toggleGroupSource.includes('data-slot="group"') ||
      !toggleGroupSource.includes('data-slot="item"')
    ) {
      throw new Error(
        "Installed ToggleGroup source did not preserve grouped values, composition, or public slots.",
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
      !installedMotionAdapter.includes("motionTransitions") ||
      !installedMotionAdapter.includes("skipAnimations") ||
      installedMotionAdapter.includes("<MotionConfig {...props}")
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
      !dialogSource.includes('data-slot="close"') ||
      !dialogSource.includes("export function DialogRoot") ||
      !dialogSource.includes("export const DialogContent")
    ) {
      throw new Error("Installed Dialog source is missing its convenience or compound contract.");
    }
    assertInstall(localTarget, expectedAlertDialogFiles);
    const alertDialogSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/alert-dialog.tsx"),
      "utf8",
    );
    if (
      !alertDialogSource.includes("BaseAlertDialog.Root") ||
      !alertDialogSource.includes('createAlertDialogAction("cancel")') ||
      !alertDialogSource.includes('createAlertDialogAction("action")')
    ) {
      throw new Error(
        "Installed AlertDialog source is missing its conservative response contract.",
      );
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
      !sidebarSource.includes('data-slot="sidebar-menu-button"') ||
      !sidebarLayoutSource.includes('from "../lib/compose-refs"') ||
      !sidebarLayoutSource.includes("React.forwardRef<HTMLDivElement, SidebarContentProps>") ||
      !sidebarLayoutSource.includes("React.useMemo(() => composeRefs(ref), [ref])") ||
      !sidebarSource.includes("SidebarMenuButton") ||
      !sidebarSource.includes("showArrow={false}") ||
      !sidebarSource.includes('side={side === "left" ? "right" : "left"}') ||
      !sidebarSource.includes(
        "right-[calc(var(--n-sidebar-region-padding)+env(safe-area-inset-right))]",
      ) ||
      !sidebarSource.includes(
        "bottom-[calc(var(--n-sidebar-region-padding)+env(safe-area-inset-bottom))]",
      ) ||
      !sidebarSource.includes(
        "group-data-[state=collapsed]/sidebar:size-(--n-sidebar-rail-hit-area)",
      ) ||
      sidebarSource.includes("top-1/2") ||
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
    assertFiles(localTarget, expectedToggleFiles);
    const toggleSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/toggle.tsx"),
      "utf8",
    );
    if (
      !toggleSource.includes("@base-ui/react/toggle") ||
      !toggleSource.includes("ToggleChangeEventDetails") ||
      !toggleSource.includes("data-slot={dataSlot}") ||
      !toggleSource.includes('data-icon-only={iconOnly ? "true" : undefined}') ||
      !toggleSource.includes('type={nativeButton !== false ? (type ?? "button") : undefined}')
    ) {
      throw new Error(
        "Installed Toggle source did not preserve pressed state, naming, or non-submit behavior.",
      );
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
    assertFiles(localTarget, expectedComboboxFiles);
    const comboboxSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/combobox.tsx"),
      "utf8",
    );
    if (
      !comboboxSource.includes("@base-ui/react/combobox") ||
      !comboboxSource.includes("setUncontrolledQuery") ||
      !comboboxSource.includes("setUncontrolledOpen(false)") ||
      !comboboxSource.includes("isItemEqualToValue") ||
      !comboboxSource.includes('data-slot="loading"') ||
      !comboboxSource.includes("loadingMessage")
    ) {
      throw new Error(
        "Installed Combobox source did not preserve generic identity, state, or presentation contracts.",
      );
    }
    assertFiles(localTarget, expectedMultiSelectFiles);
    const multiSelectSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/multi-select.tsx"),
      "utf8",
    );
    if (
      !multiSelectSource.includes("<MultiSelectOption<Value>, true>") ||
      !multiSelectSource.includes("pendingAnnouncementRef") ||
      !multiSelectSource.includes("setUncontrolledOpen(false)") ||
      !multiSelectSource.includes('data-slot="selected-values"') ||
      !multiSelectSource.includes('data-slot="announcement"')
    ) {
      throw new Error(
        "Installed MultiSelect source did not preserve multiple selection, reset, chip, or announcement contracts.",
      );
    }
    assertFiles(localTarget, expectedSearchFieldFiles);
    const searchFieldSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/search-field.tsx"),
      "utf8",
    );
    if (
      !searchFieldSource.includes('type="search"') ||
      !searchFieldSource.includes("setUncontrolledValue") ||
      !searchFieldSource.includes('reason: "enter"') ||
      !searchFieldSource.includes('data-slot="clear"') ||
      !searchFieldSource.includes("nativeInputRef.current?.focus()")
    ) {
      throw new Error(
        "Installed SearchField source did not preserve native search, state, clear, or focus contracts.",
      );
    }
    assertFiles(localTarget, expectedNumberFieldFiles);
    const numberFieldSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/number-field.tsx"),
      "utf8",
    );
    if (
      !numberFieldSource.includes("@base-ui/react/number-field") ||
      !numberFieldSource.includes("setUncontrolledValue") ||
      !numberFieldSource.includes("allowWheelScrub={false}") ||
      !numberFieldSource.includes('data-slot="decrement"') ||
      !numberFieldSource.includes('data-slot="increment"')
    ) {
      throw new Error(
        "Installed NumberField source did not preserve decimal state, stepper, or wheel contracts.",
      );
    }
    assertFiles(localTarget, expectedOtpFieldFiles);
    const otpFieldSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/otp-field.tsx"),
      "utf8",
    );
    if (
      !otpFieldSource.includes("@base-ui/react/otp-field") ||
      !otpFieldSource.includes("setUncontrolledValue") ||
      !otpFieldSource.includes('autoComplete = "one-time-code"') ||
      !otpFieldSource.includes('data-slot="separator"') ||
      !otpFieldSource.includes("onValueComplete")
    ) {
      throw new Error(
        "Installed OTPField source did not preserve value, autofill, grouping, or completion contracts.",
      );
    }
    assertFiles(localTarget, expectedSliderFiles);
    const sliderSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/slider.tsx"),
      "utf8",
    );
    if (
      !sliderSource.includes("@base-ui/react/slider") ||
      !sliderSource.includes("BaseSlider.Root<number>") ||
      !sliderSource.includes("eventDetails.cancel()") ||
      !sliderSource.includes('data-slot="thumb"') ||
      !sliderSource.includes("getAriaValueText")
    ) {
      throw new Error(
        "Installed Slider source did not preserve its single-value accessibility contract.",
      );
    }
    assertFiles(localTarget, expectedCalendarFiles);
    const calendarSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/calendar.tsx"),
      "utf8",
    );
    if (
      !calendarSource.includes('role="grid"') ||
      !calendarSource.includes('data-slot="day"') ||
      !calendarSource.includes("firstDayOfWeek") ||
      !calendarSource.includes("isDateDisabled") ||
      !calendarSource.includes('case "PageUp"')
    ) {
      throw new Error("Installed Calendar source did not preserve its ISO grid contract.");
    }
    assertFiles(localTarget, expectedDatePickerFiles);
    const datePickerSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/date-picker.tsx"),
      "utf8",
    );
    if (
      !datePickerSource.includes("BasePopover.Root") ||
      !datePickerSource.includes('data-slot="form-control"') ||
      !datePickerSource.includes("calendarDateToUtcDate") ||
      !datePickerSource.includes("actionsRef.current?.close()") ||
      !datePickerSource.includes("formatValue")
    ) {
      throw new Error("Installed DatePicker source did not preserve its ISO form contract.");
    }
    assertFiles(localTarget, expectedFileInputFiles);
    const fileInputSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/file-input.tsx"),
      "utf8",
    );
    if (
      !fileInputSource.includes('type="file"') ||
      !fileInputSource.includes('data-slot="file-input-root"') ||
      !fileInputSource.includes('data-slot="file-input"') ||
      !fileInputSource.includes('data-slot="file-input-icon"') ||
      !fileInputSource.includes("icon={Upload}") ||
      !fileInputSource.includes(
        '"children" | "defaultValue" | "readOnly" | "size" | "type" | "value"',
      ) ||
      !fileInputSource.includes("file:bg-(--n-file-input-button-background)")
    ) {
      throw new Error("Installed FileInput source did not preserve its native file-only contract.");
    }
    assertFiles(localTarget, expectedPhase2BFiles);
    assertFiles(localTarget, expectedDisplayFiles);
    assertFiles(localTarget, expectedNavigationFiles);
    assertFiles(localTarget, expectedFeedbackFiles);
    assertFiles(localTarget, expectedProgressFiles);
    assertFiles(localTarget, expectedOverlayAndTabsFiles);
    assertFiles(localTarget, expectedDisclosureFiles);
    const collapsibleSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/collapsible.tsx"),
      "utf8",
    );
    const accordionSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/accordion.tsx"),
      "utf8",
    );
    if (
      !collapsibleSource.includes("@base-ui/react/collapsible") ||
      !collapsibleSource.includes('data-slot="panel"') ||
      !collapsibleSource.includes("--collapsible-panel-height") ||
      !accordionSource.includes("@base-ui/react/accordion") ||
      !accordionSource.includes("value: AccordionValue") ||
      !accordionSource.includes('data-slot="header"') ||
      !accordionSource.includes("--accordion-panel-height")
    ) {
      throw new Error(
        "Installed disclosure source did not preserve Base UI state, stable values, anatomy, or height motion.",
      );
    }

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
      tableSource.includes("[&>.n-table]:min-w-max") ||
      !tableSource.includes("p-(--n-table-container-padding)") ||
      !tableSource.includes('cn("whitespace-normal break-words", className)') ||
      !tableSource.includes("[&_:is(th,td)]:align-middle") ||
      !tableSource.includes("rounded-ss-(--n-table-row-group-radius)") ||
      !tableSource.includes("[&_tbody]:before:h-(--n-table-section-gap)") ||
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
      !listSource.includes('marker = "disc"') ||
      !listSource.includes('const Root = marker === "decimal" ? "ol" : "ul"') ||
      !listSource.includes('data-slot="marker"') ||
      !listSource.includes('data-slot="item-content"') ||
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
      !dropdownSource.includes("onOpenChange") ||
      !dropdownSource.includes("DropdownMenuLinkItem") ||
      !dropdownSource.includes("DropdownMenuCheckboxItem") ||
      !dropdownSource.includes("DropdownMenuRadioGroup") ||
      !dropdownSource.includes("DropdownMenuSubContent") ||
      !dropdownSource.includes("aria-describedby={textRelationships.describedBy}") ||
      !fs.existsSync(path.join(localTarget, "components/nerio/lib/resolve-class-name.ts"))
    ) {
      throw new Error(
        "Installed DropdownMenu source is missing compound menu anatomy or support files.",
      );
    }

    const tooltipSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/tooltip.tsx"),
      "utf8",
    );
    if (
      !tooltipSource.includes("TooltipProvider") ||
      !tooltipSource.includes("<BaseTooltip.Provider {...props}>") ||
      tooltipSource.includes("<BaseTooltip.Provider>\\n      <BaseTooltip.Root")
    ) {
      throw new Error("Installed Tooltip source is missing shared delay-group composition.");
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
        "Installed Toast styles are missing the bottom-right scaled stack or unified transform coordinate system.",
      );
    }

    const alertSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/alert.tsx"),
      "utf8",
    );
    if (alertSource.includes('tone === "danger" ? "alert" : "status"')) {
      throw new Error("Installed Alert source still defaults static alerts to live regions.");
    }

    const insecure = ["--allow-insecure-http"];
    await run(urlTarget, "init", "--registry", manifestUrl, ...insecure);
    const urlListOutput = await run(urlTarget, "list", "--registry", manifestUrl, ...insecure);
    if (!urlListOutput.includes("button\tButton\tactions")) {
      throw new Error("List output did not work with an HTTP registry override.");
    }
    const urlInfoOutput = await run(
      urlTarget,
      "info",
      "button",
      "--registry",
      manifestUrl,
      ...insecure,
    );
    if (!urlInfoOutput.includes("Button (button)") || !urlInfoOutput.includes("Files:")) {
      throw new Error("Info output did not work with an HTTP registry override.");
    }
    await run(urlTarget, "add", "button", ...insecure);
    writePackageTailwindSetup(urlTarget);
    await run(urlTarget, "doctor", ...insecure);
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
