export interface ProgressProps {
  value: number;
  label?: string;
}

export function Progress({ value, label }: ProgressProps) {
  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className="n-progress" data-slot="root">
      {label ? <span data-slot="label">{label}</span> : null}
      <div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={clampedValue}>
        <span data-slot="indicator" style={{ width: `${clampedValue}%` }} />
      </div>
    </div>
  );
}
