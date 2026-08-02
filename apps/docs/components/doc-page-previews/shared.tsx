"use client";

import type * as React from "react";
import { CodeExample } from "../code-example";

export type PreviewProps = { kind: string; snippet: string };

export function PreviewFrame({
  children,
  kind,
  snippet,
}: PreviewProps & { children: React.ReactNode }) {
  return (
    <section className="component-example" aria-label={`${kind} preview`}>
      <div className="component-example__preview">
        <div className="preview-row">{children}</div>
      </div>
      <CodeExample
        className="component-example__code"
        code={snippet}
        label={`${kind} preview code`}
      />
    </section>
  );
}
