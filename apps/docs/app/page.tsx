import Link from "next/link";
import { Badge, Icon } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { Check, Rocket } from "@nerio/adapters";
import { HomeComponentShowcase } from "../components/home-component-showcase";
import { siteConfig } from "../lib/site-config";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    description: siteConfig.defaultDescription,
    url: siteConfig.url,
  },
  {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: siteConfig.name,
    description: siteConfig.defaultDescription,
    url: siteConfig.repositoryUrl,
    codeRepository: siteConfig.repositoryUrl,
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    license: "https://opensource.org/license/mit",
    programmingLanguage: ["TypeScript", "React"],
    runtimePlatform: "Node.js",
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="home-hero" aria-labelledby="home-title">
        <Badge leadingIcon={Rocket} tone="primary-soft">
          Source-first UI
        </Badge>
        <h1 id="home-title">Open-source React design system for adaptable product teams.</h1>
        <p>
          Nerio is an open-source React design system with accessible components, semantic tokens,
          editable source code, and tooling that stays useful from first screen to product scale.
        </p>
        <div className="home-hero__actions">
          <Button nativeButton={false} render={<Link href="/docs/getting-started" />}>
            Get started
          </Button>
          <Button
            nativeButton={false}
            variant="secondary"
            render={<Link href="/docs/components/button" />}
          >
            Explore components
          </Button>
        </div>
        <p className="home-hero__note">
          <Icon icon={Check} aria-hidden /> Open source, token-driven, and ready for your stack.
        </p>
      </section>

      <section className="home-showcase" aria-label="Component showcase">
        <HomeComponentShowcase />
      </section>
    </div>
  );
}
