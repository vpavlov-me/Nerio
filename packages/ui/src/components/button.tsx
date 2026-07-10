"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";
import { Icon, type IconComponent } from "./icon";
import { Kbd, type KbdProps } from "./kbd";
import { Spinner } from "./spinner";
import { Tooltip } from "./tooltip";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  "children" | "className" | "disabled"
> & {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** @deprecated Loading preserves the action name and exposes aria-busy. */
  loadingLabel?: string;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
  /** Renders an accessible icon-only button. Supply aria-label for the action name. */
  icon?: IconComponent;
  /** Optional Kbd element displayed after the visible button label. */
  kbd?: React.ReactNode;
  /** Shows supplemental help on hover and keyboard focus. */
  tooltip?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    loading = false,
    loadingLabel: _loadingLabel,
    leadingIcon,
    trailingIcon,
    icon,
    kbd,
    tooltip,
    children,
    disabled,
    ...props
  },
  ref,
) {
  const iconOnly = Boolean(icon);
  const keyboardShortcut = React.isValidElement<KbdProps>(kbd) ? (
    React.cloneElement(kbd, { "data-slot": "button-kbd", "aria-hidden": true })
  ) : kbd ? (
    <Kbd data-slot="button-kbd" aria-hidden="true">
      {kbd}
    </Kbd>
  ) : null;
  const content = (
    <BaseButton
      ref={ref}
      className={cn(
        "n-button",
        motionClasses.hover,
        motionClasses.press,
        motionClasses.focus,
        className,
      )}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      data-icon-only={iconOnly ? "true" : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Spinner aria-hidden size="sm" />
      ) : icon ? (
        <Icon icon={icon} />
      ) : leadingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={leadingIcon} />
        </span>
      ) : null}
      {!iconOnly ? <span data-slot="button-label">{children}</span> : null}
      {!iconOnly ? keyboardShortcut : null}
      {!iconOnly && !loading && trailingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </BaseButton>
  );

  return tooltip ? <Tooltip label={tooltip}>{content}</Tooltip> : content;
});
