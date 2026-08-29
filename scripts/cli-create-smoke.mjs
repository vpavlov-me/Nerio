import { spawn, spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const binaryExtension = process.platform === "win32" ? ".cmd" : "";
const cli = join(root, "packages/cli/dist/index.cjs");
const packages = ["@nerio-ui/tokens", "@nerio-ui/adapters", "@nerio-ui/ui"];
const tempRoot = mkdtempSync(join(tmpdir(), "nerio-create-smoke-"));
const packageDirectory = join(tempRoot, "packages");

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", stdio: "pipe" });
  if (result.status !== 0) {
    throw new Error([command, ...args, "\n", result.stdout ?? "", result.stderr ?? ""].join(" "));
  }
  return result.stdout;
}

function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => (error ? reject(error) : resolvePort(port)));
    });
  });
}

async function waitForPage(url, expected, child) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) throw new Error(`Preview process exited before serving ${url}.`);
    try {
      const response = await fetch(url);
      const body = await response.text();
      if (response.ok && body.includes(expected)) return;
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  throw new Error(`Timed out waiting for generated preview ${url}.`);
}

async function browserSmoke(directory, command, args, expected) {
  const port = await availablePort();
  const child = spawn(command, [...args, String(port)], {
    cwd: directory,
    env: process.env,
    stdio: "ignore",
  });
  try {
    await waitForPage(`http://127.0.0.1:${port}`, expected, child);
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolveExit) => {
      if (child.exitCode !== null) resolveExit();
      else child.once("exit", resolveExit);
    });
  }
}

function configurePackedDependencies(directory, tarballs) {
  const packagePath = join(directory, "package.json");
  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
  for (const name of ["@nerio-ui/tokens", "@nerio-ui/ui"]) {
    packageJson.dependencies[name] = `file:${tarballs[name]}`;
  }
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);
  writeFileSync(
    join(directory, "pnpm-workspace.yaml"),
    [
      'packages: ["."]',
      "settings:",
      "  autoInstallPeers: false",
      "overrides:",
      ...Object.entries(tarballs).map(
        ([name, tarball]) => `  ${JSON.stringify(name)}: ${JSON.stringify(`file:${tarball}`)}`,
      ),
      "",
    ].join("\n"),
  );
}

try {
  mkdirSync(packageDirectory);
  run(pnpm, ["build:public-packages"]);
  run(pnpm, ["--filter", "@nerio-ui/cli", "build"]);

  const tarballs = {};
  for (const name of packages) {
    run(pnpm, ["--filter", name, "pack", "--pack-destination", packageDirectory]);
    const prefix = `${name.slice(1).replaceAll("/", "-")}-`;
    const filename = readdirSync(packageDirectory).find(
      (entry) => entry.startsWith(prefix) && entry.endsWith(".tgz"),
    );
    if (!filename) throw new Error(`Could not find packed archive for ${name}.`);
    tarballs[name] = join(packageDirectory, filename);
    if (!statSync(tarballs[name]).isFile()) throw new Error(`Invalid packed archive for ${name}.`);
  }

  const nextDirectory = join(tempRoot, "generated-next");
  const viteDirectory = join(tempRoot, "generated-vite");
  run(process.execPath, [cli, "create", "generated-next", "--framework", "next"], tempRoot);
  run(process.execPath, [cli, "create", "generated-vite", "--framework", "vite"], tempRoot);

  for (const directory of [nextDirectory, viteDirectory]) {
    configurePackedDependencies(directory, tarballs);
    run(pnpm, ["install", "--prefer-offline", "--ignore-scripts"], directory);
    run(pnpm, ["build"], directory);
  }

  await browserSmoke(
    nextDirectory,
    join(nextDirectory, "node_modules", ".bin", `next${binaryExtension}`),
    ["start", "--hostname", "127.0.0.1", "--port"],
    "Nerio Next.js starter",
  );
  await browserSmoke(
    viteDirectory,
    join(viteDirectory, "node_modules", ".bin", `vite${binaryExtension}`),
    ["preview", "--host", "127.0.0.1", "--port"],
    "Nerio Vite starter",
  );

  console.log(
    "CLI create smoke passed for clean Next.js and Vite builds, packed Nerio artifacts, Tailwind package scanning, and served previews.",
  );
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
