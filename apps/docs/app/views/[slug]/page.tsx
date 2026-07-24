import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiResearchWorkspaceView } from "../../../features/templates/ai-research-workspace/view";
import { ContentLibraryView } from "../../../features/templates/content-library/view";
import { DeveloperPortalView } from "../../../features/templates/developer-portal/view";
import { FinanceAssetsView } from "../../../features/templates/finance-assets/view";
import { OperationsWorkspaceView } from "../../../features/templates/operations-workspace/view";
import { SupportDeskView } from "../../../features/templates/support-desk/view";
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

  if (template.slug === "finance-assets") {
    return <FinanceAssetsView />;
  }

  if (template.slug === "content-library") {
    return <ContentLibraryView />;
  }

  if (template.slug === "ai-research-workspace") {
    return <AiResearchWorkspaceView />;
  }

  if (template.slug === "developer-portal") {
    return <DeveloperPortalView />;
  }

  if (template.slug === "support-desk") {
    return <SupportDeskView />;
  }

  notFound();
}
