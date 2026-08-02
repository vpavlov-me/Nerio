"use client";

import { Input, Label, LabelContent, LabelRequired, LabelRow } from "@nerio-ui/ui";
import { LabelHint } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";

const usageCode = `import {
  Input,
  Label,
  LabelContent,
  LabelRequired,
  LabelRow,
} from "@nerio-ui/ui";
import { LabelHint } from "@nerio-ui/ui/client";

<LabelRow>
  <LabelContent>
    <Label htmlFor="project-name">Project name</Label>
    <LabelRequired />
    <LabelHint label="Choose a recognizable name for collaborators." />
  </LabelContent>
</LabelRow>
<Input id="project-name" required />`;

function LabelExample() {
  return (
    <div className="form-preview-stack">
      <LabelRow>
        <LabelContent>
          <Label htmlFor="preview-project-name">Project name</Label>
          <LabelRequired />
          <LabelHint label="Choose a recognizable name for collaborators." />
        </LabelContent>
      </LabelRow>
      <Input id="preview-project-name" placeholder="Roadmap refresh" required />
    </div>
  );
}

export function LabelPreview() {
  return (
    <section id="preview" className="label-showcase" aria-label="Label preview">
      <div className="label-showcase__preview">
        <LabelExample />
      </div>
      <CodeExample
        className="component-example__code"
        code={usageCode}
        label="Label live preview code"
      />
    </section>
  );
}
