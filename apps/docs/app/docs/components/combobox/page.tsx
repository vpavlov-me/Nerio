import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const comboboxDoc = getComponentDoc("combobox");

const anatomyRows = [
  ["root", "Field root with stable state and size hooks."],
  ["label", "Visible native label for the editable combobox input."],
  ["input-group / input", "Query input with clear and popup actions."],
  ["trigger / icon", "Localizable popup toggle and direction-aware chevron."],
  ["content / list", "Anchored, collision-aware filtered listbox."],
  ["item / item-description", "Selectable option with optional supporting text."],
  ["indicator", "Selected-item check indicator."],
  ["group / group-label", "Labelled grouping for related options."],
  ["empty / loading", "Polite presentation regions that remain mounted."],
  ["description / message", "Associated help or validation content."],
] as const;
const stateRows = [
  ["Query", "Filters the supplied synchronous items without changing selection."],
  ["Open", "Shows the filtered list while focus remains on the input."],
  ["Highlighted / selected", "Separates the next keyboard target from the committed value."],
  ["Empty / loading", "Displays consumer-provided presentation without owning fetching."],
  ["Disabled / read-only", "Prevents interaction while preserving truthful semantics."],
  ["Required / invalid", "Participates in forms and associates validation content."],
] as const;
const apiRows = [
  [
    "options",
    "Flat or grouped data with generic string values, textValue, labels, descriptions, and disabled state.",
  ],
  ["items / children", "The same item data paired with curated ComboboxItem composition."],
  ["query / defaultQuery / onQueryChange", "Independent controlled or uncontrolled input query."],
  [
    "value / defaultValue / onValueChange",
    "Independent controlled or uncontrolled selected value.",
  ],
  ["open / defaultOpen / onOpenChange", "Independent controlled or uncontrolled popup state."],
  [
    "filter / locale",
    "Consumer filter override, no filtering with false, or locale-aware contains matching by default.",
  ],
  [
    "loading / emptyMessage / loadingMessage",
    "Presentation only; consumers own loading and data orchestration.",
  ],
  [
    "name / form / required / autoComplete",
    "Form identity, ownership, required state, reset, and autofill hint.",
  ],
  ["clearLabel / toggleLabel", "Localizable names for icon-only actions."],
] as const;

export const metadata = createPageMetadata({
  title: "Combobox component",
  description: comboboxDoc!.description,
  path: "/docs/components/combobox",
});

export default function Page() {
  return (
    <StandardDocPage
      title={comboboxDoc!.title}
      lede={comboboxDoc!.description}
      kind="combobox"
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
                Use for one selected value from a bounded synchronous set that benefits from
                filtering.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Put fetching, debounce, ranking, creation, virtualization, multiple selection,
                routing, analytics, or persistence in Combobox.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
