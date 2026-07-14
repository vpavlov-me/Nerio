import * as React from "react";
import { cn } from "../lib/cn";
import { composeRefs } from "../lib/compose-refs";

export type SidebarRegionProps = React.HTMLAttributes<HTMLElement>;
export type SidebarContentProps = React.HTMLAttributes<HTMLDivElement>;

export const SidebarHeader = React.forwardRef<HTMLElement, SidebarRegionProps>(
  function SidebarHeader({ className, ...props }, ref) {
    return (
      <header
        ref={ref}
        className={cn("n-sidebar__header", className)}
        data-slot="sidebar-header"
        {...props}
      />
    );
  },
);

export const SidebarContent = React.forwardRef<HTMLDivElement, SidebarContentProps>(
  function SidebarContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn("n-sidebar__content", className)}
        data-slot="sidebar-content"
        {...props}
      />
    );
  },
);

export const SidebarFooter = React.forwardRef<HTMLElement, SidebarRegionProps>(
  function SidebarFooter({ className, ...props }, ref) {
    return (
      <footer
        ref={ref}
        className={cn("n-sidebar__footer", className)}
        data-slot="sidebar-footer"
        {...props}
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
      className={cn("n-sidebar-inset", className)}
      data-slot="sidebar-inset"
      {...props}
    />
  );
});
