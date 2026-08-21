import { StandardDocPage } from "../../../../components/doc-page";
import { PreviewIsland } from "../../../../components/doc-page-preview-registry";
import {
  alertDialogConfirmationSnippet,
  snippets,
} from "../../../../components/component-reference";
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
      preview={
        <>
          <PreviewIsland kind="alert-dialog" snippet={snippets["alert-dialog"]!} />
          <section className="doc-section">
            <h2 id="advanced-confirmation">Advanced destructive confirmation</h2>
            <p>
              Exact-name confirmation is optional consumer-owned product policy. Compose it inside
              AlertDialogBody when a high-risk action needs a stronger response than the primitive
              confirmation boundary.
            </p>
            <PreviewIsland
              kind="alert-dialog-confirmation"
              snippet={alertDialogConfirmationSnippet}
            />
          </section>
        </>
      }
    />
  );
}
