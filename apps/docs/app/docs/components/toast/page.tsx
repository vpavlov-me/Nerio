import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const toastDoc = getComponentDoc("toast");

export const metadata = createPageMetadata({
  title: "Toast component",
  description: toastDoc!.description,
  path: "/docs/components/toast",
});

export default function Page() {
  return <StandardDocPage title={toastDoc!.title} lede={toastDoc!.description} kind="toast" />;
}
