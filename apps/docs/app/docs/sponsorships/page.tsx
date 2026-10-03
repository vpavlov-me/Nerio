import { Card, CardDescription, CardFooter, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { ExternalLink } from "@nerio-ui/adapters/icons";
import { createPageMetadata } from "../../../lib/seo";

const utmParameters = "utm_source=nerio&utm_medium=referral&utm_campaign=docs_sponsorships";

const sponsorships = [
  {
    id: "founder",
    kicker: "Founder",
    title: "Vladimir Pavlov",
    description:
      "Founder and maintainer of Nerio. Vladimir designs and builds the system end to end, from tokens and Core components to the Registry, CLI, and documentation, and supports its development independently.",
    href: `https://vpavlov.com?${utmParameters}&utm_content=founder`,
    linkLabel: "vpavlov.com",
  },
  {
    id: "refs-gallery",
    kicker: "Main project",
    title: "Refs.Gallery",
    description:
      "Refs.Gallery is the founder's main product and the project that sustains work on Nerio. Visiting and using it is the most direct way to support the design system.",
    href: `https://refs.gallery?${utmParameters}&utm_content=refs-gallery`,
    linkLabel: "refs.gallery",
  },
];

export const metadata = createPageMetadata({
  title: "Sponsorships",
  description:
    "Learn who builds Nerio and how the founder's main project, Refs.Gallery, supports the design system.",
  path: "/docs/sponsorships",
});

export default function Page() {
  return (
    <article className="doc-page">
      <header>
        <p className="doc-kicker">Community</p>
        <h1>Sponsorships</h1>
        <p className="doc-lede">
          Nerio is an independent open-source project. Its development is supported by the founder
          and by the products the founder builds.
        </p>
      </header>

      <section className="doc-section" id="supporters">
        <h2>Who supports Nerio</h2>
        <div className="sponsorship-grid">
          {sponsorships.map((sponsorship) => (
            <Card
              key={sponsorship.id}
              href={sponsorship.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${sponsorship.title}: visit ${sponsorship.linkLabel} (opens in a new tab)`}
            >
              <CardHeader>
                <p className="sponsorship-kicker">{sponsorship.kicker}</p>
                <CardTitle as="h3">{sponsorship.title}</CardTitle>
                <CardDescription>{sponsorship.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <span className="sponsorship-link">
                  {sponsorship.linkLabel}
                  <Icon icon={ExternalLink} />
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </article>
  );
}
