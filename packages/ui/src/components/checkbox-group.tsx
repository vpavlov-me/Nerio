"use client";

import * as React from "react";
import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import { composeRefs } from "../lib/compose-refs";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { resolveClassName } from "../lib/resolve-class-name";
import type {
  NerioChangeEventDetails,
  NerioClassName,
  NerioRenderProp,
  NerioStyle,
} from "../lib/component-props";
import { Checkbox, type CheckboxProps } from "./checkbox";
import { FormMessage } from "./form-message";

export type CheckboxGroupValue = string;
export type CheckboxGroupChangeEventDetails = NerioChangeEventDetails<"none">;

export interface CheckboxGroupState {
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
}

export interface CheckboxGroupOption {
  label: React.ReactNode;
  value: CheckboxGroupValue;
  description?: React.ReactNode;
  disabled?: boolean;
}

type SharedCheckboxGroupProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "defaultValue" | "onChange" | "style"
> & {
  className?: NerioClassName<CheckboxGroupState>;
  defaultValue?: readonly CheckboxGroupValue[];
  description?: React.ReactNode;
  disabled?: boolean;
  form?: string;
  invalid?: boolean;
  label: React.ReactNode;
  message?: React.ReactNode;
  name?: string;
  onValueChange?: (
    value: CheckboxGroupValue[],
    eventDetails: CheckboxGroupChangeEventDetails,
  ) => void;
  readOnly?: boolean;
  render?: NerioRenderProp<CheckboxGroupState>;
  required?: boolean;
  style?: NerioStyle<CheckboxGroupState>;
  value?: readonly CheckboxGroupValue[];
};

type OptionsCheckboxGroupProps = {
  options: readonly CheckboxGroupOption[];
  children?: never;
};

type ComposedCheckboxGroupProps = {
  children: React.ReactNode;
  options?: never;
};

export type CheckboxGroupProps = SharedCheckboxGroupProps &
  (OptionsCheckboxGroupProps | ComposedCheckboxGroupProps);

type DistributiveOmit<T, Key extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<keyof T, Key>>
  : never;

export type CheckboxGroupItemProps = DistributiveOmit<
  CheckboxProps,
  | "checked"
  | "defaultChecked"
  | "description"
  | "indeterminate"
  | "label"
  | "form"
  | "name"
  | "onCheckedChange"
  | "parent"
  | "required"
  | "uncheckedValue"
  | "value"
> & {
  children: React.ReactNode;
  description?: React.ReactNode;
  required?: never;
  value: CheckboxGroupValue;
};

const CheckboxGroupContext = React.createContext<{
  disabled: boolean;
  form?: string;
  invalid: boolean;
  name?: string;
  readOnly: boolean;
  registerItem: (id: string, value: CheckboxGroupValue, disabled: boolean) => () => void;
}>({
  disabled: false,
  invalid: false,
  readOnly: false,
  registerItem: () => () => undefined,
});

export const CheckboxGroupItem = React.forwardRef<HTMLElement, CheckboxGroupItemProps>(
  function CheckboxGroupItem(
    { children, description, disabled, invalid, readOnly, required: _required, ...props },
    ref,
  ) {
    void _required;
    const group = React.useContext(CheckboxGroupContext);
    const registrationId = React.useId();
    const isDisabled = group.disabled || Boolean(disabled);

    React.useEffect(
      () => group.registerItem(registrationId, props.value, isDisabled),
      [group.registerItem, isDisabled, props.value, registrationId],
    );

    return (
      <Checkbox
        ref={ref}
        {...props}
        description={description}
        disabled={isDisabled}
        form={group.form}
        invalid={group.invalid || invalid}
        label={children}
        name={group.name}
        readOnly={group.readOnly || readOnly}
        value={props.value}
      />
    );
  },
);

function mergeIds(...ids: Array<string | undefined>) {
  const merged = ids.flatMap((id) => id?.split(" ") ?? []).filter(Boolean);
  return merged.length > 0 ? Array.from(new Set(merged)).join(" ") : undefined;
}

