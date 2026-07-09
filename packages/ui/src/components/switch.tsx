"use client";

import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../lib/cn";

export type SwitchProps = React.ComponentProps<typeof BaseSwitch.Root>;

export const Switch = React.forwardRef<HTMLElement, SwitchProps>(function Switch(
  { className, ...props },
  ref,
) {
  return (
    <BaseSwitch.Root ref={ref} className={cn("n-switch", className)} data-slot="root" {...props}>
      <BaseSwitch.Thumb className="n-switch__thumb" data-slot="thumb" />
    </BaseSwitch.Root>
  );
});
