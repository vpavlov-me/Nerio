import * as React from "react";
import { cn } from "../lib/cn";

export type SeparatorProps = React.HTMLAttributes<HTMLHRElement>;

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { className, ...props },
  ref,
) {
  return <hr ref={ref} className={cn("n-separator", className)} data-slot="root" {...props} />;
});
