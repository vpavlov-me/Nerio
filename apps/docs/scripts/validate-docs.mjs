import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ciWorkflowContractFailures,
  ciWorkflowPaths,
  readCiWorkflowSources,
} from "../../../scripts/ci-workflow-contract.mjs";
import { docPageArchitectureFailures } from "../../../scripts/doc-page-architecture.mjs";

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
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
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
    "alert-dialog",
    "button",
    "checkbox",
    "dialog",
    "dropdown-menu",
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
    if (indexSource.includes(`from "./components/${exportName}"`)) {
      failures.push(`packages/ui/src/index.ts: exports client-only ${exportName}`);
    }
  }

  if (!clientSource.startsWith('"use client";')) {
    failures.push("packages/ui/src/client.ts: client entrypoint must start with use client");
  }

  if (
    packageJson.exports?.["./client"]?.default !== "./dist/client.js" ||
    packageJson.exports?.["./client"]?.types !== "./dist/client.d.ts"
  ) {
    failures.push("packages/ui/package.json: missing ./client export");
  }

  if (packageJson.exports?.["./styles.css"] !== "./dist/styles.css") {
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
    "test:docs-examples",
    "test:consumer:vite",
    "validate:docs",
    "validate:route-budgets",
    "validate:release",
    "audit:prod",
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

  if (tokensPackage.exports?.["./styles.css"] !== "./dist/styles.css") {
    failures.push("packages/tokens/package.json: missing ./styles.css export");
  }

  if (cliPackage.bin?.nerio !== "./dist/index.cjs") {
    failures.push("packages/cli/package.json: missing nerio bin entry");
  }

  if (!existsSync(join(root, "scripts/pack-check.mjs"))) {
    failures.push("scripts/pack-check.mjs: missing package dry-run script");
  }

  const workflowPaths = Object.values(ciWorkflowPaths);
  const missingWorkflows = workflowPaths.filter((path) => !existsSync(join(root, path)));
  if (missingWorkflows.length) {
    for (const path of missingWorkflows) failures.push(`${path}: missing CI workflow`);
  } else {
    failures.push(...ciWorkflowContractFailures(readCiWorkflowSources(root)));
  }

  return failures;
}

