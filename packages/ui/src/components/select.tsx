"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { resolveClassName } from "../lib/resolve-class-name";
import { FormMessage } from "./form-message";
import { Icon } from "./icon";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  textValue?: string;
  description?: React.ReactNode;
  disabled?: boolean;
}

export type SelectSize = "sm" | "md" | "lg";

export type SelectChangeEventDetails = Parameters<
  NonNullable<React.ComponentProps<typeof BaseSelect.Root<string>>["onValueChange"]>
>[1];

export type SelectOpenChangeEventDetails = Parameters<
  NonNullable<React.ComponentProps<typeof BaseSelect.Root<string>>["onOpenChange"]>
>[1];

type BaseSelectRootProps = Omit<
  React.ComponentProps<typeof BaseSelect.Root<string>>,
  "children" | "defaultValue" | "items" | "onOpenChange" | "onValueChange" | "value"
>;

type SharedSelectProps = BaseSelectRootProps &
  Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onChange"> & {
    label: React.ReactNode;
    description?: React.ReactNode;
    emptyMessage?: React.ReactNode;
    invalid?: boolean;
    message?: React.ReactNode;
    placeholder?: React.ReactNode;
    size?: SelectSize;
    triggerRef?: React.Ref<HTMLButtonElement>;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string, eventDetails: SelectChangeEventDetails) => void;
    /** @deprecated Prefer onValueChange for Base UI event details. */
    onChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean, eventDetails: SelectOpenChangeEventDetails) => void;
    "data-slot"?: string;
  };

type OptionsSelectProps = {
  options: SelectOption[];
  children?: never;
};

type ComposedSelectProps = {
  children: React.ReactNode;
  options?: never;
};

export type SelectProps = SharedSelectProps & (OptionsSelectProps | ComposedSelectProps);

export interface SelectItemProps extends Omit<
  React.ComponentProps<typeof BaseSelect.Item>,
  "children" | "className" | "label" | "value"
> {
  children: React.ReactNode;
  className?: React.ComponentProps<typeof BaseSelect.Item>["className"];
  description?: React.ReactNode;
  textValue?: string;
  value: string;
}

const selectItemClasses =
  "n-select-item grid min-h-(--n-size-control-sm) cursor-pointer grid-cols-[minmax(0,1fr)_var(--n-icon-size-md)] items-center gap-(--n-select-item-gap) rounded-(--n-radius-md) px-(--n-select-item-padding-inline) py-(--n-space-2) text-(--n-color-text-secondary) [&:not([data-disabled]):hover]:bg-(--n-color-surface-muted) [&:not([data-disabled]):hover]:text-(--n-color-text-primary) [&:not([data-disabled])[data-highlighted]]:bg-(--n-color-surface-muted) [&:not([data-disabled])[data-highlighted]]:text-(--n-color-text-primary) data-selected:bg-(--n-color-surface-selected) data-selected:text-(--n-color-text-primary) data-selected:data-highlighted:bg-(--n-color-surface-control-active) data-disabled:cursor-not-allowed data-disabled:text-(--n-color-text-disabled) data-disabled:opacity-(--n-opacity-disabled)";

const selectTriggerClasses =
  "n-select-trigger inline-flex min-h-(--n-select-height-md) w-full cursor-pointer items-center justify-between gap-(--n-select-trigger-gap) rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) px-(--n-select-padding-inline) text-start text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) data-[size=sm]:min-h-(--n-select-height-sm) data-[size=lg]:min-h-(--n-select-height-lg) [&:hover:not(:disabled):not([data-disabled]):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not(:disabled):not([data-disabled]):not([data-readonly])]:bg-(--n-input-background-hover) [&:active:not(:disabled):not([data-disabled]):not([data-readonly])]:bg-(--n-color-surface-control-active) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) data-invalid:border-(--n-input-border-danger) aria-invalid:border-(--n-input-border-danger) data-placeholder:text-(--n-input-placeholder) disabled:cursor-not-allowed disabled:bg-(--n-input-disabled-background) disabled:text-(--n-input-disabled-foreground) disabled:opacity-(--n-input-disabled-opacity) data-disabled:cursor-not-allowed data-disabled:bg-(--n-input-disabled-background) data-disabled:text-(--n-input-disabled-foreground) data-disabled:opacity-(--n-input-disabled-opacity) data-readonly:cursor-default data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background) data-popup-open:[&>[data-slot=icon]]:rotate-180";

