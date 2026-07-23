import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

import { CalendarPreview } from "./calendar-preview";

const calendarDoc = getComponentDoc("calendar");

export const metadata = createPageMetadata({
  title: "Calendar component",
  description: calendarDoc!.description,
  path: "/docs/components/calendar",
});

const anatomyRows = [
  ["root", "Named Calendar group and state owner."],
  ["header", "Previous-month action, live month heading, and next-month action."],
  ["grid", "Six-week native table with ARIA grid semantics."],
  ["weekday-header", "Locale-aware weekday labels with full abbr names."],
  ["row", "One visual calendar week."],
  ["cell", "Gridcell carrying selected state."],
  ["day", "Native date button participating in roving focus."],
] as const;

const stateRows = [
  ["Default", "Shows one month with one keyboard tab stop."],
  ["Selected", "Uses accent fill and border plus aria-selected on the containing gridcell."],
  ["Today", "Uses aria-current=date, weight, and underline without changing selection."],
  ["Outside month", "Remains available with muted text and moves the visible month when selected."],
  ["Unavailable", "Min, max, or isDateDisabled prevents selection and adds aria-disabled."],
  ["Read-only", "Keeps navigation and focus available while preventing value changes."],
  ["Disabled", "Disables navigation and every day button."],
] as const;

const apiRows = [
  ["value / defaultValue", "CalendarDate", "Controlled or uncontrolled selected YYYY-MM-DD date."],
  ["onValueChange", "(date) => void", "Receives one valid, available ISO calendar date."],
  ["month / defaultMonth", "CalendarDate", "Visible month; input normalizes to its first day."],
  ["onMonthChange", "(month) => void", "Receives the visible month as YYYY-MM-01."],
  ["min / max", "CalendarDate", "Inclusive ISO date boundaries."],
  ["isDateDisabled", "(date) => boolean", "Consumer policy hook for unavailable dates."],
  ["locale", "string | string[]", "Intl locale for month, weekday, and date labels."],
  ["firstDayOfWeek", "0–6", "Explicit Sunday-through-Saturday week start; defaults to Sunday."],
  ["today", "CalendarDate", "Stable current date for today state and deterministic SSR."],
  ["labels", "CalendarLabels", "Localized previous- and next-month action names."],
  ["disabled / readOnly", "boolean", "Availability and selection behavior."],
  ["aria-label / aria-labelledby", "string", "Exactly one required Calendar naming strategy."],
  ["ref", "HTMLDivElement", "Accesses the Calendar root group."],
] as const;

const tokenRows = [
  [
    "Container",
    "--n-calendar-width / padding / radius / border / background",
    "Bounded month surface.",
  ],
  ["Grid", "--n-calendar-grid-gap / cell-gap / cell-size", "Month spacing and density."],
  ["Type", "--n-calendar-heading-* / weekday-* / day-font-size", "Localized hierarchy."],
  ["Days", "--n-calendar-day-*", "Default, hover, outside, unavailable, and selected states."],
  ["Today", "--n-calendar-today-*", "Non-color current-date distinction."],
  ["Motion", "--n-calendar-duration / easing", "Immediate tokenized feedback with reduced motion."],
] as const;

export default function CalendarPage() {
  return (
    <StandardDocPage
      title="Calendar"
      lede={calendarDoc!.description}
      kind="calendar"
      preview={<CalendarPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Contract", "Description"]}
            rows={[
              ["Uncontrolled", "Use defaultValue and defaultMonth for the common inline path."],
              [
                "Controlled",
                "Own value and month independently when product composition requires it.",
              ],
              ["Localized", "Set locale, firstDayOfWeek, and labels without changing ISO values."],
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
              ["Behavior", "Native buttons in a labelled ARIA grid; no date runtime dependency."],
              ["Entrypoint", "@nerio-ui/ui/client"],
              ["Value", "Timezone-independent ISO YYYY-MM-DD calendar date."],
              [
                "Registry",
                "nerio add calendar installs Calendar plus Button and source dependencies.",
              ],
              [
                "Boundary",
                "One visible month and one selected date; product workflows remain external.",
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
                  <li>Use native Input type=date when browser-owned picker UI is sufficient.</li>
                  <li>
                    Use Calendar when an inline, tokenized, localizable date grid is required.
                  </li>
                  <li>Supply today during SSR when the product needs a stable timezone policy.</li>
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
                  <li>
                    Add date ranges, multiple selection, presets, or natural-language parsing.
                  </li>
                  <li>Embed events, prices, availability data, scheduling, or recurrence.</li>
                  <li>
                    Use Calendar as DatePicker; popup and form composition belongs to DatePicker.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ),
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
