"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  Bell,
  Box,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  ExternalLink,
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
  Calendar,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardVisual,
  Checkbox,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Dialog,
  DatePicker,
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
  Skeleton,
  Slider,
  Spinner,
  Stat,
  Switch,
  Toggle,
  Table,
  TableBody,
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
  Tooltip,
  useToastManager,
} from "@nerio-ui/ui/client";
import { avatarPreviewAssets } from "../lib/avatar-preview-assets";

const SpecimenControlsContext = React.createContext<HTMLDivElement | null>(null);

function SpecimenSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  api: string;
  children: React.ReactNode;
}) {
  const [controlsTarget, setControlsTarget] = React.useState<HTMLDivElement | null>(null);

  return (
    <section className="component-lab-section" id={id}>
      <header>
        <div>
          <h2>{title}</h2>
        </div>
        <Button render={<a href={`/docs/components/${id}`} />} size="sm" variant="ghost">
          View docs
        </Button>
      </header>
      <div className="component-playground-controls" ref={setControlsTarget} />
      <SpecimenControlsContext.Provider value={controlsTarget}>
        <div className="component-example component-playground-preview">
          <div className="component-example__preview">
            <div className="component-playground-preview__content">{children}</div>
          </div>
        </div>
      </SpecimenControlsContext.Provider>
    </section>
  );
}

