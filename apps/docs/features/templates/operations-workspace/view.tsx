"use client";

import * as React from "react";
import { densities, modes, themes } from "@nerio-ui/tokens";
import {
  Icon,
  Kbd,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
} from "@nerio-ui/ui";
import {
  Bell,
  Check,
  LayoutDashboard,
  ListTree,
  PanelLeft,
  Search,
  Settings,
  Sparkles,
} from "@nerio-ui/adapters/icons";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  Input,
  Progress,
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
  Skeleton,
  Stat,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
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

const projects = [
  {
    name: "Launch workspace",
    owner: "Mira Chen",
    status: "Active",
    progress: 78,
    updated: "12 min ago",
  },
  {
    name: "Content library",
    owner: "Alex Morgan",
    status: "Review",
    progress: 52,
    updated: "38 min ago",
  },
  {
    name: "Team rituals",
    owner: "Sam Taylor",
    status: "Draft",
    progress: 34,
    updated: "1 hr ago",
  },
  {
    name: "Research archive",
    owner: "Jordan Lee",
    status: "Active",
    progress: 91,
    updated: "Yesterday",
  },
];

const activity = [
  ["Mira updated the project brief", "Launch workspace", "12 minutes ago"],
  ["Alex added three collection notes", "Content library", "38 minutes ago"],
  ["Sam resolved a settings task", "Team rituals", "1 hour ago"],
  ["Jordan shared an analytics snapshot", "Research archive", "Yesterday"],
];

const deliverySignals = [
  ["Launch readiness", "14 of 18 tasks complete", 78],
  ["Content review", "11 of 16 entries approved", 69],
  ["Research synthesis", "9 of 10 notes categorized", 90],
] as const;

const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;
const themeOptions = themes.map((value) => ({ label: runtimeLabel(value), value }));
const modeOptions = modes.map((value) => ({ label: runtimeLabel(value), value }));
const densityOptions = densities.map((value) => ({ label: runtimeLabel(value), value }));

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Review", value: "Review" },
  { label: "Draft", value: "Draft" },
];

