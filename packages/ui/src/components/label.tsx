import * as React from "react";
import { cn } from "../lib/cn";

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export type LabelRowProps = React.HTMLAttributes<HTMLDivElement>;

export type LabelContentProps = React.HTMLAttributes<HTMLSpanElement>;

export type LabelRequiredProps = React.HTMLAttributes<HTMLSpanElement>;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cn("n-label", className)} data-slot="root" {...props} />;
});

/** Groups a label and its supplementary controls without nesting interactive content in <label>. */
export const LabelRow = React.forwardRef<HTMLDivElement, LabelRowProps>(function LabelRow(
  { className, ...props },
  ref,
) {
  return <div ref={ref} className={cn("n-label-row", className)} data-slot="root" {...props} />;
});

export const LabelContent = React.forwardRef<HTMLSpanElement, LabelContentProps>(
  function LabelContent({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn("n-label__content", className)}
        data-slot="content"
        {...props}
      />
    );
  },
);

/** Visual required marker. Pair it with the control's native required attribute. */
export const LabelRequired = React.forwardRef<HTMLSpanElement, LabelRequiredProps>(
  function LabelRequired({ className, "aria-label": _ariaLabel, ...props }, ref) {
    return (
      <span
        ref={ref}
        aria-hidden
        className={cn("n-label__required", className)}
        data-slot="required"
        {...props}
      >
        *
      </span>
    );
  },
);
