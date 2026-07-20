"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio-ui/adapters/icons";
import { Button } from "./button";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const backdropClasses =
  "n-backdrop fixed inset-0 isolate z-(--n-overlay-z-index) bg-(--n-overlay-backdrop) [backdrop-filter:var(--n-overlay-backdrop-filter)] [animation:n-dialog-backdrop-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:[animation:n-dialog-backdrop-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:[animation-name:n-dialog-fade-only]";
const dialogClasses =
  "n-dialog fixed start-1/2 top-1/2 z-[calc(var(--n-overlay-z-index)+1)] w-[min(calc(100vw-(var(--n-dialog-viewport-inset)*2)),var(--n-dialog-width-md))] -translate-x-1/2 -translate-y-1/2 rounded-(--n-radius-overlay) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-dialog-padding) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-button-background-ghost-hover:var(--n-overlay-control-background-hover)] [--n-button-background-secondary:var(--n-overlay-control-background)] [--n-button-background-secondary-hover:var(--n-overlay-control-background-hover)] [--n-button-foreground-ghost:var(--n-overlay-foreground-muted)] [--n-button-foreground-secondary:var(--n-overlay-foreground)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)] [--n-input-background:var(--n-input-background-on-overlay)] [--n-input-background-hover:var(--n-input-background-on-overlay-hover)] [--n-input-foreground:var(--n-input-foreground-on-overlay)] [--n-input-placeholder:var(--n-input-placeholder-on-overlay)] [animation:n-dialog-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:[animation:n-dialog-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:[animation-name:n-dialog-fade-only]";

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
  closeLabel?: string;
}

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    trigger,
    title,
    description,
    children,
    className,
    bodyClassName,
    closeLabel = "Close dialog",
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
                className="n-dialog__title m-0 text-(length:--n-font-size-xl) font-(--n-font-weight-medium) leading-(--n-line-height-tight) text-(--n-color-text-primary)"
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
              render={
                <Button
                  aria-label={closeLabel}
                  className="n-dialog__close flex-none"
                  icon={X}
                  size="sm"
                  tooltip={false}
                  variant="secondary"
                />
              }
              data-slot="close"
            />
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

export const DialogFooter = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"footer">>(
  function DialogFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        {...props}
        className={cn(
          "n-dialog__footer flex flex-wrap items-center justify-end gap-(--n-space-2)",
          className,
        )}
        data-slot="footer"
      />
    );
  },
);
