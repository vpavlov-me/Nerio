export type ReferenceSection = {
  title: string;
  description: string;
};

export type ComponentReference = {
  category: string;
  purpose: string;
  anatomy: ReferenceSection[];
  variants: ReferenceSection[];
  states: ReferenceSection[];
  motion?: string[];
  accessibility: string[];
  api?: ReferenceSection[];
  designNotes?: string[];
  related?: string[];
  guidance: {
    do: string[];
    dont: string[];
  };
  tokens: string[];
};

export type ComponentStatus = "stable" | "beta" | "experimental";
export type ComponentLayer = "core" | "pro";

export type ComponentMetadata = {
  name: string;
  description: string;
  status: ComponentStatus;
  layer: ComponentLayer;
  category: string;
  package?: string;
  importPath?: string;
  related?: string[];
  anatomy?: string[];
  motion?: string[];
  accessibility?: string[];
};

export const snippets: Record<string, string> = {
  typography:
    'import { Code, Heading, Text } from \'@nerio/ui\';\n\n<Heading as="h2" size="lg">Workspace settings</Heading>\n<Text tone="secondary">Changes apply to every member.</Text>\n<Code>nerio add typography</Code>',
  button:
    'import { Save, Settings } from \'@nerio/adapters/icons\';\nimport { Badge, Kbd } from \'@nerio/ui\';\nimport { Button } from \'@nerio/ui/client\';\n\n<Button leadingIcon={Save} badge={<Badge size="sm" tone="info">24</Badge>} kbd={<Kbd>⌘S</Kbd>}>Save project</Button>\n<Button icon={Settings} aria-label="Workspace settings" tooltip="Workspace settings" />',
  "button-group":
    'import { ButtonGroup } from \'@nerio/ui\';\nimport { Button } from \'@nerio/ui/client\';\n\n<ButtonGroup aria-label="Document actions">\n  <Button variant="secondary">Cancel</Button>\n  <Button variant="secondary">Save</Button>\n</ButtonGroup>',
  kbd: "import { Kbd } from '@nerio/ui';\n\n<Kbd>Esc</Kbd>\n<Kbd>⌘K</Kbd>\n<Kbd>⇧⌘P</Kbd>\n<Kbd>⌥←</Kbd>\n<Kbd>⌘↵</Kbd>",
  breadcrumbs:
    "import { Breadcrumbs } from '@nerio/ui';\n\n<Breadcrumbs items={[{ label: 'Docs', href: '/docs' }, { label: 'Components', href: '/docs/components' }, { label: 'Button' }]} />",
  pagination:
    "import * as React from 'react';\nimport { Pagination } from '@nerio/ui';\n\nconst AppLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(function AppLink(props, ref) {\n  return <a ref={ref} data-router-link=\"\" {...props} />;\n});\n\n<Pagination previousHref=\"/docs/page/1\" nextHref=\"/docs/page/3\" pages={[{ key: '1', label: '1', href: '/docs/page/1' }, { key: '2', label: '2', href: '/docs/page/2', current: true, render: <AppLink href=\"#\" /> }, { key: '3', label: '3', href: '/docs/page/3' }]} />",
  badge:
    "import { Check, CircleAlert } from '@nerio/adapters/icons';\nimport { Badge } from '@nerio/ui';\n\n<Badge tone=\"success\" leadingIcon={Check}>Published</Badge>\n<Badge tone=\"warning\" trailingIcon={CircleAlert}>Review needed</Badge>",
  alert:
    "import { Circle } from '@nerio/adapters/icons';\nimport { Alert } from '@nerio/ui';\n\n<Alert tone=\"info\" title=\"Invite sent\" icon={Circle}>Collaborators will receive an email shortly.</Alert>",
  spinner: "import { Spinner } from '@nerio/ui';\n\n<Spinner label=\"Loading activity\" />",
  skeleton: "import { Skeleton } from '@nerio/ui';\n\n<Skeleton aria-label=\"Loading\" />",
  "empty-state":
    "import { EmptyState, EmptyStateActions, EmptyStateDescription, EmptyStateHeader, EmptyStateTitle } from '@nerio/ui';\nimport { Button } from '@nerio/ui/client';\n\n<EmptyState>\n  <EmptyStateHeader>\n    <EmptyStateTitle>No collections</EmptyStateTitle>\n    <EmptyStateDescription>Create one to start organizing work.</EmptyStateDescription>\n  </EmptyStateHeader>\n  <EmptyStateActions>\n    <Button>Create collection</Button>\n    <Button variant=\"ghost\">Learn more</Button>\n  </EmptyStateActions>\n</EmptyState>",
  input:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name" description="Use a short recognizable name."><Input placeholder="Launch materials" required autoComplete="organization" /></Field>',
  "input-group":
    'import { Input, InputGroup, InputGroupAddon } from \'@nerio/ui\';\n\n<InputGroup><InputGroupAddon placement="start" aria-hidden="true">https://</InputGroupAddon><Input aria-label="Website" /><InputGroupAddon placement="end">.com</InputGroupAddon></InputGroup>',
  textarea:
    'import { Field, Textarea } from \'@nerio/ui\';\n\n<Field label="Notes" description="Add context for collaborators."><Textarea placeholder="Add launch context" /></Field>',
  label:
    'import { Input, Label, LabelContent, LabelRequired, LabelRow } from \'@nerio/ui\';\nimport { LabelHint } from \'@nerio/ui/client\';\n\n<LabelRow>\n  <LabelContent>\n    <Label htmlFor="project-name">Project name</Label>\n    <LabelRequired />\n    <LabelHint label="Choose a recognizable name for collaborators." />\n  </LabelContent>\n</LabelRow>\n<Input id="project-name" required />',
  field:
    'import { Field, Input } from \'@nerio/ui\';\n\n<Field label="Project name" description="Shown in workspace navigation." message="Use at least 3 characters." invalid><Input /></Field>',
  "form-message":
    "import { FormMessage } from '@nerio/ui';\n\n<FormMessage>Use at least 3 characters.</FormMessage>",
  "form-group":
    'import { Field, FormGroup } from \'@nerio/ui\';\nimport { Checkbox } from \'@nerio/ui/client\';\n\n<FormGroup layout="grid" title="Notifications" description="Choose which updates should be sent by email.">\n  <Field label="Product updates"><Checkbox aria-label="Product updates" /></Field>\n  <Field label="Security alerts"><Checkbox aria-label="Security alerts" defaultChecked /></Field>\n</FormGroup>',
  checkbox:
    'import { Checkbox } from \'@nerio/ui/client\';\n\n<Checkbox\n  defaultChecked\n  name="includeArchived"\n  label="Include archived collections"\n  description="Archived collections remain visible in search results."\n/>\n\n// Use indeterminate for an aggregate or partial selection.\n<Checkbox aria-label="Partially selected" indeterminate />',
  "radio-group":
    'import { RadioGroup, RadioGroupItem } from \'@nerio/ui/client\';\n\n<RadioGroup label="Visibility" name="visibility" defaultValue="team">\n  <RadioGroupItem value="private" description="Only you can access it.">Private</RadioGroupItem>\n  <RadioGroupItem value="team">Team</RadioGroupItem>\n</RadioGroup>\n\n// Options API remains available for concise data-driven groups.\n<RadioGroup label="Visibility" options={[{ label: "Private", value: "private" }]} />',
  switch:
    'import { Switch } from "@nerio/ui/client";\n\n<Switch\n  defaultChecked\n  name="notifyCollaborators"\n  label="Notify collaborators"\n  description="Collaborators receive updates as they happen."\n/>',
  dialog:
    'import { Dialog } from \'@nerio/ui/client\';\n\n<Dialog trigger="Open dialog" title="Share collection">...</Dialog>',
  sheet:
    'import { Button, Sheet, SheetBody, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from \'@nerio/ui/client\';\n\n<Sheet>\n  <SheetTrigger render={<Button variant="secondary">Open settings</Button>} />\n  <SheetContent side="right" size="md" showClose={false}>\n    <SheetHeader>\n      <SheetTitle>Workspace settings</SheetTitle>\n      <SheetDescription>Configure shared defaults for this workspace.</SheetDescription>\n    </SheetHeader>\n    <SheetBody>...</SheetBody>\n    <SheetFooter>\n      <SheetClose render={<Button variant="secondary">Cancel</Button>} />\n      <Button>Save changes</Button>\n    </SheetFooter>\n  </SheetContent>\n</Sheet>',
  "sidebar-primitive":
    'import { Icon, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset } from \'@nerio/ui\';\nimport { Sidebar, SidebarProvider, SidebarRail, SidebarTrigger, useSidebar } from \'@nerio/ui/client\';\n\n<SidebarProvider defaultExpanded side="left">\n  <Sidebar aria-label="Workspace sidebar">\n    <SidebarHeader>Workspace</SidebarHeader>\n    <SidebarContent>\n      <nav aria-label="Workspace">...</nav>\n    </SidebarContent>\n    <SidebarFooter>...</SidebarFooter>\n    <SidebarRail label="Collapse workspace sidebar" />\n  </Sidebar>\n  <SidebarInset>\n    <SidebarTrigger label="Expand workspace sidebar" />\n    ...\n  </SidebarInset>\n</SidebarProvider>',
  "command-primitive":
    'import { Kbd } from \'@nerio/ui\';\nimport { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from \'@nerio/ui/client\';\n\nconst items = [{ value: "settings", label: "Workspace settings", keywords: ["preferences"] }];\n\n<Command items={items}>\n  <CommandInput aria-label="Workspace commands" placeholder="Search commands" />\n  <CommandEmpty>No matching commands.</CommandEmpty>\n  <CommandList>\n    {(item) => (\n      <CommandItem key={item.value} value={item.value} shortcut={<Kbd aria-hidden>⌘,</Kbd>} onSelect={(value, event) => runCommand(value, event)}>\n        {item.label}\n      </CommandItem>\n    )}\n  </CommandList>\n</Command>',
  select:
    "import { Select } from '@nerio/ui/client';\n\n<Select\n  label=\"Publication status\"\n  name=\"status\"\n  placeholder=\"Choose status\"\n  options={[\n    { label: 'Draft', value: 'draft' },\n    { label: 'In review', value: 'review' },\n    { label: 'Published', value: 'published' },\n    { label: 'Archived', value: 'archived', disabled: true },\n  ]}\n/>",
  toast:
    'import { Button, ToastProvider, ToastViewport, useToastManager } from \'@nerio/ui/client\';\n\nfunction Example() {\n  const toasts = useToastManager();\n  return (\n    <Button onClick={() => toasts.add({\n      id: "save-result",\n      title: "Saved",\n      description: "The collection is available to your team.",\n      timeout: 5000, // Use 0 only for an intentionally persistent toast.\n      priority: "low",\n      data: { tone: "success" },\n    })}>\n      Show toast\n    </Button>\n  );\n}\n\n<ToastProvider limit={3}>\n  <Example />\n  <ToastViewport label="Notifications" />\n</ToastProvider>',
  tabs: 'import { Badge } from "@nerio/ui";\nimport { Tabs, TabsContent, TabsIndicator, TabsList, TabsPanels, TabsTrigger } from "@nerio/ui/client";\n\n<Tabs defaultValue="overview" variant="segmented">\n  <TabsList aria-label="Workspace sections">\n    <TabsTrigger value="overview" badge={<Badge size="sm">12</Badge>}>Overview</TabsTrigger>\n    <TabsTrigger value="activity">Activity</TabsTrigger>\n    <TabsIndicator />\n  </TabsList>\n  <TabsPanels>\n    <TabsContent value="overview">Overview content</TabsContent>\n    <TabsContent value="activity">Activity content</TabsContent>\n  </TabsPanels>\n</Tabs>',
  tooltip:
    "import { Button, Tooltip } from '@nerio/ui/client';\n\n<Tooltip label=\"Copies the share link\"><Button>Copy link</Button></Tooltip>",
  popover:
    'import { Popover } from \'@nerio/ui/client\';\n\n<Popover trigger="Filters" title="View filters">...</Popover>',
  "dropdown-menu":
    'import { DropdownMenu } from \'@nerio/ui/client\';\n\n<DropdownMenu trigger="Actions" items={[{ label: "Rename" }]} />',
  card: 'import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle, CardVisual } from \'@nerio/ui\';\n\n<Card as="article">\n  <CardVisual>...</CardVisual>\n  <CardHeader>\n    <div>\n      <CardTitle as="h2">Launch workspace</CardTitle>\n      <CardDescription>Plan assets, owners, and milestones in one focused surface.</CardDescription>\n    </div>\n    <CardAction>...</CardAction>\n  </CardHeader>\n  <CardContent>12 active tasks</CardContent>\n</Card>',
  separator: "import { Separator } from '@nerio/ui';\n\n<Separator />",
  avatar: "import { Avatar } from '@nerio/ui';\n\n<Avatar name=\"Maya Chen\" />",
  progress:
    'import { Progress } from \'@nerio/ui\';\n\n<Progress label="Uploading files" value={68} />\n\n<Progress aria-label="Synchronizing workspace" value={null} valueText="Synchronizing" />',
  stat: 'import { Stat } from \'@nerio/ui\';\n\n<Stat label="Active projects" value="12" trend="+3 this week" />',
  "key-value":
    'import { KeyValue } from \'@nerio/ui\';\n\n<KeyValue label="Owner" value="Product team" />',
  table:
    'import { Table, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from \'@nerio/ui\';\n\n<h2 id="projects-title">Projects</h2>\n<TableContainer focusable aria-labelledby="projects-title">\n  <Table>\n    <TableHeader><TableRow><TableHead>Name</TableHead></TableRow></TableHeader>\n    <TableBody><TableRow><TableCell>Roadmap</TableCell></TableRow></TableBody>\n  </Table>\n</TableContainer>',
  list: "import * as React from 'react';\nimport { List } from '@nerio/ui';\n\nconst AppLink = React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(function AppLink(props, ref) {\n  return <a ref={ref} data-router-link=\"\" {...props} />;\n});\n\n<List items={[{ id: 'tokens', title: 'Tokens', description: 'CSS variable foundation for themes, modes, and density.', href: '/docs/foundations/tokens', render: <AppLink href=\"#\" /> }, { id: 'components', title: 'Components', description: 'Composable Core primitives installed as source.', href: '/docs/components/button' }]} />",
  item: 'import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from \'@nerio/ui\';\n\n<Item render={<a href="/settings" />}>\n  <ItemMedia variant="icon">...</ItemMedia>\n  <ItemContent><ItemTitle>Workspace settings</ItemTitle></ItemContent>\n  <ItemActions>...</ItemActions>\n</Item>',
};

