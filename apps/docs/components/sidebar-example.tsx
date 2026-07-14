"use client";

import * as React from "react";
import { LayoutDashboard, ListTree, Settings } from "@nerio/adapters/icons";
import { Icon, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset } from "@nerio/ui";
import { Sidebar, SidebarProvider, SidebarRail, SidebarTrigger } from "@nerio/ui/client";

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
                  <button key={label} type="button">
                    <Icon icon={icon} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </SidebarContent>
            <SidebarFooter>Core layout only</SidebarFooter>
            <SidebarRail label="Collapse preview sidebar" />
          </Sidebar>
          <SidebarInset as="div">
            <SidebarTrigger label="Expand preview sidebar" />
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
