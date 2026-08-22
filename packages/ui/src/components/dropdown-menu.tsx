"use client";

import * as React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Check, ChevronRight, type IconComponent } from "@nerio-ui/adapters/icons";
import { Button } from "./button";
import { Icon } from "./icon";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

export type DropdownMenuOpenChangeEventReason =
  | "trigger-hover"
  | "trigger-focus"
  | "trigger-press"
  | "outside-press"
  | "focus-out"
  | "list-navigation"
  | "escape-key"
  | "item-press"
  | "close-press"
  | "sibling-open"
  | "cancel-open"
  | "imperative-action"
  | "none";
export type DropdownMenuOpenChangeEventDetails =
  NerioChangeEventDetails<DropdownMenuOpenChangeEventReason> & {
    preventUnmountOnClose: () => void;
  };
export type DropdownMenuCheckboxChangeEventDetails = DropdownMenuOpenChangeEventDetails;
export type DropdownMenuRadioChangeEventDetails = DropdownMenuOpenChangeEventDetails;

export type DropdownMenuSide = "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end";
export type DropdownMenuAlign = "start" | "center" | "end";
export interface DropdownMenuOffsetData {
  side: DropdownMenuSide;
  align: DropdownMenuAlign;
  anchor: { width: number; height: number };
  positioner: { width: number; height: number };
}
export type DropdownMenuOffset = number | ((data: DropdownMenuOffsetData) => number);
export type DropdownMenuCollisionBoundary =
  | "clipping-ancestors"
  | Element
  | Element[]
  | { x: number; y: number; width: number; height: number };
export type DropdownMenuCollisionPadding =
  number | Partial<Record<"top" | "right" | "bottom" | "left", number>>;
export type DropdownMenuCollisionAvoidance =
  | {
      side?: "flip" | "none";
      align?: "flip" | "shift" | "none";
      fallbackAxisSide?: "start" | "end" | "none";
    }
  | {
      side?: "shift" | "none";
      align?: "shift" | "none";
      fallbackAxisSide?: "start" | "end" | "none";
    };
export type DropdownMenuInteractionType = "" | "mouse" | "touch" | "pen" | "keyboard";
export type DropdownMenuFocusTarget =
  | boolean
  | React.RefObject<HTMLElement | null>
  | ((interactionType: DropdownMenuInteractionType) => boolean | HTMLElement | null | void);

export const dropdownMenuPositionerClasses =
  "n-dropdown-positioner z-(--n-overlay-floating-z-index) max-w-(--available-width)";
export const dropdownMenuContentClasses =
  "n-dropdown grid max-h-(--available-height) min-w-[min(var(--n-dropdown-min-width),var(--available-width))] max-w-(--available-width) origin-(--transform-origin) gap-0 overflow-y-auto overscroll-contain rounded-(--n-dropdown-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-2) text-(--n-overlay-foreground) shadow-(--n-overlay-shadow) [backdrop-filter:var(--n-overlay-surface-filter)] [scrollbar-width:thin] [--n-color-action-primary:var(--n-overlay-foreground)] [--n-color-danger:var(--n-overlay-danger)] [--n-color-surface-muted:var(--n-overlay-control-background)] [--n-color-text-primary:var(--n-overlay-foreground)] [--n-color-text-secondary:var(--n-overlay-foreground-muted)] [--n-color-text-tertiary:var(--n-overlay-foreground-muted)]";
const dropdownMenuItemClasses =
  "n-dropdown__item flex w-full cursor-pointer items-center gap-(--n-dropdown-item-gap) rounded-(--n-radius-md) border-0 bg-(--n-button-background-ghost) px-(--n-dropdown-item-padding-inline) py-(--n-space-2) text-start text-(length:--n-font-size-sm) text-(--n-color-text-secondary) hover:not-data-disabled:bg-(--n-color-surface-muted) hover:not-data-disabled:text-(--n-color-text-primary) data-highlighted:bg-(--n-color-surface-muted) data-highlighted:text-(--n-color-text-primary) data-[variant=destructive]:text-(--n-color-danger) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-opacity-disabled) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-[-2px] forced-colors:focus-visible:outline-[Highlight]";
const dropdownMenuIndicatorClasses =
  "n-dropdown__indicator inline-flex size-(--n-icon-inline-size) flex-none items-center justify-center text-(--n-color-action-primary) data-unchecked:invisible";

