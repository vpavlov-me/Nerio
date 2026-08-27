"use client";

import * as React from "react";
import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";
import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  dialogBackdropClasses,
  dialogContentClasses,
  dialogDescriptionClasses,
  dialogTitleClasses,
  type DialogFocusTarget,
  type DialogOpenChangeEventReason,
  type DialogTitleElement,
} from "./dialog";

function withClassName<State>(className: NerioClassName<State> | undefined, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

export type AlertDialogOpenChangeEventReason = DialogOpenChangeEventReason;
export type AlertDialogOpenChangeEventDetails =
  NerioChangeEventDetails<AlertDialogOpenChangeEventReason> & {
    preventUnmountOnClose: () => void;
  };

export interface AlertDialogProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: AlertDialogOpenChangeEventDetails) => void;
  open?: boolean;
}

export function AlertDialog({ children, defaultOpen, onOpenChange, open }: AlertDialogProps) {
  return (
    <BaseAlertDialog.Root defaultOpen={defaultOpen} onOpenChange={onOpenChange} open={open}>
      {children}
    </BaseAlertDialog.Root>
  );
}

export interface AlertDialogTriggerState {
  disabled: boolean;
  open: boolean;
}
export interface AlertDialogTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<AlertDialogTriggerState>;
  nativeButton?: boolean;
  render?: NerioRenderProp<AlertDialogTriggerState>;
  style?: NerioStyle<AlertDialogTriggerState>;
}

export const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  function AlertDialogTrigger({ className, nativeButton, type, ...props }, ref) {
    return (
      <BaseAlertDialog.Trigger
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

export type AlertDialogPortalState = Record<never, never>;
export interface AlertDialogPortalProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<AlertDialogPortalState>;
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null;
  keepMounted?: boolean;
  render?: NerioRenderProp<AlertDialogPortalState>;
  style?: NerioStyle<AlertDialogPortalState>;
}

export const AlertDialogPortal = React.forwardRef<HTMLDivElement, AlertDialogPortalProps>(
  function AlertDialogPortal(props, ref) {
    return <BaseAlertDialog.Portal ref={ref} {...props} data-slot="portal" />;
  },
);

export interface AlertDialogBackdropState {
  open: boolean;
  transitionStatus: "starting" | "ending" | "idle" | undefined;
}
export interface AlertDialogBackdropProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<AlertDialogBackdropState>;
  forceRender?: boolean;
  render?: NerioRenderProp<AlertDialogBackdropState>;
  style?: NerioStyle<AlertDialogBackdropState>;
}

export const AlertDialogBackdrop = React.forwardRef<HTMLDivElement, AlertDialogBackdropProps>(
  function AlertDialogBackdrop({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Backdrop
        ref={ref}
        {...props}
        className={withClassName(className, dialogBackdropClasses)}
        data-slot="backdrop"
      />
    );
  },
);

export interface AlertDialogContentState {
  open: boolean;
  transitionStatus: "starting" | "ending" | "idle" | undefined;
  nested: boolean;
  nestedDialogOpen: boolean;
}
export interface AlertDialogContentProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "color" | "style"
> {
  children: React.ReactNode;
  className?: NerioClassName<AlertDialogContentState>;
  finalFocus?: DialogFocusTarget;
  initialFocus?: DialogFocusTarget;
  render?: NerioRenderProp<AlertDialogContentState>;
  style?: NerioStyle<AlertDialogContentState>;
}

export const AlertDialogContent = React.forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ className, ...props }, ref) {
    return (
      <BaseAlertDialog.Popup
        ref={ref}
        {...props}
        className={withClassName(className, cn(dialogContentClasses, "n-alert-dialog"))}
        data-slot="content"
      />
    );
  },
);

export type AlertDialogTitleElement = DialogTitleElement;
export interface AlertDialogTitleProps extends React.HTMLAttributes<HTMLElement> {
  as?: AlertDialogTitleElement;
}

export const AlertDialogTitle = React.forwardRef<HTMLElement, AlertDialogTitleProps>(
  function AlertDialogTitle({ as: Component = "div", className, ...props }, ref) {
    return (
      <BaseAlertDialog.Title
        {...props}
        className={cn(dialogTitleClasses, className)}
        data-slot="title"
        render={<Component ref={ref as React.Ref<never>} />}
      />
    );
  },
);

export const AlertDialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function AlertDialogDescription({ className, ...props }, ref) {
  return (
    <BaseAlertDialog.Description
      ref={ref}
      {...props}
      className={cn(dialogDescriptionClasses, className)}
      data-slot="description"
    />
  );
});

export const AlertDialogHeader = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"header">
>(function AlertDialogHeader({ className, ...props }, ref) {
  return (
    <DialogHeader
      ref={ref}
      {...props}
      className={cn("flex-col justify-start gap-(--n-dialog-header-gap)", className)}
    />
  );
});
export const AlertDialogBody = DialogBody;
export const AlertDialogFooter = DialogFooter;

export interface AlertDialogActionState {
  disabled: boolean;
}
export interface AlertDialogActionProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<AlertDialogActionState>;
  nativeButton?: boolean;
  render?: NerioRenderProp<AlertDialogActionState>;
  style?: NerioStyle<AlertDialogActionState>;
}

function createAlertDialogAction(slot: "action" | "cancel") {
  return React.forwardRef<HTMLButtonElement, AlertDialogActionProps>(function AlertDialogAction(
    { className, nativeButton, type, ...props },
    ref,
  ) {
    return (
      <BaseAlertDialog.Close
        ref={ref}
        {...props}
        className={className}
        data-slot={slot}
        nativeButton={nativeButton}
        type={nativeButton !== false ? (type ?? "button") : undefined}
      />
    );
  });
}

export const AlertDialogCancel = createAlertDialogAction("cancel");
export const AlertDialogAction = createAlertDialogAction("action");
