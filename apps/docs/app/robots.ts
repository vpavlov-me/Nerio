import type { MetadataRoute } from "next";
import { siteConfig, siteUrl } from "../lib/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/views/", "/visual-test/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteUrl.host,
  };
}
