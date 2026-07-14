import { Check, X } from "@nerio/adapters/icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  Icon,
  Input,
  InputGroup,
  InputGroupAddon,
} from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const inputGroupDoc = getComponentDoc("input-group");

const variantRows = [
  ["start", "Places context before the native Input."],
  ["end", "Places context or one compact action after the native Input."],
  ["sm / md / lg", "Aligns addons to the nested Input size."],
] as const;

const stateRows = [
  ["Default", "Keeps the Input and addons visually grouped."],
  ["Focus within", "Applies the shared focus treatment when the nested Input is focused."],
  ["Invalid", "Mirrors the nested Input invalid state without owning validation."],
  ["Disabled / read-only", "Preserves the nested Input native availability semantics."],
] as const;

const apiRows = [
  ["InputGroup", "div attributes and Field wiring", "Owns only grouped layout and state styling."],
  ["placement", "start | end", "Positions an InputGroupAddon around the Input."],
  ["children", "ReactNode", "Composes one Input with explicit addons."],
] as const;

export const metadata = createPageMetadata({
  title: "InputGroup component",
  description: inputGroupDoc!.description,
  path: "/docs/components/input-group",
});

export default function Page() {
  return (
    <StandardDocPage
      title={inputGroupDoc!.title}
      lede={inputGroupDoc!.description}
      kind="input-group"
      preview={
        <section id="preview" className="component-example" aria-label="InputGroup preview">
          <div className="component-example__preview form-component-preview">
            <Field
              label="Website"
              description="The prefix is visual context; the label names the control."
            >
              <InputGroup>
                <InputGroupAddon placement="start" aria-hidden="true">
                  https://
                </InputGroupAddon>
                <Input autoComplete="url" />
                <InputGroupAddon placement="end" aria-hidden="true">
                  .com
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
          <CodeExample
            className="component-example__code"
            code={
              'import { Field, Input, InputGroup, InputGroupAddon } from "@nerio/ui";\n\n<Field label="Website">\n  <InputGroup>\n    <InputGroupAddon placement="start" aria-hidden="true">https://</InputGroupAddon>\n    <Input autoComplete="url" />\n    <InputGroupAddon placement="end" aria-hidden="true">.com</InputGroupAddon>\n  </InputGroup>\n</Field>'
            }
            label="InputGroup live preview code"
          />
        </section>
      }
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Mode", "Purpose"]} rows={variantRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["API", "Values", "Purpose"]} rows={apiRows} />,
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use explicit Field, Label, or aria-describedby context and keep decorative addons
                hidden from assistive technology.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Move validation, search results, password visibility, parsing, or asynchronous
                behavior into InputGroup.
              </CardContent>
            </Card>
          </div>
        ),
      }}
    />
  );
}
