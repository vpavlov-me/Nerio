"use client";

import { UserPlus } from "@nerio-ui/adapters/icons";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Icon,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

const usageCode = `import { UserPlus } from "@nerio-ui/adapters/icons";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Icon,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";

<EmptyState size="lg">
  <EmptyStateMedia aria-hidden="true">
    <Icon icon={UserPlus} />
  </EmptyStateMedia>
  <EmptyStateHeader>
    <EmptyStateTitle>No team members yet</EmptyStateTitle>
    <EmptyStateDescription>
      Invite people to collaborate on projects and share updates with the team.
    </EmptyStateDescription>
  </EmptyStateHeader>
  <EmptyStateActions>
    <Button leadingIcon={UserPlus} size="md">Invite team members</Button>
  </EmptyStateActions>
</EmptyState>`;

export function EmptyStatePreview() {
  return (
    <section id="preview" className="component-example" aria-label="EmptyState preview">
      <div className="component-example__preview">
        <EmptyState size="lg">
          <EmptyStateMedia aria-hidden="true">
            <Icon icon={UserPlus} />
          </EmptyStateMedia>
          <EmptyStateHeader>
            <EmptyStateTitle>No team members yet</EmptyStateTitle>
            <EmptyStateDescription>
              Invite people to collaborate on projects and share updates with the team.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button leadingIcon={UserPlus} size="md">
              Invite team members
            </Button>
          </EmptyStateActions>
        </EmptyState>
      </div>
      <CodeExample
        className="component-example__code"
        code={usageCode}
        label="EmptyState preview code"
      />
    </section>
  );
}
