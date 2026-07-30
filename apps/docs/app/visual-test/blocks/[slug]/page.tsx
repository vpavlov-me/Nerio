import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InternalBlockFixture } from "../../../../components/composition-page";
import { internalBlockFixtures, isInternalBlockFixture } from "../../../../features/blocks/catalog";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return Object.keys(internalBlockFixtures).map((slug) => ({ slug }));
}

export default async function InternalBlockFixturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isInternalBlockFixture(slug)) notFound();

  return <InternalBlockFixture slug={slug} />;
}
