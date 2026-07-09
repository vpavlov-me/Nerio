"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Button } from "./button";
import { cn } from "../lib/cn";
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
          <BaseMenu.Positioner className="n-popover-positioner">
            <BaseMenu.Popup
              ref={ref}
              className={cn("n-dropdown", motionClasses.overlayEnter, className)}
              data-slot="content"
            >
              {items.map((item, index) => (
                <BaseMenu.Item
                  key={`${item.label}-${index}`}
                  className="n-dropdown__item"
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
