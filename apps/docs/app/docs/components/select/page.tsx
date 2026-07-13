import { Check, X } from "@nerio/adapters";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const selectDoc = getComponentDoc("select");

const anatomyRows = [
  ["root", 'Root slot exposed through data-slot="root".'],
  ["label", 'Label slot exposed through data-slot="label".'],
  ["trigger", "Button-like control that opens the option list."],
  ["value", "Current selection or placeholder text."],
  ["icon", "Chevron end-slot centered within the trigger."],
  ["content", "Layered list rendered through Base UI portal behavior."],
  ["item", "Selectable option with highlighted and selected states."],
  ["indicator", "Selected-item indicator."],
  ["message", "Helper or validation message."],
] as const;
const stateRows = [
  ["Open", "Options appear above the app layer."],
  ["Placeholder", "Placeholder text does not auto-select the first option."],
  ["Highlighted", "Keyboard or pointer focus indicates the next selection."],
  ["Disabled", "Prevents choosing unavailable options."],
  ["Required", "Supports native form required metadata."],
  ["Invalid", "Connects error text and aria-invalid when validation fails."],
] as const;
const implementationRows = [
  ["Registry item", "select installs 4 source files into the configured components directory."],
  ["Base UI", "select"],
  ["Registry dependencies", "form-message"],
  ["Package dependencies", "@base-ui/react, @nerio/adapters, clsx, react"],
] as const;

export const metadata = createPageMetadata({
  title: "Select component",
  description: selectDoc!.description,
  path: "/docs/components/select",
});

export default function Page() {
  return (
    <StandardDocPage
      title={selectDoc!.title}
      lede={selectDoc!.description}
      kind="select"
      sectionContent={{
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
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
                Use for status, owner, view mode, and compact configuration choices.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>Use Select for large searchable datasets.</CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
