"use client";

import * as React from "react";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@nerio-ui/adapters/icons";
import { Button } from "./button";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

export const dialogBackdropClasses =
  "n-backdrop fixed inset-0 isolate z-(--n-overlay-z-index) bg-(--n-overlay-backdrop) [backdrop-filter:var(--n-overlay-backdrop-filter)] [animation:n-dialog-backdrop-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:[animation:n-dialog-backdrop-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:[animation-name:n-dialog-fade-only]";
export const dialogContentClasses =
  "n-dialog fixed left-1/2 top-1/2 z-[calc(var(--n-overlay-z-index)+1)] grid max-h-[calc(100dvh-(var(--n-dialog-viewport-inset)*2))] w-[min(calc(100vw-(var(--n-dialog-viewport-inset)*2)),var(--n-dialog-width-md))] grid-rows-[auto_minmax(0,1fr)] overflow-hidden -translate-x-1/2 -translate-y-1/2 rounded-(--n-radius-overlay) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-dialog-padding) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [--n-button-background-ghost-hover:var(--n-overlay-control-background-hover)] [--n-button-background-secondary:var(--n-overlay-control-background)] [--n-button-background-secondary-hover:var(--n-overlay-control-background-hover)] [--n-button-foreground-ghost:var(--n-overlay-foreground-muted)] [--n-button-foreground-secondary:var(--n-overlay-foreground)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)] [--n-input-background:var(--n-input-background-on-overlay)] [--n-input-background-hover:var(--n-input-background-on-overlay-hover)] [--n-input-foreground:var(--n-input-foreground-on-overlay)] [--n-input-placeholder:var(--n-input-placeholder-on-overlay)] [animation:n-dialog-enter_var(--n-motion-overlay-enter-duration)_var(--n-motion-overlay-enter-easing)] data-ending-style:[animation:n-dialog-exit_var(--n-motion-overlay-exit-duration)_var(--n-motion-overlay-exit-easing)] motion-reduce:[animation-name:n-dialog-fade-only]";
export const dialogTitleClasses =
  "n-dialog__title m-0 text-(length:--n-font-size-lg) font-(--n-font-weight-medium) leading-(--n-line-height-tight) text-(--n-color-text-primary)";
export const dialogDescriptionClasses =
  "n-dialog__description m-0 text-(length:--n-font-size-md) leading-(--n-line-height-normal) text-(--n-color-text-secondary)";

const dialogHeaderClasses =
  "n-dialog__header mb-(--n-dialog-header-margin) flex items-start justify-between gap-(--n-dialog-header-gap)";
const dialogBodyClasses =
  "n-dialog__body grid min-h-0 gap-(--n-dialog-body-gap) overflow-y-auto overscroll-contain text-(--n-overlay-foreground) [scrollbar-color:var(--n-overlay-foreground-muted)_var(--n-overlay-control-background)] [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-(--n-space-1) [&::-webkit-scrollbar-thumb]:rounded-(--n-radius-full) [&::-webkit-scrollbar-thumb]:bg-(--n-overlay-foreground-muted) [&::-webkit-scrollbar-track]:rounded-(--n-radius-full) [&::-webkit-scrollbar-track]:bg-(--n-overlay-control-background) [&_p]:m-0";
const dialogFooterClasses =
  "n-dialog__footer flex flex-wrap items-center justify-end gap-(--n-space-2)";

function withClassName<State>(className: NerioClassName<State> | undefined, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

export type DialogOpenChangeEventReason =
  | "trigger-press"
  | "outside-press"
  | "escape-key"
  | "close-press"
  | "focus-out"
  | "imperative-action"
  | "none";
export type DialogOpenChangeEventDetails = NerioChangeEventDetails<DialogOpenChangeEventReason> & {
  preventUnmountOnClose: () => void;
};
export type DialogInteractionType = "" | "mouse" | "touch" | "pen" | "keyboard";
export type DialogFocusTarget =
  | boolean
  | React.RefObject<HTMLElement | null>
  | ((interactionType: DialogInteractionType) => boolean | HTMLElement | null | void);

export interface DialogRootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: DialogOpenChangeEventDetails) => void;
  open?: boolean;
}

export function DialogRoot({ children, defaultOpen, onOpenChange, open }: DialogRootProps) {
  return (
    <BaseDialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      {children}
    </BaseDialog.Root>
  );
}

export interface DialogTriggerState {
  disabled: boolean;
  open: boolean;
}
export interface DialogTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DialogTriggerState>;
  nativeButton?: boolean;
  render?: NerioRenderProp<DialogTriggerState>;
  style?: NerioStyle<DialogTriggerState>;
}

export const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  function DialogTrigger({ className, nativeButton, type, ...props }, ref) {
    return (
      <BaseDialog.Trigger
        ref={ref}
        {...props}
        className={className}
        data-slot="trigger"
        nativeButton={nativeButton}
        type={nativeButton !== false ? (type ?? "button") : undefined}
      />
    );
  },
);

