"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Button } from "./button";
import { cn } from "../lib/cn";

export interface DropdownMenuItem {
  label: React.ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  className?: string;
}

export function DropdownMenu({ trigger, items, className }: DropdownMenuProps) {
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger
        render={
          React.isValidElement(trigger) ? trigger : <Button variant="secondary">{trigger}</Button>
        }
      />
      <BaseMenu.Portal>
        <BaseMenu.Positioner className="n-popover-positioner">
          <BaseMenu.Popup className={cn("n-dropdown", className)} data-slot="content">
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
}
