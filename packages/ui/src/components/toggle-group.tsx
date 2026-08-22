"use client";

import * as React from "react";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { resolveClassName } from "../lib/resolve-class-name";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";
import { Toggle, type ToggleProps, type ToggleSize, type ToggleVariant } from "./toggle";

export type ToggleGroupValue = string;
export type ToggleGroupChangeEventDetails = NerioChangeEventDetails<"none">;

export interface ToggleGroupState {
  disabled: boolean;
  multiple: boolean;
  orientation: "horizontal" | "vertical";
}

type VisibleLabelToggleGroupOption = {
  value: ToggleGroupValue;
  label: React.ReactNode;
  leadingIcon?: IconComponent;
  icon?: never;
  "aria-label"?: string;
  disabled?: boolean;
};

type IconOnlyToggleGroupOption = {
  value: ToggleGroupValue;
  icon: IconComponent;
  "aria-label": string;
  label?: never;
  leadingIcon?: never;
  disabled?: boolean;
};

export type ToggleGroupOption = VisibleLabelToggleGroupOption | IconOnlyToggleGroupOption;

type ToggleGroupAccessibleName =
  | { "aria-label": string; "aria-labelledby"?: string }
  | { "aria-label"?: string; "aria-labelledby": string };

type SharedToggleGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "defaultValue" | "onChange" | "style"
> & {
  className?: NerioClassName<ToggleGroupState>;
  defaultValue?: readonly ToggleGroupValue[];
  disabled?: boolean;
  loopFocus?: boolean;
  multiple?: boolean;
  onValueChange?: (value: ToggleGroupValue[], eventDetails: ToggleGroupChangeEventDetails) => void;
  orientation?: "horizontal" | "vertical";
  render?: NerioRenderProp<ToggleGroupState>;
  size?: ToggleSize;
  style?: NerioStyle<ToggleGroupState>;
  value?: readonly ToggleGroupValue[];
  variant?: ToggleVariant;
};

type OptionsToggleGroupProps = {
  options: readonly ToggleGroupOption[];
  children?: never;
};

type ComposedToggleGroupProps = {
  children: React.ReactNode;
  options?: never;
};

export type ToggleGroupProps = SharedToggleGroupProps &
  ToggleGroupAccessibleName &
  (OptionsToggleGroupProps | ComposedToggleGroupProps);

type DistributiveOmit<T, Key extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<keyof T, Key>>
  : never;

export type ToggleGroupItemProps = DistributiveOmit<
  ToggleProps,
  "defaultPressed" | "onPressedChange" | "pressed" | "size" | "variant"
>;

const ToggleGroupVisualContext = React.createContext<{
  size: ToggleSize;
  variant: ToggleVariant;
}>({ size: "md", variant: "ghost" });

type BaseUiKeyboardEvent = React.KeyboardEvent<HTMLDivElement> & {
  preventBaseUIHandler?: () => void;
};

function moveHorizontalRtlFocus(event: BaseUiKeyboardEvent, loopFocus: boolean) {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

  const group = event.currentTarget;
  const direction = group.closest("[dir]")?.getAttribute("dir") ?? document.dir;
  if (direction !== "rtl" || group.getAttribute("data-orientation") !== "horizontal") return;

  const items = Array.from(
    group.querySelectorAll<HTMLElement>('[data-slot="item"]:not([data-disabled])'),
  );
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  if (currentIndex < 0 || items.length < 2) return;

  const step = event.key === "ArrowLeft" ? 1 : -1;
  const nextIndex = currentIndex + step;
  if (!loopFocus && (nextIndex < 0 || nextIndex >= items.length)) return;

  event.preventDefault();
  event.preventBaseUIHandler?.();
  items[(nextIndex + items.length) % items.length]?.focus();
}

export const ToggleGroupItem = React.forwardRef<HTMLElement, ToggleGroupItemProps>(
  function ToggleGroupItem({ className, ...props }, ref) {
    const { size, variant } = React.useContext(ToggleGroupVisualContext);

    return (
      <Toggle
        ref={ref}
        {...props}
        className={(state) =>
          cn("min-w-0 max-w-full whitespace-normal text-start", resolveClassName(className, state))
        }
        data-slot="item"
        size={size}
        variant={variant}
      />
    );
  },
);

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  {
    children,
    className,
    disabled,
    loopFocus = true,
    onKeyDown,
    options,
    orientation = "horizontal",
    size = "md",
    variant = "ghost",
    ...props
  },
  ref,
) {
  const renderedItems = options
    ? options.map((option) =>
        option.icon ? (
          <ToggleGroupItem
            key={option.value}
            aria-label={option["aria-label"]}
            disabled={option.disabled}
            icon={option.icon}
            value={option.value}
          />
        ) : (
          <ToggleGroupItem
            key={option.value}
            aria-label={option["aria-label"]}
            disabled={option.disabled}
            leadingIcon={option.leadingIcon}
            value={option.value}
          >
            {option.label}
          </ToggleGroupItem>
        ),
      )
    : children;

  return (
    <ToggleGroupVisualContext.Provider value={{ size, variant }}>
      <BaseToggleGroup<ToggleGroupValue>
        ref={ref}
        {...props}
        className={(state) =>
          cn(
            "n-toggle-group flex w-fit max-w-full flex-wrap items-center gap-(--n-space-1) data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
            resolveClassName(className, state),
          )
        }
        data-disabled={disabled ? "" : undefined}
        data-orientation={orientation}
        data-size={size}
        data-slot="group"
        data-variant={variant}
        disabled={disabled}
        loopFocus={loopFocus}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (!event.defaultPrevented) moveHorizontalRtlFocus(event, loopFocus);
        }}
        orientation={orientation}
      >
        {renderedItems}
      </BaseToggleGroup>
    </ToggleGroupVisualContext.Provider>
  );
});
