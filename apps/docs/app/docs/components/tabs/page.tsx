"use client";

import * as React from "react";
import { ArrowRight, Check, LayoutDashboard, Settings, X } from "@nerio-ui/adapters/icons";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
} from "@nerio-ui/ui";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
} from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";

const tabsDoc = getComponentDoc("tabs")!;

function Example({
  variant = "bordered",
  size = "md",
  showDisabled = true,
}: {
  variant?: "bordered" | "separate" | "segmented";
  size?: "sm" | "md" | "lg";
  showDisabled?: boolean;
}) {
  return (
    <Tabs defaultValue="overview" size={size} variant={variant}>
      <TabsList aria-label="Workspace sections">
        <TabsTrigger
          badge={<Badge size="sm">12</Badge>}
          leadingIcon={LayoutDashboard}
          value="overview"
        >
          Overview
        </TabsTrigger>
        <TabsTrigger trailingIcon={ArrowRight} value="activity">
          Activity
        </TabsTrigger>
        {showDisabled ? (
          <TabsTrigger disabled leadingIcon={Settings} value="settings">
            Settings
          </TabsTrigger>
        ) : null}
        <TabsIndicator />
      </TabsList>
      <TabsPanels>
        <TabsContent value="overview">12 tasks are due this week.</TabsContent>
        <TabsContent value="activity">Recent workspace activity appears here.</TabsContent>
        {showDisabled ? (
          <TabsContent value="settings">Settings are unavailable in this preview.</TabsContent>
        ) : null}
      </TabsPanels>
    </Tabs>
  );
}

function TabsExample({
  children,
  code,
  label,
}: {
  children: React.ReactNode;
  code: string;
  label: string;
}) {
  return (
    <section className="component-example" aria-label={label}>
      <div className="component-example__preview tabs-doc-preview">{children}</div>
      <CodeExample className="component-example__code" code={code} label={`${label} code`} />
    </section>
  );
}

function LayoutExample() {
  return (
    <Tabs defaultValue="one" variant="segmented">
      <TabsList aria-label="Equal workspace views" layout="fill">
        <TabsTrigger leadingIcon={LayoutDashboard} value="one">
          Overview
        </TabsTrigger>
        <TabsTrigger trailingIcon={ArrowRight} value="two">
          Activity
        </TabsTrigger>
        <TabsTrigger leadingIcon={Settings} value="three">
          Files
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsPanels>
        <TabsContent value="one">Equal-width triggers use the available space.</TabsContent>
        <TabsContent value="two">Activity content.</TabsContent>
        <TabsContent value="three">Files content.</TabsContent>
      </TabsPanels>
    </Tabs>
  );
}

function ScrollableExample() {
  return (
    <div style={{ maxInlineSize: "18rem" }}>
      <Tabs defaultValue="overview" variant="bordered">
        <TabsList aria-label="Narrow project sections" scrollable>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsIndicator />
        </TabsList>
      </Tabs>
    </div>
  );
}

function ControlledExample() {
  const [value, setValue] = React.useState("overview");
  const [direction, setDirection] = React.useState("none");
  const [reason, setReason] = React.useState("none");

  return (
    <Tabs
      onValueChange={(nextValue, eventDetails) => {
        setValue(nextValue);
        setDirection(eventDetails.activationDirection);
        setReason(eventDetails.reason);
      }}
      value={value}
    >
      <TabsList aria-label="Controlled workspace sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsPanels>
        <TabsContent value="overview">
          Consumer value: {value}; direction: {direction}; reason: {reason}
        </TabsContent>
        <TabsContent value="activity">
          Consumer value: {value}; direction: {direction}; reason: {reason}
        </TabsContent>
      </TabsPanels>
    </Tabs>
  );
}

const usage = `import { ArrowRight, LayoutDashboard } from "@nerio-ui/adapters/icons";
import { Badge } from "@nerio-ui/ui";
import { Tabs, TabsContent, TabsIndicator, TabsList, TabsPanels, TabsTrigger } from "@nerio-ui/ui/client";

<Tabs defaultValue="overview" variant="segmented" size="md">
  <TabsList aria-label="Workspace sections">
    <TabsTrigger value="overview" leadingIcon={LayoutDashboard} badge={<Badge size="sm">12</Badge>}>Overview</TabsTrigger>
    <TabsTrigger value="activity" trailingIcon={ArrowRight}>Activity</TabsTrigger>
    <TabsIndicator />
  </TabsList>
  <TabsPanels>
    <TabsContent value="overview">Overview content</TabsContent>
    <TabsContent value="activity">Activity content</TabsContent>
  </TabsPanels>
</Tabs>`;

