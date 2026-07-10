"use client";

import { ArrowRight, ArrowUp, Check, Plus, Save, Settings, X } from "@nerio/adapters";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Kbd } from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { StandardDocPage } from "../../../../components/doc-page";

function ButtonPreview() {
  return (
    <section id="preview" className="button-showcase" aria-label="Button preview">
      <div className="button-showcase__preview">
        <Button variant="outline">Button</Button>
        <Button icon={ArrowUp} aria-label="Move up" tooltip="Move up" variant="outline" />
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { ArrowUp } from "@nerio/adapters";\nimport { Button } from "@nerio/ui/client";\n\n<Button variant="outline">Button</Button>\n<Button icon={ArrowUp} aria-label="Move up" tooltip="Move up" variant="outline" />'
        }
        label="Button live preview code"
      />
    </section>
  );
}

function ButtonSectionPreview({ children }: { children: React.ReactNode }) {
  return <div className="button-section-preview">{children}</div>;
}

const apiRows = [
  ["variant", "primary | secondary | outline | ghost | danger", "Sets action emphasis."],
  ["size", "sm | md | lg", "Uses density-aware height tokens."],
  [
    "leadingIcon / trailingIcon",
    "IconComponent",
    "Places a decorative icon before or after the label.",
  ],
  ["icon + aria-label", "IconComponent + string", "Creates an accessible icon-only action."],
  ["kbd", "<Kbd>", "Displays a quiet shortcut hint after the label."],
  ["tooltip", "ReactNode", "Adds supplemental hover and focus help."],
  ["loading", "boolean", "Shows Spinner, disables activation, and sets aria-busy."],
] as const;

const variantRows = [
  ["primary", "Lead one clear local decision."],
  ["secondary", "Support the primary action without competing with it."],
  ["outline", "Offer a bounded secondary action on a quiet surface."],
  ["ghost", "Keep repeated or low-emphasis actions visually calm."],
  ["danger", "Signal a destructive action that needs explicit intent."],
] as const;

const anatomyRows = [
  ["button", "Base UI button primitive with variant, size, disabled, loading, and focus states."],
  ["button-icon", "Optional leading or trailing icon rendered through the Nerio icon adapter."],
  ["button-label", "Visible action text that remains available while loading."],
  [
    "button-kbd",
    "Optional quiet keyboard shortcut hint placed between the label and trailing icon.",
  ],
] as const;

const stateRows = [
  ["Default, hover, and active", "Variant tokens control interaction feedback."],
  ["Focus", "Focus-visible uses the shared Nerio focus ring."],
  ["Loading", "Disables repeat activation and exposes aria-busy."],
  ["Disabled", "Prevents activation while preserving layout."],
] as const;

const implementationRows = [
  ["Registry item", "button installs 9 source files into the configured components directory."],
  ["Base UI", "button"],
  ["Registry dependencies", "tooltip, kbd"],
  ["Package dependencies", "@base-ui/react, @nerio/adapters, clsx, react"],
] as const;

const tokenRows = [
  ["Sizing", "--n-button-height-sm / md / lg", "Control heights across density modes."],
  ["Shape", "--n-button-radius", "Corner radius for text and icon-only Buttons."],
  ["Primary", "--n-button-background-primary / hover / active", "Primary action surface."],
  [
    "Secondary",
    "--n-button-background-secondary / hover / border / foreground",
    "Supporting action treatment.",
  ],
  ["Ghost", "--n-button-background-ghost / hover / foreground", "Low-emphasis action treatment."],
  [
    "Danger",
    "--n-button-background-destructive / foreground-destructive",
    "Destructive action treatment.",
  ],
  [
    "Button Kbd",
    "--n-button-kbd-background / border-color / foreground / opacity",
    "Quiet shortcut treatment inside a Button.",
  ],
  [
    "Icon-only",
    "--n-icon-button-size-sm / md / lg / radius",
    "Square Button sizing when icon is used.",
  ],
  [
    "Interaction",
    "--n-motion-hover-duration / --n-motion-press-duration / --n-focus-ring",
    "Motion and focus feedback.",
  ],
] as const;

