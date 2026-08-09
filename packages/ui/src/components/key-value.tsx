import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

export interface KeyValueProps extends React.HTMLAttributes<HTMLDListElement> {
  label: string;
  orientation?: "column" | "row";
  value: React.ReactNode;
}

export const KeyValue = React.forwardRef<HTMLDListElement, KeyValueProps>(function KeyValue(
  { className, label, orientation = "column", value, ...props },
  ref,
) {
  return (
    <dl
      ref={ref}
      {...props}
      className={cn(
        "n-key-value grid gap-(--n-key-value-gap) [&_dd]:m-0 [&_dt]:m-0 [&_dt]:text-(length:--n-font-size-sm) [&_dt]:text-(--n-color-text-tertiary)",
        orientation === "row" &&
          "grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-(--n-space-4) [&_dd]:text-(length:--n-font-size-sm)",
        className,
      )}
      data-orientation={orientation}
      data-slot="root"
    >
      <dt data-slot="label">{label}</dt>
      <dd data-slot="value">{value}</dd>
    </dl>
  );
});
