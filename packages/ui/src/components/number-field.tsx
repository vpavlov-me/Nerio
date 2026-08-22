"use client";

import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Minus, Plus } from "@nerio-ui/adapters/icons";
import type { NerioChangeEventDetails, NerioEventDetails } from "../lib/component-props";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { FormMessage } from "./form-message";
import { Icon } from "./icon";

export type NumberFieldSize = "sm" | "md" | "lg";
export type NumberFieldStep = number | "any";
export type NumberFieldDirection = -1 | 1;

export type NumberFieldChangeReason =
  | "input-change"
  | "input-clear"
  | "input-blur"
  | "input-paste"
  | "keyboard"
  | "increment-press"
  | "decrement-press"
  | "wheel"
  | "scrub"
  | "none";
export type NumberFieldCommitReason =
  | "input-blur"
  | "input-clear"
  | "keyboard"
  | "increment-press"
  | "decrement-press"
  | "wheel"
  | "scrub"
  | "none";
export type NumberFieldChangeEventDetails = NerioChangeEventDetails<
  NumberFieldChangeReason,
  { direction?: NumberFieldDirection }
>;
export type NumberFieldCommitEventDetails = NerioEventDetails<NumberFieldCommitReason>;

type UnsupportedNumberFormatKeys =
  "currency" | "currencyDisplay" | "currencySign" | "style" | "unit" | "unitDisplay";

/** Decimal display options only. Currency and unit policy remain consumer-owned. */
export type NumberFieldFormatOptions = Omit<
  Intl.NumberFormatOptions,
  UnsupportedNumberFormatKeys
> & {
  style?: "decimal";
};

type NumberFieldRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
>;

export interface NumberFieldProps extends NumberFieldRootProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  invalid?: boolean;
  size?: NumberFieldSize;
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null, eventDetails: NumberFieldChangeEventDetails) => void;
  onValueCommitted?: (value: number | null, eventDetails: NumberFieldCommitEventDetails) => void;
  min?: number;
  max?: number;
  step?: NumberFieldStep;
  smallStep?: number;
  largeStep?: number;
  snapOnStep?: boolean;
  locale?: Intl.LocalesArgument;
  format?: NumberFieldFormatOptions;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  autoComplete?: string;
  decrementLabel?: string;
  incrementLabel?: string;
  roleDescription?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const rootClasses =
  "n-field n-number-field grid content-start gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)";

const groupClasses =
  "n-number-field-group grid min-h-(--n-input-height-md) w-full grid-cols-[auto_minmax(0,1fr)_auto] items-stretch overflow-hidden rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) text-(--n-input-foreground) data-[size=sm]:min-h-(--n-input-height-sm) data-[size=lg]:min-h-(--n-input-height-lg) [&:hover:not([data-disabled]):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) focus-within:border-(--n-input-border-focus) focus-within:shadow-(--n-focus-ring) data-invalid:border-(--n-input-border-danger) data-invalid:focus-within:border-(--n-input-border-danger) data-disabled:cursor-not-allowed data-disabled:bg-(--n-input-disabled-background) data-disabled:text-(--n-input-disabled-foreground) data-disabled:opacity-(--n-input-disabled-opacity) data-readonly:cursor-default data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background) forced-colors:border-[CanvasText] forced-colors:focus-within:outline-2 forced-colors:focus-within:outline-offset-2 forced-colors:focus-within:outline-[Highlight] forced-colors:focus-within:shadow-none";

const inputClasses =
  "n-number-field-input min-h-[inherit] min-w-0 w-full appearance-none border-0 bg-transparent px-(--n-input-padding-inline) text-start text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) outline-0 placeholder:text-(--n-input-placeholder) disabled:cursor-not-allowed";

const stepperClasses =
  "n-number-field-stepper inline-flex w-(--n-size-control-sm) cursor-pointer touch-none select-none items-center justify-center bg-transparent p-0 text-(--n-color-text-tertiary) [&:hover:not(:disabled):not([aria-disabled=true])]:bg-(--n-color-surface-muted) [&:hover:not(:disabled):not([aria-disabled=true])]:text-(--n-color-text-primary) focus-visible:z-1 focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:text-(--n-color-text-disabled) disabled:opacity-(--n-opacity-disabled) aria-disabled:cursor-not-allowed aria-disabled:text-(--n-color-text-disabled) aria-disabled:opacity-(--n-opacity-disabled) forced-colors:border-[CanvasText] forced-colors:focus-visible:outline-2 forced-colors:focus-visible:outline-offset-2 forced-colors:focus-visible:outline-[Highlight] forced-colors:focus-visible:shadow-none";

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function assertFiniteNumber(name: string, value: number | null | undefined) {
  if (value !== null && value !== undefined && !Number.isFinite(value)) {
    throw new RangeError(`NumberField ${name} must be a finite number.`);
  }
}

