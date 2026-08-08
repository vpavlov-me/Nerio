import type { MetadataRoute } from "next";
import { componentDocSlugs } from "../lib/component-docs";
import { absoluteUrl } from "../lib/seo";

const staticRoutes = [
  "/",
  "/docs",
  "/docs/getting-started",
  "/docs/migration",
  "/docs/registry",
  "/docs/ai",
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

  return [...publicRoutes, { url: absoluteUrl("/blocks") }, { url: absoluteUrl("/templates") }];
}
