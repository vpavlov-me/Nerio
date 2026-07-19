import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { motionClasses } from "../lib/motion";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-skeleton min-h-(--n-skeleton-height) rounded-(--n-radius-md) bg-(--n-color-surface-muted)",
        motionClasses.skeleton,
        className,
      )}
      data-slot="skeleton"
      aria-hidden
    />
  );
});
