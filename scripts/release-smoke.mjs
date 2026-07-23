import { execFileSync } from "node:child_process";
import {
  cpSync,
  existsSync,
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
  "@nerio-ui/tokens",
  "@nerio-ui/ui",
  "@nerio-ui/adapters",
  "@nerio-ui/registry",
  "@nerio-ui/cli",
  "@nerio-ui/mcp",
];
const packageDirectories = Object.fromEntries(
  packageNames.map((name) => [name, `packages/${name.slice("@nerio-ui/".length)}`]),
);
const packageContracts = {
  "@nerio-ui/tokens": {
    homepage: "https://nerio.vpavlov.com/docs/foundations/tokens",
    exports: [".", "./styles.css", "./tailwind.css"],
    dependencies: [],
    peers: [],
    sideEffects: ["./src/styles.css", "./src/tailwind.css"],
  },
  "@nerio-ui/ui": {
    homepage: "https://nerio.vpavlov.com/docs/components/button",
    exports: [".", "./client", "./styles.css"],
    dependencies: [
      "@base-ui/react",
      "@nerio-ui/adapters",
      "@nerio-ui/tokens",
      "clsx",
      "tailwind-merge",
    ],
    peers: ["react", "react-dom", "tailwindcss"],
    sideEffects: ["./src/styles.css"],
  },
  "@nerio-ui/adapters": {
    homepage: "https://nerio.vpavlov.com/docs/foundations/icons",
    exports: ["./icons", "./table", "./charts", "./forms", "./schema", "./motion"],
    dependencies: ["lucide-react"],
    peers: ["@tanstack/react-table", "motion", "react", "react-hook-form", "recharts", "zod"],
    sideEffects: false,
  },
  "@nerio-ui/registry": {
    homepage: "https://nerio.vpavlov.com/docs/registry",
    exports: [".", "./manifest.json", "./public-commands.json"],
    dependencies: ["@nerio-ui/adapters", "@nerio-ui/tokens", "@nerio-ui/ui"],
    peers: [],
  },
  "@nerio-ui/cli": {
    homepage: "https://nerio.vpavlov.com/docs/registry",
    exports: [],
    dependencies: ["@nerio-ui/registry"],
    peers: [],
    bin: ["nerio"],
  },
  "@nerio-ui/mcp": {
    homepage: "https://nerio.vpavlov.com/docs/ai",
    exports: ["."],
    dependencies: ["@modelcontextprotocol/sdk", "@nerio-ui/registry", "zod"],
    peers: [],
    bin: ["nerio-mcp"],
  },
};
const expectedVersion = "0.1.0-alpha.1";
const expectPublicPackages = process.env.NERIO_RELEASE_EXPECT_PUBLIC === "1";
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const publicCommands = readJson(join(root, "packages/registry/src/public-commands.json"));

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

function readBuiltCss(directory) {
  const buildDirectory = join(directory, ".next");
  return readdirSync(buildDirectory, { recursive: true })
    .filter((entry) => typeof entry === "string" && entry.endsWith(".css"))
    .map((entry) => readFileSync(join(buildDirectory, entry), "utf8"))
    .join("\n");
}

function assertSingleTokenPayload(css, mode) {
  const declarations = css.match(/--n-gray-0\s*:/g) ?? [];
  if (declarations.length !== 1) {
    throw new Error(
      `${mode} consumer emitted ${declarations.length} token payloads; expected exactly one.`,
    );
  }
}

function sortedKeys(value) {
  return Object.keys(value ?? {}).sort();
}

function assertKeys(name, field, actual, expected) {
  if (JSON.stringify(sortedKeys(actual)) !== JSON.stringify([...expected].sort())) {
    throw new Error(
      `${name} ${field} must be ${expected.join(", ") || "empty"}; received ${sortedKeys(actual).join(", ") || "empty"}.`,
    );
  }
}

