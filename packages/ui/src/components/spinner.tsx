import * as React from "react";
import { cn } from "../lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function Spinner({ className, size = "md", label = "Loading", ...props }: SpinnerProps) {
  return (
    <span
      className={cn("n-spinner", className)}
      data-slot="root"
      data-size={size}
      role="status"
      {...props}
    >
      <span className="n-visually-hidden">{label}</span>
    </span>
  );
}
