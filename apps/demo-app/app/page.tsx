"use client";

import * as React from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Progress,
  Select,
  Skeleton,
  Stat,
  Table,
  Toast,
} from "@nerio/ui";

const projects = [
  { name: "Launch workspace", owner: "Mira Chen", status: "Active", progress: 78 },
  { name: "Content library", owner: "Alex Morgan", status: "Review", progress: 52 },
  { name: "Team rituals", owner: "Sam Taylor", status: "Draft", progress: 34 },
];

const activity = [
  ["Mira updated the project brief", "12 minutes ago"],
  ["Alex added three collection notes", "38 minutes ago"],
  ["Sam resolved a settings task", "1 hour ago"],
  ["Jordan shared an analytics snapshot", "Yesterday"],
];

export default function DemoApp() {
  const [query, setQuery] = React.useState("");
  const [showToast, setShowToast] = React.useState(false);
  const [theme, setThemeValue] = React.useState("purple-light");
  const [density, setDensityValue] = React.useState("comfortable");
  const filtered = projects.filter((project) =>
    project.name.toLowerCase().includes(query.toLowerCase()),
  );

  const setTheme = (value: string) => {
    setThemeValue(value);
    document.documentElement.setAttribute("data-theme", value);
  };
  const setDensity = (value: string) => {
    setDensityValue(value);
    document.documentElement.setAttribute("data-density", value);
  };

  return (
    <div className="workspace">
      <aside className="workspace-sidebar">
        <div className="workspace-brand">
          <span aria-hidden />
          <span>Nerio Workspace</span>
        </div>
        <nav className="workspace-nav" aria-label="Workspace">
          {["Overview", "Projects", "Collections", "Activity", "Settings"].map((item, index) => (
            <button key={item} type="button" data-state={index === 0 ? "active" : "inactive"}>
              {item}
            </button>
          ))}
        </nav>
        <div className="workspace-controls">
          <Select
            label="Theme"
            value={theme}
            onChange={setTheme}
            options={[
              { label: "Purple light", value: "purple-light" },
              { label: "Neutral light", value: "neutral-light" },
              { label: "Neutral dark", value: "neutral-dark" },
              { label: "Fintech blue light", value: "fintech-blue-light" },
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
        </div>
      </aside>
      <main className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-title">
            <h1>Overview</h1>
            <p>
              Track projects, collections, collaborators, and product activity in one calm
              workspace.
            </p>
          </div>
          <Button onClick={() => setShowToast(true)}>Create project</Button>
        </header>
        {showToast ? (
          <Toast
            title="Project draft created"
            description="The new workspace item is ready to configure."
            tone="success"
          />
        ) : null}
        <section className="workspace-grid">
          <div className="span-3">
            <Stat label="Active projects" value="12" trend="+3 this week" />
          </div>
          <div className="span-3">
            <Stat label="Open tasks" value="48" trend="8 due today" />
          </div>
          <div className="span-3">
            <Stat label="Collaborators" value="9" trend="4 teams" />
          </div>
          <div className="span-3">
            <Stat label="Collections" value="27" trend="Updated daily" />
          </div>
          <Card className="span-8">
            <h2>Activity analytics</h2>
            <div className="chart" aria-label="Activity chart">
              {[42, 64, 58, 72, 48, 88, 76, 92, 67, 81].map((height) => (
                <span key={height} style={{ height: `${height}%` }} />
              ))}
            </div>
          </Card>
          <Card className="span-4">
            <h2>Team</h2>
            <div className="team-list">
              {["Mira Chen", "Alex Morgan", "Sam Taylor", "Jordan Lee"].map((name) => (
                <Avatar key={name} name={name} />
              ))}
            </div>
            <Progress label="Weekly collaboration health" value={82} />
          </Card>
          <Card className="span-8">
            <h2>Recent items</h2>
            <Field label="Search projects">
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project name"
              />
            </Field>
            {filtered.length ? (
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((project) => (
                    <tr key={project.name}>
                      <td>{project.name}</td>
                      <td>{project.owner}</td>
                      <td>
                        <Badge>{project.status}</Badge>
                      </td>
                      <td>{project.progress}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <EmptyState
                title="No projects found"
                description="Try a different search term or clear the current filter."
              />
            )}
          </Card>
          <Card className="span-4">
            <h2>Task feed</h2>
            <div className="activity-feed">
              {activity.map(([title, time]) => (
                <div key={title} className="activity-item">
                  <strong>{title}</strong>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="span-12">
            <h2>Loading and error states</h2>
            <div className="grid">
              <Skeleton style={{ minHeight: "4rem" }} />
              <EmptyState
                title="Sync paused"
                description="Reconnect the source when you are ready to refresh activity."
              />
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
}
