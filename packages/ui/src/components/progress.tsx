import * as React from "react";
import { cn } from "../lib/cn";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { className, value, label, ...props },
  ref,
) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const generatedId = React.useId();
  const labelId = label ? `${generatedId}-label` : undefined;

  return (
    <div ref={ref} className={cn("n-progress", className)} data-slot="root" {...props}>
      {label ? (
        <span id={labelId} data-slot="label">
          {label}
        </span>
      ) : null}
      <div
        role="progressbar"
        aria-label={label ? undefined : "Progress"}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
      >
        <span data-slot="indicator" style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
});
