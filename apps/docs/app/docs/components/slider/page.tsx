import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

import { SliderPreview } from "./slider-preview";

const sliderDoc = getComponentDoc("slider");

export const metadata = createPageMetadata({
  title: "Slider component",
  description: sliderDoc!.description,
  path: "/docs/components/slider",
});

const anatomyRows = [
  ["root", "Single-value Base UI Slider state and form owner."],
  ["header", "Optional visible label and consumer-formatted value row."],
  ["label", "Visible accessible name associated with the nested range input."],
  ["value", "Optional visible valueLabel supplied by the consumer."],
  ["control", "Pointer and touch interaction surface."],
  ["track", "Neutral full numeric range."],
  ["indicator", "Accent fill from min to the current value."],
  ["thumb", "One draggable handle containing the native range input."],
  ["description", "Optional supporting text connected through aria-describedby."],
] as const;

const stateRows = [
  ["Default", "Uncontrolled value defaults to min when defaultValue is omitted."],
  ["Focus", "The thumb keeps the system focus-visible ring."],
  ["Dragging", "Pointer and touch update one value through Base UI."],
  ["Disabled", "Prevents interaction and excludes the control from form submission."],
  ["Read-only", "Remains focusable and form-associated while canceling value changes."],
  ["Invalid", "Exposes aria-invalid and data-invalid without owning validation policy."],
  ["Required", "Preserves native range required metadata; a range always has a value."],
] as const;

const apiRows = [
  ["value / defaultValue", "number", "Controlled or uncontrolled single numeric value."],
  [
    "onValueChange / onValueCommitted",
    "(value, details) => void",
    "Continuous and committed updates with Base UI reason and native event details.",
  ],
  ["min / max / step / largeStep", "number", "Bounds, Arrow-key step, and Page-key step."],
  ["orientation", "horizontal | vertical", "Changes layout and native aria-orientation."],
  ["label", "ReactNode", "Visible accessible naming strategy."],
  ["aria-label / aria-labelledby", "string", "Naming alternatives when label is omitted."],
  ["valueLabel", "ReactNode", "Optional visible value formatted by the consumer."],
  [
    "format / locale",
    "Intl options",
    "Formats the Base UI numeric value without embedding product units in Core.",
  ],
  [
    "aria-valuetext / getAriaValueText",
    "string / function",
    "Localized semantic value text for assistive technology.",
  ],
  [
    "name / form / required / disabled / readOnly",
    "form props",
    "Native form ownership and availability behavior.",
  ],
  ["ref / inputRef", "refs", "Accesses the root div or nested native range input."],
] as const;

const tokenRows = [
  [
    "Dimensions",
    "--n-slider-control-size / length / track-size / thumb-size",
    "Hit area and orientation geometry.",
  ],
  [
    "Track",
    "--n-slider-track-* / --n-slider-indicator-background",
    "Neutral range and accent value fill.",
  ],
  [
    "Thumb",
    "--n-slider-thumb-* / --n-slider-focus-ring",
    "Handle surface, boundary, elevation, and focus.",
  ],
  ["Disabled", "--n-slider-disabled-*", "Muted track, indicator, thumb, and opacity."],
  [
    "Motion",
    "--n-slider-duration / --n-slider-easing",
    "Tokenized state feedback with reduced-motion support.",
  ],
] as const;

export default function SliderPage() {
  return (
    <StandardDocPage
      title="Slider"
      lede={sliderDoc!.description}
      kind="slider"
      preview={<SliderPreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Orientation", "Description"]}
            rows={[
              ["Horizontal", "Default fluid inline-axis control."],
              ["Vertical", "Bounded block-axis control with the same single-value API."],
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
              ["Base UI", "Slider Root, Control, Track, Indicator, and one Thumb."],
              ["Entrypoint", "@nerio-ui/ui/client"],
              [
                "Registry",
                "nerio add slider installs the component, merge/ref utilities, token bridge, and tokens.",
              ],
              [
                "Boundary",
                "One value and one thumb; product scale meaning remains consumer-owned.",
              ],
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
                  <li>Use Slider for one approximate or continuously adjustable bounded value.</li>
                  <li>Show units outside the primitive and localize accessible value text.</li>
                  <li>
                    Use Input when exact numeric entry is more important than direct manipulation.
                  </li>
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
                  <li>Add multiple thumbs or range selection to Core Slider.</li>
                  <li>Embed marks, tooltips, charts, pricing, filtering, or media policy.</li>
                  <li>Use color alone to explain the current value or its meaning.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        ),
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
