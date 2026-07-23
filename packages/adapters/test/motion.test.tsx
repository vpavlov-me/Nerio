import * as React from "react";
import { act } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { MotionConfigContext } from "motion/react";
import { describe, expect, it, vi } from "vitest";
import * as motionAdapter from "../src/motion";
import {
  NerioMotionConfig,
  motionTransitions,
  motionVariants,
  useNerioReducedMotion,
} from "../src/motion";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe("Motion adapter", () => {
  it("snapshot-protects the stable runtime exports, transitions, variants, and state keys", () => {
    expect(Object.keys(motionAdapter).sort()).toEqual([
      "NerioMotionConfig",
      "motionTransitions",
      "motionVariants",
      "useNerioReducedMotion",
    ]);
    expect(motionTransitions).toEqual({
      instant: { type: "tween", duration: 0.08, ease: [0.2, 0, 0, 1] },
      fast: { type: "tween", duration: 0.14, ease: [0.2, 0, 0, 1] },
      normal: { type: "tween", duration: 0.22, ease: [0.2, 0, 0, 1] },
      slow: { type: "tween", duration: 0.36, ease: [0.16, 1, 0.3, 1] },
      enter: { type: "tween", duration: 0.22, ease: [0, 0, 0.2, 1] },
      exit: { type: "tween", duration: 0.14, ease: [0.4, 0, 1, 1] },
      expressive: { type: "tween", duration: 0.36, ease: [0.16, 1, 0.3, 1] },
      layout: { type: "spring", visualDuration: 0.36, bounce: 0 },
    });
    expect(motionVariants).toEqual({
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: motionTransitions.enter },
        exit: { opacity: 0, transition: motionTransitions.exit },
      },
      fadeScale: {
        hidden: { opacity: 0, scale: 0.98 },
        visible: { opacity: 1, scale: 1, transition: motionTransitions.enter },
        exit: { opacity: 0, scale: 0.98, transition: motionTransitions.exit },
      },
      slide: {
        up: {
          hidden: { opacity: 0, y: "0.375rem" },
          visible: { opacity: 1, y: 0, transition: motionTransitions.enter },
          exit: { opacity: 0, y: "0.375rem", transition: motionTransitions.exit },
        },
        right: {
          hidden: { opacity: 0, x: "-0.375rem" },
          visible: { opacity: 1, x: 0, transition: motionTransitions.enter },
          exit: { opacity: 0, x: "-0.375rem", transition: motionTransitions.exit },
        },
        down: {
          hidden: { opacity: 0, y: "-0.375rem" },
          visible: { opacity: 1, y: 0, transition: motionTransitions.enter },
          exit: { opacity: 0, y: "-0.375rem", transition: motionTransitions.exit },
        },
        left: {
          hidden: { opacity: 0, x: "0.375rem" },
          visible: { opacity: 1, x: 0, transition: motionTransitions.enter },
          exit: { opacity: 0, x: "0.375rem", transition: motionTransitions.exit },
        },
      },
      collapse: {
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1, transition: motionTransitions.enter },
        exit: { height: 0, opacity: 0, transition: motionTransitions.exit },
      },
    });
  });

  it("forwards the bounded CSP and deterministic-test config while locking user preference", async () => {
    function ConfigProbe() {
      const config = React.useContext(MotionConfigContext);
      return (
        <span
          data-nonce={config.nonce}
          data-reduced-motion={config.reducedMotion}
          data-skip-animations={String(config.skipAnimations)}
        />
      );
    }

    const container = document.createElement("div");
    const root = createRoot(container);
    await act(async () =>
      root.render(
        <NerioMotionConfig nonce="test-nonce" skipAnimations>
          <ConfigProbe />
        </NerioMotionConfig>,
      ),
    );

    expect(container.firstElementChild?.getAttribute("data-nonce")).toBe("test-nonce");
    expect(container.firstElementChild?.getAttribute("data-reduced-motion")).toBe("user");
    expect(container.firstElementChild?.getAttribute("data-skip-animations")).toBe("true");
    await act(async () => root.unmount());
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
