"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./button";
import { Icon, type IconComponent } from "./icon";
import { cn } from "../lib/cn";

export interface IconButtonProps extends Omit<
  ButtonProps,
  "leadingIcon" | "trailingIcon" | "children"
> {
  icon: IconComponent;
  label: string;
}

export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  { icon, label, className, ...props },
  ref,
) {
  return (
    <Button ref={ref} aria-label={label} className={cn("n-icon-button", className)} {...props}>
      <Icon icon={icon} />
    </Button>
  );
});
