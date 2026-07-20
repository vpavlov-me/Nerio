"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { Icon } from "./icon";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

const tabsClasses =
  "n-tabs grid gap-(--n-tabs-gap) data-[orientation=vertical]:grid-cols-[auto_minmax(0,1fr)] data-[orientation=vertical]:items-start data-[size=sm]:[--n-tabs-trigger-height:var(--n-tabs-trigger-height-sm)] data-[size=sm]:[--n-tabs-trigger-padding-inline:var(--n-tabs-trigger-padding-inline-sm)] data-[size=sm]:[--n-tabs-trigger-content-gap:var(--n-tabs-trigger-content-gap-sm)] data-[size=sm]:[--n-tabs-trigger-font-size:var(--n-tabs-trigger-font-size-sm)] data-[size=sm]:[--n-tabs-icon-size:var(--n-tabs-icon-size-sm)] data-[size=md]:[--n-tabs-trigger-height:var(--n-tabs-trigger-height-md)] data-[size=md]:[--n-tabs-trigger-padding-inline:var(--n-tabs-trigger-padding-inline-md)] data-[size=md]:[--n-tabs-trigger-content-gap:var(--n-tabs-trigger-content-gap-md)] data-[size=md]:[--n-tabs-trigger-font-size:var(--n-tabs-trigger-font-size-md)] data-[size=md]:[--n-tabs-icon-size:var(--n-tabs-icon-size-md)] data-[size=lg]:[--n-tabs-trigger-height:var(--n-tabs-trigger-height-lg)] data-[size=lg]:[--n-tabs-trigger-padding-inline:var(--n-tabs-trigger-padding-inline-lg)] data-[size=lg]:[--n-tabs-trigger-content-gap:var(--n-tabs-trigger-content-gap-lg)] data-[size=lg]:[--n-tabs-trigger-font-size:var(--n-tabs-trigger-font-size-lg)] data-[size=lg]:[--n-tabs-icon-size:var(--n-tabs-icon-size-lg)] data-[variant=bordered]:[&>[data-slot=list]]:border-b-(length:--n-border-width-default) data-[variant=bordered]:[&>[data-slot=list]]:border-(--n-tabs-divider-color) data-[orientation=vertical]:data-[variant=bordered]:[&>[data-slot=list]]:border-b-0 data-[orientation=vertical]:data-[variant=bordered]:[&>[data-slot=list]]:border-e-(length:--n-border-width-default) data-[variant=segmented]:[&>[data-slot=list]]:gap-0 data-[variant=segmented]:[&>[data-slot=list]]:rounded-(--n-tabs-list-radius) data-[variant=segmented]:[&>[data-slot=list]]:bg-(--n-tabs-list-background) data-[variant=segmented]:[&>[data-slot=list]]:p-(--n-tabs-list-padding)";
const tabsListClasses =
  "n-tabs__list relative flex min-w-0 items-center gap-(--n-tabs-list-gap) data-scrollable:overflow-x-auto data-scrollable:overflow-y-hidden data-scrollable:overscroll-x-contain data-scrollable:[scrollbar-width:none] data-scrollable:[scroll-padding-inline:var(--n-tabs-trigger-padding-inline)] data-scrollable:[&::-webkit-scrollbar]:hidden [[data-orientation=vertical]_&]:w-fit [[data-orientation=vertical]_&]:flex-col [[data-orientation=vertical]_&]:items-start [[data-orientation=vertical]_&]:self-start [[data-orientation=vertical]_&[data-scrollable]]:overflow-visible [&[data-layout=fill]>[data-slot=trigger]]:flex-1 [[data-orientation=vertical]_&[data-layout=fill]>[data-slot=trigger]]:w-full [[data-orientation=vertical]_&[data-layout=fill]>[data-slot=trigger]]:flex-none [[data-orientation=vertical]_&[data-layout=fill]>[data-slot=trigger]]:self-stretch";
