"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Button } from "./button";
import { cn } from "../lib/cn";
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
        <BasePopover.Positioner className="n-popover-positioner">
          <BasePopover.Popup
            ref={ref}
            className={cn("n-popover__content", motionClasses.overlayEnter, className)}
            data-slot="content"
          >
            {title ? (
              <BasePopover.Title className="n-popover__title" data-slot="title">
                {title}
              </BasePopover.Title>
            ) : null}
            {description ? (
              <BasePopover.Description className="n-popover__description" data-slot="description">
                {description}
              </BasePopover.Description>
            ) : null}
            <div className="n-popover__body" data-slot="body">
              {children}
            </div>
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
});
