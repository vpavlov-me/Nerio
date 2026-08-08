import { VisualPlayground } from "../../components/visual-playground";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Playground",
  description: "Tune Nerio tokens and inspect Core components in one interactive canvas.",
  path: "/playground",
  indexable: false,
});

export default function PlaygroundPage() {
  return <VisualPlayground />;
}
