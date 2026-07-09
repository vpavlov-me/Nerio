"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
      className={cn("n-input", className)}
      data-invalid={invalid ? "" : undefined}
      data-slot="root"
      {...props}
    />
  );
});