function withClassName<State>(className: NerioClassName<State> | undefined, baseClassName: string) {
  return typeof className === "function"
    ? (state: State) => cn(baseClassName, className(state))
    : cn(baseClassName, className);
}

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

interface DropdownMenuDescriptionContextValue {
  registerDescription: (id: string) => () => void;
  registerLabel: (id: string) => () => void;
}

const DropdownMenuDescriptionContext = React.createContext<
  DropdownMenuDescriptionContextValue | undefined
>(undefined);

function useDropdownMenuTextRelationships(
  ariaDescribedBy: string | undefined,
  ariaLabelledBy: string | undefined,
) {
  const [descriptionIds, setDescriptionIds] = React.useState<string[]>([]);
  const [labelIds, setLabelIds] = React.useState<string[]>([]);
  const registerDescription = React.useCallback((id: string) => {
    setDescriptionIds((current) => (current.includes(id) ? current : [...current, id]));
    return () => setDescriptionIds((current) => current.filter((value) => value !== id));
  }, []);
  const registerLabel = React.useCallback((id: string) => {
    setLabelIds((current) => (current.includes(id) ? current : [...current, id]));
    return () => setLabelIds((current) => current.filter((value) => value !== id));
  }, []);
  const context = React.useMemo(
    () => ({ registerDescription, registerLabel }),
    [registerDescription, registerLabel],
  );
  return {
    context,
    describedBy: mergeIds(ariaDescribedBy, ...descriptionIds),
    labelledBy: mergeIds(ariaLabelledBy, ...labelIds),
  };
}

export interface DropdownMenuRootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
  modal?: boolean;
  onOpenChange?: (open: boolean, eventDetails: DropdownMenuOpenChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean;
}

export function DropdownMenuRoot({ children, ...props }: DropdownMenuRootProps) {
  return <BaseMenu.Root {...props}>{children}</BaseMenu.Root>;
}

export interface DropdownMenuTriggerState {
  disabled: boolean;
  open: boolean;
}
export interface DropdownMenuTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DropdownMenuTriggerState>;
  closeDelay?: number;
  delay?: number;
  nativeButton?: boolean;
  openOnHover?: boolean;
  render?: NerioRenderProp<DropdownMenuTriggerState>;
  style?: NerioStyle<DropdownMenuTriggerState>;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ nativeButton, type, ...props }, ref) {
    return (
      <BaseMenu.Trigger
        ref={ref}
        {...props}
        data-slot="trigger"
        nativeButton={nativeButton}
        type={nativeButton !== false ? (type ?? "button") : undefined}
      />
    );
  },
);

export type DropdownMenuPortalState = Record<never, never>;
export interface DropdownMenuPortalProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<DropdownMenuPortalState>;
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null;
  keepMounted?: boolean;
  render?: NerioRenderProp<DropdownMenuPortalState>;
  style?: NerioStyle<DropdownMenuPortalState>;
}

export const DropdownMenuPortal = React.forwardRef<HTMLDivElement, DropdownMenuPortalProps>(
  function DropdownMenuPortal(props, ref) {
    return <BaseMenu.Portal ref={ref} {...props} data-slot="portal" />;
  },
);

export interface DropdownMenuPositionerState {
  align: DropdownMenuAlign;
  anchorHidden: boolean;
  instant: string | undefined;
  nested: boolean;
  open: boolean;
  side: DropdownMenuSide;
}
export interface DropdownMenuPositionerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  align?: DropdownMenuAlign;
  alignOffset?: DropdownMenuOffset;
  arrowPadding?: number;
  className?: NerioClassName<DropdownMenuPositionerState>;
  collisionAvoidance?: DropdownMenuCollisionAvoidance;
  collisionBoundary?: DropdownMenuCollisionBoundary;
  collisionPadding?: DropdownMenuCollisionPadding;
  disableAnchorTracking?: boolean;
  positionMethod?: "absolute" | "fixed";
  render?: NerioRenderProp<DropdownMenuPositionerState>;
  side?: DropdownMenuSide;
  sideOffset?: DropdownMenuOffset;
  sticky?: boolean;
  style?: NerioStyle<DropdownMenuPositionerState>;
}

export const DropdownMenuPositioner = React.forwardRef<HTMLDivElement, DropdownMenuPositionerProps>(
  function DropdownMenuPositioner(
    { align = "start", className, side = "bottom", sideOffset = 4, ...props },
    ref,
  ) {
    return (
      <BaseMenu.Positioner
        ref={ref}
        {...props}
        align={align}
        className={withClassName(className, dropdownMenuPositionerClasses)}
        data-slot="positioner"
        side={side}
        sideOffset={sideOffset}
      />
    );
  },
);