function validateNumericContract({
  defaultValue,
  format,
  largeStep,
  max,
  min,
  smallStep,
  step,
  value,
}: Pick<
  NumberFieldProps,
  "defaultValue" | "format" | "largeStep" | "max" | "min" | "smallStep" | "step" | "value"
>) {
  assertFiniteNumber("value", value);
  assertFiniteNumber("defaultValue", defaultValue);
  assertFiniteNumber("min", min);
  assertFiniteNumber("max", max);
  assertFiniteNumber("smallStep", smallStep);
  assertFiniteNumber("largeStep", largeStep);
  if (step !== "any") assertFiniteNumber("step", step);
  if (min !== undefined && max !== undefined && min > max) {
    throw new RangeError("NumberField min must be less than or equal to max.");
  }
  for (const [name, amount] of [
    ["step", step],
    ["smallStep", smallStep],
    ["largeStep", largeStep],
  ] as const) {
    if (amount !== undefined && amount !== "any" && amount <= 0) {
      throw new RangeError(`NumberField ${name} must be greater than zero.`);
    }
  }
  if (format?.style !== undefined && format.style !== "decimal") {
    throw new RangeError("NumberField supports decimal formatting only.");
  }
}

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(function NumberField(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    autoComplete,
    className,
    decrementLabel = "Decrease value",
    defaultValue,
    description,
    disabled = false,
    form,
    format,
    id,
    incrementLabel = "Increase value",
    inputRef,
    invalid = false,
    label,
    largeStep,
    locale = "en-US",
    max,
    message,
    min,
    name,
    onValueChange,
    onValueCommitted,
    placeholder,
    readOnly = false,
    required = false,
    roleDescription = "Number field",
    size = "md",
    smallStep,
    snapOnStep = false,
    step,
    style,
    value,
    ...props
  },
  ref,
) {
  validateNumericContract({ defaultValue, format, largeStep, max, min, smallStep, step, value });
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, messageId);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const hiddenInputRef = React.useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<number | null>(
    defaultValue ?? null,
  );
  const currentValue = value === undefined ? uncontrolledValue : value;
  const resetStateRef = React.useRef({ defaultValue, value });
  resetStateRef.current = { defaultValue, value };

  React.useEffect(() => {
    const owningForm = hiddenInputRef.current?.form;
    if (!owningForm) return undefined;
    let active = true;
    const resetTimeouts = new Set<ReturnType<typeof setTimeout>>();
    const handleReset = (event: Event) => {
      if (event.target !== owningForm) return;
      const timeout = setTimeout(() => {
        resetTimeouts.delete(timeout);
        if (!active || event.defaultPrevented) return;
        const resetState = resetStateRef.current;
        if (resetState.value === undefined) {
          setUncontrolledValue(resetState.defaultValue ?? null);
        }
      }, 0);
      resetTimeouts.add(timeout);
    };
    owningForm.addEventListener("reset", handleReset);
    return () => {
      active = false;
      resetTimeouts.forEach(clearTimeout);
      owningForm.removeEventListener("reset", handleReset);
    };
  }, [form]);

  return (
    <BaseNumberField.Root
      ref={ref}
      allowWheelScrub={false}
      className={cn(rootClasses, className)}
      disabled={disabled}
      form={form}
      format={format}
      id={controlId}
      inputRef={hiddenInputRef}
      largeStep={largeStep}
      locale={locale}
      max={max}
      min={min}
      name={name}
      onValueChange={(nextValue, eventDetails) => {
        onValueChange?.(nextValue, eventDetails);
        if (value === undefined && !eventDetails.isCanceled) setUncontrolledValue(nextValue);
      }}
      onValueCommitted={(nextValue, eventDetails) => onValueCommitted?.(nextValue, eventDetails)}
      readOnly={readOnly}
      required={required}
      smallStep={smallStep}
      snapOnStep={snapOnStep}
      step={step}
      style={style}
      value={currentValue}
      {...props}
      aria-invalid={isInvalid ? true : ariaInvalid}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-required={required ? "" : undefined}
      data-size={size}
      data-slot="root"
    >
      <label
        className="n-label text-(length:--n-label-font-size) font-(--n-label-font-weight) text-(--n-color-text-primary)"
        data-slot="label"
        htmlFor={controlId}
      >
        {label}
      </label>
      <BaseNumberField.Group
        className={cn(groupClasses, motionClasses.control)}
        data-invalid={isInvalid ? "" : undefined}
        data-size={size}
        data-slot="input-group"
      >
        <BaseNumberField.Decrement
          aria-label={decrementLabel}
          className={cn(
            stepperClasses,
            "border-0 border-e-(length:--n-input-border-width) border-e-(--n-input-border)",
          )}
          data-slot="decrement"
        >
          <Icon icon={Minus} />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          ref={inputRef}
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? true : ariaInvalid}
          aria-roledescription={roleDescription}
          autoComplete={autoComplete}
          className={inputClasses}
          placeholder={placeholder}
          data-slot="input"
        />
        <BaseNumberField.Increment
          aria-label={incrementLabel}
          className={cn(
            stepperClasses,
            "border-0 border-s-(length:--n-input-border-width) border-s-(--n-input-border)",
          )}
          data-slot="increment"
        >
          <Icon icon={Plus} />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
      {description ? (
        <p
          className="n-field__description m-0 text-(length:--n-helper-font-size) text-(--n-color-text-tertiary)"
          data-slot="description"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
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
    </BaseNumberField.Root>
  );
});
