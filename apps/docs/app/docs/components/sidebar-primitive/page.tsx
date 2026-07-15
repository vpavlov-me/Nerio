import type { Metadata } from "next";
import { CodeExample } from "../../../../components/code-example";
import { StandardDocPage } from "../../../../components/doc-page";
import { SidebarExample } from "../../../../components/sidebar-example";

export const metadata: Metadata = {
  title: "Sidebar Primitive component",
  description:
    "Compose a persistent collapsible page region without moving navigation or product-shell behavior into Core.",
};

const persistenceExample = `"use client";

import * as React from "react";
import { SidebarProvider } from "@nerio-ui/ui/client";

function PersistentSidebar({ children }: React.PropsWithChildren) {
  const [expanded, setExpanded] = React.useState(true);

  React.useEffect(() => {
    setExpanded(window.localStorage.getItem("sidebar-expanded") !== "false");
  }, []);

  return (
    <SidebarProvider
      expanded={expanded}
      onExpandedChange={(nextExpanded) => {
        setExpanded(nextExpanded);
        window.localStorage.setItem("sidebar-expanded", String(nextExpanded));
      }}
    >
      {children}
    </SidebarProvider>
  );
}`;

const mobileExample = `import { SidebarContent, SidebarInset } from "@nerio-ui/ui";
import { Button, Sheet, SheetBody, SheetContent, SheetHeader, SheetTitle, SheetTrigger, Sidebar, SidebarProvider } from "@nerio-ui/ui/client";

const navigation = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
];

// Resolve isMobile in consumer code with a hydration-safe media-query hook.
return isMobile ? (
  <Sheet>
    <SheetTrigger render={<Button>Open navigation</Button>} />
    <SheetContent side="left" size="sm">
      <SheetHeader><SheetTitle>Navigation</SheetTitle></SheetHeader>
      <SheetBody><ProductNavigation items={navigation} /></SheetBody>
    </SheetContent>
  </Sheet>
) : (
  <SidebarProvider>
    <Sidebar aria-label="Workspace sidebar">
      <SidebarContent><ProductNavigation items={navigation} /></SidebarContent>
    </Sidebar>
    <SidebarInset>...</SidebarInset>
  </SidebarProvider>
);`;

export default function SidebarPage() {
  return (
    <StandardDocPage
      kind="sidebar-primitive"
      title="Sidebar Primitive"
      lede="A composable Core layout primitive for physical side placement, controlled or uncontrolled collapse, accessible toggling, and tokenized regions."
      preview={<SidebarExample />}
      sectionPreviews={{
        usage: (
          <div className="sidebar-doc-examples">
            <CodeExample code={persistenceExample} label="Consumer-owned persistence example" />
            <CodeExample code={mobileExample} label="Mobile Sheet composition example" />
          </div>
        ),
      }}
    />
  );
}
