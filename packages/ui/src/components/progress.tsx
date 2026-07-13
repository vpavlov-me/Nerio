import * as React from "react";
import { cn } from "../lib/cn";

export type ProgressState = "indeterminate" | "progressing" | "complete";

type ProgressRootProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  | "aria-label"
  | "aria-labelledby"
  | "aria-valuemax"
  | "aria-valuemin"
  | "aria-valuenow"
  | "aria-valuetext"
  | "children"
  | "data-slot"
  | "data-state"
  | "role"
>;

type ProgressVisibleLabel = Exclude<React.ReactNode, boolean | null | undefined>;

type ProgressNamingProps =
  | {
      label: ProgressVisibleLabel;
      "aria-label"?: never;
      "aria-labelledby"?: never;
    }
  | {
      label?: never;
      "aria-label": string;
      "aria-labelledby"?: never;
    }
  | {
      label?: never;
      "aria-label"?: never;
      "aria-labelledby": string;
    };

export type ProgressProps = ProgressRootProps &
  ProgressNamingProps & {
    /** Completion value. Omit it when a reliable value is unavailable. */
    value?: number | null;
    /** Lowest value in the progress range. Defaults to 0. */
    min?: number;
    /** Highest value in the progress range. Defaults to 100. */
    max?: number;
    /** Optional visible text for the current value. */
    valueLabel?: React.ReactNode;
    /** Optional localized value text for assistive technologies. */
    valueText?: string;
  };

type NormalizedProgress = {
  max: number;
  min: number;
  ratio: number;
  state: ProgressState;
  value: number | undefined;
};

function normalizeProgress(
  value: number | null | undefined,
  min: number,
  max: number,
): NormalizedProgress {
  const hasValidRange = Number.isFinite(min) && Number.isFinite(max) && max > min;
  const normalizedMin = hasValidRange ? min : 0;
  const normalizedMax = hasValidRange ? max : 100;
  const isDeterminate = typeof value === "number" && Number.isFinite(value);

  if (!isDeterminate) {
    return {
      min: normalizedMin,
      max: normalizedMax,
      value: undefined,
      ratio: 0,
      state: "indeterminate",
    };
  }

  const normalizedValue = Math.min(normalizedMax, Math.max(normalizedMin, value));
  const ratio = (normalizedValue - normalizedMin) / (normalizedMax - normalizedMin);

  return {
    min: normalizedMin,
    max: normalizedMax,
    value: normalizedValue,
    ratio: Math.min(1, Math.max(0, ratio)),
    state: normalizedValue >= normalizedMax ? "complete" : "progressing",
  };
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    className,
    label,
    max = 100,
    min = 0,
    style,
    value = null,
    valueLabel,
    valueText,
    ...props
  },
  ref,
) {
  const normalized = normalizeProgress(value, min, max);
  const generatedId = React.useId();
  const labelId = label === undefined ? undefined : `${generatedId}-label`;
  const progressStyle = {
    ...style,
    "--n-progress-ratio": normalized.ratio,
  } as React.CSSProperties;

  return (
    <div
      ref={ref}
      {...props}
      aria-label={labelId === undefined ? ariaLabel : undefined}
      aria-labelledby={labelId ?? (ariaLabel === undefined ? ariaLabelledBy : undefined)}
      aria-valuemax={normalized.max}
      aria-valuemin={normalized.min}
      aria-valuenow={normalized.value}
      aria-valuetext={valueText}
      className={cn("n-progress", className)}
      data-slot="root"
      data-state={normalized.state}
      role="progressbar"
      style={progressStyle}
    >
      {label !== undefined || valueLabel !== undefined ? (
        <div data-slot="header">
          {label !== undefined ? (
            <span id={labelId} data-slot="label">
              {label}
            </span>
          ) : null}
          {valueLabel !== undefined ? <span data-slot="value">{valueLabel}</span> : null}
        </div>
      ) : null}
      <div aria-hidden="true" data-slot="track">
        <span aria-hidden="true" data-slot="indicator" />
      </div>
    </div>
  );
});
