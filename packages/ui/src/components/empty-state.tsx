import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const emptyStateClasses =
  "n-empty-state grid items-center justify-items-center gap-(--n-empty-state-gap) text-center text-(--n-color-text-secondary) data-[size=sm]:[--n-empty-state-gap:var(--n-space-2)] data-[size=sm]:[--n-empty-state-mark-size:var(--n-size-control-sm)] data-[size=sm]:[--n-empty-state-mark-icon-size:var(--n-icon-size-sm)] data-[size=lg]:[--n-empty-state-gap:var(--n-empty-state-gap-lg)] data-[size=lg]:[--n-empty-state-mark-size:var(--n-size-control-lg)] data-[size=lg]:[--n-empty-state-mark-icon-size:var(--n-icon-size-lg)] data-[align=start]:items-start data-[align=start]:justify-items-start data-[align=start]:text-start data-[align=start]:[&>[data-slot=empty-state-actions]]:justify-start";

export type EmptyStateSize = "sm" | "md" | "lg";
export type EmptyStateAlign = "start" | "center";
export type EmptyStateMediaVariant = "icon" | "illustration";
export type EmptyStateActionsOrientation = "horizontal" | "vertical";
export type EmptyStateTitleElement = "h2" | "h3" | "h4" | "h5" | "h6";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: EmptyStateSize;
  align?: EmptyStateAlign;
}

export interface EmptyStateMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: EmptyStateMediaVariant;
}

export type EmptyStateHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export interface EmptyStateTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: EmptyStateTitleElement;
}

export type EmptyStateDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export interface EmptyStateActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: EmptyStateActionsOrientation;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { align = "center", className, size = "md", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(emptyStateClasses, className)}
      data-slot="empty-state"
      data-size={size}
      data-align={align}
    />
  );
});

export const EmptyStateMedia = React.forwardRef<HTMLDivElement, EmptyStateMediaProps>(
  function EmptyStateMedia({ className, variant = "icon", ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "n-empty-state__media inline-flex items-center justify-center data-[variant=icon]:size-(--n-empty-state-mark-size) data-[variant=icon]:rounded-(--n-empty-state-mark-radius) data-[variant=icon]:bg-(--n-empty-state-mark-background) data-[variant=icon]:text-(length:--n-empty-state-mark-icon-size) data-[variant=icon]:text-(--n-empty-state-mark-foreground) data-[variant=illustration]:max-w-full forced-colors:data-[variant=icon]:border-(length:--n-border-width-default) forced-colors:data-[variant=icon]:border-[CanvasText]",
          className,
        )}
        data-slot="empty-state-media"
        data-variant={variant}
      />
    );
  },
);

export const EmptyStateHeader = React.forwardRef<HTMLDivElement, EmptyStateHeaderProps>(
  function EmptyStateHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "n-empty-state__header grid max-w-(--n-size-empty-state-max) gap-(--n-space-1)",
          className,
        )}
        data-slot="empty-state-header"
      />
    );
  },
);

export const EmptyStateTitle = React.forwardRef<HTMLHeadingElement, EmptyStateTitleProps>(
  function EmptyStateTitle({ as: Component = "h3", className, ...props }, ref) {
    return (
      <Component
        ref={ref as React.Ref<never>}
        {...props}
        className={cn(
          "n-empty-state__title m-0 text-(length:--n-font-size-lg) text-(--n-color-text-primary) [[data-size=sm]_&]:text-(length:--n-font-size-md) [[data-size=lg]_&]:text-(length:--n-font-size-xl)",
          className,
        )}
        data-slot="empty-state-title"
      />
    );
  },
);

export const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyStateDescriptionProps
>(function EmptyStateDescription({ className, ...props }, ref) {
  return (
    <p
      ref={ref}
      {...props}
      className={cn("n-empty-state__description m-0", className)}
      data-slot="empty-state-description"
    />
  );
});

export const EmptyStateActions = React.forwardRef<HTMLDivElement, EmptyStateActionsProps>(
  function EmptyStateActions({ className, orientation = "horizontal", ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "n-empty-state__actions flex flex-wrap items-center justify-center gap-(--n-space-2) data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch max-[30rem]:w-full max-[30rem]:flex-col max-[30rem]:items-stretch",
          className,
        )}
        data-slot="empty-state-actions"
        data-orientation={orientation}
      />
    );
  },
);
