import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { OTPField } from "../../src/client";

describe("OTPField contracts", () => {
  it("focuses the first slot when the visible label is activated", async () => {
    const user = userEvent.setup();
    render(<OTPField label="Verification code" length={6} />);

    await user.click(screen.getByText("Verification code"));

    expect(screen.getAllByRole("textbox")[0]).toHaveFocus();
  });

  it("keeps typing, paste, deletion, and completion deterministic", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueComplete = vi.fn();
    render(
      <OTPField
        label="Verification code"
        length={6}
        onValueChange={onValueChange}
        onValueComplete={onValueComplete}
      />,
    );

    const slots = screen.getAllByRole("textbox");
    await user.click(slots[0]!);
    await user.paste("123456");
    expect(slots.map((slot) => (slot as HTMLInputElement).value).join("")).toBe("123456");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "123456",
      expect.objectContaining({ reason: "input-paste" }),
    );
    expect(onValueComplete).toHaveBeenCalledWith(
      "123456",
      expect.objectContaining({ reason: "input-paste" }),
    );

    await user.keyboard("{Backspace}");
    expect(slots.map((slot) => (slot as HTMLInputElement).value).join("")).toBe("12345");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "12345",
      expect.objectContaining({ reason: "keyboard" }),
    );
  });

  it("submits one form value and restores the uncontrolled default on reset", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Verification form">
        <OTPField label="Verification code" length={4} name="code" defaultValue="1234" />
        <button type="reset">Reset</button>
      </form>,
    );

    const form = screen.getByRole("form", { name: "Verification form" });
    const slots = screen.getAllByRole("textbox");
    await user.click(slots[0]!);
    await user.paste("9876");
    expect(new FormData(form as HTMLFormElement).getAll("code")).toEqual(["9876"]);

    await user.click(screen.getByRole("button", { name: "Reset" }));
    await waitFor(() =>
      expect(new FormData(form as HTMLFormElement).getAll("code")).toEqual(["1234"]),
    );
  });

  it("keeps controlled ownership external and reports rejected characters", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueInvalid = vi.fn();
    const { rerender } = render(
      <OTPField
        label="Recovery code"
        length={4}
        validationType="alphanumeric"
        value="A7"
        onValueChange={onValueChange}
        onValueInvalid={onValueInvalid}
      />,
    );
    const slots = screen.getAllByRole("textbox");
    await user.click(slots[2]!);
    await user.keyboard("-");
    expect(onValueInvalid).toHaveBeenCalledWith(
      "-",
      expect.objectContaining({ reason: "input-change" }),
    );
    expect(slots.map((slot) => (slot as HTMLInputElement).value).join("")).toBe("A7");

    await user.keyboard("C");
    expect(onValueChange).toHaveBeenLastCalledWith(
      "A7C",
      expect.objectContaining({ reason: "input-change" }),
    );
    expect(slots.map((slot) => (slot as HTMLInputElement).value).join("")).toBe("A7");
    rerender(
      <OTPField label="Recovery code" length={4} validationType="alphanumeric" value="A7C" />,
    );
    expect(slots.map((slot) => (slot as HTMLInputElement).value).join("")).toBe("A7C");
  });

  it("rejects an ambiguous slot count", () => {
    expect(() => render(<OTPField label="Code" length={0} />)).toThrow(
      "OTPField length must be a positive integer.",
    );
  });
});
