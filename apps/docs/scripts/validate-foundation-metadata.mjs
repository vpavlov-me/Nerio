import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import prettier from "prettier";
import {
  assertGeneratedProjection,
  createFoundationMetadata,
  foundationDiscoveryFailures,
  renderFoundationMetadataModule,
  renderFoundationPagesModule,
} from "./foundation-metadata.mjs";

/* global console, process */

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const read = (path) => readFileSync(join(root, path), "utf8");
const metadataTarget = "apps/docs/lib/generated/foundation-metadata.ts";
const pagesTarget = "apps/docs/lib/generated/foundation-pages.ts";
const sources = [
  "packages/tokens/src/styles.css",
  "data/component-catalog.json",
  "apps/docs/content/foundations.json",
];
const foundationPages = JSON.parse(read("apps/docs/content/foundations.json"));
const metadata = createFoundationMetadata({
  cssSource: read("packages/tokens/src/styles.css"),
  catalog: JSON.parse(read("data/component-catalog.json")),
  foundationPages,
});
const expectedMetadata = await prettier.format(renderFoundationMetadataModule(metadata), {
  parser: "typescript",
});
const expectedPages = await prettier.format(renderFoundationPagesModule(foundationPages), {
  parser: "typescript",
});
const write = process.argv.includes("--write");

if (write) {
  writeFileSync(join(root, metadataTarget), expectedMetadata);
  writeFileSync(join(root, pagesTarget), expectedPages);
} else {
  assertGeneratedProjection({
    actual: existsSync(join(root, metadataTarget)) ? read(metadataTarget) : "",
    expected: expectedMetadata,
    target: metadataTarget,
    sources,
  });
  assertGeneratedProjection({
    actual: existsSync(join(root, pagesTarget)) ? read(pagesTarget) : "",
    expected: expectedPages,
    target: pagesTarget,
    sources: ["apps/docs/content/foundations.json"],
  });
}

const discoveryFailures = foundationDiscoveryFailures({
  pages: foundationPages,
  llmsSource: read("apps/docs/content/llms.txt"),
  routeExists: (routePath) =>
    existsSync(join(root, "apps/docs/app", routePath.replace(/^\/+/, ""), "page.tsx")),
});
if (discoveryFailures.length) {
  throw new Error(`Foundation discovery validation failed:\n- ${discoveryFailures.join("\n- ")}`);
}

console.log(
  `${write ? "Generated" : "Verified"} deterministic foundation metadata and discovery coverage.`,
);
