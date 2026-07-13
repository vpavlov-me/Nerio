"use client";

import * as React from "react";
import { Circle } from "@nerio/adapters";
import { getRegistryItem } from "@nerio/registry";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardVisual,
  Checkbox,
  Code,
  Dialog,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  DropdownMenu,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Field,
  FormGroup,
  FormMessage,
  Heading,
  Input,
  Icon,
  KeyValue,
  Kbd,
  Label,
  LabelContent,
  LabelHint,
  LabelRequired,
  LabelRow,
  List,
  Pagination,
  Popover,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Stat,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Text,
  Textarea,
  Toast,
  ToastProvider,
  ToastViewport,
  Tooltip,
  useToastManager,
} from "@nerio/ui/client";
import { CodeExample } from "./code-example";
import {
  anatomyFromSlots,
  componentMetadata,
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
  preview,
  sectionPreviews,
  sectionContent,
}: {
  title: string;
  lede: string;
  kind?: string;
  preview?: React.ReactNode;
  sectionPreviews?: Partial<Record<string, React.ReactNode>>;
  sectionContent?: Partial<
    Record<
      | "variants"
      | "anatomy"
      | "states"
      | "api"
      | "implementation"
      | "guidance"
      | "related"
      | "tokens",
      React.ReactNode
    >
  >;
}) {
  const reference = kind ? componentReference[kind] : undefined;
  const metadata = kind ? componentMetadata[kind] : undefined;
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
        <h1>{title}</h1>
        <p className="doc-lede">{lede}</p>
      </header>
      {preview ?? (kind ? <Preview kind={kind} /> : null)}
      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        {sectionPreviews?.usage}
        {usage ? <CodeExample code={usage} label={`${title} usage`} /> : null}
      </section>
      <section className="doc-section">
        <h2 id="variants">Variants</h2>
        {sectionPreviews?.variants}
        {sectionContent?.variants ?? <ReferenceGrid items={variants} />}
      </section>
      <section className="doc-section">
        <h2 id="anatomy">Anatomy</h2>
        {sectionPreviews?.anatomy}
        {sectionContent?.anatomy ?? <ReferenceGrid items={anatomy} />}
      </section>
      <section className="doc-section">
        <h2 id="states">States</h2>
        {sectionPreviews?.states}
        {sectionContent?.states ?? (
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
        )}
      </section>
      <section className="doc-section">
        <h2 id="motion">Motion</h2>
        {sectionPreviews?.motion}
        <ul className="doc-list">
          {(
            reference?.motion ??
            metadata?.motion ?? [
              "State changes should use shared motion tokens and preserve reduced-motion behavior.",
            ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="doc-section">
        <h2 id="accessibility">Accessibility</h2>
        {sectionPreviews?.accessibility}
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
        <h2 id="api">API</h2>
        {sectionPreviews?.api}
        {sectionContent?.api ?? (
          <ReferenceGrid
            items={
              reference?.api ?? [
                {
                  title: "className",
                  description:
                    "Extends the component root while preserving Nerio tokenized defaults.",
                },
              ]
            }
          />
        )}
      </section>
      {registryItem ? (
        <section className="doc-section">
          <h2 id="implementation-contract">Implementation contract</h2>
          {sectionContent?.implementation ?? (
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
          )}
        </section>
      ) : null}
      <section className="doc-section">
        <h2 id="design-notes">Design notes</h2>
        <ul className="doc-list">
          {(
            reference?.designNotes ?? [
              reference?.purpose ??
                "Use this component as a token-driven Nerio building block inside product workflows.",
            ]
          ).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="doc-section">
        <h2 id="do-do-not">Do / do not</h2>
        {sectionContent?.guidance ?? (
          <div className="guidance-grid">
            <div data-tone="positive">
              <strong>Do</strong>
              {(
                reference?.guidance.do ?? [
                  "Compose small components around real product workflows.",
                ]
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
        )}
      </section>
      <section className="doc-section">
        <h2 id="related-components">Related components</h2>
        {sectionContent?.related ?? (
          <div className="token-chip-row">
            {(reference?.related ?? metadata?.related ?? ["Tokens"]).map((item) => (
              <code key={item}>{item}</code>
            ))}
          </div>
        )}
      </section>
      <section className="doc-section">
        <h2 id="tokens">Tokens</h2>
        {sectionContent?.tokens ?? (
          <>
            <p>
              These are the primary customization points. Override semantic or component tokens
              instead of changing component source.
            </p>
            <div className="token-chip-row">
              {tokens.map((token) => (
                <code key={token}>{token}</code>
              ))}
            </div>
          </>
        )}
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
  const snippet = snippets[kind] ?? "";

  return (
    <section id="preview" className="component-example" aria-label={`${kind} preview`}>
      <div className="component-example__preview">
        <div className="preview-row">
          {kind === "button" ? (
            <>
              <Button>Save project</Button>
              <Button variant="secondary">Preview</Button>
              <Button variant="ghost">Cancel</Button>
              <Button loading>Saving</Button>
            </>
          ) : null}
          {kind === "button-group" ? (
            <ButtonGroup aria-label="Document actions">
              <Button variant="secondary">Cancel</Button>
              <Button variant="secondary">Save</Button>
            </ButtonGroup>
          ) : null}
          {kind === "typography" ? (
            <div className="preview-card">
              <Heading as="h2" size="lg">
                Workspace settings
              </Heading>
              <Text tone="secondary">Changes apply to every member.</Text>
              <Text>
                Install with <Code>nerio add typography</Code>.
              </Text>
            </div>
          ) : null}
          {kind === "kbd" ? <Kbd>⌘S</Kbd> : null}
          {kind === "badge" ? (
            <>
              <Badge>Draft</Badge>
              <Badge tone="primary-soft">Core</Badge>
              <Badge tone="info">Shared</Badge>
              <Badge tone="success">Published</Badge>
              <Badge tone="warning">Review</Badge>
              <Badge tone="danger">Blocked</Badge>
            </>
          ) : null}
          {kind === "spinner" ? (
            <>
              <Spinner label="Loading activity" />
              <Button loading>Saving</Button>
            </>
          ) : null}
          {kind === "skeleton" ? (
            <div className="form-preview-stack" aria-label="Loading project summary">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ) : null}
          {kind === "empty-state" ? (
            <EmptyState>
              <EmptyStateMedia aria-hidden="true">○</EmptyStateMedia>
              <EmptyStateHeader>
                <EmptyStateTitle>No collections</EmptyStateTitle>
                <EmptyStateDescription>
                  Create a collection to organize projects, notes, and shared context.
                </EmptyStateDescription>
              </EmptyStateHeader>
              <EmptyStateActions>
                <Button size="sm">Create collection</Button>
              </EmptyStateActions>
            </EmptyState>
          ) : null}
          {kind === "alert" ? (
            <Alert tone="info" title="Invite sent" icon={Circle}>
              Collaborators will receive an email shortly.
            </Alert>
          ) : null}
          {kind === "input" ? (
            <div className="form-preview-stack">
              <Field
                label="Collection name"
                description="Use a short name that your team will recognize."
              >
                <Input placeholder="Launch materials" required />
              </Field>
              <Field label="Disabled input" description="Shown when editing is unavailable.">
                <Input placeholder="Archived collection" disabled />
              </Field>
            </div>
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
              <LabelRow>
                <LabelContent>
                  <Label htmlFor="preview-project-name">Project name</Label>
                  <LabelRequired />
                  <LabelHint label="Choose a recognizable name for collaborators." />
                </LabelContent>
              </LabelRow>
              <Input id="preview-project-name" placeholder="Roadmap refresh" readOnly required />
            </div>
          ) : null}
          {kind === "field" ? (
            <div className="form-preview-stack">
              <Field
                label="Project name"
                description="Names appear in navigation, tables, and activity."
                message="Use a clear internal name."
              >
                <Input placeholder="Launch workspace" />
              </Field>
              <Field label="Short code" message="Use at least 3 characters." invalid>
                <Input placeholder="Q3" />
              </Field>
            </div>
          ) : null}
          {kind === "form-message" ? (
            <div className="form-preview-stack">
              <FormMessage>Use at least 3 characters.</FormMessage>
              <FormMessage tone="neutral">This will be visible to collaborators.</FormMessage>
              <FormMessage tone="success">Looks good.</FormMessage>
            </div>
          ) : null}
          {kind === "form-group" ? (
            <FormGroup
              title="Notifications"
              description="Choose which updates should be sent by email."
            >
              <Field label="Product updates">
                <Checkbox aria-label="Product updates" />
              </Field>
              <Field label="Security alerts">
                <Checkbox aria-label="Security alerts" defaultChecked />
              </Field>
            </FormGroup>
          ) : null}
          {kind === "checkbox" ? (
            <div className="form-preview-stack">
              <label className="inline-control">
                <Checkbox defaultChecked />
                <span>Include archived collections</span>
              </label>
              <label className="inline-control">
                <Checkbox indeterminate />
                <span>Some collections are archived</span>
              </label>
              <label className="inline-control">
                <Checkbox disabled />
                <span>Archived collections are unavailable</span>
              </label>
            </div>
          ) : null}
          {kind === "radio-group" ? (
            <RadioGroup
              label="Visibility"
              description="Choose who can access this project."
              message="Select the visibility that matches the project."
              name="visibility-preview"
              defaultValue="team"
            >
              <RadioGroupItem value="private" description="Only invited members.">
                Private
              </RadioGroupItem>
              <RadioGroupItem value="team" description="Visible to the workspace.">
                Team
              </RadioGroupItem>
              <RadioGroupItem value="public" disabled description="Not available.">
                Public
              </RadioGroupItem>
            </RadioGroup>
          ) : null}
          {kind === "switch" ? (
            <div className="form-preview-stack">
              <label className="inline-control">
                <Switch defaultChecked />
                <span>Notify collaborators</span>
              </label>
              <label className="inline-control">
                <Switch readOnly />
                <span>Automatic updates are managed by your workspace</span>
              </label>
            </div>
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
          {kind === "sheet" ? (
            <>
              <Sheet>
                <SheetTrigger render={<Button variant="secondary">Open settings</Button>} />
                <SheetContent side="right" size="md">
                  <SheetHeader>
                    <SheetTitle>Workspace settings</SheetTitle>
                    <SheetDescription>Configure shared workspace defaults.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <p>
                      Choose how this workspace handles member notifications and shared preferences.
                    </p>
                  </SheetBody>
                  <SheetFooter>
                    <Button>Save changes</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger
                  render={<Button variant="secondary">Open mobile navigation</Button>}
                />
                <SheetContent side="left" size="sm">
                  <SheetHeader>
                    <SheetTitle>Workspace navigation</SheetTitle>
                    <SheetDescription>Choose a destination in this product.</SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <Button variant="ghost">Projects</Button>
                    <Button variant="ghost">Activity</Button>
                  </SheetBody>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger render={<Button variant="secondary">Open filters</Button>} />
                <SheetContent side="top" size="sm">
                  <SheetHeader>
                    <SheetTitle>View filters</SheetTitle>
                    <SheetDescription>
                      Refine the current list in the consumer application.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <p>Filter controls remain application-owned composition.</p>
                  </SheetBody>
                </SheetContent>
              </Sheet>
              <Sheet>
                <SheetTrigger render={<Button variant="secondary">Open details</Button>} />
                <SheetContent side="bottom" size="sm">
                  <SheetHeader>
                    <SheetTitle>Collection details</SheetTitle>
                    <SheetDescription>
                      Review contextual information without leaving the page.
                    </SheetDescription>
                  </SheetHeader>
                  <SheetBody>
                    <p>Contextual detail content remains owned by the consuming product.</p>
                  </SheetBody>
                </SheetContent>
              </Sheet>
            </>
          ) : null}
          {kind === "select" ? (
            <div className="form-preview-stack">
              <Select
                label="Status"
                placeholder="Choose status"
                message="Choose the closest workflow state."
                options={[
                  { label: "Draft", value: "draft" },
                  { label: "In review", value: "review" },
                  { label: "Published", value: "published" },
                  { label: "Archived", value: "archived", disabled: true },
                ]}
              />
              <Select
                label="Disabled select"
                placeholder="Unavailable"
                disabled
                options={[{ label: "Active", value: "active" }]}
              />
            </div>
          ) : null}
          {kind === "toast" ? (
            <ToastProvider>
              <Toast
                title="Static toast presentation"
                description="This standalone layout does not inherit manager positioning, actions, or dismissal behavior."
              />
              <ToastDemoButton />
              <ToastViewport />
            </ToastProvider>
          ) : null}
          {kind === "tabs" ? (
            <Tabs defaultValue="overview">
              <TabsList aria-label="Workspace sections">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger disabled value="archive">
                  Archive
                </TabsTrigger>
                <TabsIndicator />
              </TabsList>
              <TabsPanels>
                <TabsContent value="overview">
                  Recent activity, ownership, and status are grouped here.
                </TabsContent>
                <TabsContent value="files">
                  Documents, assets, and supporting material stay in this panel.
                </TabsContent>
                <TabsContent value="settings">
                  Permissions and workflow preferences are edited here.
                </TabsContent>
                <TabsContent value="archive">
                  Archived content is unavailable in this preview.
                </TabsContent>
              </TabsPanels>
            </Tabs>
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
                { label: "Duplicate", disabled: true },
                { label: "Archive", destructive: true },
              ]}
            />
          ) : null}
          {kind === "card" ? (
            <div className="preview-card-grid">
              <Card className="preview-card">
                <CardVisual>
                  <Icon icon={Circle} />
                </CardVisual>
                <CardHeader>
                  <div>
                    <CardTitle>Launch workspace</CardTitle>
                    <CardDescription>Assets, owners, and milestones.</CardDescription>
                  </div>
                  <CardAction>
                    <Badge variant="info">Active</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>12 active tasks across three owners.</CardContent>
              </Card>
              <Card className="preview-card">
                <CardVisual placement="bleed" className="preview-card-visual">
                  Product update
                </CardVisual>
                <CardHeader>
                  <CardTitle>Weekly report</CardTitle>
                  <CardDescription>Shared with the workspace.</CardDescription>
                </CardHeader>
              </Card>
              <Card href="/docs/components/card" className="preview-card" variant="secondary">
                <CardHeader>
                  <CardTitle>Card guidance</CardTitle>
                  <CardDescription>One clear destination.</CardDescription>
                </CardHeader>
              </Card>
            </div>
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
            <TableContainer label="Projects">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Roadmap refresh</TableCell>
                    <TableCell>Active</TableCell>
                    <TableCell>Maya</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Content audit</TableCell>
                    <TableCell>Draft</TableCell>
                    <TableCell>Alex</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
          {kind === "list" ? (
            <List
              items={[
                {
                  id: "tokens",
                  title: "Tokens",
                  description: "CSS variable foundation for themes, modes, and density.",
                  href: "/docs/foundations/tokens",
                  meta: "Foundation",
                },
                {
                  id: "components",
                  title: "Components",
                  description: "Composable Core primitives installed as source.",
                  href: "/docs/components/button",
                  meta: "Core",
                },
              ]}
            />
          ) : null}
          {kind === "breadcrumbs" ? (
            <Breadcrumbs
              items={[
                { label: "Docs", href: "/docs" },
                { label: "Components", href: "/docs/components/button" },
                { label: "Button" },
              ]}
            />
          ) : null}
          {kind === "pagination" ? (
            <Pagination
              previousHref="/docs/components/breadcrumbs"
              nextHref="/docs/components/list"
              pages={[
                { key: "1", label: "1", href: "/docs/components/breadcrumbs" },
                { key: "2", label: "2", href: "/docs/components/pagination", current: true },
                { key: "3", label: "3", href: "/docs/components/list" },
              ]}
            />
          ) : null}
        </div>
      </div>
      <CodeExample
        className="component-example__code"
        code={snippet}
        label={`${kind} preview code`}
      />
    </section>
  );
}

function ToastDemoButton() {
  const toast = useToastManager();

  return (
    <>
      <Button
        onClick={() =>
          toast.add({
            title: "Collection saved",
            description: "The update is visible to your team.",
            data: { tone: "success" },
          })
        }
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            title: "Sync failed",
            description: "Keep the inline error visible until the issue is resolved.",
            data: { tone: "danger" },
          })
        }
      >
        Danger toast
      </Button>
    </>
  );
}
