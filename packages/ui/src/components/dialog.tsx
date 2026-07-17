"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio-ui/adapters/icons";
import { Button } from "./button";
import { Icon } from "./icon";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const backdropClasses =
  "n-backdrop fixed inset-0 isolate z-(--n-overlay-z-index) bg-(--n-overlay-backdrop)";
const dialogClasses =
  "n-dialog fixed start-1/2 top-1/2 z-[calc(var(--n-overlay-z-index)+1)] w-[min(calc(100vw-(var(--n-dialog-viewport-inset)*2)),var(--n-dialog-width-md))] -translate-x-1/2 -translate-y-1/2 rounded-(--n-radius-overlay) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-dialog-padding) shadow-(--n-overlay-shadow) [animation:n-dialog-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:[animation:n-dialog-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:[animation-name:n-dialog-fade-only]";

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
        <BaseDialog.Backdrop className={backdropClasses} data-slot="backdrop" />
        <BaseDialog.Popup ref={ref} className={cn(dialogClasses, className)} data-slot="content">
          <header
            className="n-dialog__header mb-(--n-dialog-header-margin) flex items-start justify-between gap-(--n-dialog-header-gap)"
            data-slot="header"
          >
            <div className="n-dialog__heading grid gap-(--n-space-1)" data-slot="heading">
              <BaseDialog.Title
                className="n-dialog__title m-0 text-(length:--n-font-size-xl) leading-(--n-line-height-tight) text-(--n-color-text-primary)"
                data-slot="title"
              >
                {title}
              </BaseDialog.Title>
              {description ? (
                <BaseDialog.Description
                  className="n-dialog__description m-0 text-(length:--n-font-size-sm) text-(--n-color-text-secondary)"
                  data-slot="description"
                >
                  {description}
                </BaseDialog.Description>
              ) : null}
            </div>
            <BaseDialog.Close
              className="n-dialog__close inline-flex size-(--n-size-control-sm) cursor-pointer items-center justify-center rounded-(--n-radius-sm) border-(--n-border-width-0) bg-(--n-button-background-ghost) text-(length:--n-font-size-sm) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring)"
              aria-label="Close dialog"
            >
              <Icon icon={X} />
            </BaseDialog.Close>
          </header>
          <div
            className={cn(
              "n-dialog__body grid gap-(--n-dialog-body-gap) text-(--n-overlay-foreground) [&_p]:m-0",
              bodyClassName,
            )}
            data-slot="body"
          >
            {children}
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
});
