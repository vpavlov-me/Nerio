import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
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

const inputBaseClasses =
  "n-input box-border w-full min-h-(--n-input-height-md) rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) px-(--n-input-padding-inline) text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) placeholder:text-(--n-input-placeholder) [&:hover:not(:disabled):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not(:disabled):not([data-readonly])]:bg-(--n-input-background-hover) focus-visible:border-(--n-input-border-focus) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:bg-(--n-input-disabled-background) disabled:text-(--n-input-disabled-foreground) disabled:opacity-(--n-input-disabled-opacity) data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background) data-invalid:border-(--n-input-border-danger) aria-invalid:border-(--n-input-border-danger) forced-colors:border-[CanvasText] forced-colors:data-invalid:border-[Mark] [&[type=number]]:appearance-textfield [&[type=number]::-webkit-inner-spin-button]:m-0 [&[type=number]::-webkit-inner-spin-button]:appearance-none [&[type=number]::-webkit-outer-spin-button]:m-0 [&[type=number]::-webkit-outer-spin-button]:appearance-none autofill:[-webkit-text-fill-color:var(--n-input-foreground)] autofill:shadow-[0_0_0_1000px_var(--n-input-background)_inset]";

const inputSizeClasses: Record<InputSize, string> = {
  sm: "min-h-(--n-input-height-sm)",
  md: "min-h-(--n-input-height-md)",
  lg: "min-h-(--n-input-height-lg)",
};

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
      className={cn(inputBaseClasses, inputSizeClasses[size], motionClasses.control, className)}
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
