import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const scopeNames = [
  "docs",
  "ui",
  "browser",
  "visual",
  "cli",
  "mcp",
  "adapters",
  "packages",
  "manual_audit",
  "workflow",
  "branch_policy",
  "docs_only",
  "broad",
  "unknown",
];

const codeExtension = /\.(?:[cm]?[jt]sx?|css|scss|json)$/;
const markdownOnlyPath =
  /^(?:.*\.md|CHANGELOG|CHANGELOG\.md|RELEASE\.md|AGENTS\.md|CODE_OF_CONDUCT\.md|CONTRIBUTING\.md)$/;

function matchesAny(path, patterns) {
  return patterns.some((pattern) =>
    typeof pattern === "string" ? path === pattern : pattern.test(path),
  );
}

function isBrowserSurface(path) {
  return matchesAny(path, [
    "CHANGELOG.md",
    /^packages\/ui\/src\//,
    /^packages\/tokens\/src\//,
    /^packages\/adapters\/src\//,
    /^packages\/registry\/src\//,
    /^apps\/docs\/.*\.(?:[cm]?[jt]sx?|css|scss|json)$/,
    /^tests\/browser\//,
    /^packages\/config\//,
    "playwright.config.mjs",
    "pnpm-lock.yaml",
  ]);
}

function isVisualSurface(path) {
  return matchesAny(path, [
    "CHANGELOG.md",
    /^packages\/ui\/src\/(?:components|styles)\//,
    /^packages\/ui\/src\/lib\/(?:cn|tailwind-cn)\.ts$/,
    "packages/ui/src/styles.css",
    /^packages\/tokens\/src\/.*\.css$/,
    /^packages\/adapters\/src\/(?:icons|motion)\./,
    /^apps\/docs\/app\/(?:docs\/components|views|visual-test)\//,
    /^apps\/docs\/app\/.*\.css$/,
    /^apps\/docs\/components\//,
    /^apps\/docs\/features\//,
    "apps/docs/lib/avatar-preview-assets.ts",
    /^apps\/docs\/public\/avatars\//,
    /^tests\/visual\//,
    "playwright.visual.config.mjs",
  ]);
}

function isPackageBoundary(path) {
  return matchesAny(path, [
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    /^packages\/[^/]+\/package\.json$/,
    /^packages\/ui\/src\/(?:(?:index|client)\.ts|styles\.css)$/,
    /^packages\/(?:tokens|adapters|registry|cli|mcp)\/src\/index\.[cm]?[jt]s$/,
    "quality/package-budgets.json",
    "scripts/adapter-consumer-smoke.mjs",
    "scripts/pack-check.mjs",
    "scripts/release-smoke.mjs",
    "scripts/validate-motion-adapter.mjs",
    "scripts/validate-package-budgets.mjs",
  ]);
}

function isManualAuditContract(path) {
  return matchesAny(path, [
    "quality/stable-accessibility-smoke.json",
    "quality/manual-audit-plan.json",
    "quality/beta-feedback.json",
    "docs/audits/core-1-0-stable-accessibility-smoke.md",
    "docs/audits/core-1-0-accessibility-device-audit.md",
    "scripts/validate-stable-accessibility-smoke.mjs",
    "scripts/validate-stable-accessibility-smoke.test.mjs",
    "scripts/validate-manual-audit-plan.mjs",
    "scripts/validate-manual-audit-plan.test.mjs",
    "scripts/validate-beta-feedback.mjs",
    "scripts/validate-beta-feedback.test.mjs",
    "scripts/validate-stable-readiness.mjs",
    "scripts/validate-stable-readiness.test.mjs",
  ]);
}

function isKnownPath(path) {
  return matchesAny(path, [
    /^\.github\//,
    /^apps\//,
    /^data\//,
    /^docs\//,
    /^fixtures\//,
    /^packages\//,
    /^quality\//,
    /^scripts\//,
    /^tests\//,
    /^tooling\//,
    /^\.changeset\//,
    /^[^/]+\.md$/,
    /^.*\.config\.[cm]?[jt]s$/,
    /^tsconfig(?:\.[^.]+)?\.json$/,
    ".editorconfig",
    ".env.example",
    ".gitignore",
    ".node-version",
    ".nvmrc",
    ".prettierignore",
    ".prettierrc.json",
    "AGENTS.md",
    "CHANGELOG",
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "CONTRIBUTING.md",
    "LICENSE",
    "README.md",
    "RELEASE.md",
    "package.json",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "turbo.json",
  ]);
}

