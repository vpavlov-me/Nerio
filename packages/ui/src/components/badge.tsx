import * as React from "react";
import { cn } from "../lib/cn";
import type { IconComponent } from "./icon";
import { Icon } from "./icon";

export type BadgeTone =
  "neutral" | "primary-soft" | "accent" | "info" | "success" | "warning" | "danger";

/** @deprecated Use BadgeTone. `variant` remains as a compatibility alias for `tone`. */
export type BadgeVariant = "neutral" | "success" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic meaning and color treatment. */
  tone?: BadgeTone;
  /** @deprecated Use `tone`. This compatibility alias will be removed in the next major release. */
  variant?: BadgeVariant;
  /** Displays a compact, decorative status dot before the label. */
  dot?: boolean;
  /** Displays a decorative leading icon through the Nerio icon adapter. */
  icon?: IconComponent;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, className, dot = false, icon, tone, variant, ...props },
  ref,
) {
  const resolvedTone = tone ?? variant ?? "neutral";

  return (
    <span
      ref={ref}
      className={cn("n-badge", className)}
      data-slot="root"
      data-tone={resolvedTone}
      {...props}
    >
      {dot ? <span data-slot="dot" aria-hidden /> : null}
      {icon ? (
        <span data-slot="icon" aria-hidden>
          <Icon icon={icon} />
        </span>
      ) : null}
      <span data-slot="label">{children}</span>
    </span>
  );
});
