import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";

const cardClasses =
  "n-card grid gap-(--n-card-gap) overflow-hidden rounded-(--n-card-radius) border-(length:--n-card-border-width) border-(--n-card-border-color) bg-(--n-card-background) px-(--n-card-padding-inline) py-(--n-card-padding-block) shadow-(--n-card-shadow) data-[variant=secondary]:border-(--n-card-border-secondary) data-[variant=secondary]:bg-(--n-card-background-secondary) data-[variant=secondary]:shadow-(--n-card-shadow-secondary) [&:is(a)]:cursor-pointer [&:is(a)]:text-inherit [&:is(a)]:no-underline [&:is(a)]:transition-[background-color,border-color,box-shadow] [&:is(a)]:duration-(--n-motion-hover-duration) [&:is(a)]:ease-(--n-motion-hover-easing) [&:is(a):hover]:border-(--n-card-border-interactive) [&:is(a):hover:not([data-variant=secondary])]:bg-(--n-card-background-interactive-hover) [&:is(a):hover[data-variant=secondary]]:bg-(--n-card-background-secondary-hover) [&:is(a):focus-visible]:duration-(--n-motion-focus-duration) [&:is(a):focus-visible]:ease-(--n-motion-focus-easing) [&:is(a):focus-visible]:outline-0 [&:is(a):focus-visible]:shadow-(--n-focus-ring) motion-reduce:[&:is(a)]:duration-(--n-duration-instant) [&>:is(h1,h2,h3,h4,h5,h6,p)]:m-0 forced-colors:border-[CanvasText] forced-colors:[&:is(a):focus-visible]:outline-(length:--n-focus-ring-inner-width) forced-colors:[&:is(a):focus-visible]:outline-offset-(--n-focus-ring-inner-width) forced-colors:[&:is(a):focus-visible]:outline-[Highlight]";

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
export type CardActionProps = CardSectionProps;
export type CardVisualPlacement = "inset" | "bleed";
export interface CardVisualProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?: CardVisualPlacement;
}
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
        className={cn(cardClasses, className)}
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
      className={cn(cardClasses, className)}
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
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-card__header grid min-w-0 gap-(--n-card-section-gap) has-[>[data-slot=card-action]]:grid-cols-[minmax(0,1fr)_auto] has-[>[data-slot=card-action]]:items-start max-[30rem]:has-[>[data-slot=card-action]]:grid-cols-[minmax(0,1fr)]",
        className,
      )}
      data-slot="card-header"
    />
  );
});

export const CardVisual = React.forwardRef<HTMLDivElement, CardVisualProps>(function CardVisual(
  { className, placement = "inset", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-card__visual min-w-0 data-[placement=bleed]:mx-[calc(var(--n-card-padding-inline)*-1)] data-[placement=bleed]:first:mt-[calc(var(--n-card-padding-block)*-1)] data-[placement=bleed]:last:mb-[calc(var(--n-card-padding-block)*-1)]",
        className,
      )}
      data-slot="card-visual"
      data-placement={placement}
    />
  );
});

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(function CardTitle(
  { as: Component = "h3", className, ...props },
  ref,
) {
  return (
    <Component
      ref={ref as React.Ref<never>}
      {...props}
      className={cn(
        "n-card__title m-0 text-(length:--n-font-size-md) leading-(--n-line-height-tight) font-(--n-font-weight-medium) text-(--n-color-text-primary)",
        className,
      )}
      data-slot="card-title"
    />
  );
});

export const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        {...props}
        className={cn(
          "n-card__description m-0 text-(length:--n-font-size-sm) leading-(--n-line-height-normal) text-(--n-color-text-secondary)",
          className,
        )}
        data-slot="card-description"
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
      {...props}
      className={cn("n-card__content grid min-w-0 gap-(--n-card-section-gap)", className)}
      data-slot="card-content"
    />
  );
});

export const CardFooter = React.forwardRef<HTMLDivElement, CardSectionProps>(function CardFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-card__footer flex min-w-0 flex-wrap items-center justify-start gap-(--n-card-section-gap)",
        className,
      )}
      data-slot="card-footer"
    />
  );
});

export const CardAction = React.forwardRef<HTMLDivElement, CardSectionProps>(function CardAction(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn("n-card__action self-start", className)}
      data-slot="card-action"
    />
  );
});
