"use client";

import * as React from "react";
import {
  Bell,
  Check,
  LayoutDashboard,
  ListTree,
  Search,
  Settings,
  Sparkles,
} from "@nerio/adapters";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  Icon,
  IconButton,
  Input,
  Progress,
  Select,
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
  useToastManager,
} from "@nerio/ui/client";

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

const chart = [42, 64, 58, 72, 48, 88, 76, 92, 67, 81, 74, 89];

const themeOptions = [
  { label: "Purple", value: "purple" },
  { label: "Blue", value: "blue" },
  { label: "Green", value: "green" },
  { label: "Orange", value: "orange" },
  { label: "Red", value: "red" },
  { label: "Neutral", value: "neutral" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "Active" },
  { label: "Review", value: "Review" },
  { label: "Draft", value: "Draft" },
];

const navItems = [
  ["Overview", LayoutDashboard],
  ["Projects", ListTree],
  ["Activity", Bell],
  ["Settings", Settings],
] as const;

export default function DemoApp() {
  return (
    <ToastProvider>
      <DemoWorkspace />
      <ToastViewport />
    </ToastProvider>
  );
}

function DemoWorkspace() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [workspaceState, setWorkspaceState] = React.useState<"ready" | "loading" | "error">(
    "ready",
  );
  const [theme, setThemeValue] = React.useState("purple");
  const [mode, setModeValue] = React.useState("system");
  const [density, setDensityValue] = React.useState("comfortable");
  const toasts = useToastManager();

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-mode", mode);
    document.documentElement.setAttribute("data-density", density);
  }, [theme, mode, density]);

  const filteredProjects = React.useMemo(
    () =>
      projects.filter((project) => {
        const matchesQuery = project.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || project.status === status;
        return matchesQuery && matchesStatus;
      }),
    [query, status],
  );

  const setTheme = (value: string) => setThemeValue(value);
  const setMode = (value: string) => setModeValue(value);
  const setDensity = (value: string) => setDensityValue(value);

  return (
    <div className="workspace">
      <aside className="workspace-sidebar">
        <div className="workspace-brand">
          <span aria-hidden />
          <div>
            <strong>Nerio Workspace</strong>
            <small>Universal product workspace</small>
          </div>
        </div>

        <nav className="workspace-nav" aria-label="Workspace">
          {navItems.map(([item, icon], index) => (
            <button key={item} type="button" data-state={index === 0 ? "active" : "inactive"}>
              <Icon icon={icon} />
              <span>{item}</span>
            </button>
          ))}
        </nav>

        <Card className="workspace-compact-preview">
          <Badge>Compact density</Badge>
          <p>Switch density to preview how the same UI tightens for operational screens.</p>
          <Button size="sm" variant="secondary" onClick={() => setDensity("compact")}>
            Use compact
          </Button>
        </Card>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-title">
            <Badge variant="info">Overview</Badge>
            <h1>Product operations without a vertical bias</h1>
            <p>
              Track projects, collections, collaborators, activity, loading states, and recovery
              states in one adaptable product surface.
            </p>
          </div>
          <div className="workspace-actions">
            <IconButton icon={Search} label="Search workspace" variant="secondary" />
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

        <section className="workspace-controls">
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
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { label: "System", value: "system" },
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
          <Select
            label="Density"
            value={density}
            onChange={setDensity}
            options={[
              { label: "Comfortable", value: "comfortable" },
              { label: "Compact", value: "compact" },
            ]}
          />
        </section>

        <section className="workspace-grid">
          <Stat label="Active projects" value="12" trend="+3 this week" className="span-3" />
          <Stat label="Open tasks" value="48" trend="8 due today" className="span-3" />
          <Stat label="Collaborators" value="9" trend="4 teams" className="span-3" />
          <Stat label="Collections" value="27" trend="Updated daily" className="span-3" />

          <Card className="span-8 workspace-panel">
            <div className="panel-heading">
              <div>
                <h2>Activity analytics</h2>
                <p>Generic activity across projects, collections, and collaboration.</p>
              </div>
              <Badge variant="success">Live mock</Badge>
            </div>
            <div className="chart" aria-label="Activity chart">
              {chart.map((height, index) => (
                <span key={`${height}-${index}`} style={{ height: `${height}%` }} />
              ))}
            </div>
          </Card>

          <Card className="span-4 workspace-panel">
            <div className="panel-heading">
              <div>
                <h2>Collaborators</h2>
                <p>Shared ownership across teams.</p>
              </div>
            </div>
            <div className="team-list">
              {["Mira Chen", "Alex Morgan", "Sam Taylor", "Jordan Lee"].map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </div>
            <Progress label="Weekly collaboration health" value={82} />
          </Card>

          <Card className="span-8 workspace-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent items</h2>
                <p>Filtered by search and status controls above.</p>
              </div>
              <div className="state-controls" aria-label="Demo state controls">
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("loading")}>
                  Loading
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("error")}>
                  Error
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setWorkspaceState("ready")}>
                  Ready
                </Button>
              </div>
            </div>

            {workspaceState === "loading" ? (
              <div className="loading-stack" aria-label="Loading recent items">
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

            {workspaceState === "ready" && filteredProjects.length ? (
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

            {workspaceState === "ready" && !filteredProjects.length ? (
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

          <Card className="span-4 workspace-panel">
            <div className="panel-heading">
              <div>
                <h2>Task feed</h2>
                <p>Recent workspace movement.</p>
              </div>
            </div>
            <div className="activity-feed">
              {activity.map(([title, scope, time]) => (
                <div key={title} className="activity-item">
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
      </main>
    </div>
  );
}