export type DialogPortalState = Record<never, never>;
export interface DialogPortalProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<DialogPortalState>;
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null;
  keepMounted?: boolean;
  render?: NerioRenderProp<DialogPortalState>;
  style?: NerioStyle<DialogPortalState>;
}

export const DialogPortal = React.forwardRef<HTMLDivElement, DialogPortalProps>(
  function DialogPortal(props, ref) {
    return <BaseDialog.Portal ref={ref} {...props} data-slot="portal" />;
  },
);

export interface DialogBackdropState {
  open: boolean;
  transitionStatus: "starting" | "ending" | "idle" | undefined;
}
export interface DialogBackdropProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<DialogBackdropState>;
  forceRender?: boolean;
  render?: NerioRenderProp<DialogBackdropState>;
  style?: NerioStyle<DialogBackdropState>;
}

export const DialogBackdrop = React.forwardRef<HTMLDivElement, DialogBackdropProps>(
  function DialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseDialog.Backdrop
        ref={ref}
        {...props}
        className={withClassName(className, dialogBackdropClasses)}
        data-slot="backdrop"
      />
    );
  },
);

export interface DialogContentState {
  open: boolean;
  transitionStatus: "starting" | "ending" | "idle" | undefined;
  nested: boolean;
  nestedDialogOpen: boolean;
}
export interface DialogContentProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "color" | "style"
> {
  children: React.ReactNode;
  className?: NerioClassName<DialogContentState>;
  finalFocus?: DialogFocusTarget;
  initialFocus?: DialogFocusTarget;
  render?: NerioRenderProp<DialogContentState>;
  style?: NerioStyle<DialogContentState>;
}

export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent({ className, ...props }, ref) {
    return (
      <BaseDialog.Popup
        ref={ref}
        {...props}
        className={withClassName(className, dialogContentClasses)}
        data-slot="content"
      />
    );
  },
);

export const DialogHeader = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"header">>(
  function DialogHeader({ className, ...props }, ref) {
    return (
      <header
        ref={ref}
        {...props}
        className={cn(dialogHeaderClasses, className)}
        data-slot="header"
      />
    );
  },
);

export type DialogTitleElement = "div" | "h2" | "h3" | "h4" | "h5" | "h6";
export interface DialogTitleProps extends React.HTMLAttributes<HTMLElement> {
  as?: DialogTitleElement;
}

export const DialogTitle = React.forwardRef<HTMLElement, DialogTitleProps>(function DialogTitle(
  { as: Component = "div", className, ...props },
  ref,
) {
  return (
    <BaseDialog.Title
      {...props}
      className={cn(dialogTitleClasses, className)}
      data-slot="title"
      render={<Component ref={ref as React.Ref<never>} />}
    />
  );
});

export const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <BaseDialog.Description
      ref={ref}
      {...props}
      className={cn(dialogDescriptionClasses, className)}
      data-slot="description"
    />
  );
});

export const DialogBody = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  function DialogBody({ className, ...props }, ref) {
    return (
      <div ref={ref} {...props} className={cn(dialogBodyClasses, className)} data-slot="body" />
    );
  },
);

export const DialogFooter = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"footer">>(
  function DialogFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        {...props}
        className={cn(dialogFooterClasses, className)}
        data-slot="footer"
      />
    );
  },
);

export interface DialogCloseState {
  disabled: boolean;
}
export interface DialogCloseProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DialogCloseState>;
  nativeButton?: boolean;
  render?: NerioRenderProp<DialogCloseState>;
  style?: NerioStyle<DialogCloseState>;
}

export const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  function DialogClose({ className, nativeButton, type, ...props }, ref) {
    return (
      <BaseDialog.Close
        ref={ref}
        {...props}
        className={className}
        data-slot="close"
        nativeButton={nativeButton}
        type={nativeButton !== false ? (type ?? "button") : undefined}
      />
    );
  },
);

export interface DialogProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: DialogOpenChangeEventDetails) => void;
  open?: boolean;
  trigger: React.ReactNode;
  title: React.ReactNode;
  titleAs?: DialogTitleElement;
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
    titleAs: TitleComponent = "div",
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
    <DialogRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger
        render={React.isValidElement(trigger) ? trigger : <Button>{trigger}</Button>}
      />
      <DialogPortal>
        <DialogBackdrop />
        <DialogContent ref={ref} className={className}>
          <DialogHeader>
            <div className="n-dialog__heading grid gap-(--n-space-1)" data-slot="heading">
              <DialogTitle as={TitleComponent}>{title}</DialogTitle>
              {description ? <DialogDescription>{description}</DialogDescription> : null}
            </div>
            <DialogClose
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
            />
          </DialogHeader>
          <DialogBody className={bodyClassName}>{children}</DialogBody>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  );
});
