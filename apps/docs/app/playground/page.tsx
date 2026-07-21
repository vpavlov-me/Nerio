import { notFound } from "next/navigation";
import { VisualPlayground } from "../../components/visual-playground";
import { isPublicProductionDeployment } from "../../lib/deployment";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Visual Playground",
  description: "Tune Nerio visual tokens and inspect Core components in one interactive canvas.",
  path: "/playground",
  indexable: false,
});

export default function PlaygroundPage() {
  if (isPublicProductionDeployment()) notFound();

  return <VisualPlayground />;
}
