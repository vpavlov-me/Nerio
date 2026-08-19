"use client";

import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

const rootClasses =
  "n-accordion box-border w-full overflow-clip rounded-(--n-disclosure-radius) border-(length:--n-disclosure-border-width) border-(--n-disclosure-border) bg-(--n-disclosure-background) text-(--n-disclosure-foreground)";
const itemClasses =
  "n-accordion__item box-border border-0 border-b-(length:--n-disclosure-divider-width) border-solid border-(--n-disclosure-divider) last:border-b-0";
const headerClasses = "n-accordion__header m-0 font-inherit";
const triggerClasses =
  "n-accordion__trigger box-border flex min-h-(--n-disclosure-trigger-min-height) w-full cursor-pointer items-center justify-between gap-(--n-disclosure-trigger-gap) border-0 bg-transparent px-(--n-disclosure-trigger-padding-inline) py-(--n-disclosure-trigger-padding-block) text-start font-inherit text-(length:--n-disclosure-trigger-font-size) font-(--n-disclosure-trigger-font-weight) text-(--n-disclosure-foreground) hover:bg-(--n-disclosure-background-hover) focus-visible:relative focus-visible:z-1 focus-visible:outline-0 focus-visible:shadow-[inset_0_0_0_var(--n-focus-ring-inner-width)_var(--n-color-focus-offset),inset_0_0_0_var(--n-focus-ring-outer-width)_var(--n-color-focus-ring-soft)] data-disabled:cursor-not-allowed data-disabled:opacity-(--n-disclosure-disabled-opacity) forced-colors:border-[ButtonText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-[-2px] forced-colors:focus-visible:outline-[Highlight] transition-[background-color,color,box-shadow] duration-(--n-motion-hover-duration) ease-(--n-motion-hover-easing) motion-reduce:duration-(--n-duration-instant)";
const panelClasses =
  "n-accordion__panel box-border h-(--accordion-panel-height) overflow-hidden px-(--n-disclosure-panel-padding-inline) pb-(--n-disclosure-panel-padding-block) text-(length:--n-disclosure-panel-font-size) leading-(--n-disclosure-panel-line-height) text-(--n-disclosure-panel-foreground) opacity-100 transition-[height,opacity] duration-(--n-motion-reveal-duration) ease-(--n-motion-reveal-easing) data-closed:h-0 data-closed:opacity-0 motion-reduce:duration-(--n-duration-instant)";

function withClassName<State>(className: NerioClassName<State> | undefined, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

export type AccordionValue = string;
export type AccordionChangeEventReason = "trigger-press" | "none";
export type AccordionChangeEventDetails = NerioChangeEventDetails<AccordionChangeEventReason>;

export interface AccordionState {
  value: AccordionValue[];
  disabled: boolean;
}

export interface AccordionProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "defaultValue" | "onChange" | "style"
> {
  className?: NerioClassName<AccordionState>;
  defaultValue?: AccordionValue[];
  disabled?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  multiple?: boolean;
  onValueChange?: (value: AccordionValue[], eventDetails: AccordionChangeEventDetails) => void;
  render?: NerioRenderProp<AccordionState>;
  style?: NerioStyle<AccordionState>;
  value?: AccordionValue[];
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { className, ...props },
  ref,
) {
  return (
    <BaseAccordion.Root
      ref={ref}
      {...props}
      className={withClassName(className, rootClasses)}
      data-slot="root"
    />
  );
});

export interface AccordionItemState extends AccordionState {
  hidden: boolean;
  index: number;
  open: boolean;
}

export interface AccordionItemProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "onChange" | "style"
> {
  className?: NerioClassName<AccordionItemState>;
  disabled?: boolean;
  onOpenChange?: (open: boolean, eventDetails: AccordionChangeEventDetails) => void;
  render?: NerioRenderProp<AccordionItemState>;
  style?: NerioStyle<AccordionItemState>;
  value: AccordionValue;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem({ className, ...props }, ref) {
    return (
      <BaseAccordion.Item
        ref={ref}
        {...props}
        className={withClassName(className, itemClasses)}
        data-slot="item"
      />
    );
  },
);

export interface AccordionHeaderProps extends Omit<
  React.HTMLAttributes<HTMLHeadingElement>,
  "className" | "style"
> {
  className?: NerioClassName<AccordionItemState>;
  render?: NerioRenderProp<AccordionItemState>;
  style?: NerioStyle<AccordionItemState>;
}

export const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  function AccordionHeader({ className, ...props }, ref) {
    return (
      <BaseAccordion.Header
        ref={ref}
        {...props}
        className={withClassName(className, headerClasses)}
        data-slot="header"
      />
    );
  },
);

export interface AccordionTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<AccordionItemState>;
  nativeButton?: boolean;
  render?: NerioRenderProp<AccordionItemState>;
  style?: NerioStyle<AccordionItemState>;
}

export const AccordionTrigger = React.forwardRef<HTMLElement, AccordionTriggerProps>(
  function AccordionTrigger({ className, nativeButton, type, ...props }, ref) {
    return (
      <BaseAccordion.Trigger
        ref={ref}
        {...props}
        className={withClassName(className, triggerClasses)}
        data-slot="trigger"
        nativeButton={nativeButton}
        type={nativeButton !== false ? (type ?? "button") : undefined}
      />
    );
  },
);

export interface AccordionPanelState extends AccordionItemState {
  transitionStatus: "starting" | "ending" | "idle" | undefined;
}

export interface AccordionPanelProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<AccordionPanelState>;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  render?: NerioRenderProp<AccordionPanelState>;
  style?: NerioStyle<AccordionPanelState>;
}

export const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  function AccordionPanel({ className, ...props }, ref) {
    return (
      <BaseAccordion.Panel
        ref={ref}
        {...props}
        className={withClassName(className, panelClasses)}
        data-slot="panel"
      />
    );
  },
);
