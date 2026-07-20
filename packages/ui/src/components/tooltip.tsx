"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { tailwindCn as cn } from "../lib/tailwind-cn";
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
          <BaseTooltip.Positioner className="n-tooltip-positioner z-(--n-overlay-z-index)">
            <BaseTooltip.Popup
              ref={ref}
              className={cn(
                "n-tooltip-popup z-(--n-overlay-z-index) max-w-(--n-size-tooltip-max) whitespace-normal rounded-(--n-tooltip-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) px-(--n-space-3) py-(--n-space-2) text-(length:--n-font-size-xs) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)]",
                motionClasses.overlayEnter,
                className,
              )}
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
