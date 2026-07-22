"use client";

import * as React from "react";
import {
  Bell,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  FileText,
  Info,
  LayoutDashboard,
  Mail,
  Search,
  Settings,
  Sparkles,
  UserPlus,
} from "@nerio-ui/adapters/icons";
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
  CardFooter,
  CardHeader,
  CardTitle,
  CardVisual,
  Checkbox,
  Code,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DialogFooter,
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
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  Kbd,
  KeyValue,
  Label,
  LabelContent,
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
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Skeleton,
  Slider,
  Spinner,
  Stat,
  Switch,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Text,
  Textarea,
  Toast,
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";

const componentLinks = [
  [
    "Actions",
    [
      ["Button", "button"],
      ["Button Group", "button-group"],
    ],
  ],
  [
    "Forms",
    [
      ["Input", "input"],
      ["FileInput", "file-input"],
      ["Input Group", "input-group"],
      ["Textarea", "textarea"],
      ["Label", "label"],
      ["Field", "field"],
      ["Form Message", "form-message"],
      ["Form Group", "form-group"],
      ["Checkbox", "checkbox"],
      ["Radio Group", "radio-group"],
      ["Switch", "switch"],
      ["Select", "select"],
      ["Slider", "slider"],
    ],
  ],
  [
    "Overlays",
    [
      ["Dialog", "dialog"],
      ["Sheet", "sheet"],
      ["Popover", "popover"],
      ["Tooltip", "tooltip"],
      ["Dropdown Menu", "dropdown-menu"],
    ],
  ],
  [
    "Data display",
    [
      ["Card", "card"],
      ["Badge", "badge"],
      ["Avatar", "avatar"],
      ["Table", "table"],
      ["Item", "item"],
      ["List", "list"],
      ["Separator", "separator"],
      ["Key Value", "key-value"],
      ["Stat", "stat"],
    ],
  ],
  [
    "Feedback",
    [
      ["Alert", "alert"],
      ["Toast", "toast"],
      ["Progress", "progress"],
      ["Skeleton", "skeleton"],
      ["Empty State", "empty-state"],
      ["Spinner", "spinner"],
    ],
  ],
  [
    "Navigation",
    [
      ["Tabs", "tabs"],
      ["Breadcrumbs", "breadcrumbs"],
      ["Pagination", "pagination"],
      ["Sidebar", "sidebar-primitive"],
      ["Command", "command-primitive"],
    ],
  ],
  [
    "Foundation",
    [
      ["Typography", "typography"],
      ["Kbd", "kbd"],
      ["Icon", "icon"],
    ],
  ],
] as const;

function SpecimenSection({
  id,
  title,
  api,
  children,
}: {
  id: string;
  title: string;
  api: string;
  children: React.ReactNode;
}) {
  return (
    <section className="component-lab-section" id={id}>
      <header>
        <div>
          <span>Core component</span>
          <h2>{title}</h2>
        </div>
        <a href={`/docs/components/${id}`}>View docs</a>
      </header>
      <p className="component-lab-section__api">{api}</p>
      {children}
    </section>
  );
}

