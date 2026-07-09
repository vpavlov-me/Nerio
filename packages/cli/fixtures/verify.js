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
  "components/spinner.tsx",
  "lib/cn.ts",
  "styles/button.css",
  "styles/icon.css",
  "styles/spinner.css",
];
const expectedDialogFiles = [...expectedFiles, "components/dialog.tsx", "styles/overlays.css"];
const expectedFieldFiles = [
  "components/field.tsx",
  "components/label.tsx",
  "components/form-message.tsx",
  "lib/cn.ts",
  "styles/forms.css",
];
const expectedBaseFormFiles = [
  "components/checkbox.tsx",
  "components/icon.tsx",
  "components/switch.tsx",
  "lib/cn.ts",
  "styles/forms.css",
  "styles/icon.css",
];
const expectedSelectFiles = [
  "components/select.tsx",
  "components/form-message.tsx",
  "components/icon.tsx",
  "lib/cn.ts",
  "styles/forms.css",
  "styles/select.css",
  "styles/icon.css",
];
const expectedIconButtonFiles = [...expectedFiles, "components/icon-button.tsx"];
const expectedDisplayFiles = [
  "components/card.tsx",
  "components/stat.tsx",
  "components/table.tsx",
  "lib/cn.ts",
  "styles/display.css",
];
const expectedFeedbackFiles = ["components/empty-state.tsx", "styles/feedback.css"];

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
    const dryRunOutput = await run(localTarget, "add", "input", "--dry-run");
    if (
      !dryRunOutput.includes("Would add Input") ||
      !dryRunOutput.includes("components/input.tsx")
    ) {
      throw new Error("Dry run output did not describe the input install plan.");
    }
    await run(localTarget, "add", "button");
    await run(localTarget, "add", "button");
    await run(localTarget, "add", "dialog");
    await run(localTarget, "add", "field");
    await run(localTarget, "add", "checkbox");
    await run(localTarget, "add", "switch");
    await run(localTarget, "add", "select");
    await run(localTarget, "add", "icon-button");
    await run(localTarget, "add", "stat");
    await run(localTarget, "add", "table");
    await run(localTarget, "add", "empty-state");
    assertInstall(localTarget);
    assertInstall(localTarget, expectedDialogFiles);
    assertFiles(localTarget, expectedFieldFiles);
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
    assertFiles(localTarget, expectedIconButtonFiles);
    const iconButtonSource = fs.readFileSync(
      path.join(localTarget, "components/nerio/components/icon-button.tsx"),
      "utf8",
    );
    if (
      !iconButtonSource.includes("label: string") ||
      !iconButtonSource.includes("leadingIcon={icon}") ||
      !iconButtonSource.includes("n-visually-hidden")
    ) {
      throw new Error(
        "Installed IconButton source did not preserve its label and icon slot contract.",
      );
    }
    assertFiles(localTarget, expectedDisplayFiles);
    assertFiles(localTarget, expectedFeedbackFiles);

    await run(urlTarget, "init", "--registry", manifestUrl);
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
