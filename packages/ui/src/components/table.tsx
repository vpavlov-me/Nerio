import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const tableClasses =
  "n-table w-full border-collapse text-(length:--n-font-size-sm) [&_:is(th,td)]:h-(--n-table-row-min-height) [&_:is(th,td)]:border-b-(length:--n-table-border-width) [&_:is(th,td)]:border-(--n-table-border) [&_:is(th,td)]:p-(--n-table-cell-padding) [&_:is(th,td)]:text-start [&_:is(th,td)]:transition-[background-color,border-color] [&_:is(th,td)]:duration-(--n-motion-hover-duration) [&_:is(th,td)]:ease-(--n-motion-hover-easing) motion-reduce:[&_:is(th,td)]:duration-(--n-duration-instant) [&_th]:bg-(--n-table-header-background) [&_th]:font-(--n-font-weight-medium) [&_th]:text-(--n-table-header-foreground) [&_tbody>tr:hover>:is(th,td)]:bg-(--n-table-row-background-hover) [&_tbody>tr:focus-within>:is(th,td)]:bg-(--n-table-row-background-hover) [&_tbody>tr:is([data-selected],[aria-current]:not([aria-current=false]))>:is(th,td)]:bg-(--n-table-row-background-selected) [&_tbody>tr:is([data-selected],[aria-current]:not([aria-current=false]))>:first-child]:border-s-(length:--n-table-row-selection-indicator-width) [&_tbody>tr:is([data-selected],[aria-current]:not([aria-current=false]))>:first-child]:border-s-(--n-table-row-selection-indicator) [&_:is(th,td)[data-align=numeric]]:text-end [&_:is(th,td)[data-align=numeric]]:[font-variant-numeric:tabular-nums] [&_:is(th,td)[data-disabled]]:text-(--n-table-cell-foreground-disabled) [&_:is(th,td)[data-tone=danger]]:text-(--n-table-cell-foreground-danger) [&_caption]:mb-(--n-space-2) [&_caption]:text-start [&_caption]:text-(length:--n-font-size-sm) [&_caption]:text-(--n-color-text-tertiary)";

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;
type TableContainerBaseProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "aria-label" | "aria-labelledby" | "role" | "tabIndex"
>;

type TableContainerAccessibleName =
  | {
      "aria-label": string;
      "aria-labelledby"?: string;
    }
  | {
      "aria-label"?: never;
      "aria-labelledby": string;
    };

export type TableContainerProps =
  | (TableContainerBaseProps & {
      focusable?: false;
      "aria-label"?: string;
      "aria-labelledby"?: string;
    })
  | (TableContainerBaseProps &
      TableContainerAccessibleName & {
        focusable: true;
      });
export type TableHeaderProps = React.HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = React.HTMLAttributes<HTMLTableSectionElement>;
export type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = React.ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;
export type TableCaptionProps = React.HTMLAttributes<HTMLTableCaptionElement>;

export const Table = React.forwardRef<HTMLTableElement, TableProps>(function Table(
  { className, ...props },
  ref,
) {
  return <table ref={ref} {...props} className={cn(tableClasses, className)} data-slot="root" />;
});

export const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer(
    { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, className, focusable, ...props },
    ref,
  ) {
    const normalizedAriaLabel =
      typeof ariaLabel === "string" && ariaLabel.trim() ? ariaLabel : undefined;
    const normalizedAriaLabelledBy =
      typeof ariaLabelledBy === "string" && ariaLabelledBy.trim() ? ariaLabelledBy : undefined;
    const hasAccessibleName = Boolean(normalizedAriaLabel || normalizedAriaLabelledBy);
    const isFocusableRegion = focusable === true && hasAccessibleName;

    return (
      <div
        ref={ref}
        {...props}
        aria-label={normalizedAriaLabel}
        aria-labelledby={normalizedAriaLabelledBy}
        className={cn(
          "n-table-container max-w-full overflow-x-auto overscroll-x-contain rounded-(--n-table-container-radius) bg-(--n-table-container-background) [border:var(--n-table-container-border)] data-focusable:focus-visible:outline-0 data-focusable:focus-visible:shadow-(--n-table-container-focus-ring) [&>.n-table]:min-w-max forced-colors:border-[CanvasText] forced-colors:data-focusable:focus-visible:outline-(length:--n-focus-ring-inner-width) forced-colors:data-focusable:focus-visible:outline-offset-(--n-focus-ring-inner-width) forced-colors:data-focusable:focus-visible:outline-[Highlight]",
          className,
        )}
        data-focusable={isFocusableRegion ? "" : undefined}
        data-slot="container"
        role={hasAccessibleName ? "region" : undefined}
        tabIndex={isFocusableRegion ? 0 : undefined}
      />
    );
  },
);

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} {...props} className={className} data-slot="header" />;
  },
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} {...props} className={className} data-slot="body" />;
  },
);

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...props }, ref) {
    return <tfoot ref={ref} {...props} className={className} data-slot="footer" />;
  },
);

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...props },
  ref,
) {
  return <tr ref={ref} {...props} className={className} data-slot="row" />;
});

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, scope = "col", ...props },
  ref,
) {
  return <th ref={ref} {...props} className={className} data-slot="head" scope={scope} />;
});

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  return <td ref={ref} {...props} className={className} data-slot="cell" />;
});

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} {...props} className={className} data-slot="caption" />;
  },
);
