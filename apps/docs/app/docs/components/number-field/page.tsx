import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const numberFieldDoc = getComponentDoc("number-field");

const anatomyRows = [
  ["root / label", "Field root and visible native label."],
  ["input-group / input", "Localized decimal text input with one form value."],
  ["decrement / increment", "Localizable step actions that preserve bounds and read-only state."],
  ["description / message", "Associated help or validation content."],
] as const;
const stateRows = [
  ["Value", "One controlled or uncontrolled finite number, or null when empty."],
  ["Step", "Buttons, Arrow keys, Page keys, and Home/End use the declared step and bounds."],
  ["Locale", "Decimal separators, grouping, and visible formatting follow locale and format."],
  ["Disabled / read-only", "Preserves form semantics and prevents value changes."],
  ["Required / invalid", "Participates in forms and associates validation content."],
] as const;
const apiRows = [
  [
    "value / defaultValue / onValueChange",
    "Controlled or uncontrolled numeric value and change reason.",
  ],
  ["onValueCommitted", "Receives committed values after deliberate input or stepping."],
  ["min / max / step", "Finite bounds and positive decimal stepping."],
  ["smallStep / largeStep / snapOnStep", "Optional keyboard and snapping refinements."],
  ["locale / format", "Decimal-only Intl.NumberFormat presentation with an en-US default."],
  ["name / form / required", "Native form identity, submission, validation, and reset."],
  ["disabled / readOnly / invalid", "Interaction and Field validation states."],
] as const;

export const metadata = createPageMetadata({
  title: "NumberField component",
  description: numberFieldDoc!.description,
  path: "/docs/components/number-field",
});

export default function Page() {
  return (
    <StandardDocPage
      title={numberFieldDoc!.title}
      lede={numberFieldDoc!.description}
      kind="number-field"
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
                Use NumberField for one decimal quantity that needs localized entry, stepping,
                bounds, and form behavior.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Put currency policy, arbitrary parsing, unit conversion, calculations, business
                validation, or product-specific stepper workflows in NumberField.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
