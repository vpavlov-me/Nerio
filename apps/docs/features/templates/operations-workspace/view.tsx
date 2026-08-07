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
  CalendarDays,
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
  TriangleAlert,
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
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  Kbd,
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

const teamCapacity = [
  { team: "Product and design", people: "3 contributors", capacity: "92%", tone: "warning" },
  { team: "Engineering", people: "4 contributors", capacity: "84%", tone: "info" },
  { team: "Content operations", people: "2 contributors", capacity: "68%", tone: "success" },
] as const;

const operationalRisks = [
  {
    name: "Data sync dependency",
    context: "Reporting migration · 4 days open",
    severity: "High",
    tone: "danger",
  },
  {
    name: "Legal review pending",
    context: "Client portal launch · 2 days open",
    severity: "Medium",
    tone: "warning",
  },
  {
    name: "Content handoff",
    context: "Help center refresh · Due today",
    severity: "Low",
    tone: "neutral",
  },
] as const;

const upcomingMilestones = [
  { name: "Client portal launch", context: "Release readiness", date: "Aug 12" },
  { name: "Mobile onboarding beta", context: "Pilot group handoff", date: "Aug 14" },
  { name: "Help center cutover", context: "Content publication", date: "Aug 18" },
] as const;

const cycleTimeTrend = [
  { week: "W1", days: 6.4 },
  { week: "W2", days: 6.1 },
  { week: "W3", days: 5.6 },
  { week: "W4", days: 5.2 },
  { week: "W5", days: 4.8 },
] as const;

const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;
const themeOptions = themes.map((value) => ({ label: runtimeLabel(value), value }));
const modeOptions = modes.map((value) => ({ label: runtimeLabel(value), value }));
const densityOptions = densities.map((value) => ({ label: runtimeLabel(value), value }));

const workspaceCommands = [
  {
    value: "navigation",
    label: "Navigation",
    items: [
      { value: "nav-overview", label: "Overview", keywords: ["workspace", "dashboard"] },
      { value: "nav-my-work", label: "My work", keywords: ["assigned", "tasks"] },
      { value: "nav-inbox", label: "Inbox", keywords: ["updates", "notifications"] },
      { value: "nav-initiatives", label: "Initiatives", keywords: ["projects", "portfolio"] },
      { value: "nav-roadmap", label: "Roadmap", keywords: ["milestones", "planning"] },
      { value: "nav-goals", label: "Goals", keywords: ["outcomes", "targets"] },
      { value: "nav-workload", label: "Workload", keywords: ["capacity", "teams"] },
      { value: "nav-reports", label: "Reports", keywords: ["delivery", "analytics"] },
    ],
  },
  {
    value: "initiatives",
    label: "Initiatives",
    items: [
      {
        value: "initiative-client-portal",
        label: "Client portal launch",
        keywords: ["Mira Chen", "on track", "launch"],
      },
      {
        value: "initiative-reporting",
        label: "Reporting migration",
        keywords: ["Alex Morgan", "at risk", "reporting"],
      },
      {
        value: "initiative-onboarding",
        label: "Mobile onboarding",
        keywords: ["Sam Taylor", "in review", "mobile"],
      },
      {
        value: "initiative-help-center",
        label: "Help center refresh",
        keywords: ["Jordan Lee", "planned", "content"],
      },
    ],
  },
] as const;

const commandDetails = {
  "nav-overview": {
    icon: LayoutDashboard,
    description: "Workspace summary and current delivery health",
    metadata: "Workspace",
    targetId: "overview",
  },
  "nav-my-work": {
    icon: Check,
    description: "Assigned initiatives, reviews, and follow-ups",
    metadata: "Workspace",
    targetId: "operational-risks",
  },
  "nav-inbox": {
    icon: Bell,
    description: "Recent updates and team activity",
    metadata: "Workspace",
    targetId: "activity",
  },
  "nav-initiatives": {
    icon: ListTree,
    description: "Portfolio status, owners, and progress",
    metadata: "Workspace",
    targetId: "initiatives",
  },
  "nav-roadmap": {
    icon: Rows3,
    description: "Upcoming delivery milestones",
    metadata: "Workspace",
    targetId: "upcoming-milestones",
  },
  "nav-goals": {
    icon: Sparkles,
    description: "Operational outcomes and cycle-time trend",
    metadata: "Workspace",
    targetId: "cycle-time",
  },
  "nav-workload": {
    icon: Circle,
    description: "Team capacity across active work",
    metadata: "Workspace",
    targetId: "team-capacity",
  },
  "nav-reports": {
    icon: FileText,
    description: "Delivery health and completion trend",
    metadata: "Workspace",
    targetId: "delivery-health",
  },
  "initiative-client-portal": {
    icon: ListTree,
    description: "Mira Chen · Updated today",
    status: "On track",
    targetId: "initiatives",
  },
  "initiative-reporting": {
    icon: ListTree,
    description: "Alex Morgan · Updated tomorrow",
    status: "At risk",
    targetId: "initiatives",
  },
  "initiative-onboarding": {
    icon: ListTree,
    description: "Sam Taylor · Updated Aug 14",
    status: "In review",
    targetId: "initiatives",
  },
  "initiative-help-center": {
    icon: ListTree,
    description: "Jordan Lee · Updated Aug 18",
    status: "Planned",
    targetId: "initiatives",
  },
} as const;

