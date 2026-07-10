"use client";

import * as React from "react";
import { Button, type ButtonProps } from "./button";
import type { IconComponent } from "./icon";

/** @deprecated Use Button with icon and aria-label instead. */
export interface IconButtonProps extends Omit<
  ButtonProps,
  "icon" | "leadingIcon" | "trailingIcon" | "children" | "aria-label"
> {
  icon: IconComponent;
  label: string;
}

/** @deprecated Use <Button icon={icon} aria-label={label} /> instead. */
export const IconButton = React.forwardRef<HTMLElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "secondary", ...props },
  ref,
) {
  return <Button ref={ref} aria-label={label} icon={icon} variant={variant} {...props} />;
});
