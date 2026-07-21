"use client";

import * as React from "react";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  PackageOpen,
  Plus,
  X,
} from "@nerio-ui/adapters/icons";
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
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio-ui/ui";
import { Button, Checkbox } from "@nerio-ui/ui/client";
import { CodeExample } from "../../../../components/code-example";
import { DocumentationTable } from "../../../../components/documentation-table";
import { StandardDocPage } from "../../../../components/doc-page";

const teamMembers = [
  { id: "ethan", name: "Ethan Lee", role: "VP Sales", status: "Active", email: "ethan@acme.com" },
  { id: "john", name: "John Smith", role: "CTO", status: "Active", email: "john@acme.com" },
  { id: "kate", name: "Kate Moore", role: "CEO", status: "Active", email: "kate@acme.com" },
  { id: "lena", name: "Lena Ortiz", role: "COO", status: "Active", email: "lena@acme.com" },
  { id: "sara", name: "Sara Johnson", role: "CMO", status: "On leave", email: "sara@acme.com" },
  {
    id: "michael",
    name: "Michael Brown",
    role: "CFO",
    status: "Active",
    email: "michael@acme.com",
  },
  { id: "nina", name: "Nina Patel", role: "VP Product", status: "Active", email: "nina@acme.com" },
  { id: "omar", name: "Omar Haddad", role: "VP Design", status: "Active", email: "omar@acme.com" },
] as const;

type TeamMember = (typeof teamMembers)[number];
type TeamSortKey = "name" | "role" | "status" | "email";
type TeamSort = { key: TeamSortKey; direction: "ascending" | "descending" };
type TablePresentation = "primary" | "secondary";

function sortMembers(items: readonly TeamMember[], activeSort?: TeamSort) {
  if (!activeSort) return [...items];
  return [...items].sort((left, right) => {
    const comparison = left[activeSort.key].localeCompare(right[activeSort.key]);
    return activeSort.direction === "ascending" ? comparison : -comparison;
  });
}

const stableTableCode = `import { ArrowUp, ChevronDown } from "@nerio-ui/adapters/icons";
import { Pagination, Table, TableBody, TableCell,
  TableContainer, TableHead, TableHeader, TableRow } from "@nerio-ui/ui";
import { Button, Checkbox } from "@nerio-ui/ui/client";

<div className="table-shell">
  <TableContainer aria-label="Team members">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead aria-label="Select rows">
            <Checkbox aria-label="Select all rows on this page" />
          </TableHead>
          <TableHead aria-sort="ascending">
            <Button trailingIcon={ArrowUp} variant="ghost">Name</Button>
          </TableHead>
          <TableHead aria-sort="none">
            <Button trailingIcon={ChevronDown} variant="ghost">Role</Button>
          </TableHead>
          <TableHead aria-sort="none">
            <Button trailingIcon={ChevronDown} variant="ghost">Status</Button>
          </TableHead>
          <TableHead aria-sort="none">
            <Button trailingIcon={ChevronDown} variant="ghost">Email</Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>...</TableBody>
    </Table>
  </TableContainer>
  <div className="table-footer">
    <span>1 to 4 of 8 results</span>
    <Pagination pages={pages} />
  </div>
</div>`;

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

