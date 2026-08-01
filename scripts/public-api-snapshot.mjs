import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const packageDirectories = ["tokens", "adapters", "registry", "ui", "cli", "mcp"];
const entrypoints = {
  "@nerio-ui/adapters/icons": "packages/adapters/src/icons.ts",
  "@nerio-ui/adapters/table": "packages/adapters/src/table.ts",
  "@nerio-ui/adapters/charts": "packages/adapters/src/charts.ts",
  "@nerio-ui/adapters/forms": "packages/adapters/src/forms.ts",
  "@nerio-ui/adapters/schema": "packages/adapters/src/schema.ts",
  "@nerio-ui/adapters/motion": "packages/adapters/src/motion.tsx",
  "@nerio-ui/tokens": "packages/tokens/src/index.ts",
  "@nerio-ui/registry": "packages/registry/src/index.ts",
  "@nerio-ui/ui": "packages/ui/src/index.ts",
  "@nerio-ui/ui/client": "packages/ui/src/client.ts",
  "@nerio-ui/mcp": "packages/mcp/src/tool-runtime.d.ts",
};

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, stable(nested)]),
    );
  }
  return value;
}

function assertNoAlphaCompatibilityDebt() {
  const checks = [
    ["packages/ui/src", /@deprecated|\bIconButton\b|variant\??:\s*BadgeVariant/],
    ["packages/adapters/src", /@deprecated|\bLucideIcon\b/],
    ["packages/registry/src/manifest.json", /"name":\s*"icon-button"|deprecated-compatibility/],
    ["data/component-catalog.json", /"name":\s*"IconButton"|deprecated-compatibility/],
  ];
  const visit = (path) => {
    if (!existsSync(path)) return [];
    return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
      const entryPath = join(path, entry.name);
      return entry.isDirectory() ? visit(entryPath) : [entryPath];
    });
  };

  for (const [relativePath, pattern] of checks) {
    const path = join(root, relativePath);
    const files = relativePath.endsWith(".json") ? [path] : visit(path);
    for (const file of files) {
      if (pattern.test(readFileSync(file, "utf8"))) {
        throw new Error(
          `Core 1.0 public source still contains alpha compatibility debt in ${relative(root, file)}.`,
        );
      }
    }
  }

  if (
    /loadingLabel\??:/.test(
      readFileSync(join(root, "packages/ui/src/components/button.tsx"), "utf8"),
    )
  ) {
    throw new Error(
      "Core 1.0 public source still contains alpha compatibility debt in packages/ui/src/components/button.tsx.",
    );
  }
}

function normalizedDependencies(dependencies = {}) {
  return Object.fromEntries(
    Object.entries(dependencies).map(([name, range]) => [
      name,
      range.startsWith("workspace:") ? "workspace" : range,
    ]),
  );
}

function packageContracts() {
  return Object.fromEntries(
    packageDirectories.map((directory) => {
      const packageJson = readJson(join(root, "packages", directory, "package.json"));
      return [
        packageJson.name,
        {
          bin: packageJson.bin ?? null,
          dependencies: normalizedDependencies(packageJson.dependencies),
          engines: packageJson.engines ?? null,
          exports: packageJson.exports ?? null,
          files: packageJson.files ?? null,
          peerDependencies: packageJson.peerDependencies ?? null,
          peerDependenciesMeta: packageJson.peerDependenciesMeta ?? null,
          sideEffects: packageJson.sideEffects ?? null,
        },
      ];
    }),
  );
}

function entrypointContracts() {
  const files = Object.values(entrypoints).map((path) => join(root, path));
  const program = ts.createProgram(files, {
    allowJs: true,
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
  });
  const checker = program.getTypeChecker();
  const flags =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
    ts.TypeFormatFlags.WriteArrowStyleSignature;

  return Object.fromEntries(
    Object.entries(entrypoints).map(([entrypoint, path]) => {
      const source = program.getSourceFile(join(root, path));
      const moduleSymbol = source && checker.getSymbolAtLocation(source);
      if (!source || !moduleSymbol) {
        throw new Error(`Could not inspect public entrypoint ${entrypoint} at ${path}.`);
      }

      const exports = checker
        .getExportsOfModule(moduleSymbol)
        .map((exported) => {
          const symbol =
            exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
          const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0] ?? source;
          const kind = symbol.flags & ts.SymbolFlags.Value ? "value" : "type";
          const type =
            kind === "value"
              ? checker.getTypeOfSymbolAtLocation(symbol, declaration)
              : checker.getDeclaredTypeOfSymbol(symbol);
          return {
            kind,
            name: exported.getName(),
            signature: checker.typeToString(type, declaration, flags),
          };
        })
        .sort((left, right) => left.name.localeCompare(right.name));

      return [entrypoint, exports];
    }),
  );
}

function tokenContracts() {
  const source = readFileSync(join(root, "packages/tokens/src/styles.css"), "utf8");
  return [...new Set(source.match(/--n-[a-z0-9-]+/g) ?? [])].sort();
}

function registryContracts() {
  const manifest = readJson(join(root, "packages/registry/src/manifest.json"));
  return {
    items: manifest.items
      .map((item) => ({
        baseUiPrimitives: item.baseUiPrimitives ?? [],
        category: item.category,
        dependencies: item.dependencies,
        docsPath: item.docsPath ?? null,
        files: item.files.map((file) =>
          typeof file === "string"
            ? file
            : { role: file.role, source: file.source, target: file.target },
        ),
        name: item.name,
        optionalPeerDependencies: item.optionalPeerDependencies ?? [],
        registryDependencies: item.registryDependencies,
        requiredTokens: item.requiredTokens,
        slots: item.slots,
        states: item.states ?? [],
        variants: item.variants,
      }))
      .sort((left, right) => left.name.localeCompare(right.name)),
    name: manifest.name,
    schemaVersion: manifest.schemaVersion,
    styleContractVersion: manifest.styleContractVersion,
  };
}

