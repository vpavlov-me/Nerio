"use client";

import * as React from "react";
import { Check, Settings, X } from "@nerio/adapters";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Icon,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio/ui";
import { Button } from "@nerio/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";

const projects = [
  {
    id: "PRJ-2026-07-13-FOUNDATION-ALPHA",
    name: "Design system foundation",
    description:
      "Shared tokens and primitives used across product surfaces. This sentence wraps inside a deliberately constrained column.",
    owner: "Maya Chen",
    status: "Active",
    budget: "$48,240",
    updated: "Jul 13, 2026",
  },
  {
    id: "PRJ-2026-07-09-RESEARCH-BETA",
    name: "Research archive",
    description:
      "Historical notes remain readable while the row communicates a disabled-looking state.",
    owner: "Alex Kim",
    status: "Archived",
    budget: "$12,800",
    updated: "Jul 9, 2026",
  },
] as const;

const responsiveCode = `import {
  Table, TableBody, TableCaption, TableCell, TableContainer,
  TableHead, TableHeader, TableRow
} from "@nerio/ui";

<h2 id="projects-title">Projects</h2>
<TableContainer focusable aria-labelledby="projects-title">
  <Table>
    <TableCaption>Current projects and owners</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead scope="col">Project</TableHead>
        <TableHead scope="col">Owner</TableHead>
        <TableHead data-align="numeric" scope="col">Budget</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>...</TableBody>
  </Table>
</TableContainer>`;

function ComponentExample({
  children,
  code,
  label,
}: {
  children: React.ReactNode;
  code: string;
  label: string;
}) {
  return (
    <section className="component-example" aria-label={label}>
      <div className="component-example__preview table-doc-preview">{children}</div>
      <CodeExample className="component-example__code" code={code} label={`${label} code`} />
    </section>
  );
}

