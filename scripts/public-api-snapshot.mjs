import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { format, resolveConfig } from "prettier";
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

function responseShape(value) {
  if (Array.isArray(value)) {
    const shapes = new Map(
      value.map((item) => {
        const shape = stable(responseShape(item));
        return [JSON.stringify(shape), shape];
      }),
    );
    return [...shapes.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, shape]) => shape);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, nested]) => [key, responseShape(nested)]),
    );
  }
  return value === null ? "null" : typeof value;
}

function groupedResponseShapes(responses) {
  const groups = new Map();
  for (const [name, response] of Object.entries(responses)) {
    const shape = stable(responseShape(response));
    const key = JSON.stringify(shape);
    const group = groups.get(key) ?? { components: [], shape };
    group.components.push(name);
    groups.set(key, group);
  }
  return [...groups.values()]
    .map((group) => ({ ...group, components: group.components.sort() }))
    .sort((left, right) => left.components[0].localeCompare(right.components[0]));
}

function jsDocComment(comment) {
  if (typeof comment === "string") return comment.replace(/\s+/g, " ").trim();
  if (!Array.isArray(comment)) return "";
  return comment
    .map((part) => (typeof part === "string" ? part : (part.text ?? "")))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function declarationDeprecations(declaration) {
  return ts
    .getJSDocTags(declaration)
    .filter((tag) => tag.tagName.text === "deprecated")
    .map((tag) => jsDocComment(tag.comment));
}

export function collectDeprecationsFromSource(sourceText) {
  const source = ts.createSourceFile(
    "deprecation-contract.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );
  const deprecations = [];
  const visit = (node) => {
    deprecations.push(...declarationDeprecations(node));
    ts.forEachChild(node, visit);
  };
  visit(source);
  return [...new Set(deprecations)].sort();
}

export function assertNoAlphaCompatibilityDebt(sourceRoot = root) {
  const checks = [
    ["packages/ui/src/components/button.tsx", /\bloadingLabel\??:|["'](?:subtle|destructive)["']/],
    ["packages/ui/src/components/badge.tsx", /\bBadgeVariant\b|\bvariant\??:|\bicon\??:/],
    ["packages/ui/src/components/select.tsx", /\bonChange\??:/],
    ["packages/ui/src/components/radio-group.tsx", /\bonChange\??:/],
    [
      "packages/ui/src/components/pagination.tsx",
      /export type Pagination(?:Page|Ellipsis)\s*=\s*\{(?:(?!\n\};)[\s\S])*?["']aria-label["']\??:/,
    ],
    ["packages/ui/src/components/icon.tsx", /\babsoluteStrokeWidth\??:/],
    ["packages/ui/src/components/list.tsx", /\bordered\??:/],
    ["packages/ui/src/index.ts", /\bIconButton\b|\bBadgeVariant\b/],
    ["packages/ui/src/client.ts", /\bIconButton\b/],
    ["packages/adapters/src/icons.ts", /\bLucideIcon\b/],
    ["packages/registry/src/manifest.json", /"name":\s*"icon-button"|deprecated-compatibility/],
    ["data/component-catalog.json", /"name":\s*"IconButton"|deprecated-compatibility/],
  ];
  for (const [relativePath, pattern] of checks) {
    const path = join(sourceRoot, relativePath);
    const files = existsSync(path) ? [path] : [];
    for (const file of files) {
      if (pattern.test(readFileSync(file, "utf8"))) {
        throw new Error(
          `Core 1.0 public source still contains alpha compatibility debt in ${relative(sourceRoot, file)}.`,
        );
      }
    }
  }

  if (existsSync(join(sourceRoot, "packages/ui/src/components/icon-button.tsx"))) {
    throw new Error(
      "Core 1.0 public source still contains alpha compatibility debt in packages/ui/src/components/icon-button.tsx.",
    );
  }
}

function packageContracts() {
  return Object.fromEntries(
    packageDirectories.map((directory) => {
      const packageJson = readJson(join(root, "packages", directory, "package.json"));
      return [
        packageJson.name,
        {
          bin: packageJson.bin ?? null,
          dependencies: packageJson.dependencies ?? {},
          engines: packageJson.engines ?? null,
          exports: packageJson.exports ?? null,
          files: packageJson.files ?? null,
          peerDependencies: packageJson.peerDependencies ?? null,
          peerDependenciesMeta: packageJson.peerDependenciesMeta ?? null,
          sideEffects: packageJson.sideEffects ?? null,
          type: packageJson.type ?? null,
        },
      ];
    }),
  );
}

function entrypointContracts() {
  const files = Object.values(entrypoints).map((path) => join(root, path));
  const program = ts.createProgram(files, {
    allowJs: true,
    baseUrl: root,
    esModuleInterop: true,
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    paths: {
      "@nerio-ui/adapters/icons": ["packages/adapters/src/icons.ts"],
    },
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
  });
  const checker = program.getTypeChecker();
  const flags =
    ts.TypeFormatFlags.NoTruncation |
    ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope |
    ts.TypeFormatFlags.WriteArrowStyleSignature;
  const normalizeSignature = (signature) =>
    signature.replace(/(?:[A-Za-z]:)?[^"]*\/node_modules\/\.pnpm\/[^/]+\/node_modules\//g, "");
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed, removeComments: true });
  const symbolDeprecations = (...symbols) =>
    [
      ...new Set(
        symbols.flatMap((symbol) => symbol.declarations ?? []).flatMap(declarationDeprecations),
      ),
    ].sort();
  const nestedDeprecations = (declaration) => {
    const source = declaration.getSourceFile();
    const markers = [];
    const visit = (node, parentPath) => {
      const name =
        "name" in node && node.name && typeof node.name.getText === "function"
          ? node.name.getText(source)
          : null;
      const path = name && parentPath.at(-1) !== name ? [...parentPath, name] : parentPath;
      for (const comment of declarationDeprecations(node)) {
        markers.push({
          comment,
          target: path.join(".") || ts.SyntaxKind[node.kind],
        });
      }
      ts.forEachChild(node, (child) => visit(child, path));
    };
    visit(declaration, []);
    return markers
      .map(({ comment, target }) => `/** @deprecated ${target}${comment ? ` — ${comment}` : ""} */`)
      .sort();
  };
  const typeDefinition = (symbol) => {
    const definitions = new Set();
    const visited = new Set();
    const visit = (candidate) => {
      const resolved =
        candidate.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(candidate) : candidate;
      if (visited.has(resolved)) return;
      visited.add(resolved);

      for (const declaration of resolved.declarations ?? []) {
        if (
          !declaration.getSourceFile().fileName.startsWith(join(root, "packages")) ||
          (!ts.isInterfaceDeclaration(declaration) && !ts.isTypeAliasDeclaration(declaration))
        ) {
          continue;
        }
        const deprecations = nestedDeprecations(declaration).join(" ");
        const printed = printer
          .printNode(ts.EmitHint.Unspecified, declaration, declaration.getSourceFile())
          .replace(/\s+/g, " ")
          .trim();
        definitions.add(`${deprecations}${deprecations ? " " : ""}${printed}`);
        const inspect = (node) => {
          if (ts.isTypeReferenceNode(node)) {
            const referenced = checker.getSymbolAtLocation(node.typeName);
            if (referenced) visit(referenced);
          } else if (ts.isExpressionWithTypeArguments(node)) {
            const referenced = checker.getSymbolAtLocation(node.expression);
            if (referenced) visit(referenced);
          }
          ts.forEachChild(node, inspect);
        };
        inspect(declaration);
      }
    };
    visit(symbol);
    return [...definitions].sort();
  };

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
            definition: kind === "type" ? typeDefinition(symbol) : [],
            deprecations: symbolDeprecations(exported, symbol),
            kind,
            name: exported.getName(),
            signature: normalizeSignature(checker.typeToString(type, declaration, flags)),
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
  const publicCommands = JSON.parse(
    normalizeCliOutput(
      JSON.stringify(readJson(join(root, "packages/registry/src/public-commands.json"))),
    ),
  );
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
            : {
                integrity: file.integrity,
                role: file.role,
                source: file.source,
                target: file.target,
              },
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
    publicCommands,
    schemaVersion: manifest.schemaVersion,
    styleContractVersion: manifest.styleContractVersion,
  };
}

export function normalizeCliOutput(output) {
  return output
    .replace(
      /(@nerio-ui\/[a-z0-9-]+)@\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?/g,
      "$1@<version>",
    )
    .trim();
}

function runCli(...args) {
  const result = spawnSync(process.execPath, [join(root, "packages/cli/src/index.js"), ...args], {
    cwd: root,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Could not inspect CLI ${args.join(" ")}:\n${result.stdout}${result.stderr}`);
  }
  return normalizeCliOutput(result.stdout);
}

function generatedLockContract() {
  const temporary = mkdtempSync(join(tmpdir(), "nerio-lock-contract-"));
  const cliPath = join(root, "packages/cli/src/index.js");
  const registryPath = join(root, "packages/registry/src/manifest.json");
  const execute = (...args) => {
    const result = spawnSync(process.execPath, [cliPath, ...args], {
      cwd: temporary,
      encoding: "utf8",
      timeout: 15_000,
    });
    if (result.status !== 0) {
      throw new Error(
        `Could not generate representative nerio.lock.json:\n${result.stdout}${result.stderr}${result.error?.message ?? ""}`,
      );
    }
  };

  try {
    execute("init", "--registry", registryPath, "--components", "components/nerio");
    execute("add", "button", "--registry", registryPath);
    const state = readJson(join(temporary, "nerio.lock.json"));
    const stateShape = Object.fromEntries(
      Object.entries(state)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, value]) => {
          if (key !== "items" && key !== "files") return [key, responseShape(value)];
          return [
            key,
            {
              recordValues: responseShape(Object.values(value)),
            },
          ];
        }),
    );
    return stateShape;
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
}

function cliContracts() {
  const cliSource = join(root, "packages/cli/src");
  const cliInternalSource = join(cliSource, "internal");
  const runtime = [
    join(cliSource, "index.js"),
    ...readdirSync(cliInternalSource, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith(".js"))
      .map((entry) => join(cliInternalSource, entry.name))
      .sort(),
  ]
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");
  const constant = (name) =>
    runtime
      .match(new RegExp(`const ${name} = ([^;]+);`))?.[1]
      ?.replace(/\s+/g, " ")
      .trim() ?? null;
  return {
    addOutputSchema: constant("ADD_OUTPUT_SCHEMA_VERSION"),
    inspectionOutputSchema: constant("INSPECTION_OUTPUT_SCHEMA_VERSION"),
    migrationOutputSchema: constant("MIGRATION_OUTPUT_SCHEMA_VERSION"),
    removeOutputSchema: constant("REMOVE_OUTPUT_SCHEMA_VERSION"),
    configSchemas: constant("SUPPORTED_CONFIG_SCHEMAS"),
    defaultRegistry: constant("DEFAULT_REGISTRY"),
    help: Object.fromEntries(
      [
        "root",
        "init",
        "add",
        "remove",
        "migrate",
        "diff",
        "update",
        "list",
        "info",
        "search",
        "view",
        "docs",
        "doctor",
      ].map((command) => [
        command,
        command === "root" ? runCli("--help") : runCli(command, "--help"),
      ]),
    ),
    lockSchema: constant("STATE_SCHEMA_VERSION"),
    lockStateShape: generatedLockContract(),
  };
}

function mcpContracts() {
  const runtimePath = join(root, "packages/mcp/src/tool-runtime.js");
  const script = `
    const runtime = require(${JSON.stringify(runtimePath)});
    const names = runtime.list_components().map((component) => component.name).sort();
    process.stdout.write(JSON.stringify({
      tools: Object.keys(runtime).sort(),
      registry: runtime.get_registry(),
      list: runtime.list_components(),
      components: Object.fromEntries(names.map((name) => [name, runtime.get_component(name)])),
      usage: Object.fromEntries(names.map((name) => [name, runtime.get_component_usage(name)]))
    }));
  `;
  const result = spawnSync(process.execPath, ["-e", script], {
    cwd: root,
    encoding: "utf8",
    timeout: 15_000,
  });
  if (result.status !== 0) {
    throw new Error(
      `Could not inspect MCP contracts:\n${result.stdout}${result.stderr}${result.error?.message ?? ""}`,
    );
  }
  const helperResponses = JSON.parse(result.stdout);
  const helpers = {
    tools: helperResponses.tools,
    registryShape: responseShape(helperResponses.registry),
    listShape: responseShape(helperResponses.list),
    componentShapes: groupedResponseShapes(helperResponses.components),
    usageShapes: groupedResponseShapes(helperResponses.usage),
  };
  const serverPath = join(root, "packages/mcp/src/server.js");
  const wireScript = `
    const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
    const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
    (async () => {
      const client = new Client({ name: "nerio-api-snapshot", version: "1.0.0" });
      try {
        await client.connect(new StdioClientTransport({
          command: process.execPath,
          args: [${JSON.stringify(serverPath)}]
        }));
        const listed = await client.listTools();
        process.stdout.write(JSON.stringify(listed.tools.map((tool) => ({
          annotations: tool.annotations ?? null,
          description: tool.description ?? null,
          inputSchema: tool.inputSchema ?? null,
          name: tool.name,
          outputSchema: tool.outputSchema ?? null,
          title: tool.title ?? null
        })).sort((left, right) => left.name.localeCompare(right.name))));
      } finally {
        await client.close();
      }
    })().catch((error) => {
      console.error(error);
      process.exitCode = 1;
    });
  `;
  const wireResult = spawnSync(process.execPath, ["-e", wireScript], {
    cwd: join(root, "packages/mcp"),
    encoding: "utf8",
    timeout: 15_000,
  });
  if (wireResult.status !== 0) {
    throw new Error(
      `Could not inspect MCP wire contracts:\n${wireResult.stdout}${wireResult.stderr}`,
    );
  }
  return { helpers, wireTools: JSON.parse(wireResult.stdout) };
}

function stringCollection(path, variableName) {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
  let values;
  const visit = (node) => {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === variableName
    ) {
      values = node.initializer;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  if (!values) throw new Error(`Could not inspect ${variableName} in ${relative(root, path)}.`);

  if (ts.isArrayLiteralExpression(values)) {
    return values.elements
      .filter(ts.isStringLiteral)
      .map((element) => element.text)
      .sort();
  }
  if (ts.isObjectLiteralExpression(values)) {
    return values.properties
      .map((property) => {
        if (!("name" in property) || !property.name) return null;
        if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) {
          return property.name.text;
        }
        return null;
      })
      .filter(Boolean)
      .sort();
  }
  throw new Error(`${variableName} must remain a static array or object literal.`);
}

function docsRoutes() {
  const staticRoutes = stringCollection(join(root, "apps/docs/app/sitemap.ts"), "staticRoutes");
  const foundationRoutes = readJson(join(root, "apps/docs/content/foundations.json")).map(
    (page) => page.path,
  );
  const componentSlugs = stringCollection(
    join(root, "apps/docs/lib/component-docs.ts"),
    "componentLedes",
  );
  return [
    ...staticRoutes,
    ...foundationRoutes,
    ...componentSlugs.map((slug) => `/docs/components/${slug}`),
    "/llms.txt",
  ].sort();
}

function assertApproval(approval, expected) {
  const missing = [
    ["approvedBy", typeof approval.approvedBy === "string" && approval.approvedBy.trim()],
    ["baseline", approval.baseline === expected.baseline],
    ["classification", ["breaking", "feature", "fix"].includes(approval.classification)],
    [
      "issue",
      (typeof approval.issue === "string" || typeof approval.issue === "number") &&
        String(approval.issue).trim(),
    ],
    ["schemaVersion", approval.schemaVersion === 1],
    ["snapshotSha256", typeof approval.snapshotSha256 === "string"],
  ]
    .filter(([, valid]) => !valid)
    .map(([field]) => field);
  if (missing.length) {
    throw new Error(`Public API snapshot approval is invalid in: ${missing.join(", ")}.`);
  }
  if (expected.schemaVersion !== 1) {
    throw new Error(`Unsupported public API snapshot schema ${expected.schemaVersion}.`);
  }
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

async function writeFormattedJson(path, value) {
  const config = (await resolveConfig(path)) ?? {};
  const formatted = await format(serialize(value), { ...config, filepath: path, parser: "json" });
  writeFileSync(path, formatted);
}

function hash(value) {
  return createHash("sha256").update(serialize(value)).digest("hex");
}

function argument(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

async function main() {
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
    await writeFormattedJson(snapshotPath, current);
    await writeFormattedJson(approvalPath, {
      approvedBy,
      baseline: current.baseline,
      classification,
      issue,
      schemaVersion: 1,
      snapshotSha256: hash(current),
    });
    console.log(`Updated ${relative(root, snapshotPath)} with ${classification} approval.`);
    return;
  }

  if (!existsSync(snapshotPath) || !existsSync(approvalPath)) {
    throw new Error("Public API snapshot or approval record is missing.");
  }
  const expected = readJson(snapshotPath);
  const approval = readJson(approvalPath);
  assertApproval(approval, expected);
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
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
