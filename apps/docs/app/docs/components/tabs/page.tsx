import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { TabsPreview } from "./tabs-preview";

const tabsDoc = getComponentDoc("tabs")!;

export default function Page() {
  return (
    <StandardDocPage
      title="Tabs"
      lede={tabsDoc.description}
      kind="tabs"
      preview={<TabsPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Variant", "Use"]}
            rows={[
              ["bordered", "Quiet default with an edge accent indicator."],
              ["separate", "Independent compact triggers."],
              ["segmented", "A compact shared control surface."],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Purpose"]}
            rows={[
              ["root", "Base UI root with size, variant, and orientation."],
              ["list", "Named controls with content or fill layout."],
              ["trigger", "Visible label with optional icons and Badge."],
              ["indicator", "Base UI positioned selected treatment."],
              ["panels / content", "Transition-safe panel association."],
            ]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable
            headers={["State", "Behavior"]}
            rows={[
              ["Default / active", "The indicator follows Base UI active-tab CSS variables."],
              ["Focus-visible", "Inset focus treatment remains visible inside a scrollable list."],
              ["Disabled", "Disabled tabs are visually muted and skipped by keyboard navigation."],
              ["Scrollable", "Horizontal lists scroll without wrapping labels."],
              ["Reduced motion", "Indicator and panel transitions become immediate."],
              [
                "RTL",
                "The horizontal indicator follows physical active-tab geometry in either direction.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        api: (
          <DocumentationTable
            headers={["Prop", "Use"]}
            rows={[
              ["variant / size", "bordered, separate, segmented; sm, md, lg."],
              [
                "layout / scrollable",
                "content or fill, with horizontal overflow enabled by default.",
              ],
              [
                "TabsList activateOnFocus",
                "Opt in only when panels appear without noticeable latency.",
              ],
              [
                "onValueChange",
                "Receives a string value and Nerio event details including activation direction.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        implementation: (
          <p>
            Tabs preserves Base UI tab, tablist, and tabpanel relationships. Use an explicit enabled{" "}
            <code>defaultValue</code> for predictable SSR when the first trigger is disabled.
          </p>
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use a small set of concise peer panels and keep the selected tab visible in
                scrollable lists.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Tabs for global destinations, form values, icon-only labels, deep nesting, or
                slow automatic activation.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Badge",
                "Show a short count or status within a visible tab label.",
                "/docs/components/badge",
              ],
              [
                "ButtonGroup",
                "Group equal actions rather than switching associated panels.",
                "/docs/components/button-group",
              ],
              [
                "RadioGroup",
                "Choose one form value from visible options.",
                "/docs/components/radio-group",
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
      }}
    />
  );
}
