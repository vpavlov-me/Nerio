import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Field, Icon, Input } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const inputDoc = getComponentDoc("input");

const variantRows = [
  ["sm / md / lg", "Shared density-aware control sizes; md is the default."],
  [
    "Text-like types",
    "Text, email, password, search, tel, url, and number preserve native semantics.",
  ],
  [
    "Temporal types",
    "Date, month, week, time, and datetime-local preserve browser pickers, localized chrome, and native values.",
  ],
] as const;

const stateRows = [
  ["Default", "Accepts supported values through native input behavior."],
  ["Invalid", "Exposes aria-invalid and the danger border token without owning validation."],
  ["Read-only", "Keeps the value focusable and selectable without accepting edits."],
  ["Disabled", "Removes the control from interaction and applies disabled tokens."],
] as const;

const apiRows = [
  ["size", "sm | md | lg", "Selects the density-aware control height."],
  ["htmlSize", "number", "Forwards the native input size attribute where applicable."],
  ["type", "Supported native type", "Preserves native keyboard and form semantics."],
  ["min / max / step", "Native values", "Forwards temporal and numeric constraints unchanged."],
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
              <Field
                label="Project name"
                description="A label and description remain outside the native Input."
              >
                <Input
                  id="input-preview-project-name"
                  placeholder="Launch materials"
                  required
                  autoComplete="organization"
                />
              </Field>
            </div>
          </div>
          <CodeExample
            className="component-example__code"
            code={
              'import { Field, Input } from "@nerio-ui/ui";\n\n<Field label="Project name" description="A label and description remain outside the native Input.">\n  <Input id="project-name" placeholder="Launch materials" autoComplete="organization" required />\n</Field>'
            }
            label="Input live preview code"
          />
        </section>
      }
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
                outside the native Input. Prefer temporal types when browser-owned entry, picker,
                validation, and direct form submission are the right product path.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Parse localized temporal display strings, suppress native picker affordances, or
                turn Input into Calendar, DatePicker, scheduling, or timezone workflow behavior.
              </CardContent>
            </Card>
          </div>
        ),
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={[
              ["Registry item", "input installs 7 source files."],
              ["Base UI", "No interactive primitive required."],
              ["Temporal behavior", "Native browser and operating-system control."],
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
