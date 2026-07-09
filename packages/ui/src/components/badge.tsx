import * as React from "react";
import { cn } from "../lib/cn";

export type BadgeVariant = "neutral" | "success" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span className={cn("n-badge", className)} data-slot="root" data-variant={variant} {...props} />
  );
}
