import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { composeRefs } from "../lib/compose-refs";
import { Separator, type SeparatorProps } from "./separator";

export type ItemVariant = "plain" | "outline" | "soft";
export type ItemSize = "sm" | "md" | "lg";
export type ItemMediaVariant = "default" | "icon" | "image";

type RenderElementProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  "data-size"?: ItemSize;
  "data-slot"?: string;
  "data-variant"?: ItemVariant;
  ref?: React.Ref<HTMLElement>;
};

type ItemRootProps = Omit<React.HTMLAttributes<HTMLDivElement>, "className" | "data-slot"> & {
  className?: string;
  render?: React.ReactElement<RenderElementProps>;
};

export interface ItemProps extends ItemRootProps {
  variant?: ItemVariant;
  size?: ItemSize;
}

export type ItemGroupProps = ItemRootProps;
export type ItemHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemFooterProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemContentProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemActionsProps = React.HTMLAttributes<HTMLDivElement>;
export interface ItemMediaProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ItemMediaVariant;
}
export type ItemTitleProps = React.HTMLAttributes<HTMLDivElement>;
export type ItemDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const itemClasses =
  "n-item grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-(--n-item-gap) gap-y-(--n-item-row-gap) rounded-(--n-item-radius) border-(length:--n-item-border-width) border-transparent bg-(--n-item-background) p-(--n-item-padding) text-(--n-item-foreground) data-[variant=outline]:border-(--n-item-border) data-[variant=soft]:bg-(--n-item-background-soft) data-[size=sm]:[--n-item-padding:var(--n-item-padding-sm)] data-[size=sm]:[--n-item-gap:var(--n-item-actions-gap)] data-[size=lg]:[--n-item-padding:var(--n-item-padding-lg)] data-[size=lg]:[--n-item-gap:var(--n-item-gap-lg)] [&:is(a,button,[role=button]):not([aria-disabled=true]):not(:disabled)]:cursor-pointer [&:is(a,button,[role=button]):not([aria-disabled=true]):not(:disabled)]:no-underline [&:is(a,button,[role=button]):not([aria-disabled=true]):not(:disabled)]:transition-[background-color,border-color] [&:is(a,button,[role=button]):not([aria-disabled=true]):not(:disabled)]:duration-(--n-motion-hover-duration) [&:is(a,button,[role=button]):not([aria-disabled=true]):not(:disabled)]:ease-(--n-motion-hover-easing) [&:is(a,button,[role=button]):hover:not([aria-disabled=true]):not(:disabled)]:bg-(--n-item-background-hover) [&:is(a,button,[role=button]):active:not([aria-disabled=true]):not(:disabled)]:bg-(--n-item-background-active) [&:is(a,button,[role=button]):focus-visible]:outline-0 [&:is(a,button,[role=button]):focus-visible]:shadow-(--n-focus-ring) data-selected:bg-(--n-item-background-selected) data-selected:data-[variant=outline]:border-(--n-item-border-selected) aria-disabled:cursor-not-allowed aria-disabled:opacity-(--n-item-disabled-opacity) disabled:cursor-not-allowed disabled:opacity-(--n-item-disabled-opacity) data-loading:pointer-events-none motion-reduce:[&:is(a,button,[role=button])]:duration-(--n-duration-instant) forced-colors:data-[variant=outline]:border-[CanvasText] forced-colors:[&:is(a,button,[role=button]):focus-visible]:outline-(length:--n-focus-ring-inner-width) forced-colors:[&:is(a,button,[role=button]):focus-visible]:outline-offset-(--n-focus-ring-inner-width) forced-colors:[&:is(a,button,[role=button]):focus-visible]:outline-[Highlight]";

function renderRoot(
  render: React.ReactElement<RenderElementProps> | undefined,
  props: RenderElementProps,
  ref: React.Ref<HTMLElement> | undefined,
) {
  if (render) {
    return React.cloneElement(render, {
      ...props,
      className: cn(render.props.className, props.className),
      ref,
    });
  }

  return <div {...props} ref={ref as React.ForwardedRef<HTMLDivElement>} />;
}

export const Item = React.forwardRef<HTMLElement, ItemProps>(function Item(
  { className, render, size = "md", variant = "plain", ...props },
  ref,
) {
  const renderRef = render?.props.ref;
  const composedRef = React.useMemo(
    () => (renderRef && ref ? composeRefs(renderRef, ref) : (renderRef ?? ref ?? undefined)),
    [ref, renderRef],
  );

  return renderRoot(
    render,
    {
      ...props,
      className: cn(itemClasses, className),
      "data-size": size,
      "data-slot": "item",
      "data-variant": variant,
    },
    composedRef,
  );
});