function DocumentationTable({
  headers,
  rows,
  codeColumns = 2,
}: {
  headers: readonly string[];
  rows: readonly (readonly string[])[];
  codeColumns?: number;
}) {
  return (
    <div className="documentation-table-wrap">
      <table className="documentation-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td key={cell}>{index < codeColumns ? <code>{cell}</code> : cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Button"
      lede="Buttons trigger explicit product actions. Choose a clear label and the least visual emphasis that still matches the decision."
      kind="button"
      preview={<ButtonPreview />}
      sectionPreviews={{
        usage: (
          <ButtonSectionPreview>
            <div className="preview-row">
              <Button leadingIcon={Save} kbd={<Kbd>⌘S</Kbd>}>
                Save changes
              </Button>
              <Button variant="secondary" trailingIcon={ArrowRight}>
                Review draft
              </Button>
            </div>
          </ButtonSectionPreview>
        ),
        variants: (
          <ButtonSectionPreview>
            <div className="preview-row">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </ButtonSectionPreview>
        ),
        anatomy: (
          <ButtonSectionPreview>
            <div className="button-anatomy-preview">
              <span>leading icon</span>
              <span>label</span>
              <span>kbd</span>
              <span>trailing icon</span>
            </div>
            <Button leadingIcon={Plus} trailingIcon={ArrowRight} kbd={<Kbd>⌘N</Kbd>}>
              Create project
            </Button>
            <p>
              For an icon-only action, use <code>icon</code> and an <code>aria-label</code>; label,
              kbd, and directional icon slots are intentionally omitted.
            </p>
          </ButtonSectionPreview>
        ),
        states: (
          <ButtonSectionPreview>
            <div className="preview-row">
              <Button>Default</Button>
              <Button className="button-preview-focus">Focus-visible</Button>
              <Button loading>Saving</Button>
              <Button disabled>Unavailable</Button>
            </div>
          </ButtonSectionPreview>
        ),
        motion: (
          <ButtonSectionPreview>
            <div className="preview-row">
              <Button>Hover and press me</Button>
              <Button variant="secondary">Focus me with Tab</Button>
            </div>
            <p>
              Hover, press, and focus use the shared motion tokens and respect reduced-motion
              preferences.
            </p>
          </ButtonSectionPreview>
        ),
        accessibility: (
          <ButtonSectionPreview>
            <div className="preview-row">
              <Button
                icon={Settings}
                aria-label="Workspace settings"
                tooltip="Workspace settings"
              />
              <Button
                icon={Plus}
                aria-label="Create project"
                tooltip="Create project"
                variant="secondary"
              />
            </div>
            <p>
              Hover or focus an icon-only button to see its Tooltip. The tooltip is supplementary:{" "}
              <code>aria-label</code> still supplies the action name.
            </p>
          </ButtonSectionPreview>
        ),
        api: (
          <ButtonSectionPreview>
            <div className="preview-row">
              <Button leadingIcon={Save} kbd={<Kbd>⌘S</Kbd>}>
                Save changes
              </Button>
              <Button
                icon={Settings}
                aria-label="Workspace settings"
                tooltip="Workspace settings"
                variant="secondary"
              />
            </div>
          </ButtonSectionPreview>
        ),
      }}
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
        api: <DocumentationTable headers={["Prop", "Values", "Purpose"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={implementationRows}
            codeColumns={1}
          />
        ),
        guidance: (
          <div className="button-guidance-cards">
            <Card>
              <CardHeader>
                <Check aria-hidden />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use one primary action per local decision and keep labels action-oriented.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <X aria-hidden />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Button for navigation when a semantic Link describes the destination.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="button-related-cards">
            {[
              [
                "Link",
                "Use a semantic destination instead of an in-place action.",
                "/docs/components/link",
              ],
              [
                "Tooltip",
                "Clarify compact controls without carrying essential meaning.",
                "/docs/components/tooltip",
              ],
              [
                "DropdownMenu",
                "Group several secondary actions under one trigger.",
                "/docs/components/dropdown-menu",
              ],
            ].map(([title, description, href]) => (
              <Card key={title} className="button-related-card" href={href} variant="secondary">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ),
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
