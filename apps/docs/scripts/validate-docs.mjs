import { existsSync, readFileSync } from "node:fs";
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

const manifest = JSON.parse(read("packages/registry/src/manifest.json"));
const registrySlugs = unique(manifest.items.map((item) => item.name));

const docsChrome = read("apps/docs/components/docs-chrome.tsx");
const componentReference = read("apps/docs/components/component-reference.ts");
const dynamicRoute = read("apps/docs/app/docs/components/[slug]/page.tsx");

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

const missingNav = registrySlugs.filter((slug) => !navSlugs.includes(slug));
const navWithoutRegistry = navSlugs.filter((slug) => !registrySlugs.includes(slug));
const missingRoute = registrySlugs.filter((slug) => !routeSlugs.includes(slug));
const routeWithoutRegistry = routeSlugs.filter((slug) => !registrySlugs.includes(slug));
const missingReference = registrySlugs.filter((slug) => !referenceCoverage.includes(slug));
const referenceWithoutRegistry = referenceCoverage.filter((slug) => !registrySlugs.includes(slug));
const missingSnippet = registrySlugs.filter((slug) => !snippetSlugs.includes(slug));
const snippetWithoutRegistry = snippetSlugs.filter((slug) => !registrySlugs.includes(slug));

reportMissing("Registry items missing from component navigation", missingNav);
reportMissing("Component navigation entries missing from registry", navWithoutRegistry);
reportMissing("Registry items missing component docs routes", missingRoute);
reportMissing("Component docs routes missing from registry", routeWithoutRegistry);
reportMissing("Registry items missing docs reference coverage", missingReference);
reportMissing("Docs reference entries missing from registry", referenceWithoutRegistry);
reportMissing("Registry items missing usage snippets", missingSnippet);
reportMissing("Usage snippets missing from registry", snippetWithoutRegistry);

const failures = [
  missingNav,
  navWithoutRegistry,
  missingRoute,
  routeWithoutRegistry,
  missingReference,
  referenceWithoutRegistry,
  missingSnippet,
  snippetWithoutRegistry,
].flat();

if (failures.length > 0) {
  process.exit(1);
}

console.log(`Docs registry alignment verified for ${registrySlugs.length} components.`);
