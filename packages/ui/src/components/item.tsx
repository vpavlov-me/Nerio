import * as React from "react";
import { cn } from "../lib/cn";
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
      className: cn("n-item", className),
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
    { ...props, className: cn("n-item-group", className), "data-slot": "item-group" },
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
      className={cn("n-item__separator", className)}
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
      className={cn("n-item__media", className)}
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
      className={cn("n-item__content", className)}
      data-slot="item-content"
    />
  );
});

export const ItemTitle = React.forwardRef<HTMLDivElement, ItemTitleProps>(function ItemTitle(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} {...props} className={cn("n-item__title", className)} data-slot="item-title" />
  );
});

export const ItemDescription = React.forwardRef<HTMLParagraphElement, ItemDescriptionProps>(
  function ItemDescription({ className, ...props }, ref) {
    return (
      <p
        ref={ref}
        {...props}
        className={cn("n-item__description", className)}
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
      className={cn("n-item__actions", className)}
      data-slot="item-actions"
    />
  );
});

export const ItemHeader = React.forwardRef<HTMLDivElement, ItemHeaderProps>(function ItemHeader(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} {...props} className={cn("n-item__header", className)} data-slot="item-header" />
  );
});

export const ItemFooter = React.forwardRef<HTMLDivElement, ItemFooterProps>(function ItemFooter(
  { className, ...props },
  ref,
) {
  return (
    <div ref={ref} {...props} className={cn("n-item__footer", className)} data-slot="item-footer" />
  );
});
