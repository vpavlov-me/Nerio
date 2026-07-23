import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { getTemplate, templateSlugs } from "../../../features/templates/catalog";
import { createPageMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return templateSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) notFound();

  return createPageMetadata({
    title: `${template.title} template`,
    description: template.description,
    path: template.detailRoute,
    indexable: template.indexable,
  });
}

export default async function TemplateDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) notFound();

  return (
    <article className="doc-page template-detail-page">
      <header className="template-detail-header">
        <p className="doc-kicker">{template.category}</p>
        <div className="template-detail-title">
          <div>
            <h1>{template.title}</h1>
            <p className="doc-lede">{template.description}</p>
          </div>
          <Badge variant="info">{template.status}</Badge>
        </div>
        <p>{template.audience}</p>
        <div className="template-detail-actions">
          <Button nativeButton={false} render={<Link href={template.previewRoute} />}>
            Open full-screen preview
          </Button>
          <Button nativeButton={false} variant="secondary" render={<Link href="/templates" />}>
            Back to templates
          </Button>
        </div>
      </header>

      <iframe
        className="template-preview-frame"
        src={template.previewRoute}
        title={`${template.title} preview`}
        allow="clipboard-read; clipboard-write"
      />

      <div className="template-detail-grid">
        <section>
          <h2>Included scenarios</h2>
          <ul>
            {template.scenarios.map((scenario) => (
              <li key={scenario}>{scenario}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Runtime coverage</h2>
          <ul>
            {template.runtimeCoverage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section>
          <h2>Core components</h2>
          <p>{template.componentsUsed.join(", ")}.</p>
        </section>
        <section>
          <h2>Current limitations</h2>
          <ul>
            {template.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
