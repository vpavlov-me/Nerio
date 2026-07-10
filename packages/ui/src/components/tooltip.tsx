"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";

export interface TooltipProps extends Pick<
  React.ComponentProps<typeof BaseTooltip.Root>,
  "defaultOpen" | "disabled" | "onOpenChange" | "open"
> {
  label: React.ReactNode;
  /** A focusable element is recommended so keyboard users can discover the tooltip. */
  children: React.ReactElement;
  className?: string;
  delay?: number;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { label, children, className, open, defaultOpen, onOpenChange, disabled, delay },
  ref,
) {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
      >
        <BaseTooltip.Trigger delay={delay} render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner className="n-tooltip-positioner">
            <BaseTooltip.Popup
              ref={ref}
              className={cn("n-tooltip-popup", motionClasses.overlayEnter, className)}
              data-slot="content"
              role="tooltip"
            >
              {label}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
});
