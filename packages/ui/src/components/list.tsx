import * as React from "react";
import { tailwindCn as cn } from "../lib/tailwind-cn";
import { composeRefs } from "../lib/compose-refs";

export type ListItem = {
  id: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  href?: string;
  linkProps?: ListLinkProps;
  /** Router link element. The canonical item href is forwarded to it. */
  render?: React.ReactElement<ListRenderProps>;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export type ListLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "children" | "className" | "href"
> & {
  className?: string;
};

type ListRenderProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  "data-slot"?: string;
};

export interface ListProps extends Omit<
  React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
  "children"
> {
  items: ListItem[];
  ordered?: boolean;
}

const listSurfaceClasses =
  "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-(--n-list-item-gap) rounded-(--n-list-item-radius) border-(length:--n-list-item-border-width) border-(--n-list-item-border) bg-(--n-list-item-background) p-(--n-list-item-padding) text-inherit no-underline [&:not(:has(>[data-slot=leading]))]:grid-cols-[minmax(0,1fr)_auto] [&:not(:has(>[data-slot=trailing]))]:grid-cols-[auto_minmax(0,1fr)] [&:not(:has(>[data-slot=leading])):not(:has(>[data-slot=trailing]))]:grid-cols-[minmax(0,1fr)] forced-colors:border-[CanvasText]";

export const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(function List(
  { className, items, ordered = false, ...props },
  ref,
) {
  const Root = ordered ? "ol" : "ul";
  const composedRef = React.useMemo(() => composeRefs(ref), [ref]);

  return (
    <Root
      ref={composedRef}
      {...props}
      className={cn(
        "n-list m-0 grid list-none gap-(--n-list-gap) p-0 [counter-reset:n-list] [&:is(ol)>[data-slot=item]]:grid [&:is(ol)>[data-slot=item]]:grid-cols-[auto_minmax(0,1fr)] [&:is(ol)>[data-slot=item]]:items-start [&:is(ol)>[data-slot=item]]:gap-(--n-list-item-gap) [&:is(ol)>[data-slot=item]]:[counter-increment:n-list] [&:is(ol)>[data-slot=item]::before]:py-(--n-list-item-padding) [&:is(ol)>[data-slot=item]::before]:text-(length:--n-font-size-sm) [&:is(ol)>[data-slot=item]::before]:font-(--n-font-weight-medium) [&:is(ol)>[data-slot=item]::before]:text-(--n-color-text-tertiary) [&:is(ol)>[data-slot=item]::before]:content-[counter(n-list)'.']",
        className,
      )}
      data-slot="root"
    >
      {items.map((item) => {
        const {
          className: linkClassName,
          href: _linkHref,
          ...linkProps
        } = (item.linkProps ?? {}) as React.AnchorHTMLAttributes<HTMLAnchorElement>;
        const body = (
          <>
            {item.leading ? (
              <div
                className="n-list__leading inline-flex min-h-(--n-switch-height) text-(--n-color-text-tertiary)"
                data-slot="leading"
              >
                {item.leading}
              </div>
            ) : null}
            <div className="n-list__content grid min-w-0 gap-(--n-space-1)" data-slot="content">
              <div
                className="n-list__title font-(--n-font-weight-medium) text-(--n-color-text-primary)"
                data-slot="title"
              >
                {item.title}
              </div>
              {item.description ? (
                <div
                  className="n-list__description text-(length:--n-font-size-sm) leading-(--n-line-height-normal) text-(--n-color-text-secondary)"
                  data-slot="description"
                >
                  {item.description}
                </div>
              ) : null}
            </div>
            {item.meta || item.trailing ? (
              <div
                className="n-list__trailing inline-flex min-h-(--n-switch-height) items-center justify-end gap-(--n-space-2) text-(--n-color-text-tertiary)"
                data-slot="trailing"
              >
                {item.meta ? (
                  <div
                    className="n-list__meta text-(length:--n-font-size-sm) leading-(--n-line-height-normal) text-(--n-color-text-secondary)"
                    data-slot="meta"
                  >
                    {item.meta}
                  </div>
                ) : null}
                {item.trailing}
              </div>
            ) : null}
          </>
        );

        return (
          <li className="n-list__item min-w-0" data-slot="item" key={item.id}>
            {item.href ? (
              item.render ? (
                React.cloneElement(
                  item.render,
                  {
                    ...linkProps,
                    className: cn(
                      "n-list__link",
                      listSurfaceClasses,
                      "hover:border-(--n-list-item-border-hover) hover:bg-(--n-list-item-background-hover) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) forced-colors:focus-visible:outline-(length:--n-focus-ring-inner-width) forced-colors:focus-visible:outline-offset-(--n-focus-ring-inner-width) forced-colors:focus-visible:outline-[Highlight]",
                      item.render.props.className,
                      linkClassName,
                    ),
                    "data-slot": "link",
                    href: item.href,
                  },
                  body,
                )
              ) : (
                <a
                  {...linkProps}
                  className={cn(
                    "n-list__link",
                    listSurfaceClasses,
                    "hover:border-(--n-list-item-border-hover) hover:bg-(--n-list-item-background-hover) focus-visible:outline-0 focus-visible:shadow-(--n-focus-ring) forced-colors:focus-visible:outline-(length:--n-focus-ring-inner-width) forced-colors:focus-visible:outline-offset-(--n-focus-ring-inner-width) forced-colors:focus-visible:outline-[Highlight]",
                    linkClassName,
                  )}
                  data-slot="link"
                  href={item.href}
                >
                  {body}
                </a>
              )
            ) : (
              <div className={cn("n-list__body", listSurfaceClasses)} data-slot="body">
                {body}
              </div>
            )}
          </li>
        );
      })}
    </Root>
  );
});
