import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { NumberField } from "../../src/client";

describe("NumberField accessibility", () => {
  it("keeps naming, supporting content, invalid, disabled, and read-only states truthful", async () => {
    const { container } = render(
      <main>
        <NumberField
          label="Team size"
          description="Enter the number of active collaborators."
          message="Use a value from 1 to 20."
          defaultValue={4}
          min={1}
          max={20}
          invalid
          required
          decrementLabel="Decrease team size"
          incrementLabel="Increase team size"
        />
        <NumberField label="Managed limit" value={8} readOnly />
        <NumberField label="Unavailable limit" disabled />
      </main>,
    );

    expect(screen.getByRole("textbox", { name: "Team size" })).toHaveAccessibleDescription(
      "Enter the number of active collaborators. Use a value from 1 to 20.",
    );
    expect(screen.getByRole("textbox", { name: "Team size" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByRole("button", { name: "Decrease team size" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Increase team size" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Managed limit" })).toHaveAttribute("readonly");
    expect(screen.getByRole("textbox", { name: "Unavailable limit" })).toBeDisabled();
    expect((await axe(container)).violations).toEqual([]);
  });
});
