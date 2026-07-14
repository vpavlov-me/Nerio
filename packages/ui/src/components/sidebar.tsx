"use client";

import * as React from "react";
import { PanelLeft } from "@nerio/adapters/icons";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

export type SidebarSide = "left" | "right";
export type SidebarDirection = "ltr" | "rtl";

type SidebarContextValue = {
  direction: SidebarDirection;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  side: SidebarSide;
  sidebarId: string;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export interface SidebarProviderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "dir" | "onChange"
> {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  direction?: SidebarDirection;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  side?: SidebarSide;
  sidebarId?: string;
}

export function SidebarProvider({
  children,
  className,
  defaultExpanded = true,
  direction = "ltr",
  expanded: controlledExpanded,
  onExpandedChange,
  side = "left",
  sidebarId: providedSidebarId,
  ...props
}: SidebarProviderProps) {
  const generatedId = React.useId();
  const sidebarId = providedSidebarId ?? `nerio-sidebar-${generatedId.replace(/:/g, "")}`;
  const [uncontrolledExpanded, setUncontrolledExpanded] = React.useState(defaultExpanded);
  const expanded = controlledExpanded ?? uncontrolledExpanded;
  const setExpanded = React.useCallback(
    (nextExpanded: boolean) => {
      if (controlledExpanded === undefined) setUncontrolledExpanded(nextExpanded);
      onExpandedChange?.(nextExpanded);
    },
    [controlledExpanded, onExpandedChange],
  );
  const toggle = React.useCallback(() => setExpanded(!expanded), [expanded, setExpanded]);
  const value = React.useMemo(
    () => ({ direction, expanded, setExpanded, side, sidebarId, toggle }),
    [direction, expanded, setExpanded, side, sidebarId, toggle],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        {...props}
        className={cn("n-sidebar-provider", className)}
        data-direction={direction}
        data-side={side}
        data-slot="sidebar-provider"
        data-state={expanded ? "expanded" : "collapsed"}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used inside SidebarProvider.");
  return context;
}

export type SidebarProps = React.HTMLAttributes<HTMLElement>;

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { children, className, ...props },
  ref,
) {
  const { direction, expanded, side, sidebarId } = useSidebar();
  const content: React.ReactNode[] = [];
  const rails: React.ReactNode[] = [];
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === SidebarRail) rails.push(child);
    else content.push(child);
  });

  return (
    <aside
      ref={ref}
      {...props}
      id={sidebarId}
      className={cn("n-sidebar", className)}
      data-direction={direction}
      data-side={side}
      data-slot="sidebar"
      data-state={expanded ? "expanded" : "collapsed"}
    >
      <div className="n-sidebar__inner" data-slot="sidebar-inner" inert={!expanded || undefined}>
        {content}
      </div>
      {rails}
    </aside>
  );
});

export type SidebarToggleProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "aria-controls" | "aria-expanded" | "aria-label" | "children"
> & {
  children?: React.ReactNode;
  label: string;
};

const SidebarToggle = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarToggle({ children, className, label, onClick, ...props }, ref) {
    const { expanded, sidebarId, toggle } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        aria-controls={sidebarId}
        aria-expanded={expanded}
        aria-label={label}
        className={className}
        {...props}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggle();
        }}
      >
        {children ?? <Icon icon={PanelLeft} />}
      </button>
    );
  },
);

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarTrigger({ className, ...props }, ref) {
    return (
      <SidebarToggle
        ref={ref}
        className={cn("n-sidebar-trigger", className)}
        data-slot="sidebar-trigger"
        {...props}
      />
    );
  },
);

export const SidebarRail = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarRail({ className, ...props }, ref) {
    return (
      <SidebarToggle
        ref={ref}
        className={cn("n-sidebar-rail", className)}
        data-slot="sidebar-rail"
        {...props}
      />
    );
  },
);