function validatePackedPackage(name, tarball) {
  const packageJson = JSON.parse(run("tar", ["-xOf", tarball, "package/package.json"]));
  const entries = run("tar", ["-tzf", tarball]).trim().split("\n");
  const directory = packageDirectories[name];
  const contract = packageContracts[name];
  const expectedPrivate = !expectPublicPackages;

  if (packageJson.version !== expectedVersion) {
    throw new Error(`${name} must use coordinated version ${expectedVersion}.`);
  }
  if (packageJson.private !== expectedPrivate) {
    throw new Error(
      `${name} must set private: ${expectedPrivate} for this release validation mode.`,
    );
  }
  if (
    !packageJson.description ||
    packageJson.license !== "MIT" ||
    packageJson.repository?.url !== "git+https://github.com/vpavlov-me/Nerio.git" ||
    packageJson.repository?.directory !== directory ||
    packageJson.homepage !== contract.homepage ||
    packageJson.bugs?.url !== "https://github.com/vpavlov-me/Nerio/issues" ||
    packageJson.engines?.node !== ">=20.9.0"
  ) {
    throw new Error(`${name} is missing coordinated release metadata.`);
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

  if (JSON.stringify(packageJson.files) !== JSON.stringify(["src"])) {
    throw new Error(`${name} must pack only its src directory.`);
  }
  assertKeys(name, "exports", packageJson.exports, contract.exports);
  assertKeys(name, "dependencies", packageJson.dependencies, contract.dependencies);
  assertKeys(name, "peer dependencies", packageJson.peerDependencies, contract.peers);
  assertKeys(name, "bins", packageJson.bin, contract.bin ?? []);
  if (
    Object.hasOwn(contract, "sideEffects") &&
    JSON.stringify(packageJson.sideEffects) !== JSON.stringify(contract.sideEffects)
  ) {
    throw new Error(`${name} has an unexpected sideEffects contract.`);
  }

  const forbiddenEntry = entries.find((entry) =>
    /(?:^|\/)(?:apps|fixtures|templates|pro|\.env)(?:\/|$)|premium-theme/i.test(entry),
  );
  if (forbiddenEntry) {
    throw new Error(`${name} includes forbidden internal or Pro content: ${forbiddenEntry}.`);
  }
  for (const entry of entries.filter(
    (item) => item.startsWith("package/src/") && !item.endsWith("/"),
  )) {
    const content = run("tar", ["-xOf", tarball, entry]);
    if (/BEGIN [A-Z ]*PRIVATE KEY|(?:NPM|GITHUB|VERCEL)_TOKEN\s*=/i.test(content)) {
      throw new Error(`${name} includes secret-like content in ${entry}.`);
    }
  }

  if (name === "@nerio-ui/adapters") {
    const expectedSubpaths = ["./icons", "./table", "./charts", "./forms", "./schema", "./motion"];
    const optionalPeers = ["@tanstack/react-table", "recharts", "react-hook-form", "zod", "motion"];
    if (packageJson.exports?.["."]) {
      throw new Error("@nerio-ui/adapters must not restore the coupled root entrypoint.");
    }
    for (const subpath of expectedSubpaths) {
      if (!packageJson.exports?.[subpath]) {
        throw new Error(`@nerio-ui/adapters is missing the ${subpath} export.`);
      }
    }
    for (const peer of optionalPeers) {
      if (!packageJson.peerDependenciesMeta?.[peer]?.optional || packageJson.dependencies?.[peer]) {
        throw new Error(`${peer} must remain an optional @nerio-ui/adapters peer.`);
      }
    }
  }
  if (name === "@nerio-ui/registry") {
    const manifest = JSON.parse(run("tar", ["-xOf", tarball, "package/src/manifest.json"]));
    if (
      manifest.schemaVersion !== "1.0.0" ||
      manifest.version !== expectedVersion ||
      manifest.sourceRevision !== `v${expectedVersion}` ||
      manifest.styleContractVersion !== "tailwind-v1" ||
      !Array.isArray(manifest.items)
    ) {
      throw new Error(
        "@nerio-ui/registry must pack coordinated immutable version, revision, style, and item metadata.",
      );
    }
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
    const prefix = `${name.slice(1).replaceAll("/", "-")}-`;
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
      "tailwind-merge": uiPackage.dependencies["tailwind-merge"],
      "lucide-react": adaptersPackage.dependencies["lucide-react"],
      next: docsPackage.dependencies.next,
      react: docsPackage.dependencies.react,
      "react-dom": docsPackage.dependencies["react-dom"],
    },
    devDependencies: {
      "@tailwindcss/postcss": docsPackage.devDependencies["@tailwindcss/postcss"],
      "@types/node": docsPackage.devDependencies["@types/node"],
      "@types/react": docsPackage.devDependencies["@types/react"],
      "@types/react-dom": docsPackage.devDependencies["@types/react-dom"],
      postcss: docsPackage.devDependencies.postcss,
      tailwindcss: docsPackage.dependencies.tailwindcss,
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

  for (const dependency of [
    "@tanstack/react-table",
    "recharts",
    "react-hook-form",
    "zod",
    "motion",
  ]) {
    if (existsSync(join(consumerDirectory, "node_modules", ...dependency.split("/")))) {
      throw new Error(
        `Clean UI consumer unexpectedly installed optional adapter peer ${dependency}.`,
      );
    }
  }

  const runLocalCli = (...args) =>
    run(pnpm, ["exec", "nerio", ...args], { cwd: consumerDirectory });
  runLocalCli("init");
  const consumerConfig = readJson(join(consumerDirectory, "nerio.json"));
  if (consumerConfig.registry !== "@nerio-ui/registry/manifest.json") {
    throw new Error("Packed CLI did not default to its immutable packaged Registry.");
  }
  runLocalCli("list");
  runLocalCli("info", "button");
  runLocalCli("add", "button", "--dry-run");
  runLocalCli("doctor");
  for (const component of [
    "typography",
    "button",
    "button-group",
    "input",
    "input-group",
    "textarea",
    "label",
    "field",
    "form-message",
    "form-group",
    "checkbox",
    "radio-group",
    "switch",
    "select",
    "sheet",
    "toast",
    "sidebar-primitive",
    "command-primitive",
    "pagination",
    "table",
    "item",
    "list",
  ]) {
    runLocalCli("add", component);
  }
  const installedState = readJson(join(consumerDirectory, "nerio.lock.json"));
  if (
    installedState.registry.version !== expectedVersion ||
    installedState.registry.sourceRevision !== `v${expectedVersion}` ||
    !installedState.requestedItems.includes("button") ||
    JSON.stringify(installedState).includes(consumerDirectory)
  ) {
    throw new Error("Packed CLI did not record portable exact installed-source metadata.");
  }
  runLocalCli("diff");
  runLocalCli("update", "--dry-run");

  const oneOffDirectory = join(tempRoot, "one-off-consumer");
  mkdirSync(oneOffDirectory, { recursive: true });
  const runOneOffCli = (args, options = {}) =>
    run(
      pnpm,
      [
        "dlx",
        "--package",
        tarballs["@nerio-ui/cli"],
        "--package",
        tarballs["@nerio-ui/registry"],
        "nerio",
        ...args,
      ],
      { cwd: oneOffDirectory, ...options },
    );
  runOneOffCli(["init"]);
  runOneOffCli(["add", "button"], {
    env: {
      NERIO_REGISTRY: join(consumerDirectory, "node_modules/@nerio-ui/registry/src/manifest.json"),
    },
  });
  const oneOffButton = join(oneOffDirectory, "components/nerio/components/button.tsx");
  if (!existsSync(oneOffButton)) {
    throw new Error("One-off packed CLI did not install Button through the public bin.");
  }
  const oneOffConfig = readJson(join(oneOffDirectory, "nerio.json"));
  if (oneOffConfig.registry !== "@nerio-ui/registry/manifest.json") {
    throw new Error("One-off packed CLI did not create the canonical Registry configuration.");
  }

  run(pnpm, ["build"], {
    cwd: consumerDirectory,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  });

  const noPreflightCss = readBuiltCss(consumerDirectory);
  assertSingleTokenPayload(noPreflightCss, "No-Preflight package");
  if (!/box-sizing\s*:\s*border-box/.test(noPreflightCss)) {
    throw new Error("No-Preflight package CSS is missing scoped Nerio box sizing.");
  }
  if (!/font-family\s*:\s*inherit/.test(noPreflightCss)) {
    throw new Error("No-Preflight package CSS is missing native-control font inheritance.");
  }

  writeFileSync(
    join(consumerDirectory, "app/globals.css"),
    [
      '@import "tailwindcss";',
      '@import "@nerio-ui/tokens/tailwind.css";',
      '@import "@nerio-ui/ui/styles.css";',
      '@source "../node_modules/@nerio-ui/ui/src";',
      "",
    ].join("\n"),
  );
  rmSync(join(consumerDirectory, ".next"), { recursive: true, force: true });
  runLocalCli("doctor");
  run(pnpm, ["build"], {
    cwd: consumerDirectory,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  });
  assertSingleTokenPayload(readBuiltCss(consumerDirectory), "Preflight package");

  const installedStyles = readdirSync(join(consumerDirectory, "components/nerio/styles")).sort();
  writeFileSync(
    join(consumerDirectory, "app/source-styles.css"),
    `${installedStyles.map((file) => `@import "../components/nerio/styles/${file}";`).join("\n")}\n`,
  );
  writeFileSync(
    join(consumerDirectory, "app/globals.css"),
    [
      "@layer theme, base, components, utilities;",
      '@import "tailwindcss/theme.css" layer(theme);',
      '@import "tailwindcss/utilities.css" layer(utilities);',
      '@import "./source-styles.css";',
      "",
    ].join("\n"),
  );
  rmSync(join(consumerDirectory, ".next"), { recursive: true, force: true });

  const mcpFixture = join(root, "packages/mcp/fixtures/verify.js");
  run(process.execPath, [mcpFixture, "--command", pnpm, "--", "exec", "nerio-mcp"], {
    cwd: consumerDirectory,
  });
  run(pnpm, ["build"], {
    cwd: consumerDirectory,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  });
  assertSingleTokenPayload(readBuiltCss(consumerDirectory), "Source-install");

  console.log(
    `Release smoke passed for ${packageNames.length} ${expectPublicPackages ? "public" : "private"} packed packages, strict package contracts, documented ${publicCommands.cli.localCommands.length}-command local CLI workflow, one-off CLI execution, packaged MCP-bin discovery, representative source installs, and a clean Next.js consumer build.`,
  );
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
