"use client";

import * as React from "react";
import { densities, modes, themes } from "@nerio-ui/tokens";
import { Icon, SidebarContent, SidebarHeader, SidebarInset } from "@nerio-ui/ui";
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
  Dialog,
  DialogFooter,
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

const deliverySignals = [
  ["Client portal launch", "14 of 18 milestones complete", 78],
  ["Reporting migration", "11 of 16 dependencies cleared", 69],
  ["Mobile onboarding", "9 of 10 flows approved", 90],
] as const;

const runtimeLabel = (value: string) => `${value[0]?.toUpperCase() ?? ""}${value.slice(1)}`;
const themeOptions = themes.map((value) => ({ label: runtimeLabel(value), value }));
const modeOptions = modes.map((value) => ({ label: runtimeLabel(value), value }));
const densityOptions = densities.map((value) => ({ label: runtimeLabel(value), value }));

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "On track", value: "On track" },
  { label: "At risk", value: "At risk" },
  { label: "In review", value: "In review" },
  { label: "Planned", value: "Planned" },
];

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
    items: [["Overview", LayoutDashboard, "#overview"]] as const,
  },
  {
    label: "Operations",
    items: [
      ["Delivery health", Check, "#delivery-health"],
      ["Initiatives", ListTree, "#initiatives"],
      ["Activity", Bell, "#activity"],
    ] as const,
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
      {navGroups.map((group, groupIndex) => (
        <div className={styles["workspace-nav__group"]} key={group.label}>
          <span>{group.label}</span>
          {group.items.map(([item, icon, href], itemIndex) => {
            const active = groupIndex === 0 && itemIndex === 0;
            return (
              <Button
                key={item}
                aria-current={active ? "page" : undefined}
                className={styles["workspace-nav__item"]}
                data-state={active ? "active" : "inactive"}
                leadingIcon={icon}
                nativeButton={false}
                render={<a href={href} />}
                size="sm"
                variant={active ? "secondary" : "ghost"}
              >
                {item}
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
            <Badge tone="info">Overview</Badge>
            <h1>Operations overview</h1>
            <p>
              Monitor delivery health, initiative owners, blockers, and upcoming milestones across
              one focused workspace.
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
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  )}
                </CommandList>
              </Command>
            </Popover>
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
              <SheetContent side="right" size="sm">
                <SheetHeader>
                  <SheetTitle>Preview settings</SheetTitle>
                  <SheetDescription>
                    Inspect the same static workspace across supported runtime axes and data states.
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
                      onValueChange={setDirection}
                      options={[
                        { label: "Left to right", value: "ltr" },
                        { label: "Right to left", value: "rtl" },
                      ]}
                    />
                    <fieldset className={styles["preview-state-control"]}>
                      <legend>Initiative state</legend>
                      <div>
                        {(["ready", "loading", "error", "success"] as const).map((value) => (
                          <Button
                            key={value}
                            aria-pressed={workspaceState === value}
                            size="sm"
                            variant={workspaceState === value ? "primary" : "secondary"}
                            onClick={() => setWorkspaceState(value)}
                          >
                            {runtimeLabel(value)}
                          </Button>
                        ))}
                      </div>
                    </fieldset>
                    <Alert tone="info" title="Static preview">
                      Filters and state controls stay local and never change the sample data source.
                    </Alert>
                  </div>
                </SheetBody>
              </SheetContent>
            </Sheet>
            <Button
              leadingIcon={Sparkles}
              onClick={() => {
                setWorkspaceState("ready");
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
          <Field label="Search initiatives">
            <Input
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search by initiative name"
            />
          </Field>
          <Select label="Status" value={status} onValueChange={setStatus} options={statusOptions} />
        </section>

        <section className={styles["workspace-grid"]}>
          <Stat
            label="Active initiatives"
            value="12"
            trend="+3 this week"
            className={styles["span-3"]}
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
                <p>Progress across the highest-priority initiatives.</p>
              </div>
              <Badge tone="success">On track</Badge>
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
                <h2>Team capacity</h2>
                <p>People assigned across active delivery work.</p>
              </div>
            </div>
            <div className={styles["team-list"]}>
              {["Mira Chen", "Alex Morgan", "Sam Taylor", "Jordan Lee"].map((name) => (
                <Avatar key={name} name={name} />
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

            {workspaceState === "loading" ? (
              <div
                className={styles["loading-stack"]}
                aria-label="Loading initiatives"
                aria-live="polite"
                role="status"
              >
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            ) : null}

            {workspaceState === "error" ? (
              <EmptyState role="alert">
                <EmptyStateHeader>
                  <EmptyStateTitle>Initiative source unavailable</EmptyStateTitle>
                  <EmptyStateDescription>
                    Reconnect the source or retry when the operations service is available.
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
              <Alert role="status" tone="success" title="Initiatives synchronized">
                Delivery data is current and ready for the next review.
              </Alert>
            ) : null}

            {(workspaceState === "ready" || workspaceState === "success") &&
            filteredInitiatives.length ? (
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

            {(workspaceState === "ready" || workspaceState === "success") &&
            !filteredInitiatives.length ? (
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
            <Dialog
              trigger={<Button variant="secondary">Open task details</Button>}
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
