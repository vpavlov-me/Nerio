import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Avatar,
  Badge,
  EmptyState,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
  Pagination,
  Progress,
  Spinner,
  TableContainer,
} from "../../src/index";
import {
  Button,
  Checkbox,
  Dialog,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Bell } from "@nerio/adapters";

describe("Core accessibility contracts", () => {
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
        <TableContainer focusable label="Projects">
          <table>
            <tbody>
              <tr>
                <td>Roadmap</td>
              </tr>
            </tbody>
          </table>
        </TableContainer>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
  });

  it("covers representative static Core accessibility surfaces", async () => {
    const { container } = render(
      <>
        <Avatar name="Maya Chen" />
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

  it("keeps an open Sheet named, reachable, and free of modal accessibility violations", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button variant="secondary">Open navigation</Button>} />
        <SheetContent side="bottom" size="sm">
          <SheetHeader>
            <SheetTitle>Workspace navigation</SheetTitle>
            <SheetDescription>Open a destination without leaving this context.</SheetDescription>
          </SheetHeader>
          <SheetBody>
            <button type="button">Projects</button>
          </SheetBody>
          <SheetFooter>
            <button type="button">Close navigation</button>
          </SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    await screen.findByRole("dialog", { name: "Workspace navigation" });
    expect((await axe(document.body)).violations).toEqual([]);
  });
});
