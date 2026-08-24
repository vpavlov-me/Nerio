import * as React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckboxGroup, CheckboxGroupItem } from "../../src/client";

describe("CheckboxGroup contracts", () => {
  it("owns independent uncontrolled values and exposes group metadata and stable slots", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <CheckboxGroup
        ref={ref}
        defaultValue={["email"]}
        description="Choose every channel you want to receive."
        label="Notifications"
        message="At least one channel is recommended."
        name="notifications"
        onValueChange={onValueChange}
        required
      >
        <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
        <CheckboxGroupItem description="Sent to your verified number." value="sms">
          SMS
        </CheckboxGroupItem>
      </CheckboxGroup>,
    );

    const group = screen.getByRole("group", { name: "Notifications" });
    const email = screen.getByRole("checkbox", { name: "Email" });
    const sms = screen.getByRole("checkbox", { name: /SMS/ });

    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute("data-slot", "group");
    expect(group).toHaveAttribute("data-required");
    expect(group).toHaveClass("gap-(--n-density-space-md)");
    expect(group.parentElement).toHaveClass("[&>[data-slot=group]]:mt-(--n-density-space-md)");
    expect(screen.getByText("Choose every channel you want to receive.")).toHaveClass(
      "text-(length:--n-body-font-size)",
    );
    expect(group).toHaveAccessibleDescription(
      "Choose every channel you want to receive. At least one channel is recommended.",
    );
    expect(email).toBeChecked();
    expect(sms).not.toBeChecked();

    await user.click(sms);
    expect(email).toBeChecked();
    expect(sms).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(["email", "sms"], expect.anything());
  });

  it("supports controlled values and the concise options API", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const options = [
      { value: "product", label: "Product updates" },
      { value: "security", label: "Security alerts", disabled: true },
    ];
    const { rerender } = render(
      <CheckboxGroup label="Topics" onValueChange={onValueChange} options={options} value={[]} />,
    );

    await user.click(screen.getByRole("checkbox", { name: "Product updates" }));
    expect(onValueChange).toHaveBeenCalledWith(["product"], expect.anything());
    expect(screen.getByRole("checkbox", { name: "Product updates" })).not.toBeChecked();

    rerender(
      <CheckboxGroup
        label="Topics"
        onValueChange={onValueChange}
        options={options}
        value={["product"]}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Product updates" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Security alerts" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("participates in form submission and restores uncontrolled defaults on reset", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Preferences">
        <CheckboxGroup defaultValue={["email"]} label="Channels" name="channels">
          <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
          <CheckboxGroupItem value="sms">SMS</CheckboxGroupItem>
        </CheckboxGroup>
        <button type="reset">Reset</button>
      </form>,
    );

    const form = screen.getByRole("form", { name: "Preferences" }) as HTMLFormElement;
    const email = screen.getByRole("checkbox", { name: "Email" });
    const sms = screen.getByRole("checkbox", { name: "SMS" });
    await user.click(email);
    await user.click(sms);

    expect(new FormData(form).getAll("channels")).toEqual(["sms"]);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(email).toBeChecked();
    expect(sms).not.toBeChecked();
    expect(new FormData(form).getAll("channels")).toEqual(["email"]);
  });

  it("enforces an at-least-one native required constraint", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Required preferences">
        <CheckboxGroup label="Channels" name="channels" required>
          <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
          <CheckboxGroupItem value="sms">SMS</CheckboxGroupItem>
        </CheckboxGroup>
      </form>,
    );

    const form = screen.getByRole("form", { name: "Required preferences" }) as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
    await user.click(screen.getByRole("checkbox", { name: "SMS" }));
    expect(form.checkValidity()).toBe(true);
  });

  it("keeps required validation group-owned for untyped item props", async () => {
    const user = userEvent.setup();
    const unsafeItemProps = { required: true } as unknown as React.ComponentProps<
      typeof CheckboxGroupItem
    >;

    render(
      <form aria-label="Untyped item requirement">
        <CheckboxGroup label="Channels" name="channels" required>
          <CheckboxGroupItem {...unsafeItemProps} value="email">
            Email
          </CheckboxGroupItem>
          <CheckboxGroupItem value="sms">SMS</CheckboxGroupItem>
        </CheckboxGroup>
      </form>,
    );

    const form = screen.getByRole("form", { name: "Untyped item requirement" }) as HTMLFormElement;
    const email = screen.getByRole("checkbox", { name: "Email" });
    expect(email).not.toBeRequired();
    await user.click(screen.getByRole("checkbox", { name: "SMS" }));
    expect(form.checkValidity()).toBe(true);
  });

  it("does not restore defaults when the native reset is canceled", async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Canceled reset" onReset={(event) => event.preventDefault()}>
        <CheckboxGroup defaultValue={["email"]} label="Channels" name="channels">
          <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
          <CheckboxGroupItem value="sms">SMS</CheckboxGroupItem>
        </CheckboxGroup>
        <button type="reset">Reset</button>
      </form>,
    );

    const email = screen.getByRole("checkbox", { name: "Email" });
    const sms = screen.getByRole("checkbox", { name: "SMS" });
    await user.click(email);
    await user.click(sms);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(email).not.toBeChecked();
    expect(sms).toBeChecked();
  });

  it("does not satisfy required validation with stale or disabled controlled values", () => {
    const { rerender } = render(
      <form aria-label="Controlled requirement">
        <CheckboxGroup
          label="Channels"
          name="channels"
          options={[{ value: "email", label: "Email" }]}
          required
          value={["removed"]}
        />
      </form>,
    );
    const form = screen.getByRole("form", { name: "Controlled requirement" }) as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);

    rerender(
      <form aria-label="Controlled requirement">
        <CheckboxGroup
          label="Channels"
          name="channels"
          options={[{ value: "email", label: "Email", disabled: true }]}
          required
          value={["email"]}
        />
      </form>,
    );
    expect(form.checkValidity()).toBe(false);
  });

  it("blocks group and read-only interaction while preserving item values", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <CheckboxGroup disabled label="Channels" onValueChange={onValueChange}>
        <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Email" });
    expect(checkbox).toHaveAttribute("aria-disabled", "true");
    await user.click(checkbox);
    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <CheckboxGroup label="Channels" onValueChange={onValueChange} readOnly>
        <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
      </CheckboxGroup>,
    );
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("associates invalid messages with the group and every option", () => {
    render(
      <CheckboxGroup invalid label="Channels" message="Choose at least one channel.">
        <CheckboxGroupItem value="email">Email</CheckboxGroupItem>
      </CheckboxGroup>,
    );

    expect(screen.getByRole("group", { name: "Channels" })).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Choose at least one channel.");
    expect(screen.getByRole("checkbox", { name: "Email" })).toHaveAttribute("aria-invalid", "true");
  });
});
