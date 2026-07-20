import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

const textareaClasses =
  "n-textarea box-border min-h-(--n-textarea-min-height) w-full resize-y rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) px-(--n-input-padding-inline) py-(--n-textarea-padding-block) text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) placeholder:text-(--n-input-placeholder) [&:hover:not(:disabled):not([data-readonly])]:border-(--n-input-border-hover) [&:hover:not(:disabled):not([data-readonly])]:bg-(--n-input-background-hover) focus-visible:border-(--n-input-border-focus) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:bg-(--n-input-disabled-background) disabled:text-(--n-input-disabled-foreground) disabled:opacity-(--n-input-disabled-opacity) data-readonly:border-(--n-input-readonly-border) data-readonly:bg-(--n-input-readonly-background) data-invalid:border-(--n-input-border-danger) aria-invalid:border-(--n-input-border-danger) forced-colors:border-[CanvasText] forced-colors:data-invalid:border-[Mark]";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, disabled, invalid, readOnly, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  const isInvalid = invalid === true || ariaInvalid === true || ariaInvalid === "true";

  return (
    <textarea
      ref={ref}
      aria-invalid={invalid ? true : ariaInvalid}
      className={cn(textareaClasses, motionClasses.control, className)}
      data-disabled={disabled ? "" : undefined}
      data-invalid={isInvalid ? "" : undefined}
      data-readonly={readOnly ? "" : undefined}
      data-slot="root"
      disabled={disabled}
      readOnly={readOnly}
      {...props}
    />
  );
});
