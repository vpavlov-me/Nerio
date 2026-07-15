"use client";

import { Check, Search, X } from "@nerio-ui/adapters/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Icon,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";

const usageCode = `import { Search } from "@nerio-ui/adapters/icons";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateHeader,
  EmptyStateMedia,
  EmptyStateTitle,
  Icon,
} from "@nerio-ui/ui";
import { Button } from "@nerio-ui/ui/client";

<EmptyState size="lg">
  <EmptyStateMedia aria-hidden="true">
    <Icon icon={Search} />
  </EmptyStateMedia>
  <EmptyStateHeader>
    <EmptyStateTitle>No results found</EmptyStateTitle>
    <EmptyStateDescription>
      Try a different search or clear the active filters.
    </EmptyStateDescription>
  </EmptyStateHeader>
  <EmptyStateActions>
    <Button leadingIcon={Search}>Search again</Button>
    <Button variant="ghost">Clear filters</Button>
  </EmptyStateActions>
</EmptyState>`;

const variantRows = [
  ["size", "sm", "Compact tables, lists, cards, sidebars, and panels."],
  ["size", "md", "Standard page sections and large containers. This is the default."],
  ["size", "lg", "Page-level empty states and first-use onboarding."],
  [
    "align",
    "center",
    "Centers the content within the available parent surface. This is the default.",
  ],
  ["align", "start", "Aligns content to the start edge for dialogs, sidebars, and narrow panels."],
  [
    "media variant",
    "icon",
    "Adds a compact neutral icon container sized by the parent EmptyState.",
  ],
  [
    "media variant",
    "illustration",
    "Accepts consumer-owned SVG, image, or custom illustration without a background.",
  ],
  [
    "actions orientation",
    "horizontal | vertical",
    "Wraps actions by default, or stacks them when a vertical action group is clearer.",
  ],
] as const;

const anatomyRows = [
  [
    "empty-state",
    "Optional root container that owns size, alignment, and standard HTML/ARIA attributes.",
  ],
  ["empty-state-media", "Optional icon or illustration container."],
  [
    "empty-state-header",
    "Optional grouping for the title and description with a readable max width.",
  ],
  [
    "empty-state-title",
    "Optional semantic heading. It renders h3 by default and supports h2 through h6.",
  ],
  ["empty-state-description", "Optional muted supporting copy rendered as a paragraph."],
  [
    "empty-state-actions",
    "Optional wrapping group for buttons, links, or other consumer-supplied controls.",
  ],
] as const;

const stateRows = [
  [
    "Static empty content",
    "Use no ARIA role by default; the surrounding page context already explains the state.",
  ],
  [
    "Asynchronous search",
    "Pass role=status or aria-live=polite when a changed query produces no results.",
  ],
  [
    "Recoverable error",
    "Pass role=alert only when a failure needs immediate announcement, then provide retry when useful.",
  ],
  [
    "Permission limited",
    "Use neutral media and clear copy; a request-access action belongs in EmptyStateActions.",
  ],
] as const;

const apiRows = [
  [
    "EmptyState.size",
    "sm | md | lg",
    "Controls internal spacing, icon media size, and heading scale.",
  ],
  [
    "EmptyState.align",
    "center | start",
    "Controls content alignment without forcing parent dimensions or chrome.",
  ],
  [
    "EmptyStateMedia.variant",
    "icon | illustration",
    "Chooses compact icon treatment or unframed illustration content.",
  ],
  [
    "EmptyStateTitle.as",
    "h2 | h3 | h4 | h5 | h6",
    "Selects the heading level that fits the page hierarchy.",
  ],
  [
    "EmptyStateActions.orientation",
    "horizontal | vertical",
    "Controls the action group direction; horizontal actions still wrap.",
  ],
  [
    "All slots",
    "className + native props",
    "Forward refs and standard HTML, data, and ARIA attributes.",
  ],
] as const;

const implementationRows = [
  ["Registry item", "empty-state installs its component, cn utility, and feedback styles."],
  ["Base UI", "No interactive primitive is required."],
  ["Registry dependencies", "None."],
  ["Package dependencies", "clsx, react"],
] as const;

const tokenRows = [
  [
    "Media",
    "--n-empty-state-mark-size / background / foreground",
    "Icon media dimensions and neutral emphasis.",
  ],
  ["Spacing", "--n-empty-state-gap", "Vertical separation between composed slots."],
] as const;

function EmptyStatePreview() {
  return (
    <section id="preview" className="component-example" aria-label="EmptyState preview">
      <div className="component-example__preview">
        <EmptyState size="lg">
          <EmptyStateMedia aria-hidden="true">
            <Icon icon={Search} />
          </EmptyStateMedia>
          <EmptyStateHeader>
            <EmptyStateTitle>No results found</EmptyStateTitle>
            <EmptyStateDescription>
              We could not find anything matching “quarterly roadmap”. Try a broader search or clear
              the active filters.
            </EmptyStateDescription>
          </EmptyStateHeader>
          <EmptyStateActions>
            <Button leadingIcon={Search}>Search again</Button>
            <Button variant="ghost">Clear filters</Button>
          </EmptyStateActions>
        </EmptyState>
      </div>
      <CodeExample
        className="component-example__code"
        code={usageCode}
        label="EmptyState preview code"
      />
    </section>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="EmptyState"
      lede="Empty states explain why content is unavailable and, when useful, give people a clear next step."
      kind="empty-state"
      preview={<EmptyStatePreview />}
      sectionContent={{
        variants: <DocumentationTable headers={["API", "Value", "Use"]} rows={variantRows} />,
        anatomy: (
          <DocumentationTable headers={["Slot", "Purpose"]} rows={anatomyRows} codeColumns={1} />
        ),
        states: (
          <DocumentationTable
            headers={["Situation", "Announcement and behavior"]}
            rows={stateRows}
            codeColumns={0}
          />
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
                Use a short title, explain the most useful next step, and keep the action set to one
                primary action plus at most one secondary action.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Reuse generic copy for every state, blame the user, or turn the whole empty-state
                surface into an interactive control.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              [
                "Button",
                "Supplies the clear recovery, creation, or retry action inside EmptyStateActions.",
                "/docs/components/button",
              ],
              [
                "Card",
                "Provides optional parent-surface chrome when an empty state appears inside a contained area.",
                "/docs/components/card",
              ],
              [
                "Skeleton",
                "Reserves the expected content layout while data is loading, before an empty state is known.",
                "/docs/components/skeleton",
              ],
              [
                "Alert",
                "Communicates persistent inline status when the content is not an absence state.",
                "/docs/components/alert",
              ],
              [
                "Table",
                "Provides the data surface that can render a compact EmptyState when no rows match.",
                "/docs/components/table",
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
