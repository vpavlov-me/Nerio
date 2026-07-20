"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio-ui/adapters/icons";
import { Button } from "./button";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const sheetClasses =
  "n-sheet fixed z-[calc(var(--n-overlay-z-index)+1)] flex max-h-dvh max-w-dvw flex-col gap-(--n-sheet-gap) overflow-hidden rounded-(--n-sheet-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-sheet-padding) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-button-background-ghost-hover:var(--n-overlay-control-background-hover)] [--n-button-background-secondary:var(--n-overlay-control-background)] [--n-button-background-secondary-hover:var(--n-overlay-control-background-hover)] [--n-button-foreground-ghost:var(--n-overlay-foreground-muted)] [--n-button-foreground-secondary:var(--n-overlay-foreground)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)] [--n-input-background:var(--n-input-background-on-overlay)] [--n-input-background-hover:var(--n-input-background-on-overlay-hover)] [--n-input-foreground:var(--n-input-foreground-on-overlay)] [--n-input-placeholder:var(--n-input-placeholder-on-overlay)] data-[side=left]:top-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-top))] data-[side=left]:bottom-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-bottom))] data-[side=left]:left-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-left))] data-[side=left]:w-[min(calc(100dvw-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-width-md))] data-[side=right]:top-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-top))] data-[side=right]:right-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-right))] data-[side=right]:bottom-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-bottom))] data-[side=right]:w-[min(calc(100dvw-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-width-md))] data-[side=top]:top-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-top))] data-[side=top]:right-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-right))] data-[side=top]:left-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-left))] data-[side=top]:h-[min(calc(100dvh-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-height-md))] data-[side=bottom]:right-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-right))] data-[side=bottom]:bottom-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-bottom))] data-[side=bottom]:left-[max(var(--n-sheet-viewport-inset),env(safe-area-inset-left))] data-[side=bottom]:h-[min(calc(100dvh-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-height-md))] data-[size=sm]:data-[side=left]:w-[min(calc(100dvw-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-width-sm))] data-[size=sm]:data-[side=right]:w-[min(calc(100dvw-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-width-sm))] data-[size=lg]:data-[side=left]:w-[min(calc(100dvw-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-width-lg))] data-[size=lg]:data-[side=right]:w-[min(calc(100dvw-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-width-lg))] data-[size=sm]:data-[side=top]:h-[min(calc(100dvh-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-height-sm))] data-[size=sm]:data-[side=bottom]:h-[min(calc(100dvh-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-height-sm))] data-[size=lg]:data-[side=top]:h-[min(calc(100dvh-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-height-lg))] data-[size=lg]:data-[side=bottom]:h-[min(calc(100dvh-(var(--n-sheet-viewport-inset)*2)),var(--n-sheet-height-lg))] data-[side=left]:animate-[n-sheet-enter-left_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-[side=right]:animate-[n-sheet-enter-right_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-[side=top]:animate-[n-sheet-enter-top_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-[side=bottom]:animate-[n-sheet-enter-bottom_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:data-[side=left]:animate-[n-sheet-exit-left_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] data-ending-style:data-[side=right]:animate-[n-sheet-exit-right_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] data-ending-style:data-[side=top]:animate-[n-sheet-exit-top_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] data-ending-style:data-[side=bottom]:animate-[n-sheet-exit-bottom_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:data-[side=left]:animate-none motion-reduce:data-[side=right]:animate-none motion-reduce:data-[side=top]:animate-none motion-reduce:data-[side=bottom]:animate-none forced-colors:border-[CanvasText]";
const sheetBoundsClasses = "max-h-(--n-sheet-available-block) max-w-(--n-sheet-available-inline)";

type SheetRootProps = Pick<
  React.ComponentProps<typeof BaseDialog.Root>,
  "defaultOpen" | "onOpenChange" | "open"
>;

export type SheetSide = "left" | "right" | "top" | "bottom";
export type SheetSize = "sm" | "md" | "lg";

