import * as React from "react";
import { cn } from "../lib/cn";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return <section className={cn("n-card", className)} data-slot="root" {...props} />;
}
