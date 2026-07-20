"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";

export interface SwitchProps extends React.ComponentProps<typeof BaseSwitch.Root> {
  invalid?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

const switchClasses =
  "n-switch box-border inline-flex h-(--n-switch-height) w-(--n-switch-width) cursor-pointer items-center rounded-(--n-switch-height) border-(length:--n-border-width-default) border-(--n-switch-border) bg-(--n-switch-background) p-(--n-switch-padding) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-checked:border-(--n-switch-background-checked) data-checked:bg-(--n-switch-background-checked) [&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-switch-border-hover) [&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-switch-background-hover) data-checked:[&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-switch-background-checked-hover) data-checked:[&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-switch-background-checked-hover) data-checked:[&:active:not([data-disabled]):not([data-readonly])]:border-(--n-switch-background-checked-active) data-checked:[&:active:not([data-disabled]):not([data-readonly])]:bg-(--n-switch-background-checked-active) data-invalid:border-(--n-switch-border-invalid) aria-invalid:border-(--n-switch-border-invalid) disabled:cursor-not-allowed disabled:border-(--n-color-border-subtle) disabled:opacity-(--n-opacity-disabled) data-disabled:cursor-not-allowed data-disabled:border-(--n-color-border-subtle) data-disabled:opacity-(--n-opacity-disabled) aria-disabled:cursor-not-allowed aria-disabled:border-(--n-color-border-subtle) aria-disabled:opacity-(--n-opacity-disabled) data-readonly:cursor-default data-checked:[&>[data-slot=thumb]]:ms-(--n-switch-thumb-offset) data-checked:[&>[data-slot=thumb]]:bg-(--n-switch-thumb-background-checked) forced-colors:border-[CanvasText] forced-colors:data-checked:border-[Highlight] forced-colors:data-checked:bg-[Highlight] forced-colors:data-checked:text-[HighlightText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight]";

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
      className={(state) =>
        cn(switchClasses, motionClasses.control, resolveClassName(className, state))
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
      <BaseSwitch.Thumb
        className="n-switch__thumb ms-0 size-(--n-switch-thumb-size) flex-none rounded-(--n-switch-thumb-size) border-(length:--n-border-width-default) border-(--n-switch-thumb-border) bg-(--n-switch-thumb-background) transition-[margin-inline-start] duration-(--n-motion-hover-duration) ease-(--n-motion-hover-easing) forced-colors:border-[CanvasText] motion-reduce:duration-(--n-duration-instant)"
        data-slot="thumb"
      />
    </BaseSwitch.Root>
  );

  if (!label && !description) {
    return control;
  }

  return (
    <span
      className="n-switch-field inline-grid grid-cols-[auto_minmax(0,1fr)] items-start gap-(--n-switch-field-gap) data-disabled:[&_*]:cursor-not-allowed data-disabled:cursor-not-allowed data-readonly:cursor-default [&>.n-switch]:mt-(--n-space-0-5)"
      data-disabled={disabled ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="field"
    >
      {control}
      <span className="n-switch__content grid gap-(--n-space-1)">
        {label ? (
          <span
            className="n-switch__label text-(--n-color-text-primary)"
            data-slot="label"
            id={labelId}
          >
            {label}
          </span>
        ) : null}
        {description ? (
          <span
            className="n-switch__description text-(length:--n-font-size-sm) text-(--n-color-text-tertiary)"
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
