import Link from "next/link";
import {
  Badge,
  Card,
  EmptyState,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Stat,
} from "@nerio/ui";
import { Button } from "@nerio/ui/client";
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
    <div className="hero">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Badge variant="info">Source-first UI</Badge>
      <h1>Open-source React design system for adaptable product teams.</h1>
      <p>
        Nerio combines accessible React components, semantic design tokens, editable source code,
        CLI tooling, and AI-readable documentation for modern SaaS and product interfaces.
      </p>
      <div className="hero-actions">
        <Button nativeButton={false} render={<Link href="/docs/getting-started" />}>
          Start building
        </Button>
        <Button
          nativeButton={false}
          variant="secondary"
          render={<Link href="/docs/components/button" />}
        >
          View components
        </Button>
      </div>
      <div className="grid">
        <Stat label="Themes" value="3" trend="Runtime CSS variables" />
        <Stat label="Density modes" value="2" trend="Comfortable and compact" />
        <Stat label="Registry slice" value="Button" trend="Local source install" />
      </div>
      <div className="grid">
        <Card>
          <h2>Universal by design</h2>
          <p>
            Use Nerio for projects, collections, content, collaboration, settings, search, activity,
            and analytics.
          </p>
        </Card>
        <Card>
          <h2>Token first</h2>
          <p>
            Primitive, semantic, and component tokens keep themes and product branding resilient.
          </p>
        </Card>
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle>No locked-in vertical</EmptyStateTitle>
            <EmptyStateDescription>
              Nerio avoids domain-specific motifs so teams can brand it through tokens.
            </EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
      </div>
    </div>
  );
}
