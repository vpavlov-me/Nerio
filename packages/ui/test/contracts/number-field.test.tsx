import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "../../src/client";

describe("NumberField contracts", () => {
  it("formats a decimal value and steps with buttons and keyboard within bounds", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommitted = vi.fn();

    render(
      <NumberField
        label="Seats"
        defaultValue={12.5}
        min={10}
        max={14}
        step={0.5}
        locale="en-US"
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Seats" });
    expect(input).toHaveValue("12.5");
    expect(input).toHaveAttribute("aria-roledescription", "Number field");

    await user.click(screen.getByRole("button", { name: "Increase value" }));
    expect(input).toHaveValue("13.0");
    expect(onValueChange).toHaveBeenLastCalledWith(
      13,
      expect.objectContaining({ reason: "increment-press", direction: 1 }),
    );

    await user.click(input);
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveValue("12.5");
    expect(onValueCommitted).toHaveBeenLastCalledWith(
      12.5,
      expect.objectContaining({ reason: "keyboard" }),
    );
  });

  it("preserves form identity and restores the uncontrolled default on reset", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Capacity form">
        <NumberField label="Capacity" name="capacity" defaultValue={4} min={0} max={10} />
        <button type="reset">Reset</button>
      </form>,
    );

    const form = screen.getByRole("form", { name: "Capacity form" });
    const input = screen.getByRole("textbox", { name: "Capacity" });
    await user.click(screen.getByRole("button", { name: "Increase value" }));
    expect(input).toHaveValue("5");
    expect(new FormData(form as HTMLFormElement).get("capacity")).toBe("5");

    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() => expect(input).toHaveValue("4"));
    expect(new FormData(form as HTMLFormElement).get("capacity")).toBe("4");
  });

  it("keeps locale formatting deterministic and controlled ownership external", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <NumberField
        label="Distance"
        value={1234.5}
        step={0.5}
        locale="de-DE"
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        onValueChange={onValueChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Distance" });
    expect(input).toHaveValue("1.234,5");
    await user.click(screen.getByRole("button", { name: "Increase value" }));
    expect(onValueChange).toHaveBeenLastCalledWith(
      1235,
      expect.objectContaining({ reason: "increment-press", direction: 1 }),
    );
    expect(input).toHaveValue("1.234,5");

    rerender(
      <NumberField
        label="Distance"
        value={1235}
        step={0.5}
        locale="de-DE"
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        onValueChange={onValueChange}
      />,
    );
    expect(input).toHaveValue("1.235,0");
  });

  it("keeps read-only state focusable while preventing every value-changing path", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField label="Locked quantity" value={3} readOnly onValueChange={onValueChange} />,
    );

    const input = screen.getByRole("textbox", { name: "Locked quantity" });
    expect(input).toHaveAttribute("readonly");
    expect(screen.getByRole("button", { name: "Decrease value" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(screen.getByRole("button", { name: "Increase value" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await user.click(input);
    await user.keyboard("{ArrowUp}");
    fireEvent.wheel(input, { deltaY: -100 });
    expect(input).toHaveValue("3");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("rejects ambiguous numeric and non-decimal runtime contracts", () => {
    expect(() => render(<NumberField label="Invalid" value={Number.NaN} />)).toThrow(
      "NumberField value must be a finite number.",
    );
    expect(() => render(<NumberField label="Invalid" min={2} max={1} />)).toThrow(
      "NumberField min must be less than or equal to max.",
    );
    expect(() => render(<NumberField label="Invalid" step={0} />)).toThrow(
      "NumberField step must be greater than zero.",
    );
    expect(() =>
      render(
        <NumberField
          label="Invalid"
          format={{ style: "currency" } as unknown as Intl.NumberFormatOptions}
        />,
      ),
    ).toThrow("NumberField supports decimal formatting only.");
  });
});
