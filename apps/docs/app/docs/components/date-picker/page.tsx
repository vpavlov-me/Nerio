import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

import { DatePickerPreview } from "./date-picker-preview";

const datePickerDoc = getComponentDoc("date-picker");

export const metadata = createPageMetadata({
  title: "DatePicker component",
  description: datePickerDoc!.description,
  path: "/docs/components/date-picker",
});

const anatomyRows = [
  ["root", "State wrapper for the trigger, popup, and form mirror."],
  ["trigger", "Native button aligned with the form-control family."],
  ["content", "Anchored Base UI Popover surface."],
  ["Calendar slots", "Calendar retains its complete public anatomy inside the popup."],
  ["clear", "Optional explicit action that returns the value to empty."],
  ["form-control", "Single hidden native form value mirror."],
] as const;

const stateRows = [
  ["Empty", "Shows the explicit placeholder and open action context."],
  ["Selected", "Formats one ISO value for display without changing its submitted value."],
  ["Open", "Moves focus into Calendar and restores it after selection or dismissal."],
  ["Invalid", "Uses the form-family invalid border and forwards aria-invalid."],
  ["Required", "The native form mirror participates in constraint validation."],
  ["Read-only", "The popup remains inspectable while value and clear actions are locked."],
  ["Disabled", "The trigger and form value are disabled."],
] as const;

const apiRows = [
  [
    "value / defaultValue",
    "CalendarDate | null",
    "Controlled or uncontrolled selected YYYY-MM-DD date; null is empty.",
  ],
  ["onValueChange", "(date | null) => void", "Receives selection or an explicit clear."],
  ["open / defaultOpen", "boolean", "Controlled or uncontrolled Popover state."],
  ["onOpenChange", "(open, details) => void", "Forwards Base UI dismissal details."],
  ["name / form", "string", "Native form ownership and submitted key."],
  ["onInvalid", "FormEventHandler<HTMLInputElement>", "Observes native constraint validation."],
  ["required / disabled / readOnly / invalid", "boolean", "Form and interaction states."],
  ["min / max / isDateDisabled", "Calendar contract", "Reused Calendar constraints."],
  [
    "locale / firstDayOfWeek",
    "Intl locale / 0–6",
    "Display, labels, and week order; locale defaults to en-US for deterministic SSR.",
  ],
  ["formatValue", "(date, locale) => ReactNode", "Strict display formatting only; never parsing."],
  ["placeholder", "ReactNode", "Explicit empty-state text."],
  [
    "labels",
    "DatePickerLabels",
    "Localized trigger context, clear, Calendar, and navigation copy.",
  ],
  ["clearable", "boolean", "Adds one explicit clear action when a value exists."],
  ["ref", "HTMLElement", "Accesses the public trigger control."],
] as const;

export default function DatePickerPage() {
  return (
    <StandardDocPage
      title="DatePicker"
      lede={datePickerDoc!.description}
      kind="date-picker"
      preview={<DatePickerPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Contract", "Description"]}
            rows={[
              ["Uncontrolled", "Use defaultValue for a complete source-owned form control."],
              ["Controlled", "Own value and open state when product composition requires it."],
              [
                "Clearable",
                "Opt into one explicit clear action; no presets or shortcuts are added.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Description"]}
            rows={anatomyRows}
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
              ["Entrypoint", "@nerio-ui/ui/client"],
              ["Value", "Timezone-independent ISO YYYY-MM-DD or null."],
              ["Overlay", "Base UI Popover with Calendar as the single interactive date surface."],
              ["Form", "One native-compatible submitted value with reset and required behavior."],
              [
                "Registry",
                "nerio add date-picker installs DatePicker, Calendar, Popover styling, and source dependencies.",
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
                  <li>Use native Input type=date when direct keyboard text entry is required.</li>
                  <li>Use DatePicker for one custom, localizable calendar date.</li>
                  <li>Wrap it in Field or provide an explicit ARIA naming strategy.</li>
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
                  <li>Parse localized or natural-language text.</li>
                  <li>Add ranges, presets, time, timezone, availability, or scheduling.</li>
                  <li>Duplicate the form value with another named date input.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ),
        tokens: (
          <DocumentationTable
            headers={["Layer", "Tokens", "Controls"]}
            rows={[
              ["Form family", "--n-input-*", "Closed trigger states and density."],
              ["Overlay", "--n-overlay-* / --n-popover-*", "Anchored popup surface and motion."],
              ["Calendar", "--n-calendar-*", "Month grid, days, selection, and constraints."],
              ["Focus", "--n-focus-ring", "Trigger and Calendar focus visibility."],
            ]}
          />
        ),
      }}
    />
  );
}
