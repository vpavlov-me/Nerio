import * as React from "react";

export interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="n-empty-state" data-slot="root">
      <div className="n-empty-state__mark" data-slot="mark" aria-hidden />
      <h3 data-slot="title">{title}</h3>
      <p data-slot="description">{description}</p>
      {action ? <div data-slot="action">{action}</div> : null}
    </div>
  );
}
