import { notFound, permanentRedirect } from "next/navigation";
import {
  getLegacyPublicBlockRedirect,
  isInternalBlockFixture,
  legacyPublicBlockRedirects,
} from "../../../../features/blocks/catalog";
import { arePreviewSurfacesEnabled } from "../../../../lib/deployment";

const compositionSlugs = [
  ...Object.keys(legacyPublicBlockRedirects),
  "overlay-playground",
  "navigation-patterns",
  "dense-form",
];

export function generateStaticParams() {
  if (!arePreviewSurfacesEnabled()) return [];

  return compositionSlugs.map((slug) => ({ slug }));
}

export default async function LegacyCompositionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!arePreviewSurfacesEnabled()) notFound();

  const { slug } = await params;
  const replacement = getLegacyPublicBlockRedirect(slug);

  if (replacement) permanentRedirect(`/blocks/${replacement}`);
  if (isInternalBlockFixture(slug)) permanentRedirect(`/visual-test/blocks/${slug}`);

  notFound();
}
