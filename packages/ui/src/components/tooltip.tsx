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
  children: React.ReactNode;
  className?: string;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { label, children, className, open, defaultOpen, onOpenChange, disabled },
  ref,
) {
  const trigger = React.isValidElement(children) ? children : <span>{children}</span>;

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        disabled={disabled}
      >
        <BaseTooltip.Trigger render={trigger} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner className="n-tooltip-positioner">
            <BaseTooltip.Popup
              ref={ref}
              className={cn("n-tooltip-popup", motionClasses.overlayEnter, className)}
              data-slot="content"
            >
              {label}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
});
