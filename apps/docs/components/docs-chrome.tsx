"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiOpenaiFill } from "react-icons/ri";
import { SiClaude, SiCursor } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import {
  ArrowLeft,
  ArrowLeftRight,
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
  Eye,
  FileText,
  Layers,
  ListTree,
  MessageCircle,
  Moon,
  Monitor,
  Palette,
  PanelLeft,
  Search,
  Sparkles,
  Sun,
  Type,
  Wrench,
} from "@nerio-ui/adapters/icons";
import {
  Badge,
  Button,
  ButtonGroup,
  DropdownMenu,
  Icon,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Tooltip,
  TooltipProvider,
} from "@nerio-ui/ui/client";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { modes } from "@nerio-ui/tokens";
import { DocsCommandPalette, type DocsCommandEntry } from "./docs-command-palette";
import { blockCatalog } from "../features/blocks/catalog";
import { templateCatalog } from "../features/templates/catalog";
import {
  defaultAppearance,
  persistAppearanceAxis,
  readAppearanceFromRoot,
  type Appearance,
} from "../lib/appearance";
import { siteConfig } from "../lib/site-config";
import { mcpInstall, mcpLocalConfiguration } from "../lib/public-commands";
import { foundationPages } from "../lib/generated/foundation-pages";

const { version, repositoryUrl: repoUrl } = siteConfig;
type ColorMode = (typeof modes)[number];
type FeedbackValue = "helpful" | "neutral" | "not-helpful";

const foundationIcons: Record<(typeof foundationPages)[number]["path"], IconComponent> = {
  "/docs/foundations/tokens": Layers,
  "/docs/foundations/typography": Type,
  "/docs/foundations/themes": Palette,
  "/docs/foundations/color": Palette,
  "/docs/foundations/localization": ArrowLeftRight,
  "/docs/foundations/accessibility": Eye,
  "/docs/foundations/spacing-layout": PanelLeft,
  "/docs/foundations/motion": Sparkles,
  "/docs/foundations/radius": Circle,
  "/docs/foundations/effects": Wrench,
  "/docs/foundations/icons": Box,
};

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
      { href: "/docs/migration", label: "Migration", icon: ArrowRight },
      { href: "/docs/registry", label: "Registry and CLI", icon: Boxes },
      { href: "/docs/ai", label: "AI tooling", icon: Sparkles },
      { href: "/docs/feedback", label: "Community feedback", icon: MessageCircle },
      { href: "/docs/changelog", label: "Changelog", icon: FileText },
    ],
  },
  {
    title: "Foundations",
    items: foundationPages.map(({ path, label }) => ({
      href: path,
      label,
      icon: foundationIcons[path],
    })),
  },
  {
    title: "Actions",
    items: [
      { href: "/docs/components/kbd", label: "Kbd", icon: Code2 },
      { href: "/docs/components/button", label: "Button", icon: Circle },
      { href: "/docs/components/toggle", label: "Toggle", icon: Circle },
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
      { href: "/docs/components/file-input", label: "FileInput", icon: FileText },
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
      { href: "/docs/components/combobox", label: "Combobox", icon: Search },
      { href: "/docs/components/search-field", label: "SearchField", icon: Search },
      { href: "/docs/components/slider", label: "Slider", icon: Circle },
      { href: "/docs/components/calendar", label: "Calendar", icon: Circle },
      { href: "/docs/components/date-picker", label: "DatePicker", icon: Circle },
    ],
  },
  {
    title: "Layout",
    items: [
      { href: "/docs/components/typography", label: "Typography", icon: Type },
      { href: "/docs/components/card", label: "Card", icon: PanelLeft },
      { href: "/docs/components/separator", label: "Separator", icon: Circle },
      { href: "/docs/components/collapsible", label: "Collapsible", icon: ChevronDown },
      { href: "/docs/components/accordion", label: "Accordion", icon: ListTree },
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
      { href: "/docs/components/sidebar-primitive", label: "Sidebar", icon: PanelLeft },
      { href: "/docs/components/command-primitive", label: "Command", icon: Search },
    ],
  },
  {
    title: "Overlays",
    items: [
      { href: "/docs/components/dialog", label: "Dialog", icon: PanelLeft },
      { href: "/docs/components/alert-dialog", label: "AlertDialog", icon: PanelLeft },
      { href: "/docs/components/sheet", label: "Sheet", icon: PanelLeft },
      { href: "/docs/components/popover", label: "Popover", icon: PanelLeft },
      { href: "/docs/components/tooltip", label: "Tooltip", icon: Circle },
      { href: "/docs/components/dropdown-menu", label: "DropdownMenu", icon: Wrench },
    ],
  },
];

