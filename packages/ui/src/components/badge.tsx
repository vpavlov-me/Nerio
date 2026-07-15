import * as React from "react";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { cn } from "../lib/cn";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

export type BadgeTone =
  "neutral" | "primary-soft" | "accent" | "info" | "success" | "warning" | "danger";
export type BadgeEmphasis = "soft" | "strong";
export type BadgeSize = "sm" | "md" | "lg";

/** @deprecated Use BadgeTone. `variant` remains as a compatibility alias for `tone`. */
export type BadgeVariant = "neutral" | "success" | "danger" | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Semantic meaning and color treatment. */
  tone?: BadgeTone;
  /** Controls whether the semantic tone uses a quiet or high-salience treatment. */
  emphasis?: BadgeEmphasis;
  /** Controls the compactness of the Badge. */
  size?: BadgeSize;
  /** @deprecated Use `tone`. This compatibility alias will be removed in the next major release. */
  variant?: BadgeVariant;
  /** @deprecated Use `leadingIcon`. This compatibility alias will be removed in the next major release. */
  icon?: IconComponent;
  /** Displays a decorative icon before the label through the Nerio icon adapter. */
  leadingIcon?: IconComponent;
  /** Displays a decorative icon after the label through the Nerio icon adapter. */
  trailingIcon?: IconComponent;
  /** Replaces the leading icon with a decorative Spinner and exposes aria-busy. */
  loading?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    children,
    className,
    emphasis = "soft",
    icon,
    leadingIcon,
    loading = false,
    size = "md",
    trailingIcon,
    tone,
    variant,
    ...props
  },
  ref,
) {
  const resolvedTone = tone ?? variant ?? "neutral";
  const resolvedLeadingIcon = leadingIcon ?? icon;

  return (
    <span
      ref={ref}
      className={cn("n-badge", className)}
      data-slot="root"
      data-tone={resolvedTone}
      data-emphasis={emphasis}
      data-loading={loading || undefined}
      data-size={size}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span data-slot="leading-icon" aria-hidden>
          <Spinner decorative size="sm" />
        </span>
      ) : resolvedLeadingIcon ? (
        <span data-slot="leading-icon" aria-hidden>
          <Icon icon={resolvedLeadingIcon} />
        </span>
      ) : null}
      <span data-slot="label">{children}</span>
      {trailingIcon ? (
        <span data-slot="trailing-icon" aria-hidden>
          <Icon icon={trailingIcon} />
        </span>
      ) : null}
    </span>
  );
});
