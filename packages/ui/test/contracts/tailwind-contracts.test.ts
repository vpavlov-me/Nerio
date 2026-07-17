import { existsSync, readFileSync } from "node:fs";
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

  it("does not rely on Preflight to remove the Dialog close border", () => {
    const dialogSource = readFileSync(resolve(process.cwd(), "src/components/dialog.tsx"), "utf8");

    expect(dialogSource).toContain("n-dialog__close inline-flex");
    expect(dialogSource).toContain("rounded-(--n-radius-sm) border-0");
    expect(dialogSource).not.toContain("border-(--n-border-width-0)");
  });

  it("keeps the Actions and Forms family on one Tailwind-first visual source", () => {
    const migratedComponents = [
      "button-group",
      "textarea",
      "label",
      "field",
      "form-message",
      "form-group",
      "input-group",
      "checkbox",
      "radio-group",
      "switch",
      "select",
    ];

    for (const component of migratedComponents) {
      const source = readFileSync(
        resolve(process.cwd(), `src/components/${component}.tsx`),
        "utf8",
      );
      expect(source, component).toContain('from "../lib/tailwind-cn"');
    }

    for (const obsoleteStylesheet of ["button-group.css", "forms.css", "input-group.css"]) {
      expect(existsSync(resolve(process.cwd(), `src/styles/${obsoleteStylesheet}`))).toBe(false);
    }

    const selectResidual = readFileSync(resolve(process.cwd(), "src/styles/select.css"), "utf8");
    expect(selectResidual).toContain("@keyframes n-select-popup-in");
    expect(selectResidual).toContain("@keyframes n-select-popup-out");
    expect(selectResidual).not.toContain(".n-select-");
  });

  it("keeps Foundation, Data Display, Feedback, and Progress on one Tailwind-first visual source", () => {
    const migratedComponents = [
      "icon",
      "typography",
      "kbd",
      "spinner",
      "card",
      "avatar",
      "stat",
      "key-value",
      "table",
      "list",
      "item",
      "separator",
      "alert",
      "badge",
      "empty-state",
      "skeleton",
      "progress",
    ];

    for (const component of migratedComponents) {
      const source = readFileSync(
        resolve(process.cwd(), `src/components/${component}.tsx`),
        "utf8",
      );
      expect(source, component).toContain('from "../lib/tailwind-cn"');
    }

    for (const obsoleteStylesheet of ["icon.css", "typography.css", "kbd.css", "display.css"]) {
      expect(existsSync(resolve(process.cwd(), `src/styles/${obsoleteStylesheet}`))).toBe(false);
    }

    for (const residualStylesheet of ["spinner.css", "feedback.css", "progress.css"]) {
      const residual = readFileSync(
        resolve(process.cwd(), `src/styles/${residualStylesheet}`),
        "utf8",
      );
      expect(residual).toContain("@keyframes");
      expect(residual).not.toMatch(/\.n-(spinner|badge|alert|empty-state|skeleton|progress)/);
    }

    const iconSource = readFileSync(resolve(process.cwd(), "src/components/icon.tsx"), "utf8");
    expect(iconSource).toContain("size-(--n-icon-inline-size)");
  });
});
