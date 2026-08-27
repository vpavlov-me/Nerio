import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { CheckboxGroup, CheckboxGroupItem } from "../../src/client";

describe("CheckboxGroup accessibility", () => {
  it("has no detectable violations across metadata and item states", async () => {
    const { container } = render(
      <CheckboxGroup
        defaultValue={["email"]}
        description="Choose every channel that applies."
        label="Notifications"
        message="Choose at least one channel."
        required
      >
        <CheckboxGroupItem description="Weekly summary." value="email">
          Email
        </CheckboxGroupItem>
        <CheckboxGroupItem disabled value="sms">
          SMS
        </CheckboxGroupItem>
      </CheckboxGroup>,
    );

    expect((await axe(container)).violations).toEqual([]);
  });
});
