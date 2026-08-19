import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { CollapsiblePreview } from "./collapsible-preview";

const collapsibleDoc = getComponentDoc("collapsible")!;

export default function Page() {
  return (
    <StandardDocPage
      title="Collapsible"
      lede={collapsibleDoc.description}
      kind="collapsible"
      preview={<CollapsiblePreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Path", "Use"]}
            rows={[
              [
                "Collapsible",
                "One controlled or uncontrolled disclosure with maintained anatomy and motion.",
              ],
              [
                "details / summary",
                "Simple native disclosure with no shared abstraction requirement.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Purpose"]}
            rows={[
              ["root", "Owns one open state and the disabled boundary."],
              ["trigger", "Native button associated with the panel."],
              ["panel", "Hidden content that unmounts when closed by default."],
            ]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable
            headers={["State", "Behavior"]}
            rows={[
              ["Closed", "Panel is removed by default, including interactive descendants."],
              ["Open", "Measured height and opacity reveal the complete content."],
              ["Disabled", "The visible trigger cannot change state."],
              ["Reduced motion", "The panel changes state immediately without travel."],
            ]}
            codeColumns={1}
          />
        ),
        api: (
          <DocumentationTable
            headers={["Prop", "Use"]}
            rows={[
              ["open / defaultOpen", "Controlled or uncontrolled open state."],
              ["onOpenChange", "Receives the next state and cancellable Nerio event details."],
              ["disabled", "Disables the complete disclosure."],
              [
                "keepMounted / hiddenUntilFound",
                "Preserves browser-hidden content for state or page search.",
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
                Use one concise trigger for content that can safely leave the reading flow.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Wrap simple native disclosure or grouped sections in one oversized component.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Accordion",
                "Coordinate a related group of disclosure items.",
                "/docs/components/accordion",
              ],
              [
                "Card",
                "Keep essential grouped content persistently visible.",
                "/docs/components/card",
              ],
              [
                "Button",
                "Trigger an action without retaining disclosure state.",
                "/docs/components/button",
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
              ["--n-disclosure-background / border / radius", "Disclosure surface and boundary."],
              [
                "--n-disclosure-trigger-min-height / padding-inline",
                "Density-aware trigger geometry.",
              ],
              [
                "--n-disclosure-panel-padding-inline / foreground",
                "Panel content rhythm and tone.",
              ],
              ["--n-motion-reveal-duration / easing", "Measured-height state transition."],
            ]}
            codeColumns={1}
          />
        ),
      }}
    />
  );
}
