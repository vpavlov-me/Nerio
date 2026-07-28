"use client";

import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import { Icon } from "./icon";

export type ToggleVariant = "ghost" | "outline";
export type ToggleSize = "sm" | "md" | "lg";

export type ToggleChangeEventDetails = Parameters<
  NonNullable<React.ComponentProps<typeof BaseToggle>["onPressedChange"]>
>[1];

type ToggleBaseProps = Omit<
  React.ComponentProps<typeof BaseToggle>,
  "aria-label" | "children" | "className"
> & {
  "data-slot"?: string;
  className?: React.ComponentProps<typeof BaseToggle>["className"];
  variant?: ToggleVariant;
  size?: ToggleSize;
};

type VisibleLabelToggleProps = ToggleBaseProps & {
  children: React.ReactNode;
  icon?: never;
  leadingIcon?: IconComponent;
  "aria-label"?: string;
};

type IconOnlyToggleProps = ToggleBaseProps & {
  icon: IconComponent;
  children?: never;
  leadingIcon?: never;
  "aria-label": string;
};

export type ToggleProps = VisibleLabelToggleProps | IconOnlyToggleProps;

const toggleBaseClasses =
  "n-toggle box-border inline-flex h-(--n-toggle-height-md) cursor-pointer items-center justify-center gap-(--n-toggle-gap) whitespace-nowrap rounded-(--n-toggle-radius) border-(length:--n-toggle-border-width) px-(--n-toggle-padding-inline-md) text-(length:--n-toggle-font-size) font-(--n-toggle-font-weight) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:opacity-(--n-toggle-disabled-opacity) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-toggle-disabled-opacity) data-pressed:border-(--n-toggle-border-pressed) data-pressed:bg-(--n-toggle-background-pressed) data-pressed:text-(--n-toggle-foreground-pressed) data-pressed:[&:hover:not(:disabled):not([data-disabled])]:border-(--n-toggle-border-pressed-hover) data-pressed:[&:hover:not(:disabled):not([data-disabled])]:bg-(--n-toggle-background-pressed-hover) data-pressed:[&:active:not(:disabled):not([data-disabled])]:border-(--n-toggle-border-pressed-active) data-pressed:[&:active:not(:disabled):not([data-disabled])]:bg-(--n-toggle-background-pressed-active) forced-colors:border-[ButtonText] forced-colors:data-pressed:border-[Highlight] forced-colors:data-pressed:bg-[Highlight] forced-colors:data-pressed:text-[HighlightText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight]";

const toggleVariantClasses: Record<ToggleVariant, string> = {
  ghost:
    "border-(--n-toggle-border-ghost) bg-(--n-toggle-background-ghost) text-(--n-toggle-foreground-ghost) [&:hover:not(:disabled):not([data-disabled])]:bg-(--n-toggle-background-ghost-hover) [&:active:not(:disabled):not([data-disabled])]:bg-(--n-toggle-background-ghost-active)",
  outline:
    "border-(--n-toggle-border-outline) bg-(--n-toggle-background-outline) text-(--n-toggle-foreground-outline) shadow-(--n-toggle-shadow-outline) [&:hover:not(:disabled):not([data-disabled])]:bg-(--n-toggle-background-outline-hover) [&:active:not(:disabled):not([data-disabled])]:bg-(--n-toggle-background-outline-active)",
};

const toggleSizeClasses: Record<ToggleSize, string> = {
  sm: "h-(--n-toggle-height-sm) px-(--n-toggle-padding-inline-sm)",
  md: "h-(--n-toggle-height-md) px-(--n-toggle-padding-inline-md)",
  lg: "h-(--n-toggle-height-lg) px-(--n-toggle-padding-inline-lg)",
};

const toggleIconOnlySizeClasses: Record<ToggleSize, string> = {
  sm: "w-(--n-toggle-height-sm) p-(--n-space-0) [&_.n-icon]:size-(--n-toggle-icon-size-sm)",
  md: "w-(--n-toggle-height-md) p-(--n-space-0) [&_.n-icon]:size-(--n-toggle-icon-size-md)",
  lg: "w-(--n-toggle-height-lg) p-(--n-space-0) [&_.n-icon]:size-(--n-toggle-icon-size-lg)",
};

export const Toggle = React.forwardRef<HTMLElement, ToggleProps>(function Toggle(
  {
    "data-slot": dataSlot = "toggle",
    children,
    className,
    disabled,
    icon,
    leadingIcon,
    nativeButton,
    size = "md",
    type,
    variant = "ghost",
    ...props
  },
  ref,
) {
  const iconOnly = Boolean(icon);

  return (
    <BaseToggle
      ref={ref as React.Ref<HTMLButtonElement>}
      {...props}
      className={(state) =>
        cn(
          toggleBaseClasses,
          toggleVariantClasses[variant],
          toggleSizeClasses[size],
          iconOnly && toggleIconOnlySizeClasses[size],
          motionClasses.interactive,
          resolveClassName(className, state),
        )
      }
      data-disabled={disabled ? "" : undefined}
      data-icon-only={iconOnly ? "true" : undefined}
      data-size={size}
      data-slot={dataSlot}
      data-variant={variant}
      disabled={disabled}
      nativeButton={nativeButton}
      type={nativeButton !== false ? (type ?? "button") : undefined}
    >
      {icon ? (
        <span data-slot="toggle-icon">
          <Icon icon={icon} />
        </span>
      ) : (
        <>
          {leadingIcon ? (
            <span data-slot="toggle-icon">
              <Icon icon={leadingIcon} />
            </span>
          ) : null}
          <span data-slot="toggle-label">{children}</span>
        </>
      )}
    </BaseToggle>
  );
});
