import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
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
    <Card
      ref={ref}
      className={cn(
        "n-stat grid gap-(--n-stat-gap) [&>span]:text-(length:--n-font-size-sm) [&>span]:text-(--n-color-text-tertiary) [&>strong]:text-(length:--n-stat-value-size) [&>strong]:leading-(--n-line-height-tight) [&>strong]:font-(--n-font-weight-medium) [&>em]:text-(length:--n-font-size-sm) [&>em]:not-italic [&>em]:text-(--n-stat-trend-color)",
        className,
      )}
      {...props}
    >
      <span data-slot="label">{label}</span>
      <strong data-slot="value">{value}</strong>
      {trend ? <em data-slot="trend">{trend}</em> : null}
    </Card>
  );
});
