"use client";

import * as React from "react";
import { Bell, Settings } from "@nerio-ui/adapters/icons";
import { Toggle } from "@nerio-ui/ui/client";

export function TogglePreview() {
  const [showGuides, setShowGuides] = React.useState(false);

  return (
    <div className="form-preview-stack">
      <div className="preview-row" aria-label="Toggle content examples">
        <Toggle icon={Bell} aria-label="Follow updates" defaultPressed />
        <Toggle leadingIcon={Bell}>Follow updates</Toggle>
        <Toggle
          leadingIcon={Settings}
          pressed={showGuides}
          onPressedChange={setShowGuides}
          variant="outline"
        >
          Show guides
        </Toggle>
      </div>
      <div className="preview-row" aria-label="Toggle variants and sizes">
        <Toggle size="sm">Small</Toggle>
        <Toggle defaultPressed>Medium</Toggle>
        <Toggle size="lg" variant="outline">
          Large
        </Toggle>
      </div>
      <div className="preview-row" aria-label="Disabled Toggle states">
        <Toggle disabled>Disabled</Toggle>
        <Toggle defaultPressed disabled variant="outline">
          Disabled pressed
        </Toggle>
      </div>
    </div>
  );
}