export function detectCiScopes(inputPaths) {
  const paths = [...new Set(inputPaths.map((path) => path.replaceAll("\\", "/")).filter(Boolean))];
  const scopes = Object.fromEntries(scopeNames.map((scope) => [scope, false]));

  for (const path of paths) {
    scopes.docs ||= matchesAny(path, [
      /^apps\/docs\//,
      /^docs\//,
      /^.*\.md$/,
      /^scripts\/(?:validate-(?:catalog|docs|onboarding|typography)|docs-route-bundle-report)\.mjs$/,
      /^quality\/docs-route-/,
    ]);
    scopes.ui ||= matchesAny(path, [
      "CHANGELOG.md",
      /^packages\/(?:ui|tokens|registry)\/src\//,
      /^packages\/ui\/tests?\//,
      /^tests\/browser\//,
      /^apps\/docs\/.*\.(?:[cm]?[jt]sx?|css|scss|json)$/,
      "playwright.config.mjs",
    ]);
    scopes.browser ||= isBrowserSurface(path);
    scopes.visual ||= isVisualSurface(path);
    scopes.cli ||= matchesAny(path, [
      /^packages\/cli\//,
      /^packages\/registry\/src\//,
      "scripts/release-smoke.mjs",
    ]);
    scopes.mcp ||= matchesAny(path, [
      /^packages\/mcp\//,
      /^packages\/registry\/src\//,
      "scripts/release-smoke.mjs",
    ]);
    scopes.adapters ||= matchesAny(path, [
      /^packages\/adapters\//,
      "scripts/adapter-consumer-smoke.mjs",
      "scripts/validate-motion-adapter.mjs",
    ]);
    scopes.packages ||= isPackageBoundary(path);
    scopes.manual_audit ||= isManualAuditContract(path);
    scopes.workflow ||= matchesAny(path, [
      /^\.github\/workflows\//,
      "scripts/detect-ci-scopes.mjs",
      "scripts/detect-ci-scopes.test.mjs",
    ]);
    scopes.branch_policy ||= matchesAny(path, [
      ".github/workflows/branch-policy.yml",
      "scripts/check-branch-policy.mjs",
      "scripts/check-branch-policy.test.mjs",
      "scripts/check-dco.mjs",
      "scripts/check-dco.test.mjs",
    ]);
    scopes.broad ||= matchesAny(path, [
      "package.json",
      "pnpm-lock.yaml",
      "pnpm-workspace.yaml",
      "turbo.json",
      ".prettierrc.json",
      /^data\//,
      /^fixtures\//,
      /^tooling\//,
      /^\.changeset\//,
      /^packages\/config\//,
      /^tsconfig(?:\.[^.]+)?\.json$/,
    ]);
    scopes.unknown ||= !isKnownPath(path);
  }

  scopes.docs_only =
    paths.length > 0 &&
    paths.every(
      (path) =>
        path !== "CHANGELOG.md" &&
        markdownOnlyPath.test(path) &&
        !isManualAuditContract(path) &&
        !codeExtension.test(path.replace(/\.md$/, "")),
    );

  if (scopes.broad || scopes.unknown) {
    for (const scope of [
      "docs",
      "ui",
      "browser",
      "visual",
      "cli",
      "mcp",
      "adapters",
      "packages",
      "manual_audit",
      "workflow",
      "branch_policy",
    ]) {
      scopes[scope] = true;
    }
    scopes.docs_only = false;
  }

  return { changedFiles: paths, scopes };
}

function parseArgs(args) {
  const options = {};
  for (let index = 0; index < args.length; index += 1) {
    const name = args[index];
    const value = args[index + 1];
    if (!["--base", "--head", "--github-output"].includes(name) || !value) {
      throw new Error(
        "Usage: detect-ci-scopes.mjs --base <sha> --head <sha> [--github-output <path>]",
      );
    }
    options[name.slice(2)] = value;
    index += 1;
  }
  if (!options.base || !options.head) {
    throw new Error(
      "Usage: detect-ci-scopes.mjs --base <sha> --head <sha> [--github-output <path>]",
    );
  }
  return options;
}

export function parseNameStatusOutput(output) {
  const fields = output.split("\0");
  const paths = [];

  for (let index = 0; index < fields.length && fields[index];) {
    const status = fields[index];
    index += 1;

    if (/^[CR]/.test(status)) {
      paths.push(fields[index], fields[index + 1]);
      index += 2;
    } else {
      paths.push(fields[index]);
      index += 1;
    }
  }

  return paths.filter(Boolean);
}

export function changedFilesBetween(base, head, runGit = execFileSync) {
  try {
    runGit("git", ["diff", "--quiet", base, head], { stdio: "ignore" });
    return [];
  } catch (error) {
    if (error?.status !== 1) throw error;
  }

  return parseNameStatusOutput(
    runGit("git", ["diff", "--name-status", "-z", "--diff-filter=ACMRD", `${base}...${head}`], {
      encoding: "utf8",
    }),
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const options = parseArgs(process.argv.slice(2));
  const result = detectCiScopes(changedFilesBetween(options.base, options.head));
  const outputs = [
    ...scopeNames.map((scope) => `${scope}=${result.scopes[scope]}`),
    `changed_count=${result.changedFiles.length}`,
  ];

  if (options["github-output"]) {
    appendFileSync(resolve(options["github-output"]), `${outputs.join("\n")}\n`);
  }

  console.log(
    JSON.stringify(
      {
        changedFiles: result.changedFiles,
        changedCount: result.changedFiles.length,
        ...result.scopes,
      },
      null,
      2,
    ),
  );
}