const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;
const modeIcons: Record<ColorMode, IconComponent> = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};
const modeOptions = modes.map((value) => ({
  icon: modeIcons[value],
  label: runtimeLabel(value),
  value,
}));
function isColorMode(value: string): value is ColorMode {
  return modes.some((mode) => mode === value);
}

type TocItem = {
  id: string;
  label: string;
  level?: 2 | 3 | 4;
};

const componentToc: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion" },
  { id: "accessibility", label: "Accessibility" },
  { id: "api", label: "API" },
  { id: "implementation-contract", label: "Implementation contract" },
  { id: "styling-contract", label: "Styling contract" },
  { id: "design-notes", label: "Design notes" },
  { id: "do-do-not", label: "Do / do not" },
  { id: "related-components", label: "Related components" },
  { id: "tokens", label: "Tokens" },
];

const buttonToc: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion" },
  { id: "accessibility", label: "Accessibility" },
  { id: "api", label: "API" },
  { id: "implementation-contract", label: "Implementation contract" },
  { id: "styling-contract", label: "Styling contract" },
  { id: "design-notes", label: "Design notes" },
  { id: "do-do-not", label: "Do / do not" },
  { id: "related-components", label: "Related components" },
  { id: "tokens", label: "Tokens" },
];

const badgeToc: TocItem[] = [
  { id: "overview", label: "Overview" },
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "variants", label: "Variants" },
  { id: "anatomy", label: "Anatomy" },
  { id: "states", label: "States" },
  { id: "motion", label: "Motion" },
  { id: "accessibility", label: "Accessibility" },
  { id: "api", label: "API" },
  { id: "implementation-contract", label: "Implementation contract" },
  { id: "styling-contract", label: "Styling contract" },
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
  "/docs/changelog": [
    { id: "x-launch", label: "Nerio is now on X" },
    { id: "beta-1", label: "Core 1.0 beta.1" },
    { id: "beta-0", label: "Core 1.0 beta.0" },
    { id: "alpha-2", label: "Core 0.1 alpha.2" },
    { id: "alpha-1", label: "Core 0.1 alpha.1" },
    { id: "alpha-0", label: "Core 0.1 alpha.0" },
    { id: "technical-changelog", label: "Technical changelog" },
  ],
  "/docs/foundations/tokens": [
    { id: "token-architecture", label: "Token architecture" },
    { id: "primitive-tokens", label: "Primitive tokens" },
    { id: "semantic-tokens", label: "Semantic tokens" },
    { id: "component-tokens", label: "Component tokens" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/typography": [
    { id: "font-contract", label: "Font contract" },
    { id: "presets", label: "Presets" },
    { id: "font-loading", label: "Font loading" },
    { id: "type-scale", label: "Type scale" },
    { id: "semantic-roles", label: "Semantic roles" },
    { id: "customization", label: "Customization" },
  ],
  "/docs/foundations/themes": [
    { id: "runtime-axes", label: "Runtime axes" },
    { id: "preset-themes", label: "Preset themes" },
    { id: "mode-behavior", label: "Mode behavior" },
    { id: "density", label: "Density" },
    { id: "custom-themes", label: "Custom themes" },
    { id: "do-do-not", label: "Do / do not" },
  ],
  "/docs/foundations/color": [
    { id: "color-architecture", label: "Color architecture" },
    { id: "primitive-families", label: "Primitive families" },
    { id: "semantic-roles", label: "Semantic roles" },
    { id: "pairing-and-states", label: "Pairing and states" },
    { id: "applied-example", label: "Applied example" },
    { id: "accessibility", label: "Accessibility" },
    { id: "custom-themes", label: "Custom themes" },
    { id: "do-do-not", label: "Do / do not" },
    { id: "review-checklist", label: "Review checklist" },
  ],
  "/docs/foundations/localization": [
    { id: "direction", label: "Direction" },
    { id: "base-ui-behavior", label: "Base UI behavior" },
    { id: "rtl-fixture", label: "RTL fixture" },
    { id: "locale", label: "Locale-sensitive output" },
    { id: "labels", label: "Labels and copy" },
    { id: "keyboard", label: "Keyboard direction" },
    { id: "consumer-boundary", label: "Consumer boundary" },
  ],
  "/docs/foundations/accessibility": [
    { id: "responsibility-model", label: "Responsibility model" },
    { id: "applied-example", label: "Applied example" },
    { id: "system-invariants", label: "System invariants" },
    { id: "resilient-content", label: "Resilient content" },
    { id: "platform-preferences", label: "Platform preferences" },
    { id: "evidence-model", label: "Evidence model" },
    { id: "review-checklist", label: "Review checklist" },
    { id: "known-limitations", label: "Known limitations" },
  ],
  "/docs/foundations/spacing-layout": [
    { id: "responsibility-model", label: "Responsibility model" },
    { id: "spacing-architecture", label: "Spacing architecture" },
    { id: "primitive-scale", label: "Primitive scale" },
    { id: "density", label: "Density" },
    { id: "applied-examples", label: "Applied examples" },
    { id: "rhythm-and-hierarchy", label: "Rhythm and hierarchy" },
    { id: "resilient-layout", label: "Resilient layout" },
    { id: "direction", label: "Direction" },
    { id: "review-checklist", label: "Review checklist" },
  ],
  "/docs/foundations/motion": [
    { id: "duration-tokens", label: "Duration tokens" },
    { id: "easing-tokens", label: "Easing tokens" },
    { id: "semantic-motion", label: "Semantic motion" },
    { id: "tailwind-motion-recipes", label: "Tailwind motion recipes" },
    { id: "optional-motion-adapter", label: "Optional adapter" },
    { id: "motion-examples", label: "Examples" },
    { id: "decision-boundary", label: "Decision boundary" },
    { id: "reduced-motion", label: "Reduced motion" },
    { id: "usage", label: "Usage" },
    { id: "source-install-and-removal", label: "Source install" },
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
    { id: "component-contracts", label: "Component contracts" },
    { id: "usage", label: "Usage" },
  ],
  "/docs/foundations/icons": [
    { id: "icon-adapter-contract", label: "Icon adapter contract" },
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
  return tocByPath[pathname] ?? [];
}

const searchEntries: DocsCommandEntry[] = [
  ...navGroups.flatMap((group) =>
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
  ),
  {
    href: "/blocks",
    title: "Blocks",
    group: "Product compositions",
    description: "Explore bounded, reusable Nerio compositions for one clear product task.",
  },
  {
    href: "/playground",
    title: "Playground",
    group: "Tools",
    description: "Tune visual tokens and inspect every current Core component API.",
  },
  {
    href: "/templates",
    title: "Templates",
    group: "Product scenarios",
    description: "Explore complete app-like Nerio previews rendered inside the docs application.",
  },
  ...blockCatalog.map((block) => ({
    href: block.previewRoute,
    title: block.title,
    group: "Blocks",
    description: `${block.title} documentation and preview.`,
  })),
  ...templateCatalog.map((template) => ({
    href: template.previewRoute,
    title: template.title,
    group: "Templates",
    description: `${template.title} documentation and preview.`,
    newTab: true,
  })),
];

const foundationGroups = navGroups.slice(0, 2);
const componentGroups = navGroups.slice(2);
const documentationItems: NavItem[] = [
  { href: "/", label: "Overview", icon: BookOpen },
  ...navGroups.flatMap((group) => group.items),
];

function getSidebarGroups(pathname: string): NavGroup[] {
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

function MobileDocumentationNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = React.useState(false);
  const navigationGroups = [
    ...navGroups,
    {
      title: "Explore",
      items: [
        { href: "/blocks", label: "Blocks", icon: Boxes },
        { href: "/templates", label: "Templates", icon: ListTree },
        { href: "/playground", label: "Playground", icon: Wrench },
      ],
    },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Tooltip label="Open navigation">
        <SheetTrigger
          render={
            <Button
              aria-label="Open documentation navigation"
              className="docs-mobile-navigation-trigger"
              icon={PanelLeft}
              tooltip={false}
              variant="ghost"
            />
          }
        />
      </Tooltip>
      <SheetContent side="left" size="sm">
        <SheetHeader>
          <SheetTitle>Documentation</SheetTitle>
          <SheetDescription>Foundations, Core components, and delivery workflows.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <nav className="docs-mobile-navigation" aria-label="Mobile documentation">
            {navigationGroups.map((group) => (
              <div className="docs-mobile-navigation__group" key={group.title}>
                <h2>{group.title}</h2>
                {group.items.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={pathname === href ? "is-active" : undefined}
                    aria-current={pathname === href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    <Icon icon={icon} />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </nav>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
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
  article.querySelectorAll("h1, h2, h3, h4, p, li, pre code").forEach((node) => {
    const text = node.textContent?.trim();
    if (!text) return;

    if (node.matches("h1")) lines.push(`# ${text}`);
    else if (node.matches("h2")) lines.push(`## ${text}`);
    else if (node.matches("h3")) lines.push(`### ${text}`);
    else if (node.matches("h4")) lines.push(`#### ${text}`);
    else if (node.matches("li")) lines.push(`- ${text}`);
    else if (node.matches("pre code")) lines.push(`\`\`\`\n${text}\n\`\`\``);
    else lines.push(text);
  });

  return `${lines.join("\n\n")}\n\nSource: ${window.location.href}`;
}

function PageActions({ pathname }: { pathname: string }) {
  const [copied, setCopied] = React.useState(false);
  const [actionStatus, setActionStatus] = React.useState("");
  const copyResetTimer = React.useRef<number | undefined>(undefined);
  const statusResetTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(
    () => () => {
      window.clearTimeout(copyResetTimer.current);
      window.clearTimeout(statusResetTimer.current);
    },
    [],
  );

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
      `Install the Nerio MCP server in ${target}:\n\n${mcpInstall}\n\n${mcpLocalConfiguration}`,
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

  const { previous, next } = getAdjacentDocs(pathname);

  return (
    <div className="docs-page-actions" aria-label="Page actions">
      <ButtonGroup aria-label="Documentation actions">
        <Button
          leadingIcon={copied ? Check : Copy}
          size="sm"
          variant="secondary"
          onClick={copyMarkdown}
        >
          {copied ? "Copied" : "Copy Markdown"}
        </Button>
        <DropdownMenu
          className="docs-page-actions-dropdown"
          trigger={
            <Button
              aria-label="Open page actions"
              icon={ChevronDown}
              size="sm"
              variant="secondary"
            />
          }
          items={[
            {
              label: "View as Markdown",
              description: "View page as Markdown format",
              leadingIcon: FileText,
              onSelect: viewMarkdown,
            },
            {
              label: "Add to Cursor",
              description: "Install MCP Server on Cursor",
              leadingIcon: SiCursor,
              onSelect: () => void copyInstallHint("Cursor"),
            },
            {
              label: "Add to VS Code",
              description: "Install MCP Server on VS Code",
              leadingIcon: VscVscode,
              onSelect: () => void copyInstallHint("VS Code"),
            },
            {
              label: "Open in ChatGPT",
              description: "Ask questions about this page",
              leadingIcon: RiOpenaiFill,
              trailingIcon: ExternalLink,
              onSelect: () => openAssistant("chatgpt"),
            },
            {
              label: "Open in Claude",
              description: "Ask questions about this page",
              leadingIcon: SiClaude,
              trailingIcon: ExternalLink,
              onSelect: () => openAssistant("claude"),
            },
          ]}
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
        <Button
          className="docs-page-navigation__previous"
          leadingIcon={ArrowLeft}
          nativeButton={false}
          render={<Link href={previous.href} />}
          size="sm"
          variant="secondary"
        >
          {previous.label}
        </Button>
      ) : null}
      {next ? (
        <Button
          className="docs-page-navigation__next"
          nativeButton={false}
          render={<Link href={next.href} />}
          size="sm"
          trailingIcon={ArrowRight}
          variant="secondary"
        >
          {next.label}
        </Button>
      ) : null}
    </nav>
  );
}

export function DocsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isHomePage = pathname === "/";
  const isBlocksPage = pathname === "/blocks";
  const isTemplatesPage = pathname.startsWith("/templates");
  const isTemplateView = pathname.startsWith("/views/");
  const isPlaygroundPage = pathname === "/playground";
  const fallbackToc = getDefaultToc(pathname);
  const [mode, setModeValue] = React.useState<Appearance["mode"]>(defaultAppearance.mode);
  const [toc, setToc] = React.useState<TocItem[]>(fallbackToc);
  const [activeTocId, setActiveTocId] = React.useState("");
  const [feedback, setFeedback] = React.useState<FeedbackValue | null>(null);
  React.useEffect(() => {
    setFeedback(null);
  }, [pathname]);

  React.useLayoutEffect(() => {
    const restored = readAppearanceFromRoot(document.documentElement);
    setModeValue(restored.mode);
  }, []);

  React.useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>(".docs-main h2, .docs-main h3, .docs-main h4"),
    ).filter((heading) => !heading.closest(".component-example, [data-toc-exclude]"));
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
    ).filter((heading) => !heading.closest(".component-example, [data-toc-exclude]"));
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

  const setMode = (value: Appearance["mode"]) => {
    setModeValue(value);
    persistAppearanceAxis(document.documentElement, "mode", value);
  };

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

  if (pathname.startsWith("/visual-test") || isTemplateView) {
    return <>{children}</>;
  }

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <div className="docs-header-top">
          <div className="docs-brand-lockup">
            <Link href="/" className="brand" aria-label="Nerio home">
              <img
                src={mode === "system" ? "/brand/logo.svg" : `/brand/logo.svg#${mode}`}
                alt=""
                width={68}
                height={20}
              />
            </Link>
            <Badge tone="neutral">{version}</Badge>
          </div>

          <MobileDocumentationNavigation pathname={pathname} />

          <nav className="docs-primary-nav" aria-label="Primary navigation">
            <Link
              href="/playground"
              className={isPlaygroundPage ? "is-active" : undefined}
              aria-current={isPlaygroundPage ? "page" : undefined}
            >
              Playground
            </Link>
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
              href="/blocks"
              className={pathname.startsWith("/blocks") ? "is-active" : undefined}
            >
              Blocks
            </Link>
            <Link href="/templates" className={isTemplatesPage ? "is-active" : undefined}>
              Templates
            </Link>
          </nav>

          <TooltipProvider closeDelay={0} delay={600}>
            <div className="docs-controls">
              <DocsCommandPalette entries={searchEntries} />
              <span className="docs-controls-divider" aria-hidden />
              <DropdownMenu
                className="docs-mode-menu"
                trigger={
                  <Button
                    aria-label={`Color mode: ${runtimeLabel(mode)}`}
                    icon={modeIcons[mode]}
                    tooltip={`Color mode: ${runtimeLabel(mode)}`}
                    variant="ghost"
                  />
                }
                items={modeOptions.map((option) => ({
                  label: (
                    <span className="runtime-menu-item">
                      <Icon icon={option.icon} />
                      <span>{option.label}</span>
                      {mode === option.value ? <Icon icon={Check} /> : null}
                    </span>
                  ),
                  onSelect: () => {
                    if (isColorMode(option.value)) setMode(option.value);
                  },
                }))}
              />
              <span className="docs-controls-divider" aria-hidden />
              <Button
                className="docs-github-link"
                nativeButton={false}
                render={
                  <a
                    href={repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Nerio on GitHub"
                  />
                }
                variant="secondary"
              >
                <span className="docs-github-mark" aria-hidden>
                  {mode === "system" ? (
                    <picture>
                      <source
                        media="(prefers-color-scheme: dark)"
                        srcSet="/brand/github-invertocat-white.svg"
                      />
                      <img src="/brand/github-invertocat-black.svg" alt="" width={14} />
                    </picture>
                  ) : (
                    <img
                      src={`/brand/github-invertocat-${mode === "dark" ? "white" : "black"}.svg`}
                      alt=""
                      width={14}
                    />
                  )}
                </span>
                GitHub
              </Button>
            </div>
          </TooltipProvider>
        </div>
      </header>

      <div
        className={
          isHomePage
            ? "docs-layout docs-layout--landing"
            : isBlocksPage || isTemplatesPage || isPlaygroundPage
              ? "docs-layout docs-layout--template"
              : "docs-layout"
        }
      >
        {isHomePage || isBlocksPage || isTemplatesPage || isPlaygroundPage ? null : (
          <aside className="docs-sidebar">
            <nav aria-label="Documentation">
              {sidebarGroups.map((group) => (
                <div className="nav-group" key={group.title}>
                  <h2>{group.title}</h2>
                  {group.items.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={pathname === href ? "is-active" : undefined}
                      aria-current={pathname === href ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        )}

        <main
          className={
            isHomePage
              ? "docs-main docs-main--landing"
              : isPlaygroundPage
                ? "docs-main docs-main--template docs-main--playground"
                : isBlocksPage || isTemplatesPage
                  ? "docs-main docs-main--template"
                  : "docs-main"
          }
        >
          {isHomePage || isBlocksPage || isTemplatesPage || isPlaygroundPage ? null : (
            <PageActions pathname={pathname} />
          )}
          {children}
          {isHomePage || isBlocksPage || isTemplatesPage || isPlaygroundPage ? null : (
            <DocsPageNavigation pathname={pathname} />
          )}
        </main>

        {isHomePage || isBlocksPage || isTemplatesPage || isPlaygroundPage ? null : (
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
                <div className="docs-toc-feedback__thanks">
                  <p role="status">Thanks for your feedback.</p>
                  <Button
                    nativeButton={false}
                    render={<a href={repoUrl} rel="noreferrer" target="_blank" />}
                    variant="link"
                  >
                    Star Nerio on GitHub
                  </Button>
                </div>
              ) : (
                <ButtonGroup className="docs-toc-feedback__choices" aria-label="Page feedback">
                  <Button
                    aria-label="Not helpful"
                    data-feedback-value="not-helpful"
                    data-metrika-goal="docs-feedback-not-helpful"
                    size="sm"
                    variant="secondary"
                    onClick={() => setFeedback("not-helpful")}
                  >
                    <span aria-hidden="true">☹️</span>
                  </Button>
                  <Button
                    aria-label="Neither helpful nor unhelpful"
                    data-feedback-value="neutral"
                    data-metrika-goal="docs-feedback-neutral"
                    size="sm"
                    variant="secondary"
                    onClick={() => setFeedback("neutral")}
                  >
                    <span aria-hidden="true">😐</span>
                  </Button>
                  <Button
                    aria-label="Helpful"
                    data-feedback-value="helpful"
                    data-metrika-goal="docs-feedback-helpful"
                    size="sm"
                    variant="secondary"
                    onClick={() => setFeedback("helpful")}
                  >
                    <span aria-hidden="true">🙂</span>
                  </Button>
                </ButtonGroup>
              )}
            </section>
          </aside>
        )}
      </div>

      <footer className="docs-footer">
        <p>
          © <span suppressHydrationWarning>{currentYear}</span> Nerio. Built with love by{" "}
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
