"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio-ui/adapters/icons";
import { Icon } from "./icon";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const sheetClasses =
  "n-sheet fixed z-[calc(var(--n-overlay-z-index)+1)] flex max-h-dvh max-w-dvw flex-col gap-(--n-sheet-gap) overflow-hidden border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-[max(var(--n-sheet-padding),env(safe-area-inset-top))_max(var(--n-sheet-padding),env(safe-area-inset-right))_max(var(--n-sheet-padding),env(safe-area-inset-bottom))_max(var(--n-sheet-padding),env(safe-area-inset-left))] text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-dvh data-[side=left]:w-[min(100dvw,var(--n-sheet-width-md))] data-[side=left]:rounded-r-(--n-sheet-radius) data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-dvh data-[side=right]:w-[min(100dvw,var(--n-sheet-width-md))] data-[side=right]:rounded-l-(--n-sheet-radius) data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-[min(100dvh,var(--n-sheet-height-md))] data-[side=top]:w-dvw data-[side=top]:rounded-b-(--n-sheet-radius) data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-[min(100dvh,var(--n-sheet-height-md))] data-[side=bottom]:w-dvw data-[side=bottom]:rounded-t-(--n-sheet-radius) data-[size=sm]:data-[side=left]:w-[min(100dvw,var(--n-sheet-width-sm))] data-[size=sm]:data-[side=right]:w-[min(100dvw,var(--n-sheet-width-sm))] data-[size=lg]:data-[side=left]:w-[min(100dvw,var(--n-sheet-width-lg))] data-[size=lg]:data-[side=right]:w-[min(100dvw,var(--n-sheet-width-lg))] data-[size=sm]:data-[side=top]:h-[min(100dvh,var(--n-sheet-height-sm))] data-[size=sm]:data-[side=bottom]:h-[min(100dvh,var(--n-sheet-height-sm))] data-[size=lg]:data-[side=top]:h-[min(100dvh,var(--n-sheet-height-lg))] data-[size=lg]:data-[side=bottom]:h-[min(100dvh,var(--n-sheet-height-lg))] data-[side=left]:animate-[n-sheet-enter-left_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-[side=right]:animate-[n-sheet-enter-right_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-[side=top]:animate-[n-sheet-enter-top_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-[side=bottom]:animate-[n-sheet-enter-bottom_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:data-[side=left]:animate-[n-sheet-exit-left_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] data-ending-style:data-[side=right]:animate-[n-sheet-exit-right_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] data-ending-style:data-[side=top]:animate-[n-sheet-exit-top_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] data-ending-style:data-[side=bottom]:animate-[n-sheet-exit-bottom_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:data-[side=left]:animate-none motion-reduce:data-[side=right]:animate-none motion-reduce:data-[side=top]:animate-none motion-reduce:data-[side=bottom]:animate-none forced-colors:border-[CanvasText]";

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
  return <BaseDialog.Trigger ref={ref} data-slot="sheet-trigger" {...props} />;
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
          className="n-backdrop bg-(--n-sheet-backdrop)"
          data-slot="sheet-backdrop"
        />
        <BaseDialog.Popup
          ref={ref}
          className={cn(sheetClasses, className)}
          data-side={side}
          data-size={size}
          data-slot="sheet-content"
          {...props}
        >
          {showClose ? (
            <SheetClose
              aria-label={closeLabel}
              className="n-sheet__close-icon absolute top-[max(var(--n-sheet-padding),env(safe-area-inset-top))] right-[max(var(--n-sheet-padding),env(safe-area-inset-right))] inline-flex size-(--n-size-control-sm) flex-none cursor-pointer items-center justify-center rounded-(--n-radius-sm) border-0 bg-(--n-button-background-ghost) text-(--n-color-text-tertiary) hover:bg-(--n-color-surface-muted) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) rtl:right-[max(var(--n-sheet-padding),env(safe-area-inset-left))] forced-colors:border forced-colors:border-[ButtonText]"
            >
              <Icon icon={X} />
            </SheetClose>
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
        className={cn("n-sheet__header grid flex-none gap-(--n-space-1)", className)}
        data-slot="sheet-header"
        {...props}
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
      className={cn(
        "n-sheet__title m-0 pe-(--n-size-control-sm) text-(length:--n-font-size-xl) leading-(--n-line-height-tight) text-(--n-color-text-primary)",
        className,
      )}
      data-slot="sheet-title"
      {...props}
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
      className={cn(
        "n-sheet__description m-0 text-(length:--n-font-size-sm) text-(--n-color-text-secondary)",
        className,
      )}
      data-slot="sheet-description"
      {...props}
    />
  );
});

export const SheetBody = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function SheetBody({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(
          "n-sheet__body grid min-h-0 flex-[1_1_auto] gap-(--n-sheet-gap) overflow-auto overscroll-contain pe-(--n-space-1)",
          className,
        )}
        data-slot="sheet-body"
        {...props}
      />
    );
  },
);

export const SheetFooter = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"footer">>(
  function SheetFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        className={cn(
          "n-sheet__footer grid flex-none gap-(--n-space-1) border-t-(length:--n-overlay-border-width) border-(--n-overlay-border) pt-(--n-sheet-gap)",
          className,
        )}
        data-slot="sheet-footer"
        {...props}
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