function StableTablePreview({ presentation = "primary" }: { presentation?: TablePresentation }) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [members, setMembers] = React.useState<TeamMember[]>(() => [...teamMembers]);
  const [selected, setSelected] = React.useState<Set<string>>(() => new Set());
  const [sort, setSort] = React.useState<TeamSort>();
  const [draggedId, setDraggedId] = React.useState<string>();
  const [dragTargetId, setDragTargetId] = React.useState<string>();
  const dragPreviewRef = React.useRef<HTMLTableElement | null>(null);

  const orderedMembers = React.useMemo(() => sortMembers(members, sort), [members, sort]);

  const pageSize = 4;
  const pageStart = (currentPage - 1) * pageSize;
  const visibleMembers = orderedMembers.slice(pageStart, pageStart + pageSize);
  const visibleIds = visibleMembers.map((member) => member.id);
  const allVisibleSelected = visibleIds.every((id) => selected.has(id));
  const someVisibleSelected = visibleIds.some((id) => selected.has(id));

  const reorderMember = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    const activeSort = sort;
    setMembers((current) => {
      const next = sortMembers(current, activeSort);
      const sourceIndex = next.findIndex((member) => member.id === sourceId);
      const targetIndex = next.findIndex((member) => member.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return current;
      const [moved] = next.splice(sourceIndex, 1);
      if (!moved) return current;
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setSort(undefined);
  };

  const moveMember = (id: string, offset: -1 | 1) => {
    const currentIndex = orderedMembers.findIndex((member) => member.id === id);
    const target = orderedMembers[currentIndex + offset];
    if (target) reorderMember(id, target.id);
  };

  const toggleVisibleRows = (checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      visibleIds.forEach((id) => (checked === true ? next.add(id) : next.delete(id)));
      return next;
    });
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked === true) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSort = (key: TeamSortKey) => {
    setSort((current) => ({
      key,
      direction:
        current?.key === key && current.direction === "ascending" ? "descending" : "ascending",
    }));
  };

  const clearDragPreview = React.useCallback(() => {
    dragPreviewRef.current?.remove();
    dragPreviewRef.current = null;
  }, []);

  React.useEffect(() => clearDragPreview, [clearDragPreview]);

  const createDragPreview = (row: HTMLTableRowElement) => {
    clearDragPreview();
    const preview = document.createElement("table");
    const body = document.createElement("tbody");
    const rowClone = row.cloneNode(true) as HTMLTableRowElement;
    const rowBounds = row.getBoundingClientRect();

    preview.className = "table-doc-drag-preview";
    preview.setAttribute("aria-hidden", "true");
    preview.style.inlineSize = `${rowBounds.width}px`;
    rowClone.removeAttribute("data-dragging");
    rowClone.removeAttribute("data-drag-target");
    rowClone.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    Array.from(row.cells).forEach((cell, index) => {
      const clonedCell = rowClone.cells.item(index);
      if (clonedCell) clonedCell.style.inlineSize = `${cell.getBoundingClientRect().width}px`;
    });

    body.append(rowClone);
    preview.append(body);
    document.body.append(preview);
    dragPreviewRef.current = preview;
    return preview;
  };

  return (
    <div
      className="table-doc-product-surface"
      data-drag-active={draggedId ? "" : undefined}
      data-table-presentation={presentation}
    >
      <div className="table-doc-product-shell">
        <TableContainer
          aria-label="Team members, roles, statuses, and emails"
          className="table-doc-product-table"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead aria-label="Reorder rows" className="table-doc-control-column" />
                <TableHead
                  aria-label="Select rows"
                  className="table-doc-control-column table-doc-checkbox-column"
                >
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={allVisibleSelected}
                    indeterminate={someVisibleSelected && !allVisibleSelected}
                    onCheckedChange={toggleVisibleRows}
                  />
                </TableHead>
                {(
                  [
                    ["name", "Name"],
                    ["role", "Role"],
                    ["status", "Status"],
                    ["email", "Email"],
                  ] as const
                ).map(([key, label]) => (
                  <TableHead key={key} aria-sort={sort?.key === key ? sort.direction : "none"}>
                    <Button
                      className="table-doc-sort-button"
                      size="sm"
                      trailingIcon={
                        sort?.key === key && sort.direction === "ascending" ? ArrowUp : ChevronDown
                      }
                      variant="ghost"
                      onClick={() => toggleSort(key)}
                    >
                      {label}
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleMembers.map((member) => (
                <TableRow
                  key={member.id}
                  data-checked-row={selected.has(member.id) ? "" : undefined}
                  data-dragging={draggedId === member.id ? "" : undefined}
                  data-drag-target={
                    draggedId && draggedId !== member.id && dragTargetId === member.id
                      ? ""
                      : undefined
                  }
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDragTargetId(member.id);
                  }}
                  onDrop={(event) => {
                    reorderMember(event.dataTransfer.getData("text/plain"), member.id);
                    setDraggedId(undefined);
                    setDragTargetId(undefined);
                    clearDragPreview();
                  }}
                >
                  <TableCell className="table-doc-control-column">
                    <Button
                      draggable
                      aria-label={`Reorder ${member.name}. Use Arrow Up or Arrow Down.`}
                      className="table-doc-drag-handle"
                      data-drag-handle=""
                      icon={GripVertical}
                      size="sm"
                      tooltip="Reorder"
                      variant="ghost"
                      onDragEnd={() => {
                        setDraggedId(undefined);
                        setDragTargetId(undefined);
                        clearDragPreview();
                      }}
                      onDragStart={(event) => {
                        const row = event.currentTarget.closest("tr");
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", member.id);
                        if (row) {
                          const preview = createDragPreview(row);
                          const bounds = row.getBoundingClientRect();
                          event.dataTransfer.setDragImage(
                            preview,
                            Math.max(0, event.clientX - bounds.left),
                            Math.max(0, event.clientY - bounds.top),
                          );
                        }
                        setDraggedId(member.id);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                          event.preventDefault();
                          moveMember(member.id, event.key === "ArrowUp" ? -1 : 1);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell className="table-doc-control-column">
                    <Checkbox
                      aria-label={`Select ${member.name}`}
                      checked={selected.has(member.id)}
                      onCheckedChange={(checked) => toggleRow(member.id, checked)}
                    />
                  </TableCell>
                  <TableHead scope="row">{member.name}</TableHead>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.status}</TableCell>
                  <TableCell>{member.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="table-doc-pagination">
          <span>
            {pageStart + 1} to {Math.min(pageStart + pageSize, orderedMembers.length)} of{" "}
            {orderedMembers.length} results
          </span>
          <Pagination
            aria-label="Team members pages"
            nextAriaLabel="Go to next team members page"
            nextLabel={<Icon icon={ChevronRight} />}
            nextOnSelect={currentPage < 2 ? () => setCurrentPage(currentPage + 1) : undefined}
            pages={[
              { key: 1, label: 1, current: currentPage === 1, onSelect: () => setCurrentPage(1) },
              { key: 2, label: 2, current: currentPage === 2, onSelect: () => setCurrentPage(2) },
            ]}
            previousAriaLabel="Go to previous team members page"
            previousLabel={<Icon icon={ChevronLeft} />}
            previousOnSelect={currentPage > 1 ? () => setCurrentPage(currentPage - 1) : undefined}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <StandardDocPage
      title="Table"
      lede="Table preserves native HTML table semantics and adds an optional responsive overflow container without owning data-grid behavior."
      kind="table"
      preview={
        <ComponentExample code={stableTableCode} label="Primary Table composition">
          <StableTablePreview />
        </ComponentExample>
      }
      sectionPreviews={{
        variants: (
          <ComponentExample
            code={stableTableCode.replace(
              'className="table-shell"',
              'className="table-shell-secondary"',
            )}
            label="Secondary Table composition"
          >
            <StableTablePreview presentation="secondary" />
          </ComponentExample>
        ),
        states: (
          <>
            <ComponentExample
              code={
                '<TableRow><TableCell colSpan={4}><EmptyState size="sm"><EmptyStateMedia>...</EmptyStateMedia><EmptyStateHeader>...</EmptyStateHeader><EmptyStateActions><Button variant="secondary">Create project</Button></EmptyStateActions></EmptyState></TableCell></TableRow>'
              }
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
                    <TableRow className="table-doc-empty-row">
                      <TableCell colSpan={4}>
                        <EmptyState className="table-doc-empty-state" size="sm">
                          <EmptyStateMedia aria-hidden="true">
                            <Icon icon={PackageOpen} />
                          </EmptyStateMedia>
                          <EmptyStateHeader>
                            <EmptyStateTitle>No projects found</EmptyStateTitle>
                            <EmptyStateDescription>
                              Try adjusting the current filters.
                            </EmptyStateDescription>
                          </EmptyStateHeader>
                          <EmptyStateActions>
                            <Button leadingIcon={Plus} size="sm" variant="secondary">
                              Create project
                            </Button>
                          </EmptyStateActions>
                        </EmptyState>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </ComponentExample>
            <ComponentExample
              code={
                '<TableHeader><TableRow>...</TableRow></TableHeader>\n<TableBody><TableRow aria-hidden="true"><TableCell><Skeleton /></TableCell>...</TableRow></TableBody>'
              }
              label="Loading Table rows"
            >
              <TableContainer aria-label="Projects loading" aria-busy="true">
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
                    {[0, 1, 2, 3].map((row) => (
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
                        <TableCell>
                          <Skeleton />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </ComponentExample>
          </>
        ),
      }}
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
