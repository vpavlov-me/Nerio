"use client";

import * as React from "react";
import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import { FormMessage } from "./form-message";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";

export interface RadioGroupOption {
  label: React.ReactNode;
  value: string;
  disabled?: boolean;
  description?: React.ReactNode;
}

export type RadioGroupChangeEventDetails = NerioChangeEventDetails<"none">;
export interface RadioGroupState {
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
}

type SharedRadioGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "defaultValue" | "onChange" | "style"
> & {
  className?: NerioClassName<RadioGroupState>;
  defaultValue?: string;
  disabled?: boolean;
  form?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  label: React.ReactNode;
  name?: string;
  readOnly?: boolean;
  render?: NerioRenderProp<RadioGroupState>;
  required?: boolean;
  style?: NerioStyle<RadioGroupState>;
  value?: string;
  description?: React.ReactNode;
  invalid?: boolean;
  message?: React.ReactNode;
  onValueChange?: (value: string, eventDetails: RadioGroupChangeEventDetails) => void;
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

export interface RadioGroupItemState {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  touched: boolean;
  dirty: boolean;
  valid: boolean | null;
  filled: boolean;
  focused: boolean;
}
export interface RadioGroupItemProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "children" | "className" | "color" | "style"
> {
  className?: NerioClassName<RadioGroupItemState>;
  children: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  nativeButton?: boolean;
  readOnly?: boolean;
  render?: NerioRenderProp<RadioGroupItemState>;
  required?: boolean;
  style?: NerioStyle<RadioGroupItemState>;
  value: string;
}

const radioClasses =
  "n-radio mt-(--n-space-0-5) inline-flex size-(--n-radio-size) cursor-pointer items-center justify-center rounded-(--n-radio-radius) border-(length:--n-input-border-width) border-(--n-color-border-subtle) bg-(--n-input-background) text-(--n-color-action-primary) [&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-color-border-default) [&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-checked:border-(--n-color-action-primary) data-checked:bg-(--n-color-action-primary) data-checked:text-(--n-color-action-on-primary) data-checked:[&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-color-action-primary-hover) data-checked:[&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-color-action-primary-hover) data-checked:[&:active:not([data-disabled]):not([data-readonly])]:border-(--n-color-action-primary-active) data-checked:[&:active:not([data-disabled]):not([data-readonly])]:bg-(--n-color-action-primary-active) data-disabled:cursor-not-allowed data-disabled:opacity-(--n-input-disabled-opacity) data-readonly:cursor-default data-invalid:border-(--n-input-border-danger) data-checked:[&>[data-slot=indicator]]:scale-100 data-checked:[&>[data-slot=indicator]]:opacity-100 forced-colors:border-[CanvasText] forced-colors:data-checked:[&>[data-slot=indicator]]:bg-[Highlight] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight]";

export const RadioGroupItem = React.forwardRef<HTMLElement, RadioGroupItemProps>(
  function RadioGroupItem(
    { children, className, description, disabled, readOnly, value, ...props },
    ref,
  ) {
    return (
      <label
        className="n-radio-option inline-grid cursor-pointer grid-cols-[auto_1fr] items-start gap-(--n-space-2) text-(--n-color-text-secondary) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-readonly:cursor-default"
        data-disabled={disabled ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-slot="option"
      >
        <Radio.Root
          ref={ref}
          className={(state) =>
            cn(radioClasses, motionClasses.control, resolveClassName(className, state))
          }
          disabled={disabled}
          readOnly={readOnly}
          {...props}
          data-disabled={disabled ? "" : undefined}
          data-readonly={readOnly ? "" : undefined}
          data-slot="control"
          value={value}
        >
          <Radio.Indicator
            className="n-radio__indicator size-(--n-radio-dot-size) scale-[0.8] rounded-(--n-radio-radius) bg-current opacity-0 transition-[opacity,scale] duration-(--n-duration-fast) motion-reduce:duration-0"
            data-slot="indicator"
          />
        </Radio.Root>
        <span
          className="n-radio-option__content grid gap-(--n-space-1) [&_[data-slot=option-description]]:text-(length:--n-font-size-sm) [&_[data-slot=option-description]]:text-(--n-color-text-tertiary)"
          data-slot="option-content"
        >
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
        "n-field n-radio-field grid gap-(--n-field-gap) data-invalid:[&_.n-radio]:border-(--n-input-border-danger) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)",
        typeof className === "string" ? className : undefined,
      )}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
    >
      <span
        className="n-label text-(length:--n-label-font-size) font-(--n-label-font-weight) text-(--n-color-text-primary)"
        data-slot="label"
        id={labelId}
      >
        {label}
      </span>
      {description ? (
        <p
          className="n-field__description m-0 text-(length:--n-helper-font-size) text-(--n-color-text-tertiary)"
          data-slot="description"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      <BaseRadioGroup<string>
        ref={ref}
        className={(state) =>
          cn(
            "grid gap-(--n-space-2)",
            typeof className === "function" ? resolveClassName(className, state) : undefined,
          )
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
        onValueChange={onValueChange}
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
