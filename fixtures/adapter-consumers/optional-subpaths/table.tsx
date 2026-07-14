import { flexRender, getCoreRowModel, useReactTable } from "@nerio/adapters/table";
import type { ColumnDef } from "@nerio/adapters/table";

type Row = { name: string };
export type TableColumn = ColumnDef<Row>;
export const tableAdapter = { flexRender, getCoreRowModel, useReactTable };
