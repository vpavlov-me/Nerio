import * as React from "react";
import { cn } from "../lib/cn";

export interface KeyValueProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: React.ReactNode;
}

export const KeyValue = React.forwardRef<HTMLDivElement, KeyValueProps>(function KeyValue(
  { className, label, value, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("n-key-value", className)} data-slot="root" {...props}>
      <dt data-slot="label">{label}</dt>
      <dd data-slot="value">{value}</dd>
    </div>
  );
});
