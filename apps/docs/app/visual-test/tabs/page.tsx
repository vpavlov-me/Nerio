"use client";

import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "@nerio-ui/ui/client";

export default function TabsTestPage() {
  return (
    <main className="visual-test-fixture">
      <div style={{ maxInlineSize: "18rem" }}>
        <Tabs defaultValue="overview" variant="bordered">
          <TabsList aria-label="Narrow project sections" scrollable>
            <TabsTrigger value="overview">Workspace overview</TabsTrigger>
            <TabsTrigger value="activity">Recent project activity</TabsTrigger>
            <TabsTrigger value="members">Project members and permissions</TabsTrigger>
            <TabsTrigger value="settings">Workspace settings</TabsTrigger>
            <TabsIndicator />
          </TabsList>
        </Tabs>
      </div>
    </main>
  );
}
