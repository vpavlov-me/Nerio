import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tailwindCn } from "../../src/lib/tailwind-cn";

describe("Tailwind styling contract", () => {
  it("lets consumer utilities deterministically replace Nerio utilities", () => {
    expect(
      tailwindCn("h-(--n-button-height-md) bg-(--n-button-background-primary)", "h-12 bg-red-500"),
    ).toBe("h-12 bg-red-500");
  });

  it("preserves non-conflicting Nerio state utilities", () => {
    expect(
      tailwindCn(
        "bg-(--n-button-background-primary) hover:bg-(--n-button-background-primary-hover)",
        "bg-red-500",
      ),
    ).toBe("hover:bg-(--n-button-background-primary-hover) bg-red-500");
  });

  it("keeps the last consumer class as the conflict winner", () => {
    expect(tailwindCn("h-(--n-button-height-md)", "h-20")).toBe("h-20");
    expect(tailwindCn("h-20", "h-(--n-button-height-md)")).toBe("h-(--n-button-height-md)");
  });

  it("preserves native Nerio control typography without requiring Preflight", () => {
    const styles = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");

    expect(styles).toContain(
      ':where(button, input, select, textarea):where([class^="n-"], [class*=" n-"])',
    );
    expect(styles).toContain("font-family: inherit;");
  });
});
