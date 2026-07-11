import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StandardDocPage } from "../../../../components/doc-page";
import { componentDocSlugs, getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

export function generateStaticParams() {
  return componentDocSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = getComponentDoc(slug);

  if (!doc) notFound();

  return createPageMetadata({
    title: `${doc.title} component`,
    description: doc.description,
    path: `/docs/components/${slug}`,
    indexable: doc.indexable,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getComponentDoc(slug);

  if (!doc) {
    notFound();
  }

  return <StandardDocPage title={doc.title} lede={doc.description} kind={slug} />;
}
