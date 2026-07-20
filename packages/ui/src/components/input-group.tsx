import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";
import { Input, type InputProps } from "./input";

export type InputGroupAddonPlacement = "start" | "end";

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Applies Field-owned validation and description wiring to the direct Input child. */
  invalid?: boolean;
}

export interface InputGroupAddonProps extends React.HTMLAttributes<HTMLDivElement> {
  placement: InputGroupAddonPlacement;
}

function mergeIds(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ") || undefined;
}

const inputGroupClasses =
  "n-input-group flex min-h-(--n-input-height-md) w-full items-center rounded-(--n-input-radius) border-(length:--n-input-border-width) border-(--n-input-border) bg-(--n-input-background) text-(--n-input-foreground) [&:hover:not(:has(.n-input:disabled)):not(:has(.n-input[data-readonly]))]:border-(--n-input-border-hover) [&:hover:not(:has(.n-input:disabled)):not(:has(.n-input[data-readonly]))]:bg-(--n-input-background-hover) focus-within:border-(--n-input-border-focus) focus-within:shadow-(--n-focus-ring) data-invalid:border-(--n-input-border-danger) [&:has(.n-input[data-invalid])]:border-(--n-input-border-danger) data-invalid:focus-within:border-(--n-input-border-danger) [&:has(.n-input[data-invalid]):focus-within]:border-(--n-input-border-danger) [&:has(.n-input:disabled)]:cursor-not-allowed [&:has(.n-input:disabled)]:bg-(--n-input-disabled-background) [&:has(.n-input:disabled)]:text-(--n-input-disabled-foreground) [&:has(.n-input:disabled)]:opacity-(--n-input-disabled-opacity) [&:has(.n-input[data-readonly])]:border-(--n-input-readonly-border) [&:has(.n-input[data-readonly])]:bg-(--n-input-readonly-background) [&:has(.n-input[data-size=sm])]:min-h-(--n-input-height-sm) [&:has(.n-input[data-size=lg])]:min-h-(--n-input-height-lg) [&>.n-input]:min-w-0 [&>.n-input]:rounded-none [&>.n-input]:border-0 [&>.n-input]:bg-transparent [&>.n-input]:shadow-none [&>.n-input:focus-visible]:shadow-none [&>.n-input:disabled]:opacity-100 forced-colors:border-[CanvasText]";

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  {
    children,
    className,
    id,
    invalid,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    ...props
  },
  ref,
) {
  const normalizedInvalid = invalid === true || ariaInvalid === true || ariaInvalid === "true";
  const content = React.Children.map(children, (child) => {
    if (!React.isValidElement<InputProps>(child) || child.type !== Input) return child;

    return React.cloneElement(child, {
      id: child.props.id ?? id,
      invalid: child.props.invalid ?? normalizedInvalid,
      "aria-describedby": mergeIds(child.props["aria-describedby"], describedBy),
      "aria-invalid": child.props["aria-invalid"] ?? (normalizedInvalid ? true : undefined),
    });
  });

  return (
    <div
      ref={ref}
      {...props}
      className={cn(inputGroupClasses, motionClasses.control, className)}
      data-invalid={normalizedInvalid ? "" : undefined}
      data-slot="input-group"
    >
      {content}
    </div>
  );
});

export const InputGroupAddon = React.forwardRef<HTMLDivElement, InputGroupAddonProps>(
  function InputGroupAddon({ children, className, placement, ...props }, ref) {
    return (
      <div
        ref={ref}
        {...props}
        className={cn(
          "n-input-group__addon inline-flex flex-none items-center gap-(--n-input-addon-gap) px-(--n-input-addon-padding-inline) text-(--n-input-addon-foreground) data-[placement=start]:-order-1 data-[placement=start]:pe-0 data-[placement=end]:ps-0",
          className,
        )}
        data-placement={placement}
        data-slot="input-group-addon"
      >
        {children}
      </div>
    );
  },
);
