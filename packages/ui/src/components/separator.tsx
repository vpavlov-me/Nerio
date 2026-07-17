import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

export type SeparatorProps = React.HTMLAttributes<HTMLHRElement>;

export const Separator = React.forwardRef<HTMLHRElement, SeparatorProps>(function Separator(
  { className, ...props },
  ref,
) {
  return (
    <hr
      ref={ref}
      className={cn(
        "n-separator m-0 border-0 [border-block-start:var(--n-border-subtle)]",
        className,
      )}
      data-slot="root"
      {...props}
    />
  );
});
