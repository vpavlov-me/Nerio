"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio/adapters/icons";
import { Button } from "./button";
import { Icon } from "./icon";
import { cn } from "../lib/cn";

export interface DialogProps extends Pick<
  React.ComponentProps<typeof BaseDialog.Root>,
  "defaultOpen" | "onOpenChange" | "open"
> {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    trigger,
    title,
    description,
    children,
    className,
    bodyClassName,
    open,
    defaultOpen,
    onOpenChange,
  },
  ref,
) {
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <BaseDialog.Trigger
        render={React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
      />
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="n-backdrop" data-slot="backdrop" />
        <BaseDialog.Popup ref={ref} className={cn("n-dialog", className)} data-slot="content">
          <header className="n-dialog__header" data-slot="header">
            <div className="n-dialog__heading" data-slot="heading">
              <BaseDialog.Title className="n-dialog__title" data-slot="title">
                {title}
              </BaseDialog.Title>
              {description ? (
                <BaseDialog.Description className="n-dialog__description" data-slot="description">
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            <BaseDialog.Close className="n-dialog__close" aria-label="Close dialog">
              <Icon icon={X} />
            </BaseDialog.Close>
          </header>
          <div className={cn("n-dialog__body", bodyClassName)} data-slot="body">
            {children}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
});
