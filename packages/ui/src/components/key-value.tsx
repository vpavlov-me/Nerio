import * as React from "react";
import { cn } from "../lib/cn";

export interface KeyValueProps extends React.HTMLAttributes<HTMLDListElement> {
  label: string;
  value: React.ReactNode;
}

export const KeyValue = React.forwardRef<HTMLDListElement, KeyValueProps>(function KeyValue(
  { className, label, value, ...props },
  ref,
) {
  return (
    <dl ref={ref} className={cn("n-key-value", className)} data-slot="root" {...props}>
      <dt data-slot="label">{label}</dt>
      <dd data-slot="value">{value}</dd>
    </dl>
  );
});
