import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const buttonGroupClasses =
  "n-button-group isolate inline-flex flex-row [&>.n-button]:relative [&>.n-button]:rounded-none [&>.n-button+.n-button]:ms-[calc(var(--n-button-border-width)*-1)] [&>.n-button+.n-button::before]:pointer-events-none [&>.n-button+.n-button::before]:absolute [&>.n-button+.n-button::before]:start-[calc(var(--n-button-border-width)*-1)] [&>.n-button+.n-button::before]:top-1/2 [&>.n-button+.n-button::before]:h-(--n-button-group-divider-length) [&>.n-button+.n-button::before]:w-(--n-button-border-width) [&>.n-button+.n-button::before]:-translate-y-1/2 [&>.n-button+.n-button::before]:bg-(--n-button-group-divider) [&>.n-button+.n-button::before]:content-[''] [&>.n-button:hover]:z-1 [&>.n-button:active]:z-1 [&>.n-button:focus-visible]:z-2 [&>.n-button:first-child]:rounded-s-(--n-button-radius) [&>.n-button:last-child]:rounded-e-(--n-button-radius) data-[orientation=vertical]:items-stretch data-[orientation=vertical]:flex-col data-[orientation=vertical]:[&>.n-button+.n-button]:mt-[calc(var(--n-button-border-width)*-1)] data-[orientation=vertical]:[&>.n-button+.n-button]:ms-0 data-[orientation=vertical]:[&>.n-button+.n-button::before]:start-1/2 data-[orientation=vertical]:[&>.n-button+.n-button::before]:top-[calc(var(--n-button-border-width)*-1)] data-[orientation=vertical]:[&>.n-button+.n-button::before]:h-(--n-button-border-width) data-[orientation=vertical]:[&>.n-button+.n-button::before]:w-(--n-button-group-divider-length) data-[orientation=vertical]:[&>.n-button+.n-button::before]:-translate-x-1/2 data-[orientation=vertical]:[&>.n-button+.n-button::before]:translate-y-0 rtl:data-[orientation=vertical]:[&>.n-button+.n-button::before]:translate-x-1/2 data-[orientation=vertical]:[&>.n-button:first-child]:rounded-t-(--n-button-radius) data-[orientation=vertical]:[&>.n-button:first-child]:rounded-b-none data-[orientation=vertical]:[&>.n-button:last-child]:rounded-t-none data-[orientation=vertical]:[&>.n-button:last-child]:rounded-b-(--n-button-radius) data-[orientation=vertical]:[&>.n-button:only-child]:rounded-(--n-button-radius)";

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
      className={cn(buttonGroupClasses, className)}
      data-orientation={orientation}
      data-slot="button-group"
      role={role}
    >
      {children}
    </div>
  );
});
