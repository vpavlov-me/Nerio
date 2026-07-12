import { Button } from "@nerio/ui/client";
import { Field, Input, InputGroup, InputGroupAddon } from "@nerio/ui";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const inputGroupDoc = getComponentDoc("input-group");

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
        <section
          className="component-preview form-component-preview"
          aria-label="InputGroup preview"
        >
          <div className="form-preview-stack form-component-preview__stack">
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
            <Field label="Invite code">
              <InputGroup>
                <InputGroupAddon placement="start" aria-hidden="true">
                  #
                </InputGroupAddon>
                <Input placeholder="NERIO-2026" />
                <InputGroupAddon placement="end">
                  <Button size="sm">Copy</Button>
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field label="Budget" message="Enter an amount greater than zero." invalid>
              <InputGroup>
                <InputGroupAddon placement="start" aria-hidden="true">
                  $
                </InputGroupAddon>
                <Input type="number" invalid defaultValue={0} />
                <InputGroupAddon placement="end" aria-hidden="true">
                  USD
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </div>
        </section>
      }
      sectionContent={{
        variants: (
          <p>
            InputGroup has no mode props. Use an Input size and explicit <code>start</code> or{" "}
            <code>end</code> addons; the group aligns to its Input.
          </p>
        ),
        states: (
          <p>
            The root presents hover, focus-within, invalid, disabled, and read-only state without
            replacing the nested Input&apos;s native semantics.
          </p>
        ),
        api: (
          <p>
            <code>InputGroup</code> accepts ordinary div attributes and Field wiring.{" "}
            <code>InputGroupAddon</code> accepts div attributes plus a required{" "}
            <code>placement</code>.
          </p>
        ),
        guidance: (
          <p>
            Use explicit Field, Label, or aria-describedby context. Decorative icons should be
            aria-hidden. InputGroup never owns validation, search results, password visibility,
            parsing, or asynchronous behavior.
          </p>
        ),
      }}
    />
  );
}
