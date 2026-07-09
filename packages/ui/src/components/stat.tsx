import * as React from "react";
import { cn } from "../lib/cn";
import { Card } from "./card";

export interface StatProps extends React.HTMLAttributes<HTMLElement> {
  label: string;
  value: string;
  trend?: string;
}

export const Stat = React.forwardRef<HTMLElement, StatProps>(function Stat(
  { className, label, value, trend, ...props },
  ref,
) {
  return (
    <Card ref={ref} className={cn("n-stat", className)} data-slot="root" {...props}>
      <span data-slot="label">{label}</span>
      <strong data-slot="value">{value}</strong>
      {trend ? <em data-slot="trend">{trend}</em> : null}
    </Card>
  );
});