export interface DropdownMenuContentState {
  align: DropdownMenuAlign;
  instant: "dismiss" | "click" | "group" | "trigger-change" | undefined;
  nested: boolean;
  open: boolean;
  side: DropdownMenuSide;
  transitionStatus: "starting" | "ending" | "idle" | undefined;
}
export interface DropdownMenuContentProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DropdownMenuContentState>;
  finalFocus?: DropdownMenuFocusTarget;
  render?: NerioRenderProp<DropdownMenuContentState>;
  style?: NerioStyle<DropdownMenuContentState>;
  "data-slot"?: string;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent({ "data-slot": dataSlot = "content", className, ...props }, ref) {
    return (
      <BaseMenu.Popup
        ref={ref}
        {...props}
        className={(state) =>
          cn(
            dropdownMenuContentClasses,
            motionClasses.overlayEnter,
            resolveClassName(className, state),
          )
        }
        data-slot={dataSlot}
      />
    );
  },
);

export type DropdownMenuPartState = Record<never, never>;
export interface DropdownMenuGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<DropdownMenuPartState>;
  render?: NerioRenderProp<DropdownMenuPartState>;
  style?: NerioStyle<DropdownMenuPartState>;
}

export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup({ className, ...props }, ref) {
    return (
      <BaseMenu.Group
        ref={ref}
        {...props}
        className={withClassName(className, "n-dropdown__group grid gap-0")}
        data-slot="group"
      />
    );
  },
);

export type DropdownMenuGroupLabelProps = DropdownMenuGroupProps;
export const DropdownMenuGroupLabel = React.forwardRef<HTMLDivElement, DropdownMenuGroupLabelProps>(
  function DropdownMenuGroupLabel({ className, ...props }, ref) {
    return (
      <BaseMenu.GroupLabel
        ref={ref}
        {...props}
        className={withClassName(
          className,
          "n-dropdown__group-label px-(--n-dropdown-item-padding-inline) pt-(--n-space-1) pb-(--n-space-0-5) text-(length:--n-font-size-xs) font-(--n-font-weight-medium) text-(--n-color-text-tertiary)",
        )}
        data-slot="group-label"
      />
    );
  },
);

export interface DropdownMenuSeparatorState {
  orientation: "horizontal" | "vertical";
}
export interface DropdownMenuSeparatorProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "style"
> {
  className?: NerioClassName<DropdownMenuSeparatorState>;
  orientation?: "horizontal" | "vertical";
  render?: NerioRenderProp<DropdownMenuSeparatorState>;
  style?: NerioStyle<DropdownMenuSeparatorState>;
}

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator({ className, ...props }, ref) {
    return (
      <BaseMenu.Separator
        ref={ref}
        {...props}
        className={withClassName(
          className,
          "n-dropdown__separator my-(--n-space-1) h-px bg-(--n-overlay-divider)",
        )}
        data-slot="separator"
      />
    );
  },
);

export type DropdownMenuItemVariant = "default" | "destructive";
export interface DropdownMenuItemData {
  label: React.ReactNode;
  description?: React.ReactNode;
  group?: string;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  hotkey?: React.ReactNode;
  onSelect?: () => void;
  closeOnClick?: boolean;
  disabled?: boolean;
  destructive?: boolean;
  textValue?: string;
}
export type DropdownMenuItem = DropdownMenuItemData;

export interface DropdownMenuItemState {
  disabled: boolean;
  highlighted: boolean;
}
export interface DropdownMenuItemProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DropdownMenuItemState>;
  closeOnClick?: boolean;
  disabled?: boolean;
  nativeButton?: boolean;
  render?: NerioRenderProp<DropdownMenuItemState>;
  style?: NerioStyle<DropdownMenuItemState>;
  textValue?: string;
  variant?: DropdownMenuItemVariant;
}

