"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Boxes,
  Check,
  ChevronDown,
  Code2,
  Circle,
  Copy,
  ExternalLink,
  FileText,
  Github,
  Layers,
  ListTree,
  Moon,
  Palette,
  PanelLeft,
  PackageOpen,
  Search,
  Sparkles,
  Sun,
  Type,
  Wrench,
} from "@nerio/adapters";
import { Badge, Button, DropdownMenu, Icon, IconButton, Input, Select } from "@nerio/ui/client";
import type { IconComponent } from "@nerio/ui/client";

const version = "v0.1.0";
const repoUrl = "https://github.com/vpavlov-me/Nerio";

type NavItem = {
  href: string;
  label: string;
  icon: IconComponent;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { href: "/docs/getting-started", label: "Getting started", icon: BookOpen },
      { href: "/docs/registry", label: "Registry and CLI", icon: Boxes },
      { href: "/docs/ai", label: "AI tooling", icon: Sparkles },
    ],
  },
  {
    title: "Foundations",
    items: [
      { href: "/docs/foundations/tokens", label: "Tokens", icon: Layers },
      { href: "/docs/foundations/typography", label: "Typography", icon: Type },
      { href: "/docs/foundations/themes", label: "Themes", icon: Palette },
      { href: "/docs/foundations/motion", label: "Motion", icon: Sparkles },
      { href: "/docs/foundations/effects", label: "Radius and effects", icon: Circle },
      { href: "/docs/foundations/icons", label: "Icons", icon: Circle },
    ],
  },
  {
    title: "Actions and feedback",
    items: [
      { href: "/docs/components/button", label: "Button", icon: Circle },
      { href: "/docs/components/icon-button", label: "IconButton", icon: Circle },
      { href: "/docs/components/link", label: "Link", icon: Circle },
      { href: "/docs/components/badge", label: "Badge", icon: Circle },
      { href: "/docs/components/alert", label: "Alert", icon: Circle },
      { href: "/docs/components/spinner", label: "Spinner", icon: Circle },
      { href: "/docs/components/skeleton", label: "Skeleton", icon: Circle },
      { href: "/docs/components/empty-state", label: "EmptyState", icon: FileText },
      { href: "/docs/components/toast", label: "Toast", icon: Circle },
    ],
  },
  {
    title: "Forms",
    items: [
      { href: "/docs/components/input", label: "Input", icon: Circle },
      { href: "/docs/components/textarea", label: "Textarea", icon: FileText },
      { href: "/docs/components/label", label: "Label", icon: Circle },
      { href: "/docs/components/field", label: "Field", icon: Circle },
      { href: "/docs/components/form-message", label: "FormMessage", icon: Circle },
      { href: "/docs/components/checkbox", label: "Checkbox", icon: Circle },
      { href: "/docs/components/radio-group", label: "RadioGroup", icon: Circle },
      { href: "/docs/components/switch", label: "Switch", icon: Circle },
      { href: "/docs/components/select", label: "Select", icon: Circle },
    ],
  },
  {
    title: "Layout and display",
    items: [
      { href: "/docs/components/card", label: "Card", icon: PanelLeft },
      { href: "/docs/components/separator", label: "Separator", icon: Circle },
      { href: "/docs/components/avatar", label: "Avatar", icon: Circle },
      { href: "/docs/components/progress", label: "Progress", icon: Circle },
      { href: "/docs/components/stat", label: "Stat", icon: Circle },
      { href: "/docs/components/key-value", label: "KeyValue", icon: ListTree },
      { href: "/docs/components/table", label: "Table", icon: ListTree },
    ],
  },
  {
    title: "Navigation and overlays",
    items: [
      { href: "/docs/components/tabs", label: "Tabs", icon: Layers },
      { href: "/docs/components/dialog", label: "Dialog", icon: PanelLeft },
      { href: "/docs/components/popover", label: "Popover", icon: PanelLeft },
      { href: "/docs/components/tooltip", label: "Tooltip", icon: Circle },
      { href: "/docs/components/dropdown-menu", label: "DropdownMenu", icon: Wrench },
    ],
  },
];

