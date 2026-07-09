"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return <label className={cn("n-label", className)} data-slot="root" {...props} />;
}
