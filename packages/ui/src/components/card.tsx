import * as React from "react";
import { cn } from "../lib/cn";

export type CardProps = React.HTMLAttributes<HTMLElement>;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  return <section ref={ref} className={cn("n-card", className)} data-slot="root" {...props} />;
});
