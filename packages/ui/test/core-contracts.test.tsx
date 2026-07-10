import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import {
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Card,
  CardTitle,
  EmptyState,
  Field,
  FormGroup,
  Input,
  List,
  Pagination,
  Progress,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "../src/index";
import {
  Button,
  Dialog,
  IconButton,
  Select,
  Tabs,
  Toast,
  ToastProvider,
  ToastViewport,
  useToastManager,
} from "../src/client";
import { Bell } from "@nerio/adapters";

describe("Core static contracts", () => {
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
        <EmptyState title="No results" description="Try another search." titleAs="h4" />
      </>,
    );
    expect(screen.getByRole("article")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Overview", level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "No results", level: 4 })).toBeInTheDocument();
  });

  it("falls back predictably for missing or failed Avatar images", () => {
    const { rerender } = render(<Avatar name="  Maya   Chen " />);
    expect(screen.getByText("MC")).toBeInTheDocument();
    rerender(<Avatar name="Иван Петров" src="/missing.png" />);
    fireEvent.error(screen.getByRole("img", { name: "Иван Петров" }));
    expect(screen.getByText("ИП")).toBeInTheDocument();
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

  it("uses semantic names and native associations @a11y", async () => {
    const { container } = render(
      <>
        <Alert tone="warning" title="Review needed">
          A required field is missing.
        </Alert>
        <Badge tone="success">Ready</Badge>
        <Spinner label="Saving" />
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Buttons" }]} />
        <Field label="Email" description="We only use this for updates." message="Required" invalid>
          <Input />
        </Field>
        <FormGroup title="Notifications" description="Choose channels.">
          <input type="checkbox" aria-label="Email" />
        </FormGroup>
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
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

  it("keeps default Card and EmptyState semantics and forwards refs", () => {
    const cardRef = React.createRef<HTMLElement>();
    const emptyRef = React.createRef<HTMLDivElement>();
    render(
      <>
        <Card ref={cardRef}>Card</Card>
        <EmptyState ref={emptyRef} title="Empty" description="Nothing here" />
      </>,
    );
    expect(cardRef.current?.tagName).toBe("SECTION");
    expect(emptyRef.current).toHaveAttribute("data-slot", "root");
    expect(screen.getByRole("heading", { name: "Empty", level: 3 })).toBeInTheDocument();
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

  it("keeps IconButton label available while loading", () => {
    render(<IconButton icon={Bell} label="Open notifications" loading />);
    const button = screen.getByRole("button", { name: /open notifications/i });
    expect(button).toBeDisabled();
    expect(button.querySelector("[role=status]")).toHaveAttribute("aria-hidden", "true");
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
});
