import { notFound } from "next/navigation";
import { CompositionPage } from "../../../../components/composition-page";

const blockSlugs = [
  "login",
  "register",
  "forgot-password",
  "settings-form",
  "table-toolbar",
  "user-profile",
  "empty-states",
  "feedback",
  "overlay-playground",
  "navigation-patterns",
  "dense-form",
];

export function generateStaticParams() {
  return blockSlugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!blockSlugs.includes(slug)) notFound();

  return <CompositionPage slug={slug} />;
}
