import * as React from "react";
import { cn } from "../lib/cn";
import { motionClasses } from "../lib/motion";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("n-skeleton", motionClasses.skeleton, className)}
      data-slot="skeleton"
      aria-hidden
      {...props}
    />
  );
});
