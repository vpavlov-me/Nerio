import * as React from "react";
import { cn } from "../lib/cn";

export type SidebarRegionProps = React.HTMLAttributes<HTMLElement>;

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

export const SidebarContent = React.forwardRef<HTMLElement, SidebarRegionProps>(
  function SidebarContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref as React.ForwardedRef<HTMLDivElement>}
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
  const setRef = (node: HTMLElement | null) => {
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };
  return (
    <Component
      ref={setRef}
      className={cn("n-sidebar-inset", className)}
      data-slot="sidebar-inset"
      {...props}
    />
  );
});