const tabsTriggerClasses =
  "n-tabs__trigger relative z-1 inline-flex min-h-(--n-tabs-trigger-height) flex-none cursor-pointer select-none items-center justify-center gap-(--n-tabs-trigger-content-gap) whitespace-nowrap rounded-(--n-tabs-radius) border-0 bg-transparent px-(--n-tabs-trigger-padding-inline) font-inherit text-(length:--n-tabs-trigger-font-size) font-(--n-font-weight-medium) text-(--n-tabs-foreground) data-active:text-(--n-tabs-foreground-active) data-disabled:cursor-not-allowed data-disabled:text-(--n-tabs-foreground-disabled) hover:not-data-active:not-data-disabled:text-(--n-tabs-foreground-hover) focus-visible:z-2 focus-visible:outline-0 focus-visible:shadow-[inset_0_0_0_var(--n-focus-ring-inner-width)_var(--n-color-focus-offset),inset_0_0_0_var(--n-focus-ring-outer-width)_var(--n-color-focus-ring-soft)] [[data-variant=bordered]_&]:pb-(--n-tabs-indicator-thickness) [[data-variant=segmented]_&]:rounded-(--n-tabs-segmented-indicator-radius) [&_[data-slot=leading-icon]]:inline-flex [&_[data-slot=leading-icon]]:flex-none [&_[data-slot=trailing-icon]]:inline-flex [&_[data-slot=trailing-icon]]:flex-none [&_[data-slot=badge]]:inline-flex [&_[data-slot=badge]]:flex-none [&_.n-icon]:size-(--n-tabs-icon-size) forced-colors:focus-visible:outline-(length:--n-focus-ring-inner-width) forced-colors:focus-visible:-outline-offset-(--n-focus-ring-inner-width) forced-colors:focus-visible:outline-[Highlight]";
const tabsIndicatorClasses =
  "n-tabs__indicator pointer-events-none absolute bottom-0 left-(--active-tab-left) z-0 w-(--active-tab-width) rounded-(--n-tabs-radius) border-(length:--n-border-width-default) border-(--n-tabs-indicator-border-color) bg-(--n-tabs-indicator-background) transition-[left,width,top,height] duration-(--n-tabs-indicator-duration) ease-(--n-tabs-indicator-easing) [[data-variant=bordered]_&]:-bottom-(--n-border-width-default) [[data-variant=bordered]_&]:h-(--n-tabs-indicator-thickness) [[data-variant=bordered]_&]:rounded-t-(--n-radius-pill) [[data-variant=bordered]_&]:rounded-b-none [[data-variant=bordered]_&]:border-0 [[data-variant=bordered]_&]:bg-(--n-tabs-accent-color) [[data-variant=separate]_&]:top-(--active-tab-top) [[data-variant=separate]_&]:h-(--active-tab-height) [[data-variant=segmented]_&]:top-(--active-tab-top) [[data-variant=segmented]_&]:h-(--active-tab-height) [[data-variant=segmented]_&]:rounded-(--n-tabs-segmented-indicator-radius) [[data-variant=segmented]_&]:shadow-(--n-tabs-indicator-shadow) [[data-orientation=vertical]_&]:top-(--active-tab-top) [[data-orientation=vertical]_&]:right-[calc(var(--n-border-width-default)*-1)] [[data-orientation=vertical]_&]:bottom-auto [[data-orientation=vertical]_&]:left-auto [[data-orientation=vertical]_&]:h-(--active-tab-height) [[data-orientation=vertical]_&]:w-(--n-tabs-indicator-thickness) [[data-orientation=vertical][data-variant=bordered]_&]:rounded-l-(--n-radius-pill) [[data-orientation=vertical][data-variant=bordered]_&]:rounded-r-none [[data-orientation=vertical][data-variant=separate]_&]:inset-x-0 [[data-orientation=vertical][data-variant=separate]_&]:w-full [[data-orientation=vertical][data-variant=segmented]_&]:inset-x-0 [[data-orientation=vertical][data-variant=segmented]_&]:w-full motion-reduce:duration-[1ms] forced-colors:border-[Highlight] forced-colors:bg-[Highlight]";

export type TabsVariant = "segmented" | "separate" | "bordered";
export type TabsSize = "sm" | "md" | "lg";
export type TabsListLayout = "content" | "fill";

type BaseClassName<State> = string | ((state: State) => string | undefined) | undefined;

function withClassName<State>(className: BaseClassName<State>, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

type AccessibleNodeProps = {
  children?: React.ReactNode;
  "aria-hidden"?: boolean | "true";
  "aria-label"?: string;
};

function getAccessibleText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getAccessibleText).filter(Boolean).join(" ");
  }

  if (React.isValidElement<AccessibleNodeProps>(node)) {
    if (node.props["aria-hidden"] === true || node.props["aria-hidden"] === "true") {
      return "";
    }

    return node.props["aria-label"] ?? getAccessibleText(node.props.children);
  }

  return "";
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
      className={withClassName(className, tabsClasses)}
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

