import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { createPageMetadata } from "../../../../lib/seo";
import { TogglePreview } from "./toggle-preview";

export const metadata = createPageMetadata({
  title: "Toggle component",
  description:
    "Toggle represents one independent button state that remains pressed or not pressed with stable aria-pressed semantics.",
  path: "/docs/components/toggle",
});

const variantRows = [
  ["ghost", "Restrained default for dense or repeated controls."],
  ["outline", "Adds a stable boundary around the independent state."],
  ["sm / md / lg", "Shared action heights for icon-only and visible-label content."],
] as const;
const anatomyRows = [
  ["toggle", "Native Base UI toggle button and public pressed-state owner."],
  ["toggle-icon", "Optional leading Nerio icon for visible-label content."],
  ["toggle-label", "Visible label that remains semantically stable while state changes."],
] as const;
const stateRows = [
  ["Unpressed", 'aria-pressed="false"; data-pressed is absent.'],
  [
    "Pressed",
    'aria-pressed="true"; data-pressed adds a neutral selected fill and accent foreground.',
  ],
  ["Hover / active", "Transient interaction remains distinct from the retained pressed state."],
  ["Focus-visible", "Shared focus ring remains visible in both pressed states."],
  ["Disabled", "Activation is blocked while pressed or unpressed presentation remains visible."],
] as const;
const apiRows = [
  [
    "pressed / defaultPressed / onPressedChange",
    "Controlled and uncontrolled state with Base UI event details and cancellation.",
  ],
  ["icon / aria-label", "Icon-only mode with a required stable accessible name."],
  ["children / leadingIcon", "Visible-label mode with an optional leading Nerio icon."],
  ["variant", 'Selects "ghost" or "outline"; ghost is the default.'],
  ["size", 'Selects "sm", "md", or "lg"; md is the default.'],
  ["value", "Stable identifier reserved for future direct ToggleGroup composition."],
  [
    "disabled / className / style / render / nativeButton",
    "Preserves Base UI disabled and render-composition contracts.",
  ],
] as const;
const implementationRows = [
  ["Registry item", "toggle installs 8 Tailwind-first source, utility, bridge, and token files."],
  ["Base UI", "toggle"],
  ["Registry dependencies", "None."],
  [
    "Package dependencies",
    "@base-ui/react, @nerio-ui/adapters, clsx, react, tailwind-merge, tailwindcss",
  ],
] as const;
const tokenRows = [
  [
    "Sizing",
    "--n-toggle-height-sm / --n-toggle-height-md / --n-toggle-height-lg / --n-toggle-radius",
    "Shared action geometry and density.",
  ],
  [
    "Unpressed",
    "--n-toggle-background-ghost / --n-toggle-background-outline / --n-toggle-border-outline",
    "Variant-specific neutral surfaces.",
  ],
  [
    "Pressed",
    "--n-toggle-background-pressed / --n-toggle-border-pressed / --n-toggle-foreground-pressed",
    "Neutral retained-state fill with a restrained accent foreground across variants.",
  ],
  ["Focus", "--n-focus-ring", "Visible keyboard focus in either pressed state."],
] as const;

function Preview() {
  return (
    <section id="preview" className="component-example" aria-label="Toggle preview">
      <div className="component-example__preview">
        <TogglePreview />
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { Bell, Save } from "@nerio-ui/adapters/icons";\nimport { Toggle } from "@nerio-ui/ui/client";\n\n<Toggle icon={Bell} aria-label="Follow updates" defaultPressed />\n<Toggle icon={Save} aria-label="Save article for later" variant="outline" />'
        }
        label="Toggle live preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Toggle"
      lede="Toggle represents one independent button state that remains pressed or not pressed."
      kind="toggle"
      preview={<Preview />}
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
                Keep one stable label while aria-pressed communicates state. The visual icon may
                change to reinforce the selected state.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Toggle for immediate settings, form selection, disclosure, momentary actions, or
                grouped values.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              ["Button", "Trigger a momentary action.", "/docs/components/button"],
              ["Switch", "Change an immediate on or off setting.", "/docs/components/switch"],
              ["Checkbox", "Select an item or agreement.", "/docs/components/checkbox"],
              [
                "ButtonGroup",
                "Arrange related actions without adding selection state.",
                "/docs/components/button-group",
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