const workspaceCommands = [
  {
    value: "project-filters",
    label: "Project filters",
    items: [
      { value: "show-all", label: "Show all projects", keywords: ["reset", "filter"] },
      { value: "show-active", label: "Show active projects", keywords: ["status", "filter"] },
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

const navItems = [
  ["Overview", LayoutDashboard],
  ["Projects", ListTree],
  ["Activity", Bell],
  ["Settings", Settings],
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
      {navItems.map(([item, icon], index) => (
        <Button
          key={item}
          aria-current={index === 0 ? "page" : undefined}
          className={styles["workspace-nav__item"]}
          data-state={index === 0 ? "active" : "inactive"}
          leadingIcon={icon}
          size="sm"
          variant={index === 0 ? "secondary" : "ghost"}
        >
          {item}
        </Button>
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
  const [workspaceState, setWorkspaceState] = React.useState<
    "ready" | "loading" | "error" | "success"
  >("ready");
  const [theme, setThemeValue] = React.useState<Appearance["theme"]>(defaultAppearance.theme);
  const [mode, setModeValue] = React.useState<Appearance["mode"]>(defaultAppearance.mode);
  const [density, setDensityValue] = React.useState<Appearance["density"]>(
    defaultAppearance.density,
  );
  const [direction, setDirection] = React.useState("ltr");
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

  const filteredProjects = React.useMemo(
    () =>
      projects.filter((project) => {
        const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || project.status === status;
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
      sidebarId="workspace-sidebar"
    >
      {!isMobile ? (
        <Sidebar aria-label="Workspace sidebar">
          <SidebarHeader>
            <div className={styles["workspace-brand"]}>
              <span aria-hidden />
              <div>
                <strong>Nerio Workspace</strong>
                <small>Universal product workspace</small>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <WorkspaceNavigation />
          </SidebarContent>
          <SidebarFooter>
            <Card className={styles["workspace-compact-preview"]}>
              <Badge>Compact density</Badge>
              <p>Switch density to preview how the same UI tightens for operational screens.</p>
              <Button size="sm" variant="secondary" onClick={() => setDensity("compact")}>
                Use compact
              </Button>
            </Card>
          </SidebarFooter>
          <SidebarRail label="Toggle workspace sidebar" />
        </Sidebar>
      ) : null}

      <SidebarInset className={styles["workspace-main"]}>
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
                  <SheetContent side="left" size="sm">
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
            <Badge variant="info">Overview</Badge>
            <h1>Product operations without a vertical bias</h1>
            <p>
              Track projects, collections, collaborators, activity, loading states, and recovery
              states in one adaptable product surface.
            </p>
          </div>
          <div className={styles["workspace-actions"]}>
            <Popover
              trigger={
                <Button
                  aria-label="Search workspace"
                  icon={Search}
                  tooltip="Search workspace"
                  variant="secondary"
                />
              }
              title="Workspace commands"
              description="Filter this app-local workspace view."
            >
              <Command items={workspaceCommands}>
                <CommandInput aria-label="Workspace commands" placeholder="Search commands" />
                <CommandEmpty>No matching commands.</CommandEmpty>
                <CommandList renderGroupLabel={(group) => group.label}>
                  {(item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      disabled={item.disabled}
                      description={
                        item.value === "show-active"
                          ? "Limit this workspace view to active projects across every team"
                          : undefined
                      }
                      leading={item.value === "show-active" ? <Icon icon={Check} /> : undefined}
                      metadata={item.value === "compact" ? "Display" : undefined}
                      shortcut={item.value === "show-all" ? <Kbd aria-hidden>G A</Kbd> : undefined}
                      onSelect={(value) => {
                        if (value === "show-all") {
                          setQuery("");
                          setStatus("all");
                        }
                        if (value === "show-active") setStatus("Active");
                        if (value === "compact") setDensity("compact");
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  )}
                </CommandList>
              </Command>
            </Popover>
            <Button
              leadingIcon={Sparkles}
              onClick={() => {
                setWorkspaceState("ready");
                toasts.add({
                  title: "Project draft created",
                  description: "The new workspace item is ready to configure.",
                  data: { tone: "success" },
                });
              }}
            >
              Create project
            </Button>
          </div>
        </header>

        <section className={styles["workspace-controls"]}>
          <Field label="Search projects">
            <Input
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search by project name"
            />
          </Field>
          <Select label="Status" value={status} onChange={setStatus} options={statusOptions} />
          <Select label="Theme" value={theme} onChange={setTheme} options={themeOptions} />
          <Select
            label="Direction"
            value={direction}
            onChange={setDirection}
            options={[
              { label: "Left to right", value: "ltr" },
              { label: "Right to left", value: "rtl" },
            ]}
          />
          <Select label="Mode" value={mode} onChange={setMode} options={modeOptions} />
          <Select label="Density" value={density} onChange={setDensity} options={densityOptions} />
        </section>

        <section className={styles["workspace-grid"]}>
          <Stat
            label="Active projects"
            value="12"
            trend="+3 this week"
            className={styles["span-3"]}
          />
          <Stat label="Open tasks" value="48" trend="8 due today" className={styles["span-3"]} />
          <Stat label="Collaborators" value="9" trend="4 teams" className={styles["span-3"]} />
          <Stat label="Collections" value="27" trend="Updated daily" className={styles["span-3"]} />

          <Card className={`${styles["span-8"]} ${styles["workspace-panel"]}`}>
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Delivery signals</h2>
                <p>Progress across active product work without a domain-specific dashboard.</p>
              </div>
              <Badge variant="success">On track</Badge>
            </div>
            <div className={styles["delivery-signals"]}>
              {deliverySignals.map(([label, description, value]) => (
                <div className={styles["delivery-signal"]} key={label}>
                  <div>
                    <strong>{label}</strong>
                    <span>{description}</span>
                  </div>
                  <Progress aria-label={label} value={value} valueLabel={`${value}%`} />
                </div>
              ))}
            </div>
          </Card>

          <Card className={`${styles["span-4"]} ${styles["workspace-panel"]}`}>
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Collaborators</h2>
                <p>Shared ownership across teams.</p>
              </div>
            </div>
            <div className={styles["team-list"]}>
              {["Mira Chen", "Alex Morgan", "Sam Taylor", "Jordan Lee"].map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </div>
            <Progress label="Weekly collaboration health" value={82} />
          </Card>

          <Card className={`${styles["span-8"]} ${styles["workspace-panel"]}`}>
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Recent items</h2>
                <p>Filtered by search and status controls above.</p>
              </div>
              <div className={styles["state-controls"]} aria-label="Preview state controls">
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("loading")}>
                  Loading
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("error")}>
                  Error
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("success")}>
                  Success
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("ready")}>
                  Ready
                </Button>
              </div>
            </div>

            {workspaceState === "loading" ? (
              <div className={styles["loading-stack"]} aria-label="Loading recent items">
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            ) : null}

            {workspaceState === "error" ? (
              <EmptyState role="alert">
                <EmptyStateHeader>
                  <EmptyStateTitle>Activity source unavailable</EmptyStateTitle>
                  <EmptyStateDescription>
                    Reconnect the source or retry when the workspace service is available.
                  </EmptyStateDescription>
                </EmptyStateHeader>
                <EmptyStateActions>
                  <Button size="sm" onClick={() => setWorkspaceState("ready")}>
                    Retry
                  </Button>
                </EmptyStateActions>
              </EmptyState>
            ) : null}

            {workspaceState === "success" ? (
              <Alert role="status" tone="success" title="Workspace synchronized">
                Project data is current and ready for the next review.
              </Alert>
            ) : null}

            {(workspaceState === "ready" || workspaceState === "success") &&
            filteredProjects.length ? (
              <TableContainer focusable aria-label="Workspace projects">
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
                    {filteredProjects.map((project) => (
                      <TableRow key={project.name}>
                        <TableHead scope="row">{project.name}</TableHead>
                        <TableCell>{project.owner}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              project.status === "Active"
                                ? "success"
                                : project.status === "Review"
                                  ? "info"
                                  : "neutral"
                            }
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell data-align="numeric">{project.progress}%</TableCell>
                        <TableCell>{project.updated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}

            {(workspaceState === "ready" || workspaceState === "success") &&
            !filteredProjects.length ? (
              <EmptyState role="status" size="sm">
                <EmptyStateHeader>
                  <EmptyStateTitle>No matching projects</EmptyStateTitle>
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

          <Card className={`${styles["span-4"]} ${styles["workspace-panel"]}`}>
            <div className={styles["panel-heading"]}>
              <div>
                <h2>Task feed</h2>
                <p>Recent workspace movement.</p>
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
          </Card>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