const getCommandDetails = (value: string) => commandDetails[value as keyof typeof commandDetails];

const statusTone = (status: string) =>
  status === "On track"
    ? "success"
    : status === "At risk"
      ? "warning"
      : status === "In review"
        ? "info"
        : "neutral";

const navigationItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "My work", icon: Check },
  { label: "Inbox", icon: Bell },
  { label: "Initiatives", icon: ListTree },
  { label: "Roadmap", icon: Rows3 },
  { label: "Goals", icon: Sparkles },
  { label: "Workload", icon: Circle },
  { label: "Reports", icon: FileText },
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
      {navigationItems.map((item) => {
        const active = "active" in item && item.active;
        return (
          <Button
            key={item.label}
            aria-current={active ? "page" : undefined}
            className={styles["workspace-nav__item"]}
            data-state={active ? "active" : "inactive"}
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

  React.useEffect(() => {
    const openCommandPalette = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k" ||
        target?.matches("input, textarea, [contenteditable='true']")
      ) {
        return;
      }
      event.preventDefault();
      setCommandOpen(true);
    };

    window.addEventListener("keydown", openCommandPalette);
    return () => window.removeEventListener("keydown", openCommandPalette);
  }, []);

  const filteredInitiatives = React.useMemo(
    () => initiatives.filter((initiative) => status === "all" || initiative.status === status),
    [status],
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
              <span aria-hidden>
                <Icon icon={Sparkles} />
              </span>
              <strong>Nerio Workspace</strong>
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
            {isMobile ? (
              <div className={styles["workspace-navigation-trigger"]}>
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
              </div>
            ) : null}
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
              description="Navigate workspace pages or find an initiative."
              onOpenChange={setCommandOpen}
              open={commandOpen}
              trigger={
                <Button
                  aria-label="Search workspace"
                  icon={Search}
                  tooltip="Search workspace (⌘K)"
                  variant="secondary"
                />
              }
              title="Workspace commands"
            >
              <Command className={styles["workspace-command"]} items={workspaceCommands}>
                <CommandInput
                  aria-label="Workspace commands"
                  autoFocus
                  placeholder="Search pages and initiatives"
                />
                <CommandEmpty>No matching pages or initiatives.</CommandEmpty>
                <CommandList renderGroupLabel={(group) => group.label}>
                  {(item) => {
                    const details = getCommandDetails(item.value);
                    const itemStatus = "status" in details ? details.status : undefined;
                    const isNavigation = item.value.startsWith("nav-");
                    return (
                      <CommandItem
                        key={item.value}
                        value={item.value}
                        description={isNavigation ? undefined : details.description}
                        leading={<Icon icon={details.icon} />}
                        metadata={
                          itemStatus ? (
                            <Badge size="sm" tone={statusTone(itemStatus)}>
                              {itemStatus}
                            </Badge>
                          ) : undefined
                        }
                        onSelect={() => {
                          if (itemStatus) setStatus(itemStatus);
                          setCommandOpen(false);
                          window.requestAnimationFrame(() => {
                            document.getElementById(details.targetId)?.scrollIntoView({
                              block: "start",
                            });
                          });
                        }}
                      >
                        {item.label}
                      </CommandItem>
                    );
                  }}
                </CommandList>
                <footer className={styles["command-footer"]}>
                  <span>
                    <Kbd aria-hidden>↑↓</Kbd> Navigate
                  </span>
                  <span>
                    <Kbd aria-hidden>↵</Kbd> Select
                  </span>
                  <span>
                    <Kbd aria-hidden>Esc</Kbd> Close
                  </span>
                </footer>
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

          <Card className={`${styles["span-4"]} ${styles["workspace-panel"]}`} id="team-capacity">
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Team capacity</h2>
                <p>Capacity by team across active delivery work.</p>
              </div>
            </div>
            <div aria-label="Six of nine contributors" className={styles["team-list"]} role="group">
              {avatarPreviewAssets.map((avatar) => (
                <Avatar key={avatar.name} {...avatar} />
              ))}
            </div>
            <ItemGroup
              aria-label="Team capacity details"
              className={styles["capacity-list"]}
              role="group"
            >
              {teamCapacity.map((team) => (
                <Item key={team.team} size="sm">
                  <ItemContent>
                    <ItemTitle>{team.team}</ItemTitle>
                    <ItemDescription>{team.people}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge tone={team.tone}>{team.capacity}</Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </Card>

          <Card
            className={`${styles["span-4"]} ${styles["workspace-panel"]}`}
            id="operational-risks"
          >
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Operational risks</h2>
                <p>Blockers that need an owner or decision.</p>
              </div>
              <Badge leadingIcon={TriangleAlert} tone="warning">
                3 open
              </Badge>
            </div>
            <ItemGroup aria-label="Operational risks" className={styles["compact-list"]}>
              {operationalRisks.map((risk) => (
                <Item key={risk.name} size="sm">
                  <ItemContent>
                    <ItemTitle>{risk.name}</ItemTitle>
                    <ItemDescription>{risk.context}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge tone={risk.tone}>{risk.severity}</Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </Card>

          <Card
            className={`${styles["span-4"]} ${styles["workspace-panel"]}`}
            id="upcoming-milestones"
          >
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Upcoming milestones</h2>
                <p>Next delivery moments across the portfolio.</p>
              </div>
              <Badge leadingIcon={CalendarDays} tone="info">
                10 days
              </Badge>
            </div>
            <ItemGroup aria-label="Upcoming milestones" className={styles["compact-list"]}>
              {upcomingMilestones.map((milestone) => (
                <Item key={milestone.name} size="sm">
                  <ItemContent>
                    <ItemTitle>{milestone.name}</ItemTitle>
                    <ItemDescription>{milestone.context}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge>{milestone.date}</Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </Card>

          <Card className={`${styles["span-4"]} ${styles["workspace-panel"]}`} id="cycle-time">
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Cycle time</h2>
                <p>Median time from start to completion.</p>
              </div>
              <Badge tone="success">-0.7d</Badge>
            </div>
            <div className={styles["cycle-time-summary"]}>
              <div>
                <strong>4.8 days</strong>
                <span>Current median</span>
              </div>
              <div>
                <strong>24</strong>
                <span>Completed this month</span>
              </div>
            </div>
            <div
              aria-label="Median cycle time decreased from 6.4 days to 4.8 days over five weeks"
              className={styles["cycle-time-chart"]}
              role="img"
            >
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart
                  data={[...cycleTimeTrend]}
                  margin={{ top: 8, right: 12, bottom: 0, left: 12 }}
                >
                  <defs>
                    <linearGradient id="operations-cycle-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="var(--n-chart-primary)" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="var(--n-chart-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--n-color-border-subtle)" />
                  <XAxis
                    axisLine={false}
                    dataKey="week"
                    tick={{ fill: "var(--n-color-text-tertiary)", fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis hide domain={[4, 7]} />
                  <ChartTooltip
                    formatter={(value) => [`${Number(value)} days`, "Median cycle time"]}
                    contentStyle={{
                      background: "var(--n-color-surface)",
                      border: "1px solid var(--n-color-border-subtle)",
                      borderRadius: "var(--n-radius-md)",
                      color: "var(--n-color-text-primary)",
                    }}
                  />
                  <Area
                    dataKey="days"
                    fill="url(#operations-cycle-fill)"
                    isAnimationActive={false}
                    stroke="var(--n-chart-primary)"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className={`${styles["span-8"]} ${styles["workspace-panel"]}`} id="initiatives">
            <div className={`${styles["panel-heading"]} ${styles["initiatives-heading"]}`}>
              <div>
                <h2>Initiatives</h2>
                <p>Portfolio status, ownership, and delivery progress.</p>
              </div>
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
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="On track">On track</TabsTrigger>
                  <TabsTrigger value="At risk">At risk</TabsTrigger>
                  <TabsTrigger value="In review">In review</TabsTrigger>
                  <TabsTrigger value="Planned">Planned</TabsTrigger>
                  <TabsIndicator />
                </TabsList>
              </Tabs>
            </div>

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
                        <Badge tone={statusTone(initiative.status)}>{initiative.status}</Badge>
                      </TableCell>
                      <TableCell data-align="numeric">{initiative.progress}%</TableCell>
                      <TableCell>{initiative.updated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
