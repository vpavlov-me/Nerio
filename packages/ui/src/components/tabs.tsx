"use client";

import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "../lib/cn";

export interface TabItem {
  label: React.ReactNode;
  value: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<
  React.ComponentProps<typeof BaseTabs.Root>,
  "children" | "defaultValue" | "onChange" | "onValueChange" | "value"
> {
  tabs: TabItem[];
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { tabs, value, defaultValue, onChange, onValueChange, className, ...props },
  ref,
) {
  const fallbackValue =
    defaultValue !== undefined ? defaultValue : (tabs.find((tab) => !tab.disabled)?.value ?? null);

  return (
    <BaseTabs.Root
      ref={ref}
      className={cn("n-tabs", className)}
      data-slot="root"
      value={value}
      defaultValue={fallbackValue}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
          onValueChange?.(nextValue);
          onChange?.(nextValue);
        }
      }}
      {...props}
    >
      <BaseTabs.List className="n-tabs__list" data-slot="list">
        {tabs.map((tab) => (
          <BaseTabs.Tab
            key={tab.value}
            className="n-tabs__tab"
            data-slot="tab"
            disabled={tab.disabled}
            value={tab.value}
          >
            {tab.label}
          </BaseTabs.Tab>
        ))}
        {tabs.length > 0 ? (
          <BaseTabs.Indicator className="n-tabs__indicator" data-slot="indicator" />
        ) : null}
      </BaseTabs.List>
      {tabs.map((tab) => (
        <BaseTabs.Panel
          key={tab.value}
          className="n-tabs__panel"
          data-slot="panel"
          value={tab.value}
        >
          {tab.content}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
});
