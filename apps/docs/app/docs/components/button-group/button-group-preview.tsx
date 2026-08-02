"use client";

import { ChevronDown } from "@nerio-ui/adapters/icons";
import { Badge, ButtonGroup } from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

export function ButtonGroupPreview() {
  return (
    <section id="preview" className="button-showcase" aria-label="ButtonGroup preview">
      <div className="button-showcase__preview">
        <ButtonGroup aria-label="Repository actions">
          <Button
            badge={
              <Badge size="sm" tone="info">
                24
              </Badge>
            }
            variant="secondary"
          >
            Fork
          </Button>
          <Button icon={ChevronDown} aria-label="More fork actions" variant="secondary" />
        </ButtonGroup>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { ChevronDown } from "@nerio-ui/adapters/icons";\nimport { Badge, ButtonGroup } from "@nerio-ui/ui";\nimport { Button } from "@nerio-ui/ui/client";\n\n<ButtonGroup aria-label="Repository actions">\n  <Button badge={<Badge size="sm" tone="info">24</Badge>} variant="secondary">\n    Fork\n  </Button>\n  <Button icon={ChevronDown} aria-label="More fork actions" variant="secondary" />\n</ButtonGroup>'
        }
        label="ButtonGroup live preview code"
      />
    </section>
  );
}