export const DropdownMenuItem = React.forwardRef<HTMLElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    {
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      className,
      textValue,
      variant = "default",
      ...props
    },
    ref,
  ) {
    const textRelationships = useDropdownMenuTextRelationships(ariaDescribedBy, ariaLabelledBy);
    return (
      <DropdownMenuDescriptionContext.Provider value={textRelationships.context}>
        <BaseMenu.Item
          ref={ref}
          {...props}
          aria-describedby={textRelationships.describedBy}
          aria-labelledby={textRelationships.labelledBy}
          className={(state) =>
            cn(dropdownMenuItemClasses, motionClasses.hover, resolveClassName(className, state))
          }
          data-slot="item"
          data-variant={variant}
          label={textValue}
        />
      </DropdownMenuDescriptionContext.Provider>
    );
  },
);

export interface DropdownMenuLinkItemState {
  highlighted: boolean;
}
export interface DropdownMenuLinkItemProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DropdownMenuLinkItemState>;
  closeOnClick?: boolean;
  render?:
    | React.ReactElement
    | ((
        props: React.DetailedHTMLProps<
          React.AnchorHTMLAttributes<HTMLAnchorElement>,
          HTMLAnchorElement
        >,
        state: DropdownMenuLinkItemState,
      ) => React.ReactElement);
  style?: NerioStyle<DropdownMenuLinkItemState>;
  textValue?: string;
  variant?: DropdownMenuItemVariant;
}

export const DropdownMenuLinkItem = React.forwardRef<Element, DropdownMenuLinkItemProps>(
  function DropdownMenuLinkItem(
    {
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      className,
      textValue,
      variant = "default",
      ...props
    },
    ref,
  ) {
    const textRelationships = useDropdownMenuTextRelationships(ariaDescribedBy, ariaLabelledBy);
    return (
      <DropdownMenuDescriptionContext.Provider value={textRelationships.context}>
        <BaseMenu.LinkItem
          ref={ref}
          {...props}
          aria-describedby={textRelationships.describedBy}
          aria-labelledby={textRelationships.labelledBy}
          className={(state) =>
            cn(dropdownMenuItemClasses, motionClasses.hover, resolveClassName(className, state))
          }
          data-slot="link-item"
          data-variant={variant}
          label={textValue}
        />
      </DropdownMenuDescriptionContext.Provider>
    );
  },
);

export interface DropdownMenuCheckboxItemState extends DropdownMenuItemState {
  checked: boolean;
}
export interface DropdownMenuCheckboxItemProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "className" | "color" | "defaultChecked" | "style"
> {
  checked?: boolean;
  className?: NerioClassName<DropdownMenuCheckboxItemState>;
  closeOnClick?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  nativeButton?: boolean;
  onCheckedChange?: (
    checked: boolean,
    eventDetails: DropdownMenuCheckboxChangeEventDetails,
  ) => void;
  render?: NerioRenderProp<DropdownMenuCheckboxItemState>;
  style?: NerioStyle<DropdownMenuCheckboxItemState>;
  textValue?: string;
}

export const DropdownMenuCheckboxItem = React.forwardRef<
  HTMLElement,
  DropdownMenuCheckboxItemProps
>(function DropdownMenuCheckboxItem(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    className,
    textValue,
    ...props
  },
  ref,
) {
  const textRelationships = useDropdownMenuTextRelationships(ariaDescribedBy, ariaLabelledBy);
  return (
    <DropdownMenuDescriptionContext.Provider value={textRelationships.context}>
      <BaseMenu.CheckboxItem
        ref={ref}
        {...props}
        aria-describedby={textRelationships.describedBy}
        aria-labelledby={textRelationships.labelledBy}
        className={(state) =>
          cn(dropdownMenuItemClasses, motionClasses.hover, resolveClassName(className, state))
        }
        data-slot="checkbox-item"
        label={textValue}
      />
    </DropdownMenuDescriptionContext.Provider>
  );
});

export interface DropdownMenuItemIndicatorState extends DropdownMenuCheckboxItemState {
  transitionStatus: "starting" | "ending" | "idle" | undefined;
}
export interface DropdownMenuItemIndicatorProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "className" | "style"
> {
  className?: NerioClassName<DropdownMenuItemIndicatorState>;
  keepMounted?: boolean;
  render?: NerioRenderProp<DropdownMenuItemIndicatorState>;
  style?: NerioStyle<DropdownMenuItemIndicatorState>;
}

export const DropdownMenuCheckboxItemIndicator = React.forwardRef<
  HTMLSpanElement,
  DropdownMenuItemIndicatorProps
