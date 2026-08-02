import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export function docPageArchitectureSourceFailures({ docPage, registry, pages }) {
  const failures = [];
  const docPagePath = "apps/docs/components/doc-page.tsx";
  const registryPath = "apps/docs/components/doc-page-preview-registry.tsx";

  if (/^\s*["']use client["'];?/m.test(docPage)) {
    failures.push(`${docPagePath}: standard documentation content must remain server-rendered`);
  }
  if (docPage.includes("@nerio-ui/ui/client")) {
    failures.push(`${docPagePath}: client UI must be isolated behind PreviewIsland`);
  }
  if (!docPage.includes('<PreviewIsland kind={kind} snippet={usage ?? ""} />')) {
    failures.push(`${docPagePath}: default previews must render through PreviewIsland`);
  }
  if (!registry.startsWith('"use client";')) {
    failures.push(`${registryPath}: preview registry must define the client boundary`);
  }
  for (const group of ["display", "forms", "overlays"]) {
    if (!registry.includes(`import("./doc-page-previews/${group}")`)) {
      failures.push(`${registryPath}: missing static dynamic import for ${group} previews`);
    }
  }
  if (!registry.includes("as const satisfies Record<string, ComponentType<PreviewProps>>")) {
    failures.push(`${registryPath}: preview registry must retain its typed static map`);
  }

  for (const [pagePath, page] of pages) {
    if (!page.includes("StandardDocPage")) continue;
    if (/^\s*["']use client["'];?/m.test(page)) {
      failures.push(`${pagePath}: StandardDocPage content must not be a client component`);
    }
  }

  return failures;
}

export function docPageArchitectureFailures(root) {
  const componentPagesDirectory = join(root, "apps/docs/app/docs/components");
  const pages = [];
  for (const entry of readdirSync(componentPagesDirectory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pagePath = `apps/docs/app/docs/components/${entry.name}/page.tsx`;
    if (!existsSync(join(root, pagePath))) continue;
    pages.push([pagePath, readFileSync(join(root, pagePath), "utf8")]);
  }

  return docPageArchitectureSourceFailures({
    docPage: readFileSync(join(root, "apps/docs/components/doc-page.tsx"), "utf8"),
    registry: readFileSync(
      join(root, "apps/docs/components/doc-page-preview-registry.tsx"),
      "utf8",
    ),
    pages,
  });
}
