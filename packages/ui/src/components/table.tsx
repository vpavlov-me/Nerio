import * as React from "react";
import { cn } from "../lib/cn";

export type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

export function Table({ className, ...props }: TableProps) {
  return <table className={cn("n-table", className)} data-slot="root" {...props} />;
}
