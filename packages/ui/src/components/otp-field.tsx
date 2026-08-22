"use client";

import * as React from "react";
import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import type { NerioChangeEventDetails, NerioEventDetails } from "../lib/component-props";
import { composeRefs } from "../lib/compose-refs";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { FormMessage } from "./form-message";

export type OTPFieldSize = "sm" | "md" | "lg";
export type OTPFieldValidationType = "numeric" | "alpha" | "alphanumeric";
export type OTPFieldChangeReason = "input-change" | "input-clear" | "input-paste" | "keyboard";
export type OTPFieldCompleteReason = "input-change" | "input-paste";
export type OTPFieldInvalidReason = "input-change" | "input-paste";
export type OTPFieldChangeEventDetails = NerioChangeEventDetails<OTPFieldChangeReason>;
export type OTPFieldCompleteEventDetails = NerioEventDetails<OTPFieldCompleteReason>;
export type OTPFieldInvalidEventDetails = NerioEventDetails<OTPFieldInvalidReason>;

type OTPFieldRootProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "defaultValue" | "onChange"
>;

export interface OTPFieldProps extends OTPFieldRootProps {
  label: React.ReactNode;
  length: number;
  description?: React.ReactNode;
  message?: React.ReactNode;
  invalid?: boolean;
  size?: OTPFieldSize;
  validationType?: OTPFieldValidationType;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails: OTPFieldChangeEventDetails) => void;
  onValueComplete?: (value: string, eventDetails: OTPFieldCompleteEventDetails) => void;
  onValueInvalid?: (value: string, eventDetails: OTPFieldInvalidEventDetails) => void;
  name?: string;
  form?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  getSlotLabel?: (index: number, length: number) => string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const rootClasses =
  "n-field n-otp-field grid content-start gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)";

const groupClasses =
  "n-otp-field-group flex max-w-full flex-wrap items-center gap-(--n-input-addon-gap)";

const slotClasses =
  "n-otp-field-input h-(--n-input-height-md) w-(--n-input-height-md) min-w-0 appearance-none rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) p-0 text-center text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) caret-(--n-color-text-primary) outline-0 [font-variant-numeric:tabular-nums] data-[size=sm]:h-(--n-input-height-sm) data-[size=sm]:w-(--n-input-height-sm) data-[size=lg]:h-(--n-input-height-lg) data-[size=lg]:w-(--n-input-height-lg) data-filled:bg-(--n-color-surface-muted) [&:hover:not(:disabled):not([readonly])]:border-(--n-input-border-hover) [&:hover:not(:disabled):not([readonly])]:bg-(--n-input-background-hover) focus:border-(--n-input-border-focus) focus:shadow-(--n-focus-ring) data-invalid:border-(--n-input-border-danger) data-invalid:focus:border-(--n-input-border-danger) disabled:cursor-not-allowed disabled:bg-(--n-input-disabled-background) disabled:text-(--n-input-disabled-foreground) disabled:opacity-(--n-input-disabled-opacity) read-only:cursor-default read-only:border-(--n-input-readonly-border) read-only:bg-(--n-input-readonly-background) forced-colors:border-[CanvasText] forced-colors:focus:outline-2 forced-colors:focus:outline-offset-2 forced-colors:focus:outline-[Highlight] forced-colors:focus:shadow-none";

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

function validateLength(length: number) {
  if (!Number.isInteger(length) || length < 1) {
    throw new RangeError("OTPField length must be a positive integer.");
  }
}

export const OTPField = React.forwardRef<HTMLDivElement, OTPFieldProps>(function OTPField(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    autoComplete = "one-time-code",
    className,
    defaultValue,
    description,
    disabled = false,
    form,
    getSlotLabel,
    id,
    inputMode,
    inputRef,
    invalid = false,
    label,
    length,
    message,
    name,
    onValueChange,
    onValueComplete,
    onValueInvalid,
    readOnly = false,
    required = false,
    size = "md",
    style,
    validationType = "numeric",
    value,
    ...props
  },
  ref,
) {
  validateLength(length);
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const labelId = `${controlId}-label`;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, messageId);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const firstInputRef = React.useRef<HTMLInputElement>(null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue ?? "");
  const currentValue = value === undefined ? uncontrolledValue : value;
  const resetStateRef = React.useRef({ defaultValue, value });
  resetStateRef.current = { defaultValue, value };
  const defaultGetSlotLabel = React.useCallback(
    (index: number, slotCount: number) =>
      `${validationType === "numeric" ? "Digit" : "Character"} ${index + 1} of ${slotCount}`,
    [validationType],
  );
  const resolveSlotLabel = getSlotLabel ?? defaultGetSlotLabel;
  const separatorIndex = length >= 6 && length % 2 === 0 ? length / 2 : -1;

  React.useEffect(() => {
    const owningForm = firstInputRef.current?.form;
    if (!owningForm) return undefined;
    let active = true;
    const resetTimeouts = new Set<ReturnType<typeof setTimeout>>();
    const handleReset = (event: Event) => {
      if (event.target !== owningForm) return;
      const timeout = setTimeout(() => {
        resetTimeouts.delete(timeout);
        if (!active || event.defaultPrevented) return;
        const resetState = resetStateRef.current;
        if (resetState.value === undefined) setUncontrolledValue(resetState.defaultValue ?? "");
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
    <BaseOTPField.Root
      ref={ref}
      aria-describedby={describedBy}
      aria-invalid={isInvalid ? true : ariaInvalid}
      aria-labelledby={labelId}
      autoComplete={autoComplete}
      className={cn(rootClasses, className)}
      disabled={disabled}
      form={form}
      id={controlId}
      inputMode={inputMode}
      length={length}
      name={name}
      onValueChange={(nextValue, eventDetails) => {
        onValueChange?.(nextValue, eventDetails);
        if (value === undefined && !eventDetails.isCanceled) setUncontrolledValue(nextValue);
      }}
      onValueComplete={(nextValue, eventDetails) => onValueComplete?.(nextValue, eventDetails)}
      onValueInvalid={(attemptedValue, eventDetails) =>
        onValueInvalid?.(attemptedValue, eventDetails)
      }
      readOnly={readOnly}
      required={required}
      role="group"
      style={style}
      validationType={validationType}
      value={currentValue}
      {...props}
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
        id={labelId}
      >
        {label}
      </label>
      <div className={groupClasses} data-slot="input-group">
        {Array.from({ length }, (_, index) => (
          <React.Fragment key={index}>
            {index === separatorIndex ? (
              <span
                aria-hidden="true"
                className="n-otp-field-separator select-none text-(--n-color-text-tertiary)"
                data-slot="separator"
              >
                –
              </span>
            ) : null}
            <BaseOTPField.Input
              ref={index === 0 ? composeRefs(firstInputRef, inputRef) : undefined}
              aria-describedby={describedBy}
              aria-invalid={isInvalid ? true : ariaInvalid}
              aria-label={resolveSlotLabel(index, length)}
              className={cn(slotClasses, motionClasses.control)}
              data-size={size}
              data-slot="input"
            />
          </React.Fragment>
        ))}
      </div>
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
    </BaseOTPField.Root>
  );
});