export const SelectItem = React.forwardRef<HTMLElement, SelectItemProps>(function SelectItem(
  { children, className, description, disabled, textValue, value, ...props },
  ref,
) {
  return (
    <BaseSelect.Item
      ref={ref}
      className={(state) => cn(selectItemClasses, resolveClassName(className, state))}
      disabled={disabled}
      label={textValue}
      value={value}
      {...props}
      data-disabled={disabled ? "" : undefined}
      data-slot="item"
    >
      <BaseSelect.ItemText
        className="n-select-item__content grid min-w-0 gap-(--n-space-0-5)"
        data-slot="item-content"
      >
        <span
          className="n-select-item__label min-w-0 overflow-hidden text-ellipsis whitespace-nowrap"
          data-slot="item-label"
        >
          {children}
        </span>
        {description ? (
          <span
            className="n-select-item__description text-(length:--n-font-size-xs) leading-(--n-line-height-sm) text-(--n-color-text-tertiary)"
            data-slot="item-description"
          >
            {description}
          </span>
        ) : null}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator
        className="n-select-item__indicator inline-flex w-(--n-icon-size-md) items-center justify-center text-(--n-color-action-primary)"
        data-slot="indicator"
      >
        <Icon icon={Check} />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
});

export const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.Group> & { "data-slot"?: string }
>(function SelectGroup({ "data-slot": _dataSlot, ...props }, ref) {
  return (
    <BaseSelect.Group
      ref={ref}
      {...props}
      className="n-select-group grid gap-(--n-space-1)"
      data-slot="group"
    />
  );
});

export const SelectGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.GroupLabel> & { "data-slot"?: string }
>(function SelectGroupLabel({ "data-slot": _dataSlot, ...props }, ref) {
  return (
    <BaseSelect.GroupLabel
      ref={ref}
      {...props}
      className="n-select-group-label px-(--n-select-group-label-padding-inline) pt-(--n-space-2) pb-(--n-space-1) text-(length:--n-font-size-xs) font-(--n-font-weight-medium) text-(--n-color-text-tertiary)"
      data-slot="group-label"
    />
  );
});

export const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.Separator> & { "data-slot"?: string }
>(function SelectSeparator({ "data-slot": _dataSlot, ...props }, ref) {
  return (
    <BaseSelect.Separator
      ref={ref}
      {...props}
      className="n-select-separator mx-(--n-space-2) my-(--n-space-1) h-(--n-border-width-default) bg-(--n-color-border-subtle)"
      data-slot="separator"
    />
  );
});

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(function Select(
  {
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    autoComplete,
    children,
    className,
    defaultOpen,
    defaultValue,
    description,
    disabled,
    emptyMessage = "No options available.",
    invalid = false,
    form,
    id,
    label,
    message,
    name,
    onChange,
    onOpenChange,
    onValueChange,
    open,
    options,
    placeholder = "Select",
    readOnly,
    required,
    size = "md",
    triggerRef,
    value,
    "data-slot": _dataSlot,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const controlId = id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = mergeIds(ariaDescribedBy, descriptionId, messageId);
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
  const renderedItems = options
    ? options.map((option) => (
        <SelectItem
          key={option.value}
          description={option.description}
          disabled={option.disabled}
          textValue={option.textValue}
          value={option.value}
        >
          {option.label}
        </SelectItem>
      ))
    : children;

  return (
    <div
      ref={ref}
      className={cn(
        "n-field n-select-field grid gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)",
        className,
      )}
      {...props}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-size={size}
      data-slot="root"
    >
      <BaseSelect.Root<string>
        autoComplete={autoComplete}
        defaultOpen={defaultOpen}
        defaultValue={defaultValue}
        disabled={disabled}
        form={form}
        id={controlId}
        items={options}
        name={name}
        onOpenChange={onOpenChange}
        onValueChange={(nextValue, eventDetails) => {
          if (typeof nextValue === "string") {
            onValueChange?.(nextValue, eventDetails);
            onChange?.(nextValue);
          }
        }}
        open={open}
        readOnly={readOnly}
        required={required}
        value={value}
      >
        <BaseSelect.Label
          className="n-label text-(length:--n-label-font-size) font-(--n-label-font-weight) text-(--n-color-text-secondary)"
          data-slot="label"
        >
          {label}
        </BaseSelect.Label>
        <BaseSelect.Trigger
          ref={triggerRef}
          className={cn(selectTriggerClasses, motionClasses.control)}
          aria-describedby={describedBy}
          aria-invalid={isInvalid ? true : ariaInvalid}
          {...(ariaLabel ? { "aria-label": ariaLabel } : undefined)}
          {...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : undefined)}
          data-disabled={disabled ? "" : undefined}
          data-invalid={isInvalid ? "" : undefined}
          data-readonly={readOnly ? "" : undefined}
          data-size={size}
          data-slot="trigger"
        >
          <BaseSelect.Value
            className="n-select-trigger__value min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
            data-slot="value"
            placeholder={placeholder}
          />
          <BaseSelect.Icon
            className="n-select-trigger__icon inline-flex size-(--n-icon-size-md) flex-none items-center justify-center transition-transform duration-(--n-overlay-duration) ease-(--n-overlay-easing) motion-reduce:duration-[1ms]"
            data-slot="icon"
          >
            <Icon icon={ChevronDown} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            align="start"
            alignItemWithTrigger={false}
            className="n-select-positioner z-(--n-overlay-z-index) min-w-[min(var(--anchor-width),var(--available-width))] max-w-(--available-width)"
            side="bottom"
            sideOffset={4}
          >
            <BaseSelect.Popup
              className="n-select-popup max-h-(--available-height) w-[max(var(--anchor-width),var(--n-size-select-min))] min-w-[min(var(--anchor-width),var(--available-width))] max-w-(--available-width) origin-(--transform-origin) overflow-hidden rounded-(--n-select-popup-radius) border-(length:--n-overlay-border-width) border-(--n-overlay-border) bg-(--n-overlay-background) p-(--n-space-1) shadow-(--n-overlay-shadow) data-open:[animation:n-select-popup-in_var(--n-overlay-duration)_var(--n-overlay-easing)] data-closed:[animation:n-select-popup-out_var(--n-overlay-duration)_var(--n-overlay-easing)] motion-reduce:data-open:[animation-duration:1ms] motion-reduce:data-closed:[animation-duration:1ms]"
              data-slot="content"
            >
              <BaseSelect.ScrollUpArrow
                className="n-select-scroll-arrow flex min-h-(--n-size-control-sm) items-center justify-center bg-(--n-overlay-background) text-(--n-color-text-tertiary) [&_svg]:rotate-180"
                data-slot="scroll-up"
              >
                <Icon icon={ChevronDown} />
              </BaseSelect.ScrollUpArrow>
              <BaseSelect.List
                className="n-select-list max-h-[calc(var(--available-height)-var(--n-space-2))] overflow-auto overscroll-contain [scrollbar-width:thin]"
                data-slot="list"
              >
                {options?.length === 0 ? (
                  <div
                    className="n-select-empty p-(--n-select-empty-padding) text-center text-(length:--n-font-size-sm) text-(--n-color-text-tertiary)"
                    data-slot="empty"
                  >
                    {emptyMessage}
                  </div>
                ) : (
                  renderedItems
                )}
              </BaseSelect.List>
              <BaseSelect.ScrollDownArrow
                className="n-select-scroll-arrow flex min-h-(--n-size-control-sm) items-center justify-center bg-(--n-overlay-background) text-(--n-color-text-tertiary)"
                data-slot="scroll-down"
              >
                <Icon icon={ChevronDown} />
              </BaseSelect.ScrollDownArrow>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
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
    </div>
  );
});
