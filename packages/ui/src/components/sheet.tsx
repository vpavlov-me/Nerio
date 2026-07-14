"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio/adapters/icons";
import { Icon } from "./icon";
import { cn } from "../lib/cn";

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
        <BaseDialog.Backdrop className="n-backdrop" data-slot="sheet-backdrop" />
        <BaseDialog.Popup
          ref={ref}
          className={cn("n-sheet", className)}
          data-side={side}
          data-size={size}
          data-slot="sheet-content"
          {...props}
        >
          {showClose ? (
            <SheetClose aria-label={closeLabel} className="n-sheet__close-icon">
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
        className={cn("n-sheet__header", className)}
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
      className={cn("n-sheet__title", className)}
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
      className={cn("n-sheet__description", className)}
      data-slot="sheet-description"
      {...props}
    />
  );
});

export const SheetBody = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function SheetBody({ className, ...props }, ref) {
    return (
      <div ref={ref} className={cn("n-sheet__body", className)} data-slot="sheet-body" {...props} />
    );
  },
);

export const SheetFooter = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"footer">>(
  function SheetFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        className={cn("n-sheet__footer", className)}
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
