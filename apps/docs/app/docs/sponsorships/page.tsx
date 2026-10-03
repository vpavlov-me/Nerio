import { Button } from "@nerio-ui/ui/client";
import { createPageMetadata } from "../../../lib/seo";

const sponsorUrl = "https://github.com/vpavlov-me/Nerio";
const utmParameters = "utm_source=nerio&utm_medium=referral&utm_campaign=docs_sponsorships";
const authorUrl = `https://vpavlov.com?${utmParameters}&utm_content=author`;
const refsGalleryUrl = `https://refs.gallery?${utmParameters}&utm_content=refs-gallery`;
const contactEmail = "vpavlov.me@gmail.com";

export const metadata = createPageMetadata({
  title: "Sponsorships",
  description:
    "Support the development of Nerio, learn about its author and Refs.Gallery, and get in touch about sponsorship.",
  path: "/docs/sponsorships",
});

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Community</p>
        <h1>Sponsorships</h1>
        <p className="doc-lede">
          Nerio is an independent open-source design system. Sponsorship keeps Nerio Core free, its
          documentation public, and its releases maintained.
        </p>
      </header>

      <section className="doc-section" id="become-a-sponsor">
        <h2>Become a sponsor</h2>
        <p>
          Individual and company sponsorships are both welcome. Sponsorship funds the ongoing work
          that keeps Nerio dependable:
        </p>
        <ul className="doc-list">
          <li>Maintenance of Core components, tokens, themes, and the Registry.</li>
          <li>Accessibility testing across browsers, devices, and assistive technologies.</li>
          <li>Documentation, examples, and the CLI and MCP tooling.</li>
          <li>Compatibility with new React, Next.js, and Tailwind CSS releases.</li>
        </ul>
        <div className="doc-actions">
          <Button
            nativeButton={false}
            render={<a href={sponsorUrl} target="_blank" rel="noopener noreferrer" />}
          >
            Sponsor Nerio
          </Button>
        </div>
      </section>

      <section className="doc-section" id="author">
        <h2>About the author</h2>
        <p>
          Nerio is designed and built by{" "}
          <a href={authorUrl} target="_blank" rel="noopener noreferrer">
            Vladimir Pavlov
          </a>
          , a product designer and developer based in Tbilisi with more than eight years of
          experience in product and brand design.
        </p>
        <p>
          Vladimir works across UX, visual systems, and AI-assisted development, and has shipped
          products in fintech, SaaS, e-commerce, crypto, and AI tooling. Nerio grew out of that
          work: a design system that treats tokens, accessibility, and documentation as one contract
          from design to code.
        </p>
      </section>

      <section className="doc-section" id="refs-gallery">
        <h2>Refs.Gallery</h2>
        <p>
          <a href={refsGalleryUrl} target="_blank" rel="noopener noreferrer">
            Refs.Gallery
          </a>{" "}
          is an independent, curated reference library for designers, developers, and founders who
          study high-quality websites, interfaces, and digital product craft.
        </p>
        <p>
          Every site is reviewed manually before it joins the gallery. The collection favors clear
          ideas, strong visual systems, refined typography and spacing, memorable interaction
          details, and patterns that are useful to people building digital products. It holds more
          than 1,400 websites and is updated weekly.
        </p>
      </section>

      <section className="doc-section" id="contact">
        <h2>Get in touch</h2>
        <p>
          To discuss a company sponsorship, a partnership, or another way to support Nerio, email{" "}
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
        </p>
      </section>
    </article>
  );
}
