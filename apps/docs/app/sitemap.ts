import type { MetadataRoute } from "next";
import { blockCatalog } from "../features/blocks/catalog";
import { templateCatalog } from "../features/templates/catalog";
import { componentDocSlugs } from "../lib/component-docs";
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
  "/blocks",
  "/templates",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...componentDocSlugs.map((slug) => ({ url: absoluteUrl(`/docs/components/${slug}`) })),
    ...blockCatalog
      .filter((block) => block.indexable)
      .map((block) => ({ url: absoluteUrl(block.detailRoute) })),
    ...templateCatalog
      .filter((template) => template.indexable)
      .map((template) => ({ url: absoluteUrl(template.detailRoute) })),
  ];
}
