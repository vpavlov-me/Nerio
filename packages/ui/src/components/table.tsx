import * as React from "react";
import { cn } from "../lib/cn";

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
  return <table ref={ref} className={cn("n-table", className)} data-slot="root" {...props} />;
});

export const TableContainer = React.forwardRef<HTMLDivElement, TableContainerProps>(
  function TableContainer(
    { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, className, focusable, ...props },
    ref,
  ) {
    const hasAccessibleName = Boolean(ariaLabel || ariaLabelledBy);

    return (
      <div
        ref={ref}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className={cn("n-table-container", className)}
        data-focusable={focusable ? "" : undefined}
        data-slot="container"
        role={hasAccessibleName ? "region" : undefined}
        tabIndex={focusable ? 0 : undefined}
        {...props}
      />
    );
  },
);

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  function TableHeader({ className, ...props }, ref) {
    return <thead ref={ref} className={className} data-slot="header" {...props} />;
  },
);

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  function TableBody({ className, ...props }, ref) {
    return <tbody ref={ref} className={className} data-slot="body" {...props} />;
  },
);

export const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  function TableFooter({ className, ...props }, ref) {
    return <tfoot ref={ref} className={className} data-slot="footer" {...props} />;
  },
);

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(function TableRow(
  { className, ...props },
  ref,
) {
  return <tr ref={ref} className={className} data-slot="row" {...props} />;
});

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(function TableHead(
  { className, scope = "col", ...props },
  ref,
) {
  return <th ref={ref} className={className} data-slot="head" scope={scope} {...props} />;
});

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(function TableCell(
  { className, ...props },
  ref,
) {
  return <td ref={ref} className={className} data-slot="cell" {...props} />;
});

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, TableCaptionProps>(
  function TableCaption({ className, ...props }, ref) {
    return <caption ref={ref} className={className} data-slot="caption" {...props} />;
  },
);
