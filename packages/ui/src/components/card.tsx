import * as React from "react";
import { cn } from "../lib/cn";

export type CardElement = "section" | "article" | "div";
export type CardVariant = "default" | "secondary";
type CardSharedProps = {
  className?: string;
  children?: React.ReactNode;
  variant?: CardVariant;
};
type CardSurfaceProps = CardSharedProps &
  Omit<React.HTMLAttributes<HTMLElement>, "className" | "data-slot" | "data-variant"> & {
    as?: CardElement;
    href?: never;
  };
type CardLinkProps = CardSharedProps &
  Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "data-slot" | "data-variant" | "href"
  > & {
    href: string;
    as?: never;
  };
export type CardProps = CardSurfaceProps | CardLinkProps;
export type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleElement = "h2" | "h3" | "h4" | "h5" | "h6";
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: CardTitleElement;
}
export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { className, variant = "default", ...props },
  ref,
) {
  const isLink = "href" in props && typeof props.href === "string";

  if (isLink) {
    const { as: _as, ...linkProps } = props as CardLinkProps;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        {...linkProps}
        className={cn("n-card", className)}
        data-slot="card"
        data-variant={variant}
      />
    );
  }

  const { as: Component = "section", ...surfaceProps } = props as CardSurfaceProps;
  return (
    <Component
      ref={ref as React.Ref<never>}
      {...surfaceProps}
      className={cn("n-card", className)}
      data-slot="card"
      data-variant={variant}
    />
  );
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
