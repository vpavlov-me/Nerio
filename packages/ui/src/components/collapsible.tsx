"use client";

import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

const rootClasses =
  "n-collapsible box-border w-full overflow-clip rounded-(--n-disclosure-radius) border-(length:--n-disclosure-border-width) border-(--n-disclosure-border) bg-(--n-disclosure-background) text-(--n-disclosure-foreground)";
const triggerClasses =
  "n-collapsible__trigger box-border flex min-h-(--n-disclosure-trigger-min-height) w-full cursor-pointer items-center justify-between gap-(--n-disclosure-trigger-gap) border-0 bg-transparent px-(--n-disclosure-trigger-padding-inline) py-(--n-disclosure-trigger-padding-block) text-start font-inherit text-(length:--n-disclosure-trigger-font-size) font-(--n-disclosure-trigger-font-weight) text-(--n-disclosure-foreground) hover:not-data-disabled:bg-(--n-disclosure-background-hover) focus-visible:relative focus-visible:z-1 focus-visible:outline-0 focus-visible:shadow-[inset_0_0_0_var(--n-focus-ring-inner-width)_var(--n-color-focus-offset),inset_0_0_0_var(--n-focus-ring-outer-width)_var(--n-color-focus-ring-soft)] data-disabled:cursor-not-allowed data-disabled:opacity-(--n-disclosure-disabled-opacity) forced-colors:border-[ButtonText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-[-2px] forced-colors:focus-visible:outline-[Highlight] transition-[background-color,color,box-shadow] duration-(--n-motion-hover-duration) ease-(--n-motion-hover-easing) motion-reduce:duration-(--n-duration-instant)";
const panelClasses =
  "n-collapsible__panel box-border h-(--collapsible-panel-height) overflow-hidden opacity-100 transition-[height,opacity] duration-(--n-motion-reveal-duration) ease-(--n-motion-reveal-easing) data-starting-style:h-0 data-starting-style:opacity-0 data-ending-style:h-0 data-ending-style:opacity-0 motion-reduce:duration-(--n-duration-instant)";
const panelContentClasses =
  "n-collapsible__panel-content box-border px-(--n-disclosure-panel-padding-inline) pt-(--n-focus-ring-outer-width) pb-(--n-disclosure-panel-padding-block) text-(length:--n-disclosure-panel-font-size) leading-(--n-disclosure-panel-line-height) text-(--n-disclosure-panel-foreground)";

function withClassName<State>(className: NerioClassName<State> | undefined, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

export type CollapsibleChangeEventReason = "trigger-press" | "none";
export type CollapsibleChangeEventDetails = NerioChangeEventDetails<CollapsibleChangeEventReason>;

export interface CollapsibleState {
  open: boolean;
  disabled: boolean;
  transitionStatus: "starting" | "ending" | "idle" | undefined;
}

export interface CollapsibleProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "onChange" | "style"
> {
  className?: NerioClassName<CollapsibleState>;
  defaultOpen?: boolean;
  disabled?: boolean;
  onOpenChange?: (open: boolean, eventDetails: CollapsibleChangeEventDetails) => void;
  open?: boolean;
  render?: NerioRenderProp<CollapsibleState>;
  style?: NerioStyle<CollapsibleState>;
}

export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { className, ...props },
  ref,
) {
  return (
    <BaseCollapsible.Root
      ref={ref}
      {...props}
      className={withClassName(className, rootClasses)}
      data-slot="root"
    />
  );
});

export type CollapsibleTriggerState = CollapsibleState;

export interface CollapsibleTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<CollapsibleTriggerState>;
  nativeButton?: boolean;
  render?: NerioRenderProp<CollapsibleTriggerState>;
  style?: NerioStyle<CollapsibleTriggerState>;
}

export const CollapsibleTrigger = React.forwardRef<HTMLElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ className, nativeButton, type, ...props }, ref) {
    return (
      <BaseCollapsible.Trigger
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
        className={withClassName(className, triggerClasses)}
        data-slot="trigger"
        nativeButton={nativeButton}
        type={nativeButton !== false ? (type ?? "button") : undefined}
      />
    );
  },
);

export type CollapsiblePanelState = CollapsibleState;

export interface CollapsiblePanelProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<CollapsiblePanelState>;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  render?: NerioRenderProp<CollapsiblePanelState>;
  style?: NerioStyle<CollapsiblePanelState>;
}

export const CollapsiblePanel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  function CollapsiblePanel({ children, className, ...props }, ref) {
    return (
      <BaseCollapsible.Panel
        ref={ref}
        {...props}
        className={withClassName(className, panelClasses)}
        data-slot="panel"
      >
        <div className={panelContentClasses}>{children}</div>
      </BaseCollapsible.Panel>
    );
  },
);