export interface SheetProps extends SheetRootProps {
  children: React.ReactNode;
}

export function Sheet({ children, defaultOpen, onOpenChange, open }: SheetProps) {
  return (
    <BaseDialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      {children}
    </BaseDialog.Root>
  );
}

export const SheetTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Trigger>
>(function SheetTrigger(props, ref) {
  return <BaseDialog.Trigger ref={ref} {...props} data-slot="sheet-trigger" />;
});

export interface SheetContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof BaseDialog.Popup>,
  "children"
> {
  children: React.ReactNode;
  side?: SheetSide;
  size?: SheetSize;
  showClose?: boolean;
  closeLabel?: string;
}

export const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  function SheetContent(
    {
      children,
      className,
      closeLabel = "Close sheet",
      showClose = true,
      side = "right",
      size = "md",
      ...props
    },
    ref,
  ) {
    return (
      <BaseDialog.Portal>
        <BaseDialog.Backdrop
          className="n-backdrop fixed inset-0 isolate z-(--n-overlay-z-index) bg-(--n-sheet-backdrop) [backdrop-filter:var(--n-overlay-backdrop-filter)] [animation:n-dialog-backdrop-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:[animation:n-dialog-backdrop-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:[animation-name:n-dialog-fade-only]"
          data-slot="sheet-backdrop"
        />
        <BaseDialog.Popup
          ref={ref}
          {...props}
          className={cn(sheetClasses, sheetBoundsClasses, className)}
          data-side={side}
          data-size={size}
          data-slot="sheet-content"
        >
          {showClose ? (
            <SheetClose
              render={
                <Button
                  aria-label={closeLabel}
                  className="n-sheet__close-icon absolute top-(--n-sheet-padding) end-(--n-sheet-padding) flex-none"
                  icon={X}
                  size="sm"
                  tooltip={false}
                  variant="secondary"
                />
              }
            />
          ) : null}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    );
  },
);

export const SheetHeader = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"header">>(
  function SheetHeader({ className, ...props }, ref) {
    return (
      <header
        ref={ref}
        {...props}
        className={cn("n-sheet__header grid flex-none gap-(--n-space-1)", className)}
        data-slot="sheet-header"
      />
    );
  },
);

export const SheetTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Title>
>(function SheetTitle({ className, ...props }, ref) {
  return (
    <BaseDialog.Title
      ref={ref}
      {...props}
      className={cn(
        "n-sheet__title m-0 pe-(--n-size-control-sm) text-(length:--n-font-size-xl) font-(--n-font-weight-medium) leading-(--n-line-height-tight) text-(--n-color-text-primary)",
        className,
      )}
      data-slot="sheet-title"
    />
  );
});

export const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Description>
>(function SheetDescription({ className, ...props }, ref) {
  return (
    <BaseDialog.Description
      ref={ref}
      {...props}
      className={cn(
        "n-sheet__description m-0 text-(length:--n-font-size-sm) text-(--n-color-text-secondary)",
        className,
      )}
      data-slot="sheet-description"
    />
  );
});

export const SheetBody = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function SheetBody({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "n-sheet__body grid min-h-0 flex-[1_1_auto] content-start gap-(--n-sheet-gap) overflow-auto overscroll-contain pe-(--n-space-1)",
          className,
        )}
        data-slot="sheet-body"
      />
    );
  },
);

export const SheetFooter = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"footer">>(
  function SheetFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        {...props}
        className={cn(
          "n-sheet__footer flex flex-none flex-wrap items-center justify-end gap-(--n-space-2)",
          className,
        )}
        data-slot="sheet-footer"
      />
    );
  },
);

export const SheetClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseDialog.Close>
>(function SheetClose({ className, ...props }, ref) {
  return <BaseDialog.Close ref={ref} {...props} className={className} data-slot="sheet-close" />;
});
