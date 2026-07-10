import * as React from "react";
import { cn } from "../lib/cn";
import type { IconComponent } from "./icon";
import { Icon } from "./icon";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: IconComponent;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { action, className, description, icon, secondaryAction, title, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("n-empty-state", className)} data-slot="root" {...props}>
      {icon ? (
        <div className="n-empty-state__mark" data-slot="mark" aria-hidden>
          <Icon icon={icon} />
        </div>
      ) : null}
      <h3 data-slot="title">{title}</h3>
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
