"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check } from "@nerio/adapters";
import { cn } from "../lib/cn";
import { Icon } from "./icon";

export type CheckboxProps = React.ComponentProps<typeof BaseCheckbox.Root>;

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { className, children, ...props },
  ref,
) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn("n-checkbox", className)}
      data-slot="root"
      {...props}
    >
      <BaseCheckbox.Indicator className="n-checkbox__indicator" data-slot="indicator">
        {children ?? <Icon icon={Check} />}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});
