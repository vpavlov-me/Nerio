import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "../../src/client";

describe("ToggleGroup accessibility", () => {
  it("has no detectable violations for named single and multiple groups", async () => {
    const { container } = render(
      <>
        <ToggleGroup aria-label="Text alignment" defaultValue={["left"]}>
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup aria-label="Visible layers" multiple defaultValue={["grid"]}>
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
          <ToggleGroupItem value="guides" disabled>
            Guides
          </ToggleGroupItem>
        </ToggleGroup>
      </>,
    );

    expect((await axe(container)).violations).toEqual([]);
  });
});