export const sharedTokens = [
  "--n-color-surface",
  "--n-color-text-primary",
  "--n-color-border-subtle",
  "--n-focus-ring",
];

export const componentMetadata: Record<string, ComponentMetadata> = {
  kbd: {
    name: "Kbd",
    description: "Native keyboard shortcut notation with quiet tokenized styling.",
    status: "beta",
    layer: "core",
    category: "Foundation",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Button", "Tooltip", "Tokens"],
    anatomy: ["kbd"],
    motion: ["none"],
    accessibility: [
      "native kbd semantics",
      "supplemental shortcut notation",
      "use aria-keyshortcuts for functional shortcuts",
    ],
  },
  typography: {
    name: "Typography",
    description: "Semantic heading, text, and inline code primitives.",
    status: "beta",
    layer: "core",
    category: "Foundation",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Tokens", "Heading", "Text"],
  },
  button: {
    name: "Button",
    description: "Triggers a user action with intent, size, loading, and icon contracts.",
    status: "stable",
    layer: "core",
    category: "Actions",
    package: "@nerio/ui",
    importPath: "@nerio/ui/client",
    related: ["Badge", "DropdownMenu", "Tooltip"],
    anatomy: ["button", "button-icon", "button-label", "button-badge"],
    motion: ["hover", "press", "focus"],
    accessibility: ["Base UI button primitive", "aria-busy while loading", "visible focus ring"],
  },
  "button-group": {
    name: "ButtonGroup",
    description:
      "Groups related Buttons with the same visual variant into one compact attached horizontal or vertical control.",
    status: "stable",
    layer: "core",
    category: "Actions",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Button", "DropdownMenu", "Tokens"],
    anatomy: ["button-group"],
    motion: ["inherits Button motion"],
    accessibility: ["group role", "aria-label", "child Button semantics"],
  },
  sheet: {
    name: "Sheet",
    description:
      "A focused Base UI modal side-panel primitive with compound slots and Core size scale.",
    status: "beta",
    layer: "core",
    category: "Navigation and overlays",
    package: "@nerio/ui",
    importPath: "@nerio/ui/client",
    related: ["Dialog", "Popover", "Button"],
    anatomy: [
      "sheet-trigger",
      "sheet-content",
      "sheet-header",
      "sheet-title",
      "sheet-body",
      "sheet-footer",
      "sheet-close",
    ],
    motion: ["directional overlay entry", "reduced-motion fade"],
    accessibility: ["Base UI modal focus management", "accessible name", "keyboard close path"],
  },
  "sidebar-primitive": {
    name: "Sidebar Primitive",
    description:
      "A low-level collapsible layout primitive that keeps navigation data and product behavior consumer-owned.",
    status: "stable",
    layer: "core",
    category: "Navigation and layout",
    package: "@nerio/ui/client",
    importPath: "@nerio/ui/client",
    related: ["Sheet", "Button", "Tooltip", "Separator"],
    anatomy: [
      "sidebar-provider",
      "sidebar",
      "sidebar-header",
      "sidebar-content",
      "sidebar-footer",
      "sidebar-rail",
      "sidebar-inset",
      "sidebar-trigger",
    ],
    motion: ["tokenized width transition", "reduced-motion instant state change"],
    accessibility: [
      "complementary aside semantics",
      "localized toggle names",
      "inert collapsed content",
      "stable aria-controls relationship",
    ],
  },
  "command-primitive": {
    name: "Command Primitive",
    description:
      "An accessible query and action-result primitive that keeps product workflows consumer-owned.",
    status: "stable",
    layer: "core",
    category: "Navigation and layout",
    package: "@nerio/ui/client",
    importPath: "@nerio/ui/client",
    related: ["Popover", "Dialog", "Sheet", "Kbd", "Empty State", "Spinner"],
    anatomy: [
      "command",
      "command-input-group",
      "command-input",
      "command-list",
      "command-group",
      "command-group-label",
      "command-item",
      "command-separator",
      "command-empty",
      "command-loading",
    ],
    motion: ["consumer overlay motion only", "reduced-motion compatible"],
    accessibility: [
      "Base UI autocomplete combobox and listbox semantics",
      "stable active-descendant focus model",
      "disabled-item keyboard skipping",
      "IME-safe Enter selection",
      "polite empty and loading announcements",
    ],
  },
  input: {
    name: "Input",
    description: "A thin native single-line control for supported text-like values.",
    status: "stable",
    layer: "core",
    category: "Forms",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["InputGroup", "Field", "Label", "Textarea"],
    anatomy: ["input"],
    motion: ["hover", "focus"],
    accessibility: [
      "native input attributes",
      "aria-invalid support",
      "label through Field or Label",
    ],
  },
  "input-group": {
    name: "InputGroup",
    description:
      "A server-safe compositional surface for Input and explicit supporting inline content.",
    status: "stable",
    layer: "core",
    category: "Forms",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Input", "Field", "Button"],
    anatomy: ["input-group", "input", "input-group-addon"],
    motion: ["hover", "focus-within"],
    accessibility: [
      "preserves native input semantics",
      "explicit label through Field or Label",
      "interactive addon content remains independently keyboard accessible",
    ],
  },
  card: {
    name: "Card",
    description: "Groups related product content on a restrained border-first surface.",
    status: "stable",
    layer: "core",
    category: "Layout and display",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Separator", "Stat", "KeyValue"],
    anatomy: [
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-content",
      "card-footer",
    ],
    motion: ["none by default"],
    accessibility: ["semantic heading content supplied by consumers", "avoid nested cards"],
  },
  breadcrumbs: {
    name: "Breadcrumbs",
    description: "Shows hierarchy navigation with native anchors and current page semantics.",
    status: "beta",
    layer: "core",
    category: "Navigation",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Pagination", "Tabs", "Tokens"],
    anatomy: ["root", "list", "item", "link", "current", "separator"],
    motion: ["hover", "focus"],
    accessibility: ["nav landmark", "ordered list semantics", "aria-current page"],
  },
  pagination: {
    name: "Pagination",
    description: "Provides previous, next, and page links without owning pagination state.",
    status: "beta",
    layer: "core",
    category: "Navigation",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Breadcrumbs", "Button", "Table"],
    anatomy: ["root", "list", "item", "previous", "page", "next"],
    motion: ["hover", "focus"],
    accessibility: [
      "nav landmark",
      "aria-current and data-current parity",
      "non-focusable disabled controls",
    ],
  },
  list: {
    name: "List",
    description: "Presents simple structured items with optional descriptions and native links.",
    status: "beta",
    layer: "core",
    category: "Layout and display",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["Card", "Table", "Button"],
    anatomy: ["root", "item", "body", "link", "title", "description", "meta"],
    motion: ["hover", "focus"],
    accessibility: ["semantic ul or ol", "native anchors", "natural reading order"],
  },
  item: {
    name: "Item",
    description:
      "Composes compact content, media, and actions without imposing list semantics or interaction.",
    status: "beta",
    layer: "core",
    category: "Layout and display",
    package: "@nerio/ui",
    importPath: "@nerio/ui",
    related: ["List", "Card", "Separator"],
    anatomy: [
      "item",
      "item-group",
      "item-media",
      "item-content",
      "item-title",
      "item-description",
      "item-actions",
      "item-header",
      "item-footer",
    ],
    motion: ["hover and press only on native interactive rendered roots"],
    accessibility: [
      "no implicit role",
      "native rendered link or button",
      "static root remains unfocusable",
    ],
  },
};

const variantDescriptions: Record<string, string> = {
  primary: "Strongest action or selection in the local context.",
  secondary: "Supporting action with a visible control boundary.",
  ghost: "Low-emphasis action for dense or repeated surfaces.",
  destructive: "Risky action that needs explicit intent.",
  link: "Text-level navigation without control padding or underlines.",
  neutral: "Low-emphasis status or message.",
  success: "Positive completion or validation state.",
  warning: "Warning state that needs attention without blocking the whole flow.",
  danger: "Error, destructive, or blocking state.",
  info: "Informational state that should stay calm.",
  sm: "Compact size for dense layouts and inline use.",
  md: "Default size for most product surfaces.",
  lg: "Larger size for prominent local actions.",
  default: "Default variant using semantic Nerio tokens.",
  error: "Validation or failure state with recovery text.",
};

