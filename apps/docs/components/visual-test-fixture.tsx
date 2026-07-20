"use client";

import * as React from "react";
import { ToastProvider, ToastViewport } from "@nerio-ui/ui/client";
import { ComponentPlayground } from "./component-playground-specimens";

export function VisualTestFixture() {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => setReady(true), []);

  return (
    <ToastProvider>
      <main
        className="visual-test-fixture"
        data-visual-test-fixture=""
        data-visual-test-ready={ready || undefined}
      >
        <ComponentPlayground />
      </main>
      <ToastViewport swipeDirection={["left", "right", "up", "down"]} />
    </ToastProvider>
  );
}
