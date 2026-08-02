import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  docPageArchitectureFailures,
  docPageArchitectureSourceFailures,
} from "./doc-page-architecture.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const docPage = readFileSync(resolve(root, "apps/docs/components/doc-page.tsx"), "utf8");
const registry = readFileSync(
  resolve(root, "apps/docs/components/doc-page-preview-registry.tsx"),
  "utf8",
);
const serverPage = 'import { StandardDocPage } from "../../../../components/doc-page";';

test("accepts server documentation with typed static preview islands", () => {
  assert.deepEqual(docPageArchitectureFailures(root), []);
});

test("rejects a client StandardDocPage and missing dynamic preview group", () => {
  const failures = docPageArchitectureSourceFailures({
    docPage: `"use client";\n${docPage}`,
    registry: registry.replace('import("./doc-page-previews/forms")', 'import("./forms")'),
    pages: [],
  });
  assert.ok(failures.some((failure) => failure.includes("must remain server-rendered")));
  assert.ok(
    failures.some((failure) => failure.includes("missing static dynamic import for forms")),
  );
});

test("rejects a standard component page promoted to the client graph", () => {
  const failures = docPageArchitectureSourceFailures({
    docPage,
    registry,
    pages: [["apps/docs/app/docs/components/example/page.tsx", `"use client";\n${serverPage}`]],
  });
  assert.deepEqual(failures, [
    "apps/docs/app/docs/components/example/page.tsx: StandardDocPage content must not be a client component",
  ]);
});
