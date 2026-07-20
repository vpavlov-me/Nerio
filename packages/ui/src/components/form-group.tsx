import * as React from "react";
import { FormMessage } from "./form-message";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const formGroupClasses =
  "n-form-group m-0 grid min-w-0 gap-(--n-form-group-gap) border-0 p-0 data-[layout=inline]:[&>[data-slot=content]]:flex data-[layout=inline]:[&>[data-slot=content]]:flex-wrap data-[layout=inline]:[&>[data-slot=content]]:items-center data-[layout=inline]:[&>[data-slot=content]]:gap-(--n-form-group-inline-gap) data-[layout=grid]:[&>[data-slot=content]]:grid-cols-2 max-sm:data-[layout=grid]:[&>[data-slot=content]]:grid-cols-1 data-invalid:[&_.n-form-message]:text-(--n-form-group-message-color)";

export interface FormGroupProps extends Omit<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  "title"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  message?: React.ReactNode;
  invalid?: boolean;
  layout?: "stack" | "inline" | "grid";
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
      className={cn(formGroupClasses, className)}
      data-invalid={invalid ? "" : undefined}
      data-layout={layout}
      data-slot="root"
      {...props}
      aria-describedby={describedBy}
      aria-invalid={props["aria-invalid"] ?? (invalid ? true : undefined)}
    >
      {title ? (
        <legend
          className="n-form-group__title m-0 block p-0 text-(length:--n-label-font-size) font-(--n-label-font-weight) text-(--n-form-group-title-color)"
          data-slot="title"
        >
          {title}
        </legend>
      ) : null}
      {description ? (
        <p
          className="n-form-group__description m-0 text-(length:--n-helper-font-size) leading-(--n-line-height-normal) text-(--n-form-group-description-color)"
          data-slot="description"
          id={descriptionId}
        >
          {description}
        </p>
      ) : null}
      <div className="n-form-group__content grid gap-(--n-field-gap)" data-slot="content">
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
