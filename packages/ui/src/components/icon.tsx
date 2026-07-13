import * as React from "react";
import type { IconComponent, IconSvgProps } from "@nerio/adapters";
import { cn } from "../lib/cn";

export type { IconComponent, IconSvgProps } from "@nerio/adapters";

type IconBaseProps = Omit<
  IconSvgProps,
  "aria-hidden" | "aria-label" | "children" | "className" | "role"
> & {
  icon: IconComponent;
  className?: string;
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

export function Icon({
  absoluteStrokeWidth = true,
  decorative = true,
  icon: IconGraphic,
  className,
  label,
  strokeWidth = 2,
  ...props
}: IconProps) {
  return (
    <IconGraphic
      className={cn("n-icon", className)}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
      absoluteStrokeWidth={absoluteStrokeWidth}
      focusable={decorative ? false : undefined}
      role={decorative ? undefined : "img"}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
}
