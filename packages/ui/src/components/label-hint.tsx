"use client";

import * as React from "react";
import { CircleQuestionMark } from "@nerio/adapters/icons";
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
    <span className="n-label__hint" data-slot="hint">
      <Tooltip delay={0} label={label}>
        <span aria-label={ariaLabel} tabIndex={0}>
          <Icon icon={CircleQuestionMark} />
        </span>
      </Tooltip>
    </span>
  );
}
