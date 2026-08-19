import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { AccordionPreview } from "./accordion-preview";

const accordionDoc = getComponentDoc("accordion")!;

export default function Page() {
  return (
    <StandardDocPage
      title="Accordion"
      lede={accordionDoc.description}
      kind="accordion"
      preview={<AccordionPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Mode", "Use"]}
            rows={[
              [
                "Single expansion",
                "Default mode for a compact related set with at most one open item.",
              ],
              [
                "Multiple expansion",
                "Use multiple when people need to compare or keep several sections open.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Purpose"]}
            rows={[
              ["root", "Owns the array of expanded item values."],
              ["item", "Stable string identity and optional disabled state."],
              ["header", "Semantic heading matched to the surrounding outline."],
              ["trigger", "Native button associated with one panel."],
              ["panel", "Hidden content that unmounts when closed by default."],
            ]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable
            headers={["State", "Behavior"]}
            rows={[
              ["Closed", "Item value is absent and the panel is removed by default."],
              ["Open", "Item value is present in the root value array."],
              ["Disabled", "Item remains visible and cannot change state."],
              ["Reduced motion", "Panel changes state immediately without travel."],
              ["RTL", "Logical alignment follows inherited document direction."],
            ]}
            codeColumns={1}
          />
        ),
        api: (
          <DocumentationTable
            headers={["Prop", "Use"]}
            rows={[
              [
                "value / defaultValue",
                "Controlled or uncontrolled arrays of stable string values.",
              ],
              ["onValueChange", "Receives the next array and cancellable Nerio event details."],
              ["multiple", "Allows more than one item to remain open."],
              ["AccordionItem value / disabled", "Identifies one item and optionally disables it."],
              [
                "AccordionHeader render",
                "Selects the heading level required by the document outline.",
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
                Group concise, related sections and keep every stable value unique.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Accordion for routed navigation, unrelated page sections, or essential
                always-visible content.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Collapsible",
                "Reveal one independent panel without grouped state.",
                "/docs/components/collapsible",
              ],
              [
                "Tabs",
                "Switch between peer panels that remain one active view.",
                "/docs/components/tabs",
              ],
              [
                "Card",
                "Keep essential grouped content persistently visible.",
                "/docs/components/card",
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
        tokens: (
          <DocumentationTable
            headers={["Token", "Controls"]}
            rows={[
              [
                "--n-disclosure-background / border / divider",
                "Grouped surface and item boundaries.",
              ],
              [
                "--n-disclosure-trigger-min-height / padding-inline",
                "Density-aware trigger geometry.",
              ],
              [
                "--n-disclosure-panel-padding-inline / foreground",
                "Panel content rhythm and tone.",
              ],
              ["--n-disclosure-focus-ring", "Inset trigger focus treatment."],
              ["--n-motion-reveal-duration / easing", "Measured-height state transition."],
            ]}
            codeColumns={1}
          />
        ),
      }}
    />
  );
}
