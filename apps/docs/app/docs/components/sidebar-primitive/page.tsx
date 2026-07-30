import type { Metadata } from "next";
import { StandardDocPage } from "../../../../components/doc-page";
import { SidebarExample } from "../../../../components/sidebar-example";

export const metadata: Metadata = {
  title: "Sidebar Primitive component",
  description:
    "Compose a persistent collapsible page region without moving navigation or product-shell behavior into Core.",
};

export default function SidebarPage() {
  return (
    <StandardDocPage
      kind="sidebar-primitive"
      title="Sidebar Primitive"
      lede="A composable Core layout primitive for physical side placement, controlled or uncontrolled collapse, accessible toggling, and tokenized regions."
      preview={<SidebarExample />}
    />
  );
}
