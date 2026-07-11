import type { Metadata } from "next";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const buttonDoc = getComponentDoc("button");

export const metadata: Metadata = createPageMetadata({
  title: "Button component",
  description: buttonDoc!.description,
  path: "/docs/components/button",
});

export default function ButtonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
