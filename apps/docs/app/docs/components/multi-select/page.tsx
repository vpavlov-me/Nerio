import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const multiSelectDoc = getComponentDoc("multi-select");

const anatomyRows = [
  ["root / label", "Field root and visible native label."],
  ["input-group / input", "Wrapping selected values and the editable filter query."],
  ["selected-values / value / remove", "Keyboard-navigable removable text values."],
  ["clear / trigger / icon", "Localizable clear-all and popup actions."],
  ["content / list", "Anchored finite local multi-select listbox."],
  ["item / item-description / indicator", "Option content, support text, and selected state."],
  ["group / group-label", "Optional labelled option grouping."],
  ["empty / announcement", "Empty presentation and polite selection updates."],
  ["description / message", "Associated help or validation content."],
] as const;
const stateRows = [
  ["Selection", "Preserves ordered unique values and exposes one removable text value each."],
  ["Query", "Filters finite local options without changing selection."],
  ["Open", "Keeps the popup open while options are toggled."],
  ["Highlighted / selected", "Separates keyboard navigation from multiple selected options."],
  ["Disabled / read-only", "Blocks interaction while preserving truthful form semantics."],
  ["Required / invalid", "Requires one known selected value and associates validation content."],
] as const;
const apiRows = [
  ["options", "Flat or grouped finite local options with unique string values and textValue."],
  ["value / defaultValue / onValueChange", "Controlled or uncontrolled ordered selection."],
  ["query / defaultQuery / onQueryChange", "Independent controlled or uncontrolled filter query."],
  ["open / defaultOpen / onOpenChange", "Independent controlled or uncontrolled popup state."],
  ["filter / locale", "Synchronous predicate, false, or locale-aware contains matching."],
  ["name / form / required", "Repeated form values, external form ownership, reset, and validity."],
  ["labels", "Localizable clear, toggle, remove, selection, removal, and clear announcements."],
] as const;

export const metadata = createPageMetadata({
  title: "MultiSelect component",
  description: multiSelectDoc!.description,
  path: "/docs/components/multi-select",
});

export default function Page() {
  return (
    <StandardDocPage
      title={multiSelectDoc!.title}
      lede={multiSelectDoc!.description}
      kind="multi-select"
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
                Use for zero or more values from a finite local option set that benefits from
                synchronous filtering.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Put fetching, creation, virtualization, selection quotas, rich product chips,
                persistence, or FilterBar workflows in MultiSelect.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
