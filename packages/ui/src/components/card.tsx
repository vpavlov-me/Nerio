import * as React from "react";
import { cn } from "../lib/cn";

export type CardElement = "section" | "article" | "div";
export type CardVariant = "default" | "secondary";
export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: CardElement;
  href?: string;
  target?: string;
  rel?: string;
  variant?: CardVariant;
}
export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleElement = "h2" | "h3" | "h4" | "h5" | "h6";
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: CardTitleElement;
}
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { as: Component = "section", className, href, target, rel, variant = "default", ...props },
  ref,
) {
  const cardProps = {
    className: cn("n-card", className),
    "data-slot": "card",
    "data-variant": variant,
    ...props,
  };

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        {...cardProps}
      />
    );
  }

  return <Component ref={ref as React.Ref<never>} {...cardProps} />;
});

export const CardHeader = React.forwardRef<HTMLDivElement, CardSectionProps>(function CardHeader(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("n-card__header", className)} data-slot="card-header" {...props} />
  );
});

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Component = "h3", className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref as React.Ref<never>}
      className={cn("n-card__title", className)}
      data-slot="card-title"
      {...props}
    />
  );
});

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        className={cn("n-card__description", className)}
        data-slot="card-description"
        {...props}
      />
    );
  },
);

export const CardContent = React.forwardRef<HTMLDivElement, CardSectionProps>(function CardContent(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn("n-card__content", className)}
      data-slot="card-content"
      {...props}
    />
  );
});

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} className={cn("n-card__footer", className)} data-slot="card-footer" {...props} />
  );
});
