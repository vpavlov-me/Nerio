import { Area, AreaChart, ResponsiveContainer } from "@nerio-ui/adapters/charts";

export const chart = (
  <ResponsiveContainer width="100%" height={240}>
    <AreaChart data={[{ value: 1 }]}>
      <Area dataKey="value" />
    </AreaChart>
  </ResponsiveContainer>
);
