"use client";

import { Button } from "@/components/nerio/components/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/nerio/components/command";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/nerio/components/item";
import { List } from "@/components/nerio/components/list";
import { Pagination } from "@/components/nerio/components/pagination";
import { Select } from "@/components/nerio/components/select";
import {
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/nerio/components/sidebar";
import {
  SidebarContent,
  SidebarHeader,
  SidebarInset,
} from "@/components/nerio/components/sidebar-layout";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/nerio/components/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/nerio/components/table";
import { Toast, ToastProvider, ToastViewport } from "@/components/nerio/components/toast";
import { Heading, Text } from "@/components/nerio/components/typography";

const commandGroups = [
  {
    value: "navigation",
    label: "Navigation",
    items: [
      { value: "projects", label: "Open projects" },
      { value: "settings", label: "Open settings" },
    ],
  },
];

export function SourcePreview() {
  return (
    <ToastProvider>
      <section aria-labelledby="source-preview-title">
        <Heading id="source-preview-title" as="h2">
          Source-installed components
        </Heading>
        <Text>
          Foundation typography and complete component dependency chains compile together.
        </Text>
        <Button>Source action</Button>
        <Select
          label="Density"
          defaultValue="comfortable"
          options={[{ label: "Comfortable", value: "comfortable" }]}
        />
        <Sheet>
          <SheetTrigger>Open source sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Source sheet</SheetTitle>
              <SheetDescription>Installed through the CLI.</SheetDescription>
            </SheetHeader>
            <SheetBody>Source dependency chains compile outside the workspace.</SheetBody>
          </SheetContent>
        </Sheet>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Install</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination aria-label="Source pages" pages={[{ key: "1", label: "1", current: true }]} />
        <List
          aria-label="Source list"
          items={[{ id: "list-1", title: "Installed list", description: "Static source API" }]}
        />
        <Item>
          <ItemContent>
            <ItemTitle>Installed item</ItemTitle>
            <ItemDescription>Composable source API</ItemDescription>
          </ItemContent>
        </Item>
        <SidebarProvider sidebarId="source-sidebar">
          <Sidebar aria-label="Source sidebar">
            <SidebarHeader>Workspace</SidebarHeader>
            <SidebarContent>Source-installed navigation</SidebarContent>
            <SidebarRail label="Toggle source sidebar" />
          </Sidebar>
          <SidebarInset as="div">
            <SidebarTrigger label="Toggle source sidebar" />
          </SidebarInset>
        </SidebarProvider>
        <Command items={commandGroups}>
          <CommandInput aria-label="Source commands" />
          <CommandList renderGroupLabel={(group) => group.label}>
            {(item) => <CommandItem value={item.value}>{item.label}</CommandItem>}
          </CommandList>
        </Command>
        <Toast title="Source toast" description="Installed feedback API" />
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
