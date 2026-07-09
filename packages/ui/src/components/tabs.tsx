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
  "children" | "onChange" | "onValueChange"
> {
  tabs: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function Tabs({ tabs, value, defaultValue, onChange, className, ...props }: TabsProps) {
  return (
    <BaseTabs.Root
      className={cn("n-tabs", className)}
      data-slot="root"
      value={value}
      defaultValue={defaultValue ?? tabs[0]?.value}
      onValueChange={(nextValue) => {
        if (typeof nextValue === "string") {
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
        <BaseTabs.Indicator className="n-tabs__indicator" data-slot="indicator" />
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
}
