"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Icon, type IconComponent } from "./icon";
import { cn } from "../lib/cn";

export type TabsVariant = "segmented" | "separate" | "bordered";
export type TabsSize = "sm" | "md" | "lg";
export type TabsListLayout = "content" | "fill";

type BaseClassName<State> = string | ((state: State) => string | undefined) | undefined;

function withClassName<State>(className: BaseClassName<State>, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

export type TabsProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Root> & {
  variant?: TabsVariant;
  size?: TabsSize;
};

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { className, orientation = "horizontal", size = "md", variant = "bordered", ...props },
  ref,
) {
  return (
    <BaseTabs.Root
      ref={ref}
      {...props}
      className={withClassName(className, "n-tabs")}
      data-slot="root"
      data-size={size}
      data-variant={variant}
      orientation={orientation}
    />
  );
});

export type TabsListProps = React.ComponentPropsWithoutRef<typeof BaseTabs.List> & {
  layout?: TabsListLayout;
  scrollable?: boolean;
};

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, layout = "content", scrollable = true, ...props },
  ref,
) {
  return (
    <BaseTabs.List
      ref={ref}
      {...props}
      className={withClassName(className, "n-tabs__list")}
      data-layout={layout}
      data-scrollable={scrollable || undefined}
      data-slot="list"
    />
  );
});

export type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Tab> & {
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  badge?: React.ReactNode;
  children: React.ReactNode;
};

export const TabsTrigger = React.forwardRef<HTMLElement, TabsTriggerProps>(function TabsTrigger(
  { badge, children, className, leadingIcon, trailingIcon, ...props },
  ref,
) {
  return (
    <BaseTabs.Tab
      ref={ref}
      {...props}
      className={withClassName(className, "n-tabs__trigger")}
      data-slot="trigger"
    >
      {leadingIcon ? (
        <span aria-hidden data-slot="leading-icon">
          <Icon icon={leadingIcon} />
        </span>
      ) : null}
      <span data-slot="label">{children}</span>
      {badge ? <span data-slot="badge">{badge}</span> : null}
      {trailingIcon ? (
        <span aria-hidden data-slot="trailing-icon">
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </BaseTabs.Tab>
  );
});

export type TabsIndicatorProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Indicator>;

export const TabsIndicator = React.forwardRef<HTMLSpanElement, TabsIndicatorProps>(
  function TabsIndicator({ className, renderBeforeHydration = true, ...props }, ref) {
    return (
      <BaseTabs.Indicator
        ref={ref}
        {...props}
        aria-hidden="true"
        className={withClassName(className, "n-tabs__indicator")}
        data-slot="indicator"
        renderBeforeHydration={renderBeforeHydration}
      />
    );
  },
);

export type TabsPanelsProps = React.HTMLAttributes<HTMLDivElement>;

export const TabsPanels = React.forwardRef<HTMLDivElement, TabsPanelsProps>(function TabsPanels(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} {...props} className={cn("n-tabs__panels", className)} data-slot="panels" />
  );
});

export type TabsContentProps = React.ComponentPropsWithoutRef<typeof BaseTabs.Panel>;

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { className, ...props },
  ref,
) {
  return (
    <BaseTabs.Panel
      ref={ref}
      {...props}
      className={withClassName(className, "n-tabs__content")}
      data-slot="content"
    />
  );
});
