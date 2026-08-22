import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const checkboxGroupDoc = getComponentDoc("checkbox-group");

const anatomyRows = [
  ["root", "Field wrapper with label, description, group, and message."],
  ["group", "Named Base UI CheckboxGroup and string-array value owner."],
  ["field", "One CheckboxGroupItem row with a checkbox and visible content."],
  ["label / description", "Visible group context connected to the complete group."],
  ["message", "Optional helper or validation message."],
] as const;
const stateRows = [
  ["Unchecked / checked", "Each item contributes independently to the string array."],
  ["Disabled item", "Cannot change while the remaining options stay available."],
  ["Disabled group", "Prevents changes to every option."],
  ["Read-only", "Preserves selection and form values without accepting changes."],
  ["Invalid", "Connects the group to a concise validation message."],
] as const;
const apiRows = [
  ["value / defaultValue / onValueChange", "Controlled or uncontrolled string arrays."],
  ["options", "Concise item labels, values, descriptions, and disabled states."],
  ["CheckboxGroupItem", "Compound item composition with one required string value."],
  ["label / description / message", "Visible group naming and supporting context."],
  ["name / form", "Shared form metadata for every checkbox value."],
  ["disabled / readOnly / invalid / required", "Group-level semantic state hooks."],
] as const;

export const metadata = createPageMetadata({
  title: "CheckboxGroup component",
  description: checkboxGroupDoc!.description,
  path: "/docs/components/checkbox-group",
});

export default function Page() {
  return (
    <StandardDocPage
      title={checkboxGroupDoc!.title}
      lede={checkboxGroupDoc!.description}
      kind="checkbox-group"
      sectionContent={{
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Props", "Purpose"]} rows={apiRows} codeColumns={1} />,
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use CheckboxGroup for a short visible set where zero or more independent form
                options may be selected.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use CheckboxGroup for one exclusive choice, retained button state, a popup
                MultiSelect, filters, tags, or persisted product workflows.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
