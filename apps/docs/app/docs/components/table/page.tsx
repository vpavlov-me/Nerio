import { Check, X } from "@nerio-ui/adapters/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icon } from "@nerio-ui/ui";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";
import { TablePreview } from "./table-preview";

export default function Page() {
  return (
    <StandardDocPage
      title="Table"
      lede="Table preserves native HTML table semantics and adds an optional responsive overflow container without owning data-grid behavior."
      kind="table"
      preview={<TablePreview />}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Recipe / mode", "Contract"]}
            rows={[
              [
                "Primary composition",
                "Muted consumer-owned frame, inset row group, and Pagination footer on the same surface; this is a composition recipe, not a Table prop.",
              ],
              [
                "Secondary composition",
                "Muted rounded header with open page-level rows and footer; this is a composition recipe, not a Table prop.",
              ],
              ["Plain", "Responsive overflow wrapper with no region or tab stop."],
              ["Named", "aria-label or aria-labelledby exposes an optional non-focusable region."],
              [
                "Focusable",
                "focusable={true} opts into one keyboard-scroll region only when aria-label or aria-labelledby is a non-empty runtime string.",
              ],
            ]}
            codeColumns={0}
          />
        ),
        anatomy: (
          <DocumentationTable
            headers={["Slot", "Native element / purpose"]}
            rows={[
              [
                "container",
                "Optional div overflow region; directly wrap one Table and never nest containers.",
              ],
              [
                "root / caption",
                "table and caption preserve the table's accessible name and description.",
              ],
              [
                "header / body / footer",
                "thead, tbody, and tfoot retain native row-group semantics.",
              ],
              [
                "row / head / cell",
                "tr, th, and td forward scope, headers, colSpan, rowSpan, aria-sort, and data attributes.",
              ],
            ]}
            codeColumns={1}
          />
        ),
        states: (
          <DocumentationTable
            headers={["Pattern", "Contract"]}
            rows={[
              [
                "Empty",
                "Render EmptyState inside one TableCell with colSpan equal to the visible column count.",
              ],
              [
                "Loading",
                "Compose Skeleton cells; put aria-busy on the named container and hide purely visual rows.",
              ],
              [
                "Selected / current",
                'Use data-selected for consumer state or aria-current only on tbody rows that are genuinely current; aria-current="false" stays neutral.',
              ],
              [
                "Focus within",
                "Interactive tbody cell controls highlight their row but keep their own keyboard target and label; header and footer rows stay stable.",
              ],
              [
                "Disabled-looking",
                "data-disabled is visual only; disable each nested control independently when required.",
              ],
              [
                "Destructive",
                'data-tone="danger" emphasizes a value without changing its semantics.',
              ],
            ]}
            codeColumns={0}
          />
        ),
        api: (
          <DocumentationTable
            headers={["Part", "Props", "Purpose"]}
            rows={[
              [
                "Table",
                "TableHTMLAttributes",
                "Native table props, caption relationships, direction, and data attributes.",
              ],
              [
                "TableContainer",
                "focusable, aria-label, aria-labelledby",
                "Optional horizontal overflow and runtime-safe named keyboard region; owned region props cannot be overridden.",
              ],
              [
                "TableHead",
                "ThHTMLAttributes",
                "scope defaults to col and remains overrideable for row or grouped headers.",
              ],
              [
                "TableCell",
                "TdHTMLAttributes",
                "Wraps text by default and forwards headers, colSpan, rowSpan, numeric alignment, values, and actions.",
              ],
            ]}
          />
        ),
        implementation: (
          <p>
            Table is server-safe and owns presentation only. Sorting, filtering, selection,
            pagination state, resizing, reordering, virtualization, bulk actions, and fetching stay
            consumer-owned or belong to Nerio Pro. Consumer sticky headers and columns can use
            <code> position: sticky</code> on cells; the component adds no transform, isolation, or
            table clipping. If vertical stickiness is needed, give the single TableContainer an
            explicit block-size and vertical overflow instead of nesting another scroller.
          </p>
        ),
        guidance: (
          <div className="doc-guidance-cards">
            <Card>
              <CardHeader>
                <Icon icon={Check} />
                <CardTitle>Do</CardTitle>
              </CardHeader>
              <CardContent>
                Keep the default text wrapping for readable records, use native headers and
                captions, keep row links or actions as separately labelled controls, and expose
                sortable state with aria-sort.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Icon icon={X} />
                <CardTitle>Do not</CardTitle>
              </CardHeader>
              <CardContent>
                Make the entire row clickable, nest scroll containers, or move DataGrid behavior
                into this primitive.
              </CardContent>
            </Card>
          </div>
        ),
        related: (
          <div className="doc-related-cards">
            {[
              ["Skeleton", "Compose non-interactive loading rows.", "/docs/components/skeleton"],
              ["Pagination", "Keep page state outside Table.", "/docs/components/pagination"],
              ["Button", "Use a labelled action inside an action cell.", "/docs/components/button"],
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
        tokens: (
          <DocumentationTable
            headers={["Group", "Tokens", "Controls"]}
            rows={[
              [
                "Container",
                "--n-table-container-background, --n-table-container-border, --n-table-container-radius, --n-table-container-focus-ring",
                "Muted grouping surface, boundary, and focus treatment.",
              ],
              [
                "Rows",
                "--n-table-row-min-height, --n-table-row-group-radius, --n-table-row-background-hover, --n-table-row-background-selected, --n-table-row-selection-indicator, --n-table-row-selection-indicator-width",
                "Compensated inner radius, density, smooth interaction, and neutral selected/current state cues.",
              ],
              [
                "Cells",
                "--n-table-cell-padding-x, --n-table-cell-padding-y",
                "Comfortable and compact spacing.",
              ],
              [
                "Headers",
                "--n-table-header-background, --n-table-header-foreground",
                "Quiet semantic hierarchy.",
              ],
              [
                "Values",
                "--n-table-cell-foreground-disabled, --n-table-cell-foreground-danger",
                "Muted and destructive values.",
              ],
            ]}
          />
        ),
      }}
    />
  );
}
