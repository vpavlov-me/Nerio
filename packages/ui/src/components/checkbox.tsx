"use client";

import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "@nerio/adapters";
import { cn } from "../lib/cn";
import { resolveClassName } from "../lib/resolve-class-name";
import { Icon } from "./icon";

export interface CheckboxProps extends React.ComponentProps<typeof BaseCheckbox.Root> {
  invalid?: boolean;
}

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(function Checkbox(
  { className, children, disabled, invalid = false, readOnly, ...props },
  ref,
) {
  const ariaInvalid = props["aria-invalid"];
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";

  return (
    <BaseCheckbox.Root
      ref={ref}
      className={(state) => cn("n-checkbox", resolveClassName(className, state))}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
      aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
    >
      <BaseCheckbox.Indicator keepMounted className="n-checkbox__indicator" data-slot="indicator">
        {children ?? (
          <>
            <Icon className="n-checkbox__check" icon={Check} />
            <Icon className="n-checkbox__minus" icon={Minus} />
          </>
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
});
