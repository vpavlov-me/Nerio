import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Avatar,
  Alert,
  Badge,
  ButtonGroup,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
  CardVisual,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Field,
  Input,
  InputGroup,
  InputGroupAddon,
  Kbd,
  Label,
  LabelContent,
  LabelRequired,
  LabelRow,
  List,
  Pagination,
  Progress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "../../src/index";
import {
  Button,
  Checkbox,
  Dialog,
  DropdownMenu,
  LabelHint,
  Popover,
  RadioGroup,
  RadioGroupItem,
  Select,
  Switch,
  Tabs,
  Tooltip,
  Toast,
  ToastProvider,
  ToastViewport,
  useToastManager,
} from "../../src/client";
import { ArrowRight, Bell, Check } from "@nerio/adapters";

// Compile-time public API contracts. These must fail if Button or Card modes regress.
// @ts-expect-error empty Button requires visible children or icon-only mode
const invalidEmptyButton = <Button />;
// @ts-expect-error icon-only Button requires an accessible name
const invalidUnnamedIconButton = <Button icon={Bell} />;
// @ts-expect-error icon-only Button cannot include visible children
const invalidMixedIconButton = (
  <Button icon={Bell} aria-label="Notifications">
    Notifications
  </Button>
);
// @ts-expect-error icon-only Button cannot receive directional icon props
const invalidDirectionalIconButton = (
  <Button icon={Bell} aria-label="Notifications" leadingIcon={Bell} />
);
// @ts-expect-error Button shortcuts only accept text, numbers, or Nerio Kbd elements
const invalidButtonKbd = <Button kbd={<span>⌘K</span>}>Search</Button>;
// @ts-expect-error icon-only Button cannot include a Badge
const invalidIconButtonBadge = (
  <Button icon={Bell} aria-label="Notifications" badge={<Badge>2</Badge>} />
);
// @ts-expect-error linked Cards cannot also choose a surface root
const invalidLinkedCard = <Card href="/docs" as="article" />;
// @ts-expect-error Date inputs have a dedicated future component boundary.
const invalidInputType = <Input type="date" />;
// @ts-expect-error Native HTML size is exposed as htmlSize, not Input size.
const invalidNativeInputSize = <Input size={24} />;
// @ts-expect-error Input sizes are limited to the shared control scale.
const invalidInputScale = <Input size="xl" />;
// @ts-expect-error RadioGroup accepts either options or composition, not both.
const invalidMixedRadioGroup = (
  <RadioGroup label="Visibility" options={[{ label: "Team", value: "team" }]}>
    <RadioGroupItem value="private">Private</RadioGroupItem>
  </RadioGroup>
);
const validComposedRadioGroup = (
  <RadioGroup label="Visibility">
    <RadioGroupItem value="team">Team</RadioGroupItem>
  </RadioGroup>
);
void [
  invalidEmptyButton,
  invalidUnnamedIconButton,
  invalidMixedIconButton,
  invalidDirectionalIconButton,
  invalidButtonKbd,
  invalidIconButtonBadge,
  invalidLinkedCard,
  invalidInputType,
  invalidNativeInputSize,
  invalidInputScale,
  invalidMixedRadioGroup,
  validComposedRadioGroup,
];

