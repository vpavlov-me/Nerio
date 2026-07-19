import * as React from "react";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { Icon } from "./icon";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const alertClasses =
  "n-alert grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-(--n-alert-gap) rounded-(--n-alert-radius) border-(length:--n-alert-border-width) border-(--n-alert-border) bg-(--n-alert-background) p-(--n-alert-padding) text-(--n-color-text-secondary) shadow-(--n-alert-shadow) [&:not(:has(>[data-slot=icon]))]:grid-cols-[minmax(0,1fr)_auto] [&:not(:has(>[data-slot=action]))]:grid-cols-[auto_minmax(0,1fr)] [&:not(:has(>[data-slot=icon])):not(:has(>[data-slot=action]))]:grid-cols-1 [&:not(:has(>[data-slot=content]>[data-slot=description]))]:items-center [&:not(:has(>[data-slot=content]>[data-slot=description]))>[data-slot=action]]:self-center data-[tone=info]:[--n-alert-icon-color:var(--n-color-status-info)] data-[tone=info]:[--n-alert-title-color:var(--n-color-status-info)] data-[tone=success]:[--n-alert-icon-color:var(--n-color-status-success)] data-[tone=success]:[--n-alert-title-color:var(--n-color-status-success)] data-[tone=warning]:[--n-alert-icon-color:var(--n-color-status-warning)] data-[tone=warning]:[--n-alert-title-color:var(--n-color-status-warning)] data-[tone=danger]:[--n-alert-icon-color:var(--n-color-status-danger)] data-[tone=danger]:[--n-alert-title-color:var(--n-color-status-danger)]";

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
      {...props}
      className={cn(alertClasses, className)}
      data-slot="root"
      data-tone={tone}
      role={role}
    >
      {IconComponent ? (
        <span
          className="n-alert__icon text-(length:--n-alert-icon-size) leading-(--n-helper-line-height) text-(--n-alert-icon-color)"
          data-slot="icon"
          aria-hidden
        >
          <Icon icon={IconComponent} />
        </span>
      ) : null}
      <div className="n-alert__content grid gap-(--n-space-1)" data-slot="content">
        {title ? (
          <strong
            className="n-alert__title font-(--n-font-weight-semibold) text-(--n-alert-title-color)"
            data-slot="title"
          >
            {title}
          </strong>
        ) : null}
        {children ? (
          <div
            className="n-alert__description text-(length:--n-font-size-sm) leading-(--n-line-height-normal) [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_:is(ul,ol)]:mt-(--n-space-2) [&_:is(ul,ol)]:mb-0 [&_:is(ul,ol)]:ps-(--n-alert-list-padding-inline)"
            data-slot="description"
          >
            {children}
          </div>
        ) : null}
      </div>
      {action ? (
        <div className="n-alert__action flex self-start gap-(--n-space-2)" data-slot="action">
          {action}
        </div>
      ) : null}
    </div>
  );
});
