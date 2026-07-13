import { Check, X } from "@nerio/adapters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "RadioGroup component",
  description: "Radio groups let people choose one option from a short visible set.",
  path: "/docs/components/radio-group",
});

const variantRows = [
  ["Default", "Stacked radio options for small sets."],
  ["Invalid", "Connects group validation state and message."],
  ["Disabled", "Prevents changes for the group or an individual option."],
] as const;
const anatomyRows = [
  ["root", "Field wrapper with label, description, group, and message."],
  ["label", "Visible group label connected through aria-labelledby."],
  ["description", "Optional group context connected through aria-describedby."],
  ["group", "Base UI radiogroup that manages one selected value."],
  ["option", "Clickable option row with control and text."],
  ["control", "Base UI radio control."],
  ["indicator", "White selected-state dot on brand surface."],
  ["option-content", "Visible option label and optional description."],
  ["option-label", "Visible label content for one selectable option."],
  ["option-description", "Optional supporting text for one selectable option."],
  ["message", "Optional helper or validation message."],
] as const;
const stateRows = [
  ["Checked", "One option is selected."],
  ["Disabled", "The whole group or individual options can be disabled."],
  ["Read-only", "The selected option remains visible without accepting changes."],
  ["Invalid", "Connects validation message and invalid state."],
] as const;
const apiRows = [
  [
    "value / defaultValue / onValueChange",
    "Controlled and uncontrolled value APIs for one selected option.",
  ],
  ["options", "Concise API for data-driven sets with label, value, description, and disabled."],
  [
    "children / RadioGroupItem",
    "Composition API for rich option content and explicit source control.",
  ],
  ["onValueChange", "Receives value and Base UI event details; onChange remains compatible."],
  ["label / description / message", "Text slots wired to aria-labelledby and aria-describedby."],
  ["invalid", "Sets invalid state on the group and message."],
] as const;
const implementationRows = [
  [
    "Registry item",
    "radio-group installs 3 source files into the configured components directory.",
  ],
  ["Base UI", "radio-group, radio"],
  ["Registry dependencies", "form-message"],
  ["Package dependencies", "@base-ui/react, clsx, react"],
] as const;

export default function Page() {
  return (
    <StandardDocPage
      title="RadioGroup"
      lede="Radio groups let people choose one option from a short visible set through options or RadioGroupItem composition."
      kind="radio-group"
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
              <CardContent>
                Use options for concise data-driven sets and RadioGroupItem composition for richer
                or conditional option content.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use RadioGroup for large searchable sets; use Select or a future picker.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Checkbox",
                "Choose independent options or a multi-select set.",
                "/docs/components/checkbox",
              ],
              ["Switch", "Toggle an immediate binary setting.", "/docs/components/switch"],
              ["Select", "Choose from a compact or larger option set.", "/docs/components/select"],
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
      }}
    />
  );
}
