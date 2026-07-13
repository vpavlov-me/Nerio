import { Check, X } from "@nerio/adapters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Progress,
} from "@nerio/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const progressDoc = getComponentDoc("progress");

export const metadata = createPageMetadata({
  title: "Progress component",
  description: progressDoc!.description,
  path: "/docs/components/progress",
});

const anatomyRows = [
  ["root", "Semantic progressbar root with the accessible name and normalized range values."],
  ["header", "Optional row for visible label and value text."],
  ["label", "Optional visible task name associated through aria-labelledby."],
  ["value", "Optional visible completion text from valueLabel."],
  ["track", "Visual-only neutral completion track."],
  ["indicator", "Visual-only transform-scaled fill or indeterminate segment."],
] as const;

const stateRows = [
  ["indeterminate", "No finite value is available. aria-valuenow is omitted."],
  ["progressing", "A finite normalized value is below max."],
  ["complete", "The clamped value reaches max. The indicator does not change to an outcome color."],
] as const;

const apiRows = [
  [
    "value",
    "number | null",
    "Finite completion value. Defaults to null for indeterminate progress.",
  ],
  ["min", "number", "Range minimum. Defaults to 0; invalid runtime ranges normalize to 0–100."],
  ["max", "number", "Range maximum. Defaults to 100; invalid runtime ranges normalize to 0–100."],
  ["label", "ReactNode", "Visible task name and one required accessible naming path."],
  ["valueLabel", "ReactNode", "Optional visible completion text in the header."],
  ["valueText", "string", "Optional localized aria-valuetext for richer completion context."],
  ["aria-label", "string", "Required naming alternative when label is not rendered."],
  ["aria-labelledby", "string", "Required external naming alternative when label is not rendered."],
  [
    "root DOM props",
    "div props",
    "Forwards id, className, style, aria-describedby, aria-controls, events, and consumer data attributes to the progressbar root.",
  ],
] as const;

const tokenRows = [
  [
    "Layout",
    "--n-progress-height / radius / gap / header-gap",
    "Controls track shape and spacing.",
  ],
  ["Text", "--n-progress-label-* / --n-progress-value-*", "Controls visible header text."],
  [
    "Surfaces",
    "--n-progress-track-background / --n-progress-indicator-background",
    "Keeps the track neutral and the indicator aligned with the action accent.",
  ],
  [
    "Motion",
    "--n-progress-duration / easing / indeterminate-*",
    "Controls transform transition, segment movement, and the reduced-motion position.",
  ],
] as const;

const relatedComponents = [
  [
    "Spinner",
    "Use for a compact, short indeterminate wait where a completion amount is not useful.",
    "/docs/components/spinner",
  ],
  [
    "Skeleton",
    "Reserve unknown page structure while content is loading.",
    "/docs/components/skeleton",
  ],
  [
    "Alert",
    "Communicate a persistent final success, failure, cancellation, or blocked outcome.",
    "/docs/components/alert",
  ],
  [
    "Toast",
    "Acknowledge a short-lived operation outcome without interrupting the current workflow.",
    "/docs/components/toast",
  ],
  [
    "Meter (future)",
    "Represent a static score, capacity, battery level, health value, or other scalar measurement.",
  ],
] as const;

function ProgressPreview() {
  return (
    <section id="preview" className="component-example" aria-label="Progress examples">
      <div className="component-example__preview form-preview-stack">
        <Progress label="Uploading files" value={68} />
        <Progress label="Uploading files" value={68} valueLabel="68%" />
        <Progress
          label="Importing records"
          max={5}
          value={3}
          valueLabel="3 of 5"
          valueText="3 of 5 records imported"
        />
        <Progress aria-label="Synchronizing workspace" value={null} valueText="Synchronizing" />
        <Progress label="Exporting report" value={100} valueLabel="Complete" />
        <div>
          <span id="external-progress-label">Publishing release</span>
          <Progress aria-labelledby="external-progress-label" value={40} valueLabel="40%" />
        </div>
      </div>
    </section>
  );
}

export default function ProgressPage() {
  return (
    <StandardDocPage
      title="Progress"
      lede={progressDoc!.description}
      kind="progress"
      preview={<ProgressPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Contract", "Description"]}
            rows={[
              [
                "No visual variants",
                "Progress intentionally has no size, tone, status, striped, or decorative variants.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Description"]}
            rows={anatomyRows}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable headers={["State", "Behavior"]} rows={stateRows} codeColumns={1} />
        ),
        api: <DocumentationTable headers={["Prop", "Type", "Description"]} rows={apiRows} />,
        implementation: (
          <DocumentationTable
            headers={["Contract", "Value"]}
            rows={[
              [
                "Registry item",
                "Progress installs its component, cn utility, and dedicated progress.css stylesheet.",
              ],
              ["Base UI", "No interactive primitive required."],
              ["Server safety", "Progress has no client boundary or runtime dependency."],
            ]}
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
                <ul className="doc-list">
                  <li>Show determinate progress only when a reliable value exists.</li>
                  <li>Use indeterminate Progress only while a reliable value is unavailable.</li>
                  <li>
                    Keep the task label specific and use valueText for meaningful completion text.
                  </li>
                  <li>Use Progress when completion feedback is useful to the person waiting.</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="doc-list">
                  <li>Invent values to make an operation appear active.</li>
                  <li>Use Progress as a static score, capacity, battery, or health measurement.</li>
                  <li>Encode a final success or failure only through indicator color.</li>
                  <li>
                    Use it as a Spinner or Skeleton replacement when those components fit better.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {relatedComponents.map(([title, description, href]) => (
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
