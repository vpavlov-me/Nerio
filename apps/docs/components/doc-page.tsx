"use client";

import * as React from "react";
import { Search } from "@nerio/adapters";
import { getRegistryItem } from "@nerio/registry";
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
import { CodeExample } from "./code-example";
import {
  anatomyFromSlots,
  componentReference,
  sharedTokens,
  snippets,
  variantsFromRegistry,
} from "./component-reference";
import type { ReferenceSection } from "./component-reference";
export function StandardDocPage({
  title,
  lede,
  kind,
}: {
  title: string;
  lede: string;
  kind?: string;
}) {
  const reference = kind ? componentReference[kind] : undefined;
  const registryItem = kind ? getRegistryItem(kind) : undefined;
  const usage = kind ? snippets[kind] : undefined;
  const fallbackAnatomy = reference?.anatomy ?? [
    {
      title: "root",
      description:
        "Component root with data-slot attributes, semantic tokens, and visible focus states.",
    },
  ];
  const fallbackVariants = reference?.variants ?? [
    {
      title: "Default",
      description: "Default variant uses semantic tokens and adapts across themes.",
    },
  ];
  const anatomy = anatomyFromSlots(registryItem?.slots ?? [], fallbackAnatomy);
  const variants = variantsFromRegistry(registryItem?.variants ?? [], fallbackVariants);
  const accessibility = registryItem?.accessibility ?? reference?.accessibility;
  const tokens = registryItem?.requiredTokens ?? reference?.tokens ?? sharedTokens;

  return (
    <article className="doc-page">
      <header>
        {reference ? <p className="doc-kicker">{reference.category}</p> : null}
        <h1>{title}</h1>
        <p className="doc-lede">{lede}</p>
      </header>
      {kind ? <Preview kind={kind} /> : null}
      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        {usage ? <CodeExample code={usage} label={`${title} usage`} /> : null}
      </section>
      <section className="doc-section">
        <h2 id="purpose">Purpose</h2>
        <p>
          {reference?.purpose ??
            "Use this component as a token-driven Nerio building block inside product workflows."}
        </p>
      </section>
      {registryItem ? (
        <section className="doc-section">
          <h2 id="implementation-contract">Implementation contract</h2>
          <div className="reference-grid">
            <div>
              <code>Registry item</code>
              <p>
                {registryItem.name} installs {registryItem.files.length} source file
                {registryItem.files.length === 1 ? "" : "s"} into the configured components
                directory.
              </p>
            </div>
            <div>
              <code>Base UI</code>
              <p>
                {registryItem.baseUiPrimitives.length
                  ? registryItem.baseUiPrimitives.join(", ")
                  : "No interactive primitive required."}
              </p>
            </div>
            <div>
              <code>Registry dependencies</code>
              <p>
                {registryItem.registryDependencies.length
                  ? registryItem.registryDependencies.join(", ")
                  : "None."}
              </p>
            </div>
            <div>
              <code>Package dependencies</code>
              <p>
                {registryItem.dependencies.length
                  ? registryItem.dependencies.join(", ")
                  : "No external package dependency."}
              </p>
            </div>
          </div>
        </section>
      ) : null}
      <section className="doc-section">
        <h2 id="anatomy">Anatomy</h2>
        <ReferenceGrid items={anatomy} />
      </section>
      <section className="doc-section">
        <h2 id="variants">Variants</h2>
        <ReferenceGrid items={variants} />
      </section>
      <section className="doc-section">
        <h2 id="states">States</h2>
        <ReferenceGrid
          items={
            reference?.states ?? [
              {
                title: "Default",
                description:
                  "Default, hover, focus, disabled, and error states follow Nerio tokens.",
              },
            ]
          }
        />
      </section>
      <section className="doc-section">
        <h2 id="accessibility">Accessibility</h2>
        <ul className="doc-list">
          {(
            accessibility ?? [
              "Prefer semantic HTML, accessible names, keyboard-reachable controls, and tokenized contrast that remains stable across themes.",
            ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        <div className="guidance-grid">
          <div data-tone="positive">
            <strong>Do</strong>
            {(
              reference?.guidance.do ?? ["Compose small components around real product workflows."]
            ).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
          <div data-tone="negative">
            <strong>Do not</strong>
            {(
              reference?.guidance.dont ?? [
                "Fork visual values into one-off colors, spacing, or typography inside product code.",
              ]
            ).map((item) => (
              <p key={item}>{item}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="doc-section">
        <h2 id="tokens">Tokens</h2>
        <p>
          These are the primary customization points. Override semantic or component tokens instead
          of changing component source.
        </p>
        <div className="token-chip-row">
          {tokens.map((token) => (
            <code key={token}>{token}</code>
          ))}
        </div>
      </section>
    </article>
  );
}

function ReferenceGrid({ items }: { items: ReferenceSection[] }) {
  return (
    <div className="reference-grid">
      {items.map((item) => (
        <div key={item.title}>
          <code>{item.title}</code>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
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
