import * as React from "react";
import { cn } from "../lib/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("n-skeleton", className)}
      data-slot="root"
      aria-hidden
      {...props}
    />
  );
});
