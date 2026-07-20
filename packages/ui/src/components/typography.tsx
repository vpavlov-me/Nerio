import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const headingClasses =
  "n-heading m-0 font-(--n-font-weight-medium) leading-(--n-line-height-tight) text-(--n-color-text-primary) data-[size=xs]:text-(length:--n-font-size-sm) data-[size=sm]:text-(length:--n-font-size-base) data-[size=md]:text-(length:--n-font-size-lg) data-[size=lg]:text-(length:--n-font-size-xl) data-[size=xl]:text-(length:--n-font-size-2xl) data-[size=2xl]:text-(length:--n-font-size-3xl)";

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
  return (
    <Component
      ref={ref}
      {...props}
      className={cn(headingClasses, className)}
      data-size={size}
      data-slot="heading"
    />
  );
});

export type TextTone = "default" | "secondary" | "tertiary";
export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: TextTone;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(function Text(
  { className, tone = "default", ...props },
  ref,
) {
  return (
    <p
      ref={ref}
      {...props}
      className={cn(
        "n-text m-0 text-(length:--n-font-size-base) leading-(--n-line-height-normal) text-(--n-color-text-primary) data-[tone=secondary]:text-(--n-color-text-secondary) data-[tone=tertiary]:text-(--n-color-text-tertiary)",
        className,
      )}
      data-tone={tone}
      data-slot="text"
    />
  );
});

export type CodeProps = React.HTMLAttributes<HTMLElement>;

export const Code = React.forwardRef<HTMLElement, CodeProps>(function Code(
  { className, ...props },
  ref,
) {
  return (
    <code
      ref={ref}
      {...props}
      className={cn(
        "n-code m-0 rounded-(--n-radius-sm) bg-(--n-color-surface-muted) px-(--n-space-1) py-(--n-space-0-5) font-(family-name:--n-font-mono) text-(length:--n-font-size-sm) text-(--n-color-text-primary)",
        className,
      )}
      data-slot="code"
    />
  );
});
