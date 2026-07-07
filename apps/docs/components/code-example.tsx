"use client";

import * as React from "react";
import { Check, Copy } from "@nerio/adapters";
import { IconButton } from "@nerio/ui";

export function CodeExample({ code, label = "Code example" }: { code: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.clearTimeout(resetTimer.current);
      resetTimer.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="code-example">
      <IconButton
        className="code-copy"
        icon={copied ? Check : Copy}
        label={copied ? "Copied" : `Copy ${label.toLowerCase()}`}
        size="sm"
        variant="ghost"
        onClick={copy}
      />
      <pre className="code-block" aria-label={label}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
