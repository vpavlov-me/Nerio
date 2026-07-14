"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@nerio/adapters/icons";
import { cn } from "../lib/cn";
import { resolveClassName } from "../lib/resolve-class-name";
import { Icon } from "./icon";

export interface CheckboxProps extends React.ComponentProps<typeof BaseCheckbox.Root> {
  invalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    className,
    children,
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
    <BaseCheckbox.Root
      ref={ref}
      className={(state) => cn("n-checkbox", resolveClassName(className, state))}
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
      <BaseCheckbox.Indicator keepMounted className="n-checkbox__indicator" data-slot="indicator">
        {children ?? (
          <>
            <Icon className="n-checkbox__check" icon={Check} />
            <Icon className="n-checkbox__minus" icon={Minus} />
          </>
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <span className="n-checkbox-field" data-slot="field">
      {control}
      <span className="n-checkbox__content">
        {label ? (
          <span className="n-checkbox__label" data-slot="label" id={labelId}>
            {label}
          </span>
        ) : null}
        {description ? (
          <span className="n-checkbox__description" data-slot="description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </span>
    </span>
  );
});
