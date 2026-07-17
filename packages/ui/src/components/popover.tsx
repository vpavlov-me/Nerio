"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Button } from "./button";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

export interface PopoverProps extends Pick<
  React.ComponentProps<typeof BasePopover.Root>,
  "defaultOpen" | "onOpenChange" | "open"
> {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(function Popover(
  { trigger, title, description, children, className, open, defaultOpen, onOpenChange },
  ref,
) {
  return (
    <BasePopover.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BasePopover.Trigger
        render={
          React.isValidElement(trigger) ? trigger : <Button variant="secondary">{trigger}</Button>
        }
      />
      <BasePopover.Portal>
        <BasePopover.Positioner className="n-popover-positioner z-(--n-overlay-z-index)">
          <BasePopover.Popup
            ref={ref}
            className={cn(
              "n-popover__content grid min-w-(--n-dropdown-min-width) max-w-(--n-popover-width-md) gap-(--n-space-2) rounded-(--n-radius-container) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-2) shadow-(--n-overlay-shadow)",
              motionClasses.overlayEnter,
              className,
            )}
            data-slot="content"
          >
            {title ? (
              <BasePopover.Title
                className="n-popover__title m-0 px-(--n-space-2) pt-(--n-space-1) text-(length:--n-font-size-sm) font-(--n-font-weight-semibold) text-(--n-color-text-primary)"
                data-slot="title"
              >
                {title}
              </BasePopover.Title>
            ) : null}
            {description ? (
              <BasePopover.Description
                className="n-popover__description m-0 px-(--n-space-2) text-(length:--n-font-size-sm) text-(--n-color-text-secondary)"
                data-slot="description"
              >
                {description}
              </BasePopover.Description>
            ) : null}
            <div
              className="n-popover__body grid gap-(--n-space-2) text-(length:--n-font-size-sm) text-(--n-color-text-secondary)"
              data-slot="body"
            >
              {children}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
});
