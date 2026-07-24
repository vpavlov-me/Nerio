import { notFound, permanentRedirect } from "next/navigation";
import {
  blockSlugs,
  getLegacyPublicBlockRedirect,
  isInternalBlockFixture,
  legacyPublicBlockRedirects,
} from "../../../../features/blocks/catalog";
import { arePreviewSurfacesEnabled } from "../../../../lib/deployment";

const legacySlugs = [
  ...blockSlugs,
  ...Object.keys(legacyPublicBlockRedirects),
  "overlay-playground",
  "navigation-patterns",
  "dense-form",
];

export function generateStaticParams() {
  if (!arePreviewSurfacesEnabled()) return [];

  return [...new Set(legacySlugs)].map((slug) => ({ slug }));
}

export default async function LegacyBlockPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!arePreviewSurfacesEnabled()) notFound();

  const { slug } = await params;

  if (blockSlugs.includes(slug as (typeof blockSlugs)[number])) {
    permanentRedirect(`/blocks/${slug}`);
  }

  const replacement = getLegacyPublicBlockRedirect(slug);
  if (replacement) permanentRedirect(`/blocks/${replacement}`);

  if (isInternalBlockFixture(slug)) {
    permanentRedirect(`/visual-test/blocks/${slug}`);
  }

  notFound();
}
