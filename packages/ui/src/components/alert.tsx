import * as React from "react";
import type { IconComponent } from "@nerio/adapters/icons";
import { Icon } from "./icon";
import { cn } from "../lib/cn";

export type AlertTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: AlertTone;
  title?: React.ReactNode;
  icon?: IconComponent;
  action?: React.ReactNode;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { action, children, className, icon, role, title, tone = "neutral", ...props },
  ref,
) {
  const IconComponent = icon;

  return (
    <div
      ref={ref}
      className={cn("n-alert", className)}
      data-slot="root"
      data-tone={tone}
      role={role}
      {...props}
    >
      {IconComponent ? (
        <span className="n-alert__icon" data-slot="icon" aria-hidden>
          <Icon icon={IconComponent} />
        </span>
      ) : null}
      <div className="n-alert__content" data-slot="content">
        {title ? (
          <strong className="n-alert__title" data-slot="title">
            {title}
          </strong>
        ) : null}
        {children ? (
          <div className="n-alert__description" data-slot="description">
            {children}
          </div>
        ) : null}
      </div>
      {action ? (
        <div className="n-alert__action" data-slot="action">
          {action}
        </div>
      ) : null}
    </div>
  );
});
