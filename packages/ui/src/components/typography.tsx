import * as React from "react";
import { cn } from "../lib/cn";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  size?: HeadingSize;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { as: Component = "h2", className, size = "md", ...props },
  ref,
) {
  return <Component ref={ref} className={cn("n-heading", className)} data-size={size} {...props} />;
});

export type TextTone = "default" | "secondary" | "tertiary";
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: TextTone;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { className, tone = "default", ...props },
  ref,
) {
  return <p ref={ref} className={cn("n-text", className)} data-tone={tone} {...props} />;
});

export type CodeProps = React.HTMLAttributes<HTMLElement>;

export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  { className, ...props },
  ref,
) {
  return <code ref={ref} className={cn("n-code", className)} data-slot="root" {...props} />;
});
