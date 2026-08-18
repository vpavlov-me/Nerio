"use client";

import * as React from "react";
import { PanelLeft } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { Button, type ButtonProps } from "./button";
import { Icon } from "./icon";
import { Tooltip } from "./tooltip";

export type SidebarSide = "left" | "right";
export type SidebarDirection = "ltr" | "rtl";
export type SidebarCollapseMode = "hidden" | "icons";

type SidebarContextValue = {
  collapseMode: SidebarCollapseMode;
  direction: SidebarDirection;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  side: SidebarSide;
  sidebarId: string;
  toggle: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);
const SIDEBAR_TOOLTIP_SIDE_OFFSET = 14;

export interface SidebarProviderProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "dir" | "onChange"
> {
  children: React.ReactNode;
  collapseMode?: SidebarCollapseMode;
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
  collapseMode = "hidden",
  defaultExpanded = true,
  direction,
  expanded: controlledExpanded,
  onExpandedChange,
  side = "left",
  sidebarId: providedSidebarId,
  ...props
}: SidebarProviderProps) {
  const providerRef = React.useRef<HTMLDivElement>(null);
  const [inheritedDirection, setInheritedDirection] = React.useState<SidebarDirection>("ltr");
  const resolvedDirection = direction ?? inheritedDirection;
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
  React.useEffect(() => {
    if (direction) return undefined;

    const updateDirection = () => {
      const directionOwner = providerRef.current?.closest<HTMLElement>("[dir]");
      setInheritedDirection(directionOwner?.dir === "rtl" ? "rtl" : "ltr");
    };
    updateDirection();
    const observer = new MutationObserver(updateDirection);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
      subtree: true,
    });
    return () => observer.disconnect();
  }, [direction]);
  const value = React.useMemo(
    () => ({
      collapseMode,
      direction: resolvedDirection,
      expanded,
      setExpanded,
      side,
      sidebarId,
      toggle,
    }),
    [collapseMode, resolvedDirection, expanded, setExpanded, side, sidebarId, toggle],
  );

  return (
    <SidebarContext.Provider value={value}>
      <div
        ref={providerRef}
        {...props}
        className={cn(
          "n-sidebar-provider flex min-h-full w-full data-[side=right]:flex-row-reverse data-[state=collapsed]:[&>.n-sidebar]:w-(--n-sidebar-collapsed-width) data-[state=collapsed]:[&>.n-sidebar]:basis-(--n-sidebar-collapsed-width)",
          className,
        )}
        dir={direction}
        data-direction={resolvedDirection}
        data-collapse-mode={collapseMode}
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

type SidebarMenuButtonBaseProps<T> = T extends unknown ? Omit<T, "tooltip"> : never;

export type SidebarMenuButtonProps = SidebarMenuButtonBaseProps<ButtonProps> & {
  collapsedTooltip: React.ReactNode;
};

export const SidebarMenuButton = React.forwardRef<HTMLElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ className, collapsedTooltip, ...props }, ref) {
    const { collapseMode, expanded, side } = useSidebar();
    const button = (
      <Button
        ref={ref}
        {...props}
        className={cn(
          "n-sidebar-menu-button [&_.n-icon]:size-(--n-sidebar-item-icon-size)",
          className,
        )}
        data-slot="sidebar-menu-button"
        tooltip={false}
      />
    );
    return expanded || collapseMode === "hidden" ? (
      button
    ) : (
      <Tooltip
        delay={0}
        label={collapsedTooltip}
        showArrow={false}
        side={side === "left" ? "right" : "left"}
        sideOffset={SIDEBAR_TOOLTIP_SIDE_OFFSET}
      >
        {button}
      </Tooltip>
    );
  },
);

