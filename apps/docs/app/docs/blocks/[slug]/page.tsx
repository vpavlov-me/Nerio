import { notFound, permanentRedirect } from "next/navigation";
import {
  blockSlugs,
  isInternalBlockFixture,
  legacyPublicBlockRedirects,
} from "../../../../features/blocks/catalog";

const legacySlugs = [
  ...blockSlugs,
  ...Object.keys(legacyPublicBlockRedirects),
  "overlay-playground",
  "navigation-patterns",
  "dense-form",
];

export function generateStaticParams() {
  return [...new Set(legacySlugs)].map((slug) => ({ slug }));
}

export default async function LegacyBlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (blockSlugs.includes(slug as (typeof blockSlugs)[number])) {
    permanentRedirect(`/blocks/${slug}`);
  }

  const replacement = legacyPublicBlockRedirects[slug];
  if (replacement) permanentRedirect(`/blocks/${replacement}`);

  if (isInternalBlockFixture(slug)) {
    permanentRedirect(`/visual-test/blocks/${slug}`);
  }

  notFound();
}