>(function DropdownMenuCheckboxItemIndicator({ children, className, ...props }, ref) {
  const { keepMounted = true, ...indicatorProps } = props;
  return (
    <BaseMenu.CheckboxItemIndicator
      ref={ref}
      {...indicatorProps}
      className={withClassName(className, dropdownMenuIndicatorClasses)}
      data-slot="indicator"
      keepMounted={keepMounted}
    >
      {children ?? <Icon icon={Check} />}
    </BaseMenu.CheckboxItemIndicator>
  );
});

export interface DropdownMenuRadioGroupState {
  disabled: boolean;
}
export interface DropdownMenuRadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "className" | "defaultValue" | "onChange" | "style"
> {
  className?: NerioClassName<DropdownMenuRadioGroupState>;
  defaultValue?: string;
  disabled?: boolean;
  onValueChange?: (value: string, eventDetails: DropdownMenuRadioChangeEventDetails) => void;
  render?: NerioRenderProp<DropdownMenuRadioGroupState>;
  style?: NerioStyle<DropdownMenuRadioGroupState>;
  value?: string;
}

export const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  function DropdownMenuRadioGroup({ className, onValueChange, ...props }, ref) {
    return (
      <BaseMenu.RadioGroup
        ref={ref}
        {...props}
        className={withClassName(className, "n-dropdown__radio-group grid gap-0")}
        data-slot="radio-group"
        onValueChange={(value, eventDetails) => {
          if (typeof value === "string") {
            onValueChange?.(value, eventDetails);
          }
        }}
      />
    );
  },
);

export interface DropdownMenuRadioItemState extends DropdownMenuItemState {
  checked: boolean;
}
export interface DropdownMenuRadioItemProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DropdownMenuRadioItemState>;
  closeOnClick?: boolean;
  disabled?: boolean;
  nativeButton?: boolean;
  render?: NerioRenderProp<DropdownMenuRadioItemState>;
  style?: NerioStyle<DropdownMenuRadioItemState>;
  textValue?: string;
  value: string;
}

export const DropdownMenuRadioItem = React.forwardRef<HTMLElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem(
    {
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      className,
      textValue,
      ...props
    },
    ref,
  ) {
    const textRelationships = useDropdownMenuTextRelationships(ariaDescribedBy, ariaLabelledBy);
    return (
      <DropdownMenuDescriptionContext.Provider value={textRelationships.context}>
        <BaseMenu.RadioItem
          ref={ref}
          {...props}
          aria-describedby={textRelationships.describedBy}
          aria-labelledby={textRelationships.labelledBy}
          className={(state) =>
            cn(dropdownMenuItemClasses, motionClasses.hover, resolveClassName(className, state))
          }
          data-slot="radio-item"
          label={textValue}
        />
      </DropdownMenuDescriptionContext.Provider>
    );
  },
);

export const DropdownMenuRadioItemIndicator = React.forwardRef<
  HTMLSpanElement,
  DropdownMenuItemIndicatorProps
>(function DropdownMenuRadioItemIndicator({ children, className, ...props }, ref) {
  const { keepMounted = true, ...indicatorProps } = props;
  return (
    <BaseMenu.RadioItemIndicator
      ref={ref}
      {...indicatorProps}
      className={withClassName(className, dropdownMenuIndicatorClasses)}
      data-slot="indicator"
      keepMounted={keepMounted}
    >
      {children ?? <Icon icon={Check} />}
    </BaseMenu.RadioItemIndicator>
  );
});

