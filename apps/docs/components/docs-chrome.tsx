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
import { Badge, Button, DropdownMenu, Icon, IconButton, Input, Select } from "@nerio/ui";
import type { IconComponent } from "@nerio/ui";

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
      { href: "/docs/foundations/effects", label: "Radius and effects", icon: Circle },
      { href: "/docs/foundations/icons", label: "Icons", icon: Circle },
    ],
  },
  {
    title: "Actions and feedback",
    items: [
      { href: "/docs/components/button", label: "Button", icon: Circle },
      { href: "/docs/components/icon-button", label: "IconButton", icon: Circle },
      { href: "/docs/components/badge", label: "Badge", icon: Circle },
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
  const [theme, setThemeValue] = React.useState("purple");
  const [mode, setModeValue] = React.useState("system");
  const [density, setDensityValue] = React.useState("comfortable");
  const [search, setSearch] = React.useState("");
  const [toc, setToc] = React.useState<Array<{ id: string; label: string }>>([]);

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
    setToc(nextToc.filter((item) => item.label.length > 0));
  }, [pathname, children]);

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

  const modeIcon = mode === "dark" ? Sun : Moon;

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden />
          <span>Nerio</span>
          <Badge>{version}</Badge>
        </Link>

        <label className="docs-search">
          <Icon icon={Search} />
          <Input
            aria-label="Search documentation"
            placeholder="Search documentation"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
          />
          <kbd>/</kbd>
        </label>

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
            {toc.length > 0 ? (
              <nav>
                {toc.map((item) => (
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
