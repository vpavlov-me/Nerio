"use client";

import * as React from "react";
import { LayoutDashboard, ListTree, Settings } from "@nerio-ui/adapters/icons";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarInset } from "@nerio-ui/ui";
import { Sidebar, SidebarMenuButton, SidebarProvider, SidebarRail } from "@nerio-ui/ui/client";

const items = [
  ["Overview", LayoutDashboard],
  ["Projects", ListTree],
  ["Settings", Settings],
] as const;

export function SidebarExample() {
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => {
    setExpanded(window.localStorage.getItem("nerio-sidebar-doc-expanded") !== "false");
  }, []);

  return (
    <section id="preview" className="component-example" aria-label="Sidebar preview">
      <div className="component-example__preview sidebar-doc-preview">
        <SidebarProvider
          collapseMode="icons"
          expanded={expanded}
          onExpandedChange={(nextExpanded) => {
            setExpanded(nextExpanded);
            window.localStorage.setItem("nerio-sidebar-doc-expanded", String(nextExpanded));
          }}
          sidebarId="docs-sidebar-preview"
        >
          <Sidebar aria-label="Preview sidebar">
            <SidebarHeader>
              <strong>Nerio Workspace</strong>
            </SidebarHeader>
            <SidebarContent>
              <nav aria-label="Preview navigation">
                {items.map(([label, icon]) => (
                  <SidebarMenuButton
                    collapsedTooltip={label}
                    key={label}
                    leadingIcon={icon}
                    variant="ghost"
                  >
                    {label}
                  </SidebarMenuButton>
                ))}
              </nav>
            </SidebarContent>
            <SidebarFooter>Core layout only</SidebarFooter>
            <SidebarRail
              collapseLabel="Collapse sidebar"
              expandLabel="Expand sidebar"
              label="Toggle sidebar"
            />
          </Sidebar>
          <SidebarInset as="div">
            <div>
              <strong>Product content</strong>
              <p>Routes and navigation behavior stay in the consuming application.</p>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </section>
  );
}