export interface DropdownMenuSubmenuProps {
  children: React.ReactNode;
  closeParentOnEsc?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  loopFocus?: boolean;
  onOpenChange?: (open: boolean, eventDetails: DropdownMenuOpenChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  open?: boolean;
}

export function DropdownMenuSubmenu(props: DropdownMenuSubmenuProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export interface DropdownMenuSubTriggerState extends DropdownMenuItemState {
  open: boolean;
}
export interface DropdownMenuSubTriggerProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "className" | "color" | "style"
> {
  className?: NerioClassName<DropdownMenuSubTriggerState>;
  closeDelay?: number;
  delay?: number;
  disabled?: boolean;
  nativeButton?: boolean;
  openOnHover?: boolean;
  render?: NerioRenderProp<DropdownMenuSubTriggerState>;
  style?: NerioStyle<DropdownMenuSubTriggerState>;
  textValue?: string;
}

export const DropdownMenuSubTrigger = React.forwardRef<HTMLElement, DropdownMenuSubTriggerProps>(
  function DropdownMenuSubTrigger(
    {
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledBy,
      children,
      className,
      textValue,
      ...props
    },
    ref,
  ) {
    const textRelationships = useDropdownMenuTextRelationships(ariaDescribedBy, ariaLabelledBy);
    return (
      <DropdownMenuDescriptionContext.Provider value={textRelationships.context}>
        <BaseMenu.SubmenuTrigger
          ref={ref}
          {...props}
          aria-describedby={textRelationships.describedBy}
          aria-labelledby={textRelationships.labelledBy}
          className={(state) =>
            cn(dropdownMenuItemClasses, motionClasses.hover, resolveClassName(className, state))
          }
          data-slot="sub-trigger"
          label={textValue}
        >
          {children}
          <span
            aria-hidden
            className="ms-auto inline-flex size-(--n-icon-inline-size) flex-none items-center justify-center rtl:rotate-180"
            data-slot="submenu-icon"
          >
            <Icon icon={ChevronRight} />
          </span>
        </BaseMenu.SubmenuTrigger>
      </DropdownMenuDescriptionContext.Provider>
    );
  },
);

export interface DropdownMenuSubContentProps extends DropdownMenuContentProps {
  align?: DropdownMenuAlign;
  alignOffset?: DropdownMenuOffset;
  collisionAvoidance?: DropdownMenuCollisionAvoidance;
  collisionBoundary?: DropdownMenuCollisionBoundary;
  collisionPadding?: DropdownMenuCollisionPadding;
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null;
  keepMounted?: boolean;
  positionerClassName?: NerioClassName<DropdownMenuPositionerState>;
  positionMethod?: "absolute" | "fixed";
  side?: DropdownMenuSide;
  sideOffset?: DropdownMenuOffset;
  sticky?: boolean;
}

export const DropdownMenuSubContent = React.forwardRef<HTMLDivElement, DropdownMenuSubContentProps>(
  function DropdownMenuSubContent(
    {
      align = "start",
      alignOffset = -4,
      className,
      collisionAvoidance,
      collisionBoundary,
      collisionPadding,
      container,
      keepMounted,
      positionerClassName,
      positionMethod,
      side = "inline-end",
      sideOffset = -4,
      sticky,
      ...props
    },
    ref,
  ) {
    return (
      <DropdownMenuPortal container={container} keepMounted={keepMounted}>
        <DropdownMenuPositioner
          align={align}
          alignOffset={alignOffset}
          className={positionerClassName}
          collisionAvoidance={collisionAvoidance}
          collisionBoundary={collisionBoundary}
          collisionPadding={collisionPadding}
          positionMethod={positionMethod}
          side={side}
          sideOffset={sideOffset}
          sticky={sticky}
        >
          <DropdownMenuContent ref={ref} {...props} className={className} data-slot="sub-content" />
        </DropdownMenuPositioner>
      </DropdownMenuPortal>
    );
  },
);

export interface DropdownMenuTextPartProps extends React.HTMLAttributes<HTMLSpanElement> {
  "data-slot"?: string;
}

export const DropdownMenuItemContent = React.forwardRef<HTMLSpanElement, DropdownMenuTextPartProps>(
  function DropdownMenuItemContent({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        {...props}
        className={cn("grid min-w-0 flex-1 gap-(--n-space-0-5)", className)}
        data-slot="item-content"
      />
    );
  },
);

export const DropdownMenuItemLabel = React.forwardRef<HTMLSpanElement, DropdownMenuTextPartProps>(
  function DropdownMenuItemLabel(
    { "data-slot": dataSlot = "item-label", id: providedId, ...props },
    ref,
  ) {
    const generatedId = React.useId();
    const id = providedId ?? generatedId;
    const context = React.useContext(DropdownMenuDescriptionContext);
    React.useEffect(() => context?.registerLabel(id), [context, id]);
    return <span ref={ref} {...props} data-slot={dataSlot} id={id} />;
  },
);

export const DropdownMenuItemDescription = React.forwardRef<
  HTMLSpanElement,
  DropdownMenuTextPartProps
>(function DropdownMenuItemDescription(
  { "data-slot": dataSlot = "item-description", className, id: providedId, ...props },
  ref,
) {
  const generatedId = React.useId();
  const id = providedId ?? generatedId;
  const context = React.useContext(DropdownMenuDescriptionContext);
  React.useEffect(() => context?.registerDescription(id), [context, id]);
  return (
    <span
      ref={ref}
      {...props}
      className={cn(
        "text-(length:--n-font-size-xs) font-(--n-font-weight-regular) text-(--n-color-text-tertiary)",
        className,
      )}
      data-slot={dataSlot}
      id={id}
    />
  );
});

export const DropdownMenuShortcut = React.forwardRef<HTMLSpanElement, DropdownMenuTextPartProps>(
  function DropdownMenuShortcut(
    { "aria-hidden": ariaHidden = true, "data-slot": dataSlot = "shortcut", className, ...props },
    ref,
  ) {
    return (
      <span
        ref={ref}
        {...props}
        aria-hidden={ariaHidden}
        className={cn(
          "ms-auto flex-none text-(length:--n-font-size-xs) text-(--n-color-text-tertiary)",
          className,
        )}
        data-slot={dataSlot}
      />
    );
  },
);

export interface DropdownMenuProps {
  className?: string;
  defaultOpen?: boolean;
  items: DropdownMenuItemData[];
  onOpenChange?: (open: boolean, eventDetails: DropdownMenuOpenChangeEventDetails) => void;
  open?: boolean;
  trigger: React.ReactNode;
}

function groupMenuItems(items: DropdownMenuItemData[]) {
  return items.reduce<
    Array<{
      label: string | undefined;
      items: Array<{ item: DropdownMenuItemData; index: number }>;
    }>
  >((groups, item, index) => {
    const currentGroup = groups.at(-1);
    if (!currentGroup || currentGroup.label !== item.group) {
      groups.push({ label: item.group, items: [{ item, index }] });
    } else {
      currentGroup.items.push({ item, index });
    }
    return groups;
  }, []);
}

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  function DropdownMenu({ trigger, items, className, open, defaultOpen, onOpenChange }, ref) {
    const groups = groupMenuItems(items);

    return (
      <DropdownMenuRoot open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <DropdownMenuTrigger
          render={
            React.isValidElement(trigger) ? trigger : <Button variant="secondary">{trigger}</Button>
          }
        />
        <DropdownMenuPortal>
          <DropdownMenuPositioner align="center" sideOffset={0}>
            <DropdownMenuContent ref={ref} className={className}>
              {groups.map((group, groupIndex) => (
                <React.Fragment key={`${group.label ?? "items"}-${groupIndex}`}>
                  {groupIndex > 0 ? <DropdownMenuSeparator /> : null}
                  <DropdownMenuGroup>
                    {group.label ? (
                      <DropdownMenuGroupLabel>{group.label}</DropdownMenuGroupLabel>
                    ) : null}
                    {group.items.map(({ item, index }) => (
                      <DropdownMenuItem
                        key={`${item.label}-${index}`}
                        className="grid grid-cols-[var(--n-icon-inline-size)_minmax(0,1fr)_auto_var(--n-icon-inline-size)]"
                        closeOnClick={item.closeOnClick}
                        disabled={item.disabled}
                        textValue={
                          item.textValue ??
                          (typeof item.label === "string" ? item.label : undefined)
                        }
                        variant={item.destructive ? "destructive" : "default"}
                        onClick={item.onSelect}
                      >
                        {item.leadingIcon ? (
                          <span
                            aria-hidden
                            className="col-start-1 inline-flex size-(--n-icon-inline-size) flex-none items-center justify-center"
                            data-slot="leading-icon"
                          >
                            <Icon icon={item.leadingIcon} />
                          </span>
                        ) : null}
                        <DropdownMenuItemContent className="col-start-2">
                          <DropdownMenuItemLabel data-slot="label">
                            {item.label}
                          </DropdownMenuItemLabel>
                          {item.description ? (
                            <DropdownMenuItemDescription data-slot="description">
                              {item.description}
                            </DropdownMenuItemDescription>
                          ) : null}
                        </DropdownMenuItemContent>
                        {item.hotkey ? (
                          <DropdownMenuShortcut
                            className="col-start-3 justify-self-end"
                            data-slot="hotkey"
                          >
                            {item.hotkey}
                          </DropdownMenuShortcut>
                        ) : null}
                        {item.trailingIcon ? (
                          <span
                            aria-hidden
                            className="col-start-4 inline-flex size-(--n-icon-inline-size) flex-none items-center justify-center"
                            data-slot="trailing-icon"
                          >
                            <Icon icon={item.trailingIcon} />
                          </span>
                        ) : null}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPositioner>
        </DropdownMenuPortal>
      </DropdownMenuRoot>
    );
  },
);
