import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { gzipSync } from "node:zlib";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const nextDirectory = resolve(
  root,
  process.argv.find((argument) => argument.startsWith("--next-dir="))?.slice(11) ??
    "apps/docs/.next",
);
const writeReport = process.argv.includes("--write");
const writeBaseline = process.argv.includes("--write-baseline");
const reportOnly = process.argv.includes("--report-only");
const skipBaseline = process.argv.includes("--no-baseline") || writeBaseline;
const routeDefinitions = [
  { route: "/", manifest: "app/page_client-reference-manifest.js" },
  {
    route: "/docs/getting-started",
    manifest: "app/docs/getting-started/page_client-reference-manifest.js",
  },
  {
    route: "/docs/components/button",
    manifest: "app/docs/components/button/page_client-reference-manifest.js",
  },
  {
    route: "/docs/components/select",
    manifest: "app/docs/components/select/page_client-reference-manifest.js",
  },
  {
    route: "/docs/components/calendar",
    manifest: "app/docs/components/calendar/page_client-reference-manifest.js",
  },
  {
    route: "/docs/components/date-picker",
    manifest: "app/docs/components/date-picker/page_client-reference-manifest.js",
  },
  {
    route: "/docs/components/command-primitive",
    manifest: "app/docs/components/command-primitive/page_client-reference-manifest.js",
  },
  {
    route: "/templates/operations-workspace",
    manifest: "app/templates/[slug]/page_client-reference-manifest.js",
  },
  {
    route: "/views/operations-workspace",
    manifest: "app/views/[slug]/page_client-reference-manifest.js",
  },
];

function loadManifest(path) {
  if (!existsSync(path)) {
    throw new Error(`Missing Next client reference manifest: ${relative(root, path)}`);
  }
  const context = { globalThis: {} };
  vm.runInNewContext(readFileSync(path, "utf8"), context, { filename: path });
  const manifests = Object.values(context.globalThis.__RSC_MANIFEST ?? {});
  if (manifests.length !== 1) {
    throw new Error(`Expected one route manifest in ${relative(root, path)}.`);
  }
  return manifests[0];
}

function assetSize(asset) {
  const path = join(nextDirectory, asset.replace(/^\/?_next\//, ""));
  const contents = readFileSync(path);
  return {
    asset: asset.replace(/^\/?_next\//, ""),
    rawBytes: statSync(path).size,
    transferBytes: gzipSync(contents, { level: 9 }).length,
  };
}

function packageName(moduleId) {
  const workspace = moduleId.match(/\[project\]\/packages\/([^/]+)\//);
  if (workspace) return `@nerio-ui/${workspace[1]}`;
  const dependencies = [...moduleId.matchAll(/\/node_modules\/((?:@[^/]+\/)?[^/< ]+)/g)].map(
    (match) => match[1],
  );
  return dependencies.findLast((dependency) => dependency !== ".pnpm");
}

function routeReport(definition) {
  const manifest = loadManifest(join(nextDirectory, "server", definition.manifest));
  const jsFiles = new Set(Object.values(manifest.entryJSFiles ?? {}).flat());
  const cssFiles = new Set(
    Object.values(manifest.entryCSSFiles ?? {})
      .flat()
      .map((entry) => entry.path),
  );
  const javascript = [...jsFiles].map(assetSize).sort((a, b) => b.rawBytes - a.rawBytes);
  const css = [...cssFiles].map(assetSize).sort((a, b) => b.rawBytes - a.rawBytes);
  const packageChunks = new Map();
  for (const [moduleId, metadata] of Object.entries(manifest.clientModules ?? {})) {
    const name = packageName(moduleId);
    if (!name) continue;
    const chunks = (metadata.chunks ?? [])
      .map((chunk) => chunk.replace(/^\/?_next\//, ""))
      .filter((chunk) => jsFiles.has(chunk) || jsFiles.has(`/_next/${chunk}`));
    if (!chunks.length) continue;
    const owned = packageChunks.get(name) ?? new Set();
    chunks.forEach((chunk) => owned.add(chunk));
    packageChunks.set(name, owned);
  }
  const duplicatedPackages = [...packageChunks]
    .filter(([, chunks]) => chunks.size > 1)
    .map(([name, chunks]) => ({ name, chunks: [...chunks].sort() }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const jsBytes = javascript.reduce((total, asset) => total + asset.rawBytes, 0);
  const cssBytes = css.reduce((total, asset) => total + asset.rawBytes, 0);
  const transferBytes = [...javascript, ...css].reduce(
    (total, asset) => total + asset.transferBytes,
    0,
  );
  return {
    route: definition.route,
    jsBytes,
    cssBytes,
    transferBytes,
    majorClientChunks: javascript.slice(0, 8),
    duplicatedPackages,
  };
}

const report = {
  schemaVersion: 1,
  measurement: {
    jsCss: "raw production asset bytes",
    transfer: "deterministic gzip level 9 bytes",
    build: "Next.js production client reference manifests",
  },
  routes: routeDefinitions.map(routeReport),
};
const baselinePath = join(root, "quality/docs-route-bundle-baseline.json");
if (!skipBaseline && existsSync(baselinePath)) {
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  const baselineRoutes = new Map(baseline.routes.map((route) => [route.route, route]));
  report.routes = report.routes.map((route) => {
    const before = baselineRoutes.get(route.route);
    if (!before) return route;
    return {
      ...route,
      baseline: {
        jsBytes: before.jsBytes,
        cssBytes: before.cssBytes,
        transferBytes: before.transferBytes,
        majorClientChunks: before.majorClientChunks,
        duplicatedPackages: before.duplicatedPackages,
      },
      delta: {
        jsBytes: route.jsBytes - before.jsBytes,
        cssBytes: route.cssBytes - before.cssBytes,
        transferBytes: route.transferBytes - before.transferBytes,
      },
    };
  });
}
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (writeReport) {
  writeFileSync(join(root, "docs/audits/docs-route-bundle-report.json"), serialized);
}
if (writeBaseline) {
  writeFileSync(baselinePath, serialized);
}

if (!reportOnly) {
  const budgetPath = join(root, "quality/docs-route-budgets.json");
  if (!existsSync(budgetPath)) {
    throw new Error(
      "Missing quality/docs-route-budgets.json; use --report-only for baseline work.",
    );
  }
  const budgets = JSON.parse(readFileSync(budgetPath, "utf8"));
  const failures = [];
  for (const route of report.routes) {
    const budget = budgets.routes[route.route];
    if (!budget) {
      failures.push(`${route.route}: missing route budget`);
      continue;
    }
    for (const field of ["jsBytes", "cssBytes", "transferBytes"]) {
      if (route[field] > budget[field]) {
        failures.push(`${route.route}: ${field} ${route[field]}/${budget[field]} bytes`);
      }
    }
  }
  if (failures.length) {
    throw new Error(`Documentation route budgets failed:\n- ${failures.join("\n- ")}`);
  }
  console.log(`Documentation route budgets passed for ${report.routes.length} production routes.`);
}

if (reportOnly || writeReport) process.stdout.write(serialized);
