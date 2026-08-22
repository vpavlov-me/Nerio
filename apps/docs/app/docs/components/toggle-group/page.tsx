import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const toggleGroupDoc = getComponentDoc("toggle-group");

const anatomyRows = [
  ["group", "Named Base UI ToggleGroup and controlled or uncontrolled value owner."],
  ["item", "Toggle button with a stable string value and truthful aria-pressed state."],
  ["toggle-icon / toggle-label", "Existing Toggle icon and visible-label anatomy."],
] as const;
const stateRows = [
  ["Single", "At most one value is pressed; selecting another item replaces it."],
  ["Multiple", "Each item contributes independently to the value array."],
  ["Disabled item", "Cannot change and is skipped by roving focus."],
  ["Disabled group", "Prevents interaction for every item while preserving state."],
  ["Narrow / wrapped", "Items wrap without duplicating the interactive tree."],
] as const;
const apiRows = [
  ["value / defaultValue / onValueChange", "Controlled or uncontrolled string arrays."],
  ["multiple", "Allows more than one pressed item when true."],
  ["orientation / loopFocus", "Controls arrow-key direction and focus wrapping."],
  ["options", "Concise visible-label or accessible icon-only item data."],
  ["ToggleGroupItem", "Compound item composition for custom content."],
  ["variant / size", "Applies existing Toggle visuals and shared sizes."],
] as const;

export const metadata = createPageMetadata({
  title: "ToggleGroup component",
  description: toggleGroupDoc!.description,
  path: "/docs/components/toggle-group",
});

export default function Page() {
  return (
    <StandardDocPage
      title={toggleGroupDoc!.title}
      lede={toggleGroupDoc!.description}
      kind="toggle-group"
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
                Use ToggleGroup for a small visible set of retained button states, such as text
                alignment or independently visible canvas layers. Keep item names stable.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use ToggleGroup for panel navigation, one form choice, independently submitted
                checkbox options, tags, filters, persistence, or a MultiSelect popup.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