export default function Page() {
  return (
    <StandardDocPage
      title="Tabs"
      lede={tabsDoc.description}
      kind="tabs"
      preview={
        <TabsExample code={usage} label="Tabs compound API">
          <Example showDisabled={false} variant="segmented" />
        </TabsExample>
      }
      sectionPreviews={{
        variants: (
          <>
            <TabsExample
              code={'<Tabs defaultValue="overview" variant="bordered">...</Tabs>'}
              label="Bordered Tabs preview"
            >
              <Example variant="bordered" />
            </TabsExample>
            <TabsExample
              code={'<Tabs defaultValue="overview" variant="separate">...</Tabs>'}
              label="Separate Tabs preview"
            >
              <Example variant="separate" />
            </TabsExample>
            <TabsExample
              code={'<Tabs defaultValue="overview" variant="segmented">...</Tabs>'}
              label="Segmented Tabs preview"
            >
              <Example variant="segmented" />
            </TabsExample>
            <TabsExample
              code={
                '<Tabs size="sm">...</Tabs>\n<Tabs size="md">...</Tabs>\n<Tabs size="lg">...</Tabs>'
              }
              label="Tabs sizes preview"
            >
              <div className="form-preview-stack">
                <Example size="sm" />
                <Example size="md" />
                <Example size="lg" />
              </div>
            </TabsExample>
            <TabsExample
              code={'<TabsList layout="fill" aria-label="Equal workspace views">...</TabsList>'}
              label="Tabs fill layout preview"
            >
              <LayoutExample />
            </TabsExample>
            <TabsExample
              code={'<Tabs orientation="vertical">...</Tabs>'}
              label="Vertical Tabs preview"
            >
              <Tabs defaultValue="overview" orientation="vertical" variant="bordered">
                <TabsList aria-label="Vertical workspace sections">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsIndicator />
                </TabsList>
                <TabsPanels>
                  <TabsContent value="overview">
                    Vertical tabs use orientation-aware arrow keys.
                  </TabsContent>
                  <TabsContent value="activity">Activity content.</TabsContent>
                </TabsPanels>
              </Tabs>
            </TabsExample>
            <TabsExample
              code={'<TabsList scrollable aria-label="Narrow project sections">...</TabsList>'}
              label="Scrollable Tabs preview"
            >
              <ScrollableExample />
            </TabsExample>
            <TabsExample
              code={
                "<Tabs value={value} onValueChange={(nextValue, details) => { setValue(nextValue); setDirection(details.activationDirection); setReason(details.reason); }}>...</Tabs>"
              }
              label="Controlled Tabs preview"
            >
              <ControlledExample />
            </TabsExample>
          </>
        ),
        anatomy: (
          <TabsExample
            code={
              '<TabsTrigger leadingIcon={LayoutDashboard} badge={<Badge size="sm">12</Badge>} value="overview">Overview</TabsTrigger>'
            }
            label="Tabs trigger anatomy preview"
          >
            <Example showDisabled={false} variant="separate" />
          </TabsExample>
        ),
        states: (
          <>
            <TabsExample
              code={'<TabsList activateOnFocus aria-label="Immediate panels">...</TabsList>'}
              label="Automatic activation preview"
            >
              <Tabs defaultValue="overview">
                <TabsList activateOnFocus aria-label="Immediate panels">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsIndicator />
                </TabsList>
                <TabsPanels>
                  <TabsContent value="overview">Focus selects this immediate panel.</TabsContent>
                  <TabsContent value="activity">Activity is immediately available.</TabsContent>
                </TabsPanels>
              </Tabs>
            </TabsExample>
            <TabsExample code={'<div dir="rtl"><Tabs>...</Tabs></div>'} label="RTL Tabs preview">
              <div dir="rtl">
                <Example showDisabled={false} variant="segmented" />
              </div>
            </TabsExample>
          </>
        ),
      }}
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
                "Receives Base UI value and complete event details including activation direction.",
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
