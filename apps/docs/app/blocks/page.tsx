import Link from "next/link";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { blockCatalog } from "../../features/blocks/catalog";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Blocks",
  description:
    "Explore bounded, reusable Nerio product-interface compositions with same-origin previews and explicit product boundaries.",
  path: "/blocks",
});

const categories = [...new Set(blockCatalog.map((block) => block.category))];

export default function BlocksPage() {
  return (
    <article className="doc-page blocks-page">
      <header className="templates-hero">
        <p className="doc-kicker">Product compositions · Preview</p>
        <h1>Start from one clear product task.</h1>
        <p className="doc-lede">
          Blocks are bounded, adaptable compositions built primarily from Nerio Core. They are
          smaller than Templates and deliberately exclude routing, persistence, backend behavior,
          and business policy.
        </p>
      </header>

      {categories.map((category) => (
        <section key={category} className="blocks-category" aria-labelledby={`blocks-${category}`}>
          <h2 id={`blocks-${category}`}>{category}</h2>
          <div className="templates-grid">
            {blockCatalog
              .filter((block) => block.category === category)
              .map((block) => (
                <Card key={block.slug} className="template-card">
                  <CardHeader>
                    <div className="template-card__eyebrow">
                      <span>{block.category}</span>
                      <Badge variant={block.status === "Preview" ? "info" : "neutral"}>
                        {block.status}
                      </Badge>
                    </div>
                    <CardTitle>{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{block.description}</p>
                    <p className="template-card__coverage">
                      {block.componentsUsed.length} Core components · one bounded task
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      nativeButton={false}
                      variant="secondary"
                      render={<Link href={block.detailRoute} />}
                    >
                      View details
                    </Button>
                    <Button nativeButton={false} render={<Link href={block.previewRoute} />}>
                      Open preview
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </section>
      ))}
    </article>
  );
}
