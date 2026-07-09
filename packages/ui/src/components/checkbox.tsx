"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "@nerio/adapters";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

export interface CheckboxProps extends React.ComponentProps<typeof BaseCheckbox.Root> {
  invalid?: boolean;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { className, children, invalid = false, ...props },
  ref,
) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn("n-checkbox", className)}
      data-invalid={invalid ? "" : undefined}
      data-slot="root"
      {...props}
      aria-invalid={props["aria-invalid"] ?? (invalid ? true : undefined)}
    >
      <BaseCheckbox.Indicator className="n-checkbox__indicator" data-slot="indicator">
        {children ?? <Icon icon={Check} />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});
