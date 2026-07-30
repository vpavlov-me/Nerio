import type { MetadataRoute } from "next";
import { arePreviewSurfacesEnabled } from "../lib/deployment";
import { siteConfig, siteUrl } from "../lib/site-config";

export default function robots(): MetadataRoute.Robots {
  const disallow = arePreviewSurfacesEnabled()
    ? ["/views/", "/visual-test/"]
    : ["/blocks", "/templates", "/views/", "/visual-test/"];

  return {
    rules: { userAgent: "*", allow: "/", disallow },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteUrl.host,
  };
}
