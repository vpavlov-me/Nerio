import type { Metadata } from "next";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const labelDoc = getComponentDoc("label");

export const metadata: Metadata = createPageMetadata({
  title: "Label component",
  description: labelDoc!.description,
  path: "/docs/components/label",
});

export default function LabelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
