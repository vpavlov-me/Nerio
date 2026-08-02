"use client";

import { ArrowUp } from "@nerio-ui/adapters/icons";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

export function ButtonPreview() {
  return (
    <section id="preview" className="button-showcase" aria-label="Button preview">
      <div className="button-showcase__preview">
        <Button>Button</Button>
        <Button icon={ArrowUp} aria-label="Move up" tooltip="Move up" />
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { ArrowUp } from "@nerio-ui/adapters/icons";\nimport { Button } from "@nerio-ui/ui/client";\n\n<Button>Button</Button>\n<Button icon={ArrowUp} aria-label="Move up" tooltip="Move up" />'
        }
        label="Button live preview code"
      />
    </section>
  );
}
