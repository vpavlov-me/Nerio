import * as React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MultiSelect, type MultiSelectOption } from "../../src/client";

type Discipline = "design" | "research" | "writing";

const options = [
  { value: "design", label: "Design systems", textValue: "Design systems" },
  { value: "research", label: "Research", textValue: "User research", disabled: true },
  { value: "writing", label: "Technical writing", textValue: "Technical writing" },
] satisfies readonly MultiSelectOption<Discipline>[];

describe("MultiSelect contracts", () => {
  it("owns bounded filtering, ordered multiple selection, chips, and announcements", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const rootRef = React.createRef<HTMLDivElement>();
    const inputRef = React.createRef<HTMLInputElement>();

    render(
      <MultiSelect
        ref={rootRef}
        inputRef={inputRef}
        defaultValue={["design"]}
        description="Choose every relevant discipline."
        label="Disciplines"
        message="Local options only."
        onValueChange={onValueChange}
        options={options}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Disciplines" });
    expect(input).toBe(inputRef.current);
    expect(rootRef.current).toHaveAttribute("data-slot", "root");
    expect(input).toHaveAccessibleDescription(
      "Choose every relevant discipline. Local options only.",
    );
    expect(screen.getByText("Design systems").closest('[data-slot="value"]')).toBeInTheDocument();

    await user.type(input, "writing");
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    expect(screen.queryByRole("option", { name: "Design systems" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("option", { name: "Technical writing" }));

    expect(onValueChange).toHaveBeenLastCalledWith(
      ["design", "writing"],
      expect.objectContaining({ reason: "item-press" }),
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(document.querySelector('[data-slot="announcement"]')).toHaveTextContent(
      "Technical writing selected.",
    );
    expect(screen.getByRole("button", { name: "Remove Technical writing" })).toBeInTheDocument();
  });

  it("keeps controlled selection, query, and popup state independently consumer-owned", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onQueryChange = vi.fn();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <MultiSelect
        label="Controlled disciplines"
        onOpenChange={onOpenChange}
        onQueryChange={onQueryChange}
        onValueChange={onValueChange}
        open
        options={options}
        query=""
        value={["design"]}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Controlled disciplines" });
    await user.click(screen.getByRole("option", { name: "Technical writing" }));
    expect(onValueChange).toHaveBeenCalledWith(
      ["design", "writing"],
      expect.objectContaining({ reason: "item-press" }),
    );
    expect(
      screen.queryByRole("button", { name: "Remove Technical writing" }),
    ).not.toBeInTheDocument();
    expect(document.querySelector('[data-slot="announcement"]')).toBeEmptyDOMElement();

    await user.type(input, "w");
    expect(onQueryChange).toHaveBeenLastCalledWith(
      "w",
      expect.objectContaining({ reason: "input-change" }),
    );
    expect(input).toHaveValue("");

    rerender(
      <MultiSelect
        label="Controlled disciplines"
        onOpenChange={onOpenChange}
        onQueryChange={onQueryChange}
        onValueChange={onValueChange}
        open
        options={options}
        query="w"
        value={["design", "writing"]}
      />,
    );
    expect(document.querySelector('[data-slot="announcement"]')).toHaveTextContent(
      "Technical writing selected.",
    );
  });

  it("submits repeated ordered values and restores uncontrolled defaults on uncanceled reset", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form
        aria-label="Profile"
        onReset={(event) => {
          if (event.currentTarget.dataset.cancelReset === "true") event.preventDefault();
        }}
      >
        <MultiSelect
          defaultQuery="tech"
          defaultValue={["design"]}
          label="Skills"
          name="skills"
          options={options}
          required
        />
        <button type="reset">Reset skills</button>
      </form>,
    );

    const form = container.querySelector("form")!;
    const input = screen.getByRole("combobox", { name: "Skills" });
    await user.clear(input);
    await user.click(input);
    await user.click(await screen.findByRole("option", { name: "Technical writing" }));
    expect(new FormData(form).getAll("skills")).toEqual(["design", "writing"]);
    expect(form.checkValidity()).toBe(true);
    await user.keyboard("{Escape}");

    form.dataset.cancelReset = "true";
    await user.click(screen.getByRole("button", { name: "Reset skills" }));
    await act(async () => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(new FormData(form).getAll("skills")).toEqual(["design", "writing"]);

    delete form.dataset.cancelReset;
    await user.click(screen.getByRole("button", { name: "Reset skills" }));
    await waitFor(() => expect(input).toHaveValue("tech"));
    expect(new FormData(form).getAll("skills")).toEqual(["design"]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps a selected disabled option visible and submitted but blocks direct removal", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = render(
      <form>
        <MultiSelect
          defaultValue={["research"]}
          label="Locked skill"
          name="skills"
          onValueChange={onValueChange}
          options={options}
        />
      </form>,
    );

    const remove = screen.getByRole("button", { name: "Remove User research" });
    expect(remove).toHaveAttribute("aria-disabled", "true");
    expect(new FormData(container.querySelector("form")!).getAll("skills")).toEqual(["research"]);
    await user.click(remove);
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Clear all selections" }));
    expect(new FormData(container.querySelector("form")!).getAll("skills")).toEqual([]);
    expect(screen.getByRole("combobox", { name: "Locked skill" })).toHaveFocus();
  });

  it("does not clear a closed selection on Escape and removes the last removable value with Backspace", async () => {
    const user = userEvent.setup();
    render(
      <MultiSelect
        defaultValue={["research", "writing"]}
        label="Keyboard skills"
        options={options}
      />,
    );
    const input = screen.getByRole("combobox", { name: "Keyboard skills" });
    input.focus();
    await user.keyboard("{Escape}");
    expect(screen.getByRole("button", { name: "Remove Technical writing" })).toBeInTheDocument();
    await user.keyboard("{Backspace}");
    expect(
      screen.queryByRole("button", { name: "Remove Technical writing" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove User research" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("rejects duplicate options and unknown or duplicate selected values", () => {
    expect(() =>
      render(
        <MultiSelect
          label="Duplicate options"
          options={[
            { value: "same", label: "One", textValue: "One" },
            { value: "same", label: "Two", textValue: "Two" },
          ]}
        />,
      ),
    ).toThrow(/duplicate "same"/);
    expect(() =>
      render(
        <MultiSelect label="Unknown value" options={options} value={["missing" as Discipline]} />,
      ),
    ).toThrow(/unknown values: missing/);
    expect(() =>
      render(
        <MultiSelect label="Duplicate value" options={options} value={["design", "design"]} />,
      ),
    ).toThrow(/duplicate values: design/);
  });
});
