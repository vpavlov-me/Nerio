"use client";

import * as React from "react";
import { Search, X, type IconComponent } from "@nerio-ui/adapters/icons";
import { composeRefs } from "../lib/compose-refs";
import type { NerioEventDetails } from "../lib/component-props";
import { Button } from "./button";
import { Field } from "./field";
import { Icon } from "./icon";
import { Input, type InputProps, type InputSize } from "./input";
import { InputGroup, InputGroupAddon } from "./input-group";
import { Spinner } from "./spinner";

export type SearchFieldValueChangeReason = "input" | "clear";
export type SearchFieldValueChangeEventDetails = NerioEventDetails<SearchFieldValueChangeReason>;
export type SearchFieldSearchEventDetails = NerioEventDetails<"enter">;

type SearchFieldInputProps = Omit<
  InputProps,
  | "children"
  | "className"
  | "defaultValue"
  | "invalid"
  | "onChange"
  | "onKeyDown"
  | "onSearch"
  | "size"
  | "type"
  | "value"
>;

export interface SearchFieldProps extends SearchFieldInputProps {
  label: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  invalid?: boolean;
  size?: InputSize;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, eventDetails: SearchFieldValueChangeEventDetails) => void;
  onSearch?: (value: string, eventDetails: SearchFieldSearchEventDetails) => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  clearLabel?: string;
  loading?: boolean;
  loadingLabel?: string;
  searchIcon?: IconComponent;
  loadingIndicator?: React.ReactNode;
  inputRef?: React.Ref<HTMLInputElement>;
  className?: string;
  style?: React.CSSProperties;
}

export const SearchField = React.forwardRef<HTMLDivElement, SearchFieldProps>(function SearchField(
  {
    "aria-busy": ariaBusy,
    className,
    clearLabel = "Clear search",
    defaultValue = "",
    description,
    disabled = false,
    inputRef,
    invalid = false,
    label,
    loading = false,
    loadingIndicator,
    loadingLabel = "Searching",
    message,
    onKeyDown,
    onSearch,
    onValueChange,
    readOnly = false,
    searchIcon: SearchIcon = Search,
    size = "md",
    style,
    value,
    ...inputProps
  },
  ref,
) {
  const nativeInputRef = React.useRef<HTMLInputElement>(null);
  const mergedInputRef = React.useMemo(() => composeRefs(nativeInputRef, inputRef), [inputRef]);
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue);
  const currentValue = value === undefined ? uncontrolledValue : value;

  React.useEffect(() => {
    const owningForm = nativeInputRef.current?.form;
    if (!owningForm || value !== undefined) return undefined;
    let active = true;
    const resetTimeouts = new Set<ReturnType<typeof setTimeout>>();
    const handleReset = (event: Event) => {
      if (event.target !== owningForm) return;
      const timeout = setTimeout(() => {
        resetTimeouts.delete(timeout);
        if (active && !event.defaultPrevented) setUncontrolledValue(defaultValue);
      }, 0);
      resetTimeouts.add(timeout);
    };
    owningForm.ownerDocument.addEventListener("reset", handleReset);
    return () => {
      active = false;
      resetTimeouts.forEach(clearTimeout);
      owningForm.ownerDocument.removeEventListener("reset", handleReset);
    };
  }, [defaultValue, inputProps.form, value]);

  const updateValue = React.useCallback(
    (nextValue: string, event: Event, reason: SearchFieldValueChangeReason) => {
      if (value === undefined) setUncontrolledValue(nextValue);
      onValueChange?.(nextValue, { event, reason });
    },
    [onValueChange, value],
  );

  return (
    <Field
      ref={ref}
      className={className}
      data-disabled={disabled ? "" : undefined}
      data-loading={loading ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-size={size}
      description={description}
      invalid={invalid}
      label={label}
      message={message}
      style={style}
    >
      <InputGroup id={inputProps.id}>
        <InputGroupAddon placement="start" aria-hidden="true">
          <span className="inline-flex" data-slot="search-icon">
            <Icon icon={SearchIcon} />
          </span>
        </InputGroupAddon>
        <Input
          ref={mergedInputRef}
          {...inputProps}
          aria-busy={loading || ariaBusy || undefined}
          className="appearance-none [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
          disabled={disabled}
          onChange={(event) => updateValue(event.currentTarget.value, event.nativeEvent, "input")}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (
              event.defaultPrevented ||
              event.key !== "Enter" ||
              event.nativeEvent.isComposing ||
              disabled
            ) {
              return;
            }
            onSearch?.(currentValue, { event: event.nativeEvent, reason: "enter" });
          }}
          readOnly={readOnly}
          size={size}
          type="search"
          value={currentValue}
        />
        {loading || currentValue ? (
          <InputGroupAddon placement="end">
            <span
              className="inline-flex items-center gap-(--n-input-addon-gap)"
              data-slot="actions"
            >
              {loading ? (
                <span className="inline-flex" data-slot="loading">
                  {loadingIndicator ?? <Spinner label={loadingLabel} size="sm" />}
                </span>
              ) : null}
              {currentValue ? (
                <Button
                  aria-label={clearLabel}
                  className="size-(--n-size-control-sm) rounded-(--n-radius-pill) p-0"
                  data-slot="clear"
                  disabled={disabled || readOnly}
                  icon={X}
                  onClick={(event) => {
                    updateValue("", event.nativeEvent, "clear");
                    nativeInputRef.current?.focus();
                  }}
                  size="sm"
                  variant="ghost"
                />
              ) : null}
            </span>
          </InputGroupAddon>
        ) : null}
      </InputGroup>
    </Field>
  );
});
