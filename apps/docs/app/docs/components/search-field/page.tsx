import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const searchFieldDoc = getComponentDoc("search-field");

const anatomyRows = [
  ["root / label", "Field root and visible native label."],
  ["input-group / input", "Shared surface around one native search input."],
  ["search-icon", "Decorative default or consumer-provided search icon."],
  ["actions / clear", "Localizable clear action that restores input focus."],
  ["loading", "Localizable default status or consumer loading-indicator slot."],
  ["description / message", "Associated help or validation content."],
] as const;
const stateRows = [
  ["Value", "One controlled or uncontrolled string query."],
  ["Search", "Enter emits onSearch without preventing native form submission."],
  ["Loading", "Presentation only; requests remain consumer-owned."],
  ["Disabled / read-only", "Preserves native semantics and prevents clearing."],
  ["Required / invalid", "Participates in forms and associates validation content."],
] as const;
const apiRows = [
  ["value / defaultValue / onValueChange", "One controlled or uncontrolled query."],
  ["onSearch", "Receives the current query and an IME-safe Enter event detail."],
  ["clearLabel", "Localizable accessible name for the icon-only clear action."],
  ["loading / loadingLabel", "Default localizable loading status presentation."],
  ["searchIcon / loadingIndicator", "Meaningful structural customization slots."],
  ["name / form / required / autoComplete", "Native form identity, reset, and autofill hints."],
  ["disabled / readOnly / invalid", "Native interaction and Field validation states."],
] as const;

export const metadata = createPageMetadata({
  title: "SearchField component",
  description: searchFieldDoc!.description,
  path: "/docs/components/search-field",
});

export default function Page() {
  return (
    <StandardDocPage
      title={searchFieldDoc!.title}
      lede={searchFieldDoc!.description}
      kind="search-field"
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
                Use SearchField for one free-form query that needs clear and explicit search
                behavior.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Put results, requests, debounce, filtering, ranking, routing, global shortcuts,
                history, analytics, or product entities in SearchField.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
