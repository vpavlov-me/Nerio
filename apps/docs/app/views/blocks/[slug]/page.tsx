import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockPreview } from "../../../../components/composition-page";
import { blockSlugs, getBlock } from "../../../../features/blocks/catalog";
import { arePreviewSurfacesEnabled } from "../../../../lib/deployment";
import { createPageMetadata } from "../../../../lib/seo";

export function generateStaticParams() {
  if (!arePreviewSurfacesEnabled()) return [];

  return blockSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  if (!arePreviewSurfacesEnabled()) notFound();

  const { slug } = await params;
  const block = getBlock(slug);

  if (!block) notFound();

  return createPageMetadata({
    title: `${block.title} preview`,
    description: block.description,
    path: block.previewRoute,
    indexable: false,
  });
}

export default async function BlockViewPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!arePreviewSurfacesEnabled()) notFound();

  const { slug } = await params;

  if (!getBlock(slug)) notFound();

  return <BlockPreview slug={slug} />;
}
