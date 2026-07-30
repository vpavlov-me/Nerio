"use client";

import { Check, ChevronDown, X } from "@nerio-ui/adapters/icons";
import {
  Badge,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { StandardDocPage } from "../../../../components/doc-page";
import { DocumentationTable } from "../../../../components/documentation-table";

const apiRows = [
  ["children", "ReactNode", "Related Buttons that share one compact context and visual variant."],
  ["aria-label", "string", "Names the group for assistive technology."],
  ["aria-labelledby", "string", "Uses an existing visible label as the group name."],
  ["role", "string", "Defaults to group; keep group semantics for related actions."],
  ["className", "string", "Extends the group root without changing child Button contracts."],
] as const;

const anatomyRows = [
  ["button-group", "Native group wrapper that owns one attached horizontal layout."],
  ["button", "Child Buttons retain their individual semantics, labels, and states."],
  ["button-badge", "An optional count or status remains inside its child Button."],
  ["first / last button", "Keep the group radius only on the outside corners."],
  ["divider", "A short decorative separator distinguishes adjacent actions without a full border."],
] as const;

const stateRows = [
  ["Default", "Adjacent Buttons share a single compact visual boundary."],
  [
    "Hover and focus",
    "The active child rises above neighbouring borders without losing its focus ring.",
  ],
  ["Disabled", "Each child Button remains independently disabled when needed."],
  ["Loading", "Each child Button can announce its own loading state without changing the group."],
] as const;

const implementationRows = [
  [
    "Registry item",
    "button-group installs 4 Tailwind-first source files into the configured components directory.",
  ],
  ["Base UI", "No interactive primitive required."],
  ["Registry dependencies", "button"],
  ["Package dependencies", "clsx, react, tailwind-merge, tailwindcss"],
] as const;

const tokenRows = [
  ["Shape", "--n-button-radius", "Rounds only the outside corners of the group."],
  [
    "Attachment",
    "--n-button-border-width",
    "Overlaps adjacent Button borders by one shared width.",
  ],
  [
    "Divider",
    "--n-button-group-divider",
    "Draws a short, neutral separator between adjacent Buttons.",
  ],
  ["Focus", "--n-focus-ring", "Keeps each child Button visibly focusable above adjacent borders."],
] as const;

function ButtonGroupPreview() {
  return (
    <section id="preview" className="button-showcase" aria-label="ButtonGroup preview">
      <div className="button-showcase__preview">
        <ButtonGroup aria-label="Repository actions">
          <Button
            badge={
              <Badge size="sm" tone="info">
                24
              </Badge>
            }
            variant="secondary"
          >
            Fork
          </Button>
          <Button icon={ChevronDown} aria-label="More fork actions" variant="secondary" />
        </ButtonGroup>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { ChevronDown } from "@nerio-ui/adapters/icons";\nimport { Badge, ButtonGroup } from "@nerio-ui/ui";\nimport { Button } from "@nerio-ui/ui/client";\n\n<ButtonGroup aria-label="Repository actions">\n  <Button badge={<Badge size="sm" tone="info">24</Badge>} variant="secondary">\n    Fork\n  </Button>\n  <Button icon={ChevronDown} aria-label="More fork actions" variant="secondary" />\n</ButtonGroup>'
        }
        label="ButtonGroup live preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="ButtonGroup"
      lede="ButtonGroup joins related actions with the same visual emphasis into one compact, attached control."
      kind="button-group"
      preview={<ButtonGroupPreview />}
      sectionContent={{
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
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Group direct Button children that share one local context and the same Button
                variant.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Mix Button variants, wrap children in layout elements, use ButtonGroup as a generic
                toolbar, or collect unrelated page actions.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Button",
                "Provides the individual action semantics inside a group.",
                "/docs/components/button",
              ],
              [
                "DropdownMenu",
                "Use for a list of secondary actions instead of attaching more Buttons.",
                "/docs/components/dropdown-menu",
              ],
              [
                "Pagination",
                "Use the dedicated navigation pattern for changing pages in a collection.",
                "/docs/components/pagination",
              ],
            ].map(([title, description, href]) => (
              <Card key={title} className="button-related-card" href={href} variant="secondary">
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
