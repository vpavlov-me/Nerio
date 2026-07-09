"use client";

import * as React from "react";
import { Search } from "@nerio/adapters";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Dialog,
  DropdownMenu,
  EmptyState,
  Field,
  FormMessage,
  IconButton,
  Input,
  KeyValue,
  Label,
  Popover,
  Progress,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Stat,
  Switch,
  Tabs,
  Table,
  Textarea,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio/ui";

const snippets: Record<string, string> = {
  button: "import { Button } from '@nerio/ui';\n\n<Button>Save project</Button>",
  "icon-button":
    "import { Search } from '@nerio/adapters';\nimport { IconButton } from '@nerio/ui';\n\n<IconButton icon={Search} label=\"Search\" />",
  badge: "import { Badge } from '@nerio/ui';\n\n<Badge variant=\"success\">Published</Badge>",
  spinner: "import { Spinner } from '@nerio/ui';\n\n<Spinner label=\"Loading activity\" />",
  skeleton: "import { Skeleton } from '@nerio/ui';\n\n<Skeleton aria-label=\"Loading\" />",
  "empty-state":
    'import { Button, EmptyState } from \'@nerio/ui\';\n\n<EmptyState title="No collections" description="Create one to start organizing work." action={<Button>Create collection</Button>} />',
  input:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name"><Input placeholder="Q3 planning" /></Field>',
  textarea:
    'import { Field, Textarea } from \'@nerio/ui\';\n\n<Field label="Notes"><Textarea placeholder="Add context" /></Field>',
  label:
    'import { Input, Label } from \'@nerio/ui\';\n\n<Label htmlFor="project-name">Project name</Label>\n<Input id="project-name" />',
  field:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name" message="Use at least 3 characters."><Input /></Field>',
  "form-message":
    "import { FormMessage } from '@nerio/ui';\n\n<FormMessage>Use at least 3 characters.</FormMessage>",
  checkbox: "import { Checkbox } from '@nerio/ui';\n\n<Checkbox aria-label=\"Include archived\" />",
  switch: "import { Switch } from '@nerio/ui';\n\n<Switch aria-label=\"Enable notifications\" />",
  dialog:
    'import { Dialog } from \'@nerio/ui\';\n\n<Dialog trigger="Open dialog" title="Share collection">...</Dialog>',
  select:
    "import { Select } from '@nerio/ui';\n\n<Select label=\"Status\" options={[{ label: 'Active', value: 'active' }]} />",
  toast:
    "import { Button, ToastProvider, ToastViewport, useToastManager } from '@nerio/ui';\n\nfunction Example() {\n  const toasts = useToastManager();\n  return <Button onClick={() => toasts.add({ title: \"Saved\" })}>Show toast</Button>;\n}\n\n<ToastProvider><Example /><ToastViewport /></ToastProvider>",
  tabs: 'import { Tabs } from \'@nerio/ui\';\n\n<Tabs tabs={[{ label: "Overview", value: "overview", content: "..." }]} />',
  tooltip:
    "import { Button, Tooltip } from '@nerio/ui';\n\n<Tooltip label=\"Copies the share link\"><Button>Copy link</Button></Tooltip>",
  popover:
    'import { Popover } from \'@nerio/ui\';\n\n<Popover trigger="Filters" title="View filters">...</Popover>',
  "dropdown-menu":
    'import { DropdownMenu } from \'@nerio/ui\';\n\n<DropdownMenu trigger="Actions" items={[{ label: "Rename" }]} />',
  card: "import { Card } from '@nerio/ui';\n\n<Card>Project summary</Card>",
  separator: "import { Separator } from '@nerio/ui';\n\n<Separator />",
  avatar: "import { Avatar } from '@nerio/ui';\n\n<Avatar name=\"Maya Chen\" />",
  progress: "import { Progress } from '@nerio/ui';\n\n<Progress label=\"Completion\" value={68} />",
  stat: 'import { Stat } from \'@nerio/ui\';\n\n<Stat label="Active projects" value="12" trend="+3 this week" />',
  "key-value":
    'import { KeyValue } from \'@nerio/ui\';\n\n<KeyValue label="Owner" value="Product team" />',
  table:
    "import { Table } from '@nerio/ui';\n\n<Table><thead><tr><th>Name</th></tr></thead><tbody><tr><td>Roadmap</td></tr></tbody></Table>",
};