export const ItemGroup = React.forwardRef<HTMLElement, ItemGroupProps>(function ItemGroup(
  { className, render, ...props },
  ref,
) {
  const renderRef = render?.props.ref;
  const composedRef = React.useMemo(
    () => (renderRef && ref ? composeRefs(renderRef, ref) : (renderRef ?? ref ?? undefined)),
    [ref, renderRef],
  );

  return renderRoot(
    render,
    {
      ...props,
      className: cn("n-item-group grid w-full gap-(--n-item-group-gap,0)", className),
      "data-slot": "item-group",
    },
    composedRef,
  );
});

export const ItemSeparator = React.forwardRef<HTMLHRElement, SeparatorProps>(function ItemSeparator(
  { "aria-hidden": ariaHidden, className, ...props },
  ref,
) {
  return (
    <Separator
      ref={ref}
      {...props}
      aria-hidden={ariaHidden ?? true}
      className={cn(
        "n-item__separator mx-(--n-item-padding) w-[calc(100%-(var(--n-item-padding)*2))]",
        className,
      )}
      data-slot="item-separator"
    />
  );
});

export const ItemMedia = React.forwardRef<HTMLDivElement, ItemMediaProps>(function ItemMedia(
  { className, variant = "default", ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-item__media col-start-1 min-w-0 shrink-0 data-[variant=icon]:inline-flex data-[variant=image]:inline-flex data-[variant=icon]:size-(--n-item-media-size-md) data-[variant=image]:size-(--n-item-media-size-md) data-[variant=icon]:items-center data-[variant=image]:items-center data-[variant=icon]:justify-center data-[variant=image]:justify-center data-[variant=icon]:overflow-hidden data-[variant=image]:overflow-hidden data-[variant=icon]:rounded-(--n-item-media-radius) data-[variant=image]:rounded-(--n-item-media-radius) data-[variant=icon]:bg-(--n-item-media-background) data-[variant=icon]:[&>:is(svg,.n-icon)]:size-(--n-item-media-icon-size) data-[variant=image]:[&>:is(img,picture,video)]:size-full data-[variant=image]:[&>:is(img,picture,video)]:object-cover [[data-size=sm]_&[data-variant=icon]]:size-(--n-item-media-size-sm) [[data-size=sm]_&[data-variant=image]]:size-(--n-item-media-size-sm) [[data-size=lg]_&[data-variant=icon]]:size-(--n-item-media-size-lg) [[data-size=lg]_&[data-variant=image]]:size-(--n-item-media-size-lg)",
        className,
      )}
      data-slot="item-media"
      data-variant={variant}
    />
  );
});

export const ItemContent = React.forwardRef<HTMLDivElement, ItemContentProps>(function ItemContent(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-item__content col-start-2 grid min-w-0 gap-(--n-item-content-gap)",
        className,
      )}
      data-slot="item-content"
    />
  );
});

export const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(function ItemTitle(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-item__title m-0 leading-(--n-line-height-tight) font-(--n-font-weight-medium) text-(--n-color-text-primary)",
        className,
      )}
      data-slot="item-title"
    />
  );
});

export const ItemDescription = React.forwardRef<HTMLParagraphElement, ItemDescriptionProps>(
  function ItemDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        {...props}
        className={cn(
          "n-item__description m-0 text-(length:--n-font-size-sm) leading-(--n-line-height-normal) text-(--n-item-description)",
          className,
        )}
        data-slot="item-description"
      />
    );
  },
);

export const ItemActions = React.forwardRef<HTMLDivElement, ItemActionsProps>(function ItemActions(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-item__actions col-start-3 inline-flex flex-wrap items-center justify-end gap-(--n-item-actions-gap) max-[30rem]:col-[2/-1]",
        className,
      )}
      data-slot="item-actions"
    />
  );
});

export const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(function ItemHeader(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-item__header col-[1/-1] min-w-0 text-(length:--n-font-size-sm) text-(--n-color-text-tertiary)",
        className,
      )}
      data-slot="item-header"
    />
  );
});

export const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(function ItemFooter(
  { className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "n-item__footer col-[1/-1] min-w-0 text-(length:--n-font-size-sm) text-(--n-color-text-secondary)",
        className,
      )}
      data-slot="item-footer"
    />
  );
});