const themeOptions = [
  { label: "Purple", value: "purple" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
  { label: "Red", value: "red" },
  { label: "Neutral", value: "neutral" },
];

const densityOptions = [
  { label: "Comfortable", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

type TocItem = {
  id: string;
  label: string;
};

type SearchEntry = {
  href: string;
  title: string;
  group: string;
  description: string;
};

const componentToc: TocItem[] = [
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion" },
  { id: "accessibility", label: "Accessibility" },
  { id: "api", label: "API" },
  { id: "implementation-contract", label: "Implementation contract" },
  { id: "design-notes", label: "Design notes" },
  { id: "do-do-not", label: "Do / do not" },
  { id: "related-components", label: "Related components" },
  { id: "tokens", label: "Tokens" },
];

const buttonToc: TocItem[] = [
  { id: "preview", label: "Preview" },
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion" },
  { id: "accessibility", label: "Accessibility" },
  { id: "api", label: "API" },
  { id: "implementation-contract", label: "Implementation contract" },
  { id: "design-notes", label: "Design notes" },
  { id: "do-do-not", label: "Do / do not" },
  { id: "related-components", label: "Related components" },
  { id: "tokens", label: "Tokens" },
];

const tocByPath: Record<string, TocItem[]> = {
  "/docs/getting-started": [
    { id: "install", label: "Install" },
    { id: "project-shape", label: "Project shape" },
    { id: "principles", label: "Principles" },
  ],
  "/docs/foundations/tokens": [
    { id: "three-layer-contract", label: "Three-layer contract" },
    { id: "primitive-palette", label: "Primitive palette" },
    { id: "semantic-tokens", label: "Semantic tokens" },
    { id: "component-tokens", label: "Component tokens" },
    { id: "live-component-readout", label: "Live component readout" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/typography": [
    { id: "font-contract", label: "Font contract" },
    { id: "type-scale", label: "Type scale" },
    { id: "technical-content", label: "Technical content" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/themes": [
    { id: "theme-contract", label: "Theme contract" },
    { id: "runtime-switching", label: "Runtime switching" },
    { id: "density", label: "Density" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/motion": [
    { id: "motion-preview", label: "Preview" },
    { id: "duration-tokens", label: "Duration tokens" },
    { id: "easing-tokens", label: "Easing tokens" },
    { id: "semantic-motion", label: "Semantic motion" },
    { id: "component-utilities", label: "Component utilities" },
    { id: "reduced-motion", label: "Reduced motion" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/effects": [
    { id: "radius-scale", label: "Radius scale" },
    { id: "effect-styles", label: "Effect styles" },
    { id: "focus", label: "Focus" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/icons": [
    { id: "icon-adapter-preview", label: "Icon adapter preview" },
    { id: "contract", label: "Contract" },
    { id: "usage", label: "Usage" },
    { id: "do-do-not", label: "Do / do not" },
  ],
  "/docs/registry": [
    { id: "quick-start", label: "Quick start" },
    { id: "project-configuration", label: "Project configuration" },
    { id: "available-source-items", label: "Available source items" },
    { id: "registry-contract", label: "Registry contract" },
  ],
  "/docs/ai": [
    { id: "llms-txt", label: "llms.txt" },
    { id: "mcp-server", label: "MCP server" },
    { id: "agent-composition-rules", label: "Agent composition rules" },
  ],
};

function getDefaultToc(pathname: string): TocItem[] {
  if (pathname === "/docs/components/button") return buttonToc;
  if (pathname.startsWith("/docs/components/")) return componentToc;
  return tocByPath[pathname] ?? [];
}

const searchEntries: SearchEntry[] = navGroups.flatMap((group) =>
  group.items.flatMap((item) => {
    const pageSections = getDefaultToc(item.href);
    return [
      {
        href: item.href,
        title: item.label,
        group: group.title,
        description: `${item.label} documentation and examples.`,
      },
      ...pageSections.map((section) => ({
        href: `${item.href}#${section.id}`,
        title: section.label,
        group: item.label,
        description: `${section.label} section in ${item.label}.`,
      })),
    ];
  }),
);

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function pageToMarkdown() {
  const article = document.querySelector(".docs-main .doc-page");
  if (!article) return `# Nerio\n\n${window.location.href}`;

  const lines: string[] = [];
  article.querySelectorAll("h1, h2, h3, p, li, pre code").forEach((node) => {
    const text = node.textContent?.trim();
    if (!text) return;

    if (node.matches("h1")) lines.push(`# ${text}`);
    else if (node.matches("h2")) lines.push(`## ${text}`);
    else if (node.matches("h3")) lines.push(`### ${text}`);
    else if (node.matches("li")) lines.push(`- ${text}`);
    else if (node.matches("pre code")) lines.push(`\`\`\`\n${text}\n\`\`\``);
    else lines.push(text);
  });

  return `${lines.join("\n\n")}\n\nSource: ${window.location.href}`;
}

function PageActions() {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyMarkdown = async () => {
    await navigator.clipboard.writeText(pageToMarkdown());
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  const viewMarkdown = () => {
    const markdownUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(pageToMarkdown())}`;
    window.open(markdownUrl, "_blank", "noopener,noreferrer");
  };

  const copyInstallHint = async (target: "Cursor" | "VS Code") => {
    await navigator.clipboard.writeText(
      `Install the Nerio MCP server in ${target}: pnpm --filter @nerio/mcp start`,
    );
  };

  const openAssistant = (assistant: "chatgpt" | "claude") => {
    const prompt = encodeURIComponent(`Use this Nerio documentation page: ${window.location.href}`);
    const url =
      assistant === "chatgpt"
        ? `https://chatgpt.com/?q=${prompt}`
        : `https://claude.ai/new?q=${prompt}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const actionItem = (
    icon: IconComponent,
    title: string,
    description: string,
    external = false,
  ) => (
    <span className="docs-action-item">
      <Icon icon={icon} />
      <span>
        <span>{title}</span>
        <small>{description}</small>
      </span>
      {external ? <Icon icon={ExternalLink} /> : null}
    </span>
  );

  return (
    <div className="docs-page-actions" aria-label="Page actions">
      <Button
        className="docs-copy-markdown"
        leadingIcon={copied ? Check : Copy}
        size="sm"
        variant="secondary"
        onClick={copyMarkdown}
      >
        {copied ? "Copied" : "Copy Markdown"}
      </Button>
      <DropdownMenu
        className="docs-actions-menu"
        trigger={
          <IconButton
            className="docs-actions-toggle"
            icon={ChevronDown}
            label="Open page actions"
            size="sm"
            variant="secondary"
          />
        }
        items={[
          {
            label: actionItem(FileText, "View as Markdown", "View page as Markdown format"),
            onSelect: viewMarkdown,
          },
          {
            label: actionItem(PackageOpen, "Add to Cursor", "Install MCP Server on Cursor"),
            onSelect: () => void copyInstallHint("Cursor"),
          },
          {
            label: actionItem(Code2, "Add to VS Code", "Install MCP Server on VS Code"),
            onSelect: () => void copyInstallHint("VS Code"),
          },
          {
            label: actionItem(Sparkles, "Open in ChatGPT", "Ask questions about this page", true),
            onSelect: () => openAssistant("chatgpt"),
          },
          {
            label: actionItem(Circle, "Open in Claude", "Ask questions about this page", true),
            onSelect: () => openAssistant("claude"),
          },
        ]}
      />
    </div>
  );
}

export function DocsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fallbackToc = getDefaultToc(pathname);
  const [theme, setThemeValue] = React.useState("purple");
  const [mode, setModeValue] = React.useState("system");
  const [density, setDensityValue] = React.useState("compact");
  const [search, setSearch] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [toc, setToc] = React.useState<TocItem[]>(fallbackToc);
  const searchInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
    document.documentElement.setAttribute("data-density", density);
  }, [theme, mode, density]);

  React.useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".docs-main h2"));
    const nextToc = headings.map((heading) => {
      const label = heading.textContent?.trim() ?? "";
      if (!heading.id) heading.id = slugify(label);
      return { id: heading.id, label };
    });
    const filteredToc = nextToc.filter((item) => item.label.length > 0);
    setToc(filteredToc.length > 0 ? filteredToc : getDefaultToc(pathname));
  }, [pathname, children]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, [contenteditable='true']")) return;
      event.preventDefault();
      searchInputRef.current?.focus();
      setSearchOpen(true);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const setTheme = (value: string) => {
    setThemeValue(value);
    document.documentElement.setAttribute("data-theme", value);
  };

  const setDensity = (value: string) => {
    setDensityValue(value);
    document.documentElement.setAttribute("data-density", value);
  };

  const toggleMode = () => {
    const next = mode === "dark" ? "light" : "dark";
    setModeValue(next);
    document.documentElement.setAttribute("data-mode", next);
  };

  const filteredGroups = search.trim()
    ? navGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            item.label.toLowerCase().includes(search.trim().toLowerCase()),
          ),
        }))
        .filter((group) => group.items.length > 0)
    : navGroups;

  const searchTerm = search.trim().toLowerCase();
  const searchResults = searchTerm
    ? searchEntries
        .filter((entry) =>
          [entry.title, entry.group, entry.description, entry.href]
            .join(" ")
            .toLowerCase()
            .includes(searchTerm),
        )
        .slice(0, 8)
    : [];

  const modeIcon = mode === "dark" ? Sun : Moon;
  const visibleToc = toc.length > 0 ? toc : fallbackToc;

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span>Nerio</span>
          <Badge>{version}</Badge>
        </Link>

        <div className="docs-search-wrap">
          <label className="docs-search">
            <Icon icon={Search} />
            <Input
              ref={searchInputRef}
              aria-label="Search documentation"
              placeholder="Search documentation"
              value={search}
              onBlur={() => window.setTimeout(() => setSearchOpen(false), 120)}
              onChange={(event) => {
                setSearch(event.currentTarget.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
            />
            <kbd>/</kbd>
          </label>
          {searchOpen && searchTerm ? (
            <div className="docs-search-results" role="listbox">
              {searchResults.length ? (
                searchResults.map((entry) => (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    role="option"
                    onClick={() => {
                      setSearch("");
                      setSearchOpen(false);
                    }}
                  >
                    <span>{entry.title}</span>
                    <small>
                      {entry.group} - {entry.description}
                    </small>
                  </Link>
                ))
              ) : (
                <div className="docs-search-empty">No matching documentation pages.</div>
              )}
            </div>
          ) : null}
        </div>

        <div className="docs-controls">
          <Select label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
          <Select label="Density" value={density} onChange={setDensity} options={densityOptions} />
          <IconButton
            icon={modeIcon}
            label={mode === "dark" ? "Use light mode" : "Use dark mode"}
            variant="secondary"
            onClick={toggleMode}
          />
          <IconButton
            icon={Github}
            label="Open Nerio on GitHub"
            variant="secondary"
            render={<a href={repoUrl} target="_blank" rel="noreferrer" />}
          />
        </div>
      </header>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <nav aria-label="Documentation">
            {filteredGroups.map((group) => (
              <div className="nav-group" key={group.title}>
                <h2>{group.title}</h2>
                {group.items.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={pathname === href ? "is-active" : undefined}
                    aria-current={pathname === href ? "page" : undefined}
                  >
                    <Icon icon={icon} />
                    {label}
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="docs-main">
          <PageActions />
          {children}
        </main>

        <aside className="docs-toc" aria-label="On this page">
          <div className="docs-toc-card">
            <div className="docs-toc-title">On this page</div>
            {visibleToc.length > 0 ? (
              <nav>
                {visibleToc.map((item) => (
                  <a key={item.id} href={`#${item.id}`}>
                    {item.label}
                  </a>
                ))}
              </nav>
            ) : (
              <p>No sections yet.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