export type SidebarProps = React.HTMLAttributes<HTMLElement>;

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { children, className, ...props },
  ref,
) {
  const { collapseMode, direction, expanded, side, sidebarId } = useSidebar();
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
        "n-sidebar group/sidebar sticky top-0 h-dvh min-h-80 w-(--n-sidebar-width) max-w-dvw flex-[0_0_var(--n-sidebar-width)] border-r-(length:--n-sidebar-border-width) border-(--n-sidebar-border) bg-(--n-sidebar-background) pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] text-(--n-sidebar-foreground) transition-[width,flex-basis] duration-(--n-sidebar-transition-duration) ease-(--n-sidebar-transition-easing) data-[side=right]:border-r-0 data-[side=right]:border-l-(length:--n-sidebar-border-width) data-[state=collapsed]:w-(--n-sidebar-collapsed-width) data-[state=collapsed]:basis-(--n-sidebar-collapsed-width) motion-reduce:duration-[0.01ms] forced-colors:border-[CanvasText]",
        className,
      )}
      data-direction={direction}
      data-collapse-mode={collapseMode}
      data-side={side}
      data-slot="sidebar"
      data-state={expanded ? "expanded" : "collapsed"}
    >
      <div
        className={cn(
          "n-sidebar__inner grid h-full grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden data-[has-rail=true]:[&:has([data-slot=sidebar-footer])_[data-slot=sidebar-footer]]:pb-[calc(var(--n-sidebar-region-padding)+var(--n-sidebar-rail-hit-area)+var(--n-sidebar-rail-inset))] data-[has-rail=true]:[&:not(:has([data-slot=sidebar-footer]))_[data-slot=sidebar-content]]:pb-[calc(var(--n-sidebar-region-padding)+var(--n-sidebar-rail-hit-area)+var(--n-sidebar-rail-inset))]",
          collapseMode === "hidden"
            ? "w-(--n-sidebar-width) opacity-100 transition-opacity duration-(--n-sidebar-transition-duration) ease-(--n-sidebar-transition-easing) [[data-state=collapsed]_&]:pointer-events-none [[data-state=collapsed]_&]:invisible [[data-state=collapsed]_&]:opacity-0 motion-reduce:duration-[0.01ms]"
            : "w-full [[data-state=collapsed]_&]:[&_[data-slot=sidebar-header]]:p-[calc((var(--n-sidebar-collapsed-width)-var(--n-sidebar-rail-hit-area))/2)] [[data-state=collapsed]_&]:[&_[data-slot=sidebar-content]]:overflow-x-hidden [[data-state=collapsed]_&]:[&_[data-slot=sidebar-content]]:px-[calc((var(--n-sidebar-collapsed-width)-var(--n-sidebar-rail-hit-area))/2)] [[data-state=collapsed]_&]:[&_[data-slot=sidebar-footer]]:px-[calc((var(--n-sidebar-collapsed-width)-var(--n-sidebar-rail-hit-area))/2)] [[data-state=collapsed]_&]:[&_[data-slot=sidebar-footer]]:pt-[calc((var(--n-sidebar-collapsed-width)-var(--n-sidebar-rail-hit-area))/2)] [[data-state=collapsed]_&]:[&_.n-button]:w-(--n-sidebar-rail-hit-area) [[data-state=collapsed]_&]:[&_.n-button]:gap-0 [[data-state=collapsed]_&]:[&_.n-button]:overflow-hidden [[data-state=collapsed]_&]:[&_.n-button]:px-0 [[data-state=collapsed]_&]:[&_[data-slot=button-label]]:w-0 [[data-state=collapsed]_&]:[&_[data-slot=button-label]]:overflow-hidden [[data-state=collapsed]_&]:[&_[data-slot=button-label]]:opacity-0 [[data-state=collapsed]_&]:[&_[data-slot=button-badge]]:hidden [[data-state=collapsed]_&]:[&_[data-slot=button-kbd]]:hidden [[data-state=collapsed]_&]:[&_[data-slot=sidebar-header]_strong]:hidden [[data-state=collapsed]_&]:[&_[data-slot=sidebar-header]_small]:hidden [[data-state=collapsed]_&]:[&_[data-slot=sidebar-footer]>:not(.n-button)]:hidden",
        )}
        data-has-rail={rails.length > 0 ? "true" : undefined}
        data-slot="sidebar-inner"
        inert={!expanded && collapseMode === "hidden" ? true : undefined}
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

export interface SidebarRailProps extends SidebarToggleProps {
  collapseLabel?: string;
  expandLabel?: string;
}

export const SidebarRail = React.forwardRef<HTMLButtonElement, SidebarRailProps>(
  function SidebarRail({ className, collapseLabel, expandLabel, ...props }, ref) {
    const { expanded, side } = useSidebar();
    const stateLabel = expanded ? (collapseLabel ?? props.label) : (expandLabel ?? props.label);
    const control = (
      <SidebarToggle
        ref={ref}
        {...props}
        label={stateLabel}
        className={cn(
          "n-sidebar-rail absolute right-[calc(var(--n-sidebar-region-padding)+env(safe-area-inset-right))] bottom-[calc(var(--n-sidebar-region-padding)+env(safe-area-inset-bottom))] left-[calc(var(--n-sidebar-region-padding)+env(safe-area-inset-left))] z-1 inline-flex h-(--n-sidebar-rail-hit-area) cursor-pointer appearance-none items-center justify-start gap-(--n-button-gap) rounded-(--n-sidebar-control-radius) border-0 bg-(--n-sidebar-control-background) px-(--n-button-padding-inline-sm) font-inherit text-(length:--n-button-font-size) text-(--n-sidebar-control-foreground) hover:bg-(--n-sidebar-control-background-hover) hover:text-(--n-color-text-primary) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) [&_.n-icon]:size-(--n-sidebar-item-icon-size) group-data-[state=collapsed]/sidebar:right-auto group-data-[state=collapsed]/sidebar:left-1/2 group-data-[state=collapsed]/sidebar:size-(--n-sidebar-rail-hit-area) group-data-[state=collapsed]/sidebar:-translate-x-1/2 group-data-[state=collapsed]/sidebar:justify-center group-data-[state=collapsed]/sidebar:px-0 group-data-[state=collapsed]/sidebar:[&_[data-slot=sidebar-rail-label]]:hidden forced-colors:border forced-colors:border-[ButtonText]",
          motionClasses.hover,
          className,
        )}
        data-slot="sidebar-rail"
      >
        <Icon icon={PanelLeft} />
        <span data-slot="sidebar-rail-label">{stateLabel}</span>
      </SidebarToggle>
    );
    return (
      <Tooltip
        delay={0}
        disabled={expanded}
        label={stateLabel}
        showArrow={false}
        side={side === "left" ? "right" : "left"}
        sideOffset={SIDEBAR_TOOLTIP_SIDE_OFFSET}
      >
        {control}
      </Tooltip>
    );
  },
);
