import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const buttonGroupClasses =
  "n-button-group isolate inline-flex flex-row [&>.n-button]:relative [&>.n-button]:rounded-none [&>.n-button+.n-button]:border-s-0 [&>.n-button+.n-button::before]:pointer-events-none [&>.n-button+.n-button::before]:absolute [&>.n-button+.n-button::before]:start-0 [&>.n-button+.n-button::before]:top-1/2 [&>.n-button+.n-button::before]:h-(--n-button-group-divider-length) [&>.n-button+.n-button::before]:w-(--n-button-border-width) [&>.n-button+.n-button::before]:-translate-y-1/2 [&>.n-button+.n-button::before]:bg-(--n-button-group-divider) [&>.n-button+.n-button::before]:content-[''] [&>.n-button:hover]:z-1 [&>.n-button:active]:z-1 [&>.n-button:focus-visible]:z-2 [&>.n-button:first-child]:rounded-s-(--n-button-radius) [&>.n-button:last-child]:rounded-e-(--n-button-radius)";

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(function ButtonGroup(
  { children, className, role = "group", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(buttonGroupClasses, className)}
      data-slot="button-group"
      role={role}
    >
      {children}
    </div>
  );
});