function tailwindDocumentationFailures() {
  const globals = read("apps/docs/app/globals.css");
  const motionPage = read("apps/docs/app/docs/foundations/motion/page.tsx");
  const tokenPage = read("apps/docs/app/docs/foundations/tokens/page.tsx");
  const componentPage = read("apps/docs/components/doc-page.tsx");
  const docsChrome = read("apps/docs/components/docs-chrome.tsx");
  const playgroundPage = read("apps/docs/app/playground/page.tsx");
  const playground = read("apps/docs/components/visual-playground.tsx");
  const playgroundSpecimens = read("apps/docs/components/component-playground-specimens.tsx");
  const sitemap = read("apps/docs/app/sitemap.ts");
  const gettingStarted = read("apps/docs/app/docs/getting-started/page.tsx");
  const migrationPage = read("apps/docs/app/docs/migration/page.tsx");
  const progressPage = read("apps/docs/app/docs/components/progress/page.tsx");
  const foundationPages = JSON.parse(read("apps/docs/content/foundations.json"));
  const failures = [];

  const required = [
    [motionPage, "Tailwind motion recipes", "Motion Foundation must document Tailwind recipes"],
    [tokenPage, "Tailwind bridge", "Tokens Foundation must document the Tailwind bridge"],
    [componentPage, 'id="styling-contract"', "Component docs must expose a styling contract"],
    [
      componentPage,
      'id="overview"',
      "Component docs must expose an overview and decision boundary",
    ],
    [componentPage, 'id="installation"', "Component docs must expose installation and imports"],
    [docsChrome, 'href="/blocks"', "Primary navigation must expose the Blocks reference surface"],
    [docsChrome, 'href="/templates"', "Primary navigation must expose the Templates catalog"],
    [playgroundPage, 'path: "/playground"', "Playground metadata must use its canonical route"],
    [playgroundPage, "indexable: false", "Playground metadata must remain private"],
    [
      playground,
      'aria-label="Playground settings"',
      "Playground must expose labeled live settings",
    ],
    [playground, "<h1>Playground</h1>", "Playground must use its concise canonical title"],
    [
      playground,
      "there is no Chart component in Core",
      "Playground must keep chart aliases separate from Core component coverage",
    ],
    [
      playgroundSpecimens,
      "Open constrained calendar",
      "Playground must keep Calendar specimens behind explicit triggers",
    ],
    [
      gettingStarted,
      "component visuals compile from their Tailwind recipes",
      "Getting Started must describe Tailwind-owned component visuals",
    ],
    [
      migrationPage,
      'aria-label="Beta.0 to beta.1 migration changes"',
      "Migration must use the Nerio Table for the current beta changes",
    ],
    [
      migrationPage,
      "It is not a stable release",
      "Migration must distinguish the prepared beta candidate from stable Core 1.0",
    ],
    [
      progressPage,
      "residual progress keyframes",
      "Progress docs must distinguish Tailwind visuals from residual keyframes",
    ],
  ];

  for (const [source, expected, message] of required) {
    if (!source.replaceAll(/\s+/g, " ").includes(expected)) failures.push(message);
  }

  for (const sourceImport of [
    "../../../packages/tokens/src/styles.css",
    "../../../packages/tokens/src/tailwind.css",
    "../../../packages/ui/src/styles/motion.css",
    "../../../packages/ui/src/styles/spinner.css",
    "../../../packages/ui/src/styles/feedback.css",
    "../../../packages/ui/src/styles/progress.css",
    "../../../packages/ui/src/styles/select.css",
    "../../../packages/ui/src/styles/overlays.css",
    "../../../packages/ui/src/styles/compatibility.css",
  ]) {
    if (!globals.includes(`@import "${sourceImport}";`)) {
      failures.push(`Docs development CSS must import the live source file: ${sourceImport}`);
    }
  }
  if (globals.includes('@import "@nerio-ui/')) {
    failures.push("Docs development CSS must not read one-time package output");
  }

  if (
    !foundationPages.some(
      (page) => page.path === "/docs/foundations/motion" && page.label === "Motion",
    )
  ) {
    failures.push("Foundation route metadata must use the canonical Motion route and label");
  }

  if (migrationPage.includes("<table")) {
    failures.push("Migration must not use a raw table element");
  }

  if (
    existsSync(join(root, "apps/docs/app/docs/foundations/visual-language/page.tsx")) ||
    docsChrome.includes("/docs/foundations/visual-language") ||
    sitemap.includes('"/docs/foundations/visual-language"')
  ) {
    failures.push("The maintainer-only visual language reference must not be publicly routed");
  }

  if (sitemap.includes('"/playground"')) {
    failures.push("The sitemap must not expose the maintainer-only Playground");
  }

  if (/\bIconButton\b/.test(playgroundSpecimens)) {
    failures.push("Playground must not present the removed IconButton alpha export");
  }
  if (/id="chart"|>Chart</.test(playgroundSpecimens)) {
    failures.push("Playground must not present an app-local Chart as a Core component");
  }
  if (/<table[\s>]/.test(playgroundSpecimens)) {
    failures.push("Playground matrices must use the canonical Nerio Table components");
  }
  if (/component-lab-index|aria-label="Component index"/.test(playgroundSpecimens)) {
    failures.push("Playground must not restore the removed component index");
  }
  if (/id="icon"/.test(playgroundSpecimens)) {
    failures.push("Playground must not restore the removed static Icon specimen");
  }

  if (/['"]n-motion-[a-z]/.test(motionPage)) {
    failures.push("Motion Foundation must not restore removed n-motion-* visual utility classes");
  }
  if (gettingStarted.includes("imports tokens and component styles")) {
    failures.push(
      "Getting Started must not describe styles.css as a parallel component styling layer",
    );
  }
  if (progressPage.includes("dedicated progress.css stylesheet")) {
    failures.push("Progress docs must not describe residual keyframes as component CSS");
  }

  return failures;
}

function accessibilityFoundationFailures() {
  const accessibilityPage = read("apps/docs/app/docs/foundations/accessibility/page.tsx");
  const tokenPage = read("apps/docs/app/docs/foundations/tokens/page.tsx");
  const typographyPage = read("apps/docs/app/docs/foundations/typography/page.tsx");
  const themesPage = read("apps/docs/app/docs/foundations/themes/page.tsx");
  const componentPage = read("apps/docs/components/doc-page.tsx");
  const foundationPages = JSON.parse(read("apps/docs/content/foundations.json"));
  const failures = [];

  const requiredPageContracts = [
    ["Responsibility model", "Accessibility Foundation must define the responsibility model"],
    ["Nerio Core", "Accessibility Foundation must name the Core responsibility"],
    ["Product team", "Accessibility Foundation must name the product responsibility"],
    ["Nerio Pro", "Accessibility Foundation must name the Pro responsibility"],
    ["Applied example", "Accessibility Foundation must include a focused applied example"],
    [
      "Accessibility example preview",
      "Accessibility Foundation must include a live component preview",
    ],
    ["accessibleFieldExample", "Accessibility Foundation must include a public usage snippet"],
    [
      "does not automatically make a product conform to WCAG",
      "Accessibility Foundation must reject automatic product conformance claims",
    ],
    [
      "Semantics and native behavior",
      "Accessibility Foundation must cover semantic HTML and native behavior",
    ],
    [
      "Names, descriptions, and errors",
      "Accessibility Foundation must cover accessible names and relationships",
    ],
    ["Keyboard and focus", "Accessibility Foundation must cover keyboard and focus behavior"],
    [
      "Contrast and non-color communication",
      "Accessibility Foundation must cover contrast-independent communication",
    ],
    ["Pointer and touch", "Accessibility Foundation must cover pointer and touch input"],
    ["Dynamic feedback", "Accessibility Foundation must cover loading and status feedback"],
    ["320 CSS pixel", "Accessibility Foundation must cover narrow reflow"],
    ["Text resize and spacing", "Accessibility Foundation must cover text resizing and spacing"],
    ["Direction and locale", "Accessibility Foundation must cover RTL and localization"],
    ["Reduced motion", "Accessibility Foundation must cover reduced motion"],
    ["Forced colors", "Accessibility Foundation must cover forced colors"],
    ["Increased contrast", "Accessibility Foundation must cover increased contrast"],
    ["pnpm test:a11y", "Accessibility Foundation must document automated a11y evidence"],
    ["pnpm typecheck", "Accessibility Foundation must document typecheck evidence separately"],
    ["pnpm test:browser:pr", "Accessibility Foundation must document browser evidence"],
    ["GitHub issue #143", "Accessibility Foundation must link the manual evidence gate"],
    ["Known limitations", "Accessibility Foundation must expose known limitations"],
  ];

  for (const [expected, message] of requiredPageContracts) {
    if (!accessibilityPage.replaceAll(/\s+/g, " ").includes(expected)) failures.push(message);
  }

  if (accessibilityPage.includes('"use client"')) {
    failures.push("Accessibility Foundation must remain server-rendered");
  }
  if (
    !foundationPages.some(
      (page) => page.path === "/docs/foundations/accessibility" && page.label === "Accessibility",
    )
  ) {
    failures.push("Foundation route metadata must expose the canonical Accessibility route");
  }

  for (const [source, label] of [
    [tokenPage, "Tokens"],
    [typographyPage, "Typography"],
    [themesPage, "Themes"],
    [componentPage, "component"],
  ]) {
    if (!source.includes("/docs/foundations/accessibility")) {
      failures.push(`${label} documentation must link to the Accessibility Foundation`);
    }
  }

  return failures;
}

function colorFoundationFailures() {
  const colorPage = read("apps/docs/app/docs/foundations/color/page.tsx");
  const tokenPage = read("apps/docs/app/docs/foundations/tokens/page.tsx");
  const themesPage = read("apps/docs/app/docs/foundations/themes/page.tsx");
  const accessibilityPage = read("apps/docs/app/docs/foundations/accessibility/page.tsx");
  const foundationPages = JSON.parse(read("apps/docs/content/foundations.json"));
  const normalized = colorPage.replaceAll(/\s+/g, " ");
  const failures = [];
  const requiredPageContracts = [
    ["Color architecture", "Color Foundation must explain the token architecture"],
    ["color.primitiveFamilies", "Color Foundation must render source-backed primitive families"],
    ["color.semanticFamilies", "Color Foundation must render source-backed semantic families"],
    ["color.componentAliases", "Color Foundation must render source-backed component aliases"],
    ["Representative mode mappings", "Color Foundation must render mode mappings"],
    ["System dark", "Color Foundation must label the projected system mapping as OS dark"],
    ["runtimeAxes.theme.presets", "Color Foundation must render built-in theme mappings"],
    ["foreground/background pair", "Color Foundation must review complete color pairs"],
    ["Default", "Color Foundation must cover the default interaction state"],
    ["Hover", "Color Foundation must cover the hover interaction state"],
    ["Active", "Color Foundation must cover the active interaction state"],
    ["Focus-visible", "Color Foundation must cover visible focus"],
    ["Disabled", "Color Foundation must cover disabled color behavior"],
    ["Selected", "Color Foundation must cover selected color behavior"],
    ["Invalid", "Color Foundation must cover invalid color behavior"],
    ["Color foundation example preview", "Color Foundation must include a live component preview"],
    ["colorExample", "Color Foundation must include a public component snippet"],
    ["Text contrast", "Color Foundation must cover text contrast"],
    ["Non-text contrast", "Color Foundation must cover non-text contrast"],
    ["Color-independent meaning", "Color Foundation must reject color-only communication"],
    ["Forced colors", "Color Foundation must cover forced colors"],
    ["Increased contrast", "Color Foundation must cover increased contrast"],
    ["Color vision", "Color Foundation must cover color-vision limitations"],
    ["system with OS dark", "Color Foundation must validate system-dark custom themes"],
    ["Custom color theme", "Color Foundation must include a custom theme snippet"],
    [
      ':root[data-theme="acme"][data-mode="system"]',
      "Color Foundation must include the system-dark custom theme selector",
    ],
    ["Validation matrix", "Color Foundation must include a custom theme validation matrix"],
    ["Chart foundation issue", "Color Foundation must preserve the chart ownership boundary"],
    [
      "does not currently expose a contrast runtime axis",
      "Color Foundation must state known runtime limitations",
    ],
  ];

  for (const [expected, message] of requiredPageContracts) {
    if (!normalized.includes(expected)) failures.push(message);
  }
  if (colorPage.includes('"use client"')) {
    failures.push("Color Foundation must remain server-rendered");
  }
  if (
    !foundationPages.some(
      (page) => page.path === "/docs/foundations/color" && page.label === "Color",
    )
  ) {
    failures.push("Foundation route metadata must expose the canonical Color route");
  }
  for (const [source, label] of [
    [tokenPage, "Tokens"],
    [themesPage, "Themes"],
    [accessibilityPage, "Accessibility"],
  ]) {
    if (!source.includes("/docs/foundations/color")) {
      failures.push(`${label} documentation must link to the Color Foundation`);
    }
  }

  return failures;
}

function spacingLayoutFoundationFailures() {
  const spacingPage = read("apps/docs/app/docs/foundations/spacing-layout/page.tsx");
  const tokenPage = read("apps/docs/app/docs/foundations/tokens/page.tsx");
  const themesPage = read("apps/docs/app/docs/foundations/themes/page.tsx");
  const typographyPage = read("apps/docs/app/docs/foundations/typography/page.tsx");
  const accessibilityPage = read("apps/docs/app/docs/foundations/accessibility/page.tsx");
  const componentPage = read("apps/docs/components/doc-page.tsx");
  const foundationPages = JSON.parse(read("apps/docs/content/foundations.json"));
  const normalized = spacingPage.replaceAll(/\s+/g, " ");
  const failures = [];
  const requiredPageContracts = [
    ["Responsibility model", "Spacing & layout Foundation must define ownership"],
    ["Nerio Core", "Spacing & layout Foundation must name Core responsibility"],
    ["Product team", "Spacing & layout Foundation must name product responsibility"],
    ["Nerio Pro", "Spacing & layout Foundation must name Pro responsibility"],
    ["spacing.primitiveScale", "Spacing & layout Foundation must render the source-backed scale"],
    ["runtimeAxes.density.mappings", "Spacing & layout Foundation must render density mappings"],
    ["spacing.componentAliases", "Spacing & layout Foundation must render component geometry"],
    ["Component contract", "Spacing & layout Foundation must define token selection order"],
    ["Semantic density alias", "Spacing & layout Foundation must define semantic aliases"],
    ["Primitive step", "Spacing & layout Foundation must define primitive use"],
    ["Local semantic token", "Spacing & layout Foundation must define product aliases"],
    ["comfortable", "Spacing & layout Foundation must cover comfortable density"],
    ["compact", "Spacing & layout Foundation must cover compact density"],
    ["Spacing and layout examples", "Spacing & layout Foundation must include a live preview"],
    ["spacingLayoutExample", "Spacing & layout Foundation must include public usage code"],
    ["wrapping action toolbar", "Spacing & layout Foundation must cover toolbar wrapping"],
    ["repeated table rows", "Spacing & layout Foundation must cover repeated rows"],
    ["horizontal overflow", "Spacing & layout Foundation must cover two-dimensional overflow"],
    ["320 CSS pixels", "Spacing & layout Foundation must cover narrow reflow"],
    ["Long localization", "Spacing & layout Foundation must cover content growth"],
    ["Direction and logical properties", "Spacing & layout Foundation must cover RTL layout"],
    ["Grid, Stack, Container", "Spacing & layout Foundation must reject layout API backdoors"],
    ["application shell", "Spacing & layout Foundation must preserve the application boundary"],
    ["pnpm validate:route-budgets", "Spacing & layout Foundation must document route budgets"],
    ["Known limitations", "Spacing & layout Foundation must expose current limitations"],
  ];

  for (const [expected, message] of requiredPageContracts) {
    if (!normalized.includes(expected)) failures.push(message);
  }
  if (spacingPage.includes('"use client"')) {
    failures.push("Spacing & layout Foundation must remain server-rendered");
  }
  if (
    !foundationPages.some(
      (page) =>
        page.path === "/docs/foundations/spacing-layout" && page.label === "Spacing & layout",
    )
  ) {
    failures.push("Foundation route metadata must expose the canonical Spacing & layout route");
  }
  for (const [source, label] of [
    [tokenPage, "Tokens"],
    [themesPage, "Themes"],
    [typographyPage, "Typography"],
    [accessibilityPage, "Accessibility"],
    [componentPage, "component"],
  ]) {
    if (!source.includes("/docs/foundations/spacing-layout")) {
      failures.push(`${label} documentation must link to the Spacing & layout Foundation`);
    }
  }

  return failures;
}

function templateArchitectureFailures() {
  const catalog = read("apps/docs/features/templates/catalog.ts");
  const gallery = read("apps/docs/app/templates/page.tsx");
  const thumbnail = read("apps/docs/components/preview-thumbnail.tsx");
  const viewRoute = read("apps/docs/app/views/[slug]/page.tsx");
  const workspace = read("apps/docs/features/templates/operations-workspace/view.tsx");
  const finance = read("apps/docs/features/templates/finance-assets/view.tsx");
  const docsChrome = read("apps/docs/components/docs-chrome.tsx");
  const sitemap = read("apps/docs/app/sitemap.ts");
  const playwright = read("playwright.config.mjs");
  const failures = [];

  const required = [
    [
      catalog,
      'slug: "operations-workspace"',
      "Template catalog must register Operations Workspace",
    ],
    [
      catalog,
      'previewRoute: "/views/operations-workspace"',
      "Template catalog must own the same-origin Operations Workspace preview route",
    ],
    [catalog, 'slug: "finance-assets"', "Template catalog must register Finance & Assets"],
    [
      catalog,
      'previewRoute: "/views/finance-assets"',
      "Template catalog must own the same-origin Finance & Assets preview route",
    ],
    [gallery, "templateCatalog.map", "Templates gallery must derive from the canonical catalog"],
    [
      gallery,
      "href={template.previewRoute}",
      "Template cards must use their catalog-owned same-origin preview routes",
    ],
    [gallery, 'target="_blank"', "Template cards must open full-screen previews in a new tab"],
    [
      gallery,
      "src={template.previewRoute}",
      "Template cards must render their live catalog previews",
    ],
    [thumbnail, 'loading="lazy"', "Live catalog previews must preserve lazy iframe loading"],
    [thumbnail, "tabIndex={-1}", "Live catalog previews must remain outside the keyboard sequence"],
    [
      thumbnail,
      "data-preview-thumbnail",
      "Live catalog previews must use deterministic thumbnail mode",
    ],
    [
      viewRoute,
      "templateSlugs.map",
      "Template view route must generate catalog-owned static params",
    ],
    [viewRoute, "notFound()", "Template view route must reject unknown slugs"],
    [
      workspace,
      "OperationsWorkspaceView",
      "Operations Workspace implementation must remain template-local",
    ],
    [finance, "FinanceAssetsView", "Finance & Assets implementation must remain template-local"],
    [
      docsChrome,
      'pathname.startsWith("/views/")',
      "Full-screen template Views must bypass documentation chrome",
    ],
    [
      sitemap,
      'absoluteUrl("/templates")',
      "The preview-surface sitemap must include the Templates catalog",
    ],
    [
      playwright,
      'baseURL: "http://localhost:3100"',
      "Template and docs browser checks must share the docs deployment",
    ],
  ];

  for (const [source, expected, message] of required) {
    if (!source.replaceAll(/\s+/g, " ").includes(expected)) failures.push(message);
  }

  if (existsSync(join(root, "apps/demo-app"))) {
    failures.push("The retired standalone apps/demo-app workspace must not exist.");
  }

  const forbiddenSource = [
    catalog,
    gallery,
    thumbnail,
    viewRoute,
    workspace,
    docsChrome,
    playwright,
  ].join("\n");
  for (const forbidden of [
    "NEXT_PUBLIC_DEMO_APP_URL",
    "nerio-demo.vercel.app",
    "localhost:3002",
    "@nerio-ui/demo-app",
  ]) {
    if (forbiddenSource.includes(forbidden)) {
      failures.push(`Templates architecture still depends on ${forbidden}.`);
    }
  }
  if (catalog.includes("detailRoute")) {
    failures.push("Template catalog must not restore removed detail routes.");
  }
  for (const removedSlug of [
    "content-library",
    "ai-research-workspace",
    "developer-portal",
    "support-desk",
  ]) {
    if (catalog.includes(removedSlug) || viewRoute.includes(removedSlug)) {
      failures.push(`Removed Template ${removedSlug} must not remain registered or routed.`);
    }
  }

  return failures;
}

function blockArchitectureFailures() {
  const catalog = read("apps/docs/features/blocks/catalog.ts");
  const gallery = read("apps/docs/app/blocks/page.tsx");
  const thumbnail = read("apps/docs/components/preview-thumbnail.tsx");
  const viewRoute = read("apps/docs/app/views/blocks/[slug]/page.tsx");
  const internalRoute = read("apps/docs/app/visual-test/blocks/[slug]/page.tsx");
  const redirects = read("apps/docs/app/docs/blocks/[slug]/page.tsx");
  const docsChrome = read("apps/docs/components/docs-chrome.tsx");
  const sitemap = read("apps/docs/app/sitemap.ts");
  const robots = read("apps/docs/app/robots.ts");
  const audit = read("docs/audits/blocks-catalog-audit.md");
  const failures = [];

  const required = [
    [catalog, "export const blockCatalog", "Blocks must have one canonical metadata catalog"],
    [catalog, 'previewRoute: "/views/blocks/', "Block previews must be same-origin Views"],
    [catalog, "internalBlockFixtures", "Internal Block fixtures must be classified separately"],
    [gallery, "blockCatalog", "Blocks gallery must derive from the canonical catalog"],
    [
      gallery,
      "href={block.previewRoute}",
      "Block cards must use their catalog-owned same-origin preview routes",
    ],
    [gallery, "src={block.previewRoute}", "Block cards must render their live catalog previews"],
    [thumbnail, 'loading="lazy"', "Live Block previews must preserve lazy iframe loading"],
    [viewRoute, "blockSlugs.map", "Block View routes must derive static params from the catalog"],
    [viewRoute, "indexable: false", "Block Views must remain unindexed"],
    [internalRoute, "isInternalBlockFixture", "Internal fixtures must reject unknown slugs"],
    [internalRoute, "index: false", "Internal fixtures must remain unindexed"],
    [
      redirects,
      "legacyPublicBlockRedirects",
      "Legacy public Block routes must redirect canonically",
    ],
    [docsChrome, 'href="/blocks"', "Primary navigation must use the canonical Blocks catalog"],
    [sitemap, 'absoluteUrl("/blocks")', "The preview-surface sitemap must include Blocks"],
    [robots, '"/views/"', "Robots must exclude full-screen Views from crawling"],
    [robots, '"/visual-test/"', "Robots must exclude internal fixtures from crawling"],
  ];

  for (const [source, expected, message] of required) {
    if (!source.replaceAll(/\s+/g, " ").includes(expected)) failures.push(message);
  }

  const publicSlugs = [...catalog.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]);
  if (publicSlugs.length < 8 || publicSlugs.length > 11) {
    failures.push(
      `Blocks catalog must remain compact at 8-11 entries; found ${publicSlugs.length}.`,
    );
  }

  for (const legacySlug of [
    "login",
    "register",
    "forgot-password",
    "settings-form",
    "table-toolbar",
    "user-profile",
    "empty-states",
    "feedback",
    "overlay-playground",
    "navigation-patterns",
    "dense-form",
  ]) {
    if (!audit.includes(`\`${legacySlug}\``)) {
      failures.push(`Blocks audit is missing an explicit decision for ${legacySlug}.`);
    }
  }

  for (const internalSlug of [
    "overlay-playground",
    "navigation-patterns",
    "dense-form",
    "feedback",
  ]) {
    if (
      catalog.includes(`previewRoute: "/views/blocks/${internalSlug}"`) ||
      docsChrome.includes(`href: "/blocks/${internalSlug}"`)
    ) {
      failures.push(`${internalSlug} must not be presented as a public Block.`);
    }
  }
  if (catalog.includes("detailRoute")) {
    failures.push("Block catalog must not restore removed detail routes.");
  }
  if (catalog.includes('slug: "empty-project"') || catalog.includes('"empty-states":')) {
    failures.push("The redundant Empty project Block and its legacy redirect must stay removed.");
  }
  if (gallery.includes('target="_blank"')) {
    failures.push("Block cards must preserve same-tab navigation to support Back to Blocks.");
  }

  return failures;
}

