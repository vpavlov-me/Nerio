"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Circle, X } from "@nerio-ui/adapters/icons";
import { getRegistryItem } from "@nerio-ui/registry";
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
  DialogFooter,
  Sheet,
  SheetBody,
  SheetClose,
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
  FileInput,
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
} from "@nerio-ui/ui/client";
import { CodeExample } from "./code-example";
import { DocumentationTable } from "./documentation-table";
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
  const packageImports = usage
    ?.split("\n")
    .filter((line) => line.startsWith("import "))
    .join("\n");
  const installation = kind
    ? [`pnpm dlx nerio add ${kind}`, packageImports].filter(Boolean).join("\n\n")
    : undefined;

  return (
    <article className="doc-page">
      <header>
        <h1>{title}</h1>
        <p className="doc-lede">{lede}</p>
      </header>
      <section className="doc-section">
        <h2 id="overview">Overview and decision boundary</h2>
        <p>{reference?.purpose ?? lede}</p>
        {reference?.guidance.dont[0] ? (
          <p className="doc-decision-boundary">{reference.guidance.dont[0]}</p>
        ) : null}
      </section>
      {preview ?? (kind ? <Preview kind={kind} /> : null)}
      {installation ? (
        <section className="doc-section">
          <h2 id="installation">Installation and imports</h2>
          <p>
            Install the editable registry source, or use the matching package entrypoint when the
            product keeps Nerio as a workspace dependency.
          </p>
          <CodeExample code={installation} label={`${title} installation and import`} />
        </section>
      ) : null}
      <section className="doc-section">
        <h2 id="usage">Usage</h2>
        {sectionPreviews?.usage}
        {usage ? <CodeExample code={usage} label={`${title} usage`} /> : null}
      </section>
      <section className="doc-section">
        <h2 id="variants">Variants</h2>
        {sectionPreviews?.variants}
        {sectionContent?.variants ?? <ReferenceTable firstColumn="Variant" items={variants} />}
      </section>
      <section className="doc-section">
        <h2 id="anatomy">Anatomy</h2>
        {sectionPreviews?.anatomy}
        {sectionContent?.anatomy ?? <ReferenceTable firstColumn="Slot" items={anatomy} />}
      </section>
      <section className="doc-section">
        <h2 id="states">States</h2>
        {sectionPreviews?.states}
        {sectionContent?.states ?? (
          <ReferenceTable
            firstColumn="State"
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
          <ReferenceTable
            firstColumn="Prop"
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
            <DocumentationTable
              headers={["Contract", "Value"]}
              rows={[
                [
                  "Registry item",
                  `${registryItem.name} installs ${registryItem.files.length} source file${registryItem.files.length === 1 ? "" : "s"} into the configured components directory.`,
                ],
                [
                  "Base UI",
                  registryItem.baseUiPrimitives.length
                    ? registryItem.baseUiPrimitives.join(", ")
                    : "No interactive primitive required.",
                ],
                [
                  "Registry dependencies",
                  registryItem.registryDependencies.length
                    ? registryItem.registryDependencies.join(", ")
                    : "None.",
                ],
                [
                  "Package dependencies",
                  registryItem.dependencies.length
                    ? registryItem.dependencies.join(", ")
                    : "No external package dependency.",
                ],
              ]}
              codeColumns={1}
            />
          )}
        </section>
      ) : null}
      <section className="doc-section">
        <h2 id="styling-contract">Styling contract</h2>
        <DocumentationTable
          headers={["Contract", "Value"]}
          rows={[
            [
              "Authoring",
              "Complete, statically detectable Tailwind CSS v4 recipes own component visuals.",
            ],
            [
              "Values",
              "Semantic and component --n-* variables remain the canonical customization layer.",
            ],
            [
              "Overrides",
              "Customizable slots merge consumer className values with tailwindCn so conflicting utilities resolve deterministically.",
            ],
            [
              "Residual CSS",
              "Only shared keyframes and scoped no-Preflight compatibility rules remain; there is no parallel visual selector layer.",
            ],
          ]}
        />
      </section>
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
          <div className="doc-guidance-cards">
            <GuidanceCard
              icon={Check}
              title="Do"
              items={
                reference?.guidance.do ?? [
                  "Compose small components around real product workflows.",
                ]
              }
            />
            <GuidanceCard
              icon={X}
              title="Do not"
              items={
                reference?.guidance.dont ?? [
                  "Fork visual values into one-off colors, spacing, or typography inside product code.",
                ]
              }
            />
          </div>
        )}
      </section>
      <section className="doc-section">
        <h2 id="related-components">Related components</h2>
        {sectionContent?.related ?? (
          <div className="doc-related-cards">
            {(reference?.related ?? metadata?.related ?? ["Tokens"]).map((item) => {
              const related = getRelatedComponent(item);

              return (
                <Card
                  key={item}
                  className="doc-related-card"
                  href={related.href}
                  variant="secondary"
                >
                  <CardHeader>
                    <CardTitle>{item}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{related.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
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
            <DocumentationTable
              headers={["Token", "Purpose"]}
              rows={tokens.map((token) => [
                token,
                "Public customization point for this component contract.",
              ])}
              codeColumns={1}
            />
          </>
        )}
      </section>
    </article>
  );
}

function ReferenceTable({
  firstColumn,
  items,
}: {
  firstColumn: string;
  items: ReferenceSection[];
}) {
  return (
    <DocumentationTable
      headers={[firstColumn, "Purpose"]}
      rows={items.map((item) => [item.title, item.description])}
      codeColumns={1}
    />
  );
}

function GuidanceCard({
  icon,
  title,
  items,
}: {
  icon: React.ComponentProps<typeof Icon>["icon"];
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <Icon icon={icon} />
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item) => (
          <p key={item}>{item}</p>
        ))}
      </CardContent>
    </Card>
  );
}

