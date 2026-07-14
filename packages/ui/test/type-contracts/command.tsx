import * as React from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  type CommandGroupData,
  type CommandItemData,
} from "../../src/client";

const flatItems = [
  { value: "settings", label: "Workspace settings", keywords: ["preferences"] },
] satisfies readonly CommandItemData[];

const groupedItems = [
  {
    value: "navigation",
    label: "Navigation",
    items: [{ value: "overview", label: "Open overview" }],
  },
] satisfies readonly CommandGroupData[];

const flatCommand = (
  <Command items={flatItems}>
    <CommandInput aria-label="Flat commands" />
    <CommandList>
      {(item) => <CommandItem value={item.value}>{item.label}</CommandItem>}
    </CommandList>
  </Command>
);

const groupedCommand = (
  <Command items={groupedItems}>
    <CommandInput aria-label="Grouped commands" />
    <CommandList renderGroupLabel={(group) => group.label}>
      {(item) => <CommandItem value={item.value}>{item.label}</CommandItem>}
    </CommandList>
  </Command>
);

void [flatCommand, groupedCommand];
