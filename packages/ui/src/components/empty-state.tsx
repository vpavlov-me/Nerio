import * as React from "react";
import { cn } from "../lib/cn";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(function EmptyState(
  { className, title, description, action, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("n-empty-state", className)} data-slot="root" {...props}>
      <div className="n-empty-state__mark" data-slot="mark" aria-hidden />
      <h3 data-slot="title">{title}</h3>
      <p data-slot="description">{description}</p>
      {action ? <div data-slot="action">{action}</div> : null}
    </div>
  );
});
