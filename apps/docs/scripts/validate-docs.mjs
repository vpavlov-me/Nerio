import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/* global console, process */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function matchAll(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1] ?? match[2]);
}

function unique(values) {
  return [...new Set(values)].sort();
}

function objectBody(source, objectName) {
  const marker = `const ${objectName}`;
  const exportMarker = `export const ${objectName}`;
  const markerIndex =
    source.indexOf(exportMarker) >= 0 ? source.indexOf(exportMarker) : source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Could not find ${objectName}`);

  const assignmentIndex = source.indexOf("=", markerIndex);
  if (assignmentIndex < 0) throw new Error(`Could not find ${objectName} assignment`);

  const start = source.indexOf("{", assignmentIndex);
  if (start < 0) throw new Error(`Could not find ${objectName} body`);

  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(start + 1, index);
  }

  throw new Error(`Could not parse ${objectName}`);
}

function reportMissing(title, values) {
  if (values.length === 0) return;
  console.error(`${title}:`);
  for (const value of values) console.error(`  - ${value}`);
}

function extractNerioTokens(source) {
  return unique([...source.matchAll(/--n-[a-z0-9-]+/g)].map((match) => match[0]));
}

function extractDefinedNerioTokens(source) {
  return unique([...source.matchAll(/--n-[a-z0-9-]+(?=\s*:)/g)].map((match) => match[0]));
}

function extractReferencedNerioTokens(source) {
  return unique([...source.matchAll(/var\((--n-[a-z0-9-]+)/g)].map((match) => match[1]));
}

function registryRequiredTokens(items) {
  return unique(
    items.flatMap((item) =>
      Array.isArray(item.requiredTokens) ? item.requiredTokens.filter(Boolean) : [],
    ),
  );
}

function slugify(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function registryFileFailures(items) {
  const manifestDir = join(root, "packages/registry/src");
  return items.flatMap((item) =>
    item.files
      .filter((file) => !existsSync(resolve(manifestDir, file.source)))
      .map((file) => `${item.name}: ${file.source}`),
  );
}

function duplicateRegistryTargets(items) {
  return items.flatMap((item) => {
    const seen = new Set();
    const duplicates = new Set();

    for (const file of item.files) {
      if (seen.has(file.target)) duplicates.add(file.target);
      seen.add(file.target);
    }

    return [...duplicates].sort().map((target) => `${item.name}: ${target}`);
  });
}

function missingRegistryDependencies(items) {
  const names = new Set(items.map((item) => item.name));

  return items.flatMap((item) =>
    item.registryDependencies
      .filter((dependency) => !names.has(dependency))
      .map((dependency) => `${item.name}: ${dependency}`),
  );
}

function rawPrimitiveTokenUsages() {
  const stylesDir = join(root, "packages/ui/src/styles");
  const primitiveTokenPattern = /--n-(purple|blue|green|orange|red|amber|cyan|magenta|gray)-[0-9]/g;

  return readdirSync(stylesDir)
    .filter((file) => file.endsWith(".css"))
    .flatMap((file) => {
      const source = readFileSync(join(stylesDir, file), "utf8");
      const tokens = unique([...source.matchAll(primitiveTokenPattern)].map((match) => match[0]));
      return tokens.map((token) => `${file}: ${token}`);
    });
}

function themeTokenMatrixFailures(tokenSource) {
  const themes = ["purple", "blue", "green", "orange", "red", "neutral"];
  const requiredTokens = [
    "--n-color-action-primary",
    "--n-color-action-primary-hover",
    "--n-color-action-primary-active",
    "--n-color-action-on-primary",
    "--n-color-border-focus",
    "--n-color-focus-ring-soft",
    "--n-color-surface-selected",
    "--n-chart-primary",
  ];
  const failures = requiredTokens
    .filter((token) => !tokenSource.includes(`${token}:`))
    .map((token) => `packages/tokens/src/styles.css: missing semantic token ${token}`);

  for (const theme of themes) {
    if (!tokenSource.includes(`:root[data-theme="${theme}"]`)) {
      failures.push(`packages/tokens/src/styles.css: missing ${theme} theme selector`);
    }
    if (!tokenSource.includes(`:root[data-theme="${theme}"][data-mode="dark"]`)) {
      failures.push(`packages/tokens/src/styles.css: missing ${theme} dark-theme selector`);
    }
    if (!tokenSource.includes(`:root[data-theme="${theme}"][data-mode="system"]`)) {
      failures.push(`packages/tokens/src/styles.css: missing ${theme} system-dark selector`);
    }
  }

  for (const mode of ["light", "dark", "system"]) {
    if (!tokenSource.includes(`:root[data-mode="${mode}"]`)) {
      failures.push(`packages/tokens/src/styles.css: missing ${mode} mode selector`);
    }
  }

  return failures;
}

function uiEntrypointFailures() {
  const indexSource = read("packages/ui/src/index.ts");
  const clientSource = read("packages/ui/src/client.ts");
  const packageJson = JSON.parse(read("packages/ui/package.json"));
  const failures = [];
  const clientOnlyExports = [
    "button",
    "checkbox",
    "dialog",
    "dropdown-menu",
    "icon-button",
    "popover",
    "radio-group",
    "select",
    "switch",
    "tabs",
    "toast",
    "tooltip",
  ];

  if (/^\s*["']use client["'];?/m.test(indexSource)) {
    failures.push("packages/ui/src/index.ts: default entrypoint must not include use client");
  }

  for (const exportName of clientOnlyExports) {
    if (indexSource.includes(`./components/${exportName}`)) {
      failures.push(`packages/ui/src/index.ts: exports client-only ${exportName}`);
    }
  }

  if (!clientSource.startsWith('"use client";')) {
    failures.push("packages/ui/src/client.ts: client entrypoint must start with use client");
  }

  if (packageJson.exports?.["./client"] !== "./src/client.ts") {
    failures.push("packages/ui/package.json: missing ./client export");
  }

  if (packageJson.exports?.["./styles.css"] !== "./src/styles.css") {
    failures.push("packages/ui/package.json: styles.css export changed");
  }

  return failures;
}

function packageReadinessFailures() {
  const rootPackage = JSON.parse(read("package.json"));
  const tokensPackage = JSON.parse(read("packages/tokens/package.json"));
  const cliPackage = JSON.parse(read("packages/cli/package.json"));
  const failures = [];
  const expectedRootScripts = [
    "format:check",
    "lint",
    "typecheck",
    "test:ui",
    "test:a11y",
    "validate:docs",
    "validate:release",
    "test:cli",
    "test:mcp",
    "build",
    "pack:check",
  ];

  for (const script of expectedRootScripts) {
    if (!rootPackage.scripts?.[script]) {
      failures.push(`package.json: missing ${script} script`);
    }
  }

  if (tokensPackage.exports?.["./styles.css"] !== "./src/styles.css") {
    failures.push("packages/tokens/package.json: missing ./styles.css export");
  }

  if (cliPackage.bin?.nerio !== "./src/index.js") {
    failures.push("packages/cli/package.json: missing nerio bin entry");
  }

  if (!existsSync(join(root, "scripts/pack-check.mjs"))) {
    failures.push("scripts/pack-check.mjs: missing package dry-run script");
  }

  if (!existsSync(join(root, ".github/workflows/ci.yml"))) {
    failures.push(".github/workflows/ci.yml: missing CI workflow");
  } else {
    const ciWorkflow = read(".github/workflows/ci.yml");
    const requiredCommands = [
      "pnpm format:check",
      "pnpm lint",
      "pnpm typecheck",
      "pnpm test:ui",
      "pnpm test:a11y",
      "pnpm validate:docs",
      "pnpm validate:release",
      "pnpm test:cli",
      "pnpm test:mcp",
      "pnpm build",
      "pnpm pack:check",
    ];
    const forbiddenWorkflowStrings = [
      "npm publish",
      "NPM_TOKEN",
      "contents: write",
      "id-token: write",
      "release-please",
      "semantic-release",
      "git tag",
    ];

    for (const command of requiredCommands) {
      if (!ciWorkflow.includes(command)) {
        failures.push(`.github/workflows/ci.yml: missing ${command}`);
      }
    }

    if (!ciWorkflow.includes("workflow_dispatch:")) {
      failures.push(".github/workflows/ci.yml: missing workflow_dispatch trigger");
    }

    if (!ciWorkflow.includes("node-version: 22")) {
      failures.push(".github/workflows/ci.yml: expected Node LTS baseline node-version: 22");
    }

    if (!ciWorkflow.includes("permissions:") || !ciWorkflow.includes("contents: read")) {
      failures.push(".github/workflows/ci.yml: missing read-only contents permission");
    }

    for (const forbidden of forbiddenWorkflowStrings) {
      if (ciWorkflow.includes(forbidden)) {
        failures.push(`.github/workflows/ci.yml: forbidden publishing string ${forbidden}`);
      }
    }
  }

  return failures;
}

const manifest = JSON.parse(read("packages/registry/src/manifest.json"));
const registrySlugs = unique(manifest.items.map((item) => item.name));
const documentedRegistrySlugs = registrySlugs.filter(
  (slug) => !manifest.items.find((item) => item.name === slug)?.deprecated,
);
const componentCatalog = JSON.parse(read("data/component-catalog.json"));

const docsChrome = read("apps/docs/components/docs-chrome.tsx");
const componentReference = read("apps/docs/components/component-reference.ts");
const dynamicRoute = read("apps/docs/app/docs/components/[slug]/page.tsx");
const tokenStyles = read("packages/tokens/src/styles.css");

const navSlugs = unique(matchAll(docsChrome, /href: "\/docs\/components\/([^"]+)"/g));
const dynamicRouteSlugs = unique(
  matchAll(
    objectBody(dynamicRoute, "componentDocs"),
    /^ {2}(?:"([^"]+)"|([a-z][a-z0-9-]*)):\s*\{/gm,
  ),
);
const staticRouteSlugs = registrySlugs.filter((slug) =>
  existsSync(join(root, `apps/docs/app/docs/components/${slug}/page.tsx`)),
);
const routeSlugs = unique([...dynamicRouteSlugs, ...staticRouteSlugs]);
const referenceSlugs = unique(
  matchAll(
    objectBody(componentReference, "componentReference"),
    /^ {2}(?:"([^"]+)"|([a-z][a-z0-9-]*)):\s*\{/gm,
  ),
);
const snippetSlugs = unique(
  matchAll(
    objectBody(componentReference, "snippets"),
    /^ {2}(?:"([^"]+)"|([a-z][a-z0-9-]*)):\s*["']/gm,
  ),
);
const customReferenceSlugs = ["button"];
const referenceCoverage = unique([...referenceSlugs, ...customReferenceSlugs]);

const missingNav = documentedRegistrySlugs.filter((slug) => !navSlugs.includes(slug));
const navWithoutRegistry = navSlugs.filter((slug) => !documentedRegistrySlugs.includes(slug));
const missingRoute = documentedRegistrySlugs.filter((slug) => !routeSlugs.includes(slug));
const routeWithoutRegistry = routeSlugs.filter((slug) => !documentedRegistrySlugs.includes(slug));
const missingReference = documentedRegistrySlugs.filter(
  (slug) => !referenceCoverage.includes(slug),
);
const referenceWithoutRegistry = referenceCoverage.filter(
  (slug) => !documentedRegistrySlugs.includes(slug),
);
const missingSnippet = documentedRegistrySlugs.filter((slug) => !snippetSlugs.includes(slug));
const snippetWithoutRegistry = snippetSlugs.filter(
  (slug) => !documentedRegistrySlugs.includes(slug),
);
const definedTokens = extractDefinedNerioTokens(tokenStyles);
const referencedTokens = extractReferencedNerioTokens(tokenStyles);
const registryTokens = registryRequiredTokens(manifest.items);
const referenceTokens = extractNerioTokens(componentReference);
const missingTokenReferences = referencedTokens.filter((token) => !definedTokens.includes(token));
const missingRegistryTokens = registryTokens.filter((token) => !definedTokens.includes(token));
const missingReferenceTokens = referenceTokens.filter((token) => !definedTokens.includes(token));
const missingRegistryFiles = registryFileFailures(manifest.items);
const duplicateTargets = duplicateRegistryTargets(manifest.items);
const registryDependenciesMissing = missingRegistryDependencies(manifest.items);
const rawPrimitiveTokens = rawPrimitiveTokenUsages();
const themeTokenMatrixIssues = themeTokenMatrixFailures(tokenStyles);
const uiEntrypointIssues = uiEntrypointFailures();
const packageReadinessIssues = packageReadinessFailures();
const catalogBySlug = new Map(
  componentCatalog.components.map((component) => [slugify(component.name), component]),
);
const registryWithoutCatalog = registrySlugs.filter((slug) => !catalogBySlug.has(slug));
const registrySlugSet = new Set(registrySlugs);
const foundationOnlyCategories = new Set(["foundation"]);
const catalogWithoutRegistry = componentCatalog.components
  .filter((component) => !["planned", "future"].includes(component.status))
  .filter((component) => !foundationOnlyCategories.has(component.category))
  .map((component) => ({ component, slug: slugify(component.name) }))
  .filter(({ slug }) => !registrySlugSet.has(slug))
  .map(({ component, slug }) => `${component.name} (${slug})`);

reportMissing("Registry items missing from component navigation", missingNav);
reportMissing("Component navigation entries missing from registry", navWithoutRegistry);
reportMissing("Registry items missing component docs routes", missingRoute);
reportMissing("Component docs routes missing from registry", routeWithoutRegistry);
reportMissing("Registry items missing docs reference coverage", missingReference);
reportMissing("Docs reference entries missing from registry", referenceWithoutRegistry);
reportMissing("Registry items missing usage snippets", missingSnippet);
reportMissing("Usage snippets missing from registry", snippetWithoutRegistry);
reportMissing("Token CSS references missing from token CSS", missingTokenReferences);
reportMissing("Registry requiredTokens missing from token CSS", missingRegistryTokens);
reportMissing("Docs component reference tokens missing from token CSS", missingReferenceTokens);
reportMissing("Registry item source files missing", missingRegistryFiles);
reportMissing("Registry item duplicate target paths", duplicateTargets);
reportMissing("Registry dependencies missing from manifest", registryDependenciesMissing);
reportMissing("Implemented registry items missing from component catalog", registryWithoutCatalog);
reportMissing("Implemented catalog components missing registry metadata", catalogWithoutRegistry);
reportMissing("Raw primitive palette tokens used in component CSS", rawPrimitiveTokens);
reportMissing("Theme token matrix issues", themeTokenMatrixIssues);
reportMissing("UI package entrypoint issues", uiEntrypointIssues);
reportMissing("Package readiness issues", packageReadinessIssues);

const failures = [
  missingNav,
  navWithoutRegistry,
  missingRoute,
  routeWithoutRegistry,
  missingReference,
  referenceWithoutRegistry,
  missingSnippet,
  snippetWithoutRegistry,
  missingTokenReferences,
  missingRegistryTokens,
  missingReferenceTokens,
  missingRegistryFiles,
  duplicateTargets,
  registryDependenciesMissing,
  registryWithoutCatalog,
  catalogWithoutRegistry,
  rawPrimitiveTokens,
  themeTokenMatrixIssues,
  uiEntrypointIssues,
  packageReadinessIssues,
].flat();

if (failures.length > 0) {
  process.exit(1);
}

console.log(
  `Docs registry, entrypoint, and package readiness verified for ${registrySlugs.length} components and ${definedTokens.length} tokens.`,
);
