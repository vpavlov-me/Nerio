import { Check, X } from "@nerio-ui/adapters/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormMessage,
  Icon,
  Input,
  Label,
  LabelContent,
  LabelRow,
} from "@nerio-ui/ui";
import { LabelHint } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { PhoneInputPreview } from "../../../../components/phone-input-preview";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const inputDoc = getComponentDoc("input");

const variantRows = [
  ["sm / md / lg", "Shared density-aware control sizes; md is the default."],
  ["Native types", "Text, email, password, search, tel, url, and number semantics."],
] as const;

const stateRows = [
  ["Default", "Accepts editable text-like values through native input behavior."],
  ["Invalid", "Exposes aria-invalid and the danger border token without owning validation."],
  ["Read-only", "Keeps the value focusable and selectable without accepting edits."],
  ["Disabled", "Removes the control from interaction and applies disabled tokens."],
] as const;

const apiRows = [
  ["size", "sm | md | lg", "Selects the density-aware control height."],
  ["htmlSize", "number", "Forwards the native input size attribute."],
  ["type", "Supported native type", "Preserves native keyboard and form semantics."],
  ["invalid", "boolean", "Exposes the invalid state for Field and FormMessage composition."],
  ["className", "string", "Extends the root without replacing component tokens."],
] as const;

export const metadata = createPageMetadata({
  title: "Input component",
  description: inputDoc!.description,
  path: "/docs/components/input",
});

export default function Page() {
  return (
    <StandardDocPage
      key="input-doc-page"
      title={inputDoc!.title}
      lede={inputDoc!.description}
      kind="input"
      preview={
        <section id="preview" className="component-example" aria-label="Input preview">
          <div className="component-example__preview form-component-preview form-component-preview--input">
            <div className="form-preview-stack form-component-preview__stack">
              <div className="n-field">
                <LabelRow>
                  <LabelContent>
                    <Label htmlFor="input-preview-project-name">Project name</Label>
                  </LabelContent>
                  <LabelHint
                    key="project-name-hint"
                    label="Choose a short name collaborators will recognize."
                  />
                </LabelRow>
                <Input
                  id="input-preview-project-name"
                  placeholder="Launch materials"
                  required
                  autoComplete="organization"
                />
                <p className="n-field__description">
                  A label and description remain outside the native Input.
                </p>
              </div>
            </div>
          </div>
          <CodeExample
            className="component-example__code"
            code={
              'import { Input, Label } from "@nerio-ui/ui";\n\n<Label htmlFor="project-name">Project name</Label>\n<Input id="project-name" placeholder="Launch materials" autoComplete="organization" required />'
            }
            label="Input live preview code"
          />
        </section>
      }
      sectionPreviews={{
        variants: (
          <div className="doc-section-preview" aria-label="Input size preview">
            <div className="docs-input-grid">
              <Input aria-label="Small input" size="sm" placeholder="Small" />
              <Input aria-label="Medium input" defaultValue="Medium" />
              <Input aria-label="Large input" size="lg" placeholder="Large" />
            </div>
          </div>
        ),
        states: (
          <div className="doc-section-preview" aria-label="Input state preview">
            <div className="form-preview-stack">
              <div className="n-field" data-invalid="">
                <LabelRow>
                  <LabelContent>
                    <Label htmlFor="input-preview-workspace-slug">Workspace slug</Label>
                  </LabelContent>
                </LabelRow>
                <Input
                  id="input-preview-workspace-slug"
                  aria-describedby="input-preview-workspace-slug-message"
                  defaultValue="Nerio Workspace"
                  invalid
                />
                <FormMessage id="input-preview-workspace-slug-message" role="alert" tone="danger">
                  Use lowercase letters, numbers, and hyphens.
                </FormMessage>
              </div>
              <div className="docs-input-grid">
                <Input aria-label="Read-only project key" readOnly defaultValue="NERIO-2026" />
                <Input aria-label="Unavailable input" disabled placeholder="Unavailable" />
              </div>
            </div>
          </div>
        ),
        api: (
          <div className="doc-section-preview" aria-label="Input type preview">
            <div className="docs-input-grid">
              <Input
                aria-label="Email address"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
              />
              <PhoneInputPreview key="phone-input-preview" />
              <Input aria-label="Seats" type="number" min={1} step={1} defaultValue={12} />
            </div>
          </div>
        ),
      }}
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Variant", "Purpose"]} rows={variantRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Values", "Purpose"]} rows={apiRows} />,
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use autocomplete and inputMode intentionally, and compose labels and messages
                outside the native Input.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Add prefix, suffix, search results, or validation behavior directly to Input; use
                InputGroup or a dedicated control.
              </CardContent>
            </Card>
          </div>
        ),
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={[
              ["Registry item", "input installs 6 source files."],
              ["Base UI", "No interactive primitive required."],
              ["Registry dependencies", "None."],
              ["Package dependencies", "clsx, react, tailwind-merge, tailwindcss"],
            ]}
            codeColumns={1}
          />
        ),
        tokens: (
          <DocumentationTable
            headers={["Token", "Group", "Controls"]}
            rows={[
              ["--n-input-height-sm", "Sizing", "Small control height."],
              ["--n-input-height-md", "Sizing", "Default control height."],
              ["--n-input-height-lg", "Sizing", "Large control height."],
              ["--n-input-radius", "Shape", "Control corner radius."],
              ["--n-input-background", "Surface", "Default control surface."],
              ["--n-input-foreground", "Surface", "Default input text."],
              ["--n-input-border", "Border", "Default border."],
              ["--n-input-border-hover", "Border", "Hover border."],
              ["--n-input-border-focus", "Border", "Focused border."],
              ["--n-input-border-danger", "Invalid", "Invalid border treatment."],
              ["--n-motion-focus-duration", "Focus", "Focus transition duration."],
              ["--n-focus-ring", "Focus", "Visible focus treatment."],
            ]}
            codeColumns={1}
          />
        ),
      }}
    />
  );
}