function moveFocusPastDisabledTab(event: React.KeyboardEvent<HTMLDivElement>, loopFocus: boolean) {
  const list = event.currentTarget;
  const orientation = list.getAttribute("data-orientation");
  const isVertical = orientation === "vertical";
  const direction = list.closest("[dir]")?.getAttribute("dir") ?? document.dir;
  const key = event.key;
  const movesForward =
    (isVertical && key === "ArrowDown") ||
    (!isVertical && key === (direction === "rtl" ? "ArrowLeft" : "ArrowRight"));
  const movesBackward =
    (isVertical && key === "ArrowUp") ||
    (!isVertical && key === (direction === "rtl" ? "ArrowRight" : "ArrowLeft"));

  if (!movesForward && !movesBackward && key !== "Home" && key !== "End") {
    return;
  }

  const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]'));
  const currentIndex = tabs.indexOf(document.activeElement as HTMLElement);
  if (currentIndex < 0) {
    return;
  }

  const enabledTabs = tabs.filter(
    (tab) => tab.getAttribute("aria-disabled") !== "true" && !tab.hasAttribute("data-disabled"),
  );
  if (enabledTabs.length === tabs.length) {
    return;
  }

  const target =
    key === "Home"
      ? enabledTabs[0]
      : key === "End"
        ? enabledTabs.at(-1)
        : (() => {
            const step = movesForward ? 1 : -1;
            for (let offset = 1; offset < tabs.length; offset += 1) {
              const candidateIndex = currentIndex + step * offset;
              if (!loopFocus && (candidateIndex < 0 || candidateIndex >= tabs.length)) {
                return undefined;
              }
              const candidate = tabs[(candidateIndex + tabs.length) % tabs.length];
              if (candidate && enabledTabs.includes(candidate)) {
                return candidate;
              }
            }
            return undefined;
          })();

  const immediateTarget =
    key === "Home" || key === "End"
      ? document.activeElement
      : tabs[(currentIndex + (movesForward ? 1 : -1) + tabs.length) % tabs.length];

  if (target && target !== immediateTarget) {
    event.preventDefault();
    event.stopPropagation();
    target.focus();
  }
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  {
    className,
    layout = "content",
    loopFocus = true,
    onKeyDownCapture,
    scrollable = true,
    ...props
  },
  ref,
) {
  return (
    <BaseTabs.List
      ref={ref}
      {...props}
      className={withClassName(className, tabsListClasses)}
      data-layout={layout}
      data-scrollable={scrollable || undefined}
      data-slot="list"
      loopFocus={loopFocus}
      onKeyDownCapture={(event) => {
        onKeyDownCapture?.(event);
        if (!event.defaultPrevented) {
          moveFocusPastDisabledTab(event, loopFocus);
        }
      }}
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
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    badge,
    children,
    className,
    leadingIcon,
    trailingIcon,
    ...props
  },
  ref,
) {
  const accessibleName = badge
    ? [getAccessibleText(children), getAccessibleText(badge)].filter(Boolean).join(" ").trim() ||
      undefined
    : undefined;

  return (
    <BaseTabs.Tab
      ref={ref}
      {...props}
      aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : accessibleName)}
      aria-labelledby={ariaLabelledBy}
      className={withClassName(className, cn(tabsTriggerClasses, motionClasses.hover))}
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
        className={withClassName(className, tabsIndicatorClasses)}
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
    <div
      ref={ref}
      {...props}
      className={cn("n-tabs__panels grid min-w-0 gap-(--n-tabs-content-gap)", className)}
      data-slot="panels"
    />
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
      className={withClassName(
        className,
        "n-tabs__content col-start-1 row-start-1 min-w-0 text-(--n-tabs-foreground) transition-[opacity,translate] duration-(--n-tabs-content-duration) ease-(--n-tabs-content-easing) data-starting-style:opacity-0 data-ending-style:opacity-0 data-[activation-direction=left]:data-starting-style:-translate-x-(--n-tabs-content-translate) data-[activation-direction=right]:data-ending-style:-translate-x-(--n-tabs-content-translate) data-[activation-direction=right]:data-starting-style:translate-x-(--n-tabs-content-translate) data-[activation-direction=left]:data-ending-style:translate-x-(--n-tabs-content-translate) data-[activation-direction=up]:data-starting-style:-translate-y-(--n-tabs-content-translate) data-[activation-direction=down]:data-ending-style:-translate-y-(--n-tabs-content-translate) data-[activation-direction=down]:data-starting-style:translate-y-(--n-tabs-content-translate) data-[activation-direction=up]:data-ending-style:translate-y-(--n-tabs-content-translate) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) motion-reduce:duration-[1ms] motion-reduce:data-starting-style:translate-none motion-reduce:data-starting-style:opacity-100 motion-reduce:data-ending-style:translate-none motion-reduce:data-ending-style:opacity-100",
      )}
      data-slot="content"
    />
  );
});