function Matrix({
  columns,
  rows,
}: {
  columns: string[];
  rows: Array<{ label: string; cells: React.ReactNode[] }>;
}) {
  return (
    <div className="component-api-matrix">
      <table>
        <thead>
          <tr>
            <th scope="col">API</th>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              {row.cells.map((cell, index) => (
                <td key={`${row.label}-${columns[index]}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TabsExample({
  variant,
  size = "md",
}: {
  variant: "segmented" | "separate" | "bordered";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <Tabs defaultValue="overview" variant={variant} size={size}>
      <TabsList aria-label={`${variant} tabs`}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsPanels>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="activity">Activity panel</TabsContent>
        <TabsContent value="disabled">Unavailable</TabsContent>
      </TabsPanels>
    </Tabs>
  );
}

function ToastActions() {
  const toast = useToastManager();
  return (
    <div className="component-lab-inline">
      <Button
        size="sm"
        onClick={() =>
          toast.add({
            id: `saved-${Date.now()}`,
            title: "Changes saved",
            description: "The managed viewport announces this update.",
            data: { tone: "success" },
          })
        }
      >
        Managed toast
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          toast.add({
            id: `action-${Date.now()}`,
            title: "Export ready",
            description: "The notification remains available until dismissed.",
            timeout: 0,
            data: { tone: "info", action: { label: "Open", onClick: () => undefined } },
          })
        }
      >
        Toast with action
      </Button>
    </div>
  );
}

const commandItems = [
  { value: "dashboard", label: "Dashboard", keywords: ["home"] },
  { value: "activity", label: "Activity" },
  { value: "settings", label: "Settings" },
  { value: "disabled", label: "Unavailable", disabled: true },
] as const;

function SheetExample({
  side,
  size,
}: {
  side: "left" | "right" | "top" | "bottom";
  size: "sm" | "md" | "lg";
}) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size="sm" variant="secondary">
            {side} · {size}
          </Button>
        }
      />
      <SheetContent side={side} size={size}>
        <SheetHeader>
          <SheetTitle>{side} sheet</SheetTitle>
          <SheetDescription>Side and size are public visual API.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <Input aria-label="Workspace name" placeholder="Workspace name" defaultValue="Atlas" />
        </SheetBody>
        <SheetFooter>
          <SheetClose
            render={
              <Button size="sm" variant="secondary">
                Cancel
              </Button>
            }
          />
          <Button size="sm">Save</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function ComponentPlayground() {
  return (
    <>
      <header className="component-lab-hero">
        <div>
          <span>Current Core API coverage</span>
          <h1>Core visual API</h1>
          <p>
            Only implemented components are rendered. Foundation-only chart aliases remain editable
            in Colors, but no chart specimen is shown because Core has no Chart component. Labels
            are visually omitted in compact examples while accessible names remain explicit.
          </p>
        </div>
        <Badge tone="success">Stable Core</Badge>
      </header>
      <nav className="component-lab-index" aria-label="Component index">
        {componentLinks.map(([group, links]) => (
          <div key={group}>
            <strong>{group}</strong>
            {links.map(([label, id]) => (
              <a href={`#${id}`} key={id}>
                {label}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <SpecimenSection
        id="typography"
        title="Typography"
        api="Heading: as, size · Text: tone · Code"
      >
        <Matrix
          columns={["Default", "Secondary", "Tertiary"]}
          rows={[
            {
              label: "Text tone",
              cells: [
                <Text key="d">Default text</Text>,
                <Text key="s" tone="secondary">
                  Secondary text
                </Text>,
                <Text key="t" tone="tertiary">
                  Tertiary text
                </Text>,
              ],
            },
          ]}
        />
        <div className="component-lab-type-scale">
          {(["2xl", "xl", "lg", "md", "sm", "xs"] as const).map((size) => (
            <Heading as="h3" size={size} key={size}>
              {size} · The quick brown fox
            </Heading>
          ))}
          <Code>const theme = "nerio"</Code>
        </div>
      </SpecimenSection>
      <SpecimenSection id="kbd" title="Kbd" api="Keyboard hint · single key · shortcut sequence">
        <div className="component-lab-inline">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
          <Kbd>Shift</Kbd>
          <span>
            <Kbd>⌘</Kbd> + <Kbd>Enter</Kbd>
          </span>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="icon"
        title="Icon"
        api="Adapter-owned icon component · inherited size and stroke"
      >
        <div className="component-lab-icon-grid">
          {[Search, Bell, Settings, FileText, Sparkles, UserPlus].map((icon, index) => (
            <Icon icon={icon} key={index} />
          ))}
        </div>
      </SpecimenSection>

      <SpecimenSection
        id="button"
        title="Button"
        api="variant · size · loading · disabled · icons · badge · kbd · tooltip · render"
      >
        <Matrix
          columns={["sm", "md", "lg", "Disabled", "Loading"]}
          rows={(["primary", "secondary", "outline", "ghost", "link", "danger"] as const).map(
            (variant) => ({
              label: variant,
              cells: [
                <Button key="sm" size="sm" variant={variant}>
                  Action
                </Button>,
                <Button key="md" size="md" variant={variant}>
                  Action
                </Button>,
                <Button key="lg" size="lg" variant={variant}>
                  Action
                </Button>,
                <Button key="disabled" variant={variant} disabled>
                  Action
                </Button>,
                <Button key="loading" variant={variant} loading>
                  Action
                </Button>,
              ],
            }),
          )}
        />
        <div className="component-lab-inline">
          <Button leadingIcon={Sparkles}>Leading</Button>
          <Button trailingIcon={ChevronDown} variant="secondary">
            Trailing
          </Button>
          <Button badge={<Badge tone="primary-soft">8</Badge>} variant="secondary">
            Inbox
          </Button>
          <Button kbd="⌘ K" variant="secondary">
            Command
          </Button>
          <Button icon={Copy} aria-label="Copy" tooltip="Copy to clipboard" variant="ghost" />
        </div>
      </SpecimenSection>

      <SpecimenSection id="button-group" title="Button Group" api="orientation · grouped actions">
        <div className="component-lab-inline">
          <ButtonGroup>
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
          </ButtonGroup>
          <ButtonGroup orientation="vertical">
            <Button variant="secondary">Top</Button>
            <Button variant="secondary">Middle</Button>
            <Button variant="secondary">Bottom</Button>
          </ButtonGroup>
        </div>
      </SpecimenSection>

      <SpecimenSection
        id="input"
        title="Input"
        api="size · type · invalid · readOnly · disabled · required"
      >
        <Matrix
          columns={["Default", "Filled", "Read only", "Invalid", "Disabled"]}
          rows={(["sm", "md", "lg"] as const).map((size) => ({
            label: size,
            cells: [
              <Input key="default" size={size} placeholder="Placeholder" />,
              <Input key="filled" size={size} defaultValue="Value" />,
              <Input key="readonly" size={size} defaultValue="Read only" readOnly />,
              <Input key="invalid" size={size} defaultValue="Invalid" invalid />,
              <Input key="disabled" size={size} defaultValue="Disabled" disabled />,
            ],
          }))}
        />
      </SpecimenSection>
      <SpecimenSection
        id="file-input"
        title="File Input"
        api="size · accept · capture · multiple · required · invalid · disabled"
      >
        <Matrix
          columns={["Single", "Multiple", "Invalid", "Disabled"]}
          rows={(["sm", "md", "lg"] as const).map((size) => ({
            label: size,
            cells: [
              <FileInput key="single" aria-label={`${size} single file`} size={size} />,
              <FileInput
                key="multiple"
                aria-label={`${size} multiple files`}
                size={size}
                multiple
              />,
              <FileInput key="invalid" aria-label={`${size} invalid file`} size={size} invalid />,
              <FileInput
                key="disabled"
                aria-label={`${size} disabled file`}
                size={size}
                disabled
              />,
            ],
          }))}
        />
      </SpecimenSection>
      <SpecimenSection
        id="input-group"
        title="Input Group"
        api="start addon · end addon · combined addons"
      >
        <div className="component-lab-form-row">
          <InputGroup>
            <InputGroupAddon placement="start">
              <Icon icon={Mail} />
            </InputGroupAddon>
            <Input placeholder="Email" />
          </InputGroup>
          <InputGroup>
            <Input placeholder="Amount" />
            <InputGroupAddon placement="end">USD</InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon placement="start">https://</InputGroupAddon>
            <Input placeholder="domain.com" />
            <InputGroupAddon placement="end">↗</InputGroupAddon>
          </InputGroup>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="textarea"
        title="Textarea"
        api="default · filled · invalid · readOnly · disabled"
      >
        <Matrix
          columns={["Default", "Invalid", "Read only", "Disabled"]}
          rows={[
            {
              label: "State",
              cells: [
                <Textarea key="default" placeholder="Write a note…" />,
                <Textarea key="invalid" defaultValue="Needs attention" aria-invalid />,
                <Textarea key="readonly" defaultValue="Read-only content" readOnly />,
                <Textarea key="disabled" defaultValue="Unavailable" disabled />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="label"
        title="Label"
        api="Label · LabelRow · LabelContent · LabelRequired"
      >
        <div className="component-lab-form-row">
          <Label htmlFor="label-demo">Standard label</Label>
          <LabelRow>
            <LabelContent>
              Required field <LabelRequired />
            </LabelContent>
            <Tooltip label="Why this is required">
              <Button icon={Info} aria-label="Required field help" size="sm" variant="ghost" />
            </Tooltip>
          </LabelRow>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="field"
        title="Field"
        api="label · description · message · invalid · automatic IDs"
      >
        <div className="component-lab-form-row">
          <Field label="Project name" description="Visible to workspace members.">
            <Input defaultValue="Atlas" />
          </Field>
          <Field label="Email" message="Enter a work email." invalid>
            <Input defaultValue="maya@example" />
          </Field>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="form-message"
        title="Form Message"
        api="neutral · success · danger · alert semantics"
      >
        <div className="component-lab-stack">
          <FormMessage>Helper message</FormMessage>
          <FormMessage tone="success">Saved successfully.</FormMessage>
          <FormMessage tone="danger" role="alert">
            This value is invalid.
          </FormMessage>
        </div>
      </SpecimenSection>
      <SpecimenSection id="form-group" title="Form Group" api="stack · inline · grid · invalid">
        <div className="component-lab-form-row">
          <FormGroup title="Stack" description="Default layout">
            <Checkbox defaultChecked /> <Checkbox />
          </FormGroup>
          <FormGroup title="Inline" layout="inline">
            <Checkbox defaultChecked /> <Checkbox /> <Checkbox />
          </FormGroup>
          <FormGroup title="Grid" layout="grid" invalid message="Review both fields.">
            <Input defaultValue="One" />
            <Input invalid defaultValue="Two" />
          </FormGroup>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="checkbox"
        title="Checkbox"
        api="unchecked · checked · indeterminate · disabled · readOnly"
      >
        <Matrix
          columns={["Unchecked", "Checked", "Indeterminate", "Disabled"]}
          rows={[
            {
              label: "State",
              cells: [
                <Checkbox key="off" />,
                <Checkbox key="on" defaultChecked />,
                <Checkbox key="mixed" indeterminate />,
                <span key="disabled" className="component-lab-inline">
                  <Checkbox disabled />
                  <Checkbox disabled defaultChecked />
                </span>,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="radio-group"
        title="Radio Group"
        api="label · description · message · options · composed items · disabled"
      >
        <RadioGroup
          label="Visibility"
          description="Choose one option."
          name="lab-visibility"
          defaultValue="team"
        >
          <RadioGroupItem value="private" description="Only invited members.">
            Private
          </RadioGroupItem>
          <RadioGroupItem value="team" description="Everyone in the workspace.">
            Team
          </RadioGroupItem>
          <RadioGroupItem value="public" disabled>
            Public
          </RadioGroupItem>
        </RadioGroup>
      </SpecimenSection>
      <SpecimenSection id="switch" title="Switch" api="off · on · disabled · readOnly">
        <Matrix
          columns={["Off", "On", "Disabled off", "Disabled on"]}
          rows={[
            {
              label: "State",
              cells: [
                <Switch key="off" />,
                <Switch key="on" defaultChecked />,
                <Switch key="doff" disabled />,
                <Switch key="don" disabled defaultChecked />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="select"
        title="Select"
        api="size · options · placeholder · disabled · invalid · grouped composition"
      >
        <Matrix
          columns={["sm", "md", "lg", "Invalid", "Disabled"]}
          rows={[
            {
              label: "Trigger",
              cells: [
                <Select
                  key="sm"
                  label="Small"
                  size="sm"
                  aria-label="Small select"
                  defaultValue="active"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Paused", value: "paused" },
                  ]}
                />,
                <Select
                  key="md"
                  label="Medium"
                  size="md"
                  aria-label="Medium select"
                  placeholder="Choose status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Paused", value: "paused" },
                  ]}
                />,
                <Select
                  key="lg"
                  label="Large"
                  size="lg"
                  aria-label="Large select"
                  defaultValue="paused"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Paused", value: "paused" },
                  ]}
                />,
                <Select
                  key="invalid"
                  label="Invalid"
                  aria-label="Invalid select"
                  invalid
                  placeholder="Required"
                  options={[{ label: "Active", value: "active" }]}
                />,
                <Select
                  key="disabled"
                  label="Disabled"
                  aria-label="Disabled select"
                  disabled
                  placeholder="Unavailable"
                  options={[{ label: "Active", value: "active" }]}
                />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="slider"
        title="Slider"
        api="single value · horizontal · vertical · disabled · readOnly"
      >
        <Matrix
          columns={["Default", "Read only", "Disabled", "Vertical"]}
          rows={[
            {
              label: "State",
              cells: [
                <Slider key="default" aria-label="Default volume" defaultValue={40} />,
                <Slider key="readonly" aria-label="Read-only volume" defaultValue={70} readOnly />,
                <Slider key="disabled" aria-label="Disabled volume" defaultValue={25} disabled />,
                <Slider
                  key="vertical"
                  aria-label="Vertical volume"
                  defaultValue={60}
                  orientation="vertical"
                />,
              ],
            },
          ]}
        />
      </SpecimenSection>

      <SpecimenSection
        id="dialog"
        title="Dialog"
        api="controlled or uncontrolled open · title · description · body · close label"
      >
        <div className="component-lab-inline">
          <Dialog
            trigger={<Button>Open dialog</Button>}
            title="Invite people"
            description="Share the workspace with your team."
          >
            <Input aria-label="Email" placeholder="name@company.com" />
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button>Send invite</Button>
            </DialogFooter>
          </Dialog>
          <Dialog
            trigger={<Button variant="secondary">Long content</Button>}
            title="Review changes"
            description="Dialog body supports structured content."
          >
            <div className="component-lab-stack">
              <Text>Review permissions before publishing.</Text>
              <Alert tone="warning" title="Two changes">
                Owner and visibility will be updated.
              </Alert>
              <DialogFooter>
                <Button variant="secondary">Cancel</Button>
                <Button>Publish</Button>
              </DialogFooter>
            </div>
          </Dialog>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="sheet"
        title="Sheet"
        api="side: left, right, top, bottom · size: sm, md, lg · header, body, footer, close"
      >
        <div className="component-lab-sheet-grid">
          {(["left", "right", "top", "bottom"] as const).flatMap((side) =>
            (["sm", "md", "lg"] as const).map((size) => (
              <SheetExample side={side} size={size} key={`${side}-${size}`} />
            )),
          )}
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="popover"
        title="Popover"
        api="trigger · title · description · controlled or uncontrolled open"
      >
        <div className="component-lab-inline">
          <Popover
            trigger={<Button variant="secondary">With heading</Button>}
            title="Quick filters"
            description="Refine without leaving context."
          >
            <label className="component-lab-inline">
              <Checkbox /> Active only
            </label>
          </Popover>
          <Popover trigger={<Button variant="ghost">Content only</Button>}>
            <Text tone="secondary">Compact contextual content.</Text>
          </Popover>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="tooltip"
        title="Tooltip"
        api="label · delay · close delay · controlled open"
      >
        <div className="component-lab-inline">
          <Tooltip label="Short guidance">
            <Button variant="secondary">Hover or focus</Button>
          </Tooltip>
          <Tooltip label="Copies the current URL">
            <Button icon={Copy} aria-label="Copy link" variant="ghost" />
          </Tooltip>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="dropdown-menu"
        title="Dropdown Menu"
        api="trigger · items · disabled · destructive · onSelect"
      >
        <DropdownMenu
          trigger={
            <Button variant="secondary" trailingIcon={ChevronDown}>
              Actions
            </Button>
          }
          items={[
            { label: "Rename" },
            { label: "Duplicate" },
            { label: "Archive", disabled: true },
            { label: "Delete", destructive: true },
          ]}
        />
      </SpecimenSection>

      <SpecimenSection
        id="card"
        title="Card"
        api="default · secondary · linked · visual inset or bleed · anatomy slots"
      >
        <div className="component-lab-card-grid">
          <Card>
            <CardVisual>
              <Icon icon={Sparkles} />
            </CardVisual>
            <CardHeader>
              <div>
                <CardTitle>Default card</CardTitle>
                <CardDescription>Inset visual and full anatomy.</CardDescription>
              </div>
              <CardAction>
                <Badge tone="success">Ready</Badge>
              </CardAction>
            </CardHeader>
            <CardContent>Content remains product-owned.</CardContent>
            <CardFooter>
              <Button size="sm" variant="secondary">
                Details
              </Button>
            </CardFooter>
          </Card>
          <Card variant="secondary">
            <CardVisual placement="bleed" className="component-lab-card-visual">
              Bleed visual
            </CardVisual>
            <CardHeader>
              <CardTitle>Secondary surface</CardTitle>
              <CardDescription>Quiet grouping treatment.</CardDescription>
            </CardHeader>
          </Card>
          <Card href="#card">
            <CardHeader>
              <CardTitle>Linked card</CardTitle>
              <CardDescription>One clear destination.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="badge"
        title="Badge"
        api="tone · emphasis · size · loading · leading and trailing icons"
      >
        <Matrix
          columns={["sm", "md", "lg", "Strong"]}
          rows={(
            ["neutral", "primary-soft", "accent", "info", "success", "warning", "danger"] as const
          ).map((tone) => ({
            label: tone,
            cells: [
              <Badge key="sm" tone={tone} size="sm">
                Label
              </Badge>,
              <Badge key="md" tone={tone}>
                Label
              </Badge>,
              <Badge key="lg" tone={tone} size="lg">
                Label
              </Badge>,
              <Badge key="strong" tone={tone} emphasis="strong">
                Label
              </Badge>,
            ],
          }))}
        />
        <div className="component-lab-inline">
          <Badge leadingIcon={Check} tone="success">
            Icon
          </Badge>
          <Badge loading>Loading</Badge>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="avatar"
        title="Avatar"
        api="size · image · initials fallback · custom fallback · decorative"
      >
        <Matrix
          columns={["sm", "md", "lg", "Initials", "Custom"]}
          rows={[
            {
              label: "Fallback",
              cells: [
                <Avatar key="sm" name="Maya Chen" size="sm" />,
                <Avatar key="md" name="Maya Chen" />,
                <Avatar key="lg" name="Maya Chen" size="lg" />,
                <Avatar key="fallback" name="Alex Reed" />,
                <Avatar key="custom" name="Nerio Team" fallback={<Icon icon={Sparkles} />} />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="table"
        title="Table"
        api="container · caption · header · body · footer · rows · heads · cells"
      >
        <TableContainer aria-label="Project table">
          <Table>
            <TableCaption>Active workspace projects</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Atlas</TableCell>
                <TableCell>
                  <Badge tone="success">Active</Badge>
                </TableCell>
                <TableCell>Maya</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Northstar</TableCell>
                <TableCell>
                  <Badge tone="warning">Review</Badge>
                </TableCell>
                <TableCell>Alex</TableCell>
              </TableRow>
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>2 projects</TableCell>
                <TableCell>2 owners</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </SpecimenSection>
      <SpecimenSection
        id="item"
        title="Item"
        api="variant · size · media · header · content · actions · footer · separators"
      >
        <div className="component-lab-stack">
          {(["plain", "outline", "soft"] as const).map((variant) => (
            <ItemGroup key={variant}>
              <ItemHeader>{variant} group</ItemHeader>
              {(["sm", "md", "lg"] as const).map((size, index) => (
                <React.Fragment key={size}>
                  <Item variant={variant} size={size}>
                    <ItemMedia variant="icon">
                      <Icon icon={FileText} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{size} item</ItemTitle>
                      <ItemDescription>Supporting description</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button size="sm" variant="ghost">
                        Open
                      </Button>
                    </ItemActions>
                  </Item>
                  {index < 2 ? <ItemSeparator /> : null}
                </React.Fragment>
              ))}
              <ItemFooter>Footer slot</ItemFooter>
            </ItemGroup>
          ))}
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="list"
        title="List"
        api="static · linked · ordered · leading · trailing · metadata"
      >
        <div className="component-lab-card-grid">
          <List
            items={[
              {
                id: "one",
                title: "Static row",
                description: "Description",
                leading: <Icon icon={FileText} />,
                meta: "Meta",
              },
              {
                id: "two",
                title: "Linked row",
                description: "One destination",
                href: "#list",
                trailing: <Icon icon={ChevronDown} />,
              },
            ]}
          />
          <List
            ordered
            items={[
              { id: "install", title: "Install tokens" },
              { id: "source", title: "Register source" },
              { id: "import", title: "Import components" },
            ]}
          />
        </div>
      </SpecimenSection>
      <SpecimenSection id="separator" title="Separator" api="semantic horizontal separator">
        <div className="component-lab-stack">
          <span>Overview</span>
          <Separator />
          <span>Activity</span>
        </div>
      </SpecimenSection>
      <SpecimenSection id="key-value" title="Key Value" api="label · React node value">
        <div className="component-lab-key-values">
          <KeyValue label="Owner" value="Product team" />
          <KeyValue label="Updated" value="Today" />
          <KeyValue label="Status" value={<Badge tone="success">Ready</Badge>} />
        </div>
      </SpecimenSection>
      <SpecimenSection id="stat" title="Stat" api="label · value · optional trend">
        <div className="component-lab-card-grid">
          <Stat label="Active projects" value="12" trend="+3 this week" />
          <Stat label="Open tasks" value="34" trend="8 due today" />
          <Stat label="Conversion" value="6.42%" />
        </div>
      </SpecimenSection>

      <SpecimenSection id="alert" title="Alert" api="tone · title · icon · action · description">
        <div className="component-lab-stack">
          {(["neutral", "info", "success", "warning", "danger"] as const).map((tone) => (
            <Alert
              key={tone}
              tone={tone}
              icon={tone === "warning" || tone === "danger" ? CircleAlert : Info}
              title={`${tone} alert`}
              action={
                tone === "danger" ? (
                  <Button size="sm" variant="ghost">
                    Review
                  </Button>
                ) : undefined
              }
            >
              A subdued inline message with optional action.
            </Alert>
          ))}
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="toast"
        title="Toast"
        api="tone · priority · timeout · action · managed viewport · swipe direction"
      >
        <div className="component-lab-stack">
          {(["neutral", "info", "success", "warning", "danger"] as const).map((tone) => (
            <Toast
              key={tone}
              title={`${tone} toast`}
              description="Static presentation for visual comparison."
              tone={tone}
            />
          ))}
          <ToastActions />
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="progress"
        title="Progress"
        api="determinate · complete · indeterminate · value label · accessible name"
      >
        <div className="component-lab-stack">
          <Progress label="In progress" value={62} />
          <Progress label="Complete" value={100} />
          <Progress label="Indeterminate" />
          <Progress label="Custom value" value={4} max={5} valueLabel="4 of 5" />
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="skeleton"
        title="Skeleton"
        api="token-driven shape · arbitrary layout composition"
      >
        <div className="component-lab-skeleton-demo">
          <Skeleton className="component-lab-skeleton-demo__avatar" />
          <div>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="empty-state"
        title="Empty State"
        api="size · align · media variant · action orientation"
      >
        <div className="component-lab-card-grid">
          {(["sm", "md", "lg"] as const).map((size) => (
            <EmptyState key={size} size={size} align={size === "sm" ? "start" : "center"}>
              <EmptyStateMedia>
                <Icon icon={Search} />
              </EmptyStateMedia>
              <EmptyStateHeader>
                <EmptyStateTitle>{size} empty state</EmptyStateTitle>
                <EmptyStateDescription>No results match the current filters.</EmptyStateDescription>
              </EmptyStateHeader>
              <EmptyStateActions orientation={size === "lg" ? "vertical" : "horizontal"}>
                <Button size="sm" variant="secondary">
                  Clear filters
                </Button>
                {size === "lg" ? <Button size="sm">Create item</Button> : null}
              </EmptyStateActions>
            </EmptyState>
          ))}
        </div>
      </SpecimenSection>
      <SpecimenSection id="spinner" title="Spinner" api="size · labelled or decorative">
        <div className="component-lab-inline">
          <Spinner size="sm" label="Loading small" />
          <Spinner size="md" label="Loading medium" />
          <Spinner size="lg" label="Loading large" />
          <Button loading>Saving</Button>
          <Badge loading>Syncing</Badge>
        </div>
      </SpecimenSection>

      <SpecimenSection
        id="tabs"
        title="Tabs"
        api="variant · size · layout · orientation · disabled · icons · badges"
      >
        <Matrix
          columns={["sm", "md", "lg"]}
          rows={(["segmented", "separate", "bordered"] as const).map((variant) => ({
            label: variant,
            cells: [
              <TabsExample key="sm" variant={variant} size="sm" />,
              <TabsExample key="md" variant={variant} />,
              <TabsExample key="lg" variant={variant} size="lg" />,
            ],
          }))}
        />
      </SpecimenSection>
      <SpecimenSection
        id="breadcrumbs"
        title="Breadcrumbs"
        api="linked and current items · custom separators through composition"
      >
        <div className="component-lab-stack">
          <Breadcrumbs
            items={[
              { label: "Docs", href: "#" },
              { label: "Components", href: "#" },
              { label: "Breadcrumbs" },
            ]}
          />
          <Breadcrumbs
            items={[
              { label: "Workspace", href: "#" },
              { label: "Projects", href: "#" },
              { label: "Atlas", href: "#" },
              { label: "Settings" },
            ]}
          />
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="pagination"
        title="Pagination"
        api="previous · next · pages · current · ellipsis · custom render"
      >
        <Pagination
          previousHref="#pagination"
          nextHref="#pagination"
          pages={[
            { key: "1", label: "1", href: "#pagination" },
            { key: "2", label: "2", href: "#pagination", current: true },
            { key: "ellipsis", type: "ellipsis" },
            { key: "12", label: "12", href: "#pagination" },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="sidebar-primitive"
        title="Sidebar Primitive"
        api="controlled or uncontrolled expanded · side · direction · rail · trigger · layout regions"
      >
        <SidebarProvider
          className="component-lab-sidebar"
          defaultExpanded
          sidebarId="component-lab-sidebar"
        >
          <Sidebar aria-label="Sidebar specimen">
            <SidebarHeader>
              <strong>Nerio</strong>
            </SidebarHeader>
            <SidebarContent>
              <nav>
                {(
                  [
                    ["Overview", LayoutDashboard],
                    ["Projects", FileText],
                    ["Settings", Settings],
                  ] as const
                ).map(([label, icon], index) => (
                  <Button
                    className="component-lab-sidebar__item"
                    key={label}
                    leadingIcon={icon}
                    size="sm"
                    variant={index === 0 ? "secondary" : "ghost"}
                  >
                    {label}
                  </Button>
                ))}
              </nav>
            </SidebarContent>
            <SidebarFooter>Core layout</SidebarFooter>
            <SidebarRail label="Toggle specimen sidebar" />
          </Sidebar>
          <SidebarInset as="div">
            <SidebarTrigger label="Toggle specimen sidebar" />
            <Heading as="h3">Product content</Heading>
            <Text tone="secondary">The consuming app owns routes and navigation.</Text>
          </SidebarInset>
        </SidebarProvider>
      </SpecimenSection>
      <SpecimenSection
        id="command-primitive"
        title="Command Primitive"
        api="flat or grouped items · search · custom filter · disabled · empty · loading · selection"
      >
        <div className="component-lab-card-grid">
          <Command items={commandItems}>
            <CommandInput placeholder="Search commands…" />
            <CommandList>
              {(item) => (
                <CommandItem
                  value={item.value}
                  leading={<Icon icon={item.value === "settings" ? Settings : LayoutDashboard} />}
                  shortcut={item.value === "dashboard" ? <Kbd>G D</Kbd> : undefined}
                >
                  {item.label}
                </CommandItem>
              )}
            </CommandList>
            <CommandEmpty>No commands found.</CommandEmpty>
          </Command>
          <Command items={[]}>
            <CommandInput placeholder="Empty command…" />
            <CommandList>
              {(item) => <CommandItem value={item.value}>{item.label}</CommandItem>}
            </CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
          </Command>
        </div>
      </SpecimenSection>
    </>
  );
}
