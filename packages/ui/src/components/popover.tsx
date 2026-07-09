"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { Button } from "./button";
import { cn } from "../lib/cn";

export interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export function Popover({ trigger, title, description, children, className }: PopoverProps) {
  return (
    <BasePopover.Root>
      <BasePopover.Trigger
        render={
          React.isValidElement(trigger) ? trigger : <Button variant="secondary">{trigger}</Button>
        }
      />
      <BasePopover.Portal>
        <BasePopover.Positioner className="n-popover-positioner">
          <BasePopover.Popup className={cn("n-popover__content", className)} data-slot="content">
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
}
