"use client";

import * as React from "react";
import { Bell, Check, Save, Settings } from "@nerio-ui/adapters/icons";
import { Toggle } from "@nerio-ui/ui/client";

export function TogglePreview() {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="form-component-preview__stack form-preview-stack">
      <div className="form-component-preview__section">
        <p className="form-component-preview__label">Usage</p>
        <div className="preview-row">
          <Toggle leadingIcon={saved ? Check : Save} pressed={saved} onPressedChange={setSaved}>
            Save article
          </Toggle>
          <span className="inline-control" aria-live="polite">
            {saved ? "Saved" : "Not saved"}
          </span>
        </div>
      </div>
      <div className="form-component-preview__section">
        <p className="form-component-preview__label">Variants</p>
        <div className="preview-row">
          <Toggle leadingIcon={Bell}>Follow updates</Toggle>
          <Toggle leadingIcon={Settings} defaultPressed variant="outline">
            Reading mode
          </Toggle>
        </div>
      </div>
      <div className="form-component-preview__section">
        <p className="form-component-preview__label">Icon only</p>
        <div className="preview-row">
          <Toggle icon={Bell} aria-label="Follow updates" defaultPressed />
          <Toggle icon={Save} aria-label="Save article for later" />
        </div>
      </div>
      <div className="form-component-preview__section">
        <p className="form-component-preview__label">Sizes</p>
        <div className="preview-row">
          <Toggle leadingIcon={Save} size="sm">
            Small
          </Toggle>
          <Toggle leadingIcon={Save} defaultPressed>
            Medium
          </Toggle>
          <Toggle leadingIcon={Save} size="lg" variant="outline">
            Large
          </Toggle>
        </div>
      </div>
      <div className="form-component-preview__section">
        <p className="form-component-preview__label">Disabled</p>
        <div className="preview-row">
          <Toggle disabled>Disabled</Toggle>
          <Toggle defaultPressed disabled variant="outline">
            Disabled selected
          </Toggle>
        </div>
      </div>
    </div>
  );
}
