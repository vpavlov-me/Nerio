import * as React from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ToggleGroup, ToggleGroupItem } from "../../src/client";

describe("ToggleGroup contracts", () => {
  it("owns one pressed value by default and exposes stable group and item hooks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const ref = React.createRef<HTMLDivElement>();

    render(
      <ToggleGroup
        ref={ref}
        aria-label="Text alignment"
        defaultValue={["left"]}
        onValueChange={onValueChange}
        size="sm"
        variant="outline"
      >
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right" disabled>
          Right
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const group = screen.getByRole("group", { name: "Text alignment" });
    const left = screen.getByRole("button", { name: "Left" });
    const center = screen.getByRole("button", { name: "Center" });
    const right = screen.getByRole("button", { name: "Right" });

    expect(ref.current).toBe(group);
    expect(group).toHaveAttribute("data-slot", "group");
    expect(group).toHaveAttribute("data-size", "sm");
    expect(group).toHaveAttribute("data-variant", "outline");
    expect(left).toHaveAttribute("data-slot", "item");
    expect(left).toHaveAttribute("aria-pressed", "true");

    await user.click(center);
    expect(left).toHaveAttribute("aria-pressed", "false");
    expect(center).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenLastCalledWith(["center"], expect.anything());

    await user.click(right);
    expect(right).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it("supports multiple values, controlled ownership, and the concise options API", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ToggleGroup
        aria-label="Visible layers"
        multiple
        value={["grid"]}
        onValueChange={onValueChange}
        options={[
          { value: "grid", label: "Grid" },
          { value: "guides", label: "Guides" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Guides" }));
    expect(onValueChange).toHaveBeenCalledWith(["grid", "guides"], expect.anything());
    expect(screen.getByRole("button", { name: "Guides" })).toHaveAttribute("aria-pressed", "false");

    rerender(
      <ToggleGroup
        aria-label="Visible layers"
        multiple
        value={["grid", "guides"]}
        onValueChange={onValueChange}
        options={[
          { value: "grid", label: "Grid" },
          { value: "guides", label: "Guides" },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Guides" })).toHaveAttribute("aria-pressed", "true");
  });

  it("normalizes initial single-mode values to one pressed item", () => {
    render(
      <ToggleGroup
        aria-label="Text alignment"
        defaultValue={["left", "center"]}
        options={[
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Left" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Center" })).toHaveAttribute("aria-pressed", "false");
  });

  it("uses orientation-aware roving focus and skips disabled items", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup aria-label="Text style" orientation="vertical">
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic" disabled>
          Italic
        </ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>,
    );

    const bold = screen.getByRole("button", { name: "Bold" });
    const underline = screen.getByRole("button", { name: "Underline" });
    bold.focus();
    await user.keyboard("{ArrowDown}");
    expect(underline).toHaveFocus();
    await user.keyboard("{ArrowDown}");
    expect(bold).toHaveFocus();
  });

  it("maps horizontal arrow focus through inherited RTL direction", async () => {
    const user = userEvent.setup();
    const onGroupKeyDown = vi.fn();
    const onItemKeyDown = vi.fn();
    render(
      <DirectionProvider direction="rtl">
        <div dir="rtl">
          <ToggleGroup aria-label="Alignment" onKeyDown={onGroupKeyDown}>
            <ToggleGroupItem value="left" onKeyDown={onItemKeyDown}>
              Left
            </ToggleGroupItem>
            <ToggleGroupItem value="center" onKeyDown={onItemKeyDown}>
              Center
            </ToggleGroupItem>
            <ToggleGroupItem value="right" onKeyDown={onItemKeyDown}>
              Right
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DirectionProvider>,
    );

    const center = screen.getByRole("button", { name: "Center" });
    center.focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Right" })).toHaveFocus();
    await user.keyboard("{ArrowRight}");
    expect(center).toHaveFocus();
    expect(onItemKeyDown).toHaveBeenCalledTimes(2);
    expect(onGroupKeyDown).toHaveBeenCalledTimes(2);
  });

  it("keeps focus at non-looping horizontal RTL boundaries", async () => {
    const user = userEvent.setup();
    render(
      <DirectionProvider direction="rtl">
        <div dir="rtl">
          <ToggleGroup aria-label="Alignment" loopFocus={false}>
            <ToggleGroupItem value="left">Left</ToggleGroupItem>
            <ToggleGroupItem value="center">Center</ToggleGroupItem>
            <ToggleGroupItem value="right">Right</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </DirectionProvider>,
    );

    const left = screen.getByRole("button", { name: "Left" });
    const right = screen.getByRole("button", { name: "Right" });
    left.focus();
    await user.keyboard("{ArrowRight}");
    expect(left).toHaveFocus();
    right.focus();
    await user.keyboard("{ArrowLeft}");
    expect(right).toHaveFocus();
  });

  it("blocks interaction when the complete group is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup aria-label="View mode" disabled onValueChange={onValueChange}>
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
        <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
      </ToggleGroup>,
    );

    expect(screen.getByRole("group", { name: "View mode" })).toHaveAttribute("data-disabled");
    await user.click(screen.getByRole("button", { name: "Compact" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
