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

function assertInstall(target) {
  for (const file of expectedFiles) {
    if (!fs.existsSync(path.join(target, "components/nerio", file))) {
      throw new Error(`Missing installed file: ${file}`);
    }
  }

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
    await run(localTarget, "add", "button");
    await run(localTarget, "add", "button");
    assertInstall(localTarget);

    await run(urlTarget, "init", "--registry", manifestUrl);
    await run(urlTarget, "add", "button");
    await run(urlTarget, "doctor");
    assertInstall(urlTarget);
  } finally {
    server.close();
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  console.log("CLI fixture passed for local-path and URL registries.");
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
