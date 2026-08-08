"use client";

import * as React from "react";
import { FileText, LayoutDashboard } from "@nerio-ui/adapters/icons";
import { Icon, Kbd } from "@nerio-ui/ui";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  type CommandGroupData,
  type CommandItemData,
} from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

const groupedItems: readonly CommandGroupData[] = [
  {
    value: "navigation",
    label: "Navigation",
    items: [
      { value: "overview", label: "Open overview", keywords: ["dashboard"] },
      {
        value: "documents",
        label: "Browse documents shared across every regional workspace",
        keywords: ["files"],
      },
    ],
  },
  {
    value: "workspace",
    label: "Workspace",
    items: [
      { value: "settings", label: "Workspace settings", keywords: ["preferences"] },
      { value: "invite", label: "Invite teammate" },
      { value: "archive", label: "Archive workspace", disabled: true },
    ],
  },
];

const itemIcons: Partial<Record<string, React.ReactNode>> = {
  overview: <Icon icon={LayoutDashboard} />,
  documents: <Icon icon={FileText} />,
};

const itemShortcuts: Partial<Record<string, React.ReactNode>> = {
  overview: <Kbd aria-hidden>G O</Kbd>,
  settings: <Kbd aria-hidden>⌘ ,</Kbd>,
};

function ResultItem({
  item,
  onSelect,
}: {
  item: CommandItemData;
  onSelect?: (value: string) => void;
}) {
  return (
    <CommandItem
      key={item.value}
      value={item.value}
      disabled={item.disabled}
      description={item.disabled ? "Unavailable for archived workspaces" : "Consumer-owned action"}
      leading={
        item.value === "archive" ? (
          <span aria-label="Restricted action">●</span>
        ) : (
          itemIcons[item.value]
        )
      }
      metadata={item.value === "documents" ? "Shared" : undefined}
      shortcut={itemShortcuts[item.value]}
      onSelect={(value) => onSelect?.(value)}
    >
      {item.label}
    </CommandItem>
  );
}

const usage = `import { Kbd } from "@nerio-ui/ui";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@nerio-ui/ui/client";

const items = [
  { value: "settings", label: "Workspace settings", keywords: ["preferences"] },
  { value: "archive", label: "Archive workspace", disabled: true },
];

<Command items={items}>
  <CommandInput aria-label="Workspace commands" placeholder="Search commands" />
  <CommandEmpty>No matching commands.</CommandEmpty>
  <CommandList>
    {(item) => (
      <CommandItem
        key={item.value}
        value={item.value}
        disabled={item.disabled}
        shortcut={<Kbd aria-hidden>⌘ ,</Kbd>}
        onSelect={(value, event) => runCommand(value, event)}
      >
        {item.label}
      </CommandItem>
    )}
  </CommandList>
</Command>`;

export function CommandPreview() {
  const [selected, setSelected] = React.useState("None");

  return (
    <section className="component-example" aria-label="Inline Command with local filtering">
      <div className="component-example__preview">
        <div className="form-preview-stack">
          <Command items={groupedItems}>
            <CommandInput aria-label="Workspace commands" placeholder="Search commands" />
            <CommandEmpty>No matching commands.</CommandEmpty>
            <CommandList>{(item) => <ResultItem item={item} onSelect={setSelected} />}</CommandList>
          </Command>
          <p aria-live="polite">Selected value: {selected}</p>
        </div>
      </div>
      <CodeExample
        className="component-example__code"
        code={usage}
        label="Inline Command with local filtering code"
      />
    </section>
  );
}
