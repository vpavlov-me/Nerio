import * as React from "react";
import { cn } from "../lib/cn";

export type KbdProps = React.HTMLAttributes<HTMLElement> & {
  "data-slot"?: string;
};

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(function Kbd(
  { className, ...props },
  ref,
) {
  return <kbd ref={ref} className={cn("n-kbd", className)} data-slot="kbd" {...props} />;
});
