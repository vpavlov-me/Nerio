import * as React from "react";
import { cn } from "../lib/cn";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Changes the attached layout without changing the child Button behavior. */
  orientation?: ButtonGroupOrientation;
}

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, className, orientation = "horizontal", role = "group", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("n-button-group", className)}
      data-orientation={orientation}
      data-slot="button-group"
      role={role}
    >
      {children}
    </div>
  );
});
