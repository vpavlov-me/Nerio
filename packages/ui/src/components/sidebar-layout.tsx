import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { composeRefs } from "../lib/compose-refs";

export type SidebarRegionProps = React.HTMLAttributes<HTMLElement>;
export type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>;

export const SidebarHeader = React.forwardRef<HTMLElement, SidebarRegionProps>(
  function SidebarHeader({ className, ...props }, ref) {
    return (
      <header
        ref={ref}
        {...props}
        className={cn(
          "n-sidebar__header p-(--n-sidebar-region-padding) [[data-side=left]_&]:ps-[max(var(--n-sidebar-region-padding),env(safe-area-inset-left))] [[data-side=right]_&]:pe-[max(var(--n-sidebar-region-padding),env(safe-area-inset-right))]",
          className,
        )}
        data-slot="sidebar-header"
      />
    );
  },
);

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  function SidebarContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "n-sidebar__content min-h-0 overflow-auto overscroll-contain px-(--n-sidebar-region-padding) [[data-side=left]_&]:ps-[max(var(--n-sidebar-region-padding),env(safe-area-inset-left))] [[data-side=right]_&]:pe-[max(var(--n-sidebar-region-padding),env(safe-area-inset-right))]",
          className,
        )}
        data-slot="sidebar-content"
      />
    );
  },
);

export const SidebarFooter = React.forwardRef<HTMLElement, SidebarRegionProps>(
  function SidebarFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        {...props}
        className={cn(
          "n-sidebar__footer p-(--n-sidebar-region-padding) [[data-side=left]_&]:ps-[max(var(--n-sidebar-region-padding),env(safe-area-inset-left))] [[data-side=right]_&]:pe-[max(var(--n-sidebar-region-padding),env(safe-area-inset-right))]",
          className,
        )}
        data-slot="sidebar-footer"
      />
    );
  },
);

export interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {
  as?: "div" | "main";
}

export const SidebarInset = React.forwardRef<HTMLElement, SidebarInsetProps>(function SidebarInset(
  { as: Component = "main", className, ...props },
  ref,
) {
  const composedRef = React.useMemo(() => composeRefs(ref), [ref]);
  return (
    <Component
      ref={composedRef}
      {...props}
      className={cn("n-sidebar-inset min-w-0 flex-[1_1_auto] p-(--n-sidebar-inset-gap)", className)}
      data-slot="sidebar-inset"
    />
  );
});
