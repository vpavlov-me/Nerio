"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cn } from "../lib/cn";
import { Icon, type IconComponent } from "./icon";
import { Spinner } from "./spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
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
    loadingLabel = "Loading",
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
      className={cn("n-button", className)}
      data-slot="root"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? "true" : undefined}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" label={loadingLabel} />
      ) : leadingIcon ? (
        <span data-slot="icon">
          <Icon icon={leadingIcon} />
        </span>
      ) : null}
      <span data-slot="label">{children}</span>
      {!loading && trailingIcon ? (
        <span data-slot="icon">
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </BaseButton>
  );
});
