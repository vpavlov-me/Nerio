"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";
import { Icon, type IconComponent } from "./icon";
import { Spinner } from "./spinner";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "subtle" | "danger" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<
  React.ComponentProps<typeof BaseButton>,
  "children" | "className" | "disabled"
> & {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** @deprecated Loading preserves the action name and exposes aria-busy. */
  loadingLabel?: string;
  leadingIcon?: IconComponent;
  trailingIcon?: IconComponent;
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
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Spinner aria-hidden size="sm" />
      ) : leadingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={leadingIcon} />
        </span>
      ) : null}
      <span data-slot="button-label">{children}</span>
      {!loading && trailingIcon ? (
        <span data-slot="button-icon">
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </BaseButton>
  );
});
