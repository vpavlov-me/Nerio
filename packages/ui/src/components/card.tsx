import * as React from "react";
import { cn } from "../lib/cn";

export type CardProps = React.HTMLAttributes<HTMLElement>;
export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { className, ...props },
  ref,
) {
  return <section ref={ref} className={cn("n-card", className)} data-slot="card" {...props} />;
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
  { className, ...props },
  ref,
) {
  return (
    <h3 ref={ref} className={cn("n-card__title", className)} data-slot="card-title" {...props} />
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
