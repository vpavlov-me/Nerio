import * as React from "react";
import { cn } from "../lib/cn";

export type LinkVariant = "default" | "muted";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LinkVariant;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn("n-link", className)}
      data-slot="root"
      data-variant={variant}
      {...props}
    />
  );
});