function publicSurfaceFailures() {
  const layout = read("apps/docs/app/layout.tsx");
  const docsChrome = read("apps/docs/components/docs-chrome.tsx");
  const docsCommandPalette = read("apps/docs/components/docs-command-palette.tsx");
  const siteConfig = read("apps/docs/lib/site-config.ts");
  const sitemap = read("apps/docs/app/sitemap.ts");
  const robots = read("apps/docs/app/robots.ts");
  const llmsRoute = read("apps/docs/app/llms.txt/route.ts");
  const llmsSource = read("apps/docs/content/llms.txt");
  const feedbackPage = read("apps/docs/app/docs/feedback/page.tsx");
  const changelogPage = read("apps/docs/app/docs/changelog/page.tsx");
  const routeFiles = [
    "apps/docs/app/playground/page.tsx",
    "apps/docs/app/blocks/page.tsx",
    "apps/docs/app/templates/page.tsx",
    "apps/docs/app/views/[slug]/page.tsx",
    "apps/docs/app/views/blocks/[slug]/page.tsx",
    "apps/docs/app/docs/blocks/[slug]/page.tsx",
    "apps/docs/app/docs/compositions/[slug]/page.tsx",
  ];
  const failures = [];
  const required = [
    [layout, "<DocsChrome>{children}</DocsChrome>", "The docs shell must expose public surfaces"],
    [docsChrome, "entries={searchEntries}", "Search must include public surfaces"],
    [
      docsCommandPalette,
      'import("../lib/generated/foundation-search-pages")',
      "Search must load canonical Foundation descriptions",
    ],
    [sitemap, 'absoluteUrl("/blocks")', "The sitemap must include Blocks"],
    [sitemap, 'absoluteUrl("/templates")', "The sitemap must include Templates"],
    [
      docsChrome,
      '{ href: "/docs/feedback", label: "Community feedback"',
      "Overview navigation must expose the Community feedback route",
    ],
    [sitemap, '"/docs/feedback"', "The sitemap must include Community feedback"],
    [
      docsChrome,
      '{ href: "/docs/changelog", label: "Changelog"',
      "Overview navigation must expose the Changelog route",
    ],
    [sitemap, '"/docs/changelog"', "The sitemap must include Changelog"],
    [
      robots,
      'disallow: ["/views/", "/visual-test/"]',
      "Robots rules must keep catalogs public while excluding preview Views",
    ],
    [
      llmsRoute,
      'join(process.cwd(), "content", "llms.txt")',
      "The llms.txt route must render the canonical source",
    ],
    [llmsSource, "`/blocks`", "The canonical llms.txt source must describe Blocks"],
    [llmsSource, "`/templates`", "The canonical llms.txt source must describe Templates"],
    [llmsSource, "`/docs/feedback`", "The canonical llms.txt source must describe feedback"],
    [llmsSource, "`/docs/changelog`", "The canonical llms.txt source must describe Changelog"],
    [
      siteConfig,
      "https://x.com/nerio_ui",
      "Site configuration must define the official Nerio X account",
    ],
    [
      changelogPage,
      "siteConfig.xUrl",
      "The Changelog must link through the official Nerio X account configuration",
    ],
    [
      changelogPage,
      "CHANGELOG.md",
      "The public Changelog must preserve the canonical technical history link",
    ],
    [
      feedbackPage,
      "https://github.com/vpavlov-me/Nerio/discussions/385",
      "Community feedback must link directly to the Core 1.0 beta discussion",
    ],
    [
      feedbackPage,
      "https://github.com/vpavlov-me/Nerio/discussions",
      "Community feedback must link to the Discussions hub",
    ],
    [
      feedbackPage,
      "does not by itself satisfy release evidence",
      "Community feedback must preserve the manual release-evidence boundary",
    ],
    [
      feedbackPage,
      "https://github.com/vpavlov-me/Nerio/security/policy",
      "Community feedback must route private security reports away from Discussions",
    ],
  ];

  for (const [source, expected, message] of required) {
    if (!source.replaceAll(/\s+/g, " ").includes(expected)) failures.push(message);
  }

  const feedbackNewTabAnchors = feedbackPage.match(/<a\b[^>]*\btarget="_blank"[^>]*>/gs) ?? [];
  for (const anchor of feedbackNewTabAnchors) {
    const relations = new Set(anchor.match(/\brel="([^"]*)"/)?.[1].split(/\s+/) ?? []);
    if (!relations.has("noopener") || !relations.has("noreferrer")) {
      failures.push("Every new-tab Community feedback link must prevent opener access");
    }
  }

  for (const routeFile of routeFiles) {
    const source = read(routeFile);
    if (
      source.includes("arePreviewSurfacesEnabled") ||
      source.includes("NERIO_SHOW_PREVIEW_SURFACES")
    ) {
      failures.push(`${routeFile}: public surface routes must not depend on deployment flags`);
    }
  }

  if (existsSync(join(root, "apps/docs/lib/deployment.ts"))) {
    failures.push("The removed preview-surface deployment gate must not be restored");
  }
  if (llmsSource.includes("nerio-preview-surfaces")) {
    failures.push("The public llms.txt source must not retain preview-only markers");
  }

  if (existsSync(join(root, "apps/docs/public/llms.txt"))) {
    failures.push("Static public llms.txt must not bypass the canonical route source");
  }

  return failures;
}

