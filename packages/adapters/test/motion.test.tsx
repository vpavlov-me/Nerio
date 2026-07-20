import * as React from "react";
import { act } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import {
  NerioMotionConfig,
  motionTransitions,
  motionVariants,
  useNerioReducedMotion,
} from "../src/motion";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Motion adapter", () => {
  it("exposes the approved deterministic transition and variant contract", () => {
    expect(motionTransitions.normal).toMatchObject({ duration: 0.22, ease: [0.2, 0, 0, 1] });
    expect(motionTransitions.layout).toMatchObject({
      type: "spring",
      visualDuration: 0.36,
      bounce: 0,
    });
    expect(Object.keys(motionVariants)).toEqual(["fade", "fadeScale", "slide", "collapse"]);
    expect(Object.keys(motionVariants.slide)).toEqual(["up", "right", "down", "left"]);
  });

  it("renders and hydrates the user-preference configuration without drift", async () => {
    const tree = (
      <NerioMotionConfig>
        <p>Stable motion boundary</p>
      </NerioMotionConfig>
    );
    const markup = renderToString(tree);
    const root = document.createElement("div");
    root.innerHTML = markup;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const hydrated = hydrateRoot(root, tree);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    await act(async () => {
      hydrated.unmount();
    });

    expect(markup).toContain("Stable motion boundary");
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("updates mounted consumers when the reduced-motion preference changes", async () => {
    let matches = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(
        () =>
          ({
            matches,
            media: "(prefers-reduced-motion: reduce)",
            onchange: null,
            addEventListener: (_type: string, listener: () => void) => listeners.add(listener),
            removeEventListener: (_type: string, listener: () => void) =>
              listeners.delete(listener),
            addListener: () => undefined,
            removeListener: () => undefined,
            dispatchEvent: () => true,
          }) as unknown as MediaQueryList,
      ),
    );

    function PreferenceProbe() {
      return <span data-reduced-motion={useNerioReducedMotion() ? "true" : "false"} />;
    }

    const container = document.createElement("div");
    const root = createRoot(container);
    await act(async () => root.render(<PreferenceProbe />));
    expect(container.firstElementChild?.getAttribute("data-reduced-motion")).toBe("false");

    matches = true;
    await act(async () => listeners.forEach((listener) => listener()));
    expect(container.firstElementChild?.getAttribute("data-reduced-motion")).toBe("true");

    await act(async () => root.unmount());
    expect(listeners.size).toBe(0);
    vi.unstubAllGlobals();
  });
});
