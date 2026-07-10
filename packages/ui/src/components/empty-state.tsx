import * as React from "react";
import { cn } from "../lib/cn";
import type { IconComponent } from "./icon";
import { Icon } from "./icon";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description: React.ReactNode;
  titleAs?: "h2" | "h3" | "h4" | "h5" | "h6";
  icon?: IconComponent;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { action, className, description, icon, secondaryAction, title, titleAs: Title = "h3", ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("n-empty-state", className)} data-slot="root" {...props}>
      {icon ? (
        <div className="n-empty-state__mark" data-slot="mark" aria-hidden>
          <Icon icon={icon} />
        </div>
      ) : null}
      <Title data-slot="title">{title}</Title>
      <p data-slot="description">{description}</p>
      {action || secondaryAction ? (
        <div className="n-empty-state__actions" data-slot="actions">
          {action ? <div data-slot="action">{action}</div> : null}
          {secondaryAction ? <div data-slot="secondary-action">{secondaryAction}</div> : null}
        </div>
      ) : null}
    </div>
  );
});
