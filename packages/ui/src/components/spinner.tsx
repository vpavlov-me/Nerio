import * as React from "react";
import { cn } from "../lib/cn";

export type SpinnerSize = "sm" | "md" | "lg";

type SpinnerDOMProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  | "aria-hidden"
  | "aria-label"
  | "aria-labelledby"
  | "aria-live"
  | "children"
  | "data-size"
  | "data-slot"
  | "role"
>;

type SpinnerBaseProps = SpinnerDOMProps & {
  size?: SpinnerSize;
};

export type SpinnerProps =
  | (SpinnerBaseProps & {
      decorative: true;
      label?: never;
    })
  | (SpinnerBaseProps & {
      decorative?: false;
      label: string;
    });

export const Spinner = React.forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner(
  { className, decorative, label, size = "md", ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn("n-spinner", className)}
      {...props}
      data-slot="root"
      data-size={size}
      {...(decorative
        ? {
            "aria-hidden": true,
            "aria-label": undefined,
            "aria-labelledby": undefined,
            "aria-live": undefined,
            role: undefined,
          }
        : {
            "aria-hidden": undefined,
            "aria-label": undefined,
            "aria-labelledby": undefined,
            "aria-live": undefined,
            role: "status",
          })}
    >
      {decorative ? null : (
        <span className="n-spinner__label" data-slot="label">
          {label}
        </span>
      )}
    </span>
  );
});
