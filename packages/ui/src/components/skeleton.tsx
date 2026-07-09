import * as React from "react";
import { cn } from "../lib/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("n-skeleton", className)} data-slot="root" aria-hidden {...props} />;
}
