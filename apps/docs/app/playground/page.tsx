import { VisualPlayground } from "../../components/visual-playground";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Visual Playground",
  description: "Tune Nerio visual tokens and inspect Core components in one interactive canvas.",
  path: "/playground",
});

export default function PlaygroundPage() {
  return <VisualPlayground />;
}
