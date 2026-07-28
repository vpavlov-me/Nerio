import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  "data-slot"?: string;
  orientation?: "horizontal" | "vertical";
}

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  {
    "aria-orientation": _ariaOrientation,
    "data-slot": dataSlot = "root",
    className,
    orientation = "horizontal",
    ...props
  },
  ref,
) {
  return (
    <hr
      ref={ref}
      {...props}
      className={cn(
        "n-separator m-0 shrink-0 border-0 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:[border-block-start:var(--n-border-subtle)] data-[orientation=vertical]:h-auto data-[orientation=vertical]:self-stretch data-[orientation=vertical]:[border-inline-start:var(--n-border-subtle)]",
        className,
      )}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-slot={dataSlot}
    />
  );
});
