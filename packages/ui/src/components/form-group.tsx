import * as React from "react";
import { FormMessage } from "./form-message";
import { cn } from "../lib/cn";

export interface FormGroupProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "title"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  invalid?: boolean;
  layout?: "stack" | "inline";
  children: React.ReactNode;
}

export const FormGroup = React.forwardRef<HTMLFieldSetElement, FormGroupProps>(function FormGroup(
  { className, children, description, invalid = false, layout = "stack", message, title, ...props },
  ref,
) {
  const generatedId = React.useId();
  const descriptionId = description ? `${generatedId}-description` : undefined;
  const messageId = message ? `${generatedId}-message` : undefined;
  const describedBy =
    [props["aria-describedby"], descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <fieldset
      ref={ref}
      className={cn("n-form-group", className)}
      data-invalid={invalid ? "" : undefined}
      data-layout={layout}
      data-slot="root"
      {...props}
      aria-describedby={describedBy}
      aria-invalid={props["aria-invalid"] ?? (invalid ? true : undefined)}
    >
      {title ? (
        <legend className="n-form-group__title" data-slot="title">
          {title}
        </legend>
      ) : null}
      {description ? (
        <p className="n-form-group__description" data-slot="description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      <div className="n-form-group__content" data-slot="content">
        {children}
      </div>
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
    </fieldset>
  );
});
