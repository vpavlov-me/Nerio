"use client";

import { Check, Info, X } from "@nerio-ui/adapters/icons";
import {
  Alert,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";

const variantRows = [
  ["neutral", "Low-emphasis status or message that does not need a semantic emphasis."],
  ["info", "Informational context that should remain calm and visible in the page flow."],
  ["success", "Positive completion or validation feedback."],
  ["warning", "An issue that needs attention without blocking the entire flow."],
  ["danger", "An error, destructive outcome, or blocking state."],
] as const;

const anatomyRows = [
  ["root", "Inline feedback region that applies tone and spacing tokens."],
  ["icon", "Optional decorative icon rendered through the Nerio icon adapter."],
  ["content", "Container for the title and descriptive content."],
  ["title", "Optional short summary that establishes the message hierarchy."],
  ["description", "Body content that explains the state or provides a next step."],
] as const;

const stateRows = [
  ["Static", "No live-region semantics are applied by default."],
  ["Status update", 'Use role="status" for a dynamic, non-urgent update.'],
  ["Urgent update", 'Use role="alert" only when a dynamic error needs immediate announcement.'],
] as const;

const apiRows = [
  [
    "tone",
    "neutral | info | success | warning | danger",
    "Selects the semantic feedback treatment.",
  ],
  ["title", "ReactNode", "Adds a concise summary above the description."],
  ["icon", "IconComponent", "Renders a decorative icon through the Nerio icon adapter."],
  ["action", "ReactNode", "Adds one trailing action for a focused recovery or update."],
  ["role", "status | alert", "Opt into announcement semantics only for dynamic content."],
  ["children", "ReactNode", "Provides the descriptive message content."],
  ["className", "string", "Extends the root without replacing component tokens."],
] as const;

const implementationRows = [
  ["Registry item", "alert installs five source files into the configured components directory."],
  ["Base UI", "No interactive primitive required."],
  ["Registry dependencies", "None."],
  ["Package dependencies", "clsx, react"],
] as const;

const tokenRows = [
  [
    "Layout",
    "--n-alert-gap / --n-alert-padding / --n-alert-radius",
    "Controls compact spacing and shape.",
  ],
  [
    "Surface",
    "--n-alert-border-width / --n-alert-border / --n-alert-background / --n-alert-shadow",
    "Keeps persistent feedback flat, muted, and borderless by default.",
  ],
  [
    "Emphasis",
    "--n-alert-title-color / --n-alert-icon-color",
    "Keeps the title neutral and applies semantic emphasis only to the icon.",
  ],
  ["Icon", "--n-alert-icon-size", "Controls the optional icon scale."],
  [
    "Semantic tones",
    "--n-color-status-info / success / warning / danger",
    "Controls semantic icon emphasis without changing the neutral text hierarchy.",
  ],
] as const;

function AlertPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Alert preview">
      <div className="component-example__preview alert-showcase__preview">
        <Alert
          action={<Button size="sm">Refresh</Button>}
          tone="info"
          icon={Info}
          title="Update available"
        >
          A new version of the application is available. Refresh to get the latest features and
          fixes.
        </Alert>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { Info } from "@nerio-ui/adapters/icons";\nimport { Alert } from "@nerio-ui/ui";\nimport { Button } from "@nerio-ui/ui/client";\n\n<Alert\n  tone="info"\n  icon={Info}\n  title="Update available"\n  action={<Button size="sm">Refresh</Button>}\n>\n  A new version of the application is available. Refresh to get the latest features and fixes.\n</Alert>'
        }
        label="Alert live preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Alert"
      lede="Alerts communicate persistent inline feedback with a clear semantic tone, concise text, and accessible announcement options when content changes dynamically."
      kind="alert"
      preview={<AlertPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable headers={["Tone", "Use"]} rows={variantRows} codeColumns={1} />
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
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use Alert for inline validation summaries, persistent notices, and contextual
                feedback.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Alert as a toast replacement or add dismiss behavior to this static feedback
                pattern.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Toast",
                "Use for temporary managed notifications that can leave the current page flow.",
                "/docs/components/toast",
              ],
              [
                "FormMessage",
                "Keep validation help and errors directly associated with a form control.",
                "/docs/components/form-message",
              ],
              [
                "Tokens",
                "Customize semantic feedback colors and component spacing without editing source.",
                "/docs/foundations/tokens",
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
