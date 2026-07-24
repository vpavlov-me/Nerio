"use client";

import * as React from "react";
import { densities, modes } from "@nerio-ui/tokens";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  ExternalLink,
  FileText,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
  Wrench,
} from "@nerio-ui/adapters/icons";
import {
  Breadcrumbs,
  Card,
  Icon,
  Kbd,
  Separator,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
} from "@nerio-ui/ui";
import {
  Alert,
  Badge,
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  Select,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsPanels,
  TabsTrigger,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import {
  defaultAppearance,
  persistAppearanceAxis,
  readAppearanceFromRoot,
  type Appearance,
} from "../../../lib/appearance";
import styles from "./view.module.css";

type Page = "overview" | "api" | "changelog" | "settings";
type ApiState = "ready" | "loading" | "error";
type NavigationItem = {
  page: Page;
  label: string;
  icon: typeof BookOpen;
  anchor?: string;
};

const navigation = [
  {
    label: "Start here",
    items: [
      { page: "overview", label: "Overview", icon: BookOpen },
      { page: "overview", label: "Quickstart", icon: ArrowRight, anchor: "quickstart" },
      { page: "overview", label: "Authentication", icon: Check, anchor: "authentication" },
    ],
  },
  {
    label: "Build",
    items: [
      { page: "api", label: "API reference", icon: Code2 },
      { page: "api", label: "Projects", icon: FileText, anchor: "projects" },
      { page: "api", label: "Events", icon: Sparkles, anchor: "events" },
      { page: "api", label: "Errors", icon: Wrench, anchor: "errors" },
    ],
  },
  {
    label: "Resources",
    items: [
      { page: "changelog", label: "Changelog", icon: FileText },
      { page: "settings", label: "Portal settings", icon: Settings },
    ],
  },
] as const satisfies readonly { label: string; items: readonly NavigationItem[] }[];

const searchGroups = [
  {
    value: "guides",
    label: "Guides",
    items: [
      { value: "overview", label: "Platform overview", keywords: ["start", "home"] },
      { value: "quickstart", label: "Quickstart", keywords: ["install", "sdk"] },
      { value: "authentication", label: "Authentication", keywords: ["api", "key"] },
    ],
  },
  {
    value: "reference",
    label: "Reference",
    items: [
      { value: "api", label: "API reference", keywords: ["endpoint", "request"] },
      { value: "events", label: "Events", keywords: ["webhook"] },
      { value: "changelog", label: "Changelog", keywords: ["version", "release"] },
    ],
  },
] as const;

const codeExamples = {
  curl: `curl https://api.northstar.dev/v1/projects \\
  -H "Authorization: Bearer $NORTHSTAR_API_KEY"`,
  typescript: `import { Northstar } from "@northstar/sdk";

const client = new Northstar({
  apiKey: process.env.NORTHSTAR_API_KEY,
});

const project = await client.projects.create({
  name: "Launch workspace",
});`,
} as const;

function subscribeToMobileViewport(callback: () => void) {
  const media = window.matchMedia("(max-width: 980px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobileViewport() {
  return React.useSyncExternalStore(
    subscribeToMobileViewport,
    () => window.matchMedia("(max-width: 980px)").matches,
    () => false,
  );
}

function DeveloperNavigation({
  activePage,
  onSelect,
}: {
  activePage: Page;
  onSelect: (page: Page, anchor?: string) => void;
}) {
  return (
    <nav className={styles.navigation} aria-label="Developer documentation">
      {navigation.map((group) => (
        <div key={group.label} className={styles["navigation-group"]}>
          <span>{group.label}</span>
          {group.items.map((item) => {
            const anchor = "anchor" in item ? item.anchor : undefined;
            return (
              <Button
                key={`${item.page}-${item.label}`}
                className={styles["navigation-item"]}
                variant="ghost"
                leadingIcon={item.icon}
                data-state={activePage === item.page && !anchor ? "active" : undefined}
                aria-current={activePage === item.page && !anchor ? "page" : undefined}
                onClick={() => onSelect(item.page, anchor)}
              >
                {item.label}
              </Button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function DeveloperPortalApp() {
  const isMobile = useMobileViewport();
  const toasts = useToastManager();
  const [activePage, setActivePage] = React.useState<Page>("overview");
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [appearance, setAppearance] = React.useState<Appearance>(defaultAppearance);
  const [direction, setDirection] = React.useState("ltr");

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const initialDirection = root.getAttribute("dir");
    setAppearance(readAppearanceFromRoot(root));
    return () => {
      if (initialDirection) root.setAttribute("dir", initialDirection);
      else root.removeAttribute("dir");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.getAttribute("contenteditable") === "true";
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function updateAppearance<K extends keyof Appearance>(axis: K, value: Appearance[K]) {
    setAppearance((current) => ({ ...current, [axis]: value }));
    persistAppearanceAxis(document.documentElement, axis, value);
  }

  function selectPage(page: Page, anchor?: string) {
    setActivePage(page);
    setMobileNavOpen(false);
    window.requestAnimationFrame(() => {
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0 });
    });
  }

  function selectSearchResult(value: string) {
    if (value === "quickstart" || value === "authentication") {
      selectPage("overview", value);
    } else if (value === "api" || value === "events") {
      selectPage("api", value === "events" ? "events" : undefined);
    } else if (value === "changelog") {
      selectPage("changelog");
    } else {
      selectPage("overview");
    }
    setSearchOpen(false);
  }

  async function copyCode(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toasts.add({
        title: "Code copied",
        description: "The example is ready to paste into your project.",
        data: { tone: "success" },
      });
    } catch {
      toasts.add({
        title: "Copy unavailable",
        description: "Select the code and copy it manually.",
        data: { tone: "danger" },
      });
    }
  }

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span>
            <Code2 aria-hidden />
          </span>
          <div>
            <strong>Northstar Developers</strong>
            <small>Build connected workspaces</small>
          </div>
        </div>
        <div className={styles["header-actions"]}>
          <Select
            label={<span className={styles["sr-only"]}>Documentation version</span>}
            defaultValue="v1"
            options={[
              { label: "v1.8", value: "v1" },
              { label: "v1.7", value: "v17" },
              { label: "v2 beta", value: "v2" },
            ]}
          />
          <Popover
            open={searchOpen}
            onOpenChange={setSearchOpen}
            trigger={
              <Button variant="secondary" leadingIcon={Search}>
                Search docs
                <Kbd aria-hidden>/</Kbd>
              </Button>
            }
            title="Search documentation"
            description="Find guides, endpoints, and release notes."
          >
            <Command items={searchGroups}>
              <CommandInput
                autoFocus
                aria-label="Search documentation"
                placeholder="Search docs…"
              />
              <CommandEmpty>No documentation found.</CommandEmpty>
              <CommandList renderGroupLabel={(group) => group.label}>
                {(item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    leading={<Icon icon={item.value === "api" ? Code2 : FileText} />}
                    metadata={item.value === "api" ? "Reference" : undefined}
                    onSelect={selectSearchResult}
                  >
                    {item.label}
                  </CommandItem>
                )}
              </CommandList>
            </Command>
          </Popover>
          <Button
            variant="ghost"
            leadingIcon={ExternalLink}
            onClick={() =>
              toasts.add({
                title: "Status is operational",
                description: "All local API fixtures are responding normally.",
                data: { tone: "success" },
              })
            }
          >
            API status
          </Button>
        </div>
      </header>

      <SidebarProvider sidebarId="developer-portal-sidebar">
        {!isMobile ? (
          <Sidebar className={styles.sidebar} aria-label="Developer portal sidebar">
            <SidebarHeader>
              <div className={styles["sidebar-context"]}>
                <Badge variant="success">Stable</Badge>
                <span>API version 2026-07</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <DeveloperNavigation activePage={activePage} onSelect={selectPage} />
            </SidebarContent>
            <SidebarFooter>
              <div className={styles["help-card"]}>
                <Sparkles aria-hidden />
                <div>
                  <strong>Need a hand?</strong>
                  <span>Open a local support example.</span>
                </div>
              </div>
            </SidebarFooter>
            <SidebarRail label="Toggle developer sidebar" />
          </Sidebar>
        ) : null}

        <SidebarInset className={styles.main}>
          {isMobile ? (
            <div className={styles["mobile-toolbar"]}>
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <Tooltip label="Open developer navigation">
                  <SheetTrigger
                    render={
                      <Button
                        icon={PanelLeft}
                        aria-label="Open developer navigation"
                        tooltip={false}
                        variant="secondary"
                      />
                    }
                  />
                </Tooltip>
                <SheetContent side="left" size="sm">
                  <SheetHeader>
                    <SheetTitle>Developer navigation</SheetTitle>
                    <SheetDescription>
                      Browse guides, API reference, and resources.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <DeveloperNavigation activePage={activePage} onSelect={selectPage} />
                  </SheetBody>
                </SheetContent>
              </Sheet>
              <Button variant="secondary" leadingIcon={Search} onClick={() => setSearchOpen(true)}>
                Search
              </Button>
            </div>
          ) : (
            <div className={styles["desktop-rail-trigger"]}>
              <SidebarTrigger label="Toggle developer sidebar" />
            </div>
          )}

          {activePage === "overview" ? (
            <OverviewPage onCopy={copyCode} onOpenApi={() => selectPage("api")} />
          ) : null}
          {activePage === "api" ? <ApiReferencePage onCopy={copyCode} /> : null}
          {activePage === "changelog" ? <ChangelogPage /> : null}
          {activePage === "settings" ? (
            <SettingsPage
              appearance={appearance}
              direction={direction}
              onChange={updateAppearance}
              onDirectionChange={setDirection}
            />
          ) : null}
        </SidebarInset>
      </SidebarProvider>
      <ToastViewport />
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className={styles["page-intro"]}>
      <Badge>{eyebrow}</Badge>
      <h1>{title}</h1>
      <p>{description}</p>
    </header>
  );
}

function OverviewPage({
  onCopy,
  onOpenApi,
}: {
  onCopy: (value: string) => void;
  onOpenApi: () => void;
}) {
  return (
    <div className={styles["page-grid"]}>
      <main className={styles.content}>
        <Breadcrumbs
          items={[
            { label: "Docs", href: "#docs" },
            { label: "Platform", href: "#platform" },
            { label: "Overview", current: true },
          ]}
        />
        <PageIntro
          eyebrow="Developer platform"
          title="Build a connected workspace in minutes"
          description="Use Northstar APIs to create projects, synchronize events, and bring structured collaboration into your product."
        />

        <section className={styles["hero-actions"]} aria-label="Get started actions">
          <Button
            leadingIcon={ArrowRight}
            onClick={() => document.getElementById("quickstart")?.scrollIntoView()}
          >
            Start building
          </Button>
          <Button variant="secondary" leadingIcon={Code2} onClick={onOpenApi}>
            Explore the API
          </Button>
        </section>

        <section className={styles["value-grid"]} aria-label="Platform capabilities">
          <Card>
            <BookOpen aria-hidden />
            <strong>Clear integration path</strong>
            <p>Move from an API key to a first project with one stable request model.</p>
          </Card>
          <Card>
            <Sparkles aria-hidden />
            <strong>Event-first workflows</strong>
            <p>Subscribe to lifecycle events without coupling your product to the portal.</p>
          </Card>
          <Card>
            <Wrench aria-hidden />
            <strong>Predictable errors</strong>
            <p>Every failure includes a typed code, request ID, and recovery guidance.</p>
          </Card>
        </section>

        <Separator />

        <section id="quickstart" className={styles.section}>
          <div className={styles["section-heading"]}>
            <div>
              <span>01</span>
              <h2>Make your first request</h2>
            </div>
            <Badge variant="success">About 3 minutes</Badge>
          </div>
          <p>
            Create a server-side API key, install the SDK, and keep the credential outside your
            client bundle.
          </p>
          <CodeExample onCopy={onCopy} />
        </section>

        <section id="authentication" className={styles.section}>
          <div className={styles["section-heading"]}>
            <div>
              <span>02</span>
              <h2>Authenticate safely</h2>
            </div>
          </div>
          <Alert tone="warning" title="Keep secret keys on the server">
            Northstar secret keys can create and update projects. Do not expose them in browser
            code, screenshots, or public repositories.
          </Alert>
          <div className={styles["key-example"]}>
            <code>NORTHSTAR_API_KEY=ns_live_••••••••••••4d2f</code>
            <Badge>Server only</Badge>
          </div>
        </section>
      </main>
      <TableOfContents
        items={[
          ["Top", "top"],
          ["Make your first request", "quickstart"],
          ["Authenticate safely", "authentication"],
        ]}
      />
    </div>
  );
}

function CodeExample({ onCopy }: { onCopy: (value: string) => void }) {
  const [language, setLanguage] = React.useState<keyof typeof codeExamples>("curl");
  const code = codeExamples[language];

  return (
    <div className={styles["code-example"]}>
      <Tabs
        value={language}
        onValueChange={(value) => setLanguage(value as keyof typeof codeExamples)}
      >
        <div className={styles["code-toolbar"]}>
          <TabsList aria-label="Code language">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
          </TabsList>
          <Button size="sm" variant="ghost" leadingIcon={FileText} onClick={() => onCopy(code)}>
            Copy
          </Button>
        </div>
        <TabsPanels>
          <TabsContent value="curl">
            <pre>
              <code>{codeExamples.curl}</code>
            </pre>
          </TabsContent>
          <TabsContent value="typescript">
            <pre>
              <code>{codeExamples.typescript}</code>
            </pre>
          </TabsContent>
        </TabsPanels>
      </Tabs>
    </div>
  );
}

function ApiReferencePage({ onCopy }: { onCopy: (value: string) => void }) {
  const [state, setState] = React.useState<ApiState>("ready");

  return (
    <div className={styles["page-grid"]}>
      <main className={styles.content}>
        <Breadcrumbs
          items={[
            { label: "Docs", href: "#docs" },
            { label: "API reference", current: true },
          ]}
        />
        <PageIntro
          eyebrow="REST API"
          title="Projects"
          description="Create, retrieve, and update the collaborative spaces your customers use."
        />

        <div className={styles["endpoint-controls"]}>
          <div className={styles.endpoint}>
            <Badge variant="success">POST</Badge>
            <code>/v1/projects</code>
          </div>
          <div className={styles["state-actions"]}>
            <Button size="sm" variant="secondary" onClick={() => setState("loading")}>
              Simulate loading
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setState("error")}>
              Simulate error
            </Button>
          </div>
        </div>

        {state === "loading" ? (
          <Card className={styles["api-state"]} role="status">
            <Wrench aria-hidden />
            <div>
              <strong>Sending request</strong>
              <span>Validating the local fixture and preparing a response.</span>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setState("ready")}>
              Complete
            </Button>
          </Card>
        ) : null}
        {state === "error" ? (
          <Alert tone="danger" title="Request failed">
            The local fixture returned `invalid_request`. Check the project name and retry.
            <Button size="sm" variant="secondary" onClick={() => setState("ready")}>
              Retry
            </Button>
          </Alert>
        ) : null}

        <section id="projects" className={styles.section}>
          <h2>Request body</h2>
          <div className={styles["parameter-list"]}>
            <Parameter name="name" type="string" required>
              A customer-facing project name between 1 and 120 characters.
            </Parameter>
            <Parameter name="region" type="enum">
              Data residency region. Defaults to the organization setting.
            </Parameter>
            <Parameter name="metadata" type="object">
              Product-owned key-value context for internal reconciliation.
            </Parameter>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Example response</h2>
          <div className={styles["response-example"]}>
            <div>
              <Badge variant="success">201 Created</Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCopy('{"id":"prj_01J4","status":"active"}')}
              >
                Copy response
              </Button>
            </div>
            <pre>
              <code>{`{
  "id": "prj_01J4",
  "name": "Launch workspace",
  "status": "active",
  "created_at": "2026-07-24T08:00:00Z"
}`}</code>
            </pre>
          </div>
        </section>

        <section id="events" className={styles.section}>
          <h2>Related events</h2>
          <Card className={styles["event-row"]}>
            <code>project.created</code>
            <span>Emitted after the project is available to collaborators.</span>
            <Badge>Webhook</Badge>
          </Card>
          <Card className={styles["event-row"]}>
            <code>project.updated</code>
            <span>Emitted when mutable project attributes change.</span>
            <Badge>Webhook</Badge>
          </Card>
        </section>

        <section id="errors" className={styles.section}>
          <h2>Errors</h2>
          <Alert tone="info" title="Every error includes a request ID">
            Include the request ID when contacting support so the integration can be traced without
            sharing credentials.
          </Alert>
        </section>
      </main>
      <TableOfContents
        items={[
          ["Request body", "projects"],
          ["Related events", "events"],
          ["Errors", "errors"],
        ]}
      />
    </div>
  );
}

function Parameter({
  name,
  type,
  required,
  children,
}: {
  name: string;
  type: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.parameter}>
      <div>
        <code>{name}</code>
        <span>{type}</span>
        {required ? <Badge variant="danger">Required</Badge> : <Badge>Optional</Badge>}
      </div>
      <p>{children}</p>
    </div>
  );
}

function ChangelogPage() {
  const [version, setVersion] = React.useState("1.8.0");

  return (
    <main className={styles.content}>
      <Breadcrumbs
        items={[
          { label: "Docs", href: "#docs" },
          { label: "Changelog", current: true },
        ]}
      />
      <div className={styles["changelog-heading"]}>
        <PageIntro
          eyebrow="Release notes"
          title="Changelog"
          description="Track API behavior, SDK improvements, and migration guidance."
        />
        <Select
          label="Version"
          value={version}
          onValueChange={setVersion}
          options={[
            { label: "1.8.0", value: "1.8.0" },
            { label: "1.7.2", value: "1.7.2" },
            { label: "1.7.0", value: "1.7.0" },
          ]}
        />
      </div>
      <div className={styles.timeline}>
        <article>
          <div>
            <Badge variant="success">Current</Badge>
            <time dateTime="2026-07-22">July 22, 2026</time>
          </div>
          <h2>Version {version}</h2>
          <p>
            Project events now include a stable delivery attempt ID, and TypeScript SDK responses
            expose request metadata without additional parsing.
          </p>
          <ul>
            <li>Added `delivery_attempt_id` to webhook envelopes.</li>
            <li>Improved SDK typing for paginated project lists.</li>
            <li>Clarified retry behavior for `429` and `503` responses.</li>
          </ul>
        </article>
        <article>
          <div>
            <Badge>Previous</Badge>
            <time dateTime="2026-06-30">June 30, 2026</time>
          </div>
          <h2>Version 1.7.0</h2>
          <p>Documentation-only release with expanded examples for regional project creation.</p>
        </article>
      </div>
    </main>
  );
}

function SettingsPage({
  appearance,
  direction,
  onChange,
  onDirectionChange,
}: {
  appearance: Appearance;
  direction: string;
  onChange: <K extends keyof Appearance>(axis: K, value: Appearance[K]) => void;
  onDirectionChange: (value: string) => void;
}) {
  const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;

  return (
    <main className={styles.content}>
      <Breadcrumbs
        items={[
          { label: "Docs", href: "#docs" },
          { label: "Portal settings", current: true },
        ]}
      />
      <PageIntro
        eyebrow="Local preferences"
        title="Portal settings"
        description="Inspect the documentation product across supported Nerio runtime axes."
      />
      <Card className={styles["settings-grid"]}>
        <Select
          label="Mode"
          value={appearance.mode}
          onValueChange={(value) => onChange("mode", value as Appearance["mode"])}
          options={modes.map((value) => ({ label: runtimeLabel(value), value }))}
        />
        <Select
          label="Density"
          value={appearance.density}
          onValueChange={(value) => onChange("density", value as Appearance["density"])}
          options={densities.map((value) => ({ label: runtimeLabel(value), value }))}
        />
        <Select
          label="Direction"
          value={direction}
          onValueChange={onDirectionChange}
          options={[
            { label: "Left to right", value: "ltr" },
            { label: "Right to left", value: "rtl" },
          ]}
        />
        <Alert tone="info" title="Local preview only">
          These preferences update the Template root and never contact a documentation backend.
        </Alert>
      </Card>
    </main>
  );
}

function TableOfContents({ items }: { items: readonly (readonly [string, string])[] }) {
  const [feedback, setFeedback] = React.useState("");

  return (
    <aside className={styles.toc} aria-label="On this page">
      <strong>On this page</strong>
      <nav>
        {items.map(([label, anchor]) => (
          <a key={anchor} href={`#${anchor}`}>
            {label}
          </a>
        ))}
      </nav>
      <Separator />
      <div>
        <span>Was this page helpful?</span>
        <div>
          <Button size="sm" variant="ghost" onClick={() => setFeedback("Thanks for the feedback.")}>
            Yes
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setFeedback("The page was marked for review.")}
          >
            Not yet
          </Button>
        </div>
        {feedback ? <span role="status">{feedback}</span> : null}
      </div>
    </aside>
  );
}

export function DeveloperPortalView() {
  return (
    <ToastProvider>
      <DeveloperPortalApp />
    </ToastProvider>
  );
}
