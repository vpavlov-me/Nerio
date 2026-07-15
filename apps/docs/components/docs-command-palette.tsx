"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "@nerio-ui/adapters/icons";
import { Button, Dialog, Icon, Input, Kbd } from "@nerio-ui/ui/client";

export type DocsCommandEntry = {
  href: string;
  title: string;
  group: string;
  description: string;
};

export function DocsCommandPalette({ entries }: { entries: DocsCommandEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const queryText = query.trim().toLowerCase();
  const results = React.useMemo(
    () =>
      (queryText
        ? entries.filter((entry) =>
            [entry.title, entry.group, entry.description, entry.href]
              .join(" ")
              .toLowerCase()
              .includes(queryText),
          )
        : entries.filter((entry) => !entry.href.includes("#"))
      ).slice(0, 12),
    [entries, queryText],
  );
  const groupedResults = React.useMemo(() => {
    const groups = new Map<string, Array<{ entry: DocsCommandEntry; index: number }>>();

    results.forEach((entry, index) => {
      const group = groups.get(entry.group) ?? [];
      group.push({ entry, index });
      groups.set(entry.group, group);
    });

    return [...groups];
  }, [results]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  const select = React.useCallback(
    (entry: DocsCommandEntry) => {
      close();
      router.push(entry.href);
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
    if (!open) return;
    setActiveIndex(0);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, queryText]);

  return (
    <div className="docs-search-wrap">
      <Dialog
        bodyClassName="docs-command-dialog__body"
        className="docs-command-dialog"
        onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : close())}
        open={open}
        title="Search documentation"
        trigger={
          <Button
            aria-label="Search documentation"
            className="docs-search-trigger"
            icon={Search}
            title="Search documentation (/ or ⌘K)"
            variant="ghost"
          />
        }
      >
        <div className="docs-command">
          <div className="docs-command__input-wrap">
            <Icon icon={Search} />
            <Input
              ref={inputRef}
              aria-activedescendant={
                results[activeIndex] ? `docs-command-option-${activeIndex}` : undefined
              }
              aria-controls="docs-command-results"
              aria-expanded={open}
              aria-label="Search documentation"
              placeholder="Search documentation..."
              role="combobox"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((index) => (index + 1) % Math.max(results.length, 1));
                }
                if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex(
                    (index) => (index - 1 + results.length) % Math.max(results.length, 1),
                  );
                }
                if (event.key === "Enter" && results[activeIndex]) {
                  event.preventDefault();
                  select(results[activeIndex]);
                }
                if (event.key === "Escape") close();
              }}
            />
          </div>
          <div id="docs-command-results" className="docs-command__results" role="listbox">
            {groupedResults.length ? (
              groupedResults.map(([group, groupEntries]) => (
                <section className="docs-command__group" key={group} aria-label={group}>
                  <h2>{group}</h2>
                  {groupEntries.map(({ entry, index }) => (
                    <Link
                      aria-selected={activeIndex === index}
                      className={activeIndex === index ? "is-active" : undefined}
                      href={entry.href}
                      id={`docs-command-option-${index}`}
                      key={entry.href}
                      role="option"
                      onClick={(event) => {
                        event.preventDefault();
                        select(entry);
                      }}
                      onMouseMove={() => setActiveIndex(index)}
                    >
                      <Icon icon={ArrowRight} />
                      <span>
                        <strong>{entry.title}</strong>
                        <small>{entry.description}</small>
                      </span>
                    </Link>
                  ))}
                </section>
              ))
            ) : (
              <p className="docs-command__empty">No matching documentation.</p>
            )}
          </div>
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
        </div>
      </Dialog>
    </div>
  );
}
