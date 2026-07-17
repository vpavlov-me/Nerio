import * as React from "react";
import { Label } from "./label";
import { FormMessage } from "./form-message";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const fieldClasses =
  "n-field grid gap-(--n-field-gap) [&_p]:m-0 [&_p]:text-(length:--n-helper-font-size) [&_p]:text-(--n-color-text-tertiary)";

type FieldControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  invalid?: boolean;
};

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  children: React.ReactNode;
  invalid?: boolean;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, message, children, invalid = false, className, ...props },
  ref,
) {
  if (React.Children.count(children) !== 1) {
    throw new Error("Field expects exactly one form control child.");
  }

  const generatedId = React.useId();
  const childId = React.isValidElement<FieldControlProps>(children) ? children.props.id : undefined;
  const controlId = childId ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const messageId = message ? `${controlId}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      ref={ref}
      className={cn(fieldClasses, className)}
      data-invalid={invalid ? "" : undefined}
      data-slot="root"
      {...props}
    >
      <Label data-slot="label" htmlFor={controlId}>
        {label}
      </Label>
      {React.isValidElement<FieldControlProps>(children)
        ? React.cloneElement(children, {
            id: controlId,
            "aria-describedby":
              [children.props["aria-describedby"], describedBy].filter(Boolean).join(" ") ||
              undefined,
            "aria-invalid": children.props["aria-invalid"] ?? (invalid ? true : undefined),
            invalid: children.props.invalid ?? (invalid ? true : undefined),
          })
        : children}
      {description ? (
        <p
          className="n-field__description m-0 text-(length:--n-helper-font-size) text-(--n-color-text-tertiary)"
          data-slot="description"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      {message ? (
        <FormMessage
          data-slot="message"
          id={messageId}
          role={invalid ? "alert" : undefined}
          tone={invalid ? "danger" : "neutral"}
        >
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
});
