"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { Icon } from "./icon";
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
      className={withClassName(className, "n-tabs__list")}
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