function Matrix({
  className,
  columns,
  controlsVariant = "segmented",
  rows,
  showRowLabels = true,
}: {
  className?: string;
  columns: string[];
  controlsVariant?: "segmented" | "separate" | "bordered";
  rows: Array<{ label: string; cells: React.ReactNode[] }>;
  showRowLabels?: boolean;
}) {
  const controlsTarget = React.useContext(SpecimenControlsContext);
  const defaultValue = columns[0];
  const controls = (
    <div
      className="n-tabs component-playground-controls__tabs"
      data-orientation="horizontal"
      data-size="sm"
      data-variant={controlsVariant}
    >
      <TabsList aria-label="Preview options">
        {columns.map((column) => (
          <TabsTrigger key={column} value={column}>
            {column}
          </TabsTrigger>
        ))}
        <TabsIndicator />
      </TabsList>
    </div>
  );

  return (
    <Tabs
      className={["component-playground-options", className].filter(Boolean).join(" ")}
      defaultValue={defaultValue}
      size="sm"
      variant={controlsVariant}
    >
      {controlsTarget ? createPortal(controls, controlsTarget) : controls}
      <TabsPanels>
        {columns.map((column, columnIndex) => (
          <TabsContent key={column} value={column}>
            {rows.length === 1 && rows[0] ? (
              <div className="component-playground-options__specimen">
                {rows[0].cells[columnIndex]}
              </div>
            ) : (
              <div className="component-playground-showcase-grid">
                {rows.map((row) => (
                  <div className="component-playground-showcase-item" key={row.label}>
                    {showRowLabels ? <Text tone="secondary">{row.label}</Text> : null}
                    {row.cells[columnIndex]}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </TabsPanels>
    </Tabs>
  );
}

function TabsExample({ variant }: { variant: "segmented" | "separate" | "bordered" }) {
  return (
    <Tabs defaultValue="overview" variant={variant}>
      <TabsList aria-label={`${variant} tabs`}>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsPanels>
        <TabsContent value="overview">
          <div className="component-playground-tab-panel">
            <Heading as="h3">Workspace overview</Heading>
            <Text tone="secondary">
              Review current priorities, ownership, and delivery health across the workspace.
            </Text>
          </div>
        </TabsContent>
        <TabsContent value="activity">
          <div className="component-playground-tab-panel">
            <Heading as="h3">Recent activity</Heading>
            <Text tone="secondary">
              Maya updated project access and Alex completed the release checklist.
            </Text>
          </div>
        </TabsContent>
        <TabsContent value="disabled">Unavailable</TabsContent>
      </TabsPanels>
    </Tabs>
  );
}

function ToastActions() {
  const toast = useToastManager();
  const tones = ["neutral", "info", "success", "warning", "danger"] as const;

  return (
    <div className="component-lab-inline">
      {tones.map((tone) => (
        <Button
          key={tone}
          size="sm"
          variant={tone === "neutral" ? "secondary" : tone === "danger" ? "danger" : "primary"}
          onClick={() =>
            toast.add({
              id: `${tone}-${Date.now()}`,
              title: `${tone} toast`,
              description: "The managed viewport announces this update.",
              data: { tone },
            })
          }
        >
          Open {tone} toast
        </Button>
      ))}
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
  const sideLabel = `${side.charAt(0).toUpperCase()}${side.slice(1)}`;

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button size="sm" variant="secondary">
            {side}
          </Button>
        }
      />
      <SheetContent side={side} size={size}>
        <SheetHeader>
          <SheetTitle>{sideLabel} sheet</SheetTitle>
          <SheetDescription>Side and size are public visual API.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="component-playground-sheet-form">
            <Field label="Workspace name" description="Shown to everyone in the workspace.">
              <Input defaultValue="Atlas" />
            </Field>
            <Select
              defaultValue="editor"
              description="Applied to newly invited members."
              label="Default role"
              options={[
                { label: "Viewer", value: "viewer" },
                { label: "Editor", value: "editor" },
                { label: "Administrator", value: "admin" },
              ]}
            />
            <Switch
              defaultChecked
              description="Require an administrator to approve invitations."
              label="Invite approvals"
            />
            <Switch
              description="Allow collaborators outside your organization."
              label="External guests"
            />
            <Checkbox
              defaultChecked
              description="Send a summary when permissions change."
              label="Notify workspace owners"
            />
          </div>
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
        id="button"
        title="Button"
        api="variant · size · loading · disabled · icons · badge · kbd · tooltip · render"
      >
        <Matrix
          columns={["sm", "md", "lg", "Disabled", "Loading"]}
          showRowLabels={false}
          rows={(["primary", "secondary", "outline", "ghost", "link", "danger"] as const).map(
            (variant) => ({
              label: variant,
              cells: [
                <Button key="sm" size="sm" variant={variant}>
                  {variant}
                </Button>,
                <Button key="md" size="md" variant={variant}>
                  {variant}
                </Button>,
                <Button key="lg" size="lg" variant={variant}>
                  {variant}
                </Button>,
                <Button key="disabled" variant={variant} disabled>
                  {variant}
                </Button>,
                <Button key="loading" variant={variant} loading>
                  {variant}
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

      <SpecimenSection
        id="toggle"
        title="Toggle"
        api="pressed · defaultPressed · variant · size · icon-only · disabled"
      >
        <Matrix
          columns={["Ghost", "Selected", "Outline selected", "Icon only", "Disabled selected"]}
          rows={[
            {
              label: "State",
              cells: [
                <Toggle key="ghost">Save article</Toggle>,
                <Toggle key="pressed" defaultPressed>
                  Save article
                </Toggle>,
                <Toggle key="outline" defaultPressed variant="outline">
                  Reading mode
                </Toggle>,
                <Toggle key="icon" icon={Bell} aria-label="Follow updates" />,
                <Toggle key="disabled" defaultPressed disabled>
                  Save article
                </Toggle>,
              ],
            },
          ]}
        />
      </SpecimenSection>

      <SpecimenSection id="button-group" title="Button Group" api="horizontal grouped actions">
        <div className="component-lab-inline">
          <ButtonGroup>
            <Button variant="secondary">Day</Button>
            <Button variant="secondary">Week</Button>
            <Button variant="secondary">Month</Button>
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
          showRowLabels={false}
          rows={(["sm", "md", "lg"] as const).map((size) => ({
            label: size,
            cells: [
              <Input
                key="default"
                aria-label={`${size} default input`}
                size={size}
                placeholder={`Size ${size}`}
              />,
              <Input
                key="filled"
                aria-label={`${size} filled input`}
                size={size}
                defaultValue={`Size ${size}`}
              />,
              <Input
                key="readonly"
                aria-label={`${size} read-only input`}
                size={size}
                defaultValue={`Size ${size}`}
                readOnly
              />,
              <Input
                key="invalid"
                aria-label={`${size} invalid input`}
                size={size}
                defaultValue={`Size ${size}`}
                invalid
              />,
              <Input
                key="disabled"
                aria-label={`${size} disabled input`}
                size={size}
                defaultValue={`Size ${size}`}
                disabled
              />,
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
          showRowLabels={false}
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
            <Input aria-label="Email address with icon" placeholder="Email" />
          </InputGroup>
          <InputGroup>
            <Input aria-label="Amount in US dollars" placeholder="Amount" />
            <InputGroupAddon placement="end">USD</InputGroupAddon>
          </InputGroup>
          <InputGroup>
            <InputGroupAddon placement="start">https://</InputGroupAddon>
            <Input aria-label="Website domain" placeholder="domain.com" />
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
                <Textarea key="default" aria-label="Default note" placeholder="Write a note…" />,
                <Textarea
                  key="invalid"
                  aria-label="Invalid note"
                  defaultValue="Needs attention"
                  aria-invalid
                />,
                <Textarea
                  key="readonly"
                  aria-label="Read-only note"
                  defaultValue="Read-only content"
                  readOnly
                />,
                <Textarea
                  key="disabled"
                  aria-label="Disabled note"
                  defaultValue="Unavailable"
                  disabled
                />,
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
          <Label htmlFor="label-demo">Label</Label>
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
            <Input defaultValue="Atlas" required />
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
        <Matrix
          columns={["Stack", "Inline", "Grid"]}
          rows={[
            {
              label: "Layout",
              cells: [
                <FormGroup
                  key="stack"
                  title="Notification channels"
                  description="Choose any that apply."
                >
                  <Checkbox
                    label="Email updates"
                    description="Receive important project changes by email."
                    defaultChecked
                  />
                  <Checkbox
                    label="Push notifications"
                    description="Show time-sensitive alerts on this device."
                  />
                </FormGroup>,
                <FormGroup key="inline" title="Visibility" layout="inline">
                  <Checkbox
                    label="Team members"
                    description="Everyone in the workspace."
                    defaultChecked
                  />
                  <Checkbox label="Guests" description="External collaborators with access." />
                </FormGroup>,
                <FormGroup key="grid" title="Project details" layout="grid">
                  <Input aria-label="Project name" defaultValue="Atlas" />
                  <Input aria-label="Project owner" defaultValue="Maya" />
                </FormGroup>,
              ],
            },
          ]}
        />
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
                <Checkbox
                  key="off"
                  label="Weekly summary"
                  description="Receive a concise project digest every Monday."
                />,
                <Checkbox
                  key="on"
                  label="Weekly summary"
                  description="Receive a concise project digest every Monday."
                  defaultChecked
                />,
                <Checkbox
                  key="mixed"
                  label="Project notifications"
                  description="Some notification channels are enabled."
                  indeterminate
                />,
                <Checkbox
                  key="disabled"
                  label="Weekly summary"
                  description="Unavailable for this workspace."
                  disabled
                />,
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
          <RadioGroupItem value="public" description="Anyone with the link can view." disabled>
            Public
          </RadioGroupItem>
        </RadioGroup>
      </SpecimenSection>
      <SpecimenSection id="switch" title="Switch" api="off · on · disabled · readOnly">
        <Matrix
          columns={["Default", "Disabled"]}
          rows={[
            {
              label: "State",
              cells: [
                <Switch
                  key="default"
                  label="Automatic updates"
                  description="Install security updates as soon as they are available."
                />,
                <Switch
                  key="disabled"
                  label="Automatic updates"
                  description="Managed by your organization."
                  disabled
                  defaultChecked
                />,
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
          controlsVariant="segmented"
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
                <Slider
                  key="default"
                  label="Monthly budget"
                  valueLabel="$4,000"
                  description="Set the spending limit for this workspace."
                  defaultValue={40}
                />,
                <Slider
                  key="readonly"
                  label="Monthly budget"
                  valueLabel="$7,000"
                  description="This budget is managed by Finance."
                  defaultValue={70}
                  readOnly
                />,
                <Slider
                  key="disabled"
                  label="Monthly budget"
                  valueLabel="$2,500"
                  description="Enable billing to change this limit."
                  defaultValue={25}
                  disabled
                />,
                <Slider
                  key="vertical"
                  label="Risk tolerance"
                  valueLabel="60%"
                  description="Choose the portfolio risk profile."
                  defaultValue={60}
                  orientation="vertical"
                />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="calendar"
        title="Calendar"
        api="single date · ISO value · localized · constrained · readOnly"
      >
        <div className="component-lab-inline">
          <Popover
            className="component-playground-calendar-popover"
            trigger={<Button variant="secondary">Open selected calendar</Button>}
          >
            <Calendar
              aria-label="Selected release date"
              defaultValue="2026-06-15"
              firstDayOfWeek={1}
              today="2026-06-15"
            />
          </Popover>
          <Popover
            className="component-playground-calendar-popover"
            trigger={<Button variant="secondary">Open constrained calendar</Button>}
          >
            <Calendar
              aria-label="Constrained release date"
              defaultMonth="2026-06-01"
              min="2026-06-10"
              max="2026-06-20"
              isDateDisabled={(date) => date === "2026-06-18"}
              today="2026-06-15"
            />
          </Popover>
          <Popover
            className="component-playground-calendar-popover"
            trigger={<Button variant="secondary">Open read-only calendar</Button>}
          >
            <Calendar
              aria-label="Read-only release date"
              defaultValue="2026-06-15"
              readOnly
              today="2026-06-15"
            />
          </Popover>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="date-picker"
        title="DatePicker"
        api="single date · form value · clearable · readOnly · disabled"
      >
        <Matrix
          columns={["Empty", "Selected", "Read only", "Disabled"]}
          rows={[
            {
              label: "State",
              cells: [
                <DatePicker key="empty" aria-label="Empty release date" />,
                <DatePicker
                  key="selected"
                  aria-label="Selected release date"
                  clearable
                  defaultValue="2026-06-15"
                  today="2026-06-15"
                />,
                <DatePicker
                  key="readonly"
                  aria-label="Read-only release date"
                  defaultValue="2026-06-15"
                  readOnly
                  today="2026-06-15"
                />,
                <DatePicker key="disabled" aria-label="Disabled release date" disabled />,
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
            title="Sign in"
            description="Use your workspace credentials to continue."
          >
            <div className="component-lab-stack">
              <Field label="Email address">
                <Input type="email" placeholder="name@company.com" />
              </Field>
              <Field label="Password">
                <Input type="password" placeholder="Enter your password" />
              </Field>
              <Checkbox
                description="Keep this browser signed in for 30 days."
                label="Remember me"
              />
            </div>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button>Sign in</Button>
            </DialogFooter>
          </Dialog>
          <Dialog
            trigger={<Button variant="secondary">Long content</Button>}
            title="Privacy policy"
            description="Last updated August 7, 2026."
          >
            <div className="component-playground-dialog-scroll">
              <Heading as="h3">Information we collect</Heading>
              <Text tone="secondary">
                We collect account details, workspace activity, device information, and technical
                diagnostics required to provide and secure the service. This may include your name,
                email address, organization, sign-in history, browser type, approximate location,
                and the actions you take inside a workspace.
              </Text>
              <Text tone="secondary">
                Content that you create, upload, or share is processed only to deliver the features
                you request. Workspace administrators may also provide profile details and
                permission settings on behalf of their members.
              </Text>
              <Heading as="h3">How information is used</Heading>
              <Text tone="secondary">
                Information is used to operate the product, support collaboration, prevent abuse,
                diagnose incidents, and improve reliability. We also use limited account data to
                communicate service updates and respond to support requests.
              </Text>
              <Text tone="secondary">
                We do not use private workspace content to build advertising profiles. Product
                analytics are aggregated where practical and retained only for as long as they
                remain necessary.
              </Text>
              <Heading as="h3">Sharing and retention</Heading>
              <Text tone="secondary">
                We share information only with service providers and workspace members as needed to
                operate the service. Providers are required to protect the information and may
                process it only under our instructions.
              </Text>
              <Text tone="secondary">
                Account data is retained while your workspace remains active and for a limited
                period afterward to support recovery, security, and legal obligations. Retention
                periods may differ when an administrator configures a shorter workspace policy.
              </Text>
              <Heading as="h3">International transfers</Heading>
              <Text tone="secondary">
                Your information may be processed in countries other than the one where you live.
                When required, we use approved contractual safeguards and technical controls to
                protect information during those transfers.
              </Text>
              <Heading as="h3">Security</Heading>
              <Text tone="secondary">
                We use access controls, encryption in transit and at rest, monitoring, and regular
                security reviews. No system can guarantee absolute security, so we also provide
                tools that help administrators manage sessions and permissions.
              </Text>
              <Heading as="h3">Your choices</Heading>
              <Text tone="secondary">
                You can request access, correction, export, or deletion of personal information
                through workspace settings or by contacting support. Some requests may be managed by
                your workspace administrator.
              </Text>
              <Heading as="h3">Changes to this policy</Heading>
              <Text tone="secondary">
                We may update this policy when the service, applicable law, or our data practices
                change. Material updates are announced in the product or by email before they take
                effect.
              </Text>
              <Heading as="h3">Contact</Heading>
              <Text tone="secondary">
                Questions about privacy or this policy can be sent to privacy@nerio.dev. We will
                confirm receipt and respond within the period required by applicable law.
              </Text>
            </div>
            <DialogFooter>
              <Button>I understand</Button>
            </DialogFooter>
          </Dialog>
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="sheet"
        title="Sheet"
        api="side: left, right, top, bottom · size: sm, md, lg · header, body, footer, close"
      >
        <Matrix
          className="component-playground-sheet-options"
          columns={["sm", "md", "lg"]}
          rows={(["left", "right", "top", "bottom"] as const).map((side) => ({
            label: side,
            cells: (["sm", "md", "lg"] as const).map((size) => (
              <SheetExample side={side} size={size} key={`${side}-${size}`} />
            )),
          }))}
          showRowLabels={false}
        />
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
            <div className="component-lab-stack">
              <Field label="Status" description="Show projects in the selected state.">
                <Select
                  aria-label="Project status"
                  defaultValue="active"
                  label="Project status"
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Paused", value: "paused" },
                  ]}
                />
              </Field>
              <Field label="Owner" description="Limit results to one project owner.">
                <Select
                  aria-label="Project owner"
                  label="Project owner"
                  placeholder="Anyone"
                  options={[
                    { label: "Maya", value: "maya" },
                    { label: "Alex", value: "alex" },
                  ]}
                />
              </Field>
              <Switch description="Hide healthy projects." label="Only with alerts" />
            </div>
          </Popover>
          <Popover trigger={<Button variant="ghost">Content only</Button>}>
            <div className="component-lab-stack">
              <Heading as="h3">Recovery point objective</Heading>
              <Text tone="secondary">
                The maximum acceptable amount of data loss measured in time after an incident.
              </Text>
              <Button
                render={
                  <a
                    href="https://en.wikipedia.org/wiki/Recovery_point_objective"
                    target="_blank"
                    rel="noreferrer"
                  />
                }
                trailingIcon={ExternalLink}
                variant="link"
              >
                Learn more
              </Button>
            </div>
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
        api="trigger · leading and trailing icons · hotkey · disabled · destructive · onSelect"
      >
        <div className="component-lab-inline">
          <DropdownMenu
            trigger={
              <Button leadingIcon={FileText} variant="secondary" trailingIcon={ChevronDown}>
                Actions
              </Button>
            }
            items={[
              {
                label: "Edit project",
                group: "Project",
                leadingIcon: FileText,
                hotkey: <Kbd>⌘ E</Kbd>,
              },
              { label: "Duplicate", group: "Project", leadingIcon: Copy, hotkey: <Kbd>⌘ D</Kbd> },
              {
                label: "Open full screen",
                group: "Project",
                leadingIcon: ExternalLink,
                hotkey: <Kbd>F</Kbd>,
              },
              {
                label: "Share",
                group: "Collaboration",
                leadingIcon: UserPlus,
                trailingIcon: ChevronDown,
                items: [
                  { label: "Invite people", leadingIcon: UserPlus, hotkey: <Kbd>⌘ I</Kbd> },
                  { label: "Copy public link", leadingIcon: Copy, hotkey: <Kbd>⌘ L</Kbd> },
                ],
              },
              { label: "Archive", group: "Manage", leadingIcon: Box },
              {
                label: "Delete project",
                group: "Manage",
                destructive: true,
                leadingIcon: CircleAlert,
                hotkey: <Kbd>⌘ ⌫</Kbd>,
              },
            ]}
          />
        </div>
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
        </div>
      </SpecimenSection>
      <SpecimenSection
        id="badge"
        title="Badge"
        api="tone · emphasis · size · loading · leading and trailing icons"
      >
        <Matrix
          columns={["sm", "md", "lg"]}
          rows={(
            ["neutral", "primary-soft", "accent", "info", "success", "warning", "danger"] as const
          ).map((tone) => ({
            label: tone,
            cells: [
              <Badge key="sm" tone={tone} size="sm">
                {tone === "primary-soft" ? "primary soft" : tone}
              </Badge>,
              <Badge key="md" tone={tone}>
                {tone === "primary-soft" ? "primary soft" : tone}
              </Badge>,
              <Badge key="lg" tone={tone} size="lg">
                {tone === "primary-soft" ? "primary soft" : tone}
              </Badge>,
            ],
          }))}
          showRowLabels={false}
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
          columns={["sm", "md", "lg"]}
          rows={[
            {
              label: "Image",
              cells: [
                <Avatar key="i-sm" {...avatarPreviewAssets[0]} size="sm" />,
                <Avatar key="i-md" {...avatarPreviewAssets[0]} />,
                <Avatar key="i-lg" {...avatarPreviewAssets[0]} size="lg" />,
              ],
            },
            {
              label: "Initials",
              cells: [
                <Avatar key="f-sm" name="Alex Reed" size="sm" />,
                <Avatar key="f-md" name="Alex Reed" />,
                <Avatar key="f-lg" name="Alex Reed" size="lg" />,
              ],
            },
            {
              label: "Custom",
              cells: [
                <Avatar
                  key="c-sm"
                  name="Nerio Team"
                  fallback={<Icon icon={Sparkles} />}
                  size="sm"
                />,
                <Avatar key="c-md" name="Nerio Team" fallback={<Icon icon={Sparkles} />} />,
                <Avatar
                  key="c-lg"
                  name="Nerio Team"
                  fallback={<Icon icon={Sparkles} />}
                  size="lg"
                />,
              ],
            },
            {
              label: "Group",
              cells: (["sm", "md", "lg"] as const).map((size) => (
                <div className="component-playground-avatar-group" key={size}>
                  {avatarPreviewAssets.slice(0, 3).map((avatar) => (
                    <Avatar key={avatar.name} {...avatar} size={size} />
                  ))}
                </div>
              )),
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
        <Matrix
          columns={["Plain group", "Footer slot", "Soft group"]}
          rows={[
            {
              label: "Variant",
              cells: [
                <ItemGroup key="plain">
                  <ItemHeader>Recent files</ItemHeader>
                  <Item>
                    <ItemMedia variant="icon">
                      <Icon icon={FileText} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Project brief</ItemTitle>
                      <ItemDescription>Updated 10 minutes ago</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button size="sm" variant="ghost">
                        Open
                      </Button>
                    </ItemActions>
                  </Item>
                </ItemGroup>,
                <ItemGroup key="footer">
                  <Item>
                    <ItemMedia variant="icon">
                      <Icon icon={FileText} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Release notes</ItemTitle>
                      <ItemDescription>Ready for review</ItemDescription>
                    </ItemContent>
                  </Item>
                  <ItemFooter>2 collaborators are viewing</ItemFooter>
                </ItemGroup>,
                <ItemGroup key="soft">
                  <Item variant="soft">
                    <ItemMedia variant="icon">
                      <Icon icon={FileText} />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Design tokens</ItemTitle>
                      <ItemDescription>Synced with the latest theme</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge tone="success">Ready</Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="list"
        title="List"
        api="disc · decimal · dash · icon · none · leading · trailing · metadata"
      >
        <Matrix
          columns={["Bulleted", "Numbered", "Icons"]}
          rows={[
            {
              label: "Marker",
              cells: [
                <List
                  key="disc"
                  items={[
                    { id: "one", title: "Write the component contract" },
                    { id: "two", title: "Add accessible states" },
                    { id: "three", title: "Verify the public preview" },
                  ]}
                />,
                <List
                  key="number"
                  marker="decimal"
                  items={[
                    { id: "install", title: "Install tokens" },
                    { id: "source", title: "Register source" },
                    { id: "import", title: "Import components" },
                  ]}
                />,
                <List
                  key="icons"
                  marker="icon"
                  items={[
                    { id: "contract", title: "Contract approved", marker: <Icon icon={Check} /> },
                    {
                      id: "states",
                      title: "Accessible states verified",
                      marker: <Icon icon={Check} />,
                    },
                    { id: "preview", title: "Preview ready", marker: <Icon icon={Sparkles} /> },
                  ]}
                />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection id="separator" title="Separator" api="horizontal · vertical">
        <Matrix
          columns={["Horizontal", "Vertical"]}
          rows={[
            {
              label: "Orientation",
              cells: [
                <div className="component-lab-stack" key="h">
                  <span>Overview</span>
                  <Separator />
                  <span>Activity</span>
                </div>,
                <div className="component-lab-inline" key="v">
                  <span>Overview</span>
                  <Separator orientation="vertical" />
                  <span>Activity</span>
                </div>,
              ],
            },
          ]}
        />
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

      <SpecimenSection
        id="alert"
        title="Alert"
        api="tone · title · icon · action · closeAction · description"
      >
        <div className="component-lab-stack">
          {(["neutral", "info", "success", "warning", "danger"] as const).map((tone) => (
            <Alert
              key={tone}
              tone={tone}
              icon={tone === "warning" || tone === "danger" ? CircleAlert : Info}
              title={`${tone} alert`}
              action={
                tone === "danger" ? (
                  <Button size="sm" variant="secondary">
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
        <ToastActions />
      </SpecimenSection>
      <SpecimenSection
        id="progress"
        title="Progress"
        api="determinate · complete · indeterminate · value label · accessible name"
      >
        <Matrix
          columns={["In progress", "Complete", "Indeterminate", "Custom value"]}
          rows={[
            {
              label: "State",
              cells: [
                <Progress key="active" label="Migration progress" value={62} />,
                <Progress key="complete" label="Migration complete" value={100} />,
                <Progress key="indeterminate" label="Preparing migration" />,
                <Progress
                  key="custom"
                  label="Files uploaded"
                  value={4}
                  max={5}
                  valueLabel="4 of 5"
                />,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="skeleton"
        title="Skeleton"
        api="token-driven shape · arbitrary layout composition"
      >
        <Matrix
          columns={["Table", "Card", "Form"]}
          rows={[
            {
              label: "Layout",
              cells: [
                <div className="component-playground-skeleton-table" key="table">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div key={index}>
                      <Skeleton />
                      <Skeleton />
                      <Skeleton />
                    </div>
                  ))}
                </div>,
                <div className="component-playground-skeleton-card" key="card">
                  <Skeleton className="component-playground-skeleton-card__visual" />
                  <Skeleton />
                  <Skeleton />
                </div>,
                <div className="component-playground-skeleton-form" key="form">
                  <Skeleton />
                  <Skeleton className="component-playground-skeleton-form__control" />
                  <Skeleton />
                  <Skeleton className="component-playground-skeleton-form__control" />
                </div>,
              ],
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="empty-state"
        title="Empty State"
        api="size · align · media variant · action orientation"
      >
        <Matrix
          columns={["sm", "md", "lg"]}
          rows={[
            {
              label: "Size",
              cells: (["sm", "md", "lg"] as const).map((size) => (
                <EmptyState key={size} size={size} align="center">
                  <EmptyStateMedia>
                    <Icon icon={Search} />
                  </EmptyStateMedia>
                  <EmptyStateHeader>
                    <EmptyStateTitle>No results found</EmptyStateTitle>
                    <EmptyStateDescription>
                      No results match the current filters.
                    </EmptyStateDescription>
                  </EmptyStateHeader>
                  <EmptyStateActions orientation={size === "lg" ? "vertical" : "horizontal"}>
                    <Button size="sm" variant="secondary">
                      Clear filters
                    </Button>
                    {size === "lg" ? <Button size="sm">Create item</Button> : null}
                  </EmptyStateActions>
                </EmptyState>
              )),
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection id="spinner" title="Spinner" api="size · labelled or decorative">
        <Matrix
          columns={["Sizes", "In context"]}
          rows={[
            {
              label: "Preview",
              cells: [
                <div className="component-lab-inline" key="sizes">
                  <Spinner size="sm" label="Loading small" />
                  <Spinner size="md" label="Loading medium" />
                  <Spinner size="lg" label="Loading large" />
                </div>,
                <div className="component-lab-inline" key="context">
                  <Button loading>Saving</Button>
                  <Button loading variant="secondary">
                    Syncing
                  </Button>
                </div>,
              ],
            },
          ]}
        />
      </SpecimenSection>

      <SpecimenSection
        id="tabs"
        title="Tabs"
        api="variant · size · layout · orientation · disabled · icons · badges"
      >
        <Matrix
          columns={["Segmented", "Separate", "Bordered"]}
          rows={[
            {
              label: "Variant",
              cells: (["segmented", "separate", "bordered"] as const).map((variant) => (
                <TabsExample key={variant} variant={variant} />
              )),
            },
          ]}
        />
      </SpecimenSection>
      <SpecimenSection
        id="breadcrumbs"
        title="Breadcrumbs"
        api="linked and current items · custom separators through composition"
      >
        <Breadcrumbs
          items={[
            { label: "Workspace", href: "#" },
            { label: "Projects", href: "#" },
            { label: "Atlas", href: "#" },
            { label: "Settings" },
          ]}
        />
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
        id="command-primitive"
        title="Command Primitive"
        api="flat or grouped items · search · custom filter · disabled · empty · loading · selection"
      >
        <Matrix
          columns={["Filled", "Empty"]}
          rows={[
            {
              label: "State",
              cells: [
                <Popover key="filled" trigger={<Button>Open command menu</Button>}>
                  <Command items={commandItems}>
                    <CommandInput aria-label="Search commands" placeholder="Search commands…" />
                    <CommandList>
                      {(item) => (
                        <CommandItem
                          value={item.value}
                          leading={
                            <Icon icon={item.value === "settings" ? Settings : LayoutDashboard} />
                          }
                          shortcut={item.value === "dashboard" ? <Kbd>G D</Kbd> : undefined}
                        >
                          {item.label}
                        </CommandItem>
                      )}
                    </CommandList>
                    <CommandEmpty>No commands found.</CommandEmpty>
                  </Command>
                </Popover>,
                <Popover
                  key="empty"
                  trigger={<Button variant="secondary">Open empty command menu</Button>}
                >
                  <Command items={[]}>
                    <CommandInput
                      aria-label="Search empty commands"
                      placeholder="Search commands…"
                    />
                    <CommandList>
                      {(item) => <CommandItem value={item.value}>{item.label}</CommandItem>}
                    </CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                  </Command>
                </Popover>,
              ],
            },
          ]}
        />
      </SpecimenSection>
    </>
  );
}
