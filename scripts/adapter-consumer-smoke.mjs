import { execFileSync, spawnSync } from "node:child_process";
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
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const optionalAdapters = {
  table: "@tanstack/react-table",
  charts: "recharts",
  forms: "react-hook-form",
  schema: "zod",
};

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
    stdio: options.stdio ?? "pipe",
  });
}

function runResult(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd ?? root,
    encoding: "utf8",
    env: { ...process.env, ...options.env },
  });
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function lockedAdapterPeerVersions() {
  const [adapter] = JSON.parse(
    run(pnpm, ["list", "--filter", "@nerio-ui/adapters", "--depth", "0", "--json"]),
  );
  const versions = {};
  for (const peer of Object.values(optionalAdapters)) {
    const version = adapter?.devDependencies?.[peer]?.version;
    if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? "")) {
      throw new Error(`Cannot read an exact locked fixture version for ${peer}.`);
    }
    versions[peer] = version;
  }
  return versions;
}

function pack(name, destination) {
  run(pnpm, ["--filter", name, "pack", "--pack-destination", destination]);
  const prefix = `${name.slice(1).replaceAll("/", "-")}-`;
  const filename = readdirSync(destination).find(
    (entry) => entry.startsWith(prefix) && entry.endsWith(".tgz"),
  );
  if (!filename) throw new Error(`Could not find packed tarball for ${name}.`);
  return join(destination, filename);
}

