"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cn("n-label", className)} data-slot="root" {...props} />;
});
