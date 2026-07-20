import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const messageToneClasses: Record<FormMessageTone, string> = {
  neutral: "text-(--n-color-text-tertiary)",
  danger: "text-(--n-color-status-danger)",
  success: "text-(--n-color-status-success)",
};

export type FormMessageTone = "neutral" | "danger" | "success";

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: FormMessageTone;
}

export const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  function FormMessage({ className, tone = "danger", ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn(
          "n-form-message m-0 text-(length:--n-helper-font-size) leading-(--n-line-height-normal)",
          messageToneClasses[tone],
          className,
        )}
        data-slot="root"
        data-tone={tone}
        {...props}
      />
    );
  },
);
