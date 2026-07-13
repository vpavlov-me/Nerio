"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Box,
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
  Sparkles,
  Sun,
  Type,
  Wrench,
} from "@nerio/adapters";
import { Badge, Button, ButtonGroup, DropdownMenu, Icon } from "@nerio/ui/client";
import type { IconComponent } from "@nerio/ui/client";
import { DocsCommandPalette, type DocsCommandEntry } from "./docs-command-palette";
import { siteConfig } from "../lib/site-config";

const { version, repositoryUrl: repoUrl } = siteConfig;
const modeStorageKey = "nerio-docs-mode";
type ColorMode = "system" | "light" | "dark";
type FeedbackValue = "helpful" | "neutral" | "not-helpful";

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
      { href: "/docs/foundations/animations", label: "Animations", icon: Sparkles },
      { href: "/docs/foundations/radius", label: "Radius", icon: Circle },
      { href: "/docs/foundations/effects", label: "Effects", icon: Wrench },
      { href: "/docs/foundations/icons", label: "Icons", icon: Box },
    ],
  },
  {
    title: "Actions",
    items: [
      { href: "/docs/components/kbd", label: "Kbd", icon: Code2 },
      { href: "/docs/components/button", label: "Button", icon: Circle },
      { href: "/docs/components/button-group", label: "ButtonGroup", icon: Circle },
    ],
  },
  {
    title: "Feedback",
    items: [
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
      { href: "/docs/components/input-group", label: "InputGroup", icon: Circle },
      { href: "/docs/components/textarea", label: "Textarea", icon: FileText },
      { href: "/docs/components/label", label: "Label", icon: Circle },
      { href: "/docs/components/field", label: "Field", icon: Circle },
      { href: "/docs/components/form-message", label: "FormMessage", icon: Circle },
      { href: "/docs/components/form-group", label: "FormGroup", icon: Circle },
      { href: "/docs/components/checkbox", label: "Checkbox", icon: Circle },
      { href: "/docs/components/radio-group", label: "RadioGroup", icon: Circle },
      { href: "/docs/components/switch", label: "Switch", icon: Circle },
      { href: "/docs/components/select", label: "Select", icon: Circle },
    ],
  },
  {
    title: "Layout",
    items: [
      { href: "/docs/components/typography", label: "Typography", icon: Type },
      { href: "/docs/components/card", label: "Card", icon: PanelLeft },
      { href: "/docs/components/separator", label: "Separator", icon: Circle },
    ],
  },
  {
    title: "Data display",
    items: [
      { href: "/docs/components/avatar", label: "Avatar", icon: Circle },
      { href: "/docs/components/progress", label: "Progress", icon: Circle },
      { href: "/docs/components/stat", label: "Stat", icon: Circle },
      { href: "/docs/components/key-value", label: "KeyValue", icon: ListTree },
      { href: "/docs/components/table", label: "Table", icon: ListTree },
      { href: "/docs/components/list", label: "List", icon: ListTree },
      { href: "/docs/components/item", label: "Item", icon: ListTree },
    ],
  },
  {
    title: "Navigation",
    items: [
      { href: "/docs/components/tabs", label: "Tabs", icon: Layers },
      { href: "/docs/components/breadcrumbs", label: "Breadcrumbs", icon: ListTree },
      { href: "/docs/components/pagination", label: "Pagination", icon: ListTree },
    ],
  },
  {
    title: "Overlays",
    items: [
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

function getThemeDotColor(theme: string) {
  return theme === "neutral" ? "var(--n-color-text-secondary)" : `var(--n-${theme}-600)`;
}

type TocItem = {
  id: string;
  label: string;
  level?: 2 | 3 | 4;
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

const compositionToc: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "live-preview", label: "Live preview" },
  { id: "code", label: "Code" },
  { id: "components-used", label: "Components used" },
  { id: "accessibility", label: "Accessibility" },
  { id: "responsive-behaviour", label: "Responsive behaviour" },
  { id: "notes", label: "Notes" },
];

const compositionGroup: NavGroup = {
  title: "Blocks",
  items: [
    { href: "/docs/blocks/login", label: "Login", icon: PanelLeft },
    { href: "/docs/blocks/register", label: "Register", icon: PanelLeft },
    { href: "/docs/blocks/forgot-password", label: "Forgot password", icon: PanelLeft },
    { href: "/docs/blocks/settings-form", label: "Settings form", icon: Wrench },
    { href: "/docs/blocks/table-toolbar", label: "Table toolbar", icon: ListTree },
    { href: "/docs/blocks/user-profile", label: "User profile", icon: Circle },
    { href: "/docs/blocks/empty-states", label: "Empty states", icon: FileText },
    { href: "/docs/blocks/feedback", label: "Feedback", icon: Circle },
    { href: "/docs/blocks/overlay-playground", label: "Overlay playground", icon: PanelLeft },
    { href: "/docs/blocks/navigation-patterns", label: "Navigation patterns", icon: Layers },
    { href: "/docs/blocks/dense-form", label: "Dense form", icon: Wrench },
  ],
};

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

const badgeToc: TocItem[] = [
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
    { id: "token-architecture", label: "Token architecture" },
    { id: "primitive-tokens", label: "Primitive tokens" },
    { id: "semantic-tokens", label: "Semantic tokens" },
    { id: "component-tokens", label: "Component tokens" },
    { id: "live-component-readout", label: "Live component readout" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/typography": [
    { id: "font-contract", label: "Font contract" },
    { id: "presets", label: "Presets" },
    { id: "preset-preview", label: "Preset comparison" },
    { id: "font-loading", label: "Font loading" },
    { id: "type-scale", label: "Type scale" },
    { id: "semantic-roles", label: "Semantic roles" },
    { id: "customization", label: "Customization" },
  ],
  "/docs/foundations/themes": [
    { id: "runtime-axes", label: "Runtime axes" },
    { id: "preset-themes", label: "Preset themes" },
    { id: "mode-behavior", label: "Mode behavior" },
    { id: "live-theme-behavior", label: "Live behavior" },
    { id: "density", label: "Density" },
    { id: "custom-themes", label: "Custom themes" },
    { id: "do-do-not", label: "Do / do not" },
  ],
  "/docs/foundations/animations": [
    { id: "motion-preview", label: "Preview" },
    { id: "duration-tokens", label: "Duration tokens" },
    { id: "easing-tokens", label: "Easing tokens" },
    { id: "semantic-motion", label: "Semantic motion" },
    { id: "component-utilities", label: "Component utilities" },
    { id: "reduced-motion", label: "Reduced motion" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/radius": [
    { id: "radius-scale", label: "Radius scale" },
    { id: "role-aliases", label: "Role aliases" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/effects": [
    { id: "elevation-scale", label: "Elevation scale" },
    { id: "semantic-effects", label: "Semantic effects" },
    { id: "focus", label: "Focus" },
    { id: "live-surface-preview", label: "Live preview" },
    { id: "component-contracts", label: "Component contracts" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/icons": [
    { id: "icon-adapter-preview", label: "Icon adapter preview" },
    { id: "size-contract", label: "Size contract" },
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
  if (pathname === "/docs/components/badge") return badgeToc;
  if (pathname.startsWith("/docs/components/")) return componentToc;
  if (pathname.startsWith("/docs/blocks/") || pathname.startsWith("/docs/compositions/")) {
    return compositionToc;
  }
  return tocByPath[pathname] ?? [];
}

const searchEntries: DocsCommandEntry[] = [...navGroups, compositionGroup].flatMap((group) =>
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

const foundationGroups = navGroups.slice(0, 2);
const componentGroups = navGroups.slice(2);
const documentationItems: NavItem[] = [
  { href: "/", label: "Overview", icon: BookOpen },
  ...navGroups.flatMap((group) => group.items),
  ...compositionGroup.items,
];

function getSidebarGroups(pathname: string): NavGroup[] {
  if (pathname.startsWith("/docs/blocks") || pathname.startsWith("/docs/compositions")) {
    return [compositionGroup];
  }
  return pathname.startsWith("/docs/components") ? componentGroups : foundationGroups;
}

function getAdjacentDocs(pathname: string) {
  const index = documentationItems.findIndex((item) => item.href === pathname);
  if (index < 0) return { previous: undefined, next: undefined };

  return {
    previous: documentationItems[index - 1],
    next: documentationItems[index + 1],
  };
}

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

function PageActions({ pathname }: { pathname: string }) {
  const [copied, setCopied] = React.useState(false);
  const [actionStatus, setActionStatus] = React.useState("");
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const pageActionsRef = React.useRef<HTMLDivElement | null>(null);
  const copyResetTimer = React.useRef<number | undefined>(undefined);
  const statusResetTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      window.clearTimeout(copyResetTimer.current);
      window.clearTimeout(statusResetTimer.current);
    },
    [],
  );

  React.useEffect(() => {
    if (!actionsOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !pageActionsRef.current?.contains(event.target)) {
        setActionsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActionsOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [actionsOpen]);

  const copyToClipboard = async (value: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setActionStatus(successMessage);
    } catch {
      setActionStatus("Clipboard access is unavailable. Please copy the text manually.");
    }
    window.clearTimeout(statusResetTimer.current);
    statusResetTimer.current = window.setTimeout(() => setActionStatus(""), 2400);
  };

  const copyMarkdown = async () => {
    await copyToClipboard(pageToMarkdown(), "Markdown copied.");
    setCopied(true);
    window.clearTimeout(copyResetTimer.current);
    copyResetTimer.current = window.setTimeout(() => setCopied(false), 1200);
  };

  const viewMarkdown = () => {
    const markdownUrl = `data:text/markdown;charset=utf-8,${encodeURIComponent(pageToMarkdown())}`;
    window.open(markdownUrl, "_blank", "noopener,noreferrer");
    setActionStatus("Opening Markdown view.");
  };

  const copyInstallHint = async (target: "Cursor" | "VS Code") => {
    await copyToClipboard(
      `Install the Nerio MCP server in ${target}: pnpm --filter @nerio/mcp start`,
      `${target} install command copied.`,
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

  const runAction = async (action: () => void | Promise<void>) => {
    await action();
    setActionsOpen(false);
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
  const { previous, next } = getAdjacentDocs(pathname);

  return (
    <div ref={pageActionsRef} className="docs-page-actions" aria-label="Page actions">
      <ButtonGroup aria-label="Documentation actions">
        <Button
          leadingIcon={copied ? Check : Copy}
          size="sm"
          variant="secondary"
          onClick={copyMarkdown}
        >
          {copied ? "Copied" : "Copy Markdown"}
        </Button>
        <Button
          aria-controls="docs-page-actions-menu"
          aria-expanded={actionsOpen}
          aria-label="Open page actions"
          icon={ChevronDown}
          size="sm"
          variant="secondary"
          onClick={() => setActionsOpen((open) => !open)}
        />
      </ButtonGroup>
      <nav aria-label="Page navigation" className="docs-page-actions__navigation">
        {previous ? (
          <Button
            icon={ArrowLeft}
            aria-label={`Previous: ${previous.label}`}
            tooltip={previous.label}
            size="sm"
            variant="secondary"
            nativeButton={false}
            render={<Link href={previous.href} />}
          />
        ) : null}
        {next ? (
          <Button
            icon={ArrowRight}
            aria-label={`Next: ${next.label}`}
            tooltip={next.label}
            size="sm"
            variant="secondary"
            nativeButton={false}
            render={<Link href={next.href} />}
          />
        ) : null}
      </nav>
      {actionsOpen ? (
        <div className="docs-actions-menu" id="docs-page-actions-menu" role="menu">
          <button role="menuitem" type="button" onClick={() => void runAction(viewMarkdown)}>
            {actionItem(FileText, "View as Markdown", "View page as Markdown format")}
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => void runAction(() => copyInstallHint("Cursor"))}
          >
            {actionItem(PackageOpen, "Add to Cursor", "Install MCP Server on Cursor")}
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => void runAction(() => copyInstallHint("VS Code"))}
          >
            {actionItem(Code2, "Add to VS Code", "Install MCP Server on VS Code")}
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => void runAction(() => openAssistant("chatgpt"))}
          >
            {actionItem(Sparkles, "Open in ChatGPT", "Ask questions about this page", true)}
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => void runAction(() => openAssistant("claude"))}
          >
            {actionItem(Circle, "Open in Claude", "Ask questions about this page", true)}
          </button>
        </div>
      ) : null}
      <span className="n-visually-hidden" aria-live="polite">
        {actionStatus}
      </span>
    </div>
  );
}

function DocsPageNavigation({ pathname }: { pathname: string }) {
  const { previous, next } = getAdjacentDocs(pathname);

  if (!previous && !next) return null;

  return (
    <nav className="docs-page-navigation" aria-label="Documentation pagination">
      {previous ? (
        <Link className="docs-page-navigation__previous" href={previous.href}>
          <span>Previous</span>
          <strong>{previous.label}</strong>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className="docs-page-navigation__next" href={next.href}>
          <span>Next</span>
          <strong>{next.label}</strong>
        </Link>
      ) : null}
    </nav>
  );
}

export function DocsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isHomePage = pathname === "/";
  const isTemplatesPage = pathname === "/templates";
  const fallbackToc = getDefaultToc(pathname);
  const [theme, setThemeValue] = React.useState("purple");
  const [mode, setModeValue] = React.useState<ColorMode>("system");
  const [systemMode, setSystemMode] = React.useState<Exclude<ColorMode, "system">>("light");
  const [toc, setToc] = React.useState<TocItem[]>(fallbackToc);
  const [activeTocId, setActiveTocId] = React.useState("");
  const [feedback, setFeedback] = React.useState<FeedbackValue | null>(null);

  React.useEffect(() => {
    setFeedback(null);
  }, [pathname]);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
  }, [theme, mode]);

  React.useEffect(() => {
    const storedMode = window.localStorage.getItem(modeStorageKey);
    if (storedMode === "light" || storedMode === "dark") setModeValue(storedMode);
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemMode = () => setSystemMode(mediaQuery.matches ? "dark" : "light");

    updateSystemMode();
    mediaQuery.addEventListener("change", updateSystemMode);
    return () => mediaQuery.removeEventListener("change", updateSystemMode);
  }, []);

  React.useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".docs-main h2, .docs-main h3, .docs-main h4"),
    );
    const usedIds = new Set<string>();
    const nextToc = headings.map((heading) => {
      const label = heading.textContent?.trim() ?? "";
      const baseId = heading.id || slugify(label);
      let id = baseId;
      let duplicateIndex = 2;

      while (usedIds.has(id)) {
        id = `${baseId}-${duplicateIndex}`;
        duplicateIndex += 1;
      }

      usedIds.add(id);
      heading.id = id;

      return {
        id,
        label,
        level:
          heading.tagName === "H4"
            ? (4 as const)
            : heading.tagName === "H3"
              ? (3 as const)
              : (2 as const),
      };
    });
    const filteredToc = nextToc.filter((item) => item.label.length > 0);
    const nextTocItems = filteredToc.length > 0 ? filteredToc : getDefaultToc(pathname);
    setToc(nextTocItems);
    setActiveTocId(nextTocItems[0]?.id ?? "");
  }, [pathname, children]);

  React.useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".docs-main h2[id], .docs-main h3[id], .docs-main h4[id]",
      ),
    );
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]?.target instanceof HTMLElement) setActiveTocId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65%" },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [pathname, toc]);

  const setTheme = (value: string) => {
    setThemeValue(value);
    document.documentElement.setAttribute("data-theme", value);
  };

  const setMode = (value: ColorMode) => {
    setModeValue(value);
    document.documentElement.setAttribute("data-mode", value);
    window.localStorage.setItem(modeStorageKey, value);
  };

  const toggleMode = () => {
    setMode((mode === "system" ? systemMode : mode) === "light" ? "dark" : "light");
  };

  const activeColorMode = mode === "system" ? systemMode : mode;
  const modeIcon = activeColorMode === "light" ? Moon : Sun;
  const modeLabel = activeColorMode === "light" ? "Use dark color mode" : "Use light color mode";

  const scrollToTocItem = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    const heading = document.getElementById(id);
    if (!heading) return;

    const headerHeight =
      document.querySelector(".docs-header")?.getBoundingClientRect().height ?? 0;
    const top = window.scrollY + heading.getBoundingClientRect().top - headerHeight - 16;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.history.pushState(null, "", `#${id}`);
    window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? "auto" : "smooth" });
  };

  const sidebarGroups = getSidebarGroups(pathname);

  const visibleToc = toc.length > 0 ? toc : fallbackToc;

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <div className="docs-header-top">
          <div className="docs-brand-lockup">
            <Link href="/" className="brand">
              Nerio
            </Link>
            <Badge tone="primary-soft">Core</Badge>
          </div>

          <nav className="docs-primary-nav" aria-label="Primary navigation">
            <Link
              href="/docs"
              className={
                pathname === "/docs" || pathname === "/docs/getting-started"
                  ? "is-active"
                  : undefined
              }
            >
              Docs
            </Link>
            <Link
              href="/docs/components/button"
              className={pathname.startsWith("/docs/components") ? "is-active" : undefined}
            >
              Components
            </Link>
            <Link
              href="/docs/blocks/login"
              className={pathname.startsWith("/docs/blocks") ? "is-active" : undefined}
            >
              Blocks
            </Link>
            <Link href="/templates" className={pathname === "/templates" ? "is-active" : undefined}>
              Templates
            </Link>
          </nav>

          <div className="docs-controls">
            <DocsCommandPalette entries={searchEntries} />
            <span className="docs-controls-divider" aria-hidden />
            <DropdownMenu
              className="docs-theme-menu"
              trigger={
                <Button className="docs-theme-trigger" trailingIcon={ChevronDown} variant="ghost">
                  <span
                    className="theme-option-dot"
                    style={{ backgroundColor: getThemeDotColor(theme) }}
                    aria-hidden
                  />
                  {themeOptions.find((option) => option.value === theme)?.label}
                </Button>
              }
              items={themeOptions.map((option) => ({
                label: (
                  <span className="theme-menu-item">
                    <span
                      className="theme-option-dot"
                      style={{ backgroundColor: getThemeDotColor(option.value) }}
                      aria-hidden
                    />
                    <span>{option.label}</span>
                    {theme === option.value ? <Icon icon={Check} /> : null}
                  </span>
                ),
                onSelect: () => setTheme(option.value),
              }))}
            />
            <span className="docs-controls-divider" aria-hidden />
            <Button
              onClick={toggleMode}
              aria-label={modeLabel}
              className="docs-mode-toggle"
              icon={modeIcon}
              tooltip={modeLabel}
              variant="ghost"
            />
            <span className="docs-controls-divider" aria-hidden />
            <Button
              leadingIcon={Github}
              nativeButton={false}
              render={<a href={repoUrl} target="_blank" rel="noreferrer" />}
              variant="secondary"
            >
              GitHub
            </Button>
          </div>
        </div>
      </header>

      <div
        className={
          isHomePage
            ? "docs-layout docs-layout--landing"
            : isTemplatesPage
              ? "docs-layout docs-layout--template"
              : "docs-layout"
        }
      >
        {isHomePage || isTemplatesPage ? null : (
          <aside className="docs-sidebar">
            <nav aria-label="Documentation">
              {sidebarGroups.map((group) => (
                <div className="nav-group" key={group.title}>
                  <h2>{group.title}</h2>
                  {group.items.map(({ href, label, icon }) => {
                    const hasIcon = group.title === "Overview" || group.title === "Foundations";

                    return (
                      <Link
                        key={href}
                        href={href}
                        data-has-icon={hasIcon || undefined}
                        className={pathname === href ? "is-active" : undefined}
                        aria-current={pathname === href ? "page" : undefined}
                      >
                        {hasIcon ? <Icon icon={icon} /> : null}
                        {label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </aside>
        )}

        <main
          className={
            isHomePage
              ? "docs-main docs-main--landing"
              : isTemplatesPage
                ? "docs-main docs-main--template"
                : "docs-main"
          }
        >
          {isHomePage || isTemplatesPage ? null : <PageActions pathname={pathname} />}
          {children}
          {isHomePage || isTemplatesPage ? null : <DocsPageNavigation pathname={pathname} />}
        </main>

        {isHomePage || isTemplatesPage ? null : (
          <aside className="docs-toc" aria-label="On this page">
            <div className="docs-toc-card">
              <div className="docs-toc-title">On this page</div>
              {visibleToc.length > 0 ? (
                <nav>
                  {visibleToc.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      data-level={item.level ?? 2}
                      className={activeTocId === item.id ? "is-active" : undefined}
                      aria-current={activeTocId === item.id ? "location" : undefined}
                      onClick={(event) => scrollToTocItem(event, item.id)}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              ) : (
                <p>No sections yet.</p>
              )}
            </div>
            <section className="docs-toc-feedback" aria-labelledby="docs-feedback-title">
              <h2 id="docs-feedback-title">Was this helpful?</h2>
              {feedback ? (
                <p className="docs-toc-feedback__thanks" role="status">
                  Thanks for your feedback.
                </p>
              ) : (
                <div className="docs-toc-feedback__choices" role="group" aria-label="Page feedback">
                  <button
                    type="button"
                    aria-label="Helpful"
                    data-feedback-value="helpful"
                    data-metrika-goal="docs-feedback-helpful"
                    onClick={() => setFeedback("helpful")}
                  >
                    <span aria-hidden="true">🙂</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Neither helpful nor unhelpful"
                    data-feedback-value="neutral"
                    data-metrika-goal="docs-feedback-neutral"
                    onClick={() => setFeedback("neutral")}
                  >
                    <span aria-hidden="true">😐</span>
                  </button>
                  <button
                    type="button"
                    aria-label="Not helpful"
                    data-feedback-value="not-helpful"
                    data-metrika-goal="docs-feedback-not-helpful"
                    onClick={() => setFeedback("not-helpful")}
                  >
                    <span aria-hidden="true">☹️</span>
                  </button>
                </div>
              )}
            </section>
          </aside>
        )}
      </div>

      <footer className="docs-footer">
        <p>
          © <span suppressHydrationWarning>{currentYear}</span> Nerio Core · {version}. Built with
          love by{" "}
          <a
            href="https://vpavlov.com?utm_source=nerio&utm_medium=referral&utm_campaign=docs_footer"
            target="_blank"
            rel="noreferrer"
          >
            Vladimir Pavlov
          </a>
          . The source code is available on{" "}
          <a href={repoUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
