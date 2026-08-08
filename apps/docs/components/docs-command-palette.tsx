"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "@nerio-ui/adapters/icons";
import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  Icon,
  Kbd,
  Tooltip,
  type CommandGroupData,
} from "@nerio-ui/ui/client";

export type DocsCommandEntry = {
  href: string;
  title: string;
  group: string;
  description: string;
  newTab?: boolean;
};

const DocsSearchTrigger = React.forwardRef<
  HTMLButtonElement,
  Omit<React.ComponentPropsWithoutRef<"button">, "children">
>(function DocsSearchTrigger(props, ref) {
  return (
    <Tooltip delay={0} label="Search documentation (/ or ⌘K)">
      <Button
        {...props}
        ref={ref}
        aria-label="Search documentation"
        className="docs-search-trigger"
        icon={Search}
        tooltip={false}
        variant="ghost"
      />
    </Tooltip>
  );
});

export function DocsCommandPalette({ entries }: { entries: DocsCommandEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const queryText = query.trim().toLowerCase();
  const results = React.useMemo(() => {
    const matches = queryText
      ? entries.filter((entry) =>
          [entry.title, entry.group, entry.description, entry.href]
            .join(" ")
            .toLowerCase()
            .includes(queryText),
        )
      : entries.filter((entry) => !entry.href.includes("#"));

    if (!queryText) return matches.slice(0, 12);

    const exactMatches: DocsCommandEntry[] = [];
    const partialMatches: DocsCommandEntry[] = [];
    matches.forEach((entry) => {
      (entry.title.toLowerCase() === queryText ? exactMatches : partialMatches).push(entry);
    });

    return [...exactMatches, ...partialMatches].slice(0, 12);
  }, [entries, queryText]);
  const entriesByHref = React.useMemo(
    () => new Map(results.map((entry) => [entry.href, entry])),
    [results],
  );
  const groupedResults = React.useMemo<readonly CommandGroupData[]>(() => {
    const groups = new Map<string, DocsCommandEntry[]>();

    results.forEach((entry) => {
      const group = groups.get(entry.group) ?? [];
      group.push(entry);
      groups.set(entry.group, group);
    });

    return [...groups].map(([group, groupEntries]) => ({
      value: group,
      label: group,
      items: groupEntries.map((entry) => ({
        value: entry.href,
        label: entry.title,
        keywords: [entry.group, entry.description],
      })),
    }));
  }, [results]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const select = React.useCallback(
    (entry: DocsCommandEntry) => {
      close();
      if (entry.newTab) {
        window.open(entry.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(entry.href);
      }
    },
    [close, router],
  );

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const shortcut = event.key === "/" || ((event.metaKey || event.ctrlKey) && event.key === "k");
      if (!shortcut || target?.matches("input, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      setOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  return (
    <div className="docs-search-wrap">
      <Dialog
        bodyClassName="docs-command-dialog__body"
        className="docs-command-dialog"
        onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}
        open={open}
        title="Search documentation"
        trigger={<DocsSearchTrigger />}
      >
        <Command
          className="docs-command"
          filter={false}
          items={groupedResults}
          query={query}
          onQueryChange={setQuery}
          onKeyDownCapture={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              close();
            }
          }}
        >
          <CommandInput
            aria-label="Search documentation"
            autoFocus
            placeholder="Search documentation..."
          />
          <CommandEmpty>No matching documentation.</CommandEmpty>
          <CommandList renderGroupLabel={(group) => group.label}>
            {(item) => {
              const entry = entriesByHref.get(item.value);
              return (
                <CommandItem
                  description={entry?.description}
                  leading={<Icon icon={ArrowRight} />}
                  value={item.value}
                  onSelect={() => {
                    if (entry) select(entry);
                  }}
                >
                  {item.label}
                </CommandItem>
              );
            }}
          </CommandList>
          <footer className="docs-command__footer">
            <span>
              <Kbd aria-hidden>↑↓</Kbd> Navigate
            </span>
            <span>
              <Kbd aria-hidden>↵</Kbd> Open
            </span>
            <span>
              <Kbd aria-hidden>Esc</Kbd> Close
            </span>
          </footer>
        </Command>
      </Dialog>
    </div>
  );
}