export const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  function CheckboxGroup(
    {
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-labelledby": ariaLabelledBy,
      children,
      className,
      defaultValue,
      description,
      disabled = false,
      form,
      invalid = false,
      label,
      message,
      name,
      onValueChange,
      options,
      readOnly = false,
      render,
      required = false,
      style,
      value,
      ...props
    },
    ref,
  ) {
    const generatedId = React.useId();
    const groupRef = React.useRef<HTMLDivElement>(null);
    const labelId = `${generatedId}-label`;
    const descriptionId = description ? `${generatedId}-description` : undefined;
    const messageId = message ? `${generatedId}-message` : undefined;
    const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";
    const state = { disabled, readOnly, required };
    const isControlled = value !== undefined;
    const initialValue = React.useRef<CheckboxGroupValue[]>([...(defaultValue ?? [])]);
    const [uncontrolledValue, setUncontrolledValue] = React.useState(initialValue.current);
    const selectedValue = isControlled ? [...value] : uncontrolledValue;
    const handleValueChange = React.useCallback(
      (nextValue: CheckboxGroupValue[], eventDetails: CheckboxGroupChangeEventDetails) => {
        onValueChange?.(nextValue, eventDetails);
        if (!isControlled && !eventDetails.isCanceled) {
          setUncontrolledValue(nextValue);
        }
      },
      [isControlled, onValueChange],
    );

    React.useEffect(() => {
      if (isControlled) {
        return;
      }

      const ownerForm = form
        ? groupRef.current?.ownerDocument.getElementById(form)
        : groupRef.current?.closest("form");
      if (!(ownerForm instanceof HTMLFormElement)) {
        return;
      }

      const handleReset = (event: Event) => {
        queueMicrotask(() => {
          if (!event.defaultPrevented) {
            setUncontrolledValue([...initialValue.current]);
          }
        });
      };
      ownerForm.addEventListener("reset", handleReset);
      return () => ownerForm.removeEventListener("reset", handleReset);
    }, [form, isControlled]);
    const registeredItems = React.useRef(
      new Map<string, { value: CheckboxGroupValue; disabled: boolean }>(),
    );
    const [, refreshRegisteredItems] = React.useReducer((version) => version + 1, 0);
    const registerItem = React.useCallback(
      (id: string, itemValue: CheckboxGroupValue, itemDisabled: boolean) => {
        registeredItems.current.set(id, { value: itemValue, disabled: itemDisabled });
        refreshRegisteredItems();
        return () => {
          registeredItems.current.delete(id);
          refreshRegisteredItems();
        };
      },
      [],
    );
    const hasSelectedEligibleItem = Array.from(registeredItems.current.values()).some(
      (item) => !item.disabled && selectedValue.includes(item.value),
    );
    const renderedItems = options
      ? options.map((option) => (
          <CheckboxGroupItem
            key={option.value}
            description={option.description}
            disabled={option.disabled}
            value={option.value}
          >
            {option.label}
          </CheckboxGroupItem>
        ))
      : children;

    return (
      <div
        className={cn(
          "n-field n-checkbox-group-field grid gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)",
          typeof className === "string" ? className : undefined,
        )}
        data-disabled={disabled ? "" : undefined}
        data-invalid={isInvalid ? "" : undefined}
        data-readonly={readOnly ? "" : undefined}
        data-required={required ? "" : undefined}
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
          <p className="n-field__description" data-slot="description" id={descriptionId}>
            {description}
          </p>
        ) : null}
        <CheckboxGroupContext.Provider
          value={{ disabled, form, invalid: isInvalid, name, readOnly, registerItem }}
        >
          <BaseCheckboxGroup
            ref={composeRefs(ref, groupRef)}
            {...props}
            aria-describedby={mergeIds(ariaDescribedBy, descriptionId, messageId)}
            aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
            aria-labelledby={mergeIds(ariaLabelledBy, labelId)}
            className={(baseState) =>
              cn(
                "grid gap-(--n-space-2)",
                typeof className === "function"
                  ? resolveClassName(className, { ...state, disabled: baseState.disabled })
                  : undefined,
              )
            }
            data-disabled={disabled ? "" : undefined}
            data-invalid={isInvalid ? "" : undefined}
            data-readonly={readOnly ? "" : undefined}
            data-required={required ? "" : undefined}
            data-slot="group"
            defaultValue={defaultValue ? [...defaultValue] : undefined}
            disabled={disabled}
            onValueChange={handleValueChange}
            render={
              typeof render === "function"
                ? (renderProps, baseState) =>
                    render(renderProps, { ...state, disabled: baseState.disabled })
                : render
            }
            style={
              typeof style === "function"
                ? (baseState) => style({ ...state, disabled: baseState.disabled })
                : style
            }
            value={selectedValue}
          >
            {renderedItems}
          </BaseCheckboxGroup>
          {required ? (
            <input
              aria-hidden="true"
              checked={hasSelectedEligibleItem}
              className="pointer-events-none absolute size-px overflow-hidden whitespace-nowrap opacity-0"
              data-slot="validation-control"
              disabled={disabled}
              form={form}
              onInvalid={(event) => {
                event.preventDefault();
                groupRef.current
                  ?.querySelector<HTMLElement>('[role="checkbox"]:not([aria-disabled="true"])')
                  ?.focus();
              }}
              readOnly
              required
              tabIndex={-1}
              type="checkbox"
            />
          ) : null}
        </CheckboxGroupContext.Provider>
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
  },
);
