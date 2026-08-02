"use client";

import type * as React from "react";
import { ArrowRight, LayoutDashboard, Settings } from "@nerio-ui/adapters/icons";
import { Badge } from "@nerio-ui/ui";
import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
} from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

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

export function TabsPreview() {
  return (
    <TabsExample code={usage} label="Tabs compound API">
      <Example showDisabled={false} variant="segmented" />
    </TabsExample>
  );
}
