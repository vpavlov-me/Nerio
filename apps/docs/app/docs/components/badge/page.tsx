import { Check, Circle, CircleAlert, Info, X } from "@nerio/adapters";
import { Badge, Card, CardContent, CardHeader, CardTitle, Icon } from "@nerio/ui";
import { CodeExample } from "../../../../components/code-example";
import { StandardDocPage } from "../../../../components/doc-page";
import { getComponentDoc } from "../../../../lib/component-docs";
import { createPageMetadata } from "../../../../lib/seo";

const badgeDoc = getComponentDoc("badge");

export const metadata = createPageMetadata({
  title: "Badge component",
  description: badgeDoc!.description,
  path: "/docs/components/badge",
});

function BadgePreview() {
  return (
    <section id="preview" className="component-example" aria-label="Badge preview">
      <div className="component-example__preview">
        <div className="preview-row">
          <Badge>Neutral</Badge>
          <Badge size="sm" tone="info">
            24
          </Badge>
          <Badge size="lg" tone="success">
            Featured
          </Badge>
          <Badge tone="success" leadingIcon={Check}>
            Published
          </Badge>
          <Badge tone="warning" leadingIcon={CircleAlert}>
            Review needed
          </Badge>
          <Badge tone="info" leadingIcon={Info} trailingIcon={Check}>
            Shared
          </Badge>
          <Badge tone="primary-soft" loading>
            Publishing
          </Badge>
          <Badge tone="danger" emphasis="strong" leadingIcon={CircleAlert}>
            Deployment blocked
          </Badge>
        </div>
      </div>
      <CodeExample
        className="component-example__code"
        code={
          'import { Check, CircleAlert, Info } from "@nerio/adapters";\nimport { Badge } from "@nerio/ui";\n\n<Badge>Neutral</Badge>\n<Badge size="sm" tone="info">24</Badge>\n<Badge size="lg" tone="success">Featured</Badge>\n<Badge tone="success" leadingIcon={Check}>Published</Badge>\n<Badge tone="warning" leadingIcon={CircleAlert}>Review needed</Badge>\n<Badge tone="info" leadingIcon={Info} trailingIcon={Check}>Shared</Badge>\n<Badge tone="primary-soft" loading>Publishing</Badge>\n<Badge tone="danger" emphasis="strong" leadingIcon={CircleAlert}>Deployment blocked</Badge>'
        }
        label="Badge live preview code"
      />
    </section>
  );
}

function BadgeSectionPreview({ children }: { children: React.ReactNode }) {
  return <div className="button-section-preview">{children}</div>;
}

const apiRows = [
  [
    "tone",
    "neutral | primary-soft | accent | info | success | warning | danger",
    "Sets semantic color treatment.",
  ],
  ["emphasis", "soft | strong", "Soft is default; strong increases visual urgency."],
  [
    "size",
    "sm | md | lg",
    "md is default; use sm inside compact controls and lg for elevated standalone metadata.",
  ],
  ["leadingIcon", "IconComponent", "Places a decorative icon before the label."],
  ["trailingIcon", "IconComponent", "Places a decorative icon after the label."],
  ["loading", "boolean", "Shows a Spinner before the label and sets aria-busy."],
  ["variant", "neutral | info | success | danger", "Deprecated compatibility alias for tone."],
  ["icon", "IconComponent", "Deprecated compatibility alias for leadingIcon."],
] as const;

const variantRows = [
  ["neutral", "Routine metadata.", "Rarely needed; reserve for elevated neutral status."],
  [
    "primary-soft / accent",
    "Selected or brand-associated metadata.",
    "A compact brand moment that must stand out.",
  ],
  ["info", "Informational context.", "Information that needs immediate scanning."],
  [
    "success",
    "A confirmed or completed state.",
    "A completion state that is especially important.",
  ],
  ["warning", "A state that needs review.", "A time-sensitive warning that needs attention."],
  ["danger", "A blocked or failed state.", "A high-salience failure or risk that needs action."],
] as const;

const sizeRows = [
  ["md", "Default size for standalone status and metadata labels."],
  [
    "sm",
    "Compact size with reduced typography for an embedded Badge inside Button or another compact control.",
  ],
  ["lg", "Larger size for elevated standalone metadata that needs more visual presence."],
] as const;

const anatomyRows = [
  ["root", "Inline status container with tone and tokenized density."],
  ["leading-icon", "Optional decorative icon before the visible label."],
  ["label", "Short text that supplies the status or metadata meaning."],
  ["trailing-icon", "Optional decorative icon after the visible label."],
] as const;

const stateRows = [
  ["Default", "Badge is static metadata, not an interactive control."],
  ["Loading", "Spinner replaces the leading icon and exposes aria-busy."],
  ["Soft", "Default low-emphasis treatment for every tone."],
  ["Strong", "High-salience treatment for urgent warnings, blocking failures, or critical risk."],
  [
    "Size",
    "md is the default standalone size; sm is for compact embedded metadata and lg adds emphasis.",
  ],
  ["Comfortable / compact", "Density tokens adjust height and padding without changing the API."],
] as const;

const implementationRows = [
  ["Registry item", "badge installs 6 source files into the configured components directory."],
  ["Base UI", "No interactive primitive required."],
  ["Registry dependencies", "None."],
  ["Package dependencies", "clsx, react"],
] as const;

