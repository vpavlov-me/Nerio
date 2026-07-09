"use client";

import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { FormMessage } from "./form-message";
import { cn } from "../lib/cn";

export interface RadioGroupOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  description?: React.ReactNode;
}

export interface RadioGroupProps extends Omit<
  React.ComponentProps<typeof BaseRadioGroup<string>>,
  "children" | "onChange" | "onValueChange"
> {
  label: React.ReactNode;
  options: RadioGroupOption[];
  description?: React.ReactNode;
  invalid?: boolean;
  message?: React.ReactNode;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    className,
    description,
    invalid = false,
    label,
    message,
    onChange,
    onValueChange,
    options,
    required,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const labelId = `${generatedId}-label`;
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const messageId = message ? `${generatedId}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={cn("n-field n-radio-field", className)}
      data-invalid={invalid ? "" : undefined}
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
        aria-describedby={describedBy}
        aria-invalid={invalid ? true : undefined}
        aria-labelledby={labelId}
        data-invalid={invalid ? "" : undefined}
        data-slot="group"
        required={required}
        onValueChange={(nextValue) => {
          onValueChange?.(nextValue);
          onChange?.(nextValue);
        }}
        {...props}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="n-radio-option"
            data-disabled={option.disabled ? "" : undefined}
            data-slot="option"
          >
            <Radio.Root
              className="n-radio"
              data-invalid={invalid ? "" : undefined}
              data-slot="control"
              disabled={option.disabled}
              required={required}
              value={option.value}
            >
              <Radio.Indicator className="n-radio__indicator" data-slot="indicator" />
            </Radio.Root>
            <span className="n-radio-option__content" data-slot="option-content">
              <span data-slot="option-label">{option.label}</span>
              {option.description ? (
                <span data-slot="option-description">{option.description}</span>
              ) : null}
            </span>
          </label>
        ))}
      </BaseRadioGroup>
      {message ? (
        <FormMessage
          data-slot="message"
          id={messageId}
          role={invalid ? "alert" : undefined}
          tone={invalid ? "danger" : "neutral"}
        >
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
});
