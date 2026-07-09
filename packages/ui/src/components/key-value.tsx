import * as React from "react";

export interface KeyValueProps {
  label: string;
  value: React.ReactNode;
}

export function KeyValue({ label, value }: KeyValueProps) {
  return (
    <div className="n-key-value" data-slot="root">
      <dt data-slot="label">{label}</dt>
      <dd data-slot="value">{value}</dd>
    </div>
  );
}