function ResponsiveTable({
  rtl = false,
  titleId = "projects-title",
}: {
  rtl?: boolean;
  titleId?: string;
}) {
  return (
    <div dir={rtl ? "rtl" : "ltr"} className="table-doc-narrow">
      <p id={titleId} className="table-doc-title">
        {rtl ? "RTL project delivery" : "Project delivery"}
      </p>
      <TableContainer focusable aria-labelledby={titleId}>
        <Table>
          <TableCaption>Current projects, ownership, status, budget, and update date.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} scope="colgroup">
                Project
              </TableHead>
              <TableHead colSpan={2} scope="colgroup">
                Delivery
              </TableHead>
              <TableHead colSpan={2} scope="colgroup">
                Planning
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="table-doc-min-column">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead data-align="numeric">Budget</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, index) => (
              <TableRow key={project.id} aria-current={index === 0 ? "true" : undefined}>
                <TableHead className="table-doc-min-column" scope="row">
                  <span>{project.name}</span>
                  <code className="table-doc-nowrap">{project.id}</code>
                </TableHead>
                <TableCell className="table-doc-wrapped">{project.description}</TableCell>
                <TableCell>{project.owner}</TableCell>
                <TableCell data-disabled={project.status === "Archived" ? "" : undefined}>
                  {project.status}
                </TableCell>
                <TableCell data-align="numeric">{project.budget}</TableCell>
                <TableCell>{project.updated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function SortableTable() {
  const [sort, setSort] = React.useState<"ascending" | "descending">("ascending");

  return (
    <TableContainer aria-label="Consumer-owned sortable project table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead aria-sort={sort}>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSort(sort === "ascending" ? "descending" : "ascending")}
              >
                Project ({sort})
              </Button>
            </TableHead>
            <TableHead>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableHead scope="row">Design system</TableHead>
            <TableCell>Maya</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PatternTable() {
  return (
    <TableContainer aria-label="Table row patterns">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead data-align="numeric">Budget</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-selected="">
            <TableHead scope="row">Design system</TableHead>
            <TableCell>Selected</TableCell>
            <TableCell data-align="numeric">$48,240</TableCell>
            <TableCell>
              <Button
                icon={Settings}
                aria-label="Actions for Design system"
                size="sm"
                variant="ghost"
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead scope="row">Research archive</TableHead>
            <TableCell data-disabled="">Archived</TableCell>
            <TableCell data-align="numeric" data-tone="danger">
              −$2,400
            </TableCell>
            <TableCell>
              <Button
                icon={Settings}
                aria-label="Actions for Research archive"
                size="sm"
                variant="ghost"
              />
            </TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell data-align="numeric">$45,840</TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Table"
      lede="Table preserves native HTML table semantics and adds an optional responsive overflow container without owning data-grid behavior."
      kind="table"
      preview={
        <ComponentExample code={responsiveCode} label="Responsive Table preview">
          <ResponsiveTable />
        </ComponentExample>
      }
      sectionPreviews={{
        variants: (
          <>
            <ComponentExample
              code={"<TableContainer><Table>...</Table></TableContainer>"}
              label="Plain overflow TableContainer"
            >
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Plain overflow remains outside the tab order.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </ComponentExample>
            <ComponentExample
              code={
                '<div dir="rtl"><TableContainer focusable aria-label="RTL projects">...</TableContainer></div>'
              }
              label="RTL responsive Table"
            >
              <ResponsiveTable rtl titleId="rtl-projects-title" />
            </ComponentExample>
            <ComponentExample
              code={
                '<TableContainer className="table-scroll"><Table className="sticky-table">...</Table></TableContainer>'
              }
              label="Consumer-authored sticky Table styles"
            >
              <div className="table-doc-sticky">
                <ResponsiveTable titleId="sticky-projects-title" />
              </div>
            </ComponentExample>
          </>
        ),
        anatomy: (
          <ComponentExample
            code={
              '<TableHeader><TableRow><TableHead colSpan={2} scope="colgroup">Identity</TableHead></TableRow></TableHeader>'
            }
            label="Grouped Table headers"
          >
            <PatternTable />
          </ComponentExample>
        ),
        states: (
          <>
            <ComponentExample
              code={"<TableRow><TableCell colSpan={4}>No projects found.</TableCell></TableRow>"}
              label="Empty Table row"
            >
              <TableContainer aria-label="Empty projects table">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4}>No projects found.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </ComponentExample>
            <ComponentExample
              code={
                '<TableRow aria-hidden="true"><TableCell><Skeleton /></TableCell>...</TableRow>'
              }
              label="Loading Table rows"
            >
              <TableContainer aria-label="Projects loading" aria-busy="true">
                <Table>
                  <TableBody>
                    {[0, 1].map((row) => (
                      <TableRow key={row} aria-hidden="true">
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ComponentExample>
            <ComponentExample
              code={
                '<TableRow data-selected="">...</TableRow>\n<TableCell data-disabled="">Archived</TableCell>\n<TableCell data-tone="danger">−$2,400</TableCell>'
              }
              label="Table visual states and actions"
            >
              <PatternTable />
            </ComponentExample>
          </>
        ),
        accessibility: (
          <ComponentExample
            code={
              "<TableHead aria-sort={sort}><Button onClick={toggleSort}>Project</Button></TableHead>"
            }
            label="Consumer-owned sortable header"
          >
            <SortableTable />
          </ComponentExample>
        ),
      }}
      sectionContent={{
        variants: (
          <DocumentationTable
            headers={["Mode", "Contract"]}
            rows={[
              ["Plain", "Responsive overflow wrapper with no region or tab stop."],
              ["Named", "aria-label or aria-labelledby exposes an optional non-focusable region."],
              [
                "Focusable",
                "focusable opts into one named keyboard-scroll region with a visible inset focus ring.",
              ],
            ]}
            codeColumns={1}
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
              ["Empty", "Render one TableCell with colSpan equal to the visible column count."],
              [
                "Loading",
                "Compose Skeleton cells; put aria-busy on the named container and hide purely visual rows.",
              ],
              [
                "Selected / current",
                "Use data-selected for consumer state or aria-current only when the row is genuinely current.",
              ],
              [
                "Focus within",
                "Interactive cell controls highlight their row but keep their own keyboard target and label.",
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
            codeColumns={1}
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
                "Optional horizontal overflow and named keyboard region.",
              ],
              [
                "TableHead",
                "ThHTMLAttributes",
                "scope defaults to col and remains overrideable for row or grouped headers.",
              ],
              [
                "TableCell",
                "TdHTMLAttributes",
                "headers, colSpan, rowSpan, numeric alignment, values, and actions.",
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
                Use native headers and captions, keep row links or actions as separately labelled
                controls, and expose sortable state with aria-sort.
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
                "--n-table-container-border, --n-table-container-radius, --n-table-container-focus-ring",
                "Boundary and focus treatment.",
              ],
              [
                "Rows",
                "--n-table-row-min-height, --n-table-row-background-hover, --n-table-row-background-selected",
                "Density and consumer states.",
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
