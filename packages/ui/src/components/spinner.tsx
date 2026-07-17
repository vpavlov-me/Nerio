import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

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
      className={cn(
        "n-spinner inline-block size-(--n-spinner-size-md) flex-none animate-[n-spin_var(--n-spinner-duration)_linear_infinite] rounded-(--n-radius-full) border-(length:--n-spinner-border-width) border-current border-t-transparent align-middle box-border data-[size=sm]:size-(--n-spinner-size-sm) data-[size=lg]:size-(--n-spinner-size-lg) motion-reduce:animate-none",
        className,
      )}
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
        <span
          className="n-spinner__label absolute size-(--n-border-width-default) overflow-hidden whitespace-nowrap [clip:rect(0_0_0_0)] [clip-path:inset(50%)]"
          data-slot="label"
        >
          {label}
        </span>
      )}
    </span>
  );
});
