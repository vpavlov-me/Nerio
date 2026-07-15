"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "@nerio-ui/adapters/icons";
import { cn } from "../lib/cn";
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

export const SelectItem = React.forwardRef<HTMLElement, SelectItemProps>(function SelectItem(
  { children, className, description, disabled, textValue, value, ...props },
  ref,
) {
  return (
    <BaseSelect.Item
      ref={ref}
      className={(state) => cn("n-select-item", resolveClassName(className, state))}
      disabled={disabled}
      label={textValue}
      value={value}
      {...props}
      data-disabled={disabled ? "" : undefined}
      data-slot="item"
    >
      <BaseSelect.ItemText className="n-select-item__content" data-slot="item-content">
        <span className="n-select-item__label" data-slot="item-label">
          {children}
        </span>
        {description ? (
          <span className="n-select-item__description" data-slot="item-description">
            {description}
          </span>
        ) : null}
      </BaseSelect.ItemText>
      <BaseSelect.ItemIndicator className="n-select-item__indicator" data-slot="indicator">
        <Icon icon={Check} />
      </BaseSelect.ItemIndicator>
    </BaseSelect.Item>
  );
});

export const SelectGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.Group> & { "data-slot"?: string }
>(function SelectGroup({ "data-slot": _dataSlot, ...props }, ref) {
  return <BaseSelect.Group ref={ref} {...props} className="n-select-group" data-slot="group" />;
});

export const SelectGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseSelect.GroupLabel> & { "data-slot"?: string }
>(function SelectGroupLabel({ "data-slot": _dataSlot, ...props }, ref) {
  return (
    <BaseSelect.GroupLabel
      ref={ref}
      {...props}
      className="n-select-group-label"
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
      className="n-select-separator"
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
      className={cn("n-field", "n-select-field", className)}
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
        <BaseSelect.Label className="n-label" data-slot="label">
          {label}
        </BaseSelect.Label>
        <BaseSelect.Trigger
          ref={triggerRef}
          className="n-select-trigger"
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
            className="n-select-trigger__value"
            data-slot="value"
            placeholder={placeholder}
          />
          <BaseSelect.Icon className="n-select-trigger__icon" data-slot="icon">
            <Icon icon={ChevronDown} />
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal>
          <BaseSelect.Positioner
            align="start"
            alignItemWithTrigger={false}
            className="n-select-positioner"
            side="bottom"
            sideOffset={4}
          >
            <BaseSelect.Popup className="n-select-popup" data-slot="content">
              <BaseSelect.ScrollUpArrow className="n-select-scroll-arrow" data-slot="scroll-up">
                <Icon icon={ChevronDown} />
              </BaseSelect.ScrollUpArrow>
              <BaseSelect.List className="n-select-list" data-slot="list">
                {options?.length === 0 ? (
                  <div className="n-select-empty" data-slot="empty">
                    {emptyMessage}
                  </div>
                ) : (
                  renderedItems
                )}
              </BaseSelect.List>
              <BaseSelect.ScrollDownArrow className="n-select-scroll-arrow" data-slot="scroll-down">
                <Icon icon={ChevronDown} />
              </BaseSelect.ScrollDownArrow>
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
          role={isInvalid ? "alert" : undefined}
          tone={isInvalid ? "danger" : "neutral"}
        >
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
});
