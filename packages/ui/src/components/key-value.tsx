import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

export interface KeyValueProps extends React.HTMLAttributes<HTMLDListElement> {
  label: string;
  value: React.ReactNode;
}

export const KeyValue = React.forwardRef<HTMLDListElement, KeyValueProps>(function KeyValue(
  { className, label, value, ...props },
  ref,
) {
  return (
    <dl
      ref={ref}
      className={cn(
        "n-key-value grid gap-(--n-key-value-gap) [&_dd]:m-0 [&_dt]:m-0 [&_dt]:text-(length:--n-font-size-sm) [&_dt]:text-(--n-color-text-tertiary)",
        className,
      )}
      data-slot="root"
      {...props}
    >
      <dt data-slot="label">{label}</dt>
      <dd data-slot="value">{value}</dd>
    </dl>
  );
});
