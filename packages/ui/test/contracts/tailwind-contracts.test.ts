import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { tailwindCn } from "../../src/lib/tailwind-cn";

describe("Tailwind styling contract", () => {
  const residualKeyframes = {
    "feedback.css": ["n-pulse"],
    "motion.css": [
      "n-overlay-enter",
      "n-overlay-exit",
      "n-toast-enter",
      "n-toast-exit",
      "n-fade-only",
    ],
    "overlays.css": [
      "n-sheet-enter-left",
      "n-sheet-enter-right",
      "n-sheet-enter-top",
      "n-sheet-enter-bottom",
      "n-sheet-exit-left",
      "n-sheet-exit-right",
      "n-sheet-exit-top",
      "n-sheet-exit-bottom",
      "n-dialog-enter",
      "n-dialog-exit",
      "n-dialog-backdrop-enter",
      "n-dialog-backdrop-exit",
      "n-dialog-fade-only",
    ],
    "progress.css": ["n-progress-indeterminate"],
    "select.css": ["n-select-popup-in", "n-select-popup-out"],
    "spinner.css": ["n-spin"],
  } as const;

  function topLevelBlockHeaders(source: string) {
    const css = source.replace(/\/\*[\s\S]*?\*\//g, "");
    const headers: string[] = [];
    let depth = 0;
    let segmentStart = 0;

    for (let index = 0; index < css.length; index += 1) {
      if (css[index] === "{") {
        if (depth === 0) headers.push(css.slice(segmentStart, index).trim());
        depth += 1;
        segmentStart = index + 1;
      } else if (css[index] === "}") {
        depth -= 1;
        if (depth === 0) segmentStart = index + 1;
      }
    }

    expect(depth).toBe(0);
    return headers;
  }

  it("keeps arbitrary selectors on stable attributes instead of ambiguous BEM underscores", () => {
    const componentsDirectory = resolve(process.cwd(), "src/components");
    const failures = readdirSync(componentsDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .flatMap((file) => {
        const source = readFileSync(resolve(componentsDirectory, file), "utf8");
        return [...source.matchAll(/[^\s"']*\.n-[^\s"']*__[^\s"']*/g)].map(
          (match) => `${file}: ${match[0]}`,
        );
      });

    expect(failures).toEqual([]);
  });

  it("scopes generic slots to their owning compound component", () => {
    const tabsSource = readFileSync(resolve(process.cwd(), "src/components/tabs.tsx"), "utf8");
    const formGroupSource = readFileSync(
      resolve(process.cwd(), "src/components/form-group.tsx"),
      "utf8",
    );

    expect(tabsSource).toContain("[&>[data-slot=list]]");
    expect(tabsSource).not.toContain("[&_[data-slot=list]]");
    expect(formGroupSource).toContain("[&>[data-slot=content]]");
    expect(formGroupSource).not.toContain("[&_[data-slot=content]]");
  });

  it("does not reintroduce legacy merge helpers, apply mirrors, or raw palette utilities", () => {
    const componentsDirectory = resolve(process.cwd(), "src/components");
    const source = readdirSync(componentsDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => readFileSync(resolve(componentsDirectory, file), "utf8"))
      .join("\n");

    expect(source).not.toContain('from "../lib/cn"');
    expect(source).not.toContain("@apply");
    expect(source).not.toMatch(
      /(?:bg|text|border|shadow)-(?:red|blue|green|purple|orange|yellow|gray|zinc|neutral)-\d+/,
    );
  });

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

  it("keeps residual CSS on the documented keyframe and no-Preflight allowlist", () => {
    const stylesDirectory = resolve(process.cwd(), "src/styles");
    expect(readdirSync(stylesDirectory).sort()).toEqual(Object.keys(residualKeyframes).sort());

    for (const [file, keyframes] of Object.entries(residualKeyframes)) {
      const source = readFileSync(resolve(stylesDirectory, file), "utf8");
      expect(topLevelBlockHeaders(source), file).toEqual(
        keyframes.map((keyframe) => `@keyframes ${keyframe}`),
      );
      expect(source, file).not.toContain("@apply");
      expect(source, file).not.toMatch(/\.n-[A-Za-z0-9_-]+\s*[{,]/);
    }

    const entrypoint = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
    const imports = [...entrypoint.matchAll(/@import\s+"([^"]+)";/g)].map((match) => match[1]);
    expect(imports).toEqual([
      "@nerio-ui/tokens/styles.css",
      "./styles/motion.css",
      "./styles/spinner.css",
      "./styles/feedback.css",
      "./styles/progress.css",
      "./styles/select.css",
      "./styles/overlays.css",
    ]);
    expect(topLevelBlockHeaders(entrypoint.replaceAll(/@import\s+"[^"]+";/g, ""))).toEqual([
      ':where([class^="n-"], [class*=" n-"])',
      ':where(button, input, select, textarea):where([class^="n-"], [class*=" n-"])',
    ]);
    expect(entrypoint).toContain("box-sizing: border-box;");
    expect(entrypoint).toContain("font-family: inherit;");
    expect(entrypoint).not.toContain("@apply");
  });

  it("composes the Dialog close control from the secondary Button contract", () => {
    const dialogSource = readFileSync(resolve(process.cwd(), "src/components/dialog.tsx"), "utf8");

    expect(dialogSource).toContain('className="n-dialog__close flex-none"');
    expect(dialogSource).toContain('variant="secondary"');
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

  it("keeps Navigation, Layout, Overlays, and compound UI on one Tailwind-first visual source", () => {
    const migratedComponents = [
      "breadcrumbs",
      "pagination",
      "command",
      "dropdown-menu",
      "popover",
      "sheet",
      "sidebar",
      "sidebar-layout",
      "tabs",
      "toast",
      "tooltip",
    ];

    for (const component of migratedComponents) {
      const source = readFileSync(
        resolve(process.cwd(), `src/components/${component}.tsx`),
        "utf8",
      );
      expect(source, component).toContain('from "../lib/tailwind-cn"');
    }

    for (const obsoleteStylesheet of [
      "navigation.css",
      "sidebar.css",
      "command.css",
      "tabs.css",
      "toast.css",
    ]) {
      expect(existsSync(resolve(process.cwd(), `src/styles/${obsoleteStylesheet}`))).toBe(false);
    }

    for (const residualStylesheet of ["motion.css", "overlays.css"]) {
      const residual = readFileSync(
        resolve(process.cwd(), `src/styles/${residualStylesheet}`),
        "utf8",
      );
      expect(residual).toContain("@keyframes");
      expect(residual).not.toMatch(/\.n-/);
    }
  });
});
