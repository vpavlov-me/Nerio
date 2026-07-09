"use client";

import * as React from "react";
import { cn } from "../lib/cn";

export type FormMessageTone = "neutral" | "danger" | "success";

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: FormMessageTone;
}

export function FormMessage({ className, tone = "danger", ...props }: FormMessageProps) {
  return (
    <p className={cn("n-form-message", className)} data-slot="root" data-tone={tone} {...props} />
  );
}
