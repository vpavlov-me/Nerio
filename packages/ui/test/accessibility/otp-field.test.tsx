import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { OTPField } from "../../src/client";

describe("OTPField accessibility", () => {
  it("keeps group naming, slot position, supporting content, and states truthful", async () => {
    const { container } = render(
      <main>
        <OTPField
          label="Verification code"
          length={6}
          description="Enter the code sent to your device."
          message="The code is incomplete."
          invalid
          required
        />
        <OTPField label="Locked code" length={4} value="1234" readOnly />
        <OTPField label="Unavailable code" length={4} disabled />
      </main>,
    );

    expect(screen.getByRole("group", { name: "Verification code" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Verification code" })).toHaveAccessibleDescription(
      "Enter the code sent to your device. The code is incomplete.",
    );
    expect(screen.getByRole("textbox", { name: "Digit 6 of 6" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("textbox", { name: "Locked code" })).toHaveAttribute("readonly");
    expect(screen.getByRole("textbox", { name: "Unavailable code" })).toBeDisabled();
    expect(container.querySelector('[data-slot="separator"]')).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect((await axe(container)).violations).toEqual([]);
  });
});
