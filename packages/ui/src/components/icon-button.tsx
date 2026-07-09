"use client";

import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import type { ButtonProps } from "./button";
import type { IconComponent } from "./icon";
import { Icon } from "./icon";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "leadingIcon" | "trailingIcon" | "children"
> {
  icon: IconComponent;
  label: string;
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  {
    icon,
    label,
    className,
    size = "md",
    variant = "secondary",
    loading = false,
    loadingLabel: _loadingLabel,
    disabled,
    render,
    nativeButton,
    ...props
  },
  ref,
) {
  return (
    <BaseButton
      ref={ref}
      aria-label={label}
      className={cn(
        "n-button",
        "n-icon-button",
        motionClasses.hover,
        motionClasses.press,
        motionClasses.focus,
        className,
      )}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      nativeButton={nativeButton ?? (render ? false : undefined)}
      render={render}
      {...props}
    >
      <Icon icon={icon} />
      <span className="n-visually-hidden">{label}</span>
    </BaseButton>
  );
});
