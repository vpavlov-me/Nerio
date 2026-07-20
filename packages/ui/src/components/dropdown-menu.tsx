"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Button } from "./button";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

export interface DropdownMenuItem {
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownMenuProps extends Pick<
  React.ComponentProps<typeof BaseMenu.Root>,
  "defaultOpen" | "onOpenChange" | "open"
> {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ trigger, items, className, open, defaultOpen, onOpenChange }, ref) {
    return (
      <BaseMenu.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <BaseMenu.Trigger
          render={
            React.isValidElement(trigger) ? trigger : <Button variant="secondary">{trigger}</Button>
          }
        />
        <BaseMenu.Portal>
          <BaseMenu.Positioner className="n-popover-positioner z-(--n-overlay-z-index)">
            <BaseMenu.Popup
              ref={ref}
              className={cn(
                "n-dropdown grid min-w-(--n-dropdown-min-width) gap-(--n-space-1) rounded-(--n-dropdown-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-2) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-color-danger:var(--n-overlay-danger)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)]",
                motionClasses.overlayEnter,
                className,
              )}
              data-slot="content"
            >
              {items.map((item, index) => (
                <BaseMenu.Item
                  key={`${item.label}-${index}`}
                  className={cn(
                    "n-dropdown__item cursor-pointer rounded-(--n-radius-md) border-0 bg-(--n-button-background-ghost) px-(--n-dropdown-item-padding-inline) py-(--n-space-2) text-start text-(length:--n-font-size-sm) text-(--n-color-text-secondary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) data-[variant=destructive]:text-(--n-color-danger) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-opacity-disabled) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)",
                    motionClasses.hover,
                  )}
                  data-slot="item"
                  data-variant={item.destructive ? "destructive" : undefined}
                  disabled={item.disabled}
                  onClick={item.onSelect}
                >
                  {item.label}
                </BaseMenu.Item>
              ))}
            </BaseMenu.Popup>
          </BaseMenu.Positioner>
        </BaseMenu.Portal>
      </BaseMenu.Root>
    );
  },
);
