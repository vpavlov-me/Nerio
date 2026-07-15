import * as React from "react";
import type { IconComponent, IconSvgProps, LucideIconProps } from "@nerio-ui/adapters/icons";
import { cn } from "../lib/cn";

export type { IconComponent, IconSvgProps, LucideIconProps } from "@nerio-ui/adapters/icons";

type IconBaseProps = Omit<
  IconSvgProps,
  "aria-hidden" | "aria-label" | "children" | "className" | "focusable" | "role" | "tabIndex"
> & {
  icon: IconComponent;
  className?: string;
  /** Enables Lucide's fixed-stroke behavior without adding it to generic SVG props. */
  lucideAbsoluteStrokeWidth?: boolean;
  /** @deprecated Use lucideAbsoluteStrokeWidth. Removed in the next major version. */
  absoluteStrokeWidth?: boolean;
};

type DecorativeIconProps = {
  /** Icons are decorative by default when a surrounding control or label names their meaning. */
  decorative?: true;
  label?: never;
};

type MeaningfulIconProps = {
  /** Standalone meaningful icons require a concise accessible name. */
  decorative: false;
  label: string;
};

export type IconProps = IconBaseProps & (DecorativeIconProps | MeaningfulIconProps);

type ProtectedRuntimeIconProps = {
  "aria-hidden"?: React.AriaAttributes["aria-hidden"];
  "aria-label"?: string;
  focusable?: React.SVGProps<SVGSVGElement>["focusable"];
  role?: React.AriaRole;
  tabIndex?: number;
};

export function Icon(inputProps: IconProps) {
  const {
    absoluteStrokeWidth,
    decorative = true,
    icon: IconGraphic,
    className,
    label,
    lucideAbsoluteStrokeWidth,
    strokeWidth = 2,
    "aria-hidden": _ariaHidden,
    "aria-label": _ariaLabel,
    focusable: _focusable,
    role: _role,
    tabIndex: _tabIndex,
    ...props
  } = inputProps as IconProps & ProtectedRuntimeIconProps;

  if (!decorative && (typeof label !== "string" || !label.trim())) {
    throw new Error("Meaningful Icon requires a non-empty label.");
  }

  const resolvedAbsoluteStrokeWidth = lucideAbsoluteStrokeWidth ?? absoluteStrokeWidth;
  const svgProps: LucideIconProps = {
    ...props,
    strokeWidth,
  };

  if (resolvedAbsoluteStrokeWidth !== undefined) {
    svgProps.absoluteStrokeWidth = resolvedAbsoluteStrokeWidth;
  }

  return (
    <IconGraphic
      {...svgProps}
      className={cn("n-icon", className)}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      focusable={false}
      role={decorative ? undefined : "img"}
    />
  );
}
