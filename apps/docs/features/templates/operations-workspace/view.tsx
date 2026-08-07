"use client";

import * as React from "react";
import { densities, modes, themes } from "@nerio-ui/tokens";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "@nerio-ui/adapters/charts";
import { Icon, SidebarContent, SidebarHeader, SidebarInset } from "@nerio-ui/ui";
import {
  ArrowRight,
  Bell,
  Check,
  Circle,
  FileText,
  LayoutDashboard,
  ListTree,
  PanelLeft,
  Rows3,
  Search,
  Settings,
  Sparkles,
} from "@nerio-ui/adapters/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogFooter,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Input,
  Progress,
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
  Stat,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsIndicator,
  TabsList,
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
import { avatarPreviewAssets } from "../../../lib/avatar-preview-assets";
import styles from "./view.module.css";

const initiatives = [
  {
    name: "Client portal launch",
    owner: "Mira Chen",
    status: "On track",
    progress: 78,
    updated: "Today",
  },
  {
    name: "Reporting migration",
    owner: "Alex Morgan",
    status: "At risk",
    progress: 52,
    updated: "Tomorrow",
  },
  {
    name: "Mobile onboarding",
    owner: "Sam Taylor",
    status: "In review",
    progress: 34,
    updated: "Aug 14",
  },
  {
    name: "Help center refresh",
    owner: "Jordan Lee",
    status: "Planned",
    progress: 91,
    updated: "Aug 18",
  },
];

const activity = [
  ["Mira confirmed the launch checklist", "Client portal launch", "12 minutes ago"],
  ["Alex flagged a reporting dependency", "Reporting migration", "38 minutes ago"],
  ["Sam requested onboarding review", "Mobile onboarding", "1 hour ago"],
  ["Jordan updated the content plan", "Help center refresh", "Yesterday"],
];

const deliveryTrend = [
  { day: "Mon", completion: 62 },
  { day: "Tue", completion: 68 },
  { day: "Wed", completion: 65 },
  { day: "Thu", completion: 73 },
  { day: "Fri", completion: 77 },
  { day: "Sat", completion: 82 },
  { day: "Sun", completion: 86 },
] as const;

const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;
const themeOptions = themes.map((value) => ({ label: runtimeLabel(value), value }));
const modeOptions = modes.map((value) => ({ label: runtimeLabel(value), value }));
const densityOptions = densities.map((value) => ({ label: runtimeLabel(value), value }));

const workspaceCommands = [
  {
    value: "initiative-filters",
    label: "Initiative filters",
    items: [
      { value: "show-all", label: "Show all initiatives", keywords: ["reset", "filter"] },
      { value: "show-risk", label: "Show initiatives at risk", keywords: ["status", "filter"] },
    ],
  },
  {
    value: "display",
    label: "Display",
    items: [
      { value: "compact", label: "Use compact density", keywords: ["display", "density"] },
      { value: "admin", label: "Open admin tools", disabled: true },
    ],
  },
];

const navGroups = [
  {
    label: "Workspace",
    items: [
      { label: "Overview", icon: LayoutDashboard, active: true },
      { label: "My work", icon: Check },
      { label: "Inbox", icon: Bell },
    ],
  },
  {
    label: "Planning",
    items: [
      { label: "Initiatives", icon: ListTree },
      { label: "Active initiatives", nested: true },
      { label: "Roadmap", icon: Rows3 },
      { label: "Goals", icon: Sparkles },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Workload", icon: Circle },
      { label: "Reports", icon: FileText },
    ],
  },
] as const;

