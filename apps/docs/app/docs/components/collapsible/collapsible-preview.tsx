"use client";

import { ChevronDown } from "@nerio-ui/adapters/icons";
import { Icon } from "@nerio-ui/ui";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

const usage = `import { ChevronDown } from "@nerio-ui/adapters/icons";
import { Icon } from "@nerio-ui/ui";
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@nerio-ui/ui/client";

<Collapsible>
  <CollapsibleTrigger>
    Recovery keys
    <Icon aria-hidden icon={ChevronDown} />
  </CollapsibleTrigger>
  <CollapsiblePanel>
    Generate a new set before revoking the current recovery keys.
  </CollapsiblePanel>
</Collapsible>`;

export function CollapsiblePreview() {
  return (
    <section className="component-example" aria-label="Collapsible example">
      <div className="component-example__preview disclosure-doc-preview">
        <Collapsible>
          <CollapsibleTrigger>
            Recovery keys
            <Icon aria-hidden className="disclosure-doc-indicator" icon={ChevronDown} />
          </CollapsibleTrigger>
          <CollapsiblePanel>
            Generate a new set before revoking the current recovery keys.
          </CollapsiblePanel>
        </Collapsible>
      </div>
      <CodeExample
        className="component-example__code"
        code={usage}
        label="Collapsible example code"
      />
    </section>
  );
}
