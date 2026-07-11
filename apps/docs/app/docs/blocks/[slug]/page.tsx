import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompositionPage } from "../../../../components/composition-page";
import { compositionDocSlugs, getCompositionDoc } from "../../../../lib/composition-docs";
import { createPageMetadata } from "../../../../lib/seo";

export function generateStaticParams() {
  return compositionDocSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getCompositionDoc(slug);

  if (!doc) notFound();

  return createPageMetadata({
    title: `${doc.title} composition`,
    description: doc.description,
    path: `/docs/blocks/${slug}`,
    indexable: doc.indexable,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!getCompositionDoc(slug)) notFound();

  return <CompositionPage slug={slug} />;
}
