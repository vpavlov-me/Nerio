"use client";

import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "../lib/cn";
import { resolveClassName } from "../lib/resolve-class-name";
import { FormMessage } from "./form-message";

export interface RadioGroupOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  description?: React.ReactNode;
}

type BaseRadioGroupProps = Omit<
  React.ComponentProps<typeof BaseRadioGroup<string>>,
  "children" | "onChange" | "onValueChange"
>;

type SharedRadioGroupProps = BaseRadioGroupProps & {
  label: React.ReactNode;
  description?: React.ReactNode;
  invalid?: boolean;
  message?: React.ReactNode;
  onValueChange?: (
    value: string,
    eventDetails: Parameters<
      NonNullable<React.ComponentProps<typeof BaseRadioGroup<string>>["onValueChange"]>
    >[1],
  ) => void;
  /** @deprecated Prefer onValueChange for Base UI event details. */
  onChange?: (value: string) => void;
};

type OptionsRadioGroupProps = {
  options: RadioGroupOption[];
  children?: never;
};

type ComposedRadioGroupProps = {
  children: React.ReactNode;
  options?: never;
};

export type RadioGroupProps = SharedRadioGroupProps &
  (OptionsRadioGroupProps | ComposedRadioGroupProps);

export interface RadioGroupItemProps extends Omit<
  React.ComponentProps<typeof Radio.Root<string>>,
  "children" | "className" | "value"
> {
  className?: React.ComponentProps<typeof Radio.Root<string>>["className"];
  children: React.ReactNode;
  description?: React.ReactNode;
  value: string;
}

export const RadioGroupItem = React.forwardRef<HTMLElement, RadioGroupItemProps>(
  function RadioGroupItem(
    { children, className, description, disabled, readOnly, value, ...props },
    ref,
  ) {
    return (
      <label
        className="n-radio-option"
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-slot="option"
      >
        <Radio.Root
          ref={ref}
          className={(state) => cn("n-radio", resolveClassName(className, state))}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
          data-disabled={disabled ? "" : undefined}
          data-readonly={readOnly ? "" : undefined}
          data-slot="control"
          value={value}
        >
          <Radio.Indicator className="n-radio__indicator" data-slot="indicator" />
        </Radio.Root>
        <span className="n-radio-option__content" data-slot="option-content">
          <span data-slot="option-label">{children}</span>
          {description ? <span data-slot="option-description">{description}</span> : null}
        </span>
      </label>
    );
  },
);

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-labelledby": ariaLabelledBy,
    className,
    description,
    disabled,
    invalid = false,
    label,
    message,
    onChange,
    onValueChange,
    options,
    readOnly,
    required,
    children,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const messageId = message ? `${generatedId}-message` : undefined;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const renderedItems = options
    ? options.map((option) => (
        <RadioGroupItem
          key={option.value}
          disabled={option.disabled}
          description={option.description}
          value={option.value}
        >
          {option.label}
        </RadioGroupItem>
      ))
    : children;

  return (
    <div
      className={cn(
        "n-field",
        "n-radio-field",
        typeof className === "string" ? className : undefined,
      )}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
    >
      <span className="n-label" data-slot="label" id={labelId}>
        {label}
      </span>
      {description ? (
        <p className="n-field__description" data-slot="description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      <BaseRadioGroup<string>
        ref={ref}
        className={(state) =>
          typeof className === "function" ? resolveClassName(className, state) : undefined
        }
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        {...props}
        aria-describedby={mergeIds(ariaDescribedBy, descriptionId, messageId)}
        aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
        aria-labelledby={mergeIds(ariaLabelledBy, labelId)}
        data-disabled={disabled ? "" : undefined}
        data-invalid={isInvalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-slot="group"
        onValueChange={(value, eventDetails) => {
          onValueChange?.(value, eventDetails);
          onChange?.(value);
        }}
      >
        {renderedItems}
      </BaseRadioGroup>
      {message ? (
        <FormMessage
          data-slot="message"
          id={messageId}
          role={isInvalid ? "alert" : undefined}
          tone={isInvalid ? "danger" : "neutral"}
        >
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
});
