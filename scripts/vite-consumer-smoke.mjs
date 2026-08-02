import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const packageNames = [
  "@nerio-ui/adapters",
  "@nerio-ui/registry",
  "@nerio-ui/tokens",
  "@nerio-ui/ui",
];
const optionalPeers = ["@tanstack/react-table", "motion", "react-hook-form", "recharts", "zod"];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error([command, ...args, "\n", result.stdout ?? "", result.stderr ?? ""].join(" "));
  }
  return result.stdout;
}

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

const tempRoot = mkdtempSync(join(tmpdir(), "nerio-vite-consumer-"));
const tarballDirectory = join(tempRoot, "packages");
const consumerDirectory = join(tempRoot, "consumer");

try {
  mkdirSync(tarballDirectory, { recursive: true });
  const tarballs = {};
  for (const name of packageNames) {
    run(pnpm, ["--filter", name, "pack", "--pack-destination", tarballDirectory]);
    const prefix = `${name.slice(1).replaceAll("/", "-")}-`;
    const filename = readdirSync(tarballDirectory).find(
      (entry) => entry.startsWith(prefix) && entry.endsWith(".tgz"),
    );
    if (!filename) throw new Error(`Could not find packed tarball for ${name}.`);
    tarballs[name] = join(tarballDirectory, filename);
  }

  cpSync(join(root, "fixtures/vite-consumer"), consumerDirectory, { recursive: true });
  const docsPackage = readJson(join(root, "apps/docs/package.json"));
  const uiPackage = readJson(join(root, "packages/ui/package.json"));
  const adaptersPackage = readJson(join(root, "packages/adapters/package.json"));
  const packageJson = {
    name: "nerio-vite-consumer",
    version: "0.0.0",
    private: true,
    type: "module",
    scripts: {
      build: "tsc --noEmit && vite build",
    },
    dependencies: {
      ...Object.fromEntries(
        Object.entries(tarballs).map(([name, tarball]) => [name, `file:${tarball}`]),
      ),
      "@base-ui/react": uiPackage.dependencies["@base-ui/react"],
      clsx: uiPackage.dependencies.clsx,
      "lucide-react": adaptersPackage.dependencies["lucide-react"],
      react: docsPackage.dependencies.react,
      "react-dom": docsPackage.dependencies["react-dom"],
      "tailwind-merge": uiPackage.dependencies["tailwind-merge"],
    },
    devDependencies: {
      "@tailwindcss/postcss": docsPackage.devDependencies["@tailwindcss/postcss"],
      "@types/react": docsPackage.devDependencies["@types/react"],
      "@types/react-dom": docsPackage.devDependencies["@types/react-dom"],
      postcss: docsPackage.devDependencies.postcss,
      tailwindcss: docsPackage.dependencies.tailwindcss,
      typescript: docsPackage.devDependencies.typescript,
      vite: "8.1.4",
    },
  };
  writeFileSync(
    join(consumerDirectory, "package.json"),
    `${JSON.stringify(packageJson, null, 2)}\n`,
  );
  writeFileSync(
    join(consumerDirectory, "pnpm-workspace.yaml"),
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

  run(pnpm, ["install", "--prefer-offline", "--ignore-scripts"], { cwd: consumerDirectory });
  for (const dependency of optionalPeers) {
    if (existsSync(join(consumerDirectory, "node_modules", ...dependency.split("/")))) {
      throw new Error(`Vite consumer unexpectedly installed optional peer ${dependency}.`);
    }
  }
  run(pnpm, ["build"], { cwd: consumerDirectory });

  const assets = readdirSync(join(consumerDirectory, "dist/assets"));
  const javascript = assets.filter((entry) => entry.endsWith(".js"));
  const css = assets.filter((entry) => entry.endsWith(".css"));
  if (!javascript.length || !css.length) {
    throw new Error("Vite consumer did not emit both JavaScript and CSS assets.");
  }
  const output = [join(consumerDirectory, "dist/index.html")]
    .concat(assets.map((entry) => join(consumerDirectory, "dist/assets", entry)))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");
  if (output.includes(root) || output.includes("workspace:")) {
    throw new Error("Vite output leaked a workspace path or workspace dependency protocol.");
  }

  console.log(
    `Vite consumer passed with ${packageNames.length} packed packages, Tailwind v4 token/UI bridges, representative static/client/form/overlay/feedback/date imports, and optional-peer isolation.`,
  );
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
