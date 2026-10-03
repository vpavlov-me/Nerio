import { createPageMetadata } from "../../../lib/seo";

const sponsorsUrl = "https://github.com/sponsors/vpavlov-me";
const refsGalleryUrl =
  "https://refs.gallery?utm_source=nerio&utm_medium=referral&utm_campaign=docs_sponsorships";
const contactEmail = "vpavlov@gmail.com";

export const metadata = createPageMetadata({
  title: "Sponsorships",
  description:
    "Support the development of Nerio through GitHub Sponsors, learn about related projects, and get in touch about sponsorship.",
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
          Sponsor Nerio through{" "}
          <a href={sponsorsUrl} target="_blank" rel="noopener noreferrer">
            GitHub Sponsors
          </a>
          . Individual and company sponsorships are both welcome, as one-time or recurring
          contributions.
        </p>
        <p>Sponsorship funds the ongoing work that keeps Nerio dependable:</p>
        <ul className="doc-list">
          <li>Maintenance of Core components, tokens, themes, and the Registry.</li>
          <li>Accessibility testing across browsers, devices, and assistive technologies.</li>
          <li>Documentation, examples, and the CLI and MCP tooling.</li>
          <li>Compatibility with new React, Next.js, and Tailwind CSS releases.</li>
        </ul>
      </section>

      <section className="doc-section" id="projects">
        <h2>Projects</h2>
        <p>
          Nerio is developed alongside{" "}
          <a href={refsGalleryUrl} target="_blank" rel="noopener noreferrer">
            Refs.Gallery
          </a>
          . Both projects are built and maintained independently, and supporting either one helps
          sustain the other.
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
