import * as React from "react";
import { cn } from "../lib/cn";

export type IconComponent = React.ElementType<{
  className?: string;
  "aria-hidden"?: boolean;
  strokeWidth?: number;
  absoluteStrokeWidth?: boolean;
}>;

export interface IconProps {
  icon: IconComponent;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ icon: IconGraphic, className, strokeWidth = 2 }: IconProps) {
  return (
    <IconGraphic
      aria-hidden
      absoluteStrokeWidth
      className={cn("n-icon", className)}
      strokeWidth={strokeWidth}
    />
  );
}
