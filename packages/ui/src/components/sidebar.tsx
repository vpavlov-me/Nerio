"use client";

import * as React from "react";
import { PanelLeft } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
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
        className={cn(
          "n-sidebar-provider flex min-h-full w-full [direction:ltr] data-[side=right]:flex-row-reverse data-[direction=rtl]:[&>*]:[direction:rtl] data-[state=collapsed]:[&>.n-sidebar]:w-(--n-sidebar-collapsed-width) data-[state=collapsed]:[&>.n-sidebar]:basis-(--n-sidebar-collapsed-width)",
          className,
        )}
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
      className={cn(
        "n-sidebar sticky top-0 h-dvh min-h-80 w-(--n-sidebar-width) max-w-dvw flex-[0_0_var(--n-sidebar-width)] border-r-(length:--n-sidebar-border-width) border-(--n-sidebar-border) bg-(--n-sidebar-background) pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-(--n-sidebar-foreground) transition-[width,flex-basis] duration-(--n-sidebar-transition-duration) ease-(--n-sidebar-transition-easing) data-[side=right]:border-r-0 data-[side=right]:border-l-(length:--n-sidebar-border-width) data-[state=collapsed]:w-(--n-sidebar-collapsed-width) data-[state=collapsed]:basis-(--n-sidebar-collapsed-width) motion-reduce:duration-[0.01ms] forced-colors:border-[CanvasText]",
        className,
      )}
      data-direction={direction}
      data-side={side}
      data-slot="sidebar"
      data-state={expanded ? "expanded" : "collapsed"}
    >
      <div
        className="n-sidebar__inner grid h-full w-(--n-sidebar-width) grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden opacity-100 transition-opacity duration-(--n-sidebar-transition-duration) ease-(--n-sidebar-transition-easing) [[data-state=collapsed]_&]:pointer-events-none [[data-state=collapsed]_&]:invisible [[data-state=collapsed]_&]:opacity-0 motion-reduce:duration-[0.01ms]"
        data-slot="sidebar-inner"
        inert={!expanded || undefined}
      >
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
        {...props}
        aria-controls={sidebarId}
        aria-expanded={expanded}
        aria-label={label}
        className={className}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) toggle();
        }}
        type="button"
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
        {...props}
        className={cn(
          "n-sidebar-trigger inline-flex min-h-(--n-sidebar-rail-hit-area) min-w-(--n-sidebar-rail-hit-area) cursor-pointer appearance-none items-center justify-center rounded-(--n-sidebar-control-radius) border-0 bg-(--n-sidebar-control-background) font-inherit text-(--n-sidebar-control-foreground) hover:bg-(--n-sidebar-control-background-hover) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) forced-colors:border forced-colors:border-[ButtonText]",
          motionClasses.hover,
          className,
        )}
        data-slot="sidebar-trigger"
      />
    );
  },
);

export const SidebarRail = React.forwardRef<HTMLButtonElement, SidebarToggleProps>(
  function SidebarRail({ className, ...props }, ref) {
    return (
      <SidebarToggle
        ref={ref}
        {...props}
        className={cn(
          "n-sidebar-rail absolute top-1/2 right-[calc(-0.5*var(--n-sidebar-rail-hit-area))] z-1 inline-flex size-(--n-sidebar-rail-hit-area) -translate-y-1/2 cursor-pointer appearance-none items-center justify-center rounded-(--n-sidebar-control-radius) border-0 bg-(--n-sidebar-control-background) font-inherit text-(--n-sidebar-control-foreground) hover:bg-(--n-sidebar-control-background-hover) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) [[data-side=right]_&]:right-auto [[data-side=right]_&]:left-[calc(-0.5*var(--n-sidebar-rail-hit-area))] forced-colors:border forced-colors:border-[ButtonText]",
          motionClasses.hover,
          className,
        )}
        data-slot="sidebar-rail"
      />
    );
  },
);
