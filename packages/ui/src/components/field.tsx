"use client";

import * as React from "react";
import { Label } from "./label";
import { FormMessage } from "./form-message";
import { cn } from "../lib/cn";

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

export function Field({
  label,
  description,
  message,
  children,
  invalid = Boolean(message),
  className,
  ...props
}: FieldProps) {
  const id = React.useId();
  const descriptionId = description ? `${id}-description` : undefined;
  const messageId = message ? `${id}-message` : undefined;
  const describedBy = [descriptionId, messageId].filter(Boolean).join(" ") || undefined;

  return (
    <div
      className={cn("n-field", className)}
      data-invalid={invalid ? "" : undefined}
      data-slot="root"
      {...props}
    >
      <Label htmlFor={id}>{label}</Label>
      {React.isValidElement<FieldControlProps>(children)
        ? React.cloneElement(children, {
            id: children.props.id ?? id,
            "aria-describedby":
              [children.props["aria-describedby"], describedBy].filter(Boolean).join(" ") ||
              undefined,
            "aria-invalid": children.props["aria-invalid"] ?? invalid,
            invalid: children.props.invalid ?? invalid,
          })
        : children}
      {description ? (
        <p className="n-field__description" data-slot="description" id={descriptionId}>
          {description}
        </p>
      ) : null}
      {message ? (
        <FormMessage id={messageId} tone={invalid ? "danger" : "neutral"}>
          {message}
        </FormMessage>
      ) : null}
    </div>
  );
}
