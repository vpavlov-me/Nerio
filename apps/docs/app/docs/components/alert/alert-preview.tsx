"use client";

import { Info, X } from "@nerio-ui/adapters/icons";
import { Alert } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

export function AlertPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Alert preview">
      <div className="component-example__preview alert-showcase__preview">
        <Alert
          action={<Button size="sm">Refresh</Button>}
          closeAction={
            <Button
              aria-label="Close alert"
              icon={X}
              size="sm"
              tooltip={false}
              variant="secondary"
            />
          }
          icon={Info}
          title="Update available"
        >
          A new version of the application is available. Refresh to get the latest features and
          fixes.
        </Alert>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { Info, X } from "@nerio-ui/adapters/icons";\nimport { Alert } from "@nerio-ui/ui";\nimport { Button } from "@nerio-ui/ui/client";\n\n<Alert\n  icon={Info}\n  title="Update available"\n  action={<Button size="sm">Refresh</Button>}\n  closeAction={\n    <Button\n      aria-label="Close alert"\n      icon={X}\n      size="sm"\n      tooltip={false}\n      variant="secondary"\n    />\n  }\n>\n  A new version of the application is available. Refresh to get the latest features and fixes.\n</Alert>'
        }
        label="Alert live preview code"
      />
    </section>
  );
}