const manifest = JSON.parse(read("packages/registry/src/manifest.json"));
const registrySlugs = unique(manifest.items.map((item) => item.name));
const documentedRegistrySlugs = registrySlugs.filter((slug) => {
  const item = manifest.items.find((candidate) => candidate.name === slug);
  return !item?.deprecated && !item?.docsPath;
});
const componentCatalog = JSON.parse(read("data/component-catalog.json"));

const docsChrome = read("apps/docs/components/docs-chrome.tsx");
const componentReference = read("apps/docs/components/component-reference.ts");
const componentDocs = read("apps/docs/lib/component-docs.ts");
const tokenStyles = read("packages/tokens/src/styles.css");
const togglePage = read("apps/docs/app/docs/components/toggle/page.tsx");
const toggleGroupCompositionGuidance = "Use ToggleGroupItem, not Toggle, for grouped composition.";
const toggleCompositionDocumentationIssues = [
  ["Toggle page", togglePage],
  ["Component reference", componentReference],
]
  .filter(([, source]) => !source.includes(toggleGroupCompositionGuidance))
  .map(([surface]) => `${surface} must direct grouped composition through ToggleGroupItem`);

const navSlugs = unique(matchAll(docsChrome, /href: "\/docs\/components\/([^"]+)"/g));
const dynamicRouteSlugs = unique(
  matchAll(
    objectBody(componentDocs, "componentLedes"),
    /^ {2}(?:"([^"]+)"|([a-z][a-z0-9-]*)):\s*"/gm,
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
const customReferenceSlugs = ["button", "button-group"];
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
const tailwindDocumentationIssues = tailwindDocumentationFailures();
const accessibilityFoundationIssues = accessibilityFoundationFailures();
const colorFoundationIssues = colorFoundationFailures();
const spacingLayoutFoundationIssues = spacingLayoutFoundationFailures();
const templateArchitectureIssues = templateArchitectureFailures();
const blockArchitectureIssues = blockArchitectureFailures();
const publicSurfaceIssues = publicSurfaceFailures();
const docPageArchitectureIssues = docPageArchitectureFailures(root);
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
reportMissing("Tailwind documentation issues", tailwindDocumentationIssues);
reportMissing("Accessibility foundation issues", accessibilityFoundationIssues);
reportMissing("Color foundation issues", colorFoundationIssues);
reportMissing("Spacing & layout foundation issues", spacingLayoutFoundationIssues);
reportMissing("Template architecture issues", templateArchitectureIssues);
reportMissing("Block architecture issues", blockArchitectureIssues);
reportMissing("Public documentation surface issues", publicSurfaceIssues);
reportMissing("Documentation server/client architecture issues", docPageArchitectureIssues);
reportMissing("ToggleGroup composition documentation issues", toggleCompositionDocumentationIssues);

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
  tailwindDocumentationIssues,
  accessibilityFoundationIssues,
  colorFoundationIssues,
  spacingLayoutFoundationIssues,
  templateArchitectureIssues,
  blockArchitectureIssues,
  publicSurfaceIssues,
  docPageArchitectureIssues,
  toggleCompositionDocumentationIssues,
].flat();

if (failures.length > 0) {
  process.exit(1);
}

console.log(
  `Docs registry, server/client islands, Tailwind contract, Blocks and Templates architecture, entrypoint, and package readiness verified for ${registrySlugs.length} components and ${definedTokens.length} tokens.`,
);
