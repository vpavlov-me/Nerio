import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const textareaClasses =
  "n-textarea box-border min-h-(--n-textarea-min-height) w-full resize-y rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) px-(--n-input-padding-inline) py-(--n-textarea-padding-block) text-(length:--n-input-font-size) font-(--n-input-font-weight) text-(--n-input-foreground) placeholder:text-(--n-input-placeholder) [&:hover:not(:disabled)]:border-(--n-input-border-hover) [&:hover:not(:disabled)]:bg-(--n-input-background-hover) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) disabled:cursor-not-allowed disabled:bg-(--n-input-disabled-background) disabled:text-(--n-input-disabled-foreground) disabled:opacity-(--n-input-disabled-opacity) data-invalid:border-(--n-input-border-danger) aria-invalid:border-(--n-input-border-danger) forced-colors:border-[CanvasText] forced-colors:data-invalid:border-[Mark]";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, "aria-invalid": ariaInvalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={ariaInvalid ?? (invalid ? true : undefined)}
      className={cn(textareaClasses, className)}
      data-invalid={invalid ? "" : undefined}
      data-slot="root"
      {...props}
    />
  );
});
