import { notFound, permanentRedirect } from "next/navigation";

const compositionSlugs = [
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
  return compositionSlugs.map((slug) => ({ slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!compositionSlugs.includes(slug)) notFound();

  permanentRedirect(`/docs/blocks/${slug}`);
}
