import * as React from "react";
import { cn } from "../lib/cn";
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
      className={cn("n-input-group", className)}
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
        className={cn("n-input-group__addon", className)}
        data-placement={placement}
        data-slot="input-group-addon"
      >
        {children}
      </div>
    );
  },
);
