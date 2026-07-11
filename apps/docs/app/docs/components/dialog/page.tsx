import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const dialogDoc = getComponentDoc("dialog");

export const metadata = createPageMetadata({
  title: "Dialog component",
  description: dialogDoc!.description,
  path: "/docs/components/dialog",
});

export default function Page() {
  return <StandardDocPage title={dialogDoc!.title} lede={dialogDoc!.description} kind="dialog" />;
}
