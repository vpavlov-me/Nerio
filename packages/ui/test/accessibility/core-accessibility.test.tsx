import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import {
  Avatar,
  EmptyState,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateTitle,
  Field,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  Pagination,
  TableContainer,
} from "../../src/index";
import {
  Button,
  Dialog,
  Select,
  Tabs,
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
        <Tabs tabs={[{ label: "Overview", value: "overview", content: "Overview content" }]} />
        <Select label="Status" options={[{ label: "Draft", value: "draft" }]} />
        <Toast title="Saved" description="Your changes are live." />
      </>,
    );
    expect((await axe(container)).violations).toEqual([]);
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
});
