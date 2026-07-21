import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@nerio-ui/ui";

export type DocumentationTableRow = readonly string[];

export function DocumentationTable({
  headers,
  rows,
  codeColumns = 2,
}: {
  headers: readonly string[];
  rows: readonly DocumentationTableRow[];
  codeColumns?: number;
}) {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.join("__")}>
              {row.map((cell, index) => (
                <TableCell key={`${index}-${cell}`}>
                  {index < codeColumns ? <code>{cell}</code> : cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
