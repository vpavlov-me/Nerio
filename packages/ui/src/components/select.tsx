"use client";

import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Select({ label, options, value, defaultValue, onChange }: SelectProps) {
  const fallbackValue = defaultValue ?? value ?? options[0]?.value;

  return (
    <div className="n-field n-select-field" data-slot="root">
      <span className="n-label" data-slot="label">
        {label}
      </span>
      <BaseSelect.Root<string>
        value={value}
        defaultValue={fallbackValue}
        items={options}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onChange?.(nextValue);
          }
        }}
      >
        <BaseSelect.Trigger className="n-select-trigger" aria-label={label} data-slot="trigger">
          <BaseSelect.Value>
            {(selectedValue) =>
              options.find((option) => option.value === selectedValue)?.label ?? "Select"
            }
          </BaseSelect.Value>
          <BaseSelect.Icon aria-hidden>⌄</BaseSelect.Icon>
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
                    <BaseSelect.ItemIndicator>✓</BaseSelect.ItemIndicator>
                  </BaseSelect.Item>
                ))}
              </BaseSelect.List>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
    </div>
  );
}
