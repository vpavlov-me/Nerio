import { Check, X } from "@nerio/adapters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const spinnerDoc = getComponentDoc("spinner");

export const metadata = createPageMetadata({
  title: "Spinner component",
  description: spinnerDoc!.description,
  path: "/docs/components/spinner",
});

const variantRows = [
  ["sm", "Compact size for dense layouts and inline use."],
  ["md", "Default size for most product surfaces."],
  ["lg", "Larger size for prominent local actions."],
] as const;

const anatomyRows = [
  ["root", "Inline loading indicator that is a status or decorative mark, depending on its mode."],
  ["label", "Visually hidden localized status label, rendered only for standalone Spinner."],
] as const;

const stateRows = [
  ["Standalone", "Requires label and renders a status with a visually hidden localized label."],
  ["Decorative", "Use when a parent already owns aria-busy and the loading announcement."],
  ["Reduced motion", "Stops rotating and remains visible as a static loading mark."],
] as const;

const apiRows = [
  ["size", '"sm" | "md" | "lg"', "Defaults to md."],
  ["label", "string", "Required localized text for standalone Spinner."],
  ["decorative", "boolean", "Removes status semantics when a parent already announces loading."],
  ["className", "string", "Adds a semantic foreground color inherited through currentColor."],
] as const;

const implementationRows = [
  [
    "Registry item",
    "spinner installs three source files into the configured components directory.",
  ],
  ["Base UI", "No interactive primitive required."],
  ["Registry dependencies", "None."],
  ["Package dependencies", "clsx, react"],
] as const;

const relatedComponents = [
  [
    "Button",
    "Owns aria-busy and uses a decorative Spinner while it prevents repeat activation.",
    "/docs/components/button",
  ],
  [
    "Badge",
    "Uses a decorative Spinner for compact loading metadata without a nested status.",
    "/docs/components/badge",
  ],
  [
    "Skeleton",
    "Reserves layout when loading content needs a stable shape.",
    "/docs/components/skeleton",
  ],
  [
    "Progress",
    "Communicates determinate progress when work can be measured.",
    "/docs/components/progress",
  ],
] as const;

export default function SpinnerPage() {
  return (
    <StandardDocPage
      title="Spinner"
      lede={spinnerDoc!.description}
      kind="spinner"
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Size", "Use"]} rows={variantRows} codeColumns={1} />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Description"]}
            rows={anatomyRows}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable headers={["Mode", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Type", "Description"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Item", "Contract"]}
            rows={implementationRows}
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
                Use Spinner for quick work such as saving, filtering, or refreshing. Use
                currentColor through semantic text color or className to match the surrounding
                foreground.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Do not use Spinner for long tasks where determinate Progress is available.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards spinner-related-cards">
            {relatedComponents.map(([title, description, href]) => (
              <Card key={title} className="doc-related-card" href={href} variant="secondary">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
      }}
    />
  );
}
