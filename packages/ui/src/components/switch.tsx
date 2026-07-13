"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../lib/cn";
import { resolveClassName } from "../lib/resolve-class-name";

export interface SwitchProps extends React.ComponentProps<typeof BaseSwitch.Root> {
  invalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    children: _children,
    className,
    description,
    disabled,
    invalid = false,
    label,
    readOnly,
    ...props
  },
  ref,
) {
  const ariaInvalid = props["aria-invalid"];
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const labelId = React.useId();
  const descriptionId = React.useId();
  const labelledBy = [ariaLabelledBy, label ? labelId : undefined].filter(Boolean).join(" ");
  const describedBy = [ariaDescribedBy, description ? descriptionId : undefined]
    .filter(Boolean)
    .join(" ");

  const control = (
    <BaseSwitch.Root
      ref={ref}
      className={(state) => cn("n-switch", resolveClassName(className, state))}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
      aria-describedby={describedBy || undefined}
      aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
      aria-labelledby={labelledBy || undefined}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
    >
      <BaseSwitch.Thumb className="n-switch__thumb" data-slot="thumb" />
    </BaseSwitch.Root>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <span
      className="n-switch-field"
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="field"
    >
      {control}
      <span className="n-switch__content">
        {label ? (
          <span className="n-switch__label" data-slot="label" id={labelId}>
            {label}
          </span>
        ) : null}
        {description ? (
          <span className="n-switch__description" data-slot="description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </span>
    </span>
  );
});
