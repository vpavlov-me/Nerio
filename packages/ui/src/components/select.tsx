"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "@nerio/adapters";
import { Icon } from "./icon";
import { FormMessage } from "./form-message";
import { cn } from "../lib/cn";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  label: string;
  options: SelectOption[];
  name?: string;
  form?: string;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  disabled?: boolean;
  invalid?: boolean;
  description?: React.ReactNode;
  message?: React.ReactNode;
  placeholder?: React.ReactNode;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onChange?: (value: string) => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    label,
    options,
    id,
    name,
    form,
    required,
    readOnly,
    autoComplete,
    disabled,
    invalid = false,
    description,
    message,
    placeholder = "Select",
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    value,
    defaultValue,
    onValueChange,
    onChange,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy =
    [ariaDescribedBy, descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      ref={ref}
      className={cn("n-field n-select-field", className)}
      data-invalid={invalid ? "" : undefined}
      data-slot="root"
      {...props}
    >
      <label className="n-label" data-slot="label" htmlFor={controlId}>
        {label}
      </label>
      <BaseSelect.Root<string>
        id={controlId}
        name={name}
        form={form}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        items={options}
        onValueChange={(nextValue) => {
          if (typeof nextValue === "string") {
            onValueChange?.(nextValue);
            onChange?.(nextValue);
          }
        }}
      >
        <BaseSelect.Trigger
          id={controlId}
          className="n-select-trigger"
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
          aria-required={required ? true : undefined}
          data-invalid={invalid ? "" : undefined}
          data-slot="trigger"
        >
          <BaseSelect.Value data-slot="value" placeholder={placeholder} />
          <BaseSelect.Icon data-slot="icon">
            <Icon icon={ChevronDown} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner className="n-popover-positioner">
            <BaseSelect.Popup className="n-select-popup" data-slot="content">
              <BaseSelect.List>
                {options.map((option) => (
                  <BaseSelect.Item
                    key={option.value}
                    className="n-select-item"
                    data-slot="item"
                    disabled={option.disabled}
                    value={option.value}
                  >
                    <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                    <BaseSelect.ItemIndicator data-slot="indicator">
                      <Icon icon={Check} />
                    </BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {description ? (
        <p className="n-field__description" data-slot="description" id={descriptionId}>
          {description}
        </p>
      ) : null}
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
