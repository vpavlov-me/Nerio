import { cn } from "../lib/cn";
import { Card } from "./card";

export interface StatProps {
  label: string;
  value: string;
  trend?: string;
  className?: string;
}

export function Stat({ label, value, trend, className }: StatProps) {
  return (
    <Card className={cn("n-stat", className)} data-slot="root">
      <span data-slot="label">{label}</span>
      <strong data-slot="value">{value}</strong>
      {trend ? <em data-slot="trend">{trend}</em> : null}
    </Card>
  );
}
