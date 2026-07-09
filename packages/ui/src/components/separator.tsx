import * as React from "react";
import { cn } from "../lib/cn";

export type SeparatorProps = React.HTMLAttributes<HTMLHRElement>;

export function Separator({ className, ...props }: SeparatorProps) {
  return <hr className={cn("n-separator", className)} data-slot="root" {...props} />;
}