function titleFromRegistryValue(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function anatomyFromSlots(slots: string[], fallback: ReferenceSection[]) {
  if (slots.length === 0) return fallback;

  return slots.map((slot) => ({
    title: slot,
    description:
      fallback.find((item) => item.title === slot)?.description ??
      `${titleFromRegistryValue(slot)} slot exposed through data-slot="${slot}".`,
  }));
}

export function variantsFromRegistry(variants: string[], fallback: ReferenceSection[]) {
  if (variants.length === 0) return fallback;

  return variants.map((variant) => ({
    title: variant,
    description:
      variantDescriptions[variant] ??
      `${titleFromRegistryValue(variant)} is part of the public component contract.`,
  }));
}

export const componentReference: Record<string, ComponentReference> = {
  typography: {
    category: "Foundation",
    purpose:
      "Use Typography primitives to preserve semantic document structure and token-driven hierarchy.",
    anatomy: [
      { title: "heading", description: "Semantic heading level with an independent visual size." },
      { title: "text", description: "Supporting copy with default, secondary, or tertiary tone." },
      { title: "code", description: "Short inline code token for commands, names, and values." },
    ],
    variants: [
      {
        title: "Heading size",
        description: "xs through 2xl sizes use the type scale without changing semantics.",
      },
      { title: "Text tone", description: "Default, secondary, and tertiary semantic text roles." },
    ],
    states: [
      { title: "Default", description: "Typography adapts through semantic text and font tokens." },
    ],
    accessibility: [
      "Use heading levels in a logical document outline.",
      "Do not use visual size to imply semantic importance.",
      "Keep labels and accessible names explicit rather than relying on supporting Text content.",
    ],
    api: [
      {
        title: "Heading as / size",
        description: "Controls semantic heading level and visual size independently.",
      },
      {
        title: "Text tone",
        description: "Controls the semantic color role for supporting copy.",
      },
      { title: "Code", description: "Renders a short inline code element." },
    ],
    guidance: {
      do: ["Use semantic HTML through the as prop and tokenized text roles."],
      dont: [
        "Do not use Heading to style non-heading content or hard-code type values in product UI.",
      ],
    },
    tokens: [
      "--n-color-text-primary",
      "--n-color-text-secondary",
      "--n-font-sans",
      "--n-font-mono",
    ],
  },
  button: {
    category: "Actions",
    purpose:
      "Use Button for explicit product actions that submit, save, create, continue, or trigger a workflow.",
    anatomy: [
      {
        title: "button",
        description:
          "Base UI button primitive with variant, size, disabled, loading, and focus states.",
      },
      {
        title: "button-icon",
        description: "Optional leading or trailing icon rendered through Nerio's icon adapter.",
      },
      {
        title: "button-label",
        description: "Visible action text that stays present while loading.",
      },
      {
        title: "button-badge",
        description: "Optional Badge count or status placed after the visible action label.",
      },
      {
        title: "button-kbd",
        description: "Optional native kbd hint displayed after the visible action label.",
      },
    ],
    variants: [
      { title: "Primary", description: "Strongest action in the local decision." },
      { title: "Secondary", description: "Supporting action with a visible boundary." },
      {
        title: "Outline",
        description: "Supporting action with a clear boundary and no filled surface.",
      },
      { title: "Ghost", description: "Low-emphasis action for dense or repeated surfaces." },
      { title: "Danger", description: "Risky action that needs explicit intent and clear copy." },
    ],
    states: [
      {
        title: "Default, hover, and active",
        description: "Variant tokens control interaction feedback.",
      },
      { title: "Focus", description: "Focus-visible uses the shared Nerio focus ring." },
      { title: "Loading", description: "Disables repeat activation and exposes aria-busy." },
      { title: "Disabled", description: "Prevents activation while preserving layout." },
    ],
    motion: [
      "Hover transitions background, border, color, and opacity through motion tokens.",
      "Press uses a subtle tokenized scale transform and is removed for reduced motion.",
      "Focus-visible animates the shared focus ring without moving layout.",
    ],
    accessibility: [
      "Renders native button behavior through Base UI unless a custom render element is supplied.",
      "Use concise visible text or provide an accessible name.",
      "Loading preserves the action name, sets aria-busy, and disables repeat activation; loadingLabel is deprecated.",
      "Icons are decorative by default; the button label carries the action meaning.",
      "Do not rely on color alone to communicate destructive or disabled meaning.",
    ],
    api: [
      {
        title: "variant",
        description: "primary, secondary, outline, ghost, or danger.",
      },
      {
        title: "size",
        description: "sm, md, or lg. Density adjusts the underlying height tokens.",
      },
      {
        title: "loading",
        description:
          "Disables activation, shows a decorative Spinner, and preserves the accessible action name with aria-busy.",
      },
      {
        title: "leadingIcon / trailingIcon",
        description:
          "Optional icons placed before or after the visible label through the Nerio icon adapter.",
      },
      {
        title: "icon / aria-label",
        description:
          "Creates an icon-only Button. aria-label is required to name the action for assistive technology.",
      },
      {
        title: "kbd",
        description:
          "Pass text, a number, or a Kbd element to display a quiet shortcut hint after the visible action label. Add aria-keyshortcuts separately for functional shortcuts.",
      },
      {
        title: "tooltip",
        description:
          "Optional supplemental tooltip, especially useful for icon-only actions. It never replaces aria-label.",
      },
    ],
    designNotes: [
      "Use one primary Button per local decision.",
      "Use danger for destructive actions and pair it with explicit copy.",
      "Use the link variant with a native anchor render target for navigation.",
    ],
    related: ["Badge", "DropdownMenu", "Tooltip"],
    guidance: {
      do: ["Use one primary action per local decision and keep labels action-oriented."],
      dont: ["Do not use a button render target when the interaction navigates to a destination."],
    },
    tokens: [
      "--n-button-height-sm",
      "--n-button-height-md",
      "--n-button-height-lg",
      "--n-button-radius",
      "--n-button-background-primary",
      "--n-button-background-primary-hover",
      "--n-button-background-primary-active",
      "--n-button-foreground-primary",
      "--n-button-background-secondary",
      "--n-button-background-secondary-hover",
      "--n-button-border-secondary",
      "--n-button-foreground-secondary",
      "--n-button-background-outline",
      "--n-button-background-outline-hover",
      "--n-button-border-outline",
      "--n-button-foreground-outline",
      "--n-button-kbd-background",
      "--n-button-kbd-border-color",
      "--n-button-kbd-foreground",
      "--n-button-kbd-opacity",
      "--n-badge-height",
      "--n-badge-height-sm",
      "--n-badge-radius",
      "--n-badge-padding-inline",
      "--n-badge-padding-inline-sm",
      "--n-button-background-ghost-hover",
      "--n-button-foreground-ghost",
      "--n-button-background-destructive",
      "--n-button-foreground-destructive",
      "--n-icon-button-size-sm",
      "--n-icon-button-size-md",
      "--n-icon-button-size-lg",
      "--n-icon-button-radius",
      "--n-motion-hover-duration",
      "--n-motion-press-duration",
      "--n-focus-ring",
    ],
  },
  "button-group": {
    category: "Actions",
    purpose:
      "Use ButtonGroup when adjacent actions form one compact, related set with the same visual variant.",
    anatomy: [{ title: "button-group", description: "Native group wrapper for adjacent Buttons." }],
    variants: [
      {
        title: "Orientation",
        description: "Horizontal is the default; vertical stacks the same direct Button children.",
      },
    ],
    states: [
      { title: "Focus", description: "Each child Button keeps its own visible focus ring." },
      { title: "Disabled and loading", description: "Each child Button keeps its own state." },
    ],
    accessibility: [
      "Names the related action set through aria-label or aria-labelledby.",
      "Keeps the native semantics and independent Tab order of each child Button; it is not a toolbar.",
    ],
    guidance: {
      do: ["Use direct Button children with the same variant for every action in the group."],
      dont: [
        "Do not mix Button variants, group unrelated actions, or use it as a toolbar substitute.",
      ],
    },
    tokens: [
      "--n-button-radius",
      "--n-button-border-width",
      "--n-button-group-divider",
      "--n-focus-ring",
    ],
  },
  kbd: {
    category: "Foundation",
    purpose: "Use Kbd to display a keyboard shortcut beside an action or command label.",
    anatomy: [{ title: "kbd", description: "Native kbd element with quiet shortcut styling." }],
    variants: [
      { title: "Default", description: "Neutral shortcut notation that adapts through tokens." },
    ],
    states: [
      { title: "Default", description: "Static supplementary notation with no interactive state." },
    ],
    motion: ["Kbd is static and does not animate."],
    accessibility: [
      "Uses native kbd semantics for standalone keyboard notation.",
      "Hide Kbd from assistive technology when it is shown inside a control that already has an accessible name.",
      "Do not make a shortcut the only way to discover or operate an action.",
    ],
    api: [{ title: "children", description: "Shortcut notation such as ⌘S, ⇧⌘P, or Esc." }],
    designNotes: [
      "Keep shortcut notation quiet so it supports, rather than competes with, the action label.",
    ],
    related: ["Button", "Tooltip", "Tokens"],
    guidance: {
      do: ["Use beside familiar commands when a keyboard shortcut is available."],
      dont: [
        "Do not use Kbd as an interactive control or a replacement for visible command labels.",
      ],
    },
    tokens: [
      "--n-kbd-background",
      "--n-kbd-border-width",
      "--n-kbd-border-color",
      "--n-kbd-radius",
      "--n-kbd-foreground",
      "--n-kbd-font-family",
      "--n-kbd-font-size",
      "--n-kbd-font-weight",
      "--n-kbd-padding-block",
      "--n-kbd-padding-inline",
    ],
  },
  breadcrumbs: {
    category: "Navigation",
    purpose:
      "Use Breadcrumbs to show the current page position in a hierarchy and provide native anchor links back to parent levels.",
    anatomy: [
      { title: "root", description: 'Nav landmark with aria-label="Breadcrumb" by default.' },
      { title: "list", description: "Ordered list that preserves hierarchy semantics." },
      { title: "item", description: "One hierarchy level in the trail." },
      { title: "link", description: "Native anchor for parent destinations." },
      { title: "current", description: 'Current page item marked with aria-current="page".' },
      { title: "separator", description: "Decorative separator hidden from assistive technology." },
    ],
    variants: [
      {
        title: "Default",
        description: "Single semantic trail with parent links and a current page.",
      },
    ],
    states: [
      { title: "Linked parent", description: "Parent items render native anchors." },
      { title: "Current page", description: 'The final item is text with aria-current="page".' },
      { title: "Focus", description: "Linked items use the shared Nerio focus ring." },
    ],
    accessibility: [
      "Keep the default breadcrumb label unless the page has multiple navigation landmarks that need clearer names.",
      "Use ordered list semantics so the hierarchy is available beyond visual separators.",
      "Separators are decorative and must not be announced.",
      "Current page state uses aria-current and stronger text weight, not color alone.",
    ],
    api: [
      {
        title: "items",
        description:
          "Array of labels with optional href values and current flags for parent destinations.",
      },
      {
        title: "aria-label",
        description: "Defaults to Breadcrumb and can be customized for local context.",
      },
      {
        title: "className",
        description: "Extends the nav root without replacing tokenized defaults.",
      },
    ],
    guidance: {
      do: ["Use for hierarchical docs, settings, object detail, and nested product pages."],
      dont: ["Do not use Breadcrumbs as a sidebar, tabs replacement, or command navigation."],
    },
    tokens: [
      "--n-breadcrumbs-gap",
      "--n-breadcrumbs-separator-color",
      "--n-link-color",
      "--n-link-color-muted",
      "--n-focus-ring",
    ],
  },
  pagination: {
    category: "Navigation",
    purpose:
      "Use Pagination when the product already has page URLs and needs basic previous, next, and page navigation.",
    anatomy: [
      { title: "root", description: 'Nav landmark with aria-label="Pagination" by default.' },
      { title: "list", description: "List of page navigation controls." },
      { title: "previous", description: "Previous-page link or non-focusable disabled text." },
      { title: "page", description: "Page link with optional current state." },
      { title: "next", description: "Next-page link or non-focusable disabled text." },
    ],
    variants: [{ title: "Default", description: "Link-based pagination with no client state." }],
    states: [
      {
        title: "Current",
        description:
          'Current links, buttons, router elements, and static pages use aria-current="page" plus the same stronger visual treatment.',
      },
      {
        title: "Disabled",
        description: "Unavailable previous or next controls are not focusable.",
      },
      { title: "Focus", description: "Links use the shared Nerio focus ring." },
    ],
    accessibility: [
      "Provide stable page labels and clear previous/next labels.",
      'Current page uses aria-current="page" and keeps data-current even without navigation behavior.',
      "Disabled controls render as aria-disabled text instead of inactive anchors.",
      "Do not rely on color alone for current or disabled states.",
    ],
    api: [
      {
        title: "pages",
        description:
          "Array of page labels, hrefs, current flags, optional disabled states, and optional router render elements.",
      },
      {
        title: "previousHref / nextHref",
        description: "When omitted, the control renders disabled and is not focusable.",
      },
      {
        title: "previousLabel / nextLabel",
        description: "Visible labels for the boundary controls.",
      },
      {
        title: "className",
        description: "Extends the nav root without replacing tokenized defaults.",
      },
    ],
    guidance: {
      do: ["Use with server-rendered list pages, docs archives, and simple result sets."],
      dont: [
        "Do not add page calculation, data fetching, or table state management to Pagination.",
      ],
    },
    tokens: [
      "--n-pagination-gap",
      "--n-pagination-item-size",
      "--n-pagination-radius",
      "--n-pagination-background",
      "--n-pagination-background-hover",
      "--n-pagination-background-current",
      "--n-pagination-border",
      "--n-pagination-border-current",
      "--n-focus-ring",
    ],
  },
  badge: {
    category: "Actions and feedback",
    purpose:
      "Use Badge to label status, category, or lightweight metadata without creating another action.",
    anatomy: [
      {
        title: "empty-state",
        description: "Inline status container with tone, size, and tokenized radius.",
      },
      { title: "leading-icon", description: "Optional decorative icon before the visible label." },
      { title: "label", description: "Short text that names the status or metadata value." },
      { title: "trailing-icon", description: "Optional decorative icon after the visible label." },
    ],
    variants: [
      {
        title: "Size sm / md / lg",
        description: "Use sm inside compact controls, md by default, and lg for elevated metadata.",
      },
      { title: "Neutral", description: "Default metadata with low visual priority." },
      {
        title: "Soft / strong emphasis",
        description:
          "Soft is the default; strong is reserved for high-salience warning and danger states.",
      },
    ],
    states: [
      { title: "Static", description: "Badges are labels, not controls." },
      { title: "Dense", description: "Compact density reduces padding without changing meaning." },
    ],
    accessibility: [
      "Do not rely on color or an optional icon alone; the label must carry the status meaning.",
      "Badge is static metadata and must not be used as a button or link.",
    ],
    guidance: {
      do: ["Use concise labels such as Draft, Ready, Shared, or Blocked."],
      dont: ["Do not use badges as buttons or navigation targets."],
    },
    tokens: [
      "--n-badge-radius",
      "--n-badge-height",
      "--n-badge-height-sm",
      "--n-badge-height-lg",
      "--n-badge-padding-inline-sm",
      "--n-badge-padding-inline-lg",
      "--n-badge-gap-sm",
      "--n-badge-gap-lg",
      "--n-badge-icon-size-sm",
      "--n-badge-icon-size-lg",
      "--n-badge-font-size-sm",
      "--n-badge-font-size-lg",
      "--n-badge-background",
      "--n-badge-foreground",
      "--n-badge-background-primary-soft",
      "--n-badge-foreground-primary-soft",
      "--n-badge-background-accent",
      "--n-badge-foreground-accent",
      "--n-badge-background-info",
      "--n-badge-foreground-info",
      "--n-badge-background-success",
      "--n-badge-foreground-success",
      "--n-badge-background-warning",
      "--n-badge-foreground-warning",
      "--n-badge-background-danger",
      "--n-badge-foreground-danger",
      "--n-badge-background-strong",
      "--n-badge-foreground-strong",
      "--n-badge-background-strong-primary",
      "--n-badge-background-strong-info",
      "--n-badge-background-strong-success",
      "--n-badge-background-strong-warning",
      "--n-badge-background-strong-danger",
      "--n-badge-icon-size",
      "--n-spinner-size-sm",
    ],
  },
  alert: {
    category: "Actions and feedback",
    purpose:
      "Use Alert for inline feedback that should stay in the page flow and remain visible until the content changes.",
    anatomy: [
      { title: "root", description: "Inline feedback region with tone and spacing tokens." },
      { title: "icon", description: "Optional decorative icon rendered through the icon adapter." },
      { title: "content", description: "Container for the title and descriptive message." },
      { title: "title", description: "Optional short summary of the message." },
      { title: "description", description: "Body content that explains the state or recovery." },
      {
        title: "action",
        description: "Optional trailing action for a focused recovery or update.",
      },
    ],
    variants: [
      { title: "Neutral", description: "General inline feedback." },
      { title: "Info", description: "Informational message." },
      { title: "Success", description: "Positive completion or confirmation." },
      { title: "Warning", description: "Potential issue that needs attention." },
      { title: "Danger", description: "Blocking or error state that needs recovery." },
    ],
    states: [{ title: "Visible", description: "Alerts are inline and persistent by default." }],
    accessibility: [
      'Static inline alerts are not live regions by default; pass role="status" or role="alert" only for dynamic updates that need announcement.',
      "Use clear text; tone and icon must not carry the only meaning.",
    ],
    guidance: {
      do: ["Use for inline validation summaries, persistent notices, and contextual feedback."],
      dont: ["Do not use Alert as a toast replacement or add dismiss behavior in this slice."],
    },
    tokens: [
      "--n-alert-gap",
      "--n-alert-padding",
      "--n-alert-radius",
      "--n-alert-border",
      "--n-alert-background",
      "--n-alert-title-color",
      "--n-alert-icon-color",
      "--n-alert-icon-size",
      "--n-color-status-info",
      "--n-color-status-success",
      "--n-color-status-warning",
      "--n-color-status-danger",
    ],
  },
  spinner: {
    category: "Actions and feedback",
    purpose:
      "Spinner indicates short indeterminate loading activity without changing surrounding layout.",
    anatomy: [
      {
        title: "root",
        description:
          "Inline loading indicator that is a status or decorative mark, depending on its mode.",
      },
      {
        title: "label",
        description:
          "Visually hidden localized status label, rendered only for standalone Spinner.",
      },
    ],
    variants: [
      {
        title: "Size",
        description:
          "Use sm in compact controls, md for standalone status, and lg for noticeable local loading states.",
      },
    ],
    states: [
      {
        title: "Standalone",
        description:
          "Requires label and renders a status with a visually hidden localized label. className can set the inherited foreground color.",
      },
      {
        title: "Decorative",
        description:
          "Set decorative when a parent such as Button or Badge already owns aria-busy and the loading announcement.",
      },
      {
        title: "Reduced motion",
        description:
          "Stops rotating and remains visible as a static loading mark when reduced motion is requested.",
      },
    ],
    accessibility: [
      "Provide a localized label when Spinner is the loading announcement.",
      "Use decorative when a parent component already exposes loading state through aria-busy or another status region.",
      "Use one loading announcement per region.",
    ],
    api: [
      { title: "size", description: "sm, md, or lg. Defaults to md." },
      { title: "label", description: "Required localized text for standalone Spinner." },
      {
        title: "decorative",
        description: "Removes status semantics when a parent already announces loading.",
      },
      {
        title: "className",
        description:
          "Adds styles such as a semantic foreground color inherited through currentColor.",
      },
    ],
    related: ["Button", "Badge", "Skeleton", "Progress"],
    guidance: {
      do: [
        "Use for quick work such as saving, filtering, or refreshing.",
        "Use currentColor through semantic text color or className to match the surrounding foreground.",
      ],
      dont: ["Do not use Spinner for long tasks where determinate Progress is available."],
    },
    tokens: [
      "--n-spinner-size-sm",
      "--n-spinner-size-md",
      "--n-spinner-size-lg",
      "--n-spinner-border-width",
      "--n-spinner-duration",
      "--n-radius-full",
    ],
  },
  skeleton: {
    category: "Actions and feedback",
    purpose: "Use Skeleton to reserve space for content while data loads.",
    anatomy: [
      {
        title: "root",
        description: "Block placeholder with tokenized radius and subdued surface color.",
      },
      { title: "shape", description: "Width and height are controlled by layout context." },
    ],
    variants: [
      { title: "Block", description: "Use repeated blocks to mirror the final content rhythm." },
    ],
    states: [
      { title: "Loading", description: "Keeps layout stable until real content replaces it." },
    ],
    accessibility: ["Mark the surrounding region busy when skeletons represent loading content."],
    guidance: {
      do: ["Match the approximate dimensions of the content that will load."],
      dont: ["Do not show skeletons after data has failed; switch to an error or empty state."],
    },
    tokens: ["--n-skeleton-height", "--n-skeleton-duration", "--n-radius-md"],
  },
  "empty-state": {
    category: "Actions and feedback",
    purpose:
      "Use EmptyState when a surface has no content and the user needs context or a next step.",
    anatomy: [
      {
        title: "root",
        description: "Centered or inline message area that adapts to the parent surface.",
      },
      { title: "empty-state-media", description: "Optional icon or illustration container." },
      { title: "empty-state-header", description: "Optional title and description grouping." },
      { title: "empty-state-title", description: "Names the empty condition in human language." },
      {
        title: "empty-state-description",
        description: "Explains why the space is empty or what can happen next.",
      },
      {
        title: "empty-state-actions",
        description: "Optional action group with wrapping or vertical layout.",
      },
    ],
    variants: [
      {
        title: "Size",
        description:
          "Use sm for compact surfaces, md for standard sections, and lg for page-level or onboarding states.",
      },
      {
        title: "Alignment",
        description: "Center is the default; start supports sidebars, dialogs, and narrow panels.",
      },
      {
        title: "Media",
        description:
          "Icon provides a compact neutral mark; illustration accepts consumer-owned artwork without a background.",
      },
    ],
    states: [
      {
        title: "Search results",
        description:
          "Use role=status or aria-live=polite when a changed query produces no results.",
      },
      {
        title: "Recoverable error",
        description:
          "Use role=alert only when a failure needs immediate announcement, then provide retry if useful.",
      },
    ],
    accessibility: [
      "EmptyState does not create a live region or alert role by default; consumers own announcements for dynamic content.",
      "Keep the title, description, and optional actions clear in reading order, and hide decorative media from assistive technology.",
      "Use actions only when there is an obvious recovery path; keyboard behavior remains native to the supplied controls.",
    ],
    guidance: {
      do: [
        "Use a short title, helpful next step, and no more than two actions.",
        "Explain the benefit of creating a first item and offer a clear recovery action for empty search results.",
      ],
      dont: [
        "Do not blame users, show technical failures without context, or reuse the same generic copy for every product state.",
      ],
    },
    tokens: ["--n-empty-state-mark-size", "--n-empty-state-gap"],
  },
  input: {
    category: "Forms",
    purpose: "Use Input for short text values such as names, filters, URLs, and settings.",
    anatomy: [
      {
        title: "root",
        description: "Native input element with tokenized height, radius, border, and focus state.",
      },
      { title: "value", description: "User-entered short text value." },
      { title: "placeholder", description: "Optional hint that never replaces a visible label." },
    ],
    variants: [
      { title: "Default", description: "General text entry." },
      { title: "Invalid", description: "Pair with Field and FormMessage for validation." },
    ],
    states: [
      { title: "Default and focus", description: "Focus uses the shared Nerio focus ring." },
      { title: "Disabled", description: "Prevents editing while preserving layout." },
      { title: "Required", description: "Use native required attributes and visible helper text." },
      { title: "Invalid", description: "Use semantic error color and nearby text." },
    ],
    motion: [
      "Hover transitions the border color through shared motion tokens.",
      "Focus-visible animates the ring and border only.",
      "Reduced motion keeps the state change but removes nonessential timing.",
    ],
    accessibility: [
      "Pair every input with Label or Field label.",
      "Use aria-describedby for helper text and validation messages.",
      "Use aria-invalid only when the value is actually invalid.",
      "Use autocomplete and input type where appropriate.",
    ],
    api: [
      {
        title: "invalid",
        description:
          "Sets visual invalid state and aria-invalid when aria-invalid is not supplied.",
      },
      { title: "className", description: "Extends the root input without replacing defaults." },
      { title: "native props", description: "Supports standard React input attributes." },
    ],
    designNotes: [
      "Use Input for short values; use Textarea for longer notes.",
      "Prefer Field when the control needs label, description, or validation message.",
    ],
    related: ["Field", "Label", "Textarea"],
    guidance: {
      do: ["Use Field for production forms so labels and messages stay connected."],
      dont: ["Do not use placeholder text as the only label."],
    },
    tokens: [
      "--n-input-height-md",
      "--n-input-radius",
      "--n-input-background",
      "--n-input-border-focus",
      "--n-input-placeholder",
      "--n-motion-hover-duration",
      "--n-motion-focus-duration",
    ],
  },
  "input-group": {
    category: "Forms",
    purpose:
      "Use InputGroup to place clear supporting inline content around one native Input without changing its responsibility.",
    anatomy: [
      {
        title: "input-group",
        description: "Shared tokenized surface that responds to the nested Input state.",
      },
      {
        title: "input",
        description: "The direct native Input that retains form and accessibility semantics.",
      },
      {
        title: "input-group-addon",
        description:
          "Explicit start or end content such as a decorative icon, prefix, suffix, or action.",
      },
    ],
    variants: [
      {
        title: "Start addon",
        description: "Uses logical start placement for an icon, marker, or prefix.",
      },
      {
        title: "End addon",
        description: "Uses logical end placement for a suffix, unit, status, or compact action.",
      },
    ],
    states: [
      {
        title: "Hover and focus-within",
        description:
          "The shared surface responds while the nested input remains the focused control.",
      },
      {
        title: "Invalid",
        description: "A Field invalid state reaches the direct Input and the group surface.",
      },
      {
        title: "Disabled and read-only",
        description:
          "The group mirrors native input availability without disabling independent addon actions.",
      },
    ],
    motion: [
      "Hover and focus-within use the shared tokenized Input motion contract.",
      "Reduced motion preserves the state change without nonessential timing.",
    ],
    accessibility: [
      "Use Field, Label, or an explicit aria-label to name the nested Input.",
      "Hide decorative icons and text that are only visual context from assistive technology.",
      "Keep interactive addon controls independently labelled and keyboard accessible.",
    ],
    api: [
      {
        title: "InputGroup",
        description:
          "A div wrapper that forwards Field id, description, and invalid wiring to a direct Input child.",
      },
      {
        title: "InputGroupAddon placement",
        description: "Required start or end placement for durable supporting anatomy.",
      },
    ],
    designNotes: [
      "InputGroup owns shared presentation, never value, parsing, validation, results, or asynchronous behavior.",
    ],
    related: ["Input", "Field", "Label", "Button"],
    guidance: {
      do: ["Use explicit addons for stable inline content and use Input size to align the group."],
      dont: [
        "Do not turn InputGroup into a search results, password visibility, date-picker, or formatting abstraction.",
      ],
    },
    tokens: [
      "--n-input-background",
      "--n-input-background-hover",
      "--n-input-border-focus",
      "--n-input-addon-foreground",
      "--n-input-addon-padding-inline",
      "--n-focus-ring",
    ],
  },
  textarea: {
    category: "Forms",
    purpose: "Use Textarea for longer notes, descriptions, comments, and collaborative content.",
    anatomy: [
      {
        title: "root",
        description: "Native textarea with tokenized border, radius, padding, and focus.",
      },
      { title: "value", description: "Multiline text content." },
    ],
    variants: [{ title: "Default", description: "Flexible multiline content entry." }],
    states: [
      { title: "Focus", description: "Visible focus treatment remains consistent with Input." },
      { title: "Disabled", description: "Keeps content visible while preventing edits." },
      {
        title: "Required",
        description: "Use native required attributes for mandatory long-form values.",
      },
      { title: "Invalid", description: "Pair with Field and FormMessage." },
    ],
    accessibility: [
      "Use a visible label and helpful description for long-form fields.",
      "Use aria-describedby for helper text and validation messages.",
      "Use aria-invalid only when the value is actually invalid.",
    ],
    guidance: {
      do: ["Use for content that benefits from multiple lines."],
      dont: ["Do not use Textarea for single-line values like titles or search."],
    },
    tokens: [
      "--n-textarea-min-height",
      "--n-input-radius",
      "--n-input-background",
      "--n-input-border-focus",
      "--n-input-placeholder",
    ],
  },
  label: {
    category: "Forms",
    purpose: "Use Label to provide an accessible name for a form control.",
    anatomy: [
      {
        title: "root",
        description: "Text label associated with a control through htmlFor or composition.",
      },
      { title: "text", description: "Concise name for the expected value." },
      {
        title: "required",
        description: "Red visual marker paired with the control's native required state.",
      },
      {
        title: "hint",
        description: "Optional tooltip trigger for non-essential contextual guidance.",
      },
    ],
    variants: [
      { title: "Default", description: "Standard form label text." },
      {
        title: "With hint",
        description: "Composable required marker and supplementary question hint.",
      },
    ],
    states: [
      { title: "Default", description: "Associates visible text with a matching control id." },
      {
        title: "Required context",
        description:
          "A red asterisk supplements, but does not replace, the control's native required attribute.",
      },
    ],
    accessibility: [
      "Connect labels to controls with htmlFor and matching id when they are separate.",
      "Label forwards native label attributes and refs.",
      "Keep the interactive hint outside the native label element by using LabelRow and LabelContent.",
      "Tooltip guidance is supplementary; do not put essential requirements only in a tooltip.",
    ],
    guidance: {
      do: [
        "Use concrete labels such as Project name or Notification email.",
        "Use LabelHint for short, non-essential context.",
      ],
      dont: ["Do not rely on placeholders or icons alone."],
    },
    tokens: [
      "--n-label-font-size",
      "--n-label-font-weight",
      "--n-label-required-color",
      "--n-label-icon-color",
      "--n-label-hint-icon-size",
    ],
  },
  field: {
    category: "Forms",
    purpose:
      "Use Field to compose a label, description, control, and message into one accessible form unit.",
    anatomy: [
      { title: "root", description: "Field container that controls spacing and state." },
      { title: "label", description: "Accessible name for the control." },
      { title: "description", description: "Optional helper text before interaction." },
      { title: "control", description: "Input, Select, Textarea, Checkbox, or Switch." },
      { title: "message", description: "Validation or help text after interaction." },
    ],
    variants: [
      { title: "Default", description: "General field composition." },
      { title: "Error", description: "Use for failed validation with a clear message." },
    ],
    states: [
      { title: "Neutral", description: "Description and message can provide helper text." },
      { title: "Invalid", description: "Message explains how to recover." },
    ],
    accessibility: [
      "Keep label, description, and message programmatically associated with the control.",
      "Field sets invalid attributes only when the field is actually invalid.",
      "Existing child ids and aria-describedby values are preserved and merged.",
      'Error messages use role="alert" when invalid so updates are announced.',
      "Field supports one form control child; compose custom markup directly for multiple controls.",
    ],
    guidance: {
      do: ["Use Field as the default wrapper for production form rows."],
      dont: ["Do not scatter messages away from the control they describe."],
    },
    tokens: [
      "--n-field-gap",
      "--n-color-text-secondary",
      "--n-color-text-tertiary",
      "--n-color-status-danger",
    ],
  },
  "form-message": {
    category: "Forms",
    purpose:
      "Use FormMessage for validation, confirmation, or contextual help inside a form field.",
    anatomy: [
      { title: "root", description: "Message text with tone and compact spacing." },
      { title: "tone", description: "Neutral, success, or error communication." },
    ],
    variants: [
      { title: "Neutral", description: "General helper text." },
      { title: "Success", description: "Confirmation after valid input." },
      { title: "Error", description: "Clear recovery message for invalid input." },
    ],
    states: [{ title: "Visible", description: "Appears close to the relevant control." }],
    accessibility: [
      "Use clear text; do not depend on color alone to convey validation status.",
      "Associate messages with controls through aria-describedby.",
      'Use role="alert" only for active validation errors.',
    ],
    guidance: {
      do: ["Tell users how to fix an error."],
      dont: ["Do not use vague messages like Invalid value."],
    },
    tokens: ["--n-color-text-tertiary", "--n-color-status-danger", "--n-color-status-success"],
  },
  checkbox: {
    category: "Forms",
    purpose:
      "Use Checkbox for independent selection, consent, multi-select sets, and aggregate indeterminate state.",
    anatomy: [
      {
        title: "field",
        description: "Optional wrapper that groups Checkbox with its label and description.",
      },
      {
        title: "root",
        description:
          "Base UI checkbox control with checked, indeterminate, disabled, and read-only state.",
      },
      { title: "indicator", description: "Icon adapter check or indeterminate indicator." },
      { title: "label", description: "Optional visible name connected through aria-labelledby." },
      {
        title: "description",
        description: "Optional supporting text connected through aria-describedby.",
      },
    ],
    variants: [{ title: "Default", description: "Independent binary option." }],
    states: [
      { title: "Unchecked", description: "Option is available but not selected." },
      { title: "Checked", description: "Option is selected." },
      { title: "Indeterminate", description: "Represents an aggregate or partial selection." },
      { title: "Invalid", description: "Explicit invalid state maps to aria-invalid." },
      { title: "Disabled", description: "Option is unavailable." },
      { title: "Read-only", description: "Option remains visible but does not accept changes." },
    ],
    accessibility: [
      "Checkbox is interactive and imports from @nerio/ui/client.",
      "Use a visible label, aria-label, or aria-labelledby so the option has an accessible name.",
      "Base UI owns keyboard and checked-state behavior.",
      "Use invalid or aria-invalid to expose validation state; connect help or error text with aria-describedby.",
      "Space toggles the focused checkbox; read-only and disabled states do not change value.",
      "The indicator uses the Nerio icon adapter and exposes aria-checked=mixed for indeterminate state.",
    ],
    api: [
      {
        title: "checked / defaultChecked / onCheckedChange",
        description: "Controlled and uncontrolled checked-state APIs from the Base UI root.",
      },
      { title: "label", description: "Optional visible name for the checkbox field row." },
      {
        title: "description",
        description:
          "Optional supporting text displayed below label and announced as a description.",
      },
      {
        title: "name / value / form / required / disabled / readOnly",
        description: "Native form metadata is preserved through the Base UI root props.",
      },
      { title: "invalid", description: "Sets data-invalid and aria-invalid when true." },
      { title: "className", description: "Extends the root control." },
    ],
    guidance: {
      do: ["Use for independent choices, agreement controls, and multi-select filters."],
      dont: [
        "Do not use Checkbox for mutually exclusive options or immediate on/off settings; use RadioGroup or Switch instead.",
      ],
    },
    related: ["radio-group", "switch", "field"],
    tokens: [
      "--n-checkbox-size",
      "--n-checkbox-radius",
      "--n-color-action-primary",
      "--n-color-action-on-primary",
      "--n-input-border-danger",
      "--n-focus-ring",
    ],
  },
  "radio-group": {
    category: "Forms",
    purpose: "Use RadioGroup when one choice must be selected from a short, visible set.",
    anatomy: [
      { title: "root", description: "Field wrapper with label, description, group, and message." },
      { title: "group", description: "Base UI radiogroup that manages one selected value." },
      { title: "option", description: "Clickable option row with control and text." },
      { title: "control", description: "Base UI radio control." },
      { title: "indicator", description: "Selected-state dot." },
      { title: "option-content", description: "Visible option label and optional description." },
      { title: "option-label", description: "Visible label content for one selectable option." },
      {
        title: "option-description",
        description: "Optional supporting text for one selectable option.",
      },
      { title: "message", description: "Optional helper or validation message." },
    ],
    variants: [{ title: "Default", description: "Stacked radio options for small sets." }],
    states: [
      { title: "Checked", description: "One option is selected." },
      { title: "Disabled", description: "The whole group or individual options can be disabled." },
      {
        title: "Read-only",
        description: "The selected option remains visible without accepting changes.",
      },
      { title: "Invalid", description: "Connects validation message and invalid state." },
    ],
    accessibility: [
      "RadioGroup is interactive and imports from @nerio/ui/client.",
      "Uses Base UI Radio Group and Radio primitives.",
      "Connects label, description, and message through accessible ids.",
      "Base UI owns roving focus, Arrow key selection, wrap-around, and disabled-item skipping.",
      "Supports controlled and uncontrolled value APIs, including name, form, inputRef, required, disabled, and readOnly.",
      'Invalid messages use role="alert" only when invalid is true.',
    ],
    api: [
      {
        title: "value / defaultValue / onValueChange",
        description: "Controlled and uncontrolled value APIs for one selected option.",
      },
      {
        title: "options",
        description:
          "Supported concise API for data-driven sets with label, value, description, and disabled.",
      },
      {
        title: "children / RadioGroupItem",
        description:
          "Preferred composition API for rich option content and explicit source control.",
      },
      {
        title: "onValueChange",
        description:
          "Preferred callback receives value and Base UI event details; onChange remains compatible.",
      },
      {
        title: "label / description / message",
        description: "Text slots wired to aria-labelledby and aria-describedby.",
      },
      { title: "invalid", description: "Sets invalid state on the group and message." },
    ],
    guidance: {
      do: [
        "Use options for concise data-driven sets and RadioGroupItem composition for richer or conditional option content.",
      ],
      dont: ["Do not use RadioGroup for large searchable sets; use Select or a future picker."],
    },
    related: ["checkbox", "switch", "select", "field"],
    tokens: [
      "--n-radio-size",
      "--n-radio-dot-size",
      "--n-radio-radius",
      "--n-input-border",
      "--n-input-border-hover",
      "--n-input-border-danger",
      "--n-color-action-primary",
      "--n-field-gap",
      "--n-focus-ring",
    ],
  },
  switch: {
    category: "Forms",
    purpose: "Use Switch for settings that turn something on or off immediately.",
    anatomy: [
      {
        title: "field",
        description: "Optional wrapper that groups Switch with its label and description.",
      },
      { title: "root", description: "Interactive switch control with checked state." },
      { title: "thumb", description: "Movable indicator for on/off state." },
      { title: "label", description: "Optional visible name connected through aria-labelledby." },
      {
        title: "description",
        description: "Optional supporting text connected through aria-describedby.",
      },
    ],
    variants: [{ title: "Default", description: "Immediate binary setting." }],
    states: [
      { title: "Off", description: "Setting is disabled." },
      { title: "On", description: "Setting is enabled." },
      { title: "Disabled", description: "Setting cannot be changed." },
      { title: "Read-only", description: "Setting remains visible without accepting changes." },
      {
        title: "Invalid",
        description: "Validation state is exposed through aria-invalid and data-invalid.",
      },
    ],
    accessibility: [
      "Switch is interactive and imports from @nerio/ui/client.",
      "Use for immediate binary settings; use Checkbox for independent options that are submitted as part of a form.",
      "Use a visible label, aria-label, or aria-labelledby so the setting has an accessible name.",
      "Base UI owns keyboard and checked-state behavior.",
      "Space toggles the focused switch; visible labels must stay stable between on and off states.",
      "Do not use Switch for long-running or destructive actions.",
    ],
    api: [
      {
        title: "checked / defaultChecked / onCheckedChange",
        description: "Controlled and uncontrolled checked-state APIs from the Base UI root.",
      },
      { title: "label", description: "Optional visible name for the switch field row." },
      {
        title: "description",
        description:
          "Optional supporting text displayed below label and announced as a description.",
      },
      {
        title: "name / value / form / required / disabled / readOnly",
        description: "Native form metadata is preserved through the Base UI root props.",
      },
      { title: "invalid", description: "Sets data-invalid and aria-invalid when true." },
      { title: "className", description: "Extends the root switch." },
    ],
    guidance: {
      do: ["Use for preferences like notifications or compact mode."],
      dont: [
        "Do not use Switch when a separate Save, Apply, Submit, or Confirm action is still required unless delayed behavior is clearly communicated.",
      ],
    },
    related: ["checkbox", "radio-group", "field"],
    tokens: [
      "--n-switch-height",
      "--n-switch-width",
      "--n-switch-thumb-size",
      "--n-switch-thumb-offset",
      "--n-switch-background",
      "--n-switch-background-hover",
      "--n-switch-background-checked",
      "--n-switch-border",
      "--n-switch-border-hover",
      "--n-switch-thumb-background-checked",
      "--n-focus-ring",
    ],
  },
  "form-group": {
    category: "Forms",
    purpose:
      "Use FormGroup to group related fields or controls with a semantic title, optional description, optional message, and stack, inline, or responsive grid layout.",
    anatomy: [
      { title: "root", description: "Server-safe fieldset wrapper." },
      { title: "title", description: "Legend text that names the group." },
      {
        title: "description",
        description: "Optional supporting text connected by aria-describedby.",
      },
      {
        title: "content",
        description: "Native children composition for Field, Checkbox, Switch, or custom controls.",
      },
      { title: "message", description: "Optional group-level help or validation message." },
    ],
    variants: [
      { title: "Stack", description: "Default vertical layout for related fields." },
      { title: "Inline", description: "Compact wrapping layout for short controls." },
      {
        title: "Grid",
        description: "Two-column layout that collapses to one column on narrow viewports.",
      },
    ],
    states: [
      { title: "Default", description: "Groups related controls without owning validation logic." },
      {
        title: "Invalid",
        description:
          "Exposes aria-invalid and uses alert semantics only for active invalid messages.",
      },
    ],
    accessibility: [
      "FormGroup is server-safe and imports from @nerio/ui.",
      "Renders fieldset and legend when a title is supplied.",
      "Associates description and message text through aria-describedby.",
      "Invalid state is explicit and does not add schema or validation-library behavior.",
      "Do not use FormGroup as a replacement for Field when there is only one labeled control.",
    ],
    api: [
      { title: "title / description / message", description: "Optional group text slots." },
      { title: "layout", description: "stack, inline, or responsive grid." },
      {
        title: "invalid",
        description: "Sets data-invalid, aria-invalid, and alert semantics for message.",
      },
      { title: "className", description: "Extends the fieldset root." },
    ],
    guidance: {
      do: ["Use for related notification preferences, radio-like sections, and field clusters."],
      dont: [
        "Do not add form submission, validation-library integration, or schema behavior to FormGroup.",
      ],
    },
    tokens: [
      "--n-form-group-gap",
      "--n-form-group-inline-gap",
      "--n-form-group-title-color",
      "--n-form-group-description-color",
      "--n-form-group-message-color",
      "--n-field-gap",
    ],
  },
  select: {
    category: "Forms",
    purpose: "Use Select when a user chooses one option from a compact, known set.",
    anatomy: [
      { title: "label", description: "Base UI label that names the combobox." },
      { title: "trigger", description: "Button-like control that opens the option list." },
      { title: "value", description: "Current selection or placeholder text." },
      {
        title: "content",
        description: "Layered list with collision-aware positioning and scrolling.",
      },
      {
        title: "item",
        description: "Selectable option with optional description, highlight, and selected state.",
      },
    ],
    variants: [
      { title: "Options", description: "Concise data-driven API for a compact known list." },
      {
        title: "Composed",
        description: "Curated items, groups, labels, and separators for structured choices.",
      },
    ],
    states: [
      { title: "Open", description: "Options appear above the app layer." },
      {
        title: "Placeholder",
        description: "Placeholder text does not auto-select the first option.",
      },
      {
        title: "Highlighted",
        description: "Keyboard or pointer focus indicates the next selection.",
      },
      {
        title: "Selected",
        description: "Selected items retain a quiet selected surface and check indicator.",
      },
      { title: "Disabled", description: "Prevents choosing unavailable options." },
      {
        title: "Read-only",
        description: "Keeps the current value visible without allowing changes.",
      },
      { title: "Required", description: "Supports native form required metadata." },
      {
        title: "Invalid",
        description: "Connects error text and aria-invalid when validation fails.",
      },
    ],
    accessibility: [
      "Use a visible label and ensure options are short enough to scan.",
      "Use placeholder text only as a hint, not as the accessible name.",
      "Description and message ids are connected through aria-describedby.",
      'Error messages use role="alert" only when invalid is true.',
      "Use name, required, form, and autoComplete when the select participates in native form submission.",
      "Base UI manages combobox roles, focus restoration, Arrow key navigation, Home, End, Escape, and typeahead.",
    ],
    guidance: {
      do: ["Use for status, owner, view mode, and compact configuration choices."],
      dont: [
        "Do not use Select for large, searchable, async, or remotely loaded datasets; use a future Combobox.",
        "Do not use Select for multiple selection, tags, or creatable values.",
      ],
    },
    tokens: [
      "--n-select-height-sm",
      "--n-select-height-md",
      "--n-select-height-lg",
      "--n-select-padding-inline",
      "--n-input-radius",
      "--n-input-background",
      "--n-input-border",
      "--n-input-border-focus",
      "--n-input-placeholder",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-shadow",
    ],
  },
  toast: {
    category: "Actions and feedback",
    purpose: "Use Toast to acknowledge short-lived product events without blocking the workflow.",
    anatomy: [
      { title: "provider", description: "Client boundary that manages toast state." },
      { title: "viewport", description: "Portal layer where toasts are announced and positioned." },
      {
        title: "static content",
        description:
          "Standalone title and optional description without manager positioning or actions.",
      },
      {
        title: "managed content",
        description:
          "Manager layout for status indicator, copy, optional action, and dismiss control.",
      },
    ],
    variants: [
      { title: "Neutral", description: "General event acknowledgement." },
      {
        title: "Info, success, warning, or danger",
        description: "A restrained semantic status detail.",
      },
    ],
    states: [
      { title: "Timed", description: "Auto-dismisses after the provider or toast timeout." },
      { title: "Persistent", description: "Uses timeout 0 and always keeps a dismiss path." },
      {
        title: "Paused",
        description: "Preserves remaining time during pointer, keyboard focus, or window blur.",
      },
      {
        title: "Swiping",
        description: "Dismisses past the threshold and returns to position when cancelled.",
      },
      {
        title: "Expanded stack",
        description: "Preserves every toast's stack basis through enter, swipe, and dismissal.",
      },
      { title: "Limited", description: "Keeps overflow mounted but inert and visually hidden." },
    ],
    accessibility: [
      "Use concise messages and avoid essential decisions inside a toast.",
      "Managed low-priority messages use Base UI's polite announcement; reserve high priority for urgent failures.",
      "Base UI announces the manager title and description once, without decorative icons or action copy.",
      "Toasts never move focus when they appear. Press F6 to enter the Notifications region, then use Tab for actions and dismissal.",
      "Timers pause while the viewport is hovered, keyboard focus is within it, or the window is inactive.",
      "Inherited document direction is correct on the first interactive render and stays synchronized when the root dir attribute changes.",
      "Use inline-start or inline-end when swipe dismissal should follow the current LTR or RTL reading direction.",
      "Swipe is optional input; every managed toast retains a keyboard-reachable dismiss control.",
      "Static Toast is a presentation primitive; use ToastProvider and ToastViewport for managed notifications.",
      "Keep persistent error text in the page or form; a danger toast can only supplement it.",
    ],
    api: [
      {
        title: "ToastProvider",
        description:
          "Wraps one managed stack and configures limit, default timeout, and an optional independent manager.",
      },
      {
        title: "ToastViewport",
        description:
          "Safe-area portal target with localized landmark/dismiss labels and RTL-aware swipe direction.",
      },
      {
        title: "useToastManager",
        description:
          "Adds, updates, replaces, and removes messages; duplicate IDs update in place and refresh their timer.",
      },
      {
        title: "createToastManager",
        description:
          "Creates an isolated manager when an application intentionally needs another provider.",
      },
      {
        title: "timeout",
        description: "Milliseconds before dismissal; 0 creates a persistent toast.",
      },
      {
        title: "priority",
        description: "low is polite; high is reserved for urgent announcements.",
      },
      { title: "dismissText", description: "Localizes the visible managed toast dismiss text." },
      {
        title: "dismissLabel",
        description: "Localizes the managed toast dismiss accessible name.",
      },
      {
        title: "direction",
        description: "Overrides inherited document direction immediately with ltr or rtl.",
      },
      {
        title: "swipeDirection",
        description:
          "Accepts physical directions or logical inline-start and inline-end directions resolved from the viewport direction.",
      },
    ],
    guidance: {
      do: [
        "Confirm short-lived background events like saved, copied, or sent.",
        "Use one provider and viewport per managed stack; create a separate manager only for an intentionally isolated stack.",
      ],
      dont: [
        "Do not use Toast for destructive confirmations or blocking errors.",
        "Do not turn Toast into a notification inbox, activity feed, job manager, or persistent history.",
      ],
    },
    tokens: [
      "--n-toast-width",
      "--n-toast-viewport-inset",
      "--n-toast-stack-gap",
      "--n-toast-stack-offset",
      "--n-toast-enter-offset",
      "--n-toast-swipe-dismiss-distance",
      "--n-toast-background",
      "--n-toast-border",
      "--n-toast-shadow",
      "--n-toast-status-color",
      "--n-toast-status-background",
      "--n-toast-close-size",
      "--n-toast-close-padding-inline",
      "--n-motion-reveal-duration",
      "--n-motion-focus-duration",
    ],
  },
  card: {
    category: "Layout and display",
    purpose:
      "Use Card to group a single related object or repeated item without turning page sections into nested panels.",
    anatomy: [
      { title: "card", description: "Surface container with border, radius, and spacing tokens." },
      {
        title: "card-visual",
        description:
          "Optional generic visual slot for icons, avatars, logos, previews, or media; inset by default and edge-to-edge when placement is bleed.",
      },
      { title: "card-header", description: "Optional heading area for title and supporting copy." },
      { title: "card-title", description: "Semantic title slot for concise surface headings." },
      { title: "card-description", description: "Secondary explanatory text." },
      {
        title: "card-action",
        description: "Optional compact control or status aligned at the top end of the header.",
      },
      {
        title: "card-content",
        description: "Product content such as object title, metadata, and actions.",
      },
      { title: "card-footer", description: "Actions or metadata aligned after the content." },
    ],
    variants: [
      { title: "Default", description: "Quiet grouping for repeated items." },
      {
        title: "Secondary",
        description: "Muted borderless surface for supporting linked content.",
      },
    ],
    states: [
      { title: "Static", description: "Groups content without becoming clickable." },
      {
        title: "Inset visual",
        description: "Uses CardVisual for an icon, avatar, logo, or compact preview.",
      },
      {
        title: "Bleed visual",
        description: "Uses CardVisual placement=bleed for edge-to-edge visual content.",
      },
      {
        title: "Linked",
        description: "href renders a native anchor with hover and visible focus feedback.",
      },
    ],
    motion: [
      "Card has no default motion because grouped content should stay calm.",
      "Linked Cards use a restrained surface transition and the shared focus ring.",
    ],
    accessibility: [
      "Keep heading order and actions explicit inside the card.",
      "Use href when the full Card has one clear destination; it renders a native anchor. Do not nest interactive controls in a linked Card.",
      "Use CardAction only in a surface Card, never inside a linked Card.",
    ],
    api: [
      { title: "as", description: "section, article, or div semantic wrapper." },
      { title: "href", description: "Turns the entire Card into a native anchor destination." },
      {
        title: "variant",
        description: "default or secondary; secondary is a muted borderless surface.",
      },
      {
        title: "CardVisual",
        description:
          "Generic visual slot with inset or bleed placement; child elements own image alt text and other media semantics.",
      },
      {
        title: "CardAction",
        description: "Optional header-end slot for compact non-primary status or controls.",
      },
      {
        title: "CardHeader / CardContent / CardFooter",
        description: "Optional layout slots for predictable anatomy.",
      },
      {
        title: "CardTitle / CardDescription",
        description: "Heading and secondary text slots for documentation and registry examples.",
      },
    ],
    designNotes: [
      "Use Card for truly related content, not as a default wrapper for every section.",
      "Keep hierarchy in typography, spacing, and borders rather than shadows.",
    ],
    related: ["Separator", "Stat", "KeyValue"],
    guidance: {
      do: ["Use for repeated summaries, project cards, or compact object groups."],
      dont: ["Do not put cards inside cards or wrap entire page sections as decorative cards."],
    },
    tokens: [
      "--n-card-padding",
      "--n-card-padding-inline",
      "--n-card-padding-block",
      "--n-card-gap",
      "--n-card-radius",
      "--n-card-background-secondary",
      "--n-card-background-secondary-hover",
      "--n-card-border-secondary",
      "--n-card-border-interactive",
      "--n-card-shadow-secondary",
      "--n-focus-ring",
    ],
  },
  separator: {
    category: "Layout and display",
    purpose: "Use Separator to divide related content sections without adding visual weight.",
    anatomy: [
      { title: "root", description: "Horizontal or vertical rule using the subtle border token." },
    ],
    variants: [
      { title: "Horizontal", description: "Separates stacked content." },
      {
        title: "Vertical",
        description: "Separates inline groups when spacing alone is not enough.",
      },
    ],
    states: [
      {
        title: "Static",
        description: "Decorative by default unless exposed as structural semantics.",
      },
    ],
    accessibility: ["Use semantic sectioning when the separation changes document structure."],
    guidance: {
      do: ["Use separators sparingly to support scanability."],
      dont: ["Do not use separators as a replacement for spacing rhythm."],
    },
    tokens: ["--n-color-border-subtle"],
  },
  avatar: {
    category: "Layout and display",
    purpose: "Use Avatar to identify people, teams, or entities in compact product surfaces.",
    anatomy: [
      { title: "root", description: "Circular identity container with tokenized size." },
      { title: "image", description: "Optional supplied image." },
      { title: "fallback", description: "Initials generated from the provided name." },
    ],
    variants: [
      { title: "Image", description: "Use when a trusted image is available." },
      { title: "Fallback", description: "Use initials when no image is available." },
    ],
    states: [
      {
        title: "Loaded or fallback",
        description: "Fallback initials preserve layout when no image is supplied.",
      },
    ],
    accessibility: [
      "Decorative images and fallbacks are hidden from assistive technology.",
      "Non-decorative fallbacks expose the supplied alt text or normalized name, never initials alone.",
    ],
    guidance: {
      do: ["Pair avatars with names in dense lists when possible."],
      dont: ["Do not rely on avatar color as the only identifier."],
    },
    tokens: [
      "--n-avatar-size-sm",
      "--n-avatar-size-md",
      "--n-avatar-size-lg",
      "--n-avatar-background",
    ],
  },
  progress: {
    category: "Layout and display",
    purpose: "Use Progress to communicate the completion status of one task that takes time.",
    anatomy: [
      {
        title: "root",
        description: "The semantic progressbar with the name and normalized range ARIA.",
      },
      {
        title: "header",
        description: "Optional row rendered when a visible label or value label exists.",
      },
      {
        title: "label",
        description: "Optional visible task name that owns the internal aria-labelledby reference.",
      },
      {
        title: "value",
        description: "Optional visible completion text supplied through valueLabel.",
      },
      { title: "track", description: "Background track using muted surface tokens." },
      {
        title: "indicator",
        description: "Transform-scaled determinate fill or restrained indeterminate segment.",
      },
    ],
    variants: [
      { title: "None", description: "Progress has no visual variants, sizes, or outcome tones." },
    ],
    states: [
      {
        title: "Indeterminate",
        description: "A reliable value is unavailable, so aria-valuenow is omitted.",
      },
      { title: "Progressing", description: "A finite value is below the normalized maximum." },
      {
        title: "Complete",
        description: "The clamped value reaches the normalized maximum without changing color.",
      },
    ],
    motion: [
      "Determinate updates scale the indicator with transform instead of animating layout size.",
      "Indeterminate motion uses tokenized duration, easing, and segment width; RTL reverses its direction.",
      "Reduced motion disables transitions and animation while retaining a static partial segment.",
    ],
    accessibility: [
      "Every Progress requires exactly one accessible name through label, aria-label, or aria-labelledby.",
      "Determinate Progress exposes normalized range values; indeterminate Progress omits aria-valuenow.",
      "Use valueText for text such as 3 of 5 steps when a percentage is not sufficient.",
      "Progress is read-only and not keyboard-focusable. Do not implement it as a slider.",
      "Set aria-busy on the loading region until work completes, and avoid a separate assertive live region for frequent updates.",
    ],
    guidance: {
      do: [
        "Show determinate progress when a reliable value exists.",
        "Use indeterminate progress only while a reliable value is unavailable.",
        "Keep the label specific to one task and expose meaningful non-percentage text through valueText.",
        "Use Progress for work that takes long enough for completion feedback to be useful.",
      ],
      dont: [
        "Invent values to make an operation appear active.",
        "Use Progress as a score, capacity, battery level, health value, or other static measurement; use future Meter instead.",
        "Encode success or failure only with indicator color.",
        "Use Progress for a tiny inline wait where Spinner is more appropriate, or as a Skeleton replacement for unknown page structure.",
        "Display a completed Progress as the only confirmation that an operation succeeded.",
      ],
    },
    tokens: [
      "--n-progress-height",
      "--n-progress-radius",
      "--n-progress-gap",
      "--n-progress-header-gap",
      "--n-progress-label-color",
      "--n-progress-label-font-size",
      "--n-progress-label-font-weight",
      "--n-progress-value-color",
      "--n-progress-value-font-size",
      "--n-progress-value-font-weight",
      "--n-progress-track-background",
      "--n-progress-indicator-background",
      "--n-progress-duration",
      "--n-progress-easing",
      "--n-progress-indeterminate-duration",
      "--n-progress-indeterminate-width",
      "--n-progress-indeterminate-start",
      "--n-progress-indeterminate-end",
      "--n-progress-indeterminate-reduced-position",
    ],
    api: [
      {
        title: "value",
        description: "number | null; a finite number is clamped within the normalized range.",
      },
      {
        title: "min / max",
        description: "number; default to 0 and 100. Invalid ranges normalize back to 0–100.",
      },
      {
        title: "label",
        description:
          "ReactNode; visible task name and one of the required accessible naming paths.",
      },
      {
        title: "valueLabel",
        description: "ReactNode; optional visible completion text in the header.",
      },
      {
        title: "valueText",
        description: "string; optional localized aria-valuetext without an English default.",
      },
      {
        title: "aria-label / aria-labelledby",
        description: "Use exactly one when a visible label is not supplied.",
      },
      {
        title: "root DOM props",
        description:
          "id, className, style, aria-describedby, aria-controls, event handlers, and consumer data attributes are forwarded to the progressbar root.",
      },
    ],
    designNotes: [
      "Progress communicates task completion only. Final success, failure, cancellation, and blocked outcomes belong to Alert, Badge, or Toast.",
      "Progress is not Meter: static scores, capacity, battery levels, and health values have a separate semantic responsibility.",
    ],
    related: ["Spinner", "Skeleton", "Alert", "Toast", "Meter (future)"],
  },
  stat: {
    category: "Layout and display",
    purpose: "Use Stat to summarize a single metric with optional trend context.",
    anatomy: [
      { title: "root", description: "Metric block with label, value, and trend." },
      { title: "label", description: "Names the metric." },
      { title: "value", description: "Primary numeric or short text value." },
      { title: "trend", description: "Optional supporting comparison." },
    ],
    variants: [{ title: "Default", description: "Neutral metric summary." }],
    states: [{ title: "Static", description: "Displays a point-in-time value." }],
    accessibility: [
      "Keep labels and values readable together; do not encode meaning only in trend color.",
    ],
    guidance: {
      do: ["Use for one simple metric with a clear label."],
      dont: [
        "Do not overload one Stat with multiple metrics.",
        "Do not turn Stat into KPI Card; advanced dashboard cards belong to Pro.",
      ],
    },
    tokens: ["--n-stat-gap", "--n-font-size-2xl", "--n-color-success"],
  },
  "key-value": {
    category: "Layout and display",
    purpose: "Use KeyValue for compact metadata on records, settings, and object summaries.",
    anatomy: [
      { title: "root", description: "Native definition-list pair." },
      { title: "label", description: "Metadata key." },
      { title: "value", description: "Metadata value, text, or small component." },
    ],
    variants: [{ title: "Default", description: "Compact label/value pair." }],
    states: [{ title: "Static", description: "Reads as metadata, not a control." }],
    accessibility: ["Renders a native definition list for each label/value pair."],
    guidance: {
      do: ["Use for owner, updated date, status, and permissions."],
      dont: ["Do not use for long prose or multi-step content."],
    },
    tokens: ["--n-key-value-gap", "--n-font-size-sm", ...sharedTokens],
  },
  table: {
    category: "Layout and display",
    purpose:
      "Use Table to present structured records for scanning, comparison, and repeated operations.",
    anatomy: [
      {
        title: "container",
        description:
          "Plain overflow wrapper by default; focusable requires aria-label or aria-labelledby.",
      },
      { title: "table", description: "Native table structure for tabular data." },
      { title: "caption", description: "Optional native table name or description." },
      { title: "header", description: "Column and grouped headers." },
      { title: "body", description: "Rows of related records, including empty or loading rows." },
      { title: "footer", description: "Optional summary rows." },
      { title: "row", description: "A native table row." },
      {
        title: "head",
        description: "A native th with col scope by default and overrideable scope.",
      },
      { title: "cell", description: "A native td for values and independently labelled actions." },
    ],
    variants: [
      { title: "Default", description: "Readable data table with subtle row separation." },
    ],
    states: [
      { title: "Empty", description: "Use one correctly spanned cell inside TableBody." },
      {
        title: "Loading",
        description: "Compose aria-hidden Skeleton rows under an aria-busy region.",
      },
      {
        title: "Selected or current",
        description:
          'Consumer-owned tbody data-selected and truthful aria-current hooks; aria-current="false" remains neutral.',
      },
      {
        title: "Focus within",
        description:
          "Interactive tbody cells highlight their row without changing header or footer backgrounds.",
      },
    ],
    accessibility: [
      "Preserve native captions, row groups, headers, scope, headers, colSpan, rowSpan, and aria-sort relationships.",
      "TableContainer is plain by default; focusable={true} only creates a tab stop when aria-label or aria-labelledby is a non-empty runtime string.",
      "TableContainer owns its region role, tab stop, focusable marker, and normalized accessible-name attributes after consumer props are spread.",
      "Hover, focus-within, selected, and current row styles apply only to tbody rows; header and footer rows remain stable.",
      "Keep row links and actions as independently labelled keyboard targets; never make the whole row clickable by default.",
      "Sorting remains consumer-owned and the active column header communicates state through aria-sort.",
    ],
    guidance: {
      do: [
        "Use for comparable records, semantic headers, numeric values, and compact row actions.",
      ],
      dont: [
        "Do not use Table for layout grids or card collections.",
        "Do not nest TableContainer or add sorting, filtering, selection, pagination state, virtualization, or DataGrid behavior to this Core primitive.",
      ],
    },
    tokens: [
      "--n-table-cell-padding-y",
      "--n-table-cell-padding-x",
      "--n-table-border",
      "--n-table-container-border",
      "--n-table-container-radius",
      "--n-table-container-focus-ring",
      "--n-table-header-background",
      "--n-table-header-foreground",
      "--n-table-row-background-hover",
      "--n-table-row-background-selected",
      "--n-table-row-min-height",
      "--n-table-cell-foreground-disabled",
      "--n-table-cell-foreground-danger",
    ],
  },
  list: {
    category: "Layout and display",
    purpose:
      "Use List to present short structured items that are not tabular data and do not need selection behavior.",
    anatomy: [
      { title: "root", description: "Semantic ul by default or ol when ordered is true." },
      { title: "item", description: "One structured list item." },
      { title: "link", description: "Native anchor wrapper when an item has href." },
      { title: "title", description: "Primary item label." },
      { title: "description", description: "Optional supporting item copy." },
      { title: "meta", description: "Optional compact metadata in the trailing slot." },
    ],
    variants: [
      { title: "Unordered", description: "Default semantic list for peer items." },
      { title: "Ordered", description: "Use ordered when sequence or rank matters." },
    ],
    states: [
      { title: "Static", description: "Items without href render as non-interactive content." },
      { title: "Linked", description: "Items with href render native anchors." },
      { title: "Focus", description: "Linked items use the shared Nerio focus ring." },
    ],
    accessibility: [
      "Choose unordered or ordered semantics based on content meaning.",
      "Use href only for real destinations; do not create fake interactive list rows.",
      "linkProps may add class, events, target, rel, aria, and data attributes; item.href and the internal data-slot remain protected.",
      "Do not use List for selectable listbox, command menu, activity feed, or table behavior.",
    ],
    api: [
      {
        title: "items",
        description: "Array of title, description, meta, href, leading, and trailing values.",
      },
      {
        title: "ordered",
        description: "Renders an ol when sequence matters; otherwise renders a ul.",
      },
      {
        title: "linkProps",
        description:
          "Extends link behavior but cannot replace the canonical item.href or internal link anatomy.",
      },
      {
        title: "render",
        description:
          "Optional router link element that receives the canonical href, class, accessible props, and link data-slot.",
      },
      {
        title: "className",
        description: "Extends the list root without replacing tokenized defaults.",
      },
    ],
    guidance: {
      do: ["Use for docs links, settings summaries, compact resources, and simple object lists."],
      dont: [
        "Do not use List for DataGrid, command palette, sidebar navigation, or selectable listbox patterns.",
      ],
    },
    tokens: [
      "--n-list-gap",
      "--n-list-item-padding",
      "--n-list-item-gap",
      "--n-list-item-radius",
      "--n-list-item-background",
      "--n-list-item-background-hover",
      "--n-list-item-border",
      "--n-list-item-border-hover",
      "--n-focus-ring",
    ],
  },
  item: {
    category: "Layout and display",
    purpose:
      "Use Item to compose a compact content unit with optional media, metadata, and actions without forcing list semantics or interaction.",
    anatomy: [
      { title: "item", description: "Generic root with no implicit role." },
      { title: "item-group", description: "Optional full-width grouping container." },
      { title: "item-media", description: "Optional leading custom, icon, or image media." },
      { title: "item-content", description: "Flexible main region with safe minimum inline size." },
      { title: "item-title / item-description", description: "Primary and supporting content." },
      { title: "item-actions", description: "Independent trailing controls or compact metadata." },
      {
        title: "item-header / item-footer",
        description: "Optional full-width composition regions.",
      },
    ],
    variants: [
      {
        title: "plain",
        description: "Transparent embedded item; hover appears only for native interactive roots.",
      },
      { title: "outline", description: "Subtle bordered standalone item." },
      { title: "soft", description: "Quiet secondary surface for supporting content." },
      {
        title: "sm / md / lg",
        description: "Coordinated spacing and media dimensions for dense through rich content.",
      },
    ],
    states: [
      {
        title: "Selected",
        description: "Consumer-supplied data-selected uses the semantic selected surface.",
      },
      {
        title: "Disabled",
        description:
          "aria-disabled reduces emphasis; consumers prevent activation for native links.",
      },
      {
        title: "Loading",
        description:
          "data-loading suppresses pointer interaction while composed Skeleton or Spinner preserves layout.",
      },
    ],
    accessibility: [
      "Choose div, li, a, or button according to content meaning; Item never adds a role or keyboard handler.",
      "Use render with a native link or button only when the full item has one clear interaction.",
      "For independent trailing controls, keep the outer Item static and make only the appropriate content a link.",
      "ItemSeparator is decorative by default; meaningful media needs an accessible name or alternative text.",
    ],
    api: [
      {
        title: "variant / size",
        description: "plain, outline, soft and sm, md, lg; defaults are plain and md.",
      },
      {
        title: "render",
        description:
          "Renders the root as a supplied native semantic element such as an anchor and composes its existing ref with the forwarded Item ref.",
      },
      {
        title: "ItemMedia variant",
        description:
          "default, icon, or image; compose Avatar rather than adding an avatar variant.",
      },
      {
        title: "className and native props",
        description:
          "Every subcomponent forwards native props, className, refs, and data-slot hooks.",
      },
    ],
    guidance: {
      do: [
        "Use for settings, people, notifications, integrations, files, and compact result rows.",
      ],
      dont: [
        "Do not use for Field-controlled form options, selectable listboxes, data tables, or a product-specific activity feed.",
        "Do not nest actions inside a fully clickable Item.",
      ],
    },
    tokens: [
      "--n-item-gap",
      "--n-item-padding",
      "--n-item-radius",
      "--n-item-background-hover",
      "--n-item-background-selected",
      "--n-item-border",
      "--n-item-media-size-md",
      "--n-focus-ring",
    ],
  },
  tabs: {
    category: "Navigation and overlays",
    purpose: "Use Tabs to switch between related panels within the same context.",
    anatomy: [
      {
        title: "root",
        description: "Base UI Tabs root with visual variant, size, and orientation.",
      },
      { title: "list", description: "Named tab controls with content or horizontal fill layout." },
      {
        title: "trigger",
        description: "Visible text label with optional decorative icons and Badge.",
      },
      { title: "indicator", description: "Animated Base UI-positioned selected treatment." },
      { title: "panels", description: "Transition-safe grid wrapper for related panels." },
      { title: "content", description: "Base UI panel associated with its trigger by value." },
    ],
    variants: [
      { title: "Bordered", description: "Default edge indicator for quiet related panels." },
      {
        title: "Separate",
        description: "Independent compact triggers with a moving selected surface.",
      },
      {
        title: "Segmented",
        description: "Shared muted control surface for closely related panels.",
      },
    ],
    states: [
      { title: "Selected", description: "Active tab and visible panel." },
      { title: "Focus", description: "Inset focus treatment stays visible in scrollable lists." },
      {
        title: "Disabled",
        description: "Unavailable triggers are skipped by keyboard navigation.",
      },
      {
        title: "Manual activation",
        description: "Arrow keys move focus; Enter or Space selects by default.",
      },
    ],
    accessibility: [
      "Provide aria-label or aria-labelledby when the tablist purpose is not clear from nearby text.",
      "Base UI owns tab, tablist, tabpanel relationships and activation direction; Nerio keeps arrow navigation on enabled triggers.",
      "Every trigger needs a visible text label. Icons are decorative; Badge text remains available to assistive technology.",
      "Provide an enabled defaultValue for predictable SSR when the first trigger is disabled.",
    ],
    api: [
      {
        title: "Tabs / TabsList",
        description:
          "Base UI root and list props plus bordered, separate, segmented; sm, md, lg; content or horizontal fill; and scrollable controls.",
      },
      {
        title: "TabsTrigger",
        description:
          "Requires value and visible children; accepts leadingIcon, trailingIcon, badge, disabled, render, and nativeButton.",
      },
      {
        title: "TabsContent",
        description:
          "Accepts Base UI value, keepMounted, render, state-based className, and style.",
      },
      {
        title: "value / onValueChange",
        description:
          "Controlled selection preserves Base UI event details including activationDirection and reason.",
      },
      {
        title: "defaultValue",
        description:
          "Uncontrolled selection. Prefer an explicit enabled value for predictable server rendering.",
      },
    ],
    guidance: {
      do: [
        "Use for a small set of peer panels in one context.",
        "Keep labels concise and panels effectively immediate.",
        "Use Badge only for a short count or status and keep selected tabs visible in scrollable lists.",
      ],
      dont: [
        "Do not use Tabs for unrelated page destinations or a form selection value.",
        "Do not use icon-only or multiline triggers, deeply nested tabs, or a Badge as the only distinction.",
        "Do not enable automatic activation when switching panels has noticeable latency.",
      ],
    },
    tokens: [
      "--n-tabs-trigger-height-md",
      "--n-tabs-list-gap",
      "--n-tabs-trigger-content-gap-md",
      "--n-tabs-radius",
      "--n-tabs-list-background",
      "--n-tabs-segmented-indicator-radius",
      "--n-tabs-foreground-active",
      "--n-tabs-indicator-background",
      "--n-tabs-accent-color",
      "--n-tabs-indicator-duration",
      "--n-tabs-content-duration",
      "--n-focus-ring",
    ],
  },
  dialog: {
    category: "Navigation and overlays",
    purpose:
      "Use Dialog to focus a short task, confirmation, or decision above the current surface.",
    anatomy: [
      { title: "trigger", description: "Control that opens the dialog." },
      { title: "portal", description: "Layer that isolates overlay rendering and stacking." },
      { title: "overlay", description: "Backdrop that separates the dialog from the page." },
      { title: "content", description: "Modal surface with title, description, and actions." },
    ],
    variants: [
      { title: "Task", description: "Short focused task with clear completion." },
      { title: "Confirmation", description: "Decision point for sensitive actions." },
    ],
    states: [
      { title: "Open", description: "Focus moves into the dialog." },
      { title: "Closed", description: "Focus returns to the trigger." },
    ],
    accessibility: [
      "Use a clear title, keep focus contained, and avoid opening dialogs from dialogs.",
      "Base UI handles modal focus trapping, Escape dismissal, outside dismissal, and return focus.",
      "Use open/defaultOpen/onOpenChange when state must be coordinated by the parent.",
    ],
    api: [
      { title: "trigger", description: "React node or text that opens the dialog." },
      {
        title: "title / description",
        description: "Accessible dialog heading and optional context.",
      },
      { title: "bodyClassName", description: "Optional class hook for the body slot." },
    ],
    guidance: {
      do: ["Use for short decisions that need context without a route change."],
      dont: ["Do not use Dialog for long, multi-page workflows."],
    },
    tokens: [
      "--n-dialog-width-md",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-backdrop",
      "--n-overlay-foreground",
      "--n-overlay-shadow",
      "--n-motion-overlay-enter-duration",
      "--n-motion-overlay-exit-duration",
      "--n-focus-ring",
    ],
  },
  "sidebar-primitive": {
    category: "Navigation and layout",
    purpose:
      "Use Sidebar Primitive for a persistent collapsible page region while keeping routes, navigation data, menus, permissions, and persistence in consumer code.",
    anatomy: [
      { title: "provider", description: "Owns controlled or uncontrolled expanded state." },
      { title: "sidebar", description: "Complementary aside with physical side and state data." },
      { title: "header", description: "Stable leading region for consumer content." },
      {
        title: "content",
        description: "Scrollable div region with an exact HTMLDivElement ref contract.",
      },
      { title: "footer", description: "Stable trailing region for consumer content." },
      {
        title: "rail",
        description: "Named, vertically centered toggle bounded to the declared hit-area token.",
      },
      { title: "inset", description: "Primary page content adjacent to the sidebar." },
      { title: "trigger", description: "External named control for expansion and collapse." },
    ],
    variants: [
      { title: "Left", description: "Physical left placement; this is the default." },
      {
        title: "Right",
        description: "Physical right placement without changing content direction.",
      },
      {
        title: "Direction",
        description: "Explicit ltr or rtl content direction while side remains physical.",
      },
      {
        title: "Density",
        description: "Comfortable and compact spacing resolve through shared tokens.",
      },
    ],
    states: [
      { title: "Expanded", description: "All static regions and consumer content are available." },
      {
        title: "Collapsed",
        description: "Inner content is inert, hidden, and removed from keyboard interaction.",
      },
      {
        title: "Controlled",
        description: "expanded and onExpandedChange let consumers own state and persistence.",
      },
    ],
    motion: [
      "Width and content visibility use the Sidebar transition tokens.",
      "Reduced-motion preference removes the visible transition without changing state behavior.",
    ],
    accessibility: [
      "Sidebar renders an aside landmark; add a labelled nav inside SidebarContent for navigation.",
      "SidebarTrigger and SidebarRail require localized labels and expose aria-expanded and aria-controls.",
      "Give the trigger and rail distinct labels when both render so each control is unambiguous.",
      "The rail occupies only its declared hit area and does not create a full-height invisible click target.",
      "Collapsed descendants are inert so invisible links and controls cannot receive focus.",
      "Keep the trigger in SidebarInset or use SidebarRail so collapsing does not remove the focused control.",
      "The primitive adds no roving focus or Arrow-key behavior to arbitrary consumer navigation.",
      "Render one interactive tree per viewport; use an explicit Sheet composition for mobile.",
    ],
    api: [
      {
        title: "SidebarProvider",
        description:
          "defaultExpanded, expanded, onExpandedChange, side, direction, and optional sidebarId.",
      },
      {
        title: "Sidebar",
        description: "Client root that reflects provider state through data-state and data-side.",
      },
      {
        title: "SidebarHeader / SidebarContent / SidebarFooter / SidebarInset",
        description:
          "Server-safe layout regions with native props, stable refs, and an exact div contract for SidebarContent.",
      },
      {
        title: "SidebarTrigger / SidebarRail",
        description: "Named toggle controls with stable focus and ARIA relationships.",
      },
      {
        title: "useSidebar",
        description: "Exposes expanded, setExpanded, toggle, side, direction, and sidebarId.",
      },
    ],
    designNotes: [
      "Persistence is consumer-owned. Read storage before choosing controlled state and write from onExpandedChange.",
      "For mobile, render the shared navigation data inside Sheet instead of turning Sidebar into an AppShell.",
      "AppSidebar, workspace switching, nested navigation, route matching, account menus, badges, and permissions remain Pro or consumer responsibilities.",
    ],
    guidance: {
      do: [
        "Use for a neutral persistent layout region that composes consumer-owned content.",
        "Use controlled state when a product needs localStorage or cookie persistence.",
      ],
      dont: [
        "Do not add route matching, navigation schemas, persistence, authorization, or account behavior to Core Sidebar.",
        "Do not render desktop Sidebar and mobile Sheet as two simultaneously focusable trees.",
      ],
    },
    related: ["Sheet", "Button", "Tooltip", "Separator"],
    tokens: [
      "--n-sidebar-width",
      "--n-sidebar-collapsed-width",
      "--n-sidebar-inset-gap",
      "--n-sidebar-region-padding",
      "--n-sidebar-rail-hit-area",
      "--n-sidebar-transition-duration",
      "--n-sidebar-transition-easing",
      "--n-sidebar-background",
      "--n-sidebar-border",
      "--n-focus-ring",
    ],
  },
  "command-primitive": {
    category: "Navigation and layout",
    purpose:
      "Use Command for an accessible local action picker whose query, results, and selection events remain composable and consumer-owned.",
    anatomy: [
      { title: "Command", description: "Inline Base UI autocomplete root and item data contract." },
      {
        title: "CommandInput",
        description: "Required named combobox input that retains DOM focus.",
      },
      {
        title: "CommandList",
        description: "Listbox with filtered flat or grouped item rendering.",
      },
      {
        title: "CommandGroup / CommandGroupLabel",
        description: "Semantically labelled related actions.",
      },
      {
        title: "CommandItem",
        description:
          "Stable action value with optional semantic leading content, description, metadata, and Kbd.",
      },
      { title: "CommandSeparator", description: "Quiet boundary between related result regions." },
      {
        title: "CommandEmpty / CommandLoading",
        description: "Polite Base UI status regions outside listbox children.",
      },
    ],
    variants: [
      {
        title: "Local filtering",
        description:
          "Locale-aware matching uses labels, values, and keywords while selection writes only the visible label.",
      },
      {
        title: "Consumer-filtered",
        description: "filter={false} keeps remote or externally filtered results unchanged.",
      },
      {
        title: "Grouped",
        description: "Group records render labelled result groups without changing item values.",
      },
      {
        title: "Overlay composition",
        description: "Compose the same inline primitive inside Popover, Dialog, or Sheet.",
      },
    ],
    states: [
      {
        title: "Active",
        description: "Virtual focus stays on the input through aria-activedescendant.",
      },
      {
        title: "Disabled",
        description: "Unavailable items remain visible and are skipped during navigation.",
      },
      { title: "Empty", description: "A concise polite message replaces missing results." },
      {
        title: "Loading",
        description: "A single polite status combines Spinner and localized text.",
      },
    ],
    motion: [
      "Command itself does not animate active-item movement or query updates.",
      "Popover, Dialog, and Sheet retain their own reduced-motion-aware overlay behavior.",
    ],
    accessibility: [
      "CommandInput requires a visible label, aria-label, or aria-labelledby.",
      "Arrow keys move the active option while DOM focus remains in the input; Home and End retain native text-editing behavior.",
      "Enter selects the active enabled item and emits its stable value with the Base UI event; Escape bubbles to enclosing overlays.",
      "Base UI suppresses Enter selection during IME composition and skips disabled items.",
      "CommandItem leading content owns its accessibility semantics; decorative Nerio Icons remain hidden through the Icon contract.",
      "CommandEmpty and CommandLoading use dedicated polite status parts rather than invalid arbitrary listbox children.",
      "Provide localized visible labels and keep Kbd supplemental; global shortcut registration is outside Core Command.",
    ],
    api: [
      {
        title: "items",
        description:
          "Flat CommandItemData records or labelled CommandGroupData records with stable unique values.",
      },
      {
        title: "query / defaultQuery / onQueryChange",
        description:
          "Controlled or uncontrolled visible query state; selection writes only the item label.",
      },
      {
        title: "filter",
        description:
          "Typed custom matcher, default locale-aware contains behavior, or false for consumer-filtered results.",
      },
      {
        title: "onActiveValueChange",
        description: "Reports highlighted stable values without exposing internal focus indices.",
      },
      {
        title: "CommandItem.onSelect",
        description:
          "Emits the stable string value and event while visible query text remains label-only.",
      },
    ],
    designNotes: [
      "Command is not GlobalSearch, EntitySearch, Documentation Search, or a complete Command Palette.",
      "Fetching, ranking, routing, permissions, analytics, history, recent items, and global shortcuts stay outside Core.",
      "Use consumer state to replace items and toggle CommandLoading for asynchronous results.",
      "Leading content is general React content and owns its semantics; use decorative Nerio Icons when no accessible meaning is needed.",
    ],
    guidance: {
      do: [
        "Use for local action menus, compact action pickers, and a reusable result interaction primitive.",
        "Compose icons, descriptions, metadata, and Nerio Kbd through CommandItem slots.",
      ],
      dont: [
        "Do not add hidden fuzzy ranking, remote fetching, route navigation, or global shortcut registration to Command.",
        "Do not present a complete product command palette as the Core primitive.",
      ],
    },
    related: ["Popover", "Dialog", "Sheet", "Kbd", "Empty State", "Spinner"],
    tokens: [
      "--n-command-width",
      "--n-command-list-max-height",
      "--n-command-input-height",
      "--n-command-item-height",
      "--n-command-item-padding-block",
      "--n-command-item-padding-inline",
      "--n-command-group-spacing",
      "--n-command-background",
      "--n-command-border",
      "--n-command-item-background-active",
      "--n-focus-ring",
    ],
  },
  sheet: {
    category: "Navigation and overlays",
    purpose:
      "Use Sheet for a focused modal panel that needs more room than a popover without becoming a product shell.",
    anatomy: [
      { title: "trigger", description: "Consumer-rendered control that opens the modal panel." },
      { title: "backdrop", description: "Modal backdrop that separates the panel from its page." },
      {
        title: "content",
        description: "Focusable side, top, or bottom panel with a size contract.",
      },
      { title: "header", description: "Optional title and description boundary." },
      { title: "body", description: "Internally scrollable content region for long content." },
      { title: "footer", description: "Optional persistent action boundary." },
      {
        title: "close",
        description: "Accessible close control, or a consumer-supplied alternative.",
      },
    ],
    variants: [
      {
        title: "Sides",
        description: "Explicit left, right, top, and bottom placement; right is the default.",
      },
      {
        title: "Sizes",
        description: "sm, md, and lg scale the panel axis without changing its responsibility.",
      },
    ],
    states: [
      {
        title: "Open",
        description: "Focus is contained in the modal panel and the page scroll is locked.",
      },
      { title: "Closed", description: "The panel is removed and focus returns to its trigger." },
      {
        title: "Long content",
        description: "The body scrolls while header and footer remain available.",
      },
    ],
    motion: [
      "Entry and exit direction follow side and use the shared overlay timing and easing contracts.",
      "Reduced motion disables both enter and exit animation without changing the final state.",
    ],
    accessibility: [
      "Provide an accessible name with SheetTitle or an explicit aria-label or aria-labelledby on SheetContent.",
      "Base UI provides modal focus trapping, focus restoration, Escape dismissal, backdrop dismissal, and scroll locking.",
      "Keep a keyboard-reachable SheetClose or another clear close path when showClose is false.",
      "Use viewport-fit=cover in the product viewport metadata so mobile Safari exposes safe-area insets to Sheet padding and the default close.",
      "Physical left and right placement stay explicit for RTL content.",
    ],
    api: [
      {
        title: "Sheet",
        description:
          "Controlled or uncontrolled Base UI Dialog root: open, defaultOpen, and onOpenChange.",
      },
      {
        title: "SheetContent",
        description:
          "Accepts side, size, showClose, closeLabel, className, refs, and native dialog popup props.",
      },
      {
        title: "SheetTrigger",
        description:
          "Uses Base UI render composition so consumers supply their own trigger element.",
      },
      {
        title: "SheetHeader / SheetTitle / SheetDescription",
        description: "Named accessible context slots.",
      },
      {
        title: "SheetBody / SheetFooter / SheetClose",
        description:
          "Scrollable content, action, and dismissal boundaries. SheetClose is neutral in normal flow and supports Button render composition.",
      },
    ],
    guidance: {
      do: [
        "Use for a small settings surface, mobile navigation, or contextual details owned by the consumer.",
        "Keep one clear task and give the panel a concise accessible name.",
      ],
      dont: [
        "Do not use Sheet as a persistent sidebar, resizable panel, AppShell, or routing container.",
        "Do not hide the only close path when showClose is false.",
      ],
    },
    related: ["Dialog", "Popover", "Button"],
    tokens: [
      "--n-sheet-width-sm",
      "--n-sheet-width-md",
      "--n-sheet-width-lg",
      "--n-sheet-height-sm",
      "--n-sheet-height-md",
      "--n-sheet-height-lg",
      "--n-sheet-padding",
      "--n-sheet-gap",
      "--n-sheet-radius",
      "--n-sheet-backdrop",
      "--n-sheet-transition-distance",
      "--n-motion-overlay-enter-duration",
      "--n-motion-overlay-enter-easing",
      "--n-motion-overlay-exit-duration",
      "--n-motion-overlay-exit-easing",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border-width",
      "--n-overlay-border",
      "--n-overlay-shadow",
      "--n-overlay-foreground",
      "--n-focus-ring",
    ],
  },
  popover: {
    category: "Navigation and overlays",
    purpose: "Use Popover for contextual controls or details tied to a trigger.",
    anatomy: [
      { title: "trigger", description: "Control that opens the popover." },
      { title: "content", description: "Layered panel with controls or supporting content." },
      { title: "arrow", description: "Optional visual pointer when spatial context helps." },
    ],
    variants: [{ title: "Default", description: "Contextual panel near a trigger." }],
    states: [
      { title: "Open", description: "Panel is visible and keyboard reachable." },
      { title: "Closed", description: "Panel is removed from the layer." },
    ],
    accessibility: [
      "Do not hide essential page content only inside a transient popover.",
      "Use title or description when popover content needs context.",
      "Use open/defaultOpen/onOpenChange only when the parent needs to coordinate state.",
    ],
    api: [
      { title: "trigger", description: "React node or text that opens the popover." },
      { title: "title / description", description: "Optional context before the body content." },
      { title: "children", description: "Interactive or supporting content inside the popup." },
    ],
    guidance: {
      do: ["Use for filters, quick metadata, or lightweight editing controls."],
      dont: ["Do not use Popover for destructive confirmations."],
    },
    tokens: [
      "--n-popover-width-md",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-foreground",
      "--n-overlay-shadow",
      "--n-motion-overlay-enter-duration",
    ],
  },
  tooltip: {
    category: "Navigation and overlays",
    purpose: "Use Tooltip to clarify compact controls or truncated metadata.",
    anatomy: [
      { title: "trigger", description: "Element that receives hover or focus." },
      { title: "content", description: "Short non-interactive explanation." },
    ],
    variants: [{ title: "Default", description: "Small text label in the overlay layer." }],
    states: [
      { title: "Visible", description: "Appears on hover or focus after a short delay." },
      { title: "Hidden", description: "Dismisses when trigger loses hover or focus." },
    ],
    accessibility: [
      "Tooltip triggers must be elements; prefer keyboard-focusable controls and do not put required instructions in tooltip content.",
      "Use disabled when a tooltip should be suppressed for a disabled or unavailable trigger.",
    ],
    api: [
      { title: "label", description: "Short non-essential explanatory content." },
      { title: "children", description: "Trigger element; text children are wrapped in a span." },
      { title: "disabled", description: "Prevents tooltip display while preserving the trigger." },
    ],
    guidance: {
      do: ["Use to name icon-only actions or clarify dense metadata."],
      dont: ["Do not put buttons, links, or critical content inside Tooltip."],
    },
    tokens: [
      "--n-tooltip-radius",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-foreground",
      "--n-overlay-shadow",
      "--n-motion-overlay-enter-duration",
    ],
  },
  "dropdown-menu": {
    category: "Navigation and overlays",
    purpose: "Use DropdownMenu to group secondary commands behind a compact trigger.",
    anatomy: [
      { title: "trigger", description: "Control that opens the command list." },
      { title: "content", description: "Layered menu surface." },
      { title: "item", description: "Command row with optional destructive intent." },
    ],
    variants: [
      { title: "Default", description: "Neutral command groups." },
      {
        title: "Destructive item",
        description: "Marks risky commands without making the whole menu destructive.",
      },
    ],
    states: [
      { title: "Open", description: "Items are keyboard navigable." },
      { title: "Highlighted", description: "Current item is ready for selection." },
      { title: "Disabled", description: "Unavailable items stay in context without activation." },
    ],
    accessibility: ["Keep labels action-oriented and support keyboard navigation through Base UI."],
    api: [
      {
        title: "items",
        description: "Small list of label, onSelect, disabled, and destructive flags.",
      },
      { title: "disabled item", description: "Stays visible in context without activation." },
      {
        title: "destructive item",
        description: "Marks risky commands without changing the whole menu tone.",
      },
    ],
    guidance: {
      do: ["Use for Rename, Duplicate, Archive, and similar secondary commands."],
      dont: ["Do not hide the primary page action inside a menu."],
    },
    tokens: [
      "--n-dropdown-min-width",
      "--n-overlay-z-index",
      "--n-overlay-background",
      "--n-overlay-border",
      "--n-overlay-shadow",
      "--n-color-status-danger",
      "--n-motion-overlay-enter-duration",
      "--n-focus-ring",
    ],
  },
};
