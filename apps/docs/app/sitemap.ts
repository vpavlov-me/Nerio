import type { MetadataRoute } from "next";
import { componentDocSlugs } from "../lib/component-docs";
import { foundationPages } from "../lib/generated/foundation-pages";
import { absoluteUrl } from "../lib/seo";

const staticRoutes = [
  "/",
  "/docs",
  "/docs/getting-started",
  "/docs/changelog",
  "/docs/migration",
  "/docs/registry",
  "/docs/ai",
  "/docs/feedback",
  ...foundationPages.map((page) => page.path),
];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = [
    ...staticRoutes.map((path) => ({ url: absoluteUrl(path) })),
    ...componentDocSlugs.map((slug) => ({ url: absoluteUrl(`/docs/components/${slug}`) })),
  ];

  return [...publicRoutes, { url: absoluteUrl("/blocks") }, { url: absoluteUrl("/templates") }];
}
