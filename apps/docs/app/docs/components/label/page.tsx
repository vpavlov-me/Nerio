"use client";

import { Check, X } from "@nerio/adapters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Input,
  Label,
  LabelContent,
  LabelRequired,
  LabelRow,
} from "@nerio/ui";
import { LabelHint } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";

const usageCode = `import {
  Input,
  Label,
  LabelContent,
  LabelRequired,
  LabelRow,
} from "@nerio/ui";
import { LabelHint } from "@nerio/ui/client";

<LabelRow>
  <LabelContent>
    <Label htmlFor="project-name">Project name</Label>
    <LabelRequired />
    <LabelHint label="Choose a recognizable name for collaborators." />
  </LabelContent>
</LabelRow>
<Input id="project-name" required />`;

const apiRows = [
  ["Label", "LabelHTMLAttributes", "Native label that supplies the accessible control name."],
  [
    "LabelRow",
    "HTMLAttributes",
    "Keeps label text and a supplementary hint as separate semantic siblings.",
  ],
  ["LabelContent", "HTMLAttributes", "Groups the native label, required marker, and hint."],
  [
    "LabelRequired",
    "HTMLAttributes",
    "Visual red asterisk; pair with the control's required attribute.",
  ],
  [
    "LabelHint",
    "label + ariaLabel?",
    "Small client-only question icon with a supplementary tooltip.",
  ],
] as const;

const anatomyRows = [
  ["root", "Native <label> associated with a control through htmlFor."],
  ["content", "Left-side group for the label text, required marker, and hint."],
  ["required", "Red visual asterisk that never replaces native required semantics."],
  ["hint", "Question-mark tooltip trigger for non-essential context beside the label."],
] as const;

const stateRows = [
  ["Default", "The visible Label gives the control its accessible name."],
  ["Required", "LabelRequired adds a visual marker while the control uses native required."],
  ["Hint", "LabelHint reveals supplementary guidance on hover, focus, or activation."],
] as const;

const implementationRows = [
  ["Registry item", "label installs Label, composition helpers, and LabelHint source files."],
  ["Base UI", "Tooltip for LabelHint only."],
  ["Registry dependencies", "tooltip"],
  ["Package dependencies", "@nerio/adapters, clsx, react"],
] as const;

const tokenRows = [
  ["Typography", "--n-label-font-size / --n-label-font-weight", "Label text hierarchy."],
  ["Layout", "--n-label-gap", "Rhythm between label text, required marker, and hint."],
  ["Required", "--n-label-required-color", "Required marker color."],
  ["Context", "--n-label-hint-icon-size / --n-label-icon-color", "Hint icon treatment."],
  ["Focus", "--n-focus-ring", "Visible keyboard focus for the hint."],
] as const;

function LabelPreview({ children }: { children: React.ReactNode }) {
  return <div className="label-section-preview">{children}</div>;
}

function LabelExample({
  id,
  label,
  required = false,
  hint,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div className="form-preview-stack">
      <LabelRow>
        <LabelContent>
          <Label htmlFor={id}>{label}</Label>
          {required ? <LabelRequired /> : null}
          {hint ? <LabelHint label={hint} /> : null}
        </LabelContent>
      </LabelRow>
      <Input id={id} placeholder="Roadmap refresh" required={required} />
    </div>
  );
}

function Preview() {
  return (
    <section id="preview" className="label-showcase" aria-label="Label preview">
      <div className="label-showcase__preview">
        <LabelExample
          hint="Choose a recognizable name for collaborators."
          id="preview-project-name"
          label="Project name"
          required
        />
      </div>
      <CodeExample
        className="component-example__code"
        code={usageCode}
        label="Label live preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Label"
      lede="Labels name form controls. Keep required and supplementary hint context compact and beside the visible label."
      kind="label"
      preview={<Preview />}
      sectionPreviews={{
        usage: (
          <LabelPreview>
            <LabelExample
              hint="Used in navigation, tables, and activity."
              id="usage-project-name"
              label="Project name"
              required
            />
          </LabelPreview>
        ),
        variants: (
          <LabelPreview>
            <LabelExample id="default-project-name" label="Project name" />
            <LabelExample id="required-project-name" label="Project name" required />
          </LabelPreview>
        ),
        anatomy: (
          <LabelPreview>
            <div className="label-anatomy-preview">
              <span>LabelRow</span>
              <span>LabelContent</span>
              <span>Label + required + hint</span>
            </div>
            <LabelExample
              hint="Supplementary context lives in a Tooltip."
              id="anatomy-project-name"
              label="Project name"
              required
            />
          </LabelPreview>
        ),
        states: (
          <LabelPreview>
            <LabelExample id="state-default" label="Workspace name" />
            <LabelExample id="state-required" label="Notification email" required />
          </LabelPreview>
        ),
        motion: (
          <LabelPreview>
            <LabelExample
              hint="Focus this trigger with Tab or activate it to read the extra context."
              id="motion-project-name"
              label="Project name"
            />
          </LabelPreview>
        ),
        accessibility: (
          <LabelPreview>
            <LabelExample
              hint="This tooltip clarifies the label but does not carry a required instruction."
              id="accessibility-project-name"
              label="Project name"
              required
            />
          </LabelPreview>
        ),
        api: (
          <LabelPreview>
            <LabelExample
              hint="Short supplementary guidance."
              id="api-project-name"
              label="Project name"
              required
            />
          </LabelPreview>
        ),
      }}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Composition", "Use"]}
            rows={[
              ["Default", "A visible native Label paired with one control."],
              ["Required", "Add LabelRequired and the control's native required attribute."],
              [
                "With hint",
                "Use LabelRow and LabelContent to keep supplementary guidance beside the label.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Part", "Props", "Purpose"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={implementationRows}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Keep the label visible and use a short LabelHint only for supplementary context.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Do not put a button or link inside the native Label, or use a lock icon without a
                matching control state.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Field",
                "Composes Label, one control, description, and validation message.",
                "/docs/components/field",
              ],
              [
                "Input",
                "A text control that needs an accessible name and native required or readOnly state.",
                "/docs/components/input",
              ],
              [
                "Tooltip",
                "Provides the shared overlay behavior used by LabelHint.",
                "/docs/components/tooltip",
              ],
            ].map(([title, description, href]) => (
              <Card key={title} className="doc-related-card" href={href} variant="secondary">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        ),
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
