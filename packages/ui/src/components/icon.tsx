import * as React from "react";
import { cn } from "../lib/cn";

export type IconComponent = React.ElementType<{
  className?: string;
  "aria-hidden"?: boolean;
}>;

export interface IconProps {
  icon: IconComponent;
  className?: string;
}

export function Icon({ icon: IconGraphic, className }: IconProps) {
  return <IconGraphic aria-hidden className={cn("n-icon", className)} />;
}
