import Link from "next/link";
import { Badge, Code, Icon } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { Boxes, Check, Code2, Layers, Rocket, Sparkles } from "@nerio-ui/adapters/icons";
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
          <Icon icon={Check} aria-hidden /> {siteConfig.version} is a public alpha. APIs may still
          change before 1.0.
        </p>
      </section>

      <section className="home-showcase" aria-label="Component showcase">
        <HomeComponentShowcase />
      </section>

      <section className="home-story" aria-labelledby="home-source-title">
        <div className="home-section-heading">
          <p>Source-first delivery</p>
          <h2 id="home-source-title">Own the component code without losing the system.</h2>
          <span>
            Tokens, registry metadata, documentation, CLI output, and MCP discovery describe the
            same Core contracts.
          </span>
        </div>
        <div className="home-story-grid">
          <article>
            <Icon icon={Boxes} aria-hidden />
            <h3>Registry</h3>
            <p>Inspect dependencies, slots, states, accessibility notes, and required tokens.</p>
            <Code>nerio info button</Code>
          </article>
          <article>
            <Icon icon={Code2} aria-hidden />
            <h3>CLI</h3>
            <p>Preview and install editable source with explicit dependency boundaries.</p>
            <Code>nerio add button --dry-run</Code>
          </article>
          <article>
            <Icon icon={Sparkles} aria-hidden />
            <h3>MCP</h3>
            <p>Let agents discover the same component contract without inventing a parallel API.</p>
            <Code>get_component_usage</Code>
          </article>
        </div>
      </section>

      <section className="home-layers" aria-labelledby="home-layers-title">
        <div className="home-section-heading">
          <p>Clear product boundary</p>
          <h2 id="home-layers-title">
            Core builds the language. Pro will build product solutions.
          </h2>
          <span>
            The open-source layer remains universal; advanced workflows stay outside Core until
            their reuse and ownership are proven.
          </span>
        </div>
        <div className="home-layer-grid">
          <article>
            <Badge tone="primary-soft">Available in alpha</Badge>
            <Icon icon={Layers} aria-hidden />
            <h3>Nerio Core</h3>
            <p>
              Tokens, themes, accessible primitives, base components, public registry, CLI, and
              AI-readable documentation.
            </p>
          </article>
          <article>
            <Badge tone="neutral">Future paid layer</Badge>
            <Icon icon={Rocket} aria-hidden />
            <h3>Nerio Pro</h3>
            <p>
              Product-ready components, advanced workflows, templates, premium themes, Figma assets,
              and Pro tooling.
            </p>
          </article>
        </div>
      </section>

      <section className="home-quality" aria-labelledby="home-quality-title">
        <Icon icon={Check} aria-hidden />
        <div>
          <p>Design and engineering quality</p>
          <h2 id="home-quality-title">
            One visual contract, tested through real product composition.
          </h2>
          <span>
            Core covers keyboard behavior, focus, reduced motion, forced colors, themes, density,
            safe areas, source installation, and typed examples. The workspace demo proves those
            contracts together without pretending to be a released template.
          </span>
        </div>
        <div className="home-quality__actions">
          <Button nativeButton={false} render={<Link href="/templates" />} variant="secondary">
            Open workspace demo
          </Button>
          <Button nativeButton={false} render={<Link href="/playground" />}>
            Inspect Playground
          </Button>
        </div>
      </section>
    </div>
  );
}
