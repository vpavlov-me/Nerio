import { Check, X } from "@nerio/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio/ui";
import { Switch } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Switch component",
  description:
    "Switches toggle immediate settings with familiar on and off affordances, optional descriptions, and accessible state behavior.",
  path: "/docs/components/switch",
});

const variantRows = [["Default", "Immediate binary setting."]] as const;
const anatomyRows = [
  ["field", "Optional wrapper that groups Switch with its label and description."],
  ["root", "Interactive Base UI switch control with checked state."],
  ["thumb", "Movable indicator for on and off state."],
  ["label", "Optional visible name connected to the control with aria-labelledby."],
  ["description", "Optional supporting text connected with aria-describedby."],
] as const;
const stateRows = [
  ["Off", "Setting is disabled."],
  ["On", "Setting is enabled."],
  ["Disabled", "Setting cannot be changed."],
  ["Read-only", "Setting remains visible without accepting changes."],
  ["Invalid", "Validation state is exposed through aria-invalid and data-invalid."],
] as const;
const apiRows = [
  ["checked / defaultChecked / onCheckedChange", "Controlled and uncontrolled Base UI state APIs."],
  ["label", "Optional visible name for the switch field row."],
  ["description", "Optional supporting text displayed below label and announced as a description."],
  ["name / value / form / required / disabled / readOnly", "Native form metadata is preserved."],
  ["invalid", "Sets data-invalid and aria-invalid when true."],
  ["className", "Extends the switch control, not the optional field wrapper."],
] as const;
const implementationRows = [
  ["Registry item", "switch installs 4 source files into the configured components directory."],
  ["Base UI", "switch"],
  ["Registry dependencies", "None."],
  ["Package dependencies", "@base-ui/react, clsx, react"],
] as const;
const tokenRows = [
  [
    "Sizing",
    "--n-switch-height / --n-switch-width",
    "Compact web track with iOS-like proportions.",
  ],
  [
    "Thumb",
    "--n-switch-thumb-size / --n-switch-thumb-offset",
    "Fixed 2px inset and circular thumb motion.",
  ],
  ["Off track", "--n-switch-background / --n-switch-background-hover", "Neutral inactive state."],
  [
    "On track",
    "--n-switch-background-checked / --n-switch-background-checked-hover",
    "Theme-aware enabled state with an on-primary thumb.",
  ],
  ["Focus", "--n-focus-ring", "Visible keyboard focus treatment."],
] as const;

function SwitchPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Switch preview">
      <div className="component-example__preview">
        <div className="form-preview-stack">
          <Switch
            defaultChecked
            description="Collaborators receive updates as they happen."
            label="Notify collaborators"
          />
          <Switch
            description="This setting is managed by your workspace."
            label="Automatic updates"
            readOnly
          />
        </div>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { Switch } from "@nerio/ui/client";\n\n<Switch\n  defaultChecked\n  label="Notify collaborators"\n  description="Collaborators receive updates as they happen."\n/>'
        }
        label="Switch live preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Switch"
      lede="Switches toggle immediate settings with clear on and off affordances, including read-only and invalid states."
      kind="switch"
      preview={<SwitchPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Variant", "Use"]} rows={variantRows} codeColumns={1} />
        ),
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Purpose"]} rows={apiRows} codeColumns={1} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
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
              <CardContent>Use for preferences like notifications or compact mode.</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Switch when a separate Save, Apply, Submit, or Confirm action is still required.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Checkbox",
                "Choose independent options submitted as part of a form.",
                "/docs/components/checkbox",
              ],
              [
                "RadioGroup",
                "Choose one option from a short visible set.",
                "/docs/components/radio-group",
              ],
              [
                "Field",
                "Compose labels, descriptions, and validation for form controls.",
                "/docs/components/field",
              ],
            ].map(([title, description, href]) => (
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
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
