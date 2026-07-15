"use client";

import * as React from "react";
import { SidebarContent, SidebarFooter, SidebarHeader, SidebarInset } from "@nerio-ui/ui";
import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@nerio-ui/ui/client";

const navigation = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
] as const;

function ProductNavigation({ items }: { items: typeof navigation }) {
  return (
    <nav aria-label="Workspace">
      {items.map((item) => (
        <a href={item.href} key={item.href}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function SidebarUsageExample() {
  return (
    <SidebarProvider defaultExpanded side="left">
      <Sidebar aria-label="Workspace sidebar">
        <SidebarHeader>Workspace</SidebarHeader>
        <SidebarContent>
          <nav aria-label="Workspace">Workspace navigation</nav>
        </SidebarContent>
        <SidebarFooter>Account</SidebarFooter>
        <SidebarRail label="Toggle workspace sidebar" />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger label="Toggle workspace sidebar" />
        Product content
      </SidebarInset>
    </SidebarProvider>
  );
}

export function PersistentSidebar({ children }: React.PropsWithChildren) {
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
}

export function ResponsiveSidebarExample({ isMobile }: { isMobile: boolean }) {
  return isMobile ? (
    <Sheet>
      <SheetTrigger render={<Button>Open navigation</Button>} />
      <SheetContent side="left" size="sm">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <SheetBody>
          <ProductNavigation items={navigation} />
        </SheetBody>
      </SheetContent>
    </Sheet>
  ) : (
    <SidebarProvider>
      <Sidebar aria-label="Workspace sidebar">
        <SidebarContent>
          <ProductNavigation items={navigation} />
        </SidebarContent>
      </Sidebar>
      <SidebarInset>Product content</SidebarInset>
    </SidebarProvider>
  );
}
