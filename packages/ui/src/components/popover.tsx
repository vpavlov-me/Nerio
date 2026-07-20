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
              "n-popover__content grid min-w-(--n-dropdown-min-width) max-w-(--n-popover-width-md) gap-(--n-popover-gap) rounded-(--n-popover-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-popover-padding) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-button-background-ghost-hover:var(--n-overlay-control-background-hover)] [--n-button-background-secondary:var(--n-overlay-control-background)] [--n-button-background-secondary-hover:var(--n-overlay-control-background-hover)] [--n-button-foreground-ghost:var(--n-overlay-foreground-muted)] [--n-button-foreground-secondary:var(--n-overlay-foreground)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)] [--n-input-background:var(--n-input-background-on-overlay)] [--n-input-background-hover:var(--n-input-background-on-overlay-hover)] [--n-input-foreground:var(--n-input-foreground-on-overlay)] [--n-input-placeholder:var(--n-input-placeholder-on-overlay)]",
              motionClasses.overlayEnter,
              className,
            )}
            data-slot="content"
          >
            {title ? (
              <BasePopover.Title
                className="n-popover__title m-0 text-(length:--n-font-size-sm) font-(--n-font-weight-medium) text-(--n-color-text-primary)"
                data-slot="title"
              >
                {title}
              </BasePopover.Title>
            ) : null}
            {description ? (
              <BasePopover.Description
                className="n-popover__description m-0 text-(length:--n-font-size-sm) text-(--n-color-text-secondary)"
                data-slot="description"
              >
                {description}
              </BasePopover.Description>
            ) : null}
            <div
              className="n-popover__body grid gap-(--n-popover-gap) text-(length:--n-font-size-sm) text-(--n-color-text-secondary)"
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
