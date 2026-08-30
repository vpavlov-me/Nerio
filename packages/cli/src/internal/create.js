const fs = require("node:fs");
const path = require("node:path");

const CREATE_OUTPUT_SCHEMA_VERSION = "1.0.0";
const CREATE_PROFILE = "current";
const CORE_VERSION = "1.0.0-beta.1";
const CREATE_VERSIONS = {
  next: "16.2.12",
  react: "19.2.8",
  reactDom: "19.2.8",
  tailwindcss: "4.3.3",
  typescript: "5.9.3",
  vite: "8.1.4",
};

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function pathEntryExists(target) {
  try {
    fs.lstatSync(target);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function directoryIdentity(target) {
  let stats;
  try {
    stats = fs.lstatSync(target);
  } catch {
    throw new Error("Create target parent changed during project creation.");
  }
  if (!stats.isDirectory() || stats.isSymbolicLink()) {
    throw new Error("Create target parent must remain a real directory.");
  }
  return { dev: stats.dev, ino: stats.ino };
}

function bindDirectory(target, expected) {
  try {
    process.chdir(target);
  } catch {
    throw new Error("Create target parent changed during project creation.");
  }
  assertDirectoryIdentity(".", expected);
}

function assertDirectoryIdentity(target, expected) {
  const current = directoryIdentity(target);
  if (current.dev !== expected.dev || current.ino !== expected.ino) {
    throw new Error("Create target parent changed during project creation.");
  }
}

function hasDirectoryIdentity(target, expected) {
  try {
    const current = fs.lstatSync(target);
    return (
      current.isDirectory() &&
      !current.isSymbolicLink() &&
      current.dev === expected.dev &&
      current.ino === expected.ino
    );
  } catch {
    return false;
  }
}

function bindCreateParent(directory) {
  const parentSegments = directory.split("/").slice(0, -1);
  let identity = directoryIdentity(".");
  bindDirectory(".", identity);
  const traversed = [];

  for (const segment of parentSegments) {
    traversed.push(segment);
    let stats;
    try {
      stats = fs.lstatSync(segment);
    } catch (error) {
      if (error?.code !== "ENOENT") {
        throw new Error("Create target parent changed during project creation.");
      }
      try {
        fs.mkdirSync(segment);
        stats = fs.lstatSync(segment);
      } catch {
        throw new Error("Create target parent changed during project creation.");
      }
    }
    if (stats.isSymbolicLink()) {
      throw new Error(`Create directory contains a symlinked parent: ${traversed.join("/")}`);
    }
    if (!stats.isDirectory()) {
      throw new Error("Create target parent must remain a real directory.");
    }
    identity = { dev: stats.dev, ino: stats.ino };
    bindDirectory(segment, identity);
  }

  return identity;
}

function commonPackage(name, scripts, dependencies, devDependencies, type, nodeEngine = ">=22") {
  return json({
    name,
    version: "0.0.0",
    private: true,
    ...(type ? { type } : {}),
    engines: { node: nodeEngine },
    scripts,
    dependencies: {
      "@nerio-ui/tokens": CORE_VERSION,
      "@nerio-ui/ui": CORE_VERSION,
      react: CREATE_VERSIONS.react,
      "react-dom": CREATE_VERSIONS.reactDom,
      tailwindcss: CREATE_VERSIONS.tailwindcss,
      ...dependencies,
    },
    devDependencies: {
      "@tailwindcss/postcss": CREATE_VERSIONS.tailwindcss,
      "@types/react": "19.2.18",
      "@types/react-dom": "19.2.4",
      postcss: "8.5.24",
      typescript: CREATE_VERSIONS.typescript,
      ...devDependencies,
    },
  });
}

const sharedFiles = {
  ".gitignore": ["node_modules", ".next", "dist", "*.log", ""].join("\n"),
  "pnpm-workspace.yaml": ['packages: ["."]', ""].join("\n"),
  "postcss.config.mjs": [
    "export default {",
    "  plugins: {",
    '    "@tailwindcss/postcss": {},',
    "  },",
    "};",
    "",
  ].join("\n"),
};

function nextFiles(name) {
  return {
    ...sharedFiles,
    "package.json": commonPackage(
      name,
      { build: "next build", dev: "next dev", start: "next start" },
      { next: CREATE_VERSIONS.next },
      { "@types/node": "26.1.2" },
    ),
    "next-env.d.ts": [
      '/// <reference types="next" />',
      '/// <reference types="next/image-types/global" />',
      "",
      "// This file is generated and managed by Next.js.",
      "",
    ].join("\n"),
    "tsconfig.json": json({
      compilerOptions: {
        target: "ES2022",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: false,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "react-jsx",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./*"] },
      },
      include: ["next-env.d.ts", ".next/types/**/*.ts", "**/*.ts", "**/*.tsx"],
      exclude: ["node_modules"],
    }),
    "app/globals.css": [
      '@import "tailwindcss";',
      '@import "@nerio-ui/tokens/tailwind.css";',
      '@import "@nerio-ui/ui/styles.css";',
      '@source "../node_modules/@nerio-ui/ui/dist";',
      "",
    ].join("\n"),
    "app/layout.tsx": [
      'import type { ReactNode } from "react";',
      'import "./globals.css";',
      "",
      "export default function RootLayout({ children }: { children: ReactNode }) {",
      "  return (",
      '    <html lang="en" data-theme="purple" data-mode="system" data-density="comfortable">',
      "      <body>{children}</body>",
      "    </html>",
      "  );",
      "}",
      "",
    ].join("\n"),
    "app/page.tsx": [
      'import { Card, CardContent, CardHeader, CardTitle } from "@nerio-ui/ui";',
      'import { ClientExample } from "./client-example";',
      "",
      "export default function Page() {",
      "  return (",
      '    <main className="mx-auto grid min-h-screen max-w-3xl content-center gap-6 p-8">',
      '      <h1 className="text-3xl font-semibold text-n-text">Nerio Next.js starter</h1>',
      "      <Card>",
      "        <CardHeader>",
      "          <CardTitle>Server-safe package entrypoint</CardTitle>",
      "        </CardHeader>",
      "        <CardContent>",
      "          <p>Static components stay in the default server-safe entrypoint.</p>",
      "        </CardContent>",
      "      </Card>",
      "      <ClientExample />",
      "    </main>",
      "  );",
      "}",
      "",
    ].join("\n"),
    "app/client-example.tsx": [
      '"use client";',
      "",
      'import { useState } from "react";',
      'import { Button } from "@nerio-ui/ui/client";',
      "",
      "export function ClientExample() {",
      "  const [ready, setReady] = useState(false);",
      "  return (",
      '    <div className="grid gap-3">',
      "      <Button onClick={() => setReady((current) => !current)}>Toggle status</Button>",
      '      <p aria-live="polite">{ready ? "Nerio is ready." : "Ready to test."}</p>',
      "    </div>",
      "  );",
      "}",
      "",
    ].join("\n"),
    "README.md": [
      `# ${name}`,
      "",
      "Generated by Nerio for the maintained Next.js package-mode profile.",
      "",
      "```bash",
      "pnpm install",
      "pnpm dev",
      "```",
      "",
      "Import static components from `@nerio-ui/ui` and interactive components from `@nerio-ui/ui/client`.",
      "The compiled packages do not require `transpilePackages`.",
      "",
    ].join("\n"),
  };
}

function viteFiles(name) {
  return {
    ...sharedFiles,
    "package.json": commonPackage(
      name,
      { build: "tsc --noEmit && vite build", dev: "vite", preview: "vite preview" },
      {},
      { vite: CREATE_VERSIONS.vite },
      "module",
      ">=22.12.0",
    ),
    "index.html": [
      "<!doctype html>",
      '<html lang="en" data-theme="purple" data-mode="system" data-density="comfortable">',
      "  <head>",
      '    <meta charset="UTF-8" />',
      '    <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      "    <title>Nerio Vite starter</title>",
      "  </head>",
      "  <body>",
      '    <div id="root"></div>',
      '    <script type="module" src="/src/main.tsx"></script>',
      "  </body>",
      "</html>",
      "",
    ].join("\n"),
    "tsconfig.json": json({
      compilerOptions: {
        target: "ES2022",
        useDefineForClassFields: true,
        lib: ["ES2022", "DOM", "DOM.Iterable"],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: "ESNext",
        moduleResolution: "Bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
      },
      include: ["src", "vite.config.ts"],
    }),
    "vite.config.ts": [
      'import { defineConfig } from "vite";',
      "",
      "export default defineConfig({});",
      "",
    ].join("\n"),
    "src/styles.css": [
      '@import "tailwindcss";',
      '@import "@nerio-ui/tokens/tailwind.css";',
      '@import "@nerio-ui/ui/styles.css";',
      '@source "../node_modules/@nerio-ui/ui/dist";',
      "",
    ].join("\n"),
    "src/main.tsx": [
      'import { StrictMode } from "react";',
      'import { createRoot } from "react-dom/client";',
      'import { App } from "./app";',
      'import "./styles.css";',
      "",
      'const root = document.getElementById("root");',
      'if (!root) throw new Error("Missing #root element.");',
      "",
      "createRoot(root).render(",
      "  <StrictMode>",
      "    <App />",
      "  </StrictMode>,",
      ");",
      "",
    ].join("\n"),
    "src/app.tsx": [
      'import { useState } from "react";',
      'import { Card, CardContent, CardHeader, CardTitle } from "@nerio-ui/ui";',
      'import { Button } from "@nerio-ui/ui/client";',
      "",
      "export function App() {",
      "  const [ready, setReady] = useState(false);",
      "  return (",
      '    <main className="mx-auto grid min-h-screen max-w-3xl content-center gap-6 p-8">',
      '      <h1 className="text-3xl font-semibold text-n-text">Nerio Vite starter</h1>',
      "      <Card>",
      "        <CardHeader>",
      "          <CardTitle>Compiled package entrypoints</CardTitle>",
      "        </CardHeader>",
      "        <CardContent>",
      "          <p>Tailwind scans the installed Nerio UI output directly.</p>",
      "        </CardContent>",
      "      </Card>",
      "      <Button onClick={() => setReady((current) => !current)}>Toggle status</Button>",
      '      <p aria-live="polite">{ready ? "Nerio is ready." : "Ready to test."}</p>',
      "    </main>",
      "  );",
      "}",
      "",
    ].join("\n"),
    "README.md": [
      `# ${name}`,
      "",
      "Generated by Nerio for the maintained Vite package-mode profile.",
      "",
      "```bash",
      "pnpm install",
      "pnpm dev",
      "```",
      "",
      "The Tailwind stylesheet scans compiled `@nerio-ui/ui` output and imports the public token and residual-style bridges.",
      "",
    ].join("\n"),
  };
}

const frameworks = { next: nextFiles, vite: viteFiles };

function createCreateCommand(services) {
  const { cwd, positionalArguments, option, hasFlag, isWithin } = services;

  function validateDirectory(value) {
    if (!value || positionalArguments.length !== 1) {
      throw new Error(
        "Usage: nerio create <directory> --framework <next|vite> [--profile current] [--json]",
      );
    }
    if (path.isAbsolute(value))
      throw new Error("Create directory must be relative to the current directory.");
    const target = path.resolve(cwd, value);
    if (target === path.resolve(cwd) || !isWithin(cwd, target)) {
      throw new Error("Create directory must stay inside the current directory.");
    }
    const directory = path.relative(cwd, target);
    const segments = directory.split(path.sep);
    if (segments.some((segment) => !/^[a-z0-9][a-z0-9-]*$/.test(segment))) {
      throw new Error(
        "Every project directory segment must use lowercase letters, numbers, and hyphens.",
      );
    }
    return { directory: segments.join("/"), name: segments.at(-1), target };
  }

  async function create() {
    const requestedDirectory = positionalArguments[0];
    const { directory, name, target } = validateDirectory(requestedDirectory);
    const framework = option("--framework");
    if (!Object.hasOwn(frameworks, framework)) {
      throw new Error("Unsupported framework. Use --framework next or --framework vite.");
    }
    const profile = option("--profile") || CREATE_PROFILE;
    if (profile !== CREATE_PROFILE) {
      throw new Error(`Unsupported profile: ${profile}. Use --profile ${CREATE_PROFILE}.`);
    }
    const files = frameworks[framework](name);
    const orderedFiles = Object.keys(files).sort();
    const parent = path.dirname(target);
    const parentIdentity = bindCreateParent(directory);
    const targetEntry = path.basename(target);
    if (pathEntryExists(targetEntry)) throw new Error(`Create target already exists: ${directory}`);
    const staging = fs.mkdtempSync(".nerio-create-");
    try {
      for (const file of orderedFiles) {
        const destination = path.join(staging, file);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, files[file], { flag: "wx" });
      }
      if (process.env.NERIO_TEST_CREATE_FAILURE === "before-commit") {
        throw new Error("Injected project creation failure: before-commit");
      }
      if (pathEntryExists(targetEntry))
        throw new Error(`Create target already exists: ${directory}`);
      fs.chmodSync(staging, 0o777 & ~process.umask());
      const committedIdentity = directoryIdentity(staging);
      fs.renameSync(staging, targetEntry);
      try {
        assertDirectoryIdentity(parent, parentIdentity);
      } catch (error) {
        if (hasDirectoryIdentity(targetEntry, committedIdentity)) {
          fs.rmSync(targetEntry, { recursive: true, force: true });
        }
        throw error;
      }
    } finally {
      fs.rmSync(staging, { recursive: true, force: true });
    }

    const result = {
      schemaVersion: CREATE_OUTPUT_SCHEMA_VERSION,
      command: "create",
      status: "created",
      directory,
      framework,
      mode: "package",
      profile,
      files: orderedFiles,
      nextSteps: [`cd ${directory}`, "pnpm install", "pnpm dev"],
    };
    if (hasFlag("--json")) console.log(JSON.stringify(result));
    else {
      console.log(`Created ${framework} package-mode project in ${directory}.`);
      console.log(`Next: cd ${directory} && pnpm install && pnpm dev`);
    }
  }

  return { create };
}

module.exports = {
  CORE_VERSION,
  CREATE_OUTPUT_SCHEMA_VERSION,
  CREATE_PROFILE,
  CREATE_VERSIONS,
  bindCreateParent,
  assertDirectoryIdentity,
  bindDirectory,
  createCreateCommand,
  directoryIdentity,
  hasDirectoryIdentity,
};
