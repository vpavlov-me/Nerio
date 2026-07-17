import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { Checkbox } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { createPageMetadata } from "../../../../lib/seo";

export const metadata = createPageMetadata({
  title: "Checkbox component",
  description:
    "Checkboxes toggle independent options with checked, indeterminate, disabled, read-only, and descriptive label states.",
  path: "/docs/components/checkbox",
});

const variantRows = [["Default", "Independent binary option."]] as const;

const anatomyRows = [
  ["field", "Optional wrapper that groups a Checkbox with its label and description."],
  ["root", "Base UI checkbox control with checked, indeterminate, disabled, and read-only state."],
  ["indicator", "Nerio icon adapter Check or Minus indicator."],
  ["label", "Optional visible name connected to the control with aria-labelledby."],
  ["description", "Optional supporting text connected with aria-describedby."],
] as const;

const stateRows = [
  ["Unchecked", "Option is available but not selected."],
  ["Checked", "Option is selected."],
  ["Indeterminate", "Represents an aggregate or partial selection."],
  ["Invalid", "Explicit invalid state maps to aria-invalid."],
  ["Disabled", "Option is unavailable."],
  ["Read-only", "Option remains visible but does not accept changes."],
] as const;

const apiRows = [
  [
    "checked / defaultChecked / onCheckedChange",
    "Controlled and uncontrolled checked-state APIs from the Base UI root.",
  ],
  ["label", "Optional visible name for a checkbox field row."],
  ["description", "Optional supporting text displayed below label and announced as a description."],
  [
    "name / value / form / required / disabled / readOnly",
    "Native form metadata is preserved through the Base UI root props.",
  ],
  ["invalid", "Sets data-invalid and aria-invalid when true."],
  ["className", "Extends the checkbox control, not the optional field wrapper."],
] as const;

const implementationRows = [
  [
    "Registry item",
    "checkbox installs 7 Tailwind-first source files into the configured components directory.",
  ],
  ["Base UI", "checkbox"],
  ["Registry dependencies", "None."],
  [
    "Package dependencies",
    "@base-ui/react, @nerio-ui/adapters, clsx, react, tailwind-merge, tailwindcss",
  ],
] as const;

const tokenRows = [
  ["Sizing", "--n-checkbox-size", "Control size across density modes."],
  ["Shape", "--n-checkbox-radius", "Four-pixel corner radius for familiar checkbox geometry."],
  [
    "Selected",
    "--n-color-action-primary / --n-color-action-on-primary",
    "Selected surface and icon.",
  ],
  ["Invalid", "--n-input-border-danger", "Invalid border treatment."],
  ["Focus", "--n-focus-ring", "Visible keyboard focus treatment."],
] as const;

function CheckboxPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Checkbox preview">
      <div className="component-example__preview">
        <div className="form-preview-stack">
          <Checkbox
            defaultChecked
            description="Archived collections remain visible in search results."
            label="Include archived collections"
          />
          <Checkbox
            description="This selection represents a partial set of archived collections."
            indeterminate
            label="Some collections are archived"
          />
          <Checkbox disabled label="Archived collections are unavailable" />
        </div>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { Checkbox } from "@nerio-ui/ui/client";\n\n<Checkbox\n  defaultChecked\n  label="Include archived collections"\n  description="Archived collections remain visible in search results."\n/>'
        }
        label="Checkbox live preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Checkbox"
      lede="Checkboxes toggle independent options and support checked, unchecked, indeterminate, invalid, disabled, and read-only states."
      kind="checkbox"
      preview={<CheckboxPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Variant", "Use"]} rows={variantRows} codeColumns={1} />
        ),
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Purpose"]} rows={apiRows} codeColumns={1} />,
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
                Use Checkbox for independent choices, agreement controls, and multi-select filters.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Checkbox for mutually exclusive options or immediate on/off settings; use
                RadioGroup or Switch instead.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "RadioGroup",
                "Choose one option from a short visible set.",
                "/docs/components/radio-group",
              ],
              ["Switch", "Toggle an immediate binary setting.", "/docs/components/switch"],
              [
                "Field",
                "Compose labels, descriptions, and validation for form controls.",
                "/docs/components/field",
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
