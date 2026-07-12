import * as React from "react";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";

export type InputType = "text" | "email" | "password" | "search" | "tel" | "url" | "number";

export type InputSize = "sm" | "md" | "lg";

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  size?: InputSize;
  htmlSize?: number;
  type?: InputType;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    className,
    disabled,
    htmlSize,
    invalid,
    readOnly,
    size = "md",
    type = "text",
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const isInvalid = invalid === true || ariaInvalid === true || ariaInvalid === "true";

  return (
    <input
      ref={ref}
      {...props}
      aria-invalid={invalid ? true : ariaInvalid}
      className={cn("n-input", motionClasses.hover, motionClasses.focus, className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-size={size}
      data-slot="input"
      disabled={disabled}
      readOnly={readOnly}
      size={htmlSize}
      type={type}
    />
  );
});
