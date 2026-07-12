import * as React from "react";

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
            <tr key={row.join("__")}>
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