function runCli(...args) {
  const result = spawnSync(process.execPath, [join(root, "packages/cli/src/index.js"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Could not inspect CLI ${args.join(" ")}:\n${result.stdout}${result.stderr}`);
  }
  return result.stdout.replaceAll(/0\.1\.0-[a-z]+\.\d+/g, "<version>").trim();
}

function cliContracts() {
  const runtime = readFileSync(join(root, "packages/cli/src/index.js"), "utf8");
  const constant = (name) => runtime.match(new RegExp(`const ${name} = ([^;]+);`))?.[1] ?? null;
  return {
    configSchemas: constant("SUPPORTED_CONFIG_SCHEMAS"),
    defaultRegistry: constant("DEFAULT_REGISTRY"),
    help: Object.fromEntries(
      ["root", "init", "add", "diff", "update", "list", "info", "doctor"].map((command) => [
        command,
        command === "root" ? runCli("--help") : runCli(command, "--help"),
      ]),
    ),
    lockSchema: constant("STATE_SCHEMA_VERSION"),
  };
}

function mcpContracts() {
  const runtimePath = join(root, "packages/mcp/src/tool-runtime.js");
  const script = `
    const runtime = require(${JSON.stringify(runtimePath)});
    const usage = runtime.get_component_usage("button");
    process.stdout.write(JSON.stringify({
      tools: Object.keys(runtime).sort(),
      registryKeys: Object.keys(runtime.get_registry()).sort(),
      listItemKeys: Object.keys(runtime.list_components()[0]).sort(),
      componentKeys: Object.keys(runtime.get_component("button")).sort(),
      usageKeys: Object.keys(usage).sort()
    }));
  `;
  const result = spawnSync(process.execPath, ["-e", script], { cwd: root, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(`Could not inspect MCP contracts:\n${result.stdout}${result.stderr}`);
  }
  return JSON.parse(result.stdout);
}

function docsRoutes() {
  const appRoot = join(root, "apps/docs/app");
  const routes = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      if (entry.isFile() && entry.name === "page.tsx") {
        const route = `/${relative(appRoot, dirname(path)).replaceAll("\\", "/")}`.replace(
          /\/$/,
          "",
        );
        routes.push(route || "/");
      }
    }
  };
  visit(appRoot);
  routes.push("/llms.txt");
  return [...new Set(routes)].sort();
}

export function createSnapshot() {
  assertNoAlphaCompatibilityDebt();
  return stable({
    baseline: "core-1.0",
    cli: cliContracts(),
    docsRoutes: docsRoutes(),
    entrypoints: entrypointContracts(),
    mcp: mcpContracts(),
    packages: packageContracts(),
    registry: registryContracts(),
    schemaVersion: 1,
    tokens: tokenContracts(),
  });
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function hash(value) {
  return createHash("sha256").update(serialize(value)).digest("hex");
}

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function main() {
  const snapshotPath = resolve(
    argument("--snapshot") ?? join(root, "quality/public-api-snapshot.json"),
  );
  const approvalPath = resolve(
    argument("--approval") ?? join(root, "quality/public-api-snapshot-approval.json"),
  );
  const current = createSnapshot();

  if (process.argv.includes("--write")) {
    const classification = argument("--classification");
    const approvedBy = argument("--approved-by");
    const issue = argument("--issue");
    if (!["breaking", "feature", "fix"].includes(classification) || !approvedBy || !issue) {
      throw new Error(
        "Snapshot updates require --classification breaking|feature|fix, --approved-by, and --issue.",
      );
    }
    writeFileSync(snapshotPath, serialize(current));
    writeFileSync(
      approvalPath,
      serialize({
        approvedBy,
        baseline: current.baseline,
        classification,
        issue,
        schemaVersion: 1,
        snapshotSha256: hash(current),
      }),
    );
    console.log(`Updated ${relative(root, snapshotPath)} with ${classification} approval.`);
    return;
  }

  if (!existsSync(snapshotPath) || !existsSync(approvalPath)) {
    throw new Error("Public API snapshot or approval record is missing.");
  }
  const expected = readJson(snapshotPath);
  const approval = readJson(approvalPath);
  if (serialize(expected) !== serialize(current)) {
    const temporary = mkdtempSync(join(tmpdir(), "nerio-api-snapshot-"));
    writeFileSync(join(temporary, "current.json"), serialize(current));
    writeFileSync(join(temporary, "expected.json"), serialize(expected));
    const changed = Object.keys(current).filter(
      (key) => serialize(current[key]) !== serialize(expected[key]),
    );
    rmSync(temporary, { recursive: true, force: true });
    throw new Error(
      `Public API snapshot changed in: ${changed.join(", ")}. Classify the SemVer impact and update the reviewed snapshot explicitly.`,
    );
  }
  if (approval.snapshotSha256 !== hash(expected)) {
    throw new Error("Public API snapshot approval hash does not match the reviewed snapshot.");
  }
  console.log(
    `Public API snapshot verified (${approval.classification}, issue #${approval.issue}, ${approval.snapshotSha256.slice(0, 12)}).`,
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
