import * as React from "react";
import { cn } from "../lib/cn";

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** Completion from 0 through 100. Omit for indeterminate progress. */
  value?: number;
  /** Visible context for the progress indicator. */
  label?: React.ReactNode;
  /** Accessible name used when no visible label is available. */
  ariaLabel?: string;
  /** Localized text for a determinate value. */
  valueText?: string;
  /** Localized text for an indeterminate operation. */
  indeterminateLabel?: string;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    ariaLabel,
    className,
    indeterminateLabel = "Loading",
    label,
    style,
    value,
    valueText,
    ...props
  },
  ref,
) {
  const isDeterminate = typeof value === "number" && Number.isFinite(value);
  const clampedValue = isDeterminate ? Math.max(0, Math.min(100, value)) : undefined;
  const generatedId = React.useId();
  const labelId = label ? `${generatedId}-label` : undefined;

  return (
    <div
      ref={ref}
      className={cn("n-progress", className)}
      data-slot="root"
      style={style}
      {...props}
    >
      {label ? (
        <span id={labelId} data-slot="label">
          {label}
        </span>
      ) : null}
      <div
        role="progressbar"
        aria-label={label ? undefined : (ariaLabel ?? "Progress")}
        aria-labelledby={labelId}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
        aria-valuetext={isDeterminate ? valueText : indeterminateLabel}
        data-indeterminate={isDeterminate ? undefined : ""}
      >
        <span
          data-slot="indicator"
          style={
            isDeterminate
              ? ({ "--n-progress-value": `${clampedValue}%` } as React.CSSProperties)
              : undefined
          }
        />
      </div>
    </div>
  );
});
