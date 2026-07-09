import { Card } from "./card";

export interface StatProps {
  label: string;
  value: string;
  trend?: string;
}

export function Stat({ label, value, trend }: StatProps) {
  return (
    <Card className="n-stat" data-slot="root">
      <span data-slot="label">{label}</span>
      <strong data-slot="value">{value}</strong>
      {trend ? <em data-slot="trend">{trend}</em> : null}
    </Card>
  );
}
