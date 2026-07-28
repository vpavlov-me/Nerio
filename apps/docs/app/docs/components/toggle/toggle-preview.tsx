"use client";

import { Bell, Save } from "@nerio-ui/adapters/icons";
import { Toggle } from "@nerio-ui/ui/client";

export function TogglePreview() {
  return (
    <div className="preview-row" aria-label="Icon-only Toggle examples">
      <Toggle icon={Bell} aria-label="Follow updates" defaultPressed />
      <Toggle icon={Save} aria-label="Save article for later" variant="outline" />
    </div>
  );
}