const tokenRows = [
  [
    "Sizing",
    "--n-badge-height / --n-badge-height-sm / --n-badge-height-lg / --n-badge-font-size-sm / --n-badge-padding-inline-sm / --n-badge-padding-inline-lg / --n-badge-gap-sm / --n-badge-gap-lg",
    "Controls default, compact, and elevated Badge dimensions.",
  ],
  ["Shape", "--n-badge-radius", "Controls the semantic pill radius."],
  ["Surface", "--n-badge-background / --n-badge-foreground", "Default Badge treatment."],
  [
    "Primary soft",
    "--n-badge-background-primary-soft / --n-badge-foreground-primary-soft",
    "Soft brand treatment.",
  ],
  ["Accent", "--n-badge-background-accent / --n-badge-foreground-accent", "Soft accent treatment."],
  [
    "Soft statuses",
    "--n-badge-background-info / --n-badge-foreground-info / --n-badge-background-success / --n-badge-foreground-success / --n-badge-background-warning / --n-badge-foreground-warning / --n-badge-background-danger / --n-badge-foreground-danger",
    "Soft semantic status treatments.",
  ],
  [
    "Strong neutral",
    "--n-badge-background-strong / --n-badge-foreground-strong",
    "High-salience neutral treatment.",
  ],
  [
    "Strong tones",
    "--n-badge-background-strong-primary / --n-badge-background-strong-info / --n-badge-background-strong-success / --n-badge-background-strong-warning / --n-badge-background-strong-danger",
    "High-salience semantic status treatments.",
  ],
  ["Details", "--n-badge-icon-size / --n-spinner-size-sm", "Icon and loading indicator sizing."],
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
      title={badgeDoc!.title}
      lede={badgeDoc!.description}
      kind="badge"
      preview={<BadgePreview />}
      sectionPreviews={{
        usage: (
          <BadgeSectionPreview>
            <div className="preview-row">
              <Badge tone="success" leadingIcon={Circle}>
                Published
              </Badge>
              <Badge tone="info" leadingIcon={Info}>
                Shared
              </Badge>
              <Badge tone="success" trailingIcon={Check}>
                Deployment ready
              </Badge>
            </div>
          </BadgeSectionPreview>
        ),
        variants: (
          <BadgeSectionPreview>
            <div className="preview-row">
              <Badge tone="success">Published</Badge>
              <Badge tone="warning">Review</Badge>
              <Badge tone="danger">Blocked</Badge>
              <Badge tone="warning" emphasis="strong">
                Action needed
              </Badge>
              <Badge tone="danger" emphasis="strong">
                Deployment blocked
              </Badge>
            </div>
          </BadgeSectionPreview>
        ),
        anatomy: (
          <BadgeSectionPreview>
            <pre className="badge-anatomy-ascii" aria-label="Badge anatomy diagram">{`Badge
┌───────────────────────────────────────────────┐
│ leadingIcon │            label │ trailingIcon │
└───────────────────────────────────────────────┘`}</pre>
          </BadgeSectionPreview>
        ),
        states: (
          <BadgeSectionPreview>
            <div className="preview-row">
              <Badge tone="success">Published</Badge>
              <Badge tone="warning" leadingIcon={Circle}>
                Needs review
              </Badge>
              <Badge tone="danger" leadingIcon={X}>
                Blocked
              </Badge>
              <Badge tone="primary-soft" loading>
                Publishing
              </Badge>
            </div>
          </BadgeSectionPreview>
        ),
        api: (
          <BadgeSectionPreview>
            <div className="preview-row">
              <Badge tone="info" leadingIcon={Info}>
                Shared
              </Badge>
              <Badge tone="warning" trailingIcon={CircleAlert}>
                Review needed
              </Badge>
              <Badge size="sm" tone="info">
                24
              </Badge>
            </div>
          </BadgeSectionPreview>
        ),
      }}
      sectionContent={{
        variants: (
          <>
            <DocumentationTable
              headers={["Tone", "Soft (default)", "Strong"]}
              rows={variantRows}
              codeColumns={1}
            />
            <BadgeSectionPreview>
              <div className="preview-row" aria-label="Badge size preview">
                <Badge size="sm" tone="info">
                  24
                </Badge>
                <Badge size="md" tone="info">
                  24
                </Badge>
                <Badge size="lg" tone="info">
                  24
                </Badge>
              </div>
            </BadgeSectionPreview>
            <DocumentationTable headers={["Size", "Use"]} rows={sizeRows} codeColumns={1} />
          </>
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
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Use concise, stable labels such as Draft, Published, Shared, or Blocked.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Use Badge as a button, link, or the only way to convey an important state.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="button-related-cards">
            {[
              [
                "Alert",
                "Use persistent inline feedback when the user needs context or recovery guidance.",
                "/docs/components/alert",
              ],
              [
                "Tooltip",
                "Clarify non-essential compact metadata without hiding essential meaning.",
                "/docs/components/tooltip",
              ],
              [
                "Icon",
                "Supply directional Badge icons through the Nerio icon adapter.",
                "/docs/foundations/icons",
              ],
            ].map(([title, description, href]) => (
              <Card key={title} className="button-related-card" href={href} variant="secondary">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>{description}</CardContent>
              </Card>
            ))}
          </div>
        ),
        tokens: <DocumentationTable headers={["Group", "Tokens", "Controls"]} rows={tokenRows} />,
      }}
    />
  );
}
