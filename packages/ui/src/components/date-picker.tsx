"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDown } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { Button, type ButtonSize } from "./button";
import {
  Calendar,
  calendarDateToUtcDate,
  type CalendarDate,
  type CalendarFirstDayOfWeek,
} from "./calendar";
import { popoverPopupClasses, popoverPositionerClasses } from "./popover";

export interface DatePickerLabels {
  open: string;
  change: string;
  clear: string;
  calendar: string;
  previousMonth: string;
  nextMonth: string;
  selectedDate: string;
}

export type DatePickerOpenChangeEventDetails = Parameters<
  NonNullable<React.ComponentProps<typeof BasePopover.Root>["onOpenChange"]>
>[1];

type DatePickerTriggerProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | "children"
  | "defaultValue"
  | "form"
  | "name"
  | "onChange"
  | "onInvalid"
  | "readOnly"
  | "required"
  | "value"
>;

export interface DatePickerProps extends DatePickerTriggerProps {
  /** Selected ISO calendar date in YYYY-MM-DD form. Use null for a controlled empty value. */
  value?: CalendarDate | null;
  /** Initial ISO calendar date for the uncontrolled path. */
  defaultValue?: CalendarDate | null;
  onValueChange?: (value: CalendarDate | null) => void;
  onInvalid?: React.FormEventHandler<HTMLInputElement>;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails: DatePickerOpenChangeEventDetails) => void;
  name?: string;
  form?: string;
  required?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  min?: CalendarDate;
  max?: CalendarDate;
  isDateDisabled?: (date: CalendarDate) => boolean;
  locale?: string | string[];
  firstDayOfWeek?: CalendarFirstDayOfWeek;
  today?: CalendarDate;
  placeholder?: React.ReactNode;
  formatValue?: (value: CalendarDate, locale?: string | string[]) => React.ReactNode;
  labels?: Partial<DatePickerLabels>;
  clearable?: boolean;
  size?: ButtonSize;
}

const triggerClasses =
  "n-date-picker-trigger w-full justify-between rounded-(--n-input-radius) border-(--n-input-border) bg-(--n-input-background) text-start text-(--n-input-foreground) [&:hover:not(:disabled):not([data-disabled]):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not(:disabled):not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) [&:active:not(:disabled):not([data-disabled]):not([data-readonly])]:bg-(--n-color-surface-control-active) aria-invalid:border-(--n-input-border-danger) data-placeholder:text-(--n-input-placeholder) data-readonly:cursor-default data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background) data-popup-open:[&_[data-slot=button-icon]]:rotate-180";

function defaultFormatValue(value: CalendarDate, locale?: string | string[]) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(calendarDateToUtcDate(value));
}

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

