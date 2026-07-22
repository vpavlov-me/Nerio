import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const fileInputDoc = getComponentDoc("file-input");

export const metadata = createPageMetadata({
  title: "FileInput component",
  description: fileInputDoc!.description,
  path: "/docs/components/file-input",
});

const stateRows = [
  ["Default", "One native file-selection control with browser-owned picker chrome."],
  ["Multiple", "The native multiple attribute returns one FileList with every selection."],
  ["Required", "Native form validity requires a selection before submission."],
  ["Invalid", "aria-invalid and the shared danger boundary communicate an actual error."],
  ["Disabled", "The native disabled attribute prevents selection and form submission."],
] as const;

const apiRows = [
  ["accept", "string", "Native picker hint for file extensions or MIME types."],
  ["multiple", "boolean", "Allows more than one selected file in FileList."],
  ["capture", 'boolean | "user" | "environment"', "Native compatible-device capture hint."],
  ["name / form / required / disabled", "native props", "Form ownership and validity behavior."],
  ["onChange", "ChangeEvent<HTMLInputElement>", "Reads event.currentTarget.files directly."],
  ["ref", "HTMLInputElement", "Accesses files, validity, focus, and an intentional reset path."],
  ["size", "sm | md | lg", "Shared Core control geometry."],
  ["invalid", "boolean", "Normalizes data-invalid and aria-invalid."],
] as const;

export default function FileInputPage() {
  return (
    <StandardDocPage
      title="FileInput"
      lede={fileInputDoc!.description}
      kind="file-input"
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Variant", "Description"]}
            rows={[
              ["Single", "Default native single-file selection."],
              ["Multiple", "Native multiple selection without upload queue behavior."],
              ["Accept and capture", "Platform hints that do not replace consumer validation."],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Description"]}
            rows={[["file-input", "Native input, picker trigger, and browser file summary."]]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Type", "Description"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={[
              ["Semantic root", "Native input type=file"],
              ["Entrypoint", "@nerio-ui/ui"],
              ["State", "No mirrored FileList or hidden interactive input"],
              ["Reset", "Native form reset, intentional remount, or direct empty ref value"],
              [
                "Boundary",
                "Selection only; uploads and file workflows remain consumer or Pro work",
              ],
            ]}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="doc-list">
                  <li>Provide a visible label and explain accepted formats nearby.</li>
                  <li>Read FileList from the change event or forwarded ref.</li>
                  <li>Validate files and localize summaries in consumer code.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="doc-list">
                  <li>Hide the native input from assistive technology or the tab order.</li>
                  <li>Programmatically populate a file value.</li>
                  <li>Add Dropzone, previews, queues, progress, retries, or storage to Core.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