const relatedRouteAliases: Record<string, string> = {
  "Command Primitive": "command-primitive",
  "Empty State": "empty-state",
  "Sidebar Primitive": "sidebar-primitive",
};

const relatedFoundationRoutes: Record<string, string> = {
  Heading: "/docs/foundations/typography",
  "Icon Adapter": "/docs/foundations/icons",
  Text: "/docs/foundations/typography",
  Themes: "/docs/foundations/themes",
  Tokens: "/docs/foundations/tokens",
};

function getRelatedComponent(name: string) {
  const foundationHref = relatedFoundationRoutes[name];
  const alias = relatedRouteAliases[name];

  if (foundationHref) {
    return {
      href: foundationHref,
      description: `Customize ${name.toLowerCase()} through the shared Nerio foundation.`,
    };
  }

  const slug =
    alias ??
    name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  const relatedReference = componentReference[slug];
  const relatedMetadata = componentMetadata[slug];

  return {
    href: `/docs/components/${slug}`,
    description:
      relatedReference?.purpose ??
      relatedMetadata?.description ??
      `Use ${name} alongside this component when the product context calls for it.`,
  };
}

function Preview({ kind }: { kind: string }) {
  const snippet = snippets[kind] ?? "";

  return (
    <section className="component-example" aria-label={`${kind} preview`}>
      <h2 id="preview">Preview</h2>
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
          {kind === "kbd" ? (
            <>
              <Kbd>Esc</Kbd>
              <Kbd>⌘K</Kbd>
              <Kbd>⇧⌘P</Kbd>
              <Kbd>⌥←</Kbd>
              <Kbd>⌘↵</Kbd>
            </>
          ) : null}
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
          {kind === "file-input" ? (
            <form className="form-preview-stack" aria-label="Native file input examples">
              <Field label="Attachments" description="Choose PDF or image files.">
                <FileInput
                  name="attachments"
                  accept=".pdf,image/*"
                  capture="environment"
                  multiple
                  required
                />
              </Field>
              <Field label="Unavailable attachment">
                <FileInput disabled />
              </Field>
            </form>
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
              <DialogFooter>
                <Button>Send invite</Button>
              </DialogFooter>
            </Dialog>
          ) : null}
          {kind === "sheet" ? (
            <>
              <Sheet>
                <SheetTrigger render={<Button variant="secondary">Open settings</Button>} />
                <SheetContent side="right" size="md" showClose={false}>
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
                    <SheetClose render={<Button variant="secondary">Cancel</Button>} />
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
                <SheetContent side="top" size="lg">
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
                description="Standalone feedback without managed positioning."
              />
              <ToastDemoButton />
              <ToastViewport swipeDirection={["left", "right", "up", "down"]} />
            </ToastProvider>
          ) : null}
          {kind === "tabs" ? (
            <Tabs defaultValue="overview" variant="segmented">
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
              <AvatarImagePreview />
              <Avatar name="Nerio Team" />
              <Avatar name="Alex Rivera" src="/missing-avatar.png" />
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
            <TableContainer aria-label="Projects">
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
            <div className="form-preview-stack">
              <List
                items={[
                  {
                    id: "tokens",
                    title: "Tokens",
                    description: "CSS variable foundation for themes, modes, and density.",
                    href: "/docs/foundations/tokens",
                    render: <Link href="#" />,
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
              <List
                aria-label="Setup order"
                ordered
                items={[
                  { id: "install", title: "Install tokens" },
                  { id: "source", title: "Register Tailwind source" },
                ]}
              />
            </div>
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
            <div className="form-preview-stack">
              <Pagination
                previousHref="/docs/components/breadcrumbs"
                nextHref="/docs/components/list"
                pages={[
                  { key: "1", label: "1", href: "/docs/components/breadcrumbs" },
                  {
                    key: "2",
                    label: "2",
                    href: "/docs/components/pagination",
                    current: true,
                    render: <Link href="#" />,
                  },
                  { key: "3", label: "3", href: "/docs/components/list" },
                ]}
              />
              <div dir="rtl">
                <Pagination
                  aria-label="RTL pagination"
                  pages={[
                    { key: "1", label: "1", href: "/docs/page/1", current: true },
                    { key: "2", label: "2", href: "/docs/page/2" },
                    { key: "ellipsis", type: "ellipsis" },
                    { key: "12", label: "12", href: "/docs/page/12" },
                  ]}
                />
              </div>
            </div>
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

const avatarImageSrc =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='48' viewBox='0 0 96 48'%3E%3Crect width='96' height='48' fill='%236d5bd0'/%3E%3Ccircle cx='48' cy='24' r='14' fill='white'/%3E%3C/svg%3E";

function AvatarImagePreview() {
  const [src, setSrc] = React.useState("/missing-avatar.png");

  return (
    <div className="form-preview-stack">
      <Avatar name="Maya Chen" src={src} />
      <Button size="sm" variant="secondary" onClick={() => setSrc(avatarImageSrc)}>
        Load replacement avatar
      </Button>
    </div>
  );
}

function ToastDemoButton() {
  const toast = useToastManager();

  return (
    <>
      <Button
        onClick={() => {
          ["Draft saved", "Link copied", "Invite sent"].forEach((title, index) => {
            toast.add({
              id: `toast-stack-${index}`,
              title,
              description: "This managed stack keeps newest feedback first.",
              data: { tone: index === 0 ? "success" : "neutral" },
            });
          });
        }}
      >
        Stack notifications
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            id: "toast-persistent",
            title: "Export is ready",
            description:
              "The export includes every selected workspace, translated field label, and collaborator note, so it stays available until dismissed.",
            timeout: 0,
            data: {
              tone: "success",
              action: { label: "Open", onClick: () => undefined },
            },
          })
        }
      >
        Persistent action
      </Button>
      <Button
        variant="secondary"
        onClick={() =>
          toast.add({
            id: "toast-urgent",
            title: "Sync failed",
            description: "Keep the inline error visible until the issue is resolved.",
            priority: "high",
            data: { tone: "danger" },
          })
        }
      >
        Urgent failure
      </Button>
    </>
  );
}
