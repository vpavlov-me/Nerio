import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewThumbnail } from "../../components/preview-thumbnail";
import { blockCatalog } from "../../features/blocks/catalog";
import { arePreviewSurfacesEnabled } from "../../lib/deployment";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Blocks",
  description:
    "Explore bounded, reusable Nerio product-interface compositions with same-origin previews and explicit product boundaries.",
  path: "/blocks",
});

export default function BlocksPage() {
  if (!arePreviewSurfacesEnabled()) notFound();

  return (
    <article className="doc-page catalog-page blocks-catalog-page">
      <header className="catalog-hero">
        <h1>Start from one clear product task.</h1>
        <p>
          Blocks are bounded, adaptable compositions built primarily from Nerio Core. They are
          smaller than Templates and deliberately exclude routing, persistence, backend behavior,
          and business policy.
        </p>
      </header>

      <section className="catalog-grid" aria-label="Block catalog">
        {blockCatalog.map((block) => (
          <article key={block.slug} className="catalog-card">
            <div className="catalog-card__media">
              <PreviewThumbnail src={block.previewRoute} title={block.title} />
            </div>
            <div className="catalog-card__content">
              <h2>{block.title}</h2>
              <p>{block.description}</p>
            </div>
            <Link
              className="catalog-card__link"
              href={block.previewRoute}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${block.title} preview in a new tab`}
            />
          </article>
        ))}
      </section>
    </article>
  );
}
