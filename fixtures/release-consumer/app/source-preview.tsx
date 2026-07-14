"use client";

import { Button } from "@/components/nerio/components/button";
import { Pagination } from "@/components/nerio/components/pagination";
import { Select } from "@/components/nerio/components/select";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/nerio/components/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/nerio/components/table";
import { ToastProvider, ToastViewport } from "@/components/nerio/components/toast";

export function SourcePreview() {
  return (
    <ToastProvider>
      <section aria-labelledby="source-preview-title">
        <h2 id="source-preview-title">Source-installed components</h2>
        <Button>Source action</Button>
        <Select
          label="Density"
          defaultValue="comfortable"
          options={[{ label: "Comfortable", value: "comfortable" }]}
        />
        <Sheet>
          <SheetTrigger>Open source sheet</SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Source sheet</SheetTitle>
              <SheetDescription>Installed through the CLI.</SheetDescription>
            </SheetHeader>
            <SheetBody>Source dependency chains compile outside the workspace.</SheetBody>
          </SheetContent>
        </Sheet>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Install</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Source</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Pagination aria-label="Source pages" pages={[{ key: "1", label: "1", current: true }]} />
      </section>
      <ToastViewport />
    </ToastProvider>
  );
}
