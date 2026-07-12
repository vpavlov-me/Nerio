"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../lib/cn";
import { resolveClassName } from "../lib/resolve-class-name";

export interface SwitchProps extends React.ComponentProps<typeof BaseSwitch.Root> {
  invalid?: boolean;
}

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  { children: _children, className, disabled, invalid = false, readOnly, ...props },
  ref,
) {
  const ariaInvalid = props["aria-invalid"];
  const isInvalid = invalid || ariaInvalid === true || ariaInvalid === "true";

  return (
    <BaseSwitch.Root
      ref={ref}
      className={(state) => cn("n-switch", resolveClassName(className, state))}
      disabled={disabled}
      readOnly={readOnly}
      {...props}
      aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
    >
      <BaseSwitch.Thumb className="n-switch__thumb" data-slot="thumb" />
    </BaseSwitch.Root>
  );
});