describe("Core static contracts", () => {
  it("groups related Buttons with a labelled group landmark", () => {
    render(
      <ButtonGroup aria-label="Document actions">
        <button>Cancel</button>
        <button>Save</button>
      </ButtonGroup>,
    );
    const group = screen.getByRole("group", { name: "Document actions" });
    expect(group).toHaveAttribute("data-slot", "button-group");
  });

  it("renders decorative Badge icons on either side of its status label and supports loading", () => {
    const { rerender } = render(
      <Badge tone="success" leadingIcon={Check} trailingIcon={ArrowRight}>
        Published
      </Badge>,
    );
    const badge = screen.getByText("Published").closest(".n-badge");
    expect(badge).toHaveAttribute("data-tone", "success");
    expect(badge).toHaveAttribute("data-emphasis", "soft");
    expect(badge).toHaveAttribute("data-size", "md");
    expect(badge?.querySelector('[data-slot="leading-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(badge?.querySelector('[data-slot="trailing-icon"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );

    rerender(
      <Badge loading leadingIcon={Bell}>
        Publishing
      </Badge>,
    );
    const loadingBadge = screen.getByText("Publishing").closest(".n-badge");
    expect(loadingBadge).toHaveAttribute("aria-busy", "true");
    expect(loadingBadge?.querySelector('[data-slot="leading-icon"]')).not.toBeNull();

    rerender(
      <Badge tone="danger" emphasis="strong">
        Deployment blocked
      </Badge>,
    );
    expect(screen.getByText("Deployment blocked").closest(".n-badge")).toHaveAttribute(
      "data-emphasis",
      "strong",
    );

    rerender(
      <Badge icon={Bell} size="sm">
        Notifications
      </Badge>,
    );
    expect(
      screen
        .getByText("Notifications")
        .closest(".n-badge")
        ?.querySelector('[data-slot="leading-icon"]'),
    ).not.toBeNull();
    expect(screen.getByText("Notifications").closest(".n-badge")).toHaveAttribute(
      "data-size",
      "sm",
    );

    rerender(<Badge size="lg">Featured</Badge>);
    expect(screen.getByText("Featured").closest(".n-badge")).toHaveAttribute("data-size", "lg");
  });

  it("renders Kbd with a native semantic element and a stable styling hook", () => {
    render(<Kbd>⌘S</Kbd>);
    const shortcut = screen.getByText("⌘S");
    expect(shortcut.tagName).toBe("KBD");
    expect(shortcut).toHaveClass("n-kbd");
  });

  it("keeps Progress ARIA on the progressbar and normalizes unsafe values", () => {
    const { rerender } = render(<Progress ariaLabel="Upload progress" value={150} />);
    const progressbar = screen.getByRole("progressbar", { name: "Upload progress" });
    expect(progressbar).toHaveAttribute("aria-valuenow", "100");
    expect(progressbar.querySelector("[data-slot=indicator]")).toHaveStyle(
      "--n-progress-value: 100%",
    );

    rerender(<Progress value={Number.NaN} indeterminateLabel="Synchronizing" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Synchronizing");
  });

  it.each([
    [0, 0],
    [50, 50],
    [100, 100],
    [-4, 0],
    [104, 100],
  ])("clamps Progress value %s to %s", (value, expected) => {
    render(<Progress value={value} valueText={`${expected}% complete`} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", String(expected));
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuetext",
      `${expected}% complete`,
    );
  });

  it.each([Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "treats non-finite Progress value %s as indeterminate",
    (value) => {
      render(<Progress value={value} />);
      expect(screen.getByRole("progressbar")).not.toHaveAttribute("aria-valuenow");
    },
  );

  it("allows deliberate Card and EmptyState heading semantics", () => {
    render(
      <>
        <Card as="article">
          <CardTitle as="h2">Overview</CardTitle>
        </Card>
        <EmptyState>
          <EmptyStateHeader>
            <EmptyStateTitle as="h4">No results</EmptyStateTitle>
            <EmptyStateDescription>Try another search.</EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
      </>,
    );
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Overview", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No results", level: 4 })).toBeInTheDocument();
  });

  it("renders linked secondary Cards as native interactive anchors", () => {
    render(
      <Card href="/docs/components/button" variant="secondary">
        Button documentation
      </Card>,
    );
    const card = screen.getByRole("link", { name: "Button documentation" });
    expect(card).toHaveAttribute("href", "/docs/components/button");
    expect(card).toHaveAttribute("data-variant", "secondary");
  });

  it("provides controlled visual and header-action Card anatomy", () => {
    render(
      <Card>
        <CardVisual>Workspace icon</CardVisual>
        <CardHeader>
          <div>
            <CardTitle>Workspace</CardTitle>
          </div>
          <CardAction>Active</CardAction>
        </CardHeader>
        <CardContent>Overview</CardContent>
      </Card>,
    );
    expect(screen.getByText("Workspace icon")).toHaveAttribute("data-slot", "card-visual");
    expect(screen.getByText("Workspace icon")).toHaveAttribute("data-placement", "inset");
    expect(screen.getByText("Active")).toHaveAttribute("data-slot", "card-action");
    expect(screen.getByText("Workspace")).toHaveAttribute("data-slot", "card-title");
  });

  it("supports a bleed CardVisual while protecting Card-owned anatomy", () => {
    render(
      <Card>
        <CardVisual
          placement="bleed"
          {...({ "data-slot": "consumer", "data-placement": "consumer" } as Record<string, string>)}
        >
          Preview
        </CardVisual>
      </Card>,
    );
    const visual = screen.getByText("Preview");
    expect(visual).toHaveAttribute("data-slot", "card-visual");
    expect(visual).toHaveAttribute("data-placement", "bleed");
  });

  it("resets Avatar fallback state when src changes and exposes intentional fallback names", () => {
    const { rerender } = render(<Avatar name="  Maya   Chen " />);
    expect(screen.getByText("MC")).toBeInTheDocument();
    rerender(<Avatar name="Иван Петров" src="/missing.png" />);
    fireEvent.error(screen.getByRole("img", { name: "Иван Петров" }));
    expect(screen.getByRole("img", { name: "Иван Петров" })).toHaveTextContent("ИП");
    rerender(<Avatar name="Иван Петров" src="/replacement.png" />);
    expect(screen.getByRole("img", { name: "Иван Петров" })).toHaveAttribute(
      "src",
      "/replacement.png",
    );
    rerender(<Avatar name="" fallback="Team" decorative />);
    expect(screen.getByText("Team")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports Avatar alt overrides, one-word names, and every size", () => {
    const { rerender } = render(
      <Avatar name="Maya" size="sm" src="/maya.png" alt="Profile photo" />,
    );
    expect(screen.getByRole("img", { name: "Profile photo" }).closest("span")).toHaveAttribute(
      "data-size",
      "sm",
    );
    rerender(<Avatar name="Maya" size="lg" />);
    expect(screen.getByText("M").parentElement).toHaveAttribute("data-size", "lg");
  });

  it("keeps ordered lists visibly ordered and supports stable item IDs", () => {
    render(
      <List
        ordered
        items={[
          { id: "one", title: "First" },
          { id: "two", title: "Second" },
        ]}
      />,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("protects List destinations and anatomy while preserving safe link props", () => {
    render(
      <List
        items={[
          {
            id: "docs",
            title: "Documentation",
            href: "/docs",
            linkProps: {
              className: "custom-link",
              target: "_blank",
              rel: "noreferrer",
              "aria-label": "Open documentation",
              "data-source": "navigation",
              "data-slot": "consumer-slot",
            },
          },
        ]}
      />,
    );
    const link = screen.getByRole("link", { name: "Open documentation" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveClass("n-list__link", "custom-link");
    expect(link).toHaveAttribute("data-slot", "link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
    expect(link).toHaveAttribute("data-source", "navigation");
  });

  it("renders link, button, ellipsis, current and disabled Pagination controls", async () => {
    const user = userEvent.setup();
    const select = vi.fn();
    render(
      <Pagination
        previousHref="/previous"
        nextOnSelect={select}
        pages={[
          { key: "one", label: "1", href: "/one" },
          { key: "dots", type: "ellipsis" },
          { key: "two", label: "2", onSelect: select, current: true },
          { key: "three", label: "3", disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute("href", "/one");
    expect(screen.getByRole("button", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByLabelText("More pages")).toHaveTextContent("…");
    await user.click(screen.getByRole("button", { name: "Go to next page" }));
    expect(select).toHaveBeenCalledOnce();
    expect(screen.getByText("3")).toHaveAttribute("aria-disabled", "true");
  });

  it("allows router pagination rendering and preserves labels on disabled boundaries", () => {
    render(
      <Pagination
        previousAriaLabel="Older"
        nextAriaLabel="Newer"
        pages={[
          { key: "router", label: "Router", href: "/router", render: <a data-router-link="" /> },
        ]}
      />,
    );
    expect(screen.getByText("Router")).toHaveAttribute("data-router-link", "");
    expect(screen.getByText("Previous")).toHaveAttribute("aria-label", "Older");
    expect(screen.getByText("Next")).toHaveAttribute("aria-label", "Newer");
  });

  it("only creates a keyboard scroll stop for an explicit TableContainer", () => {
    const { rerender } = render(
      <TableContainer>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByText("A").closest("div")).not.toHaveAttribute("tabindex");
    expect(screen.getByText("A").closest("div")).not.toHaveAttribute("role");
    rerender(
      <TableContainer label="Project table">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByRole("region", { name: "Project table" })).not.toHaveAttribute("tabindex");
    rerender(
      <TableContainer focusable label="Projects">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>,
    );
    expect(screen.getByRole("region", { name: "Projects" })).toHaveAttribute("tabindex", "0");
  });

  it("generates Field associations, preserves consumer IDs, and rejects multiple controls", () => {
    const { rerender } = render(
      <Field label="Email" description="Updates only" message="Required" invalid>
        <Input />
      </Field>,
    );
    const generated = screen.getByRole("textbox", { name: "Email" });
    expect(generated).toHaveAttribute("aria-invalid", "true");
    expect(generated.getAttribute("aria-describedby")).toContain("-description");
    rerender(
      <Field label="Project">
        <Input id="project-name" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Project" })).toHaveAttribute("id", "project-name");
    expect(() =>
      render(
        <Field label="Invalid">
          <Input />
          <Input />
        </Field>,
      ),
    ).toThrow("exactly one");
  });

  it("composes label requirements and hint context without nesting a control inside the label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <LabelRow>
          <LabelContent>
            <Label htmlFor="project-name">Project name</Label>
            <LabelRequired />
            <LabelHint label="Visible to workspace members" />
          </LabelContent>
        </LabelRow>
        <Input id="project-name" required />
      </>,
    );

    expect(screen.getByText("*")).toHaveAttribute("data-slot", "required");
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("textbox", { name: "Project name" })).toBeRequired();
    expect(
      Array.from(document.querySelector("[data-slot=content]")!.children).map((child) =>
        child.getAttribute("data-slot"),
      ),
    ).toEqual(["root", "required", "hint"]);

    await user.hover(screen.getByLabelText("More information"));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Visible to workspace members");
  });

  it("keeps default Card and EmptyState semantics and forwards refs", () => {
    const cardRef = React.createRef<HTMLElement>();
    const emptyRef = React.createRef<HTMLDivElement>();
    render(
      <>
        <Card ref={cardRef}>Card</Card>
        <EmptyState ref={emptyRef}>
          <EmptyStateHeader>
            <EmptyStateTitle>Empty</EmptyStateTitle>
            <EmptyStateDescription>Nothing here</EmptyStateDescription>
          </EmptyStateHeader>
        </EmptyState>
      </>,
    );
    expect(cardRef.current?.tagName).toBe("SECTION");
    expect(emptyRef.current).toHaveAttribute("data-slot", "empty-state");
    expect(screen.getByRole("heading", { name: "Empty", level: 3 })).toBeInTheDocument();
  });

  it("composes optional EmptyState slots and preserves their public attributes", () => {
    const mediaRef = React.createRef<HTMLDivElement>();
    render(
      <EmptyState
        align="start"
        aria-label="No search results"
        className="custom-empty-state"
        data-testid="empty-state"
        size="lg"
      >
        <EmptyStateMedia ref={mediaRef} variant="illustration">
          <svg aria-hidden="true" />
        </EmptyStateMedia>
        <EmptyStateHeader className="custom-header">
          <EmptyStateTitle as="h2">No results</EmptyStateTitle>
          <EmptyStateDescription>Try a different query.</EmptyStateDescription>
        </EmptyStateHeader>
        <input aria-label="Search again" />
        <EmptyStateActions orientation="vertical" className="custom-actions">
          <button type="button">Clear filters</button>
          <a href="#help">Get help</a>
        </EmptyStateActions>
      </EmptyState>,
    );

    const root = screen.getByTestId("empty-state");
    expect(root).toHaveAttribute("data-slot", "empty-state");
    expect(root).toHaveAttribute("data-size", "lg");
    expect(root).toHaveAttribute("data-align", "start");
    expect(root).toHaveAttribute("aria-label", "No search results");
    expect(root).toHaveClass("custom-empty-state");
    expect(root).not.toHaveAttribute("role");
    expect(mediaRef.current).toHaveAttribute("data-slot", "empty-state-media");
    expect(mediaRef.current).toHaveAttribute("data-variant", "illustration");
    expect(screen.getByText("No results").closest("[data-slot]")).toHaveAttribute(
      "data-slot",
      "empty-state-title",
    );
    expect(screen.getByText("Try a different query.")).toHaveAttribute(
      "data-slot",
      "empty-state-description",
    );
    expect(screen.getByRole("button", { name: "Clear filters" }).parentElement).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(screen.getByRole("link", { name: "Get help" })).toHaveAttribute("href", "#help");
  });

  it("renders Alert content and an optional trailing action slot", () => {
    render(
      <Alert action={<button type="button">Retry</button>} icon={Check} title="Upload failed">
        Try again after checking the connection.
      </Alert>,
    );

    expect(screen.getByText("Upload failed")).toHaveAttribute("data-slot", "title");
    expect(screen.getByText("Try again after checking the connection.")).toHaveAttribute(
      "data-slot",
      "description",
    );
    expect(screen.getByRole("button", { name: "Retry" }).parentElement).toHaveAttribute(
      "data-slot",
      "action",
    );
  });

  it("renders static Toast tone, title, and description without a broad descendant selector", () => {
    render(<Toast tone="success" title="Saved" description="Your changes are live." />);
    expect(screen.getByRole("status")).toHaveAttribute("data-tone", "success");
    expect(screen.getByText("Saved")).toHaveAttribute("data-slot", "title");
  });

  it("renders managed Toast actions and localized dismiss controls", async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    function Trigger() {
      const manager = useToastManager();
      return (
        <button
          onClick={() =>
            manager.add({
              title: "Saved",
              data: { tone: "success", action: { label: "Undo", onClick: action } },
            })
          }
        >
          Show
        </button>
      );
    }
    render(
      <ToastProvider>
        <Trigger />
        <ToastViewport dismissLabel="Close notification" />
      </ToastProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Show" }));
    await user.click(await screen.findByRole("button", { name: "Undo" }));
    expect(action).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Close notification" })).toHaveAttribute(
      "data-slot",
      "close",
    );
  });
});

describe("Core interactive action contracts", () => {
  it("disables loading buttons while preserving their action name", () => {
    render(
      <Button loading loadingLabel="Saving">
        Save changes
      </Button>,
    );
    const button = screen.getByRole("button", { name: /save changes/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector("[role=status]")).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps an icon-only Button label available while loading", () => {
    render(<Button icon={Bell} aria-label="Open notifications" loading />);
    const button = screen.getByRole("button", { name: /open notifications/i });
    expect(button).toBeDisabled();
    expect(button.querySelector("[role=status]")).toHaveAttribute("aria-hidden", "true");
  });

  it("supports directional icons, Badge counts, shortcut hints, and accessible icon-only actions", () => {
    render(
      <>
        <Button
          leadingIcon={Bell}
          trailingIcon={Bell}
          badge={<Badge tone="info">24</Badge>}
          kbd="⌘N"
        >
          Create notification
        </Button>
        <Button icon={Bell} aria-label="Open notifications" tooltip="Open notifications" />
      </>,
    );

    const labeledButton = screen.getByRole("button", { name: "Create notification 24" });
    expect(labeledButton.querySelectorAll("[data-slot=button-icon]")).toHaveLength(2);
    expect(labeledButton.querySelector("[data-slot=button-badge]")).toHaveTextContent("24");
    expect(labeledButton.querySelector(".n-badge")).toHaveAttribute("data-size", "sm");
    expect(labeledButton.querySelector("[data-slot=button-kbd]")).toHaveTextContent("⌘N");
    expect(
      Array.from(labeledButton.children).map((child) => child.getAttribute("data-slot")),
    ).toEqual(["button-icon", "button-label", "button-badge", "button-kbd", "button-icon"]);

    const iconButton = screen.getByRole("button", { name: "Open notifications" });
    expect(iconButton).toHaveAttribute("data-icon-only", "true");
    expect(iconButton.querySelector("[data-slot=button-label]")).not.toBeInTheDocument();
  });

  it("renders the link Button variant as a native anchor without a separate Link component", () => {
    render(
      <Button
        leadingIcon={ArrowRight}
        nativeButton={false}
        render={<a href="/docs" />}
        variant="link"
      >
        Read the docs
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Read the docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-variant", "link");
    expect(link).toHaveClass("n-button");
    expect(link.querySelector("[data-slot=button-icon] .n-icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("preserves non-link custom render targets for navigational Buttons", () => {
    render(
      <Button
        aria-label="Next: Spinner"
        icon={ArrowRight}
        nativeButton={false}
        render={<a href="/docs/components/spinner" />}
        variant="secondary"
      />,
    );

    const link = screen.getByRole("link", { name: "Next: Spinner" });
    expect(link).toHaveAttribute("href", "/docs/components/spinner");
    expect(link).toHaveAttribute("data-variant", "secondary");
    expect(link).toHaveClass("n-button");
  });

  it("normalizes deprecated Button variants and protects Button-owned state attributes", () => {
    render(
      <>
        <Button variant="subtle" data-variant="consumer">
          Subtle
        </Button>
        <Button variant="destructive">Destructive</Button>
        <Button loading data-loading="consumer" aria-busy={false}>
          Save
        </Button>
      </>,
    );
    expect(screen.getByRole("button", { name: "Subtle" })).toHaveAttribute(
      "data-variant",
      "secondary",
    );
    expect(screen.getByRole("button", { name: "Destructive" })).toHaveAttribute(
      "data-variant",
      "danger",
    );
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("data-loading", "true");
    expect(screen.getByRole("button", { name: "Save" })).toHaveAttribute("aria-busy", "true");
  });

  it("only treats Nerio Kbd elements as Button shortcuts", () => {
    render(
      <Button kbd={<Kbd>⌘S</Kbd>} aria-keyshortcuts="Meta+S">
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.querySelector("[data-slot=button-kbd]")?.tagName).toBe("KBD");
    expect(button.querySelector("[data-slot=button-kbd]")).toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAttribute("aria-keyshortcuts", "Meta+S");
  });

  it("protects Card anatomy while preserving native anchor attributes", () => {
    render(
      <Card
        href="/download"
        download
        hrefLang="en"
        referrerPolicy="no-referrer"
        {...({ "data-slot": "consumer", "data-variant": "consumer" } as Record<string, string>)}
      >
        Download
      </Card>,
    );
    const card = screen.getByRole("link", { name: "Download" });
    expect(card).toHaveAttribute("download");
    expect(card).toHaveAttribute("hreflang", "en");
    expect(card).toHaveAttribute("referrerpolicy", "no-referrer");
    expect(card).toHaveAttribute("data-slot", "card");
    expect(card).toHaveAttribute("data-variant", "default");
  });

  it("requires an element Tooltip trigger and supports focus, controlled state, and disabled state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Tooltip label="Copy link" onOpenChange={onOpenChange}>
        <button>Copy</button>
      </Tooltip>,
    );
    await user.tab();
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Copy link");
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    rerender(
      <Tooltip label="Copy link" open={false} disabled>
        <button>Copy</button>
      </Tooltip>,
    );
    await user.hover(screen.getByRole("button", { name: "Copy" }));
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("shows an optional tooltip for an icon-only Button", async () => {
    const user = userEvent.setup();
    render(<Button icon={Bell} aria-label="Open notifications" tooltip="Open notifications" />);

    await user.hover(screen.getByRole("button", { name: "Open notifications" }));
    expect(await screen.findByRole("tooltip")).toHaveTextContent("Open notifications");
  });

  it("supports uncontrolled Dialog open, Escape close, and focus restoration", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger="Open settings" title="Settings">
        Dialog body
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open settings" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Settings" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps controlled Dialog state consumer-owned and exposes its associations", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    function ControlledDialog() {
      const [open, setOpen] = React.useState(false);
      return (
        <Dialog
          trigger="Open controlled dialog"
          title="Controlled settings"
          description="Managed by the consumer."
          open={open}
          onOpenChange={(nextOpen, details) => {
            onOpenChange(nextOpen, details);
            setOpen(nextOpen);
          }}
        >
          Settings body
        </Dialog>
      );
    }
    render(<ControlledDialog />);
    await user.click(screen.getByRole("button", { name: "Open controlled dialog" }));
    const dialog = await screen.findByRole("dialog", { name: "Controlled settings" });
    expect(dialog).toHaveAttribute("aria-describedby");
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it("supports controlled Select values, labels, descriptions, and invalid state", () => {
    render(
      <Select
        label="Status"
        description="Workflow state"
        message="Required"
        invalid
        value="draft"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Published", value: "published" },
        ]}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("aria-describedby", expect.stringContaining("-description"));
    expect(trigger).toHaveTextContent("Draft");
  });

  it("renders Select options and disabled option semantics after keyboard opening", async () => {
    const user = userEvent.setup();
    render(
      <Select
        label="Status"
        defaultValue="draft"
        options={[
          { label: "Draft", value: "draft" },
          { label: "Archived", value: "archived", disabled: true },
          { label: "Published", value: "published" },
        ]}
      />,
    );
    const trigger = screen.getByRole("combobox", { name: "Status" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("option", { name: "Archived", hidden: true })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("selects enabled options, skips disabled options, and keeps controlled Select values consumer-owned", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function ControlledSelect() {
      const [value, setValue] = React.useState("draft");
      return (
        <Select
          label="Publication status"
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
          options={[
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived", disabled: true },
            { label: "Published", value: "published" },
          ]}
        />
      );
    }
    render(<ControlledSelect />);
    const trigger = screen.getByRole("combobox", { name: "Publication status" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("option", { name: "Published" });
    await user.click(screen.getByRole("option", { name: "Published" }));
    expect(onValueChange).toHaveBeenCalledWith("published");
    expect(trigger).toHaveTextContent("Published");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
  });

  it("supports checkbox, radio group, and switch state contracts", async () => {
    const user = userEvent.setup();
    const onRadioChange = vi.fn();
    render(
      <>
        <Checkbox aria-label="Subscribe" defaultChecked invalid />
        <Checkbox aria-label="Disabled" disabled />
        <RadioGroup
          label="Visibility"
          defaultValue="team"
          onValueChange={onRadioChange}
          description="Who can view this?"
          invalid
          options={[
            { label: "Private", value: "private" },
            { label: "Team", value: "team" },
            { label: "Disabled", value: "disabled", disabled: true },
          ]}
        />
        <Switch aria-label="Notifications" defaultChecked />
        <Switch aria-label="Disabled notifications" disabled />
      </>,
    );
    expect(screen.getByRole("checkbox", { name: "Subscribe" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("checkbox", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("radio", { name: /Private/ }));
    expect(onRadioChange).toHaveBeenCalledWith("private", expect.anything());
    expect(screen.getByRole("radio", { name: "Disabled" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(screen.getByRole("switch", { name: "Notifications" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("switch", { name: "Disabled notifications" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("keeps Checkbox custom indicators and RadioGroup composition compatible", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const onChange = vi.fn();
    render(
      <>
        <label>
          <Checkbox defaultChecked onCheckedChange={onCheckedChange} /> Include archived
        </label>
        <Checkbox aria-label="Partial selection" indeterminate invalid data-slot="consumer" />
        <Checkbox aria-label="Custom indicator" defaultChecked>
          Custom
        </Checkbox>
        <RadioGroup label="Audience" defaultValue="team" onChange={onChange}>
          <RadioGroupItem value="private" description="Only you can view it.">
            Private
          </RadioGroupItem>
          <RadioGroupItem value="team">Team</RadioGroupItem>
        </RadioGroup>
      </>,
    );
    await user.click(screen.getByRole("checkbox", { name: "Include archived" }));
    expect(onCheckedChange).toHaveBeenCalledWith(false, expect.anything());
    expect(screen.getByRole("checkbox", { name: "Partial selection" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
    expect(screen.getByRole("checkbox", { name: "Partial selection" })).toHaveAttribute(
      "data-slot",
      "root",
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: /Private/ }));
    expect(onChange).toHaveBeenCalledWith("private");
    expect(screen.getByText("Only you can view it.")).toBeInTheDocument();
  });

  it("connects Checkbox label and description props without changing primitive usage", () => {
    render(
      <Checkbox
        defaultChecked
        description="Archived collections remain visible in search results."
        label="Include archived collections"
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Include archived collections" });
    const label = screen.getByText("Include archived collections");
    const description = screen.getByText("Archived collections remain visible in search results.");

    expect(checkbox).toHaveAttribute("aria-labelledby", label.id);
    expect(checkbox).toHaveAttribute("aria-describedby", description.id);
    expect(checkbox.closest("[data-slot='field']")).toBeInTheDocument();
  });

  it("keeps Switch read-only, invalid, and protected anatomy contracts", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <label>
        <Switch
          defaultChecked
          invalid
          readOnly
          data-slot="consumer"
          onCheckedChange={onCheckedChange}
        />
        Notifications
      </label>,
    );
    const switchControl = screen.getByRole("switch", { name: "Notifications" });
    expect(switchControl).toHaveAttribute("aria-invalid", "true");
    expect(switchControl).toHaveAttribute("data-readonly", "");
    expect(switchControl).toHaveAttribute("data-slot", "root");
    await user.click(switchControl);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("connects Switch label and description props without changing primitive usage", () => {
    render(
      <Switch
        defaultChecked
        description="Collaborators receive updates as they happen."
        label="Notify collaborators"
      />,
    );

    const switchControl = screen.getByRole("switch", { name: "Notify collaborators" });
    const label = screen.getByText("Notify collaborators");
    const description = screen.getByText("Collaborators receive updates as they happen.");

    expect(switchControl).toHaveAttribute("aria-labelledby", label.id);
    expect(switchControl).toHaveAttribute("aria-describedby", description.id);
    expect(switchControl.closest("[data-slot='field']")).toBeInTheDocument();
  });

  it("preserves controlled state, keyboard behavior, and form values for Checkbox and Switch", async () => {
    const user = userEvent.setup();
    const onCheckboxChange = vi.fn();
    const onSwitchChange = vi.fn();
    function ControlledControls() {
      const [checked, setChecked] = React.useState(false);
      const [enabled, setEnabled] = React.useState(false);
      return (
        <form aria-label="Control values">
          <label>
            <Checkbox
              checked={checked}
              name="includeArchived"
              value="yes"
              onCheckedChange={(next, details) => {
                onCheckboxChange(next, details);
                setChecked(next);
              }}
            />
            Include archived
          </label>
          <label>
            <Switch
              checked={enabled}
              name="notifications"
              value="enabled"
              onCheckedChange={(next, details) => {
                onSwitchChange(next, details);
                setEnabled(next);
              }}
            />
            Notifications
          </label>
        </form>
      );
    }
    render(<ControlledControls />);
    const checkbox = screen.getByRole("checkbox", { name: "Include archived" });
    const switchControl = screen.getByRole("switch", { name: "Notifications" });
    checkbox.focus();
    await user.keyboard(" ");
    expect(onCheckboxChange).toHaveBeenCalledWith(true, expect.anything());
    expect(checkbox).toHaveAttribute("aria-checked", "true");
    switchControl.focus();
    await user.keyboard(" ");
    expect(onSwitchChange).toHaveBeenCalledWith(true, expect.anything());
    expect(switchControl).toHaveAttribute("aria-checked", "true");
    const form = screen.getByRole("form", { name: "Control values" });
    expect(new FormData(form)).toEqual(
      expect.objectContaining({
        get: expect.any(Function),
      }),
    );
    expect(new FormData(form).get("includeArchived")).toBe("yes");
    expect(new FormData(form).get("notifications")).toBe("enabled");
  });

  it("keeps RadioGroup keyboard navigation, IDs, disabled skipping, and form behavior", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form>
        <RadioGroup
          label="Visibility"
          defaultValue="team"
          description="Choose who can access this project."
          message="Select one option."
          name="visibility"
          onValueChange={onValueChange}
          options={[
            { label: "Private", value: "private" },
            { label: "Team", value: "team" },
            { label: "Unavailable", value: "unavailable", disabled: true },
          ]}
        />
      </form>,
    );
    const group = screen.getByRole("radiogroup", { name: "Visibility" });
    const team = screen.getByRole("radio", { name: "Team" });
    await user.tab();
    expect(team).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Private" })).toHaveAttribute("aria-checked", "true");
    expect(onValueChange).toHaveBeenCalledWith("private", expect.anything());
    await user.keyboard("{ArrowUp}");
    expect(team).toHaveAttribute("aria-checked", "true");
    expect(group).toHaveAttribute("aria-describedby", expect.stringContaining("-description"));
    expect(group).toHaveAttribute("aria-describedby", expect.stringContaining("-message"));
    expect(new FormData(group.closest("form")! as HTMLFormElement).get("visibility")).toBe("team");
  });

  it("covers Checkbox default indicators, protected states, required input, and form submission", async () => {
    const user = userEvent.setup();
    const onDisabledChange = vi.fn();
    const onReadOnlyChange = vi.fn();
    let requiredInput: HTMLInputElement | null = null;
    render(
      <form aria-label="Checkbox values">
        <label>
          <Checkbox
            defaultChecked
            inputRef={(node) => {
              requiredInput = node;
            }}
            name="selected"
            required
            value="selected"
          />
          Selected
        </label>
        <Checkbox aria-label="Indeterminate" indeterminate />
        <Checkbox aria-label="Disabled checkbox" disabled onCheckedChange={onDisabledChange} />
        <Checkbox aria-label="Read-only checkbox" readOnly onCheckedChange={onReadOnlyChange} />
      </form>,
    );
    const selected = screen.getByRole("checkbox", { name: "Selected" });
    expect(selected.querySelector(".n-checkbox__check")).toBeInTheDocument();
    const indeterminate = screen.getByRole("checkbox", { name: "Indeterminate" });
    expect(indeterminate.querySelector(".n-checkbox__minus")).toBeInTheDocument();
    expect(indeterminate).toHaveAttribute("aria-checked", "mixed");
    expect(requiredInput).toBeRequired();
    await user.click(screen.getByRole("checkbox", { name: "Disabled checkbox" }));
    await user.click(screen.getByRole("checkbox", { name: "Read-only checkbox" }));
    expect(onDisabledChange).not.toHaveBeenCalled();
    expect(onReadOnlyChange).not.toHaveBeenCalled();
    expect(
      new FormData(screen.getByRole("form", { name: "Checkbox values" })).get("selected"),
    ).toBe("selected");
  });

  it("covers Switch child compatibility, disabled state, required input, and form submission", async () => {
    const user = userEvent.setup();
    const onDisabledChange = vi.fn();
    let requiredInput: HTMLInputElement | null = null;
    render(
      <form aria-label="Switch values">
        <label>
          <Switch
            defaultChecked
            inputRef={(node) => {
              requiredInput = node;
            }}
            name="enabled"
            required
            value="enabled"
          >
            Ignored child
          </Switch>
          Enable notifications
        </label>
        <Switch aria-label="Disabled switch" disabled onCheckedChange={onDisabledChange} />
      </form>,
    );
    expect(screen.queryByText("Ignored child")).not.toBeInTheDocument();
    expect(requiredInput).toBeRequired();
    await user.click(screen.getByRole("switch", { name: "Disabled switch" }));
    expect(onDisabledChange).not.toHaveBeenCalled();
    expect(new FormData(screen.getByRole("form", { name: "Switch values" })).get("enabled")).toBe(
      "enabled",
    );
  });

  it("keeps RadioGroup options and composition equivalent, including read-only and disabled groups", async () => {
    const user = userEvent.setup();
    const onReadOnlyChange = vi.fn();
    render(
      <>
        <RadioGroup
          label="Options group"
          options={[
            { label: "Private", value: "private", description: "Only you." },
            { label: "Team", value: "team" },
          ]}
        />
        <RadioGroup label="Composed group">
          <RadioGroupItem value="private" description="Only you.">
            Private
          </RadioGroupItem>
          <RadioGroupItem value="team">Team</RadioGroupItem>
        </RadioGroup>
        <RadioGroup
          label="Read-only group"
          defaultValue="team"
          onValueChange={onReadOnlyChange}
          readOnly
          options={[
            { label: "Private", value: "private" },
            { label: "Team", value: "team" },
          ]}
        />
        <RadioGroup
          label="Disabled group"
          disabled
          options={[{ label: "Private", value: "private" }]}
        />
      </>,
    );
    expect(screen.getAllByText("Only you.")).toHaveLength(2);
    expect(document.querySelectorAll('[data-slot="option-content"]')).toHaveLength(7);
    const readOnlyPrivate = screen.getAllByRole("radio", { name: "Private" })[2];
    await user.click(readOnlyPrivate);
    expect(onReadOnlyChange).not.toHaveBeenCalled();
    expect(screen.getByRole("radiogroup", { name: "Disabled group" })).toHaveAttribute(
      "data-disabled",
      "",
    );
    expect(screen.getAllByRole("radio", { name: "Private" })[0].closest("label")).toHaveAttribute(
      "data-slot",
      "option",
    );
  });

  it("reports popover open-state changes", async () => {
    const user = userEvent.setup();
    const onPopoverChange = vi.fn();
    render(
      <>
        <Popover trigger="Filters" title="Filters" onOpenChange={onPopoverChange}>
          Filter content
        </Popover>
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(onPopoverChange).toHaveBeenCalledWith(true, expect.anything());
    await user.keyboard("{Escape}");
  });

  it("uses the first enabled Tab, skips disabled tabs, and calls controlled state handlers", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Tabs
        onChange={onChange}
        variant="segmented"
        tabs={[
          { label: "Disabled", value: "disabled", content: "No", disabled: true },
          { label: "Overview", value: "overview", content: "Overview panel" },
          { label: "Activity", value: "activity", content: "Activity panel" },
        ]}
      />,
    );
    const overview = screen.getByRole("tab", { name: "Overview" });
    expect(overview).toHaveAttribute("aria-selected", "true");
    overview.focus();
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenCalledWith("activity");
  });

  it("keeps controlled Tabs selection consumer-owned with stable tab and panel relationships", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function ControlledTabs() {
      const [value, setValue] = React.useState("overview");
      return (
        <Tabs
          value={value}
          onValueChange={(nextValue) => {
            onValueChange(nextValue);
            setValue(nextValue);
          }}
          tabs={[
            { label: "Overview", value: "overview", content: "Overview panel" },
            { label: "Activity", value: "activity", content: "Activity panel" },
          ]}
        />
      );
    }
    render(<ControlledTabs />);
    const overview = screen.getByRole("tab", { name: "Overview" });
    const activity = screen.getByRole("tab", { name: "Activity" });
    expect(overview).toHaveAttribute("aria-controls");
    await user.click(activity);
    expect(onValueChange).toHaveBeenCalledWith("activity");
    const panel = screen.getByRole("tabpanel");
    expect(activity).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveTextContent("Activity panel");
  });

  it("opens DropdownMenu with the keyboard, skips disabled items, and restores trigger focus", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <DropdownMenu
        trigger="Actions"
        onOpenChange={onOpenChange}
        items={[
          { label: "Rename", onSelect },
          { label: "Unavailable", disabled: true },
          { label: "Archive", destructive: true, onSelect },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Actions" });
    trigger.focus();
    await user.keyboard("{ArrowDown}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Unavailable" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    expect(onSelect).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(trigger).toHaveFocus();
  });

  it("keeps Input native behavior while normalizing protected state attributes", () => {
    const onChange = vi.fn();
    const onInput = vi.fn();
    const ref = React.createRef<HTMLInputElement>();
    render(
      <>
        <Input
          ref={ref}
          aria-invalid="grammar"
          autoComplete="email"
          data-size="consumer"
          data-slot="consumer"
          defaultValue="Maya"
          enterKeyHint="next"
          htmlSize={32}
          inputMode="email"
          onChange={onChange}
          onInput={onInput}
          required
        />
        <Input aria-invalid={false} invalid />
      </>,
    );
    const input = screen.getByDisplayValue("Maya");
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("data-slot", "input");
    expect(input).toHaveAttribute("data-size", "md");
    expect(input).toHaveAttribute("aria-invalid", "grammar");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toHaveAttribute("inputmode", "email");
    expect(input).toHaveAttribute("enterkeyhint", "next");
    expect(input).toHaveAttribute("size", "32");
    expect(input).toBeRequired();
    expect(ref.current).toBe(input);
    fireEvent.change(input, { target: { value: "Maya Chen" } });
    fireEvent.input(input, { target: { value: "Maya Chen" } });
    expect(onChange).toHaveBeenCalled();
    expect(onInput).toHaveBeenCalled();
    expect(screen.getAllByRole("textbox")[1]).toHaveAttribute("aria-invalid", "true");
    expect(screen.getAllByRole("textbox")[1]).toHaveAttribute("data-invalid", "");
  });

  it("composes InputGroup without replacing the native input contract", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Field label="Website" description="Use your public domain." message="Required" invalid>
        <InputGroup ref={ref} data-slot="consumer">
          <InputGroupAddon placement="start">https://</InputGroupAddon>
          <Input aria-describedby="custom-description" />
          <InputGroupAddon placement="end">
            <Button aria-label="Validate website">Check</Button>
          </InputGroupAddon>
        </InputGroup>
      </Field>,
    );
    const group = ref.current!;
    const input = screen.getByRole("textbox", { name: "Website" });
    expect(group).toHaveAttribute("data-slot", "input-group");
    expect(group).toHaveAttribute("data-invalid", "");
    expect(
      group.querySelector('[data-slot="input-group-addon"][data-placement="start"]'),
    ).toBeTruthy();
    expect(
      group.querySelector('[data-slot="input-group-addon"][data-placement="end"]'),
    ).toBeTruthy();
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.getAttribute("aria-describedby")).toContain("custom-description");
    expect(input.getAttribute("aria-describedby")).toContain("-description");
    expect(screen.getByRole("button", { name: "Validate website" })).toBeEnabled();
  });
});
