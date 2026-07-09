import * as React from "react";
import { cn } from "../lib/cn";

export type BadgeVariant = "neutral" | "success" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant = "neutral", ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("n-badge", className)}
      data-slot="root"
      data-variant={variant}
      {...props}
    />
  );
});
