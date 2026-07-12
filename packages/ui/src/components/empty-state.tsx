import * as React from "react";
import { cn } from "../lib/cn";

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
      className={cn("n-empty-state", className)}
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
        className={cn("n-empty-state__media", className)}
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
        className={cn("n-empty-state__header", className)}
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
        className={cn("n-empty-state__title", className)}
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
      className={cn("n-empty-state__description", className)}
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
        className={cn("n-empty-state__actions", className)}
        data-slot="empty-state-actions"
        data-orientation={orientation}
      />
    );
  },
);
