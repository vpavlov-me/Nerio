import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const inputDoc = getComponentDoc("input");

export const metadata = createPageMetadata({
  title: "Input component",
  description: inputDoc!.description,
  path: "/docs/components/input",
});

export default function Page() {
  return <StandardDocPage title={inputDoc!.title} lede={inputDoc!.description} kind="input" />;
}
