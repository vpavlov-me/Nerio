import * as React from "react";
import { cn } from "../lib/cn";

export type ListItem = {
  id: React.Key;
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  href?: string;
  linkProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
};

export interface ListProps extends Omit<
  React.HTMLAttributes<HTMLUListElement | HTMLOListElement>,
  "children"
> {
  items: ListItem[];
  ordered?: boolean;
}

export const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(function List(
  { className, items, ordered = false, ...props },
  ref,
) {
  const Root = ordered ? "ol" : "ul";
  const setRef = (node: HTMLUListElement | HTMLOListElement | null) => {
    if (typeof ref === "function") {
      ref(node);
      return;
    }

    if (ref) {
      ref.current = node;
    }
  };

  return (
    <Root ref={setRef} className={cn("n-list", className)} data-slot="root" {...props}>
      {items.map((item) => {
        const body = (
          <>
            {item.leading ? (
              <div className="n-list__leading" data-slot="leading">
                {item.leading}
              </div>
            ) : null}
            <div className="n-list__content" data-slot="content">
              <div className="n-list__title" data-slot="title">
                {item.title}
              </div>
              {item.description ? (
                <div className="n-list__description" data-slot="description">
                  {item.description}
                </div>
              ) : null}
            </div>
            {item.meta || item.trailing ? (
              <div className="n-list__trailing" data-slot="trailing">
                {item.meta ? (
                  <div className="n-list__meta" data-slot="meta">
                    {item.meta}
                  </div>
                ) : null}
                {item.trailing}
              </div>
            ) : null}
          </>
        );

        return (
          <li className="n-list__item" data-slot="item" key={item.id}>
            {item.href ? (
              <a className="n-list__link" data-slot="link" href={item.href} {...item.linkProps}>
                {body}
              </a>
            ) : (
              <div className="n-list__body" data-slot="body">
                {body}
              </div>
            )}
          </li>
        );
      })}
    </Root>
  );
});