function writeConsumerPackage(directory, manifest, overrides = {}) {
  writeFileSync(join(directory, "package.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  writeFileSync(
    join(directory, "pnpm-workspace.yaml"),
    [
      'packages: ["."]',
      "settings:",
      "  autoInstallPeers: false",
      "overrides:",
      ...Object.entries(overrides).map(
        ([name, path]) => `  ${JSON.stringify(name)}: ${JSON.stringify(`file:${path}`)}`,
      ),
      "",
    ].join("\n"),
  );
}

function assertPackedAdapterContract(tarball) {
  const manifest = JSON.parse(run("tar", ["-xOf", tarball, "package/package.json"]));
  const entries = run("tar", ["-tzf", tarball]).trim().split("\n");
  const expectedExports = ["./icons", "./table", "./charts", "./forms", "./schema"];

  if (manifest.exports?.["."]) {
    throw new Error("@nerio-ui/adapters must not expose a coupled root entrypoint.");
  }
  for (const subpath of expectedExports) {
    if (!manifest.exports?.[subpath]) {
      throw new Error(`Packed @nerio-ui/adapters is missing ${subpath}.`);
    }
  }
  for (const peer of Object.values(optionalAdapters)) {
    if (!manifest.peerDependencies?.[peer] || !manifest.peerDependenciesMeta?.[peer]?.optional) {
      throw new Error(`${peer} must be an optional peer dependency.`);
    }
    if (manifest.dependencies?.[peer]) {
      throw new Error(`${peer} must not remain a mandatory dependency.`);
    }
  }
  const expectedSources = ["icons.ts", "table.ts", "charts.ts", "forms.ts", "schema.ts"];
  for (const source of expectedSources) {
    if (!entries.includes(`package/src/${source}`)) {
      throw new Error(`Packed @nerio-ui/adapters is missing src/${source}.`);
    }
  }
  if (entries.includes("package/src/index.ts")) {
    throw new Error("Packed @nerio-ui/adapters includes the unsupported monolithic root source.");
  }
}

const docsPackage = readJson(join(root, "apps/docs/package.json"));
const uiPackage = readJson(join(root, "packages/ui/package.json"));
const lockedPeerVersions = lockedAdapterPeerVersions();
const tempRoot = mkdtempSync(join(tmpdir(), "nerio-adapter-consumers-"));
const tarballDirectory = join(tempRoot, "packages");

try {
  mkdirSync(tarballDirectory, { recursive: true });
  const tarballs = {
    "@nerio-ui/adapters": pack("@nerio-ui/adapters", tarballDirectory),
    "@nerio-ui/tokens": pack("@nerio-ui/tokens", tarballDirectory),
    "@nerio-ui/ui": pack("@nerio-ui/ui", tarballDirectory),
  };
  assertPackedAdapterContract(tarballs["@nerio-ui/adapters"]);

  const iconsConsumer = join(tempRoot, "icons-ui");
  cpSync(join(root, "fixtures/adapter-consumers/icons-ui"), iconsConsumer, { recursive: true });
  writeConsumerPackage(
    iconsConsumer,
    {
      name: "nerio-icons-ui-consumer",
      version: "0.0.0",
      private: true,
      scripts: { build: "next build", typecheck: "tsc --noEmit" },
      dependencies: {
        ...Object.fromEntries(
          Object.entries(tarballs).map(([name, tarball]) => [name, `file:${tarball}`]),
        ),
        "@base-ui/react": uiPackage.dependencies["@base-ui/react"],
        clsx: uiPackage.dependencies.clsx,
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
    },
    tarballs,
  );
  run(pnpm, ["install", "--prefer-offline", "--ignore-scripts"], { cwd: iconsConsumer });
  for (const peer of Object.values(optionalAdapters)) {
    if (existsSync(join(iconsConsumer, "node_modules", ...peer.split("/")))) {
      throw new Error(`Icons/UI-only consumer unexpectedly installed ${peer}.`);
    }
  }
  run(pnpm, ["typecheck"], { cwd: iconsConsumer });
  run(pnpm, ["build"], {
    cwd: iconsConsumer,
    env: { NEXT_TELEMETRY_DISABLED: "1" },
  });

  const optionalConsumer = join(tempRoot, "optional-subpaths");
  cpSync(join(root, "fixtures/adapter-consumers/optional-subpaths"), optionalConsumer, {
    recursive: true,
  });
  writeConsumerPackage(optionalConsumer, {
    name: "nerio-optional-adapter-consumer",
    version: "0.0.0",
    private: true,
    dependencies: {
      "@nerio-ui/adapters": `file:${tarballs["@nerio-ui/adapters"]}`,
      react: docsPackage.dependencies.react,
      "react-dom": docsPackage.dependencies["react-dom"],
    },
    devDependencies: {
      "@types/react": docsPackage.devDependencies["@types/react"],
      typescript: docsPackage.devDependencies.typescript,
    },
  });
  run(pnpm, ["install", "--prefer-offline", "--ignore-scripts"], { cwd: optionalConsumer });

  for (const [subpath, peer] of Object.entries(optionalAdapters)) {
    const configPath = join(optionalConsumer, `tsconfig.${subpath}.json`);
    writeFileSync(
      configPath,
      `${JSON.stringify({ extends: "./tsconfig.json", include: [`./${subpath}.ts*`] }, null, 2)}\n`,
    );
    const missingPeer = runResult(pnpm, ["exec", "tsc", "--project", configPath], {
      cwd: optionalConsumer,
    });
    const missingOutput = `${missingPeer.stdout ?? ""}\n${missingPeer.stderr ?? ""}`;
    if (missingPeer.status === 0 || !missingOutput.includes(peer)) {
      throw new Error(
        `${subpath} must fail predictably for missing optional peer ${peer}.\n${missingOutput}`,
      );
    }
    run(
      pnpm,
      [
        "add",
        "--save-exact",
        "--prefer-offline",
        "--ignore-workspace-root-check",
        `${peer}@${lockedPeerVersions[peer]}`,
      ],
      { cwd: optionalConsumer },
    );
    run(pnpm, ["exec", "tsc", "--project", configPath], { cwd: optionalConsumer });
  }

  console.log(
    "Adapter consumer smoke passed for the packed subpath contract, icons/UI-only isolation, and optional table, charts, forms, and schema peers.",
  );
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