export function StandardDocPage({
  title,
  lede,
  kind,
}: {
  title: string;
  lede: string;
  kind?: string;
}) {
  return (
    <article className="doc-page">
      <header>
        <h1>{title}</h1>
        <p className="doc-lede">{lede}</p>
      </header>
      {kind ? <Preview kind={kind} /> : null}
      <section className="doc-section">
        <h2>Anatomy</h2>
        <p>
          Components expose clear slots with `data-slot`, semantic tokens, visible focus states, and
          small composable APIs.
        </p>
      </section>
      <section className="doc-section">
        <h2>Variants and states</h2>
        <p>
          Use variants to express intent. Disabled, loading, empty, focus, selected, hover, and
          error states are part of the default contract.
        </p>
      </section>
      <section className="doc-section">
        <h2>Accessibility</h2>
        <p>
          Prefer semantic HTML, accessible names, keyboard-reachable controls, and tokenized
          contrast that remains stable across themes.
        </p>
      </section>
      <section className="doc-section">
        <h2>Do / do not</h2>
        <div className="grid">
          <Card>
            <Badge variant="success">Do</Badge>
            <p>Compose small components around real product workflows.</p>
          </Card>
          <Card>
            <Badge variant="danger">Do not</Badge>
            <p>
              Fork visual values into one-off colors, spacing, or typography inside product code.
            </p>
          </Card>
        </div>
      </section>
    </article>
  );
}

