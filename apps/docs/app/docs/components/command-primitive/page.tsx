"use client";

import * as React from "react";
import { Check, FileText, LayoutDashboard, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon, Kbd } from "@nerio-ui/ui";
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  Dialog,
  Popover,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type CommandGroupData,
  type CommandItemData,
} from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";

const commandDoc = getComponentDoc("command-primitive")!;

const flatItems: readonly CommandItemData[] = [
  { value: "overview", label: "Open overview", keywords: ["dashboard"] },
  { value: "settings", label: "Workspace settings", keywords: ["preferences"] },
  { value: "invite", label: "Invite teammate", keywords: ["member", "collaborator"] },
  { value: "archive", label: "Archive workspace", disabled: true },
];

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

function LocalCommand({ grouped = false }: { grouped?: boolean }) {
  const [selected, setSelected] = React.useState("None");
  const items = grouped ? groupedItems : flatItems;
  return (
    <div className="form-preview-stack">
      <Command items={items}>
        <CommandInput aria-label="Workspace commands" placeholder="Search commands" />
        <CommandEmpty>No matching commands.</CommandEmpty>
        <CommandList>{(item) => <ResultItem item={item} onSelect={setSelected} />}</CommandList>
      </Command>
      <p aria-live="polite">Selected value: {selected}</p>
    </div>
  );
}

function AsyncCommand() {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState(flatItems);

  React.useEffect(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      const normalized = query.trim().toLocaleLowerCase();
      setResults(
        normalized
          ? flatItems.filter((item) =>
              [item.label, item.value, ...(item.keywords ?? [])]
                .join(" ")
                .toLocaleLowerCase()
                .includes(normalized),
            )
          : flatItems,
      );
      setLoading(false);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <Command items={results} query={query} onQueryChange={setQuery} filter={false}>
      <CommandInput aria-label="Consumer-filtered commands" placeholder="Search async results" />
      <CommandLoading loading={loading}>Loading consumer results…</CommandLoading>
      <CommandEmpty>{loading ? null : "No consumer results."}</CommandEmpty>
      <CommandList>{(item) => <ResultItem item={item} />}</CommandList>
    </Command>
  );
}

function OverlayCommand({ label }: { label: string }) {
  return (
    <Command items={groupedItems}>
      <CommandInput aria-label={`${label} commands`} placeholder="Search commands" autoFocus />
      <CommandEmpty>No matching commands.</CommandEmpty>
      <CommandList>{(item) => <ResultItem item={item} />}</CommandList>
    </Command>
  );
}

function Example({
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
      <div className="component-example__preview">{children}</div>
      <CodeExample className="component-example__code" code={code} label={`${label} code`} />
    </section>
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

export default function Page() {
  return (
    <StandardDocPage
      title="Command Primitive"
      lede={commandDoc.description}
      kind="command-primitive"
      preview={
        <Example code={usage} label="Inline Command with local filtering">
          <LocalCommand grouped />
        </Example>
      }
      sectionPreviews={{
        usage: (
          <>
            <Example
              code={
                "<Command items={items} filter={false} query={query} onQueryChange={setQuery}>...</Command>"
              }
              label="Consumer-filtered async Command"
            >
              <AsyncCommand />
            </Example>
            <Example
              code={'<Popover trigger="Open commands">\n  <Command>...</Command>\n</Popover>'}
              label="Command in Popover"
            >
              <Popover trigger="Open commands" title="Workspace commands">
                <OverlayCommand label="Popover" />
              </Popover>
            </Example>
            <Example
              code={
                '<Dialog trigger="Open dialog" title="Workspace commands">\n  <Command>...</Command>\n</Dialog>'
              }
              label="Command in Dialog"
            >
              <Dialog
                trigger="Open dialog"
                title="Workspace commands"
                description="Choose a local action."
              >
                <OverlayCommand label="Dialog" />
              </Dialog>
            </Example>
            <Example
              code={
                "<Sheet>\n  <SheetTrigger render={<Button>Open sheet</Button>} />\n  <SheetContent><Command>...</Command></SheetContent>\n</Sheet>"
              }
              label="Command in Sheet"
            >
              <Sheet>
                <SheetTrigger render={<Button variant="secondary">Open sheet</Button>} />
                <SheetContent size="md">
                  <SheetHeader>
                    <SheetTitle>Workspace commands</SheetTitle>
                    <SheetDescription>Choose a local action.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <OverlayCommand label="Sheet" />
                  </SheetBody>
                </SheetContent>
              </Sheet>
            </Example>
          </>
        ),
        variants: (
          <Example
            code={"<Command items={groupedItems}>...</Command>"}
            label="Grouped Command results"
          >
            <LocalCommand grouped />
          </Example>
        ),
        states: (
          <Example
            code={'<Command defaultQuery="no-match" items={items}>...</Command>'}
            label="Command empty and disabled states"
          >
            <Command defaultQuery="no-match" items={flatItems}>
              <CommandInput aria-label="Empty command example" />
              <CommandEmpty>No matching commands.</CommandEmpty>
              <CommandList>{(item) => <ResultItem item={item} />}</CommandList>
            </Command>
          </Example>
        ),
      }}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Mode", "Contract"]}
            rows={[
              [
                "Local",
                "Locale-aware matching uses label, value, and keywords; selection writes only the visible label.",
              ],
              [
                "Consumer-filtered",
                "filter={false}; consumers replace items during loading or remote work.",
              ],
              [
                "Grouped",
                "Labelled group records preserve stable leaf values and listbox semantics.",
              ],
              ["Overlay", "The same inline primitive composes inside Popover, Dialog, or Sheet."],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Purpose"]}
            rows={[
              ["command", "Inline Base UI Autocomplete root."],
              ["command-input", "Required named combobox input; DOM focus remains here."],
              ["command-list", "Filtered listbox and grouped result renderer."],
              ["command-group / command-group-label", "Accessible labelled result group."],
              ["command-item", "Stable action value with optional content slots."],
              [
                "command-item-leading",
                "General React content that owns its semantics; decorative Nerio Icons hide themselves.",
              ],
              [
                "command-empty / command-loading",
                "Dedicated polite status regions outside listbox children.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable
            headers={["State", "Behavior"]}
            rows={[
              ["Active", "aria-activedescendant tracks the keyboard or pointer-highlighted item."],
              ["Disabled", "Visible but skipped during keyboard navigation and never selected."],
              ["Empty", "One concise polite message after filtering."],
              [
                "Loading",
                "A single Spinner and localized polite status for consumer-owned async work.",
              ],
              ["IME composition", "Enter does not select until composition finishes."],
            ]}
            codeColumns={1}
          />
        ),
        api: (
          <DocumentationTable
            headers={["API", "Purpose"]}
            rows={[
              [
                "items",
                "Flat CommandItemData or labelled CommandGroupData records with stable values.",
              ],
              [
                "query / defaultQuery / onQueryChange",
                "Controlled or uncontrolled visible query; selection writes the item label only.",
              ],
              [
                "filter",
                "Typed matcher over leaf items; default search includes label, value, and keywords, or false preserves external results.",
              ],
              [
                "onActiveValueChange",
                "Reports stable highlighted values without exposing internal indices.",
              ],
              [
                "CommandItem.onSelect",
                "Emits the stable value and event while the visible query remains label-only.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use for local commands and compact action pickers; compose icons, descriptions,
                metadata, and Kbd.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Turn Core Command into GlobalSearch, Documentation Search, a routed palette, remote
                ranking, history, or global shortcut registration.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
