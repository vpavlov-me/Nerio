import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const selectDoc = getComponentDoc("select");

export const metadata = createPageMetadata({
  title: "Select component",
  description: selectDoc!.description,
  path: "/docs/components/select",
});

export default function Page() {
  return <StandardDocPage title={selectDoc!.title} lede={selectDoc!.description} kind="select" />;
}
