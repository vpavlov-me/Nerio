import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const optionNames = new Map([
  ["--readme", "README.md"],
  ["--project", "PROJECT.md"],
  ["--release", "RELEASE.md"],
  ["--llms", "apps/docs/public/llms.txt"],
  ["--getting-started", "apps/docs/app/docs/getting-started/page.tsx"],
  ["--registry-docs", "apps/docs/app/docs/registry/page.tsx"],
  ["--ai", "apps/docs/app/docs/ai/page.tsx"],
  ["--component-docs", "apps/docs/components/doc-page.tsx"],
  ["--docs-chrome", "apps/docs/components/docs-chrome.tsx"],
  ["--motion-docs", "apps/docs/app/docs/foundations/motion/page.tsx"],
  ["--component-reference", "apps/docs/components/component-reference.ts"],
  ["--architecture", "ARCHITECTURE.md"],
  ["--registry-manifest", "packages/registry/src/manifest.json"],
  ["--cli-readme", "packages/cli/fixtures/basic/README.md"],
  ["--cli", "packages/cli/src/index.js"],
  ["--mcp", "packages/mcp/src/server.js"],
  ["--release-smoke", "scripts/release-smoke.mjs"],
]);

function optionPath(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index < 0) return resolve(root, fallback);

  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing path after ${name}.`);
  }
  return resolve(root, value);
}

function read(path) {
  return readFileSync(path, "utf8");
}

function requireText(source, expected, label, failures) {
  if (!source.includes(expected)) failures.push(`${label}: missing ${JSON.stringify(expected)}`);
}

const commandsPath = resolve(root, "packages/registry/src/public-commands.json");
const commands = JSON.parse(read(commandsPath));
const sources = Object.fromEntries(
  [...optionNames].map(([option, fallback]) => [fallback, read(optionPath(option, fallback))]),
);
const failures = [];

const expectedLocalCommands = [
  "pnpm exec nerio init",
  "pnpm exec nerio list",
  "pnpm exec nerio info button",
  "pnpm exec nerio add button --dry-run",
  "pnpm exec nerio add button",
  "pnpm exec nerio diff button",
  "pnpm exec nerio update button --dry-run",
  "pnpm exec nerio doctor",
];
if (
  JSON.stringify(commands.packageInstall) !==
    JSON.stringify([
      "pnpm add @nerio-ui/tokens@0.1.0-alpha.1 @nerio-ui/adapters@0.1.0-alpha.1 @nerio-ui/ui@0.1.0-alpha.1 tailwindcss",
      "pnpm add -D @tailwindcss/postcss postcss",
    ]) ||
  commands.cli.localInstall !==
    "pnpm add -D @nerio-ui/registry@0.1.0-alpha.1 @nerio-ui/cli@0.1.0-alpha.1" ||
  JSON.stringify(commands.cli.localCommands) !== JSON.stringify(expectedLocalCommands) ||
  JSON.stringify(commands.cli.oneOffCommands) !==
    JSON.stringify([
      "pnpm dlx @nerio-ui/cli@0.1.0-alpha.1 init",
      "pnpm dlx @nerio-ui/cli@0.1.0-alpha.1 add button",
    ]) ||
  commands.mcp.localInstall !== "pnpm add -D @nerio-ui/mcp@0.1.0-alpha.1" ||
  JSON.stringify(commands.mcp.localConfiguration) !==
    JSON.stringify({ command: "pnpm", args: ["exec", "nerio-mcp"] }) ||
  JSON.stringify(commands.mcp.oneOffConfiguration) !==
    JSON.stringify({ command: "pnpm", args: ["dlx", "@nerio-ui/mcp@0.1.0-alpha.1"] })
) {
  failures.push(
    "packages/registry/src/public-commands.json: canonical package, CLI, or MCP command contract drifted",
  );
}

for (const command of [
  commands.cli.localInstall,
  ...commands.cli.localCommands,
  ...commands.cli.oneOffCommands,
  commands.mcp.localInstall,
]) {
  requireText(sources["README.md"], command, "README.md", failures);
}

for (const command of [
  "pnpm test:onboarding",
  "pnpm validate:onboarding",
  "pnpm exec nerio",
  "pnpm exec nerio-mcp",
]) {
  requireText(sources["RELEASE.md"], command, "RELEASE.md", failures);
}
for (const command of [
  commands.cli.localInstall,
  ...commands.cli.localCommands,
  ...commands.cli.oneOffCommands,
  commands.mcp.localInstall,
]) {
  requireText(sources["apps/docs/public/llms.txt"], command, "llms.txt", failures);
}

for (const path of [
  "apps/docs/app/docs/getting-started/page.tsx",
  "apps/docs/app/docs/registry/page.tsx",
  "apps/docs/app/docs/ai/page.tsx",
  "apps/docs/components/doc-page.tsx",
]) {
  requireText(sources[path], "lib/public-commands", path, failures);
}

for (const command of [
  commands.cli.localInstall,
  "pnpm exec nerio <command>",
  commands.cli.oneOffCommands[0],
]) {
  requireText(sources["packages/cli/src/index.js"], command, "CLI help", failures);
}
requireText(
  sources["packages/mcp/src/server.js"],
  'require("../package.json")',
  "MCP server",
  failures,
);
requireText(
  sources["packages/mcp/src/server.js"],
  "version: mcpPackage.version",
  "MCP server",
  failures,
);
for (const fragment of [
  'run(pnpm, ["exec", "nerio"',
  'tarballs["@nerio-ui/cli"]',
  'tarballs["@nerio-ui/registry"]',
  '"exec", "nerio-mcp"',
]) {
  requireText(sources["scripts/release-smoke.mjs"], fragment, "release smoke", failures);
}

const forbiddenPatterns = [
  [/pnpm dlx nerio\b/g, "unqualified one-off CLI package"],
  [
    /pnpm (?:add(?: -D)?|dlx)[^\n`]*@nerio-ui\/(?:tokens|adapters|ui|registry|cli|mcp)(?!@0\.1\.0-alpha\.1)/g,
    "unpinned prerelease package install",
  ],
  [/packages\/mcp\/src\/server\.js/g, "monorepo-only MCP path"],
  [/pnpm --filter @nerio-ui\/mcp start/g, "workspace-only MCP command"],
  [/^\s*(?:npx|pnpm)\s+nerio\b/gm, "unsupported CLI runner"],
  [/^\s*nerio (?:init|list|info|add|diff|update|doctor)\b/gm, "bare public CLI command"],
  [/@nerio\//g, "obsolete package scope"],
  [/No npm release exists/g, "stale unpublished-package copy"],
];
for (const [path, source] of Object.entries(sources)) {
  for (const [pattern, description] of forbiddenPatterns) {
    if (pattern.test(source)) failures.push(`${path}: contains ${description}`);
    pattern.lastIndex = 0;
  }
}

if (failures.length > 0) {
  console.error("Public onboarding validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Public package, CLI, MCP, documentation, and release-smoke commands are aligned.");
