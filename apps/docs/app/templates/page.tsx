import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewThumbnail } from "../../components/preview-thumbnail";
import { templateCatalog } from "../../features/templates/catalog";
import { arePreviewSurfacesEnabled } from "../../lib/deployment";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Templates",
  description:
    "Explore complete app-like Nerio product scenarios rendered as same-origin previews inside the documentation application.",
  path: "/templates",
});

export default function TemplatesPage() {
  if (!arePreviewSurfacesEnabled()) notFound();

  return (
    <article className="doc-page catalog-page">
      <header className="catalog-hero">
        <h1>See Nerio working in complete product interfaces.</h1>
        <p>
          Templates are realistic, deterministic product scenarios that stress-test Core composition
          and reveal future Pro patterns. They are previews, not independently deployed products or
          released Pro packages.
        </p>
      </header>

      <section className="catalog-grid" aria-label="Template catalog">
        {templateCatalog.map((template) => (
          <article key={template.slug} className="catalog-card">
            <div className="catalog-card__media">
              <PreviewThumbnail src={template.previewRoute} title={template.title} />
            </div>
            <div className="catalog-card__content">
              <h2>{template.title}</h2>
              <p>{template.description}</p>
            </div>
            <Link
              className="catalog-card__link"
              href={template.previewRoute}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${template.title} preview in a new tab`}
            />
          </article>
        ))}
      </section>
    </article>
  );
}
