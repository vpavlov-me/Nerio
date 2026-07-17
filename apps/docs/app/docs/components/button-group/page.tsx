"use client";

import { ArrowLeft, ArrowRight, Check, ChevronDown, Copy, X } from "@nerio-ui/adapters/icons";
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

const apiRows = [
  ["children", "ReactNode", "Related Buttons that share one compact context and visual variant."],
  [
    "orientation",
    '"horizontal" | "vertical"',
    "Horizontal is the default; vertical stacks direct Button children.",
  ],
  ["aria-label", "string", "Names the group for assistive technology."],
  ["aria-labelledby", "string", "Uses an existing visible label as the group name."],
  ["role", "string", "Defaults to group; keep group semantics for related actions."],
  ["className", "string", "Extends the group root without changing child Button contracts."],
] as const;

const anatomyRows = [
  ["button-group", "Native group wrapper that owns one attached horizontal or vertical layout."],
  ["button", "Child Buttons retain their individual semantics, labels, and states."],
  ["button-badge", "An optional count or status remains inside its child Button."],
  ["first / last button", "Keep the group radius only on the outside corners."],
  ["shared border", "Adjacent borders overlap so the controls read as one compact set."],
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

function Preview({ children }: { children: React.ReactNode }) {
  return <div className="button-section-preview">{children}</div>;
}

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
      sectionPreviews={{
        usage: (
          <Preview>
            <div className="preview-row">
              <ButtonGroup aria-label="Editor actions">
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
              <ButtonGroup aria-label="Document navigation">
                <Button icon={ArrowLeft} aria-label="Previous document" variant="secondary" />
                <Button icon={ArrowRight} aria-label="Next document" variant="secondary" />
              </ButtonGroup>
            </div>
          </Preview>
        ),
        anatomy: (
          <Preview>
            <div className="button-anatomy-preview">
              <span>button-group</span>
              <span>first button</span>
              <span>last button</span>
            </div>
            <ButtonGroup aria-label="Document actions">
              <Button variant="secondary">Cancel</Button>
              <Button variant="secondary">Save</Button>
            </ButtonGroup>
          </Preview>
        ),
        variants: (
          <Preview>
            <div className="preview-row">
              <ButtonGroup aria-label="Horizontal document actions">
                <Button variant="secondary">Cancel</Button>
                <Button variant="secondary">Save</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Vertical document actions" orientation="vertical">
                <Button variant="secondary">Cancel</Button>
                <Button variant="secondary">Save</Button>
              </ButtonGroup>
              <div dir="rtl">
                <ButtonGroup aria-label="RTL document actions">
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="secondary">Save</Button>
                </ButtonGroup>
              </div>
            </div>
          </Preview>
        ),
        states: (
          <Preview>
            <div className="preview-row">
              <ButtonGroup aria-label="Default actions">
                <Button variant="secondary">Cancel</Button>
                <Button variant="secondary">Save</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Focused actions">
                <Button className="button-preview-focus" variant="secondary">
                  Focus-visible
                </Button>
                <Button variant="secondary">Continue</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Unavailable actions">
                <Button disabled variant="secondary">
                  Cancel
                </Button>
                <Button disabled variant="secondary">
                  Save
                </Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Publishing actions" orientation="vertical">
                <Button loading variant="secondary">
                  Publish
                </Button>
                <Button disabled variant="secondary">
                  Archive
                </Button>
              </ButtonGroup>
            </div>
          </Preview>
        ),
        motion: (
          <Preview>
            <div className="preview-row">
              <ButtonGroup aria-label="Publish actions">
                <Button variant="secondary">Preview</Button>
                <Button variant="secondary">Publish</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Copy actions">
                <Button leadingIcon={Copy} variant="secondary">
                  Copy
                </Button>
                <Button variant="secondary">Done</Button>
              </ButtonGroup>
            </div>
            <p>
              ButtonGroup adds no motion of its own; every child uses the shared Button motion and
              reduced-motion behavior.
            </p>
          </Preview>
        ),
        accessibility: (
          <Preview>
            <div className="preview-row">
              <ButtonGroup aria-label="Document actions">
                <Button variant="secondary">Cancel changes</Button>
                <Button variant="secondary">Save document</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Document navigation">
                <Button icon={ArrowLeft} aria-label="Previous document" variant="secondary" />
                <Button icon={ArrowRight} aria-label="Next document" variant="secondary" />
              </ButtonGroup>
            </div>
            <p>
              Give the group a concise <code>aria-label</code>; every Button keeps its own visible
              name and independent Tab stop. ButtonGroup does not add arrow-key navigation, so use a
              keyboard-managed toolbar or selection control when that interaction is required.
            </p>
          </Preview>
        ),
        api: (
          <Preview>
            <div className="preview-row">
              <ButtonGroup aria-label="Document actions">
                <Button variant="secondary">Duplicate</Button>
                <Button variant="secondary">Move</Button>
              </ButtonGroup>
              <ButtonGroup aria-label="Direction controls">
                <Button icon={ArrowLeft} aria-label="Move left" variant="secondary" />
                <Button icon={ArrowRight} aria-label="Move right" variant="secondary" />
              </ButtonGroup>
            </div>
          </Preview>
        ),
      }}
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
