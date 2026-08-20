import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const alertDialogDoc = getComponentDoc("alert-dialog");

export const metadata = createPageMetadata({
  title: "AlertDialog component",
  description: alertDialogDoc!.description,
  path: "/docs/components/alert-dialog",
});

export default function Page() {
  return (
    <StandardDocPage
      title={alertDialogDoc!.title}
      lede={alertDialogDoc!.description}
      kind="alert-dialog"
    />
  );
}
