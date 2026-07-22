import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import {
  Avatar,
  Badge,
  ButtonGroup,
  Card,
  CardAction,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Field,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Icon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Kbd,
  List,
  Pagination,
  Progress,
  SidebarContent,
  SidebarInset,
  Spinner,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "../../src/index";
import {
  Button,
  Checkbox,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  Dialog,
  LabelHint,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
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
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Slider,
  Switch,
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsPanels,
  TabsTrigger,
  Toast,
  ToastProvider,
  ToastViewport,
  useToastManager,
} from "../../src/client";
import { Bell } from "@nerio-ui/adapters/icons";
import { RouterLinkFixture } from "../fixtures/router-link";

describe("Core accessibility contracts", () => {
  it("keeps the polished-component verification matrix accessible", async () => {
    const { container } = render(
      <>
        <p>
          Save changes <Kbd>⌘ S</Kbd>
        </p>
        <button type="button">
          Save <Kbd aria-hidden>⌘ S</Kbd>
        </button>
        <Card as="article">
          <CardHeader>
            <CardTitle as="h2">Workspace</CardTitle>
            <CardAction>
              <button type="button">Open workspace menu</button>
            </CardAction>
          </CardHeader>
        </Card>
        <Avatar alt="Maya Chen profile" name="Maya Chen" src="/maya.png" />
        <Avatar decorative name="Team" />
        <List
          items={[
            {
              id: "router",
              title: "Router destination",
              href: "/router",
              render: <RouterLinkFixture />,
            },
            { id: "nested", title: "Static item", description: <span>Long supporting copy</span> },
          ]}
        />
        <Item>
          <ItemMedia aria-hidden variant="icon">
            W
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Workspace settings</ItemTitle>
            <ItemDescription>Manage members and security.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button type="button">Open settings</button>
          </ItemActions>
        </Item>
        <EmptyState role="status">
          <EmptyStateMedia aria-hidden variant="icon">
            ?
          </EmptyStateMedia>
          <EmptyStateHeader>
            <EmptyStateTitle>No results</EmptyStateTitle>
            <EmptyStateDescription>Try another query.</EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <button type="button">Clear filters</button>
          </EmptyStateActions>
        </EmptyState>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Workspace sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger disabled value="disabled">
              Disabled
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsPanels>
            <TabsContent value="overview">Overview panel</TabsContent>
            <TabsContent value="disabled">Disabled panel</TabsContent>
            <TabsContent value="activity">Activity panel</TabsContent>
          </TabsPanels>
        </Tabs>
        <Pagination
          previousHref="/one"
          nextHref="/three"
          pages={[
            { key: "one", label: "1", href: "/one" },
            {
              key: "two",
              label: "2",
              href: "/two",
              current: true,
              render: <RouterLinkFixture />,
            },
            { key: "three", label: "3", href: "/three" },
          ]}
        />
      </>,
    );

    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps loading action names, field associations, and named scroll regions accessible", async () => {
    const { container } = render(
      <>
        <Button loading loadingLabel="Saving">
          Save changes
        </Button>
        <Button icon={Bell} aria-label="Open notifications" loading loadingLabel="Opening" />
        <Field label="Email" message="Required" invalid>
          <Input />
        </Field>
        <FormGroup title="Notifications">
          <input type="checkbox" aria-label="Email" />
        </FormGroup>
        <TableContainer focusable aria-label="Projects">
          <Table>
            <TableCaption>Current workspace projects</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableHead scope="row">Roadmap</TableHead>
                <TableCell>Maya</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps every native temporal Input path explicitly labelled", async () => {
    const { container } = render(
      <form aria-label="Planning window">
        <Field label="Start date">
          <Input type="date" name="startDate" required />
        </Field>
        <Field label="Billing month">
          <Input type="month" name="billingMonth" />
        </Field>
        <Field label="Reporting week">
          <Input type="week" name="reportingWeek" />
        </Field>
        <Field label="Start time">
          <Input type="time" name="startTime" />
        </Field>
        <Field label="Local deadline">
          <Input type="datetime-local" name="localDeadline" readOnly />
        </Field>
      </form>,
    );

    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps focusable table overflow regions named and keyboard reachable", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <h2 id="delivery-title">Delivery</h2>
        <TableContainer focusable aria-labelledby="delivery-title">
          <Table>
            <TableCaption>Delivery status by project</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead aria-sort="none">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableHead scope="row">Roadmap</TableHead>
                <TableCell>Ready</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>,
    );

    expect((await axe(container)).violations).toEqual([]);
    await user.tab();
    expect(screen.getByRole("region", { name: "Delivery" })).toHaveFocus();
  });

  it("keeps malformed runtime TableContainer focus opt-ins out of the tab order", async () => {
    const UnsafeTableContainer = TableContainer as React.ComponentType<
      React.HTMLAttributes<HTMLDivElement> & { focusable?: unknown }
    >;
    const user = userEvent.setup();
    const { container } = render(
      <>
        <UnsafeTableContainer focusable aria-label="   ">
          Unnamed table overflow
        </UnsafeTableContainer>
        <button type="button">After table</button>
      </>,
    );

    expect((await axe(container)).violations).toEqual([]);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole("button", { name: "After table" })).toHaveFocus();
  });

  it("keeps named ButtonGroup controls independently reachable without toolbar behavior", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <ButtonGroup aria-label="Document actions">
          <Button render={<a href="/preview" />} variant="secondary">
            Preview
          </Button>
          <Button icon={Bell} aria-label="More document actions" variant="secondary" />
        </ButtonGroup>
        <ButtonGroup aria-label="Publishing actions" orientation="vertical">
          <Button loading variant="secondary">
            Publish
          </Button>
          <Button disabled variant="secondary">
            Archive
          </Button>
        </ButtonGroup>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
    await user.tab();
    expect(screen.getByRole("link", { name: "Preview" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "More document actions" })).toHaveFocus();
  });

  it("covers representative static Core accessibility surfaces", async () => {
    const { container } = render(
      <>
        <Avatar name="Maya Chen" />
        <Icon icon={Bell} />
        <Icon decorative={false} icon={Bell} label="Notifications available" />
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle>No projects</EmptyStateTitle>
            <EmptyStateDescription>Create one to get started.</EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
        <Pagination pages={[{ key: "one", label: "1", current: true }]} />
        <Tabs defaultValue="overview">
          <TabsList aria-label="Workspace sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsIndicator />
          </TabsList>
          <TabsPanels>
            <TabsContent value="overview">Overview content</TabsContent>
          </TabsPanels>
        </Tabs>
        <Select label="Status" options={[{ label: "Draft", value: "draft" }]} />
        <Toast title="Saved" description="Your changes are live." />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps standalone and decorative Spinner modes accessible without duplicate status regions", async () => {
    const { container } = render(
      <>
        <Spinner label="Loading activity" />
        <Spinner decorative />
        <Button loading>Save changes</Button>
        <Badge loading>Publishing</Badge>
      </>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading activity");
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps named determinate, indeterminate, custom-range, and externally labelled Progress accessible", async () => {
    const { container } = render(
      <>
        <Progress label="Uploading files" value={68} />
        <Progress aria-label="Synchronizing workspace" value={null} valueText="Synchronizing" />
        <Progress label="Importing records" max={5} value={3} valueText="3 of 5 records imported" />
        <span id="export-progress-label">Exporting report</span>
        <Progress aria-labelledby="export-progress-label" value={40} />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps Item semantics consumer-owned for static content and native links", async () => {
    const { container } = render(
      <>
        <Item>
          <ItemContent>
            <ItemTitle>Workspace settings</ItemTitle>
            <ItemDescription>Manage members and security.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button type="button">Open</button>
          </ItemActions>
        </Item>
        <Item render={<a href="/settings" />}>
          <ItemContent>
            <ItemTitle>Open workspace settings</ItemTitle>
          </ItemContent>
        </Item>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
    expect(screen.getByText("Workspace settings").closest(".n-item")).not.toHaveAttribute(
      "tabindex",
    );
    expect(screen.getByRole("link", { name: "Open workspace settings" })).toHaveAttribute(
      "href",
      "/settings",
    );
  });

  it("keeps grouped inputs labelled and leaves addon actions independently accessible", async () => {
    const { container } = render(
      <>
        <Field label="Workspace URL" description="Include the team subdomain.">
          <InputGroup>
            <InputGroupAddon placement="start" aria-hidden="true">
              https://
            </InputGroupAddon>
            <Input />
            <InputGroupAddon placement="end">
              <Button aria-label="Validate workspace URL">Check</Button>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field label="Read-only code">
          <Input readOnly defaultValue="NERIO" />
        </Field>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps read-only Textarea and LabelHint semantics discoverable without form submission", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());
    const { container } = render(
      <form onSubmit={onSubmit}>
        <Field label="Release notes">
          <Textarea readOnly defaultValue="Approved for release" />
        </Field>
        <LabelHint label="Only maintainers can edit release notes." />
      </form>,
    );

    const notes = screen.getByRole("textbox", { name: "Release notes" });
    const hint = screen.getByRole("button", { name: "More information" });
    expect(notes).toHaveAttribute("readonly");
    expect(hint).toHaveAttribute("type", "button");
    await user.click(hint);
    expect(onSubmit).not.toHaveBeenCalled();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps Checkbox, RadioGroup, and Switch controls named and associated", async () => {
    const { container } = render(
      <>
        <label>
          <Checkbox defaultChecked /> Receive product updates
        </label>
        <RadioGroup
          label="Visibility"
          description="Choose who can access this project."
          message="Select one option."
          invalid
        >
          <RadioGroupItem value="private">Private</RadioGroupItem>
          <RadioGroupItem value="team">Team</RadioGroupItem>
        </RadioGroup>
        <label>
          <Switch defaultChecked /> Notify collaborators
        </label>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps closed, open, invalid, grouped, and alternative-name Select states accessible", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Select
          description="Choose the closest workflow state."
          invalid
          label="Publication status"
          message="A status is required."
          options={[
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published", disabled: true },
          ]}
        />
        <Select aria-label="Project visibility" label="Visibility">
          <SelectGroup>
            <SelectGroupLabel>Workspace</SelectGroupLabel>
            <SelectItem value="team">Team</SelectItem>
          </SelectGroup>
        </Select>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
    await user.click(screen.getByRole("combobox", { name: "Publication status" }));
    await screen.findByRole("listbox");
    expect(
      (
        await axe(document.body, {
          rules: { region: { enabled: false } },
        })
      ).violations,
    ).toEqual([]);
  });

  it("covers an open dialog and a managed toast action", async () => {
    function ToastTrigger() {
      const manager = useToastManager();
      return (
        <button
          onClick={() =>
            manager.add({
              title: "Saved",
              data: { action: { label: "Undo", onClick: () => undefined } },
            })
          }
        >
          Show toast
        </button>
      );
    }
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <Dialog trigger="Open settings" title="Settings" description="Configure preferences.">
          Dialog body
        </Dialog>
        <ToastTrigger />
        <ToastViewport />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Open settings" }));
    await screen.findByRole("dialog", { name: "Settings" });
    expect((await axe(document.body)).violations).toEqual([]);
    await user.click(screen.getByRole("button", { name: "Close dialog" }));
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await screen.findByRole("button", { name: "Undo" });
    expect((await axe(document.body)).violations).toEqual([]);
  });

  it("announces urgent managed copy once without action or decorative icon content", async () => {
    function ToastTrigger() {
      const manager = useToastManager();
      return (
        <button
          onClick={() =>
            manager.add({
              title: "Connection lost",
              description: "Changes are saved locally.",
              priority: "high",
              data: {
                tone: "danger",
                action: { label: "Retry now", onClick: () => undefined },
              },
            })
          }
        >
          Show urgent toast
        </button>
      );
    }
    const user = userEvent.setup();
    const { container } = render(
      <ToastProvider>
        <ToastTrigger />
        <ToastViewport label="Product notifications" />
      </ToastProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Show urgent toast" });
    await user.click(trigger);

    expect(trigger).toHaveFocus();
    expect(screen.getByRole("region", { name: "Product notifications" })).toHaveAttribute(
      "aria-live",
      "polite",
    );
    const announcement = screen.getByRole("alert");
    expect(announcement).toHaveTextContent("Connection lostChanges are saved locally.");
    expect(announcement).not.toHaveTextContent("Retry now");
    expect(container.querySelectorAll('[data-slot="status-indicator"]')).toHaveLength(0);
    expect(document.querySelectorAll('[data-slot="status-indicator"]')).toHaveLength(1);
    expect(document.querySelector('[data-slot="status-indicator"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect((await axe(document.body)).violations).toEqual([]);
  });

  it("keeps an open Sheet named, reachable, and free of modal accessibility violations", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button variant="secondary">Open navigation</Button>} />
        <SheetContent side="bottom" size="sm" showClose={false}>
          <SheetHeader>
            <SheetTitle>Workspace navigation</SheetTitle>
            <SheetDescription>Open a destination without leaving this context.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <button type="button">Projects</button>
          </SheetBody>
          <SheetFooter>
            <SheetClose render={<Button variant="secondary">Close navigation</Button>} />
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    await screen.findByRole("dialog", { name: "Workspace navigation" });
    expect((await axe(document.body)).violations).toEqual([]);
  });

  it("keeps expanded and collapsed Sidebar trees named and keyboard safe", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SidebarProvider>
        <Sidebar aria-label="Workspace sidebar">
          <SidebarContent>
            <nav aria-label="Workspace navigation">
              <a href="/projects">Projects</a>
            </nav>
          </SidebarContent>
          <SidebarRail label="Collapse workspace sidebar" />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger label="Toggle workspace sidebar" />
          <button type="button">Create project</button>
        </SidebarInset>
      </SidebarProvider>,
    );

    expect((await axe(container)).violations).toEqual([]);
    const trigger = screen.getByRole("button", { name: "Toggle workspace sidebar" });
    await user.click(trigger);
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("complementary", { name: "Workspace sidebar" })).toHaveAttribute(
      "data-state",
      "collapsed",
    );
    expect((await axe(container)).violations).toEqual([]);
    await user.tab();
    expect(screen.getByRole("button", { name: "Create project" })).toHaveFocus();
  });

  it("keeps Command input, groups, empty, and loading announcements accessible", async () => {
    const items = [
      {
        value: "navigation",
        label: "Navigation",
        items: [
          { value: "overview", label: "Open overview" },
          { value: "settings", label: "Open settings", disabled: true },
        ],
      },
    ];
    const { container } = render(
      <Command items={items}>
        <label htmlFor="accessible-command">Workspace command</label>
        <CommandInput id="accessible-command" />
        <CommandLoading loading={false} />
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandList>
          {(item) => (
            <CommandItem key={item.value} value={item.value} disabled={item.disabled}>
              {item.label}
            </CommandItem>
          )}
        </CommandList>
      </Command>,
    );

    expect(screen.getByRole("combobox", { name: "Workspace command" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Navigation" })).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });

  it("keeps horizontal, vertical, disabled, and read-only Sliders accessible", async () => {
    const { container } = render(
      <>
        <Slider
          label="Volume"
          description="Notification playback level."
          defaultValue={45}
          valueLabel="45%"
          getAriaValueText={(_, value) => `${value} percent`}
        />
        <Slider aria-label="Vertical volume" defaultValue={60} orientation="vertical" />
        <Slider aria-label="Unavailable volume" defaultValue={20} disabled />
        <Slider aria-labelledby="readonly-slider-label" defaultValue={80} readOnly />
        <span id="readonly-slider-label">Read-only volume</span>
      </>,
    );

    expect(screen.getByRole("slider", { name: "Volume" })).toHaveAttribute(
      "aria-valuetext",
      "45 percent",
    );
    expect(screen.getByRole("slider", { name: "Vertical volume" })).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
    expect(screen.getByRole("slider", { name: "Unavailable volume" })).toBeDisabled();
    expect(screen.getByRole("slider", { name: "Read-only volume" })).toHaveAttribute(
      "aria-readonly",
      "true",
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
