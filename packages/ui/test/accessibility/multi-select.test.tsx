import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { MultiSelect } from "../../src/client";

describe("MultiSelect accessibility", () => {
  it("has no detectable violations across closed, invalid, grouped, and open states", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelect
        defaultValue={["design"]}
        description="Choose every discipline that applies."
        invalid
        label="Disciplines"
        message="Review the current selection."
        options={[
          {
            value: "product",
            label: "Product",
            options: [
              { value: "design", label: "Design systems", textValue: "Design systems" },
              { value: "research", label: "Research", textValue: "Research", disabled: true },
            ],
          },
        ]}
        required
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Review the current selection.");
    expect(screen.getByRole("combobox", { name: "Disciplines" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect((await axe(container)).violations).toEqual([]);

    await user.click(screen.getByRole("button", { name: "Toggle options" }));
    expect(await screen.findByRole("listbox")).toHaveAttribute("aria-multiselectable", "true");
    expect(screen.getByRole("option", { name: "Design systems" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("option", { name: "Research" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      (await axe(document.body, { rules: { region: { enabled: false } } })).violations,
    ).toEqual([]);
  });
});
