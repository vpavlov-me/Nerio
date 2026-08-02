"use client";

import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import type { NerioChangeEventDetails } from "../lib/component-props";

export type TooltipOpenChangeEventReason =
  | "trigger-hover"
  | "trigger-focus"
  | "trigger-press"
  | "outside-press"
  | "escape-key"
  | "disabled"
  | "imperative-action"
  | "none";
export type TooltipOpenChangeEventDetails =
  NerioChangeEventDetails<TooltipOpenChangeEventReason> & {
    preventUnmountOnClose: () => void;
  };
export interface TooltipProps {
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean, eventDetails: TooltipOpenChangeEventDetails) => void;
  open?: boolean;
  label: React.ReactNode;
  /** A focusable element is recommended so keyboard users can discover the tooltip. */
  children: React.ReactElement;
  className?: string;
  delay?: number;
}

export interface TooltipProviderProps {
  closeDelay?: number;
  delay?: number;
  timeout?: number;
  children: React.ReactNode;
}

export function TooltipProvider({ children, ...props }: TooltipProviderProps) {
  return <BaseTooltip.Provider {...props}>{children}</BaseTooltip.Provider>;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { label, children, className, open, defaultOpen, onOpenChange, disabled, delay },
  ref,
) {
  return (
    <BaseTooltip.Root
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <BaseTooltip.Trigger delay={delay} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          className="n-tooltip-positioner z-(--n-overlay-z-index)"
          sideOffset={10}
        >
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
            <BaseTooltip.Arrow
              className="n-tooltip-arrow relative block h-(--n-space-1-5) w-(--n-space-3) overflow-clip data-[side=bottom]:top-[calc(var(--n-space-1-5)*-1)] data-[side=left]:right-[calc((var(--n-space-2)+1px)*-1)] data-[side=left]:rotate-90 data-[side=right]:left-[calc((var(--n-space-2)+1px)*-1)] data-[side=right]:-rotate-90 data-[side=top]:bottom-[calc(var(--n-space-1-5)*-1)] data-[side=top]:rotate-180 before:absolute before:bottom-0 before:left-1/2 before:size-[calc(var(--n-space-1-5)*1.4142)] before:border-(length:--n-overlay-border-width) before:border-(--n-overlay-border) before:bg-(--n-overlay-background) before:content-[''] before:[transform:translate(-50%,50%)_rotate(45deg)]"
              data-slot="arrow"
            />
            {label}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
});
