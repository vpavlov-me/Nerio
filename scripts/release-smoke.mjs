import { execFileSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const packageNames = [
  "@nerio/tokens",
  "@nerio/ui",
  "@nerio/adapters",
  "@nerio/registry",
  "@nerio/cli",
  "@nerio/mcp",
];
const packageDirectories = Object.fromEntries(
  packageNames.map((name) => [name, `packages/${name.slice("@nerio/".length)}`]),
);
const expectedVersion = "0.1.0-alpha.0";
const expectPublicPackages = process.env.NERIO_RELEASE_EXPECT_PUBLIC === "1";
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    stdio: options.stdio ?? "pipe",
  });
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function validatePackedPackage(name, tarball) {
  const packageJson = JSON.parse(run("tar", ["-xOf", tarball, "package/package.json"]));
  const entries = run("tar", ["-tzf", tarball]).trim().split("\n");
  const directory = packageDirectories[name];
  const expectedPrivate = !expectPublicPackages;

  if (packageJson.version !== expectedVersion || packageJson.private !== expectedPrivate) {
    throw new Error(
      `${name} must set private: ${expectedPrivate} at coordinated version ${expectedVersion}.`,
    );
  }
  if (
    packageJson.license !== "MIT" ||
    packageJson.repository?.url !== "git+https://github.com/vpavlov-me/Nerio.git" ||
    packageJson.repository?.directory !== directory ||
    packageJson.engines?.node !== ">=20.9.0"
  ) {
    throw new Error(`${name} is missing release repository, license, or Node metadata.`);
  }
  if (JSON.stringify(packageJson).includes("workspace:")) {
    throw new Error(`${name} still contains a workspace protocol in its packed manifest.`);
  }
  if (
    entries.some(
      (entry) =>
        !entry.startsWith("package/src/") &&
        entry !== "package/package.json" &&
        entry !== "package/LICENSE" &&
        entry !== "package/",
    )
  ) {
    throw new Error(`${name} includes files outside its public src and package manifest surface.`);
  }
}

const tempRoot = mkdtempSync(join(tmpdir(), "nerio-release-smoke-"));
const tarballDirectory = join(tempRoot, "packages");
const consumerDirectory = join(tempRoot, "consumer");

try {
  mkdirSync(tarballDirectory, { recursive: true });
  const tarballs = {};

  for (const name of packageNames) {
    run(pnpm, ["--filter", name, "pack", "--pack-destination", tarballDirectory]);
    const prefix = `nerio-${name.slice("@nerio/".length).replaceAll("/", "-")}-`;
    const filename = readdirSync(tarballDirectory).find(
      (entry) => entry.startsWith(prefix) && entry.endsWith(".tgz"),
    );
    if (!filename) throw new Error(`Could not find packed tarball for ${name}.`);
    const tarball = join(tarballDirectory, filename);
    validatePackedPackage(name, tarball);
    tarballs[name] = tarball;
  }

  cpSync(join(root, "fixtures/release-consumer"), consumerDirectory, { recursive: true });

  const docsPackage = readJson(join(root, "apps/docs/package.json"));
  const uiPackage = readJson(join(root, "packages/ui/package.json"));
  const adaptersPackage = readJson(join(root, "packages/adapters/package.json"));
  const consumerPackage = {
    name: "nerio-release-consumer",
    version: "0.0.0",
    private: true,
    scripts: { build: "next build" },
    dependencies: {
      ...Object.fromEntries(
        Object.entries(tarballs).map(([name, tarball]) => [name, `file:${tarball}`]),
      ),
      "@base-ui/react": uiPackage.dependencies["@base-ui/react"],
      clsx: uiPackage.dependencies.clsx,
      "lucide-react": adaptersPackage.dependencies["lucide-react"],
      next: docsPackage.dependencies.next,
      react: docsPackage.dependencies.react,
      "react-dom": docsPackage.dependencies["react-dom"],
    },
    devDependencies: {
      "@types/node": docsPackage.devDependencies["@types/node"],
      "@types/react": docsPackage.devDependencies["@types/react"],
      "@types/react-dom": docsPackage.devDependencies["@types/react-dom"],
      typescript: docsPackage.devDependencies.typescript,
    },
  };
  writeFileSync(
    join(consumerDirectory, "package.json"),
    `${JSON.stringify(consumerPackage, null, 2)}\n`,
  );
  writeFileSync(
    join(consumerDirectory, "pnpm-workspace.yaml"),
    [
      'packages: ["."]',
      "overrides:",
      ...Object.entries(tarballs).map(
        ([name, tarball]) => `  ${JSON.stringify(name)}: ${JSON.stringify(`file:${tarball}`)}`,
      ),
      "",
    ].join("\n"),
  );

  run(pnpm, ["install", "--prefer-offline", "--ignore-scripts"], { cwd: consumerDirectory });

  const cli = join(consumerDirectory, "node_modules/@nerio/cli/src/index.js");
  const manifest = join(consumerDirectory, "node_modules/@nerio/registry/src/manifest.json");
  run(process.execPath, [cli, "init", "--registry", manifest], { cwd: consumerDirectory });
  run(process.execPath, [cli, "doctor"], { cwd: consumerDirectory });
  for (const component of ["button", "select", "sheet", "toast", "pagination", "table"]) {
    run(process.execPath, [cli, "add", component], { cwd: consumerDirectory });
  }

  const installedStyles = readdirSync(join(consumerDirectory, "components/nerio/styles")).sort();
  writeFileSync(
    join(consumerDirectory, "app/source-styles.css"),
    `${installedStyles.map((file) => `@import "../components/nerio/styles/${file}";`).join("\n")}\n`,
  );

  const mcpCheck = [
    "const tools = require('@nerio/mcp');",
    "const items = tools.list_components();",
    "if (!items.some((item) => item.name === 'button')) process.exit(1);",
  ].join(" ");
  run(process.execPath, ["-e", mcpCheck], { cwd: consumerDirectory });
  run(pnpm, ["build"], {
    cwd: consumerDirectory,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  });

  console.log(
    `Release smoke passed for ${packageNames.length} ${expectPublicPackages ? "public" : "private"} packed packages, packed CLI/MCP runtime, source installs, and a clean Next.js consumer build.`,
  );
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