function subscribeToMobileViewport(callback: () => void) {
  const media = window.matchMedia("(max-width: 1080px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function useMobileViewport() {
  return React.useSyncExternalStore(
    subscribeToMobileViewport,
    () => window.matchMedia("(max-width: 1080px)").matches,
    () => false,
  );
}

function WorkspaceNavigation() {
  return (
    <nav className={styles["workspace-nav"]} aria-label="Workspace">
      {navGroups.map((group) => (
        <div className={styles["workspace-nav__group"]} key={group.label}>
          <span>{group.label}</span>
          {group.items.map((item) => {
            const active = "active" in item && item.active;
            return (
              <Button
                key={item.label}
                aria-current={active ? "page" : undefined}
                className={styles["workspace-nav__item"]}
                data-state={active ? "active" : "inactive"}
                data-nested={"nested" in item && item.nested ? "true" : undefined}
                leadingIcon={"icon" in item ? item.icon : undefined}
                nativeButton={false}
                render={<span />}
                size="sm"
                variant={active ? "secondary" : "ghost"}
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

export function OperationsWorkspaceView() {
  return (
    <ToastProvider>
      <OperationsWorkspace />
      <ToastViewport swipeDirection={["inline-end", "down"]} />
    </ToastProvider>
  );
}

function OperationsWorkspace() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [commandOpen, setCommandOpen] = React.useState(false);
  const [theme, setThemeValue] = React.useState<Appearance["theme"]>(defaultAppearance.theme);
  const [mode, setModeValue] = React.useState<Appearance["mode"]>(defaultAppearance.mode);
  const [density, setDensityValue] = React.useState<Appearance["density"]>(
    defaultAppearance.density,
  );
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr");
  const isMobile = useMobileViewport();
  const toasts = useToastManager();

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    const initialDirection = root.getAttribute("dir");
    const restored = readAppearanceFromRoot(root);
    setThemeValue(restored.theme);
    setModeValue(restored.mode);
    setDensityValue(restored.density);

    return () => {
      if (initialDirection) root.setAttribute("dir", initialDirection);
      else root.removeAttribute("dir");
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.setAttribute("dir", direction);
  }, [direction]);

  const filteredInitiatives = React.useMemo(
    () =>
      initiatives.filter((initiative) => {
        const matchesQuery = initiative.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || initiative.status === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status],
  );

  const setTheme = (value: string) => {
    const nextTheme = themes.find((candidate) => candidate === value);
    if (!nextTheme) return;
    setThemeValue(nextTheme);
    persistAppearanceAxis(document.documentElement, "theme", nextTheme);
  };
  const setMode = (value: string) => {
    const nextMode = modes.find((candidate) => candidate === value);
    if (!nextMode) return;
    setModeValue(nextMode);
    persistAppearanceAxis(document.documentElement, "mode", nextMode);
  };
  const setDensity = (value: string) => {
    const nextDensity = densities.find((candidate) => candidate === value);
    if (!nextDensity) return;
    setDensityValue(nextDensity);
    persistAppearanceAxis(document.documentElement, "density", nextDensity);
  };

  return (
    <SidebarProvider
      className={`${styles.workspace} n-typography-system`}
      direction={direction}
      side={direction === "rtl" ? "right" : "left"}
      sidebarId="workspace-sidebar"
    >
      {!isMobile ? (
        <Sidebar aria-label="Workspace sidebar">
          <SidebarHeader>
            <div className={styles["workspace-brand"]}>
              <span aria-hidden />
              <div>
                <strong>Nerio Workspace</strong>
                <small>Product operations</small>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <WorkspaceNavigation />
          </SidebarContent>
          <SidebarRail label="Toggle workspace sidebar" />
        </Sidebar>
      ) : null}

      <SidebarInset className={styles["workspace-main"]} id="overview">
        <header className={styles["workspace-topbar"]}>
          <div className={styles["workspace-title"]}>
            <div className={styles["workspace-navigation-trigger"]}>
              {isMobile ? (
                <Sheet>
                  <Tooltip label="Open workspace navigation">
                    <SheetTrigger
                      render={
                        <Button
                          icon={PanelLeft}
                          aria-label="Open workspace navigation"
                          tooltip={false}
                          variant="secondary"
                        />
                      }
                    />
                  </Tooltip>
                  <SheetContent side={direction === "rtl" ? "right" : "left"} size="sm">
                    <SheetHeader>
                      <SheetTitle>Workspace navigation</SheetTitle>
                      <SheetDescription>Choose a workspace destination.</SheetDescription>
                    </SheetHeader>
                    <SheetBody>
                      <WorkspaceNavigation />
                    </SheetBody>
                  </SheetContent>
                </Sheet>
              ) : (
                <SidebarTrigger label="Toggle workspace sidebar" />
              )}
            </div>
            <Badge tone="info">Overview</Badge>
            <h1>Operations overview</h1>
            <p>
              Monitor delivery health, initiative owners, blockers, and upcoming milestones across
              one focused workspace.
            </p>
          </div>
          <div className={styles["workspace-actions"]}>
            <Dialog
              bodyClassName={styles["command-dialog__body"]}
              className={styles["command-dialog"]}
              description="Jump to a workspace view or change how this preview is displayed."
              onOpenChange={setCommandOpen}
              open={commandOpen}
              trigger={
                <Button
                  aria-label="Search workspace"
                  icon={Search}
                  tooltip="Search workspace"
                  variant="secondary"
                />
              }
              title="Workspace commands"
            >
              <Command className={styles["workspace-command"]} items={workspaceCommands}>
                <CommandInput
                  aria-label="Workspace commands"
                  autoFocus
                  placeholder="Search commands"
                />
                <CommandEmpty>No matching commands.</CommandEmpty>
                <CommandList renderGroupLabel={(group) => group.label}>
                  {(item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                      description={
                        item.value === "show-risk"
                          ? "Limit this workspace view to initiatives that need attention"
                          : undefined
                      }
                      leading={item.value === "show-risk" ? <Icon icon={Check} /> : undefined}
                      metadata={item.value === "compact" ? "Display" : undefined}
                      onSelect={(value) => {
                        if (value === "show-all") {
                          setQuery("");
                          setStatus("all");
                        }
                        if (value === "show-risk") setStatus("At risk");
                        if (value === "compact") setDensity("compact");
                        setCommandOpen(false);
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  )}
                </CommandList>
              </Command>
            </Dialog>
            <Sheet>
              <Tooltip label="Open preview settings">
                <SheetTrigger
                  render={
                    <Button
                      aria-label="Open preview settings"
                      icon={Settings}
                      tooltip={false}
                      variant="secondary"
                    />
                  }
                />
              </Tooltip>
              <SheetContent side={direction === "rtl" ? "left" : "right"} size="sm">
                <SheetHeader>
                  <SheetTitle>Preview settings</SheetTitle>
                  <SheetDescription>
                    Inspect the same static workspace across supported runtime axes.
                  </SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <div className={styles["preview-settings"]}>
                    <Select
                      label="Theme"
                      value={theme}
                      onValueChange={setTheme}
                      options={themeOptions}
                    />
                    <Select
                      label="Mode"
                      value={mode}
                      onValueChange={setMode}
                      options={modeOptions}
                    />
                    <Select
                      label="Density"
                      value={density}
                      onValueChange={setDensity}
                      options={densityOptions}
                    />
                    <Select
                      label="Direction"
                      value={direction}
                      onValueChange={(value) => {
                        if (value === "ltr" || value === "rtl") setDirection(value);
                      }}
                      options={[
                        { label: "Left to right", value: "ltr" },
                        { label: "Right to left", value: "rtl" },
                      ]}
                    />
                  </div>
                </SheetBody>
              </SheetContent>
            </Sheet>
            <Button
              leadingIcon={Sparkles}
              onClick={() => {
                toasts.add({
                  title: "New initiative action",
                  description: "Connect this entry point to your product's creation flow.",
                  data: { tone: "success" },
                });
              }}
            >
              New initiative
            </Button>
          </div>
        </header>

        <section className={styles["workspace-controls"]}>
          <Input
            aria-label="Search initiatives"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search initiatives"
            type="search"
          />
          <Tabs
            className={styles["status-tabs"]}
            onValueChange={(value) => {
              if (value) setStatus(value);
            }}
            size="sm"
            value={status}
            variant="segmented"
          >
            <TabsList aria-label="Initiative status" scrollable>
              <TabsTrigger badge={<Badge size="sm">4</Badge>} value="all">
                All
              </TabsTrigger>
              <TabsTrigger badge={<Badge size="sm">1</Badge>} value="On track">
                On track
              </TabsTrigger>
              <TabsTrigger badge={<Badge size="sm">1</Badge>} value="At risk">
                At risk
              </TabsTrigger>
              <TabsTrigger badge={<Badge size="sm">1</Badge>} value="In review">
                In review
              </TabsTrigger>
              <TabsTrigger badge={<Badge size="sm">1</Badge>} value="Planned">
                Planned
              </TabsTrigger>
              <TabsIndicator />
            </TabsList>
          </Tabs>
        </section>

        <section className={styles["workspace-grid"]}>
          <Stat
            label="Active initiatives"
            value="12"
            trend="+3 this week"
            className={`${styles["span-3"]} ${styles["positive-trend"]}`}
          />
          <Stat
            label="Open blockers"
            value="5"
            trend="2 need owners"
            className={styles["span-3"]}
          />
          <Stat label="Due this week" value="8" trend="3 due today" className={styles["span-3"]} />
          <Stat label="Contributors" value="9" trend="4 teams" className={styles["span-3"]} />

          <Card className={`${styles["span-8"]} ${styles["workspace-panel"]}`} id="delivery-health">
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Delivery health</h2>
                <p>Weekly completion rate across active initiatives.</p>
              </div>
              <Badge tone="success">+8.4%</Badge>
            </div>
            <div
              aria-label="Weekly completion rate rose from 62 percent on Monday to 86 percent on Sunday"
              className={styles["delivery-chart"]}
              role="img"
            >
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart
                  data={[...deliveryTrend]}
                  margin={{ top: 12, right: 12, bottom: 0, left: 12 }}
                >
                  <defs>
                    <linearGradient id="operations-delivery-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--n-chart-primary)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--n-chart-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--n-color-border-subtle)" />
                  <XAxis
                    axisLine={false}
                    dataKey="day"
                    tick={{ fill: "var(--n-color-text-tertiary)", fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis hide domain={[50, 100]} />
                  <ChartTooltip
                    formatter={(value) => [`${Number(value)}%`, "Completion"]}
                    contentStyle={{
                      background: "var(--n-color-surface)",
                      border: "1px solid var(--n-color-border-subtle)",
                      borderRadius: "var(--n-radius-md)",
                      color: "var(--n-color-text-primary)",
                    }}
                  />
                  <Area
                    dataKey="completion"
                    fill="url(#operations-delivery-fill)"
                    isAnimationActive={false}
                    stroke="var(--n-chart-primary)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={`${styles["span-4"]} ${styles["workspace-panel"]}`}>
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Team capacity</h2>
                <p>People assigned across active delivery work.</p>
              </div>
            </div>
            <div aria-label="Six of nine contributors" className={styles["team-list"]} role="group">
              {avatarPreviewAssets.map((avatar) => (
                <Avatar key={avatar.name} {...avatar} size="sm" />
              ))}
            </div>
            <Progress label="Assigned capacity" value={82} valueLabel="82%" />
          </Card>

          <Card className={`${styles["span-8"]} ${styles["workspace-panel"]}`} id="initiatives">
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Initiatives</h2>
                <p>Filtered by the search and status controls above.</p>
              </div>
            </div>

            {filteredInitiatives.length ? (
              <TableContainer focusable aria-label="Workspace initiatives">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead data-align="numeric">Progress</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInitiatives.map((initiative) => (
                      <TableRow key={initiative.name}>
                        <TableHead scope="row">{initiative.name}</TableHead>
                        <TableCell>{initiative.owner}</TableCell>
                        <TableCell>
                          <Badge
                            tone={
                              initiative.status === "On track"
                                ? "success"
                                : initiative.status === "At risk"
                                  ? "warning"
                                  : initiative.status === "In review"
                                    ? "info"
                                    : "neutral"
                            }
                          >
                            {initiative.status}
                          </Badge>
                        </TableCell>
                        <TableCell data-align="numeric">{initiative.progress}%</TableCell>
                        <TableCell>{initiative.updated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}

            {!filteredInitiatives.length ? (
              <EmptyState role="status" size="sm">
                <EmptyStateHeader>
                  <EmptyStateTitle>No matching initiatives</EmptyStateTitle>
                  <EmptyStateDescription>
                    Clear search or choose another status to bring items back.
                  </EmptyStateDescription>
                </EmptyStateHeader>
                <EmptyStateActions>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setQuery("");
                      setStatus("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </EmptyStateActions>
              </EmptyState>
            ) : null}
          </Card>

          <Card className={`${styles["span-4"]} ${styles["workspace-panel"]}`} id="activity">
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Recent activity</h2>
                <p>Latest delivery updates across teams.</p>
              </div>
            </div>
            <div className={styles["activity-feed"]}>
              {activity.map(([title, scope, time]) => (
                <div key={title} className={styles["activity-item"]}>
                  <Icon icon={Check} />
                  <div>
                    <strong>{title}</strong>
                    <span>
                      {scope} - {time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Dialog
              trigger={
                <Button trailingIcon={ArrowRight} variant="secondary">
                  View activity details
                </Button>
              }
              title="Review launch checklist"
              description="Inspect the selected task without losing your place in the workspace."
            >
              <div className={styles["task-detail"]}>
                <Badge tone="info">In review</Badge>
                <p>
                  Confirm the launch owner, remaining approvals, and the next handoff before
                  completing this task.
                </p>
              </div>
              <DialogFooter>
                <Button
                  onClick={() =>
                    toasts.add({
                      title: "Task review recorded",
                      description: "The launch checklist remains available in the task feed.",
                    })
                  }
                >
                  Record review
                </Button>
              </DialogFooter>
            </Dialog>
          </Card>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
