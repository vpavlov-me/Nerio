import * as React from "react";
import type { IconComponent } from "@nerio-ui/adapters/icons";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { Icon } from "./icon";
import { Spinner } from "./spinner";

export type BadgeTone =
  "neutral" | "primary-soft" | "accent" | "info" | "success" | "warning" | "danger";
export type BadgeEmphasis = "soft" | "strong";
export type BadgeSize = "sm" | "md" | "lg";

/** @deprecated Use BadgeTone. `variant` remains as a compatibility alias for `tone`. */
export type BadgeVariant = "neutral" | "success" | "danger" | "info";

const badgeClasses =
  "n-badge inline-flex min-h-(--n-badge-height) items-center justify-self-start gap-(--n-badge-gap) rounded-(--n-badge-radius) border-(length:--n-badge-border-width) border-(--n-badge-border) bg-(--n-badge-background) px-(--n-badge-padding-inline) text-(length:--n-badge-font-size) font-(--n-font-weight-medium) text-(--n-badge-foreground) data-[size=sm]:[--n-badge-font-size:var(--n-badge-font-size-sm)] data-[size=sm]:[--n-badge-gap:var(--n-badge-gap-sm)] data-[size=sm]:[--n-badge-height:var(--n-badge-height-sm)] data-[size=sm]:[--n-badge-icon-size:var(--n-badge-icon-size-sm)] data-[size=sm]:[--n-badge-padding-inline:var(--n-badge-padding-inline-sm)] data-[size=lg]:[--n-badge-font-size:var(--n-badge-font-size-lg)] data-[size=lg]:[--n-badge-gap:var(--n-badge-gap-lg)] data-[size=lg]:[--n-badge-height:var(--n-badge-height-lg)] data-[size=lg]:[--n-badge-icon-size:var(--n-badge-icon-size-lg)] data-[size=lg]:[--n-badge-padding-inline:var(--n-badge-padding-inline-lg)] data-[tone=primary-soft]:[--n-badge-background:var(--n-badge-background-primary-soft)] data-[tone=primary-soft]:[--n-badge-foreground:var(--n-badge-foreground-primary-soft)] data-[tone=accent]:[--n-badge-background:var(--n-badge-background-accent)] data-[tone=accent]:[--n-badge-foreground:var(--n-badge-foreground-accent)] data-[tone=info]:[--n-badge-background:var(--n-badge-background-info)] data-[tone=info]:[--n-badge-foreground:var(--n-badge-foreground-info)] data-[tone=success]:[--n-badge-background:var(--n-badge-background-success)] data-[tone=success]:[--n-badge-foreground:var(--n-badge-foreground-success)] data-[tone=warning]:[--n-badge-background:var(--n-badge-background-warning)] data-[tone=warning]:[--n-badge-foreground:var(--n-badge-foreground-warning)] data-[tone=danger]:[--n-badge-background:var(--n-badge-background-danger)] data-[tone=danger]:[--n-badge-foreground:var(--n-badge-foreground-danger)] data-[emphasis=strong]:[--n-badge-background:var(--n-badge-background-strong)] data-[emphasis=strong]:[--n-badge-foreground:var(--n-badge-foreground-strong)] data-[emphasis=strong]:data-[tone=primary-soft]:[--n-badge-background:var(--n-badge-background-strong-primary)] data-[emphasis=strong]:data-[tone=accent]:[--n-badge-background:var(--n-badge-background-strong-primary)] data-[emphasis=strong]:data-[tone=info]:[--n-badge-background:var(--n-badge-background-strong-info)] data-[emphasis=strong]:data-[tone=success]:[--n-badge-background:var(--n-badge-background-strong-success)] data-[emphasis=strong]:data-[tone=warning]:[--n-badge-background:var(--n-badge-background-strong-warning)] data-[emphasis=strong]:data-[tone=danger]:[--n-badge-background:var(--n-badge-background-strong-danger)] [&_[data-slot=leading-icon]]:inline-flex [&_[data-slot=leading-icon]]:shrink-0 [&_[data-slot=leading-icon]]:text-(length:--n-badge-icon-size) [&_[data-slot=trailing-icon]]:inline-flex [&_[data-slot=trailing-icon]]:shrink-0 [&_[data-slot=trailing-icon]]:text-(length:--n-badge-icon-size) [&_[data-slot=label]]:min-w-0 [&_[data-slot=label]]:overflow-hidden [&_[data-slot=label]]:text-ellipsis [&_[data-slot=label]]:whitespace-nowrap";

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
      {...props}
      className={cn(badgeClasses, className)}
      data-slot="root"
      data-tone={resolvedTone}
      data-emphasis={emphasis}
      data-loading={loading || undefined}
      data-size={size}
      aria-busy={loading || undefined}
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
