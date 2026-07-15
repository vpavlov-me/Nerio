import { flexRender, getCoreRowModel, useReactTable } from "@nerio-ui/adapters/table";
import type { ColumnDef } from "@nerio-ui/adapters/table";

type Row = { name: string };
export type TableColumn = ColumnDef<Row>;
export const tableAdapter = { flexRender, getCoreRowModel, useReactTable };
