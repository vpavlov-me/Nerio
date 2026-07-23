import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockDetail } from "../../../components/composition-page";
import { blockSlugs, getBlock } from "../../../features/blocks/catalog";
import { createPageMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return blockSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlock(slug);

  if (!block) notFound();

  return createPageMetadata({
    title: `${block.title} block`,
    description: block.description,
    path: block.detailRoute,
    indexable: block.indexable,
  });
}

export default async function BlockDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!getBlock(slug)) notFound();

  return <BlockDetail slug={slug} />;
}
