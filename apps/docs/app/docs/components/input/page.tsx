import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";
import { FormMessage, Input, Label, LabelContent, LabelRow } from "@nerio/ui";
import { LabelHint } from "@nerio/ui/client";
import { PhoneInputPreview } from "../../../../components/phone-input-preview";

const inputDoc = getComponentDoc("input");

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
        <section
          key="input-preview"
          className="component-preview form-component-preview form-component-preview--input"
          aria-label="Input preview"
        >
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
            <div className="n-field" data-invalid="">
              <LabelRow>
                <LabelContent>
                  <Label htmlFor="input-preview-workspace-slug">Workspace slug</Label>
                </LabelContent>
                <LabelHint
                  key="workspace-slug-hint"
                  label="Use lowercase letters, numbers, and hyphens."
                />
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
          </div>
        </section>
      }
      sectionPreviews={{
        variants: (
          <section
            key="input-size-preview"
            className="component-preview form-component-preview form-component-preview--input"
            aria-label="Input size preview"
          >
            <div className="form-component-preview__section">
              <p className="form-component-preview__label">Sizes</p>
              <div className="docs-input-grid">
                <Input aria-label="Small input" size="sm" placeholder="Small" />
                <Input aria-label="Medium input" defaultValue="Medium" />
                <Input aria-label="Large input" size="lg" placeholder="Large" />
              </div>
            </div>
          </section>
        ),
        states: (
          <section
            key="input-state-preview"
            className="component-preview form-component-preview form-component-preview--input"
            aria-label="Input state preview"
          >
            <div className="form-component-preview__section">
              <p className="form-component-preview__label">Availability states</p>
              <div className="docs-input-grid">
                <Input aria-label="Read-only project key" readOnly defaultValue="NERIO-2026" />
                <Input aria-label="Unavailable input" disabled placeholder="Unavailable" />
              </div>
            </div>
          </section>
        ),
        api: (
          <section
            key="input-type-preview"
            className="component-preview form-component-preview form-component-preview--input"
            aria-label="Input type preview"
          >
            <div className="form-component-preview__section">
              <p className="form-component-preview__label">Native input types</p>
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
          </section>
        ),
      }}
      sectionContent={{
        variants: (
          <p>
            Use <code>sm</code>, <code>md</code>, or <code>lg</code>; supported types are text,
            email, password, search, tel, url, and number.
          </p>
        ),
        states: (
          <p>
            Placeholder text is not a label. Disabled inputs are unavailable; read-only inputs
            remain focusable and selectable. Input exposes state but never owns validation logic.
          </p>
        ),
        api: (
          <p>
            <code>InputProps</code> is native input attributes minus <code>size</code> and{" "}
            <code>type</code>, plus <code>size</code>, <code>htmlSize</code>, <code>type</code>, and{" "}
            <code>invalid</code>. This phone preview filters to digits, spaces, <code>+</code>,{" "}
            <code>-</code>, and parentheses; production phone parsing and validation remain
            consumer-owned. Number Input deliberately keeps native numeric semantics while hiding
            browser spin buttons; a future NumberField will own explicit stepper controls.
          </p>
        ),
        implementation: (
          <div className="documentation-table-wrap">
            <table className="documentation-table">
              <thead>
                <tr>
                  <th>Contract</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Registry item</td>
                  <td>
                    <code>input</code> installs 5 source files.
                  </td>
                </tr>
                <tr>
                  <td>Base UI</td>
                  <td>No interactive primitive required.</td>
                </tr>
                <tr>
                  <td>Registry dependencies</td>
                  <td>None.</td>
                </tr>
                <tr>
                  <td>Package dependencies</td>
                  <td>
                    <code>clsx</code>, <code>react</code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
        tokens: (
          <div className="documentation-table-wrap">
            <table className="documentation-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>--n-input-height-sm</code>, <code>--n-input-height-md</code>,{" "}
                    <code>--n-input-height-lg</code>
                  </td>
                  <td>Shared control heights.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-input-radius</code>
                  </td>
                  <td>Control corner radius.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-input-background</code>, <code>--n-input-foreground</code>
                  </td>
                  <td>Default surface and text.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-input-border</code>, <code>--n-input-border-hover</code>,{" "}
                    <code>--n-input-border-focus</code>
                  </td>
                  <td>Default and interactive border states.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-input-border-danger</code>, <code>--n-input-placeholder</code>
                  </td>
                  <td>Invalid and placeholder treatment.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-input-disabled-background</code>,{" "}
                    <code>--n-input-disabled-foreground</code>
                  </td>
                  <td>Disabled state.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-input-readonly-background</code>,{" "}
                    <code>--n-input-readonly-border</code>
                  </td>
                  <td>Read-only state.</td>
                </tr>
                <tr>
                  <td>
                    <code>--n-motion-hover-duration</code>, <code>--n-motion-focus-duration</code>,{" "}
                    <code>--n-focus-ring</code>
                  </td>
                  <td>Motion and focus treatment.</td>
                </tr>
              </tbody>
            </table>
          </div>
        ),
        guidance: (
          <p>
            Use autocomplete and inputMode intentionally. Compose visual prefix, suffix, icon,
            action, or status content with InputGroup; use separate future controls for advanced
            search and date workflows.
          </p>
        ),
      }}
    />
  );
}
