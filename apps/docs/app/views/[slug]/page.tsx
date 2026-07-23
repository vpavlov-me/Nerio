import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OperationsWorkspaceView } from "../../../features/templates/operations-workspace/view";
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
    title: `${template.title} preview`,
    description: template.description,
    path: template.previewRoute,
    indexable: false,
  });
}

export default async function TemplateViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug);

  if (!template) notFound();

  if (template.slug === "operations-workspace") {
    return <OperationsWorkspaceView />;
  }

  notFound();
}
