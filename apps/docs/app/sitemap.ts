import type { MetadataRoute } from "next";
import { blockCatalog } from "../features/blocks/catalog";
import { templateCatalog } from "../features/templates/catalog";
import { componentDocSlugs } from "../lib/component-docs";
import { arePreviewSurfacesEnabled } from "../lib/deployment";
import { absoluteUrl } from "../lib/seo";

const staticRoutes = [
  "/",
  "/docs",
  "/docs/getting-started",
  "/docs/registry",
  "/docs/ai",
  "/docs/foundations/visual-language",
  "/docs/foundations/tokens",
  "/docs/foundations/themes",
  "/docs/foundations/effects",
  "/docs/foundations/icons",
  "/docs/foundations/motion",
  "/docs/foundations/radius",
  "/docs/foundations/typography",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...componentDocSlugs.map((slug) => ({ url: absoluteUrl(`/docs/components/${slug}`) })),
  ];

  if (!arePreviewSurfacesEnabled()) return publicRoutes;

  return [
    ...publicRoutes,
    { url: absoluteUrl("/blocks") },
    { url: absoluteUrl("/templates") },
    ...blockCatalog
      .filter((block) => block.indexable)
      .map((block) => ({ url: absoluteUrl(block.detailRoute) })),
    ...templateCatalog
      .filter((template) => template.indexable)
      .map((template) => ({ url: absoluteUrl(template.detailRoute) })),
  ];
}
