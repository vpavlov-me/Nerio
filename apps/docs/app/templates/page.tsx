import Link from "next/link";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { templateCatalog } from "../../features/templates/catalog";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Templates",
  description:
    "Explore complete app-like Nerio product scenarios rendered as same-origin previews inside the documentation application.",
  path: "/templates",
});

export default function TemplatesPage() {
  return (
    <article className="doc-page templates-page">
      <header className="templates-hero">
        <p className="doc-kicker">Product scenarios · Preview</p>
        <h1>See Nerio working in complete product interfaces.</h1>
        <p className="doc-lede">
          Templates are realistic, deterministic product scenarios that stress-test Core composition
          and reveal future Pro patterns. They are previews, not independently deployed products or
          released Pro packages.
        </p>
      </header>

      <section className="templates-grid" aria-label="Template catalog">
        {templateCatalog.map((template) => (
          <Card key={template.slug} className="template-card">
            <CardHeader>
              <div className="template-card__eyebrow">
                <span>{template.category}</span>
                <Badge variant="info">{template.status}</Badge>
              </div>
              <CardTitle>{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{template.description}</p>
              <p className="template-card__coverage">
                {template.componentsUsed.length} Core components · {template.runtimeCoverage.length}{" "}
                runtime and responsive checks
              </p>
            </CardContent>
            <CardFooter>
              <Button
                nativeButton={false}
                variant="secondary"
                render={<Link href={template.detailRoute} />}
              >
                View details
              </Button>
              <Button nativeButton={false} render={<Link href={template.previewRoute} />}>
                Open full-screen preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </section>
    </article>
  );
}