export const DatePicker = React.forwardRef<HTMLElement, DatePickerProps>(function DatePicker(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    className,
    clearable = false,
    defaultOpen,
    defaultValue = null,
    disabled = false,
    firstDayOfWeek,
    form,
    formatValue = defaultFormatValue,
    id,
    invalid = false,
    isDateDisabled,
    labels,
    locale = "en-US",
    max,
    min,
    name,
    onInvalid,
    onOpenChange,
    onValueChange,
    open,
    placeholder = "Choose a date",
    readOnly = false,
    required = false,
    size = "md",
    today,
    value,
    ...triggerProps
  },
  forwardedRef,
) {
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const actionDescriptionId = `${triggerId}-action`;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const triggerRef = React.useRef<HTMLElement>(null);
  const calendarRef = React.useRef<HTMLDivElement>(null);
  const actionsRef = React.useRef<BasePopover.Root.Actions>(null);
  const [uncontrolledValue, setUncontrolledValue] = React.useState<CalendarDate | null>(
    defaultValue,
  );
  const selectedValue = value === undefined ? uncontrolledValue : value;
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const openLabel = labels?.open ?? "Open date picker";
  const changeLabel = labels?.change ?? "Change date";
  const clearLabel = labels?.clear ?? "Clear date";
  const calendarLabel = labels?.calendar ?? "Choose date";
  const actionLabel = selectedValue ? changeLabel : openLabel;
  const displayValue = selectedValue ? formatValue(selectedValue, locale) : placeholder;

  React.useImperativeHandle(forwardedRef, () => triggerRef.current as HTMLElement);

  React.useEffect(() => {
    const input = inputRef.current;
    const ownerForm = input?.form;
    if (!ownerForm || value !== undefined) return;
    const handleReset = () => {
      setUncontrolledValue(defaultValue);
      actionsRef.current?.close();
    };
    ownerForm.addEventListener("reset", handleReset);
    return () => ownerForm.removeEventListener("reset", handleReset);
  }, [defaultValue, value]);

  const setSelectedValue = React.useCallback(
    (nextValue: CalendarDate | null) => {
      if (disabled || readOnly) return;
      if (value === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue);
    },
    [disabled, onValueChange, readOnly, value],
  );

  return (
    <span
      className="n-date-picker relative inline-grid w-full"
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
    >
      <BasePopover.Root
        actionsRef={actionsRef}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        open={open}
      >
        <BasePopover.Trigger
          disabled={disabled}
          render={
            <Button
              ref={triggerRef}
              {...triggerProps}
              aria-describedby={mergeIds(ariaDescribedBy, actionDescriptionId)}
              aria-invalid={isInvalid ? true : ariaInvalid}
              className={cn(triggerClasses, motionClasses.control, className)}
              data-placeholder={selectedValue ? undefined : ""}
              data-readonly={readOnly ? "" : undefined}
              data-slot="trigger"
              id={triggerId}
              size={size}
              trailingIcon={ChevronDown}
              type="button"
              variant="secondary"
            >
              {displayValue}
            </Button>
          }
        />
        <BasePopover.Portal>
          <BasePopover.Positioner
            align="start"
            className={cn(
              popoverPositionerClasses,
              "max-w-(--available-width) max-h-(--available-height)",
            )}
            sideOffset={4}
          >
            <BasePopover.Popup
              className={cn(
                popoverPopupClasses,
                "w-(--n-calendar-width) min-w-0 max-w-(--available-width) gap-(--n-space-2) p-0 [--n-overlay-background:var(--n-calendar-background)] [--n-overlay-control-background:var(--n-calendar-background)] [--n-overlay-control-background-hover:var(--n-calendar-day-background-hover)] [--n-overlay-foreground:var(--n-calendar-foreground)] [--n-overlay-foreground-muted:var(--n-calendar-weekday-foreground)]",
              )}
              data-slot="content"
              finalFocus={triggerRef}
              initialFocus={() =>
                calendarRef.current?.querySelector<HTMLElement>(
                  '[data-slot="day"][tabindex="0"]',
                ) ?? true
              }
            >
              <Calendar
                ref={calendarRef}
                aria-label={calendarLabel}
                className="max-w-none border-0 bg-transparent"
                disabled={disabled}
                firstDayOfWeek={firstDayOfWeek}
                isDateDisabled={isDateDisabled}
                labels={{
                  nextMonth: labels?.nextMonth ?? "Next month",
                  previousMonth: labels?.previousMonth ?? "Previous month",
                  selectedDate: labels?.selectedDate ?? "Selected",
                }}
                locale={locale}
                max={max}
                min={min}
                onValueChange={(nextValue) => {
                  setSelectedValue(nextValue);
                  actionsRef.current?.close();
                }}
                readOnly={readOnly}
                today={today}
                value={selectedValue ?? undefined}
              />
              {clearable && selectedValue && !readOnly ? (
                <Button
                  className="mx-(--n-calendar-padding) mb-(--n-calendar-padding)"
                  data-slot="clear"
                  onClick={() => {
                    setSelectedValue(null);
                    actionsRef.current?.close();
                  }}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {clearLabel}
                </Button>
              ) : null}
            </BasePopover.Popup>
          </BasePopover.Positioner>
        </BasePopover.Portal>
      </BasePopover.Root>
      <span className="sr-only" id={actionDescriptionId}>
        {actionLabel}
      </span>
      {name || form || required ? (
        <input
          ref={inputRef}
          data-slot="form-control"
          disabled={disabled}
          form={form}
          hidden
          name={name}
          onChange={() => undefined}
          onInvalid={(event) => {
            onInvalid?.(event);
            event.preventDefault();
            triggerRef.current?.focus();
          }}
          readOnly={readOnly}
          required={required}
          type="text"
          value={selectedValue ?? ""}
        />
      ) : null}
    </span>
  );
});
