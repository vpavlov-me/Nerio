import * as React from "react";
import { cn } from "../lib/cn";

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, className, role = "group", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("n-button-group", className)}
      data-slot="button-group"
      role={role}
    >
      {children}
    </div>
  );
});