function Preview({ kind }: { kind: string }) {
  const [copied, setCopied] = React.useState(false);
  const snippet = snippets[kind] ?? "";

  const copySnippet = async () => {
    try {
      await navigator.clipboard?.writeText(snippet);
    } catch {
      // Clipboard can be blocked in automation or non-secure contexts.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="preview" aria-label={`${kind} preview`}>
      <div className="preview-row">
        {kind === "button" ? (
          <>
            <Button>Save project</Button>
            <Button variant="secondary">Preview</Button>
            <Button variant="ghost">Cancel</Button>
            <Button loading>Saving</Button>
          </>
        ) : null}
        {kind === "icon-button" ? <IconButton icon={Search} label="Search workspace" /> : null}
        {kind === "badge" ? (
          <>
            <Badge>Draft</Badge>
            <Badge variant="success">Published</Badge>
            <Badge variant="info">Shared</Badge>
            <Badge variant="danger">Blocked</Badge>
          </>
        ) : null}
        {kind === "spinner" ? <Spinner label="Loading activity" /> : null}
        {kind === "skeleton" ? (
          <div className="form-preview-stack" aria-label="Loading project summary">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : null}
        {kind === "empty-state" ? (
          <EmptyState
            title="No collections"
            description="Create a collection to organize projects, notes, and shared context."
            action={<Button size="sm">Create collection</Button>}
          />
        ) : null}
        {kind === "input" ? (
          <Field
            label="Collection name"
            description="Use a short name that your team will recognize."
          >
            <Input placeholder="Launch materials" />
          </Field>
        ) : null}
        {kind === "textarea" ? (
          <Field
            label="Notes"
            description="Add context that helps collaborators understand this item."
          >
            <Textarea placeholder="Add launch context, decisions, or open questions." />
          </Field>
        ) : null}
        {kind === "label" ? (
          <div className="form-preview-stack">
            <Label htmlFor="preview-project-name">Project name</Label>
            <Input id="preview-project-name" placeholder="Roadmap refresh" />
          </div>
        ) : null}
        {kind === "field" ? (
          <Field
            label="Project name"
            description="Names appear in navigation, tables, and activity."
            message="Use at least 3 characters."
          >
            <Input placeholder="Q3" />
          </Field>
        ) : null}
        {kind === "form-message" ? (
          <div className="form-preview-stack">
            <FormMessage>Use at least 3 characters.</FormMessage>
            <FormMessage tone="neutral">This will be visible to collaborators.</FormMessage>
            <FormMessage tone="success">Looks good.</FormMessage>
          </div>
        ) : null}
        {kind === "checkbox" ? (
          <label className="inline-control">
            <Checkbox defaultChecked />
            <span>Include archived collections</span>
          </label>
        ) : null}
        {kind === "switch" ? (
          <label className="inline-control">
            <Switch defaultChecked />
            <span>Notify collaborators</span>
          </label>
        ) : null}
        {kind === "dialog" ? (
          <Dialog
            trigger="Open dialog"
            title="Share collection"
            description="Choose how this collection should be shared."
          >
            <p>Choose collaborators and permissions before sharing this workspace collection.</p>
            <Button>Send invite</Button>
          </Dialog>
        ) : null}
        {kind === "select" ? (
          <Select
            label="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Draft", value: "draft" },
              { label: "Archived", value: "archived" },
            ]}
          />
        ) : null}
        {kind === "toast" ? (
          <ToastProvider>
            <ToastDemoButton />
            <ToastViewport />
          </ToastProvider>
        ) : null}
        {kind === "tabs" ? (
          <Tabs
            tabs={[
              {
                label: "Overview",
                value: "overview",
                content: "Recent activity, ownership, and status are grouped here.",
              },
              {
                label: "Files",
                value: "files",
                content: "Documents, assets, and supporting material stay in this panel.",
              },
              {
                label: "Settings",
                value: "settings",
                content: "Permissions and workflow preferences are edited here.",
              },
            ]}
          />
        ) : null}
        {kind === "tooltip" ? (
          <Tooltip label="Copies the share link to your clipboard.">
            <Button variant="secondary">Copy link</Button>
          </Tooltip>
        ) : null}
        {kind === "popover" ? (
          <Popover
            trigger="Filters"
            title="View filters"
            description="Refine the workspace list without leaving the page."
          >
            <Button size="sm">Apply filters</Button>
          </Popover>
        ) : null}
        {kind === "dropdown-menu" ? (
          <DropdownMenu
            trigger="Actions"
            items={[
              { label: "Rename" },
              { label: "Duplicate" },
              { label: "Archive", destructive: true },
            ]}
          />
        ) : null}
        {kind === "card" ? (
          <Card className="preview-card">
            <Badge variant="info">Active</Badge>
            <strong>Launch workspace</strong>
            <p>Plan assets, owners, and milestones in one focused surface.</p>
          </Card>
        ) : null}
        {kind === "separator" ? (
          <div className="form-preview-stack">
            <span>Overview</span>
            <Separator />
            <span>Activity</span>
          </div>
        ) : null}
        {kind === "avatar" ? (
          <>
            <Avatar name="Maya Chen" />
            <Avatar name="Nerio Team" />
            <Avatar name="Alex Rivera" />
          </>
        ) : null}
        {kind === "progress" ? (
          <div className="form-preview-stack">
            <Progress label="Collection completion" value={68} />
          </div>
        ) : null}
        {kind === "stat" ? (
          <>
            <Stat label="Active projects" value="12" trend="+3 this week" />
            <Stat label="Open tasks" value="34" trend="8 due today" />
          </>
        ) : null}
        {kind === "key-value" ? (
          <dl className="preview-key-values">
            <KeyValue label="Owner" value="Product team" />
            <KeyValue label="Updated" value="Today" />
            <KeyValue label="Status" value={<Badge variant="success">Ready</Badge>} />
          </dl>
        ) : null}
        {kind === "table" ? (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Roadmap refresh</td>
                <td>Active</td>
                <td>Maya</td>
              </tr>
              <tr>
                <td>Content audit</td>
                <td>Draft</td>
                <td>Alex</td>
              </tr>
            </tbody>
          </Table>
        ) : null}
      </div>
      <div className="preview-row">
        <Button variant="secondary" size="sm" onClick={copySnippet}>
          {copied ? "Copied" : "Copy code"}
        </Button>
      </div>
      <pre className="code-block">
        <code>{snippet}</code>
      </pre>
    </section>
  );
}

function ToastDemoButton() {
  const toast = useToastManager();

  return (
    <Button
      onClick={() =>
        toast.add({
          title: "Collection saved",
          description: "The update is visible to your team.",
          data: { tone: "success" },
        })
      }
    >
      Show toast
    </Button>
  );
}
