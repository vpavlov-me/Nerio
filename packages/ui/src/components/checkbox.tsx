"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import { Icon } from "./icon";

export interface CheckboxProps extends React.ComponentProps<typeof BaseCheckbox.Root> {
  invalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const checkboxClasses =
  "n-checkbox inline-flex size-(--n-checkbox-size) cursor-pointer items-center justify-center rounded-(--n-checkbox-radius) border-(length:--n-checkbox-border-width) border-(--n-color-border-subtle) bg-(--n-input-background) align-middle text-(--n-color-action-on-primary) [&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-color-border-default) [&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-checked:border-(--n-color-action-primary) data-checked:bg-(--n-color-action-primary) data-indeterminate:border-(--n-color-action-primary) data-indeterminate:bg-(--n-color-action-primary) data-checked:[&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-color-action-primary-hover) data-checked:[&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-color-action-primary-hover) data-indeterminate:[&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-color-action-primary-hover) data-indeterminate:[&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-color-action-primary-hover) data-checked:[&:active:not([data-disabled]):not([data-readonly])]:border-(--n-color-action-primary-active) data-checked:[&:active:not([data-disabled]):not([data-readonly])]:bg-(--n-color-action-primary-active) data-indeterminate:[&:active:not([data-disabled]):not([data-readonly])]:border-(--n-color-action-primary-active) data-indeterminate:[&:active:not([data-disabled]):not([data-readonly])]:bg-(--n-color-action-primary-active) data-invalid:border-(--n-input-border-danger) aria-invalid:border-(--n-input-border-danger) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-disabled:opacity-(--n-input-disabled-opacity) data-readonly:cursor-default data-checked:[&>[data-slot=indicator]]:scale-100 data-checked:[&>[data-slot=indicator]]:opacity-100 data-indeterminate:[&>[data-slot=indicator]]:scale-100 data-indeterminate:[&>[data-slot=indicator]]:opacity-100 data-checked:[&>[data-slot=indicator]>[data-slot=check]]:block data-indeterminate:[&>[data-slot=indicator]>[data-slot=minus]]:block forced-colors:border-[CanvasText] forced-colors:data-checked:border-[Highlight] forced-colors:data-checked:bg-[Highlight] forced-colors:data-checked:text-[HighlightText] forced-colors:data-indeterminate:border-[Highlight] forced-colors:data-indeterminate:bg-[Highlight] forced-colors:data-indeterminate:text-[HighlightText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight]";

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
      className={(state) =>
        cn(checkboxClasses, motionClasses.control, resolveClassName(className, state))
      }
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
      <BaseCheckbox.Indicator
        keepMounted
        className="n-checkbox__indicator inline-flex scale-[0.8] items-center text-(length:--n-font-size-xs) leading-none opacity-0 transition-[opacity,scale] duration-(--n-duration-fast) motion-reduce:duration-0"
        data-slot="indicator"
      >
        {children ?? (
          <>
            <Icon className="n-checkbox__check hidden" data-slot="check" icon={Check} />
            <Icon className="n-checkbox__minus hidden" data-slot="minus" icon={Minus} />
          </>
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <span
      className="n-checkbox-field inline-grid grid-cols-[auto_minmax(0,1fr)] items-start gap-(--n-space-2) data-disabled:[&_[data-slot=label]]:text-(--n-color-text-disabled) data-disabled:[&_[data-slot=description]]:text-(--n-color-text-disabled) data-readonly:cursor-default [&>.n-checkbox]:mt-(--n-space-0-5)"
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="field"
    >
      {control}
      <span className="n-checkbox__content grid gap-(--n-space-1)">
        {label ? (
          <span
            className="n-checkbox__label text-(--n-color-text-primary)"
            data-slot="label"
            id={labelId}
          >
            {label}
          </span>
        ) : null}
        {description ? (
          <span
            className="n-checkbox__description text-(length:--n-font-size-sm) text-(--n-color-text-tertiary)"
            data-slot="description"
            id={descriptionId}
          >
            {description}
          </span>
        ) : null}
      </span>
    </span>
  );
});
