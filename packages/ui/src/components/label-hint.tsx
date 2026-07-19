"use client";

import * as React from "react";
import { CircleQuestionMark } from "@nerio-ui/adapters/icons";
import { Icon } from "./icon";
import { Tooltip } from "./tooltip";

export interface LabelHintProps {
  /** Short contextual guidance displayed on hover and keyboard focus. */
  label: React.ReactNode;
  /** Accessible name for the hint trigger. */
  ariaLabel?: string;
}

export function LabelHint({ label, ariaLabel = "More information" }: LabelHintProps) {
  return (
    <span className="n-label__hint inline-flex" data-slot="hint">
      <Tooltip delay={0} label={label}>
        <button
          className="inline-flex appearance-none border-0 bg-transparent p-0 text-(--n-label-icon-color) hover:text-(--n-color-action-primary) focus-visible:text-(--n-color-action-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) [&_.n-icon]:size-(--n-label-hint-icon-size)"
          aria-label={ariaLabel}
          type="button"
        >
          <Icon icon={CircleQuestionMark} />
        </button>
      </Tooltip>
    </span>
  );
}
